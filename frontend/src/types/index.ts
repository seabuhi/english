export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type Category = 'READING' | 'LISTENING' | 'VOCABULARY' | 'SYNONYMS_ANTONYMS' | 'GRAMMAR' | 'SPEAKING';

export type ExerciseType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK' | 'MATCHING' | 'SENTENCE_CORRECTION';

export interface Exercise {
  id: number;
  title: string;
  level: CefrLevel;
  category: Category;
  exerciseType: ExerciseType;
  textContent?: string;
  audioUrl?: string;
  imageUrl?: string;
  transcript?: string;
  questionText: string;
  optionsJson?: string;
  correctAnswer?: string;
  explanation?: string;
  createdAt?: string;
}

export interface AnswerSubmission {
  userAnswer: string;
}

export interface AnswerResult {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface SpeakingTopic {
  id: number;
  title: string;
  level: CefrLevel;
  description?: string;
  promptsJson?: string;
  followUpQuestionsJson?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  username: string;
  email: string;
  emailVerified: boolean;
  score: number;
  streak: number;
  token?: string;
}
