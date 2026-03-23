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
