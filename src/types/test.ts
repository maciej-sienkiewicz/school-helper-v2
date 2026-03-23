export type QuestionType = 'open' | 'single_choice' | 'multiple_choice' | 'matching';

export interface TestConfig {
  topicIds: string[];
  customScope?: string;
  openCount: number;
  singleChoiceCount: number;
  singleChoiceOptions: number;
  multipleChoiceCount: number;
  multipleChoiceOptions: number;
  matchingCount: number;
}

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  leftItems?: string[];
  rightItems?: string[];
  correctPairs?: Record<string, string>;
  points: number;
}

export interface GeneratedTest {
  id: string;
  config: TestConfig;
  questions: TestQuestion[];
  createdAt: string;
  title: string;
}
