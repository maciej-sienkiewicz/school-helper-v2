import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Plus, Calendar, Pencil, Trash2,
  Upload, FileQuestion,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { SectionTitle } from '../../../components/ui/Card';
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
    <div className="bg-white rounded-3xl border border-white/80 shadow-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <SectionTitle icon={<FlaskConical className="w-4 h-4" />}>
          Zaplanowane egzaminy
          {exams.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-sky-100 text-sky-600 rounded-full text-xs font-bold">
              {exams.length}
            </span>
          )}
        </SectionTitle>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={onScheduleTest}
        >
          Zaplanuj egzamin
        </Button>
      </div>

      {/* Empty state */}
      {exams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-3">
            <FileQuestion className="w-6 h-6 text-sky-200" />
          </div>
          <p className="text-sm text-gray-400">Brak zaplanowanych egzaminów dla tej klasy</p>
          <p className="text-xs text-gray-300 mt-1">Kliknij „Zaplanuj egzamin", aby dodać pierwszy</p>
        </div>
      )}

      {/* Exam cards grid */}
      {exams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <AnimatePresence>
            {sorted.map(exam => {
              const dateLabel = new Date(exam.date).toLocaleDateString('pl-PL', {
                weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
              });
              const isUpcoming = new Date(exam.date) >= new Date(new Date().toDateString());

              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex flex-col gap-3 p-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/60 to-white hover:border-sky-200 hover:shadow-sm transition-all"
                >
                  {/* Source badge */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      exam.source === 'generator'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {exam.source === 'generator'
                        ? <><FlaskConical className="w-2.5 h-2.5" /> Generator</>
                        : <><Upload className="w-2.5 h-2.5" /> Z pliku</>}
                    </span>
                    {isUpcoming && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Nadchodzący
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-snug">{exam.testTitle}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{dateLabel}</span>
                    </div>
                  </div>

                  {/* Topics count */}
                  {exam.topicIds.length > 0 && (
                    <div className="text-xs text-sky-500 font-medium">
                      {exam.topicIds.length} {exam.topicIds.length === 1 ? 'temat' : exam.topicIds.length < 5 ? 'tematy' : 'tematów'}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-sky-100/80">
                    <button
                      onClick={() => onEditExam(exam)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-sky-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-sky-50"
                    >
                      <Pencil className="w-3 h-3" /> Edytuj
                    </button>
                    <button
                      onClick={() => onDeleteExam(exam.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" /> Usuń
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
