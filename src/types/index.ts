// ─── Teacher & Classes ───────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subjects: string[];
}

export interface Class {
  id: string;
  name: string; // e.g. "6A", "7B", "2LOA"
  grade: number; // 1-8 for primary, 1-3 for high school
  schoolType: 'primary' | 'high';
  subject: string;
  studentCount: number;
  color: string; // pastel color for card
}

// ─── Curriculum / Topics ─────────────────────────────────────────────────────

export interface CurriculumUnit {
  id: string;
  name: string; // e.g. "Funkcje"
  order: number;
}

export interface CurriculumTopic {
  id: string;
  unitId: string;
  name: string;
  order: number;
}

export interface TopicStatus {
  topicId: string;
  classId: string;
  completed: boolean;
  hasNote: boolean;
  noteId?: string;
  isShared: boolean;
  hasRecording: boolean;
}

// ─── Recordings ──────────────────────────────────────────────────────────────

export type RecordingStatus = 'raw' | 'transcribing' | 'transcribed' | 'has_note' | 'rejected';

export interface Recording {
  id: string;
  date: string; // ISO date
  classId: string;
  className: string;
  subject: string;
  durationSeconds: number;
  status: RecordingStatus;
  noteId?: string;
  isSharedNote: boolean;
  isSharedAudio: boolean;
  topicId?: string;
  topicName?: string;
  thumbnailColor?: string;
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export interface NoteConcept {
  term: string;
  definition: string;
}

export interface Note {
  id: string;
  recordingId: string;
  topicId?: string;
  topicName?: string;
  summary: string;
  concepts: NoteConcept[];
  createdAt: string;
  status: 'draft' | 'accepted' | 'deleted';
  sharedWithClasses: string[];
}

// ─── Shared Materials & Stats ─────────────────────────────────────────────────

export interface ClassStats {
  classId: string;
  className: string;
  totalStudents: number;
  studentsOpened: number;
  viewCount: number;
  listenCount: number;
}

export interface MaterialStats {
  materialId: string; // note or recording id
  topicName: string;
  subject: string;
  sharedWithClasses: string[];
  totalViews: number;
  totalListens: number;
  externalViews: number;
  commentCount: number;
  comments: Comment[];
  classStats: ClassStats[];
}

export interface Comment {
  id: string;
  studentName: string;
  className: string;
  text: string;
  createdAt: string;
}

export interface SharedMaterial {
  id: string;
  type: 'note' | 'audio' | 'both';
  topicName: string;
  unitName: string;
  subject: string;
  grade: number;
  sharedAt: string;
  sharedWithClasses: string[];
  stats: MaterialStats;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

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
