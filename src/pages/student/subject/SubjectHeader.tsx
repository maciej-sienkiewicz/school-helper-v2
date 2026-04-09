import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockStudentLessons, mockStudent } from '../../../data/mockData';

interface SubjectHeaderProps {
  subject: string;
}

export function SubjectHeader({ subject }: SubjectHeaderProps) {
  const navigate  = useNavigate();
  const teacherName = mockStudentLessons.find(l => l.subject === subject)?.teacherName ?? '—';

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors cursor-pointer mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Wróć
      </button>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{subject}</h1>
          <p className="text-sm text-gray-400 mt-1">{teacherName} &middot; {mockStudent.className}</p>
        </div>
      </div>
    </div>
  );
}
