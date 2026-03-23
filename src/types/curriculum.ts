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
