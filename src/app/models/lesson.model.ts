export interface Lesson {
  id: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Pessoal';
  englishText: string;
  portugueseText: string;
  // Spaced Repetition fields
  easeFactor?: number;
  interval?: number;
  repetitions?: number;
  dueDate?: Date;
  lastReviewed?: Date;
  averageRating?: number;
  timesStudied?: number;
}

export type LevelFilter = 'Todos' | 'Iniciante' | 'Intermediário' | 'Avançado' | 'Pessoal';

export interface UserProgress {
  totalPoints: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  cardsStudiedToday: number;
  dailyGoal: number;
  lastStudyDate: Date | null;
  totalCardsStudied: number;
  averageAccuracy: number;
}

export interface StudySession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  correctAnswers: number;
  totalPoints: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
  requirement: number;
  progress: number;
}
