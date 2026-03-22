import { motion } from 'framer-motion';
import { CalendarCheck, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { mockStudentExams } from '../../data/mockData';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';

function urgencyStyle(days: number) {
  if (days <= 3) return { badge: 'bg-red-100 text-red-700', ring: 'ring-red-200', label: days === 0 ? 'Dzisiaj!' : days === 1 ? 'Jutro!' : `Za ${days} dni` };
  if (days <= 7) return { badge: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200', label: `Za ${days} dni` };
  return { badge: 'bg-sky-100 text-sky-700', ring: 'ring-sky-100', label: `Za ${days} dni` };
}

export function StudentExams() {
  const today = new Date();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <SectionTitle icon={<CalendarCheck className="w-4 h-4" />} className="mb-6">
        Zaplanowane egzaminy
      </SectionTitle>

      {mockStudentExams.length === 0 ? (
        <Card padding="lg" className="text-center py-12">
          <CalendarCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Brak zaplanowanych egzaminów</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockStudentExams.map((exam, i) => {
            const days = differenceInDays(parseISO(exam.date), today);
            const { badge, ring, label } = urgencyStyle(days);
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card padding="lg" className={`ring-2 ${ring}`}>
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: exam.color }}
                      >
                        <BookOpen className="w-5 h-5 text-white/80" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{exam.subject}</div>
                        <div className="text-sm text-gray-500">{exam.teacherName}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${badge}`}>
                      {label}
                    </span>
                  </div>

                  {/* Date + meta */}
                  <div className="flex flex-wrap gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <CalendarCheck className="w-4 h-4 text-sky-400" />
                      {format(parseISO(exam.date), "EEEE, d MMMM yyyy", { locale: pl })}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-4 h-4 text-violet-400" />
                      {exam.durationMinutes} min
                    </div>
                    {exam.room && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        Sala {exam.room}
                      </div>
                    )}
                  </div>

                  {/* Scope */}
                  <div className="bg-gray-50 rounded-2xl p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">Zakres materiału</div>
                        <p className="text-sm text-gray-700">{exam.scope}</p>
                      </div>
                    </div>
                  </div>

                  {/* Topic chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {exam.topicNames.map(t => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: exam.color + '60', color: '#374151' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
