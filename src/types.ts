export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  category?: string;
  emoji?: string;
}

export interface Challenge {
  id: string;
  creatorName: string;
  creatorAvatar?: string;
  questions: {
    id: string;
    text: string;
    options: [string, string, string, string];
  }[];
  durationHours: 24 | 48;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired';
  totalAttempts: number;
}

export interface ChallengeSecret {
  challengeId: string;
  correctOptionIndices: number[]; // e.g. [0, 2, 1, 3, 0]
  creatorKey: string; // Secret key for creator dashboard access
  createdAt: string;
}

export interface Attempt {
  id: string;
  challengeId: string;
  friendName: string;
  score: number; // 0 to 5
  totalQuestions: number; // 5
  percentage: number; // 0 to 100
  resultCategory: string; // e.g. "BESTIE MATERIAL. LEGENDARY! 🏆"
  submittedAt: string;
  answersBreakdown?: {
    questionId: string;
    questionText: string;
    friendSelectedOption: string;
    isCorrect: boolean;
  }[];
}

export interface ChallengeSubmissionPayload {
  friendName: string;
  selectedAnswers: number[]; // 5 chosen indices (0-3)
}

export interface SubmissionResultResponse {
  success: boolean;
  attemptId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  resultCategory: string;
  resultMessage: string;
  answersBreakdown: {
    questionId: string;
    questionText: string;
    friendSelectedOption: string;
    isCorrect: boolean;
  }[];
}

export interface CreatorDashboardData {
  challenge: Challenge;
  attempts: Attempt[];
  stats: {
    totalAttempts: number;
    averageScore: number;
    highestScore: number;
    legendaryCount: number;
  };
}
