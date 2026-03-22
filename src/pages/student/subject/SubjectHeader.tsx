import { BookOpen } from 'lucide-react';
import { mockStudentLessons, mockStudent, mockClasses } from '../../../data/mockData';

interface SubjectHeaderProps {
  subject: string;
}

export function SubjectHeader({ subject }: SubjectHeaderProps) {
  const studentClass = mockClasses.find(c => c.id === mockStudent.classId);
  const classColor = studentClass?.color ?? '#bae6fd';
  const teacherName = mockStudentLessons.find(l => l.subject === subject)?.teacherName ?? '—';

  return (
    <div className="bg-white rounded-3xl shadow-card border border-white/80 p-5 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: classColor }}
          >
            <BookOpen className="w-5 h-5 text-gray-700/60" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{subject}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{teacherName}</p>
          </div>
        </div>
        <span
          className="text-sm font-bold px-3 py-1.5 rounded-2xl flex-shrink-0"
          style={{ backgroundColor: classColor, color: '#374151' }}
        >
          {mockStudent.className}
        </span>
      </div>
    </div>
  );
}
