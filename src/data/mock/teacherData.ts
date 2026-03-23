import type { Teacher, Class } from '../../types';

export const mockTeacher: Teacher = {
  id: 't1',
  name: 'Anna Kowalska',
  email: 'a.kowalska@szkola.pl',
  subjects: ['Matematyka', 'Fizyka'],
};

export const mockClasses: Class[] = [
  { id: 'c1', name: '6A', grade: 6, schoolType: 'primary', subject: 'Matematyka', studentCount: 24, color: '#e9d5ff' },
  { id: 'c2', name: '6B', grade: 6, schoolType: 'primary', subject: 'Matematyka', studentCount: 22, color: '#ddd6fe' },
  { id: 'c3', name: '7A', grade: 7, schoolType: 'primary', subject: 'Matematyka', studentCount: 26, color: '#bae6fd' },
  { id: 'c4', name: '7B', grade: 7, schoolType: 'primary', subject: 'Matematyka', studentCount: 23, color: '#d1fae5' },
  { id: 'c5', name: '8A', grade: 8, schoolType: 'primary', subject: 'Matematyka', studentCount: 25, color: '#fde68a' },
  { id: 'c6', name: '2LOA', grade: 2, schoolType: 'high', subject: 'Matematyka', studentCount: 30, color: '#fecdd3' },
  { id: 'c7', name: '2LOA', grade: 2, schoolType: 'high', subject: 'Fizyka', studentCount: 30, color: '#a7f3d0' },
];
