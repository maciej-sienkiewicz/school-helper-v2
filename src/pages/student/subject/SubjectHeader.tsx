import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Timer } from 'lucide-react';
import { parseISO, differenceInDays, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  mockStudentLessons, mockStudentExams,
  mockStudent, mockClasses, mockTopics,
} from '../../../data/mockData';

// Maps pastel class colors → darker accent for the progress bar
const ACCENT: Record<string, string> = {
  '#bae6fd': '#0ea5e9',
  '#e9d5ff': '#8b5cf6',
  '#d1fae5': '#10b981',
  '#fde68a': '#f59e0b',
  '#fecdd3': '#f43f5e',
  '#ddd6fe': '#7c3aed',
  '#a7f3d0': '#10b981',
};

interface SubjectHeaderProps {
  subject: string;
}

export function SubjectHeader({ subject }: SubjectHeaderProps) {
  const studentClass = mockClasses.find(c => c.id === mockStudent.classId);
  const classColor = studentClass?.color ?? '#bae6fd';
  const accentColor = ACCENT[classColor] ?? '#0ea5e9';

  const lessons = mockStudentLessons.filter(l => l.subject === subject);
  const teacherName = lessons[0]?.teacherName ?? '—';

  // Progress: attended lessons vs. total curriculum topics
  const progressPct = Math.round((lessons.length / mockTopics.length) * 100);

  // Nearest upcoming exam
  const now = new Date();
  const nearestExam = mockStudentExams
    .filter(e => e.subject === subject && parseISO(e.date) >= now)
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())[0];
  const daysLeft = nearestExam ? differenceInDays(parseISO(nearestExam.date), now) : null;

  const urgency =
    daysLeft === null ? null :
    daysLeft <= 3 ? 'red' :
    daysLeft <= 7 ? 'amber' : 'sky';

  const urgencyClasses = {
    red:   { bg: 'bg-red-50 border-red-200',   icon: 'bg-red-100',   text: 'text-red-500',   num: 'text-red-400' },
    amber: { bg: 'bg-amber-50 border-amber-200', icon: 'bg-amber-100', text: 'text-amber-500', num: 'text-amber-400' },
    sky:   { bg: 'bg-sky-50 border-sky-200',   icon: 'bg-sky-100',   text: 'text-sky-500',   num: 'text-sky-400' },
  };

  return (
    <div className="space-y-3 mb-6">

      {/* ── Info card ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-card border border-white/80 p-5">
        <div className="flex items-start justify-between gap-4">
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
            className="text-sm font-bold px-3 py-1.5 rounded-2xl flex-shrink-0 mt-0.5"
            style={{ backgroundColor: classColor, color: '#374151' }}
          >
            {mockStudent.className}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Postęp programu
            </span>
            <span className="text-xs font-bold text-gray-600">
              {lessons.length} z {mockTopics.length} tematów &middot; {progressPct}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* ── Focus card – nearest exam countdown ───────────────────────────────── */}
      {nearestExam && urgency && daysLeft !== null && (() => {
        const u = urgencyClasses[urgency];
        return (
          <div className={`rounded-3xl border p-4 flex items-center gap-4 ${u.bg}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${u.icon}`}>
              <Timer className={`w-5 h-5 ${u.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${u.text}`}>Nadchodzące</p>
              <p className="text-sm font-bold text-gray-800">
                {daysLeft === 0 ? 'Sprawdzian dzisiaj!' :
                 daysLeft === 1 ? 'Sprawdzian jutro!' :
                 `Sprawdzian za ${daysLeft} dni`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {format(parseISO(nearestExam.date), 'd MMMM', { locale: pl })} &middot; {nearestExam.scope}
              </p>
            </div>
            <span className={`text-3xl font-black leading-none flex-shrink-0 ${u.num}`}>
              {daysLeft}d
            </span>
          </div>
        );
      })()}

    </div>
  );
}
