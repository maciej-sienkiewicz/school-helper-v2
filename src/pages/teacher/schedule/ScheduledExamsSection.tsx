import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Plus, Calendar, Pencil, Trash2, Upload, FileQuestion,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { ScheduledExam } from './ScheduleTestModal';

interface Props {
  exams: ScheduledExam[];
  onScheduleTest: () => void;
  onEditExam: (exam: ScheduledExam) => void;
  onDeleteExam: (id: string) => void;
}

export function ScheduledExamsSection({ exams, onScheduleTest, onEditExam, onDeleteExam }: Props) {
  const sorted = exams.slice().sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Zaplanowane egzaminy
          </span>
          {exams.length > 0 && (
            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-600 rounded-full text-[10px] font-bold">
              {exams.length}
            </span>
          )}
        </div>
        <button
          onClick={onScheduleTest}
          className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Zaplanuj
        </button>
      </div>

      {/* Empty state */}
      {exams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center mb-2">
            <FileQuestion className="w-5 h-5 text-sky-200" />
          </div>
          <p className="text-xs text-gray-400">Brak zaplanowanych egzaminów</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        <AnimatePresence>
          {sorted.map(exam => {
            const dateLabel = new Date(exam.date).toLocaleDateString('pl-PL', {
              day: 'numeric', month: 'short', year: 'numeric',
            });
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 p-3 rounded-2xl border border-sky-100 bg-sky-50/40 group/exam"
              >
                <div className="w-7 h-7 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {exam.source === 'generator'
                    ? <FlaskConical className="w-3.5 h-3.5 text-sky-500" />
                    : <Upload className="w-3.5 h-3.5 text-sky-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800 leading-tight">{exam.testTitle}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" /> {dateLabel}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover/exam:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => onEditExam(exam)}
                    className="w-6 h-6 rounded-lg hover:bg-sky-100 flex items-center justify-center text-gray-300 hover:text-sky-500 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    className="w-6 h-6 rounded-lg hover:bg-red-100 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
