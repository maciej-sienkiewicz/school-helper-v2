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

export interface StudentComment {
  id: string;
  studentName: string;
  text: string;
  createdAt: string;
  isOwn?: boolean;
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
  lessonId?: string;
  attachmentNote?: string;
}

export interface ExploreComment {
  id: string;
  text: string;
  timestamp: string; // ISO
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
  teacherName: string;
  sharedAt: string;
  likes: number;
  views: number;
  comments?: ExploreComment[];
  noteContent?: string;
  recordingDurationSeconds?: number;
  thumbnailColor: string;
}
