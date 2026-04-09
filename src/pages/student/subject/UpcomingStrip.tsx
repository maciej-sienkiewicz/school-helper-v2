import { differenceInDays, parseISO, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockStudentHomework, mockStudentExams } from '../../../data/mockData';
import type { StudentHomework, StudentExam } from '../../../types';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  subject: string;
  doneIds: Set<string>;
  onToggleDone: (id: string) => void;
}

// ─── Checkbox ──────────────────────────────────────────────────────────────────

function Checkbox({ checked, urgent, onToggle }: { checked: boolean; urgent: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer focus:outline-none"
      style={
        checked
          ? { backgroundColor: '#10b981', borderColor: '#10b981' }
          : { borderColor: urgent ? '#f59e0b' : '#d1d5db' }
      }
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
          <path d="M1 4l3 3L9 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ─── Zadanie domowe ────────────────────────────────────────────────────────────

function HomeworkItem({
  hw,
  onToggle,
}: {
  hw: StudentHomework;
  onToggle: () => void;
}) {
  const today = new Date();
  const days  = differenceInDays(parseISO(hw.dueDate), today);
  const overdue = days < 0;
  const urgent  = !overdue && days <= 2;

  const dueLabel =
    overdue   ? 'Zaległe!'
    : days === 0 ? 'Dzisiaj!'
    : days === 1 ? 'Jutro!'
    : `Za ${days} dni`;

  const labelColor =
    overdue  ? 'text-red-500'
    : urgent ? 'text-amber-600'
    :           'text-gray-400';

  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 bg-white rounded-xl border transition-colors ${
        overdue ? 'border-red-200' : urgent ? 'border-amber-200' : 'border-gray-100'
      }`}
    >
      <Checkbox checked={false} urgent={overdue || urgent} onToggle={onToggle} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug truncate">{hw.title}</p>
        {hw.isExtra && (
          <span className="text-xs text-gray-400">Nadobowiązkowe</span>
        )}
      </div>
      <span className={`text-xs font-semibold flex-shrink-0 ${labelColor}`}>
        {dueLabel}
      </span>
    </div>
  );
}

// ─── Sprawdzian ────────────────────────────────────────────────────────────────

function ExamItem({ exam }: { exam: StudentExam }) {
  const days  = differenceInDays(parseISO(exam.date), new Date());
  const urgent = days <= 3;

  const dueLabel =
    days === 0 ? 'Dzisiaj!'
    : days === 1 ? 'Jutro!'
    : `Za ${days} dni`;

  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 bg-white rounded-xl border ${
        urgent ? 'border-amber-200' : 'border-gray-100'
      }`}
    >
      <CalendarDays
        className={`w-4 h-4 flex-shrink-0 ${urgent ? 'text-amber-500' : 'text-gray-400'}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">
          Sprawdzian
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {exam.topicNames.slice(0, 3).join(' · ')}
          {exam.topicNames.length > 3 && ' …'}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className={`text-xs font-semibold ${urgent ? 'text-amber-600' : 'text-gray-400'}`}>
          {dueLabel}
        </span>
        <p className="text-xs text-gray-300 mt-0.5">
          {format(parseISO(exam.date), 'd MMM', { locale: pl })}
        </p>
      </div>
    </div>
  );
}

// ─── Główny komponent ──────────────────────────────────────────────────────────

export function UpcomingStrip({ subject, doneIds, onToggleDone }: Props) {
  const today = new Date();

  // Pending homework (not done, sorted by due date)
  const pendingHw = mockStudentHomework
    .filter(h => h.subject === subject && !doneIds.has(h.id))
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());

  // Upcoming exams (future only, sorted by date)
  const upcomingExams = mockStudentExams
    .filter(e => e.subject === subject && differenceInDays(parseISO(e.date), today) >= 0)
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  // Nic do zrobienia
  if (pendingHw.length === 0 && upcomingExams.length === 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-gray-100">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        <span className="text-sm text-gray-500">Nic pilnego — wszystko pod kontrolą.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
        Do zrobienia
      </p>

      <AnimatePresence initial={false}>
        {pendingHw.map(hw => (
          <motion.div
            key={hw.id}
            initial={false}
            exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
            transition={{ duration: 0.2 }}
          >
            <HomeworkItem hw={hw} onToggle={() => onToggleDone(hw.id)} />
          </motion.div>
        ))}
      </AnimatePresence>

      {upcomingExams.map(exam => (
        <ExamItem key={exam.id} exam={exam} />
      ))}
    </div>
  );
}
