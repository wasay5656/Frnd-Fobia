import {
  Challenge,
  CreatorDashboardData,
  Question,
  SubmissionResultResponse
} from '../types';

const MY_CHALLENGES_STORAGE_KEY = 'frnd_fobia_created_quizzes';

export interface StoredChallengeRef {
  id: string;
  creatorName: string;
  creatorKey: string;
  expiresAt: string;
  createdAt: string;
}

export function saveCreatedChallengeLocally(ref: StoredChallengeRef) {
  try {
    const existing = getStoredCreatedChallenges();
    const filtered = existing.filter(item => item.id !== ref.id);
    filtered.unshift(ref);
    localStorage.setItem(MY_CHALLENGES_STORAGE_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

export function getStoredCreatedChallenges(): StoredChallengeRef[] {
  try {
    const raw = localStorage.getItem(MY_CHALLENGES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Creates a new FRND FOBIA challenge.
 * Returns public challenge and secret management creatorKey.
 */
export async function createChallengeApi(payload: {
  creatorName: string;
  questions: Question[];
  correctOptionIndices: number[];
  durationHours: 24 | 48;
}): Promise<{ challenge: Challenge; creatorKey: string }> {
  const res = await fetch('/api/challenges', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create challenge.');
  }

  saveCreatedChallengeLocally({
    id: data.challengeId,
    creatorName: payload.creatorName,
    creatorKey: data.creatorKey,
    expiresAt: data.expiresAt,
    createdAt: data.challenge.createdAt
  });

  return {
    challenge: data.challenge,
    creatorKey: data.creatorKey
  };
}

/**
 * Fetches public challenge questions for a friend to take.
 * Note: answers are never returned.
 */
export async function fetchChallengeApi(id: string): Promise<Challenge> {
  const res = await fetch(`/api/challenges/${encodeURIComponent(id)}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Challenge not found or expired.');
  }

  return data.challenge;
}

/**
 * Submits friend quiz answers for server-side evaluation.
 */
export async function submitChallengeApi(
  id: string,
  payload: {
    friendName: string;
    selectedAnswers: number[];
  }
): Promise<SubmissionResultResponse> {
  const res = await fetch(`/api/challenges/${encodeURIComponent(id)}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Submission failed.');
  }

  return data;
}

/**
 * Fetches creator dashboard with full attempts leaderboard and stats.
 */
export async function fetchCreatorDashboardApi(
  id: string,
  creatorKey: string
): Promise<CreatorDashboardData> {
  const res = await fetch(`/api/challenges/${encodeURIComponent(id)}/dashboard`, {
    headers: {
      'x-creator-key': creatorKey
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to authenticate creator dashboard.');
  }

  return data;
}
