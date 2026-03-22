import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Clock, MapPin, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { mockStudentExams } from '../../../data/mockData';
import type { StudentExam } from '../../../types';

// ─── Single exam row ───────────────────────────────────────────────────────────

function ExamRow({ exam }: { exam: StudentExam }) {
  const [open, setOpen] = useState(false);
  const days = differenceInDays(parseISO(exam.date), new Date());

  const urgency =
    days < 0  ? 'past' :
    days <= 3 ? 'red'  :
    days <= 7 ? 'amber': 'sky';

  const styles = {
    past:  { dot: 'bg-gray-300',   chip: 'bg-gray-100 text-gray-500',   label: 'minął'      },
    red:   { dot: 'bg-red-400',    chip: 'bg-red-100 text-red-700',     label: days === 0 ? 'dzisiaj!' : days === 1 ? 'jutro!' : `za ${days} dni` },
    amber: { dot: 'bg-amber-400',  chip: 'bg-amber-100 text-amber-700', label: `za ${days} dni` },
    sky:   { dot: 'bg-sky-400',    chip: 'bg-sky-100 text-sky-700',     label: `za ${days} dni` },
  }[urgency];

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      {/* ── Compact row (always visible) ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
      >
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${styles.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-800">
            {format(parseISO(exam.date), 'EEEE, d MMMM', { locale: pl })}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {format(parseISO(exam.date), 'yyyy', { locale: pl })}
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${styles.chip}`}>
          {styles.label}
        </span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
      </button>

      {/* ── Expanded details ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} min
                </span>
                {exam.room && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> sala {exam.room}
                  </span>
                )}
              </div>

              {/* Scope */}
              <div className="bg-amber-50 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-amber-700 mb-0.5">Zakres</p>
                <p className="text-xs text-amber-800">{exam.scope}</p>
              </div>

              {/* Topic badges */}
              {exam.topicNames.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Layers className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Tematy</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exam.topicNames.map((t: string) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: exam.color + '55', color: '#374151' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar tile ──────────────────────────────────────────────────────────────

export function SidebarExams({ subject }: { subject: string }) {
  const exams = mockStudentExams
    .filter(e => e.subject === subject)
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  return (
    <div className="bg-white rounded-3xl shadow-card border border-white/80 p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarCheck className="w-4 h-4 text-sky-500" />
        <h2 className="text-sm font-bold text-gray-800">Egzaminy</h2>
        {exams.length > 0 && (
          <span className="text-xs bg-sky-100 text-sky-600 font-bold px-2 py-0.5 rounded-full ml-auto">
            {exams.length}
          </span>
        )}
      </div>

      {exams.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">Brak zaplanowanych egzaminów.</p>
      ) : (
        <div className="space-y-2">
          {exams.map(e => <ExamRow key={e.id} exam={e} />)}
        </div>
      )}
    </div>
  );
}
