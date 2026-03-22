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
  templateId?: string; // assigned schedule template
}

// ─── Schedule Templates ───────────────────────────────────────────────────────

export interface TemplateTopic {
  id: string;
  name: string;
  order: number;
}

export interface TemplateUnit {
  id: string;
  name: string;
  order: number;
  topics: TemplateTopic[];
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  grade: number;
  schoolType: 'primary' | 'high';
  units: TemplateUnit[];
  createdAt: string;
}

// ─── Sharing ──────────────────────────────────────────────────────────────────

export type ShareScope = 'class' | 'grade' | 'school' | 'county' | 'voivodeship' | 'all';

export interface ShareTarget {
  scope: ShareScope;
  classId?: string;
  grade?: number;
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

export interface Note {
  id: string;
  recordingId: string;
  topicId?: string;
  topicName?: string;
  /** Full document content – plain text with headings and paragraphs */
  content: string;
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

// ─── Student ──────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  classId: string;
  grade: number;
  schoolType: 'primary' | 'high';
  avatar?: string;
}

export interface StudentLesson {
  id: string;
  date: string; // ISO
  subject: string;
  topicName: string;
  unitName: string;
  teacherName: string;
  className: string;
  durationMinutes: number;
  topicId?: string;
  noteId?: string;
  noteContent?: string;
  recordingId?: string;
  recordingDurationSeconds?: number;
  thumbnailColor: string;
  likes: number;
  hasLiked: boolean;
  comments: StudentComment[];
}

export interface StudentComment {
  id: string;
  studentName: string;
  text: string;
  createdAt: string;
  isOwn?: boolean;
}

export interface StudentExam {
  id: string;
  date: string; // ISO
  subject: string;
  topicNames: string[];
  scope: string;
  className: string;
  teacherName: string;
  durationMinutes: number;
  room?: string;
  color: string;
}

export interface StudentHomework {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string; // ISO
  isExtra: boolean; // false = obowiązkowe, true = dodatkowe/nadobowiązkowe
  done: boolean;
  attachmentNote?: string; // link do notatki z materiałem
}

export interface ExternalMaterial {
  id: string;
  subject: string;
  topicName: string;
  unitName: string;
  type: 'note' | 'recording' | 'both';
  scope: 'school' | 'county' | 'voivodeship' | 'all';
  schoolName: string;
  city: string;
  teacherInitials: string;
  sharedAt: string;
  likes: number;
  noteContent?: string;
  recordingDurationSeconds?: number;
  thumbnailColor: string;
}
