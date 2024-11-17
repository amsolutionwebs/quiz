import { create } from 'zustand';

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
};

export type QuizResult = {
  id: string;
  userId: string;
  userName: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: Date;
  answers: number[];
};

type QuizStore = {
  quizzes: Quiz[];
  results: QuizResult[];
  addQuiz: (quiz: Quiz) => void;
  addResult: (result: QuizResult) => void;
};

export const useQuizStore = create<QuizStore>((set) => ({
  quizzes: [],
  results: [],
  addQuiz: (quiz) => set((state) => ({ quizzes: [...state.quizzes, quiz] })),
  addResult: (result) => set((state) => ({ results: [...state.results, result] })),
}));