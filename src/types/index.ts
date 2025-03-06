// src/types/index.ts - Updated with new StepCheckResult fields

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface SolutionStep {
  id: number;
  content: string;
  latex: string;
}

export interface Solution {
  steps: SolutionStep[];
  explanation?: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  chapter: string;
  solution?: Solution;
}

export interface GetQuestionsParams {
  chapterId?: string;
  concept?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count: number;
}

export type AppView = 'questionSelect' | 'canvas' | 'solution';
export type AIMode = 'checker' | 'hint';

export interface CanvasStep {
  id: string;
  content: string;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isCorrect?: boolean;
  errorMessage?: string;
}

export interface CanvasData {
  paths: Path2D[];
  steps?: CanvasStep[];
}

export interface StepCheckResult {
  id: string;
  isCorrect: boolean;
  errorMessage?: string;
  warningMessage?: string;  // Added for dependent error warnings
}

export interface CheckResult {
  hasError: boolean;
  steps: StepCheckResult[];
  dependentErrorSteps?: StepCheckResult[];  // Added to track steps affected by earlier errors
  hintMessage?: string;
}