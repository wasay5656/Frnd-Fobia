import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
const db = admin.firestore();

// Result messages based on score
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
    message: '2/5. You know their face, but their personality remains a complete enigma to you.'
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

/**
 * Cloud Function: submitChallenge
 * Evaluates submitted answers on the server against the protected secret document.
 * NEVER exposes correct answers to the public or client ahead of time.
 */
export const submitChallenge = functions.https.onCall(async (data, context) => {
  // App Check verification (optional in dev, enforced in prod)
  if (process.env.ENFORCE_APP_CHECK === 'true' && !context.app) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  const { challengeId, friendName, selectedAnswers } = data;

  if (!challengeId || typeof challengeId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Valid challengeId is required.');
  }

  if (!friendName || typeof friendName !== 'string' || friendName.trim().length === 0 || friendName.length > 50) {
    throw new functions.https.HttpsError('invalid-argument', 'Nickname must be 1 to 50 characters.');
  }

  if (!Array.isArray(selectedAnswers) || selectedAnswers.length !== 5) {
    throw new functions.https.HttpsError('invalid-argument', 'Exactly 5 answer selections required.');
  }

  // Retrieve public challenge to check status & expiration
  const challengeRef = db.collection('challenges').doc(challengeId);
  const challengeSnap = await challengeRef.get();

  if (!challengeSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Challenge does not exist or has been removed.');
  }

  const challengeData = challengeSnap.data()!;
  const now = new Date();
  const expiresAt = new Date(challengeData.expiresAt);

  if (now > expiresAt || challengeData.status === 'expired') {
    await challengeRef.update({ status: 'expired' });
    throw new functions.https.HttpsError('deadline-exceeded', 'This friendship challenge has expired.');
  }

  // Retrieve isolated secret answers (never readable by client SDK)
  const secretRef = challengeRef.collection('secret').doc('answers');
  const secretSnap = await secretRef.get();

  if (!secretSnap.exists) {
    throw new functions.https.HttpsError('internal', 'Challenge secret verification data missing.');
  }

  const secretData = secretSnap.data()!;
  const correctOptionIndices: number[] = secretData.correctOptionIndices;

  // Rate limiting / duplicate prevention: check if this friend submitted in last 5 minutes
  const recentAttemptsSnap = await challengeRef
    .collection('attempts')
    .where('friendName', '==', friendName.trim())
    .limit(1)
    .get();

  if (!recentAttemptsSnap.empty) {
    const prevAttempt = recentAttemptsSnap.docs[0].data();
    const prevTime = new Date(prevAttempt.submittedAt).getTime();
    if (Date.now() - prevTime < 5 * 60 * 1000) {
      throw new functions.https.HttpsError(
        'already-exists',
        'You have already submitted an attempt recently with this nickname. Try another nickname!'
      );
    }
  }

  // Calculate score securely on the server
  let score = 0;
  const questions = challengeData.questions || [];
  const answersBreakdown = [];

  for (let i = 0; i < 5; i++) {
    const isCorrect = selectedAnswers[i] === correctOptionIndices[i];
    if (isCorrect) score++;

    const q = questions[i] || {};
    const friendChoiceText = (q.options && q.options[selectedAnswers[i]]) || `Choice ${selectedAnswers[i] + 1}`;

    answersBreakdown.push({
      questionId: q.id || `q_${i}`,
      questionText: q.text || `Question ${i + 1}`,
      friendSelectedOption: friendChoiceText,
      isCorrect
    });
  }

  const percentage = Math.round((score / 5) * 100);
  const resultInfo = RESULT_MESSAGES[score] || RESULT_MESSAGES[0];
  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const submittedAt = new Date().toISOString();

  // Save attempt to subcollection
  const attemptDoc = {
    id: attemptId,
    challengeId,
    friendName: friendName.trim(),
    score,
    totalQuestions: 5,
    percentage,
    resultCategory: resultInfo.category,
    submittedAt
  };

  await challengeRef.collection('attempts').doc(attemptId).set(attemptDoc);

  // Increment cached total attempts on parent document
  await challengeRef.update({
    totalAttempts: admin.firestore.FieldValue.increment(1)
  });

  return {
    success: true,
    attemptId,
    score,
    totalQuestions: 5,
    percentage,
    resultCategory: resultInfo.category,
    resultMessage: resultInfo.message,
    answersBreakdown
  };
});

/**
 * Cloud Function: getCreatorDashboard
 * Authenticates creator using creatorKey and returns full challenge stats & leaderboard.
 */
export const getCreatorDashboard = functions.https.onCall(async (data, context) => {
  const { challengeId, creatorKey } = data;

  if (!challengeId || !creatorKey) {
    throw new functions.https.HttpsError('invalid-argument', 'challengeId and creatorKey are required.');
  }

  const challengeRef = db.collection('challenges').doc(challengeId);
  const secretSnap = await challengeRef.collection('secret').doc('answers').get();

  if (!secretSnap.exists || secretSnap.data()?.creatorKey !== creatorKey) {
    throw new functions.https.HttpsError('permission-denied', 'Invalid creator dashboard key.');
  }

  const challengeSnap = await challengeRef.get();
  if (!challengeSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Challenge not found.');
  }

  const attemptsSnap = await challengeRef.collection('attempts').orderBy('submittedAt', 'desc').get();
  const attempts = attemptsSnap.docs.map(doc => doc.data());

  const totalAttempts = attempts.length;
  let totalScoreSum = 0;
  let highestScore = 0;
  let legendaryCount = 0;

  for (const att of attempts) {
    totalScoreSum += att.score || 0;
    if ((att.score || 0) > highestScore) highestScore = att.score;
    if (att.score === 5) legendaryCount++;
  }

  const averageScore = totalAttempts > 0 ? Number((totalScoreSum / totalAttempts).toFixed(1)) : 0;

  return {
    challenge: challengeSnap.data(),
    attempts,
    stats: {
      totalAttempts,
      averageScore,
      highestScore,
      legendaryCount
    }
  };
});
