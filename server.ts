import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  increment
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase for server-side persistence
const firebaseApp = initializeApp(firebaseConfig, 'SERVER_INSTANCE');
const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// In-memory caching/fallback store for instantaneous low-latency responses
interface MemoryChallenge {
  id: string;
  creatorName: string;
  questions: any[];
  durationHours: 24 | 48;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired';
  totalAttempts: number;
}

interface MemorySecret {
  challengeId: string;
  correctOptionIndices: number[];
  creatorKey: string;
  createdAt: string;
}

interface MemoryAttempt {
  id: string;
  challengeId: string;
  friendName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  resultCategory: string;
  submittedAt: string;
  answersBreakdown?: any[];
}

const memoryChallenges = new Map<string, MemoryChallenge>();
const memorySecrets = new Map<string, MemorySecret>();
const memoryAttempts = new Map<string, MemoryAttempt[]>();
const recentSubmissionRateMap = new Map<string, number>();

const RESULT_MESSAGES: Record<number, { category: string; message: string }> = {
  0: {
    category: 'Are you even friends? 💀',
    message: 'Literally 0/5. Did you confuse them with a stranger at the bus stop? Tragic.'
  },
  1: {
    category: 'Are you even friends? 💀',
    message: '1/5. That one correct point was probably a blind lucky guess. Unfriend incoming.'
  },
  2: {
    category: 'Friendship under investigation 👀',
    message: '2/5. You know their face, but their personality remains an absolute enigma to you.'
  },
  3: {
    category: 'Friendship under investigation 👀',
    message: '3/5. Passing grade, but barely. You survive the group chat cut for now.'
  },
  4: {
    category: 'Okay, you actually know them! 💅',
    message: '4/5. High-tier bestie status! You actually listen when they rant.'
  },
  5: {
    category: 'BESTIE MATERIAL. LEGENDARY! 🏆',
    message: '5/5 PERFECT SCORE! Certified soulmate energy. Protect this friendship forever!'
  }
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'FRND FOBIA Backend',
      firebaseProject: firebaseConfig.projectId,
      timestamp: new Date().toISOString()
    });
  });

  // POST /api/challenges: Create a challenge and separate secret answer key
  app.post('/api/challenges', async (req, res) => {
    try {
      const { creatorName, questions, correctOptionIndices, durationHours = 24 } = req.body;

      if (!creatorName || typeof creatorName !== 'string' || creatorName.trim().length === 0) {
        return res.status(400).json({ error: 'Creator nickname is required (1-50 characters).' });
      }

      if (!Array.isArray(questions) || questions.length !== 5) {
        return res.status(400).json({ error: 'Exactly 5 questions must be selected.' });
      }

      if (!Array.isArray(correctOptionIndices) || correctOptionIndices.length !== 5) {
        return res.status(400).json({ error: 'Answers for all 5 questions are required.' });
      }

      const validDuration = durationHours === 48 ? 48 : 24;
      const challengeId = 'ch_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
      const creatorKey = 'key_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + validDuration * 3600 * 1000).toISOString();
      const createdAt = now.toISOString();

      // Clean questions without any answer keys
      const sanitizedQuestions = questions.map((q: any, idx: number) => ({
        id: q.id || `q_${idx + 1}`,
        text: String(q.text || `Question ${idx + 1}`),
        options: Array.isArray(q.options) && q.options.length === 4
          ? [String(q.options[0]), String(q.options[1]), String(q.options[2]), String(q.options[3])]
          : ['Option 1', 'Option 2', 'Option 3', 'Option 4']
      }));

      const publicChallenge: MemoryChallenge = {
        id: challengeId,
        creatorName: creatorName.trim().slice(0, 50),
        questions: sanitizedQuestions,
        durationHours: validDuration,
        createdAt,
        expiresAt,
        status: 'active',
        totalAttempts: 0
      };

      const secretData: MemorySecret = {
        challengeId,
        correctOptionIndices: correctOptionIndices.map((i: any) => Math.min(3, Math.max(0, Number(i) || 0))),
        creatorKey,
        createdAt
      };

      // Save to in-memory fallback
      memoryChallenges.set(challengeId, publicChallenge);
      memorySecrets.set(challengeId, secretData);
      memoryAttempts.set(challengeId, []);

      // Persist to Firestore
      try {
        const challengeDocRef = doc(firestoreDb, 'challenges', challengeId);
        await setDoc(challengeDocRef, publicChallenge);

        const secretDocRef = doc(firestoreDb, 'challenges', challengeId, 'secret', 'answers');
        await setDoc(secretDocRef, secretData);
      } catch (firestoreErr) {
        console.warn('Firestore write notice (in-memory copy active):', firestoreErr);
      }

      return res.status(201).json({
        success: true,
        challengeId,
        creatorKey,
        expiresAt,
        challenge: publicChallenge
      });
    } catch (err: any) {
      console.error('Error in POST /api/challenges:', err);
      return res.status(500).json({ error: 'Failed to create challenge. Please try again.' });
    }
  });

  // GET /api/challenges/:id: Retrieve public challenge (answers strictly withheld)
  app.get('/api/challenges/:id', async (req, res) => {
    try {
      const { id } = req.params;

      let challenge = memoryChallenges.get(id);

      // If not in memory, query Firestore
      if (!challenge) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'challenges', id));
          if (snap.exists()) {
            challenge = snap.data() as MemoryChallenge;
            memoryChallenges.set(id, challenge);
          }
        } catch (dbErr) {
          console.warn('Firestore read notice:', dbErr);
        }
      }

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found or link has expired.' });
      }

      // Check expiration
      const now = new Date();
      const expiresAt = new Date(challenge.expiresAt);
      if (now > expiresAt && challenge.status !== 'expired') {
        challenge.status = 'expired';
        try {
          await updateDoc(doc(firestoreDb, 'challenges', id), { status: 'expired' });
        } catch {
          // ignore
        }
      }

      // Return public challenge metadata
      return res.json({
        success: true,
        challenge: {
          id: challenge.id,
          creatorName: challenge.creatorName,
          questions: challenge.questions,
          durationHours: challenge.durationHours,
          createdAt: challenge.createdAt,
          expiresAt: challenge.expiresAt,
          status: challenge.status,
          totalAttempts: challenge.totalAttempts || 0
        }
      });
    } catch (err: any) {
      console.error('Error in GET /api/challenges/:id:', err);
      return res.status(500).json({ error: 'Failed to fetch challenge.' });
    }
  });

  // POST /api/challenges/:id/submit: Score quiz server-side without leaking answers
  app.post('/api/challenges/:id/submit', async (req, res) => {
    try {
      const { id } = req.params;
      const { friendName, selectedAnswers } = req.body;

      if (!friendName || typeof friendName !== 'string' || friendName.trim().length === 0) {
        return res.status(400).json({ error: 'Please enter your name or nickname.' });
      }

      if (!Array.isArray(selectedAnswers) || selectedAnswers.length !== 5) {
        return res.status(400).json({ error: 'Please answer all 5 questions before submitting.' });
      }

      // Duplicate / Spam Protection check: prevent rapid submissions with same nickname
      const rateLimitKey = `${id}:${friendName.trim().toLowerCase()}`;
      const lastSubTime = recentSubmissionRateMap.get(rateLimitKey);
      if (lastSubTime && Date.now() - lastSubTime < 60 * 1000) {
        return res.status(429).json({
          error: 'You just submitted this challenge! Please wait a moment or try another nickname.'
        });
      }
      recentSubmissionRateMap.set(rateLimitKey, Date.now());

      // Fetch challenge
      let challenge = memoryChallenges.get(id);
      if (!challenge) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'challenges', id));
          if (snap.exists()) {
            challenge = snap.data() as MemoryChallenge;
            memoryChallenges.set(id, challenge);
          }
        } catch {
          // ignore
        }
      }

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found.' });
      }

      if (new Date() > new Date(challenge.expiresAt) || challenge.status === 'expired') {
        return res.status(400).json({ error: 'This challenge has already expired! You can create your own instead.' });
      }

      // Fetch secret answers (isolated)
      let secret = memorySecrets.get(id);
      if (!secret) {
        try {
          const secretSnap = await getDoc(doc(firestoreDb, 'challenges', id, 'secret', 'answers'));
          if (secretSnap.exists()) {
            secret = secretSnap.data() as MemorySecret;
            memorySecrets.set(id, secret);
          }
        } catch {
          // ignore
        }
      }

      if (!secret) {
        return res.status(500).json({ error: 'Server error: unable to verify challenge secret keys.' });
      }

      // Calculate score on the server
      let score = 0;
      const answersBreakdown = [];
      const correctIndices = secret.correctOptionIndices;

      for (let i = 0; i < 5; i++) {
        const chosenIdx = Number(selectedAnswers[i]);
        const correctIdx = correctIndices[i];
        const isCorrect = chosenIdx === correctIdx;
        if (isCorrect) score++;

        const q = challenge.questions[i];
        const chosenText = (q && q.options && q.options[chosenIdx]) || `Option ${chosenIdx + 1}`;

        answersBreakdown.push({
          questionId: q?.id || `q_${i + 1}`,
          questionText: q?.text || `Question ${i + 1}`,
          friendSelectedOption: chosenText,
          isCorrect
        });
      }

      const percentage = Math.round((score / 5) * 100);
      const resultData = RESULT_MESSAGES[score] || RESULT_MESSAGES[0];
      const attemptId = 'att_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
      const submittedAt = new Date().toISOString();

      const attemptRecord: MemoryAttempt = {
        id: attemptId,
        challengeId: id,
        friendName: friendName.trim().slice(0, 50),
        score,
        totalQuestions: 5,
        percentage,
        resultCategory: resultData.category,
        submittedAt,
        answersBreakdown
      };

      // Store attempt in memory
      const attemptsList = memoryAttempts.get(id) || [];
      attemptsList.unshift(attemptRecord);
      memoryAttempts.set(id, attemptsList);

      challenge.totalAttempts = (challenge.totalAttempts || 0) + 1;

      // Persist to Firestore
      try {
        await setDoc(doc(firestoreDb, 'challenges', id, 'attempts', attemptId), {
          id: attemptId,
          challengeId: id,
          friendName: attemptRecord.friendName,
          score,
          totalQuestions: 5,
          percentage,
          resultCategory: resultData.category,
          submittedAt
        });

        await updateDoc(doc(firestoreDb, 'challenges', id), {
          totalAttempts: increment(1)
        });
      } catch (firestoreErr) {
        console.warn('Firestore attempt write notice:', firestoreErr);
      }

      return res.json({
        success: true,
        attemptId,
        score,
        totalQuestions: 5,
        percentage,
        resultCategory: resultData.category,
        resultMessage: resultData.message,
        answersBreakdown
      });
    } catch (err: any) {
      console.error('Error in POST /api/challenges/:id/submit:', err);
      return res.status(500).json({ error: 'Failed to evaluate challenge submission.' });
    }
  });

  // GET /api/challenges/:id/dashboard: Fetch creator dashboard and leaderboard with authentication
  app.get('/api/challenges/:id/dashboard', async (req, res) => {
    try {
      const { id } = req.params;
      const creatorKey = (req.headers['x-creator-key'] as string) || (req.query.key as string);

      // Retrieve secret
      let secret = memorySecrets.get(id);
      if (!secret) {
        try {
          const secretSnap = await getDoc(doc(firestoreDb, 'challenges', id, 'secret', 'answers'));
          if (secretSnap.exists()) {
            secret = secretSnap.data() as MemorySecret;
            memorySecrets.set(id, secret);
          }
        } catch {
          // ignore
        }
      }

      if (!secret || secret.creatorKey !== creatorKey) {
        return res.status(403).json({ error: 'Access denied: Invalid creator dashboard key.' });
      }

      // Fetch challenge
      let challenge = memoryChallenges.get(id);
      if (!challenge) {
        const snap = await getDoc(doc(firestoreDb, 'challenges', id));
        if (snap.exists()) {
          challenge = snap.data() as MemoryChallenge;
          memoryChallenges.set(id, challenge);
        }
      }

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found.' });
      }

      // Fetch all attempts
      let attempts = memoryAttempts.get(id) || [];
      try {
        const attemptsQuery = query(collection(firestoreDb, 'challenges', id, 'attempts'), orderBy('submittedAt', 'desc'));
        const attemptsSnap = await getDocs(attemptsQuery);
        if (!attemptsSnap.empty) {
          attempts = attemptsSnap.docs.map(doc => doc.data() as MemoryAttempt);
          memoryAttempts.set(id, attempts);
        }
      } catch {
        // use in-memory attempts
      }

      const totalAttempts = attempts.length;
      let scoreSum = 0;
      let highestScore = 0;
      let legendaryCount = 0;

      for (const a of attempts) {
        scoreSum += a.score || 0;
        if ((a.score || 0) > highestScore) highestScore = a.score;
        if (a.score === 5) legendaryCount++;
      }

      const averageScore = totalAttempts > 0 ? Number((scoreSum / totalAttempts).toFixed(1)) : 0;

      return res.json({
        success: true,
        challenge,
        attempts,
        stats: {
          totalAttempts,
          averageScore,
          highestScore,
          legendaryCount
        }
      });
    } catch (err: any) {
      console.error('Error in GET /api/challenges/:id/dashboard:', err);
      return res.status(500).json({ error: 'Failed to load creator dashboard.' });
    }
  });

  // Client SPA mounting
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ FRND FOBIA Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
