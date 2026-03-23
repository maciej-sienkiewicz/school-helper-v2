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

export interface Note {
  id: string;
  recordingId: string;
  topicId?: string;
  topicName?: string;
  /** Full document content – plain text or full HTML */
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

export interface Comment {
  id: string;
  studentName: string;
  className: string;
  text: string;
  createdAt: string;
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
