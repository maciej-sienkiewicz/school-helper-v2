import { motion } from 'framer-motion';
import { BookOpen, CalendarCheck, ThumbsUp, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { mockStudentLessons, mockStudentExams } from '../../data/mockData';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';

export function StudentDashboard() {
  const { student } = useAuth();
  const recentLessons = mockStudentLessons.slice(0, 3);
  const nextExam = mockStudentExams[0];
  const daysUntilExam = differenceInDays(parseISO(nextExam.date), new Date());
  const totalLikes = mockStudentLessons.reduce((s, l) => s + l.likes, 0);
  const totalComments = mockStudentLessons.reduce((s, l) => s + l.comments.length, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-blue-700 p-6 text-white shadow-lg"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-sky-200 text-sm mb-1">
            {format(new Date(), "EEEE, d MMMM yyyy", { locale: pl })}
          </p>
          <h1 className="text-2xl font-bold mb-1">Cześć, {student?.name.split(' ')[0]}! 👋</h1>
          <p className="text-sky-100 text-sm">Klasa {student?.className} · {student?.grade} klasa szkoły podstawowej</p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: 'Lekcje', value: mockStudentLessons.length, color: 'bg-sky-50 text-sky-600' },
          { icon: CalendarCheck, label: 'Egzaminy', value: mockStudentExams.length, color: 'bg-amber-50 text-amber-600' },
          { icon: ThumbsUp, label: 'Łapki', value: totalLikes, color: 'bg-violet-50 text-violet-600' },
          { icon: MessageCircle, label: 'Komentarze', value: totalComments, color: 'bg-emerald-50 text-emerald-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} padding="sm" className="text-center">
            <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center mx-auto mb-2`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Next exam */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-amber-500" /> Następny egzamin
            </h2>
            <Link to="/student/exams" className="text-xs text-sky-600 hover:underline flex items-center gap-1">
              Wszystkie <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: nextExam.color + '60' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                daysUntilExam <= 3 ? 'bg-red-100 text-red-600' :
                daysUntilExam <= 7 ? 'bg-amber-100 text-amber-700' :
                'bg-sky-100 text-sky-700'
              }`}>
                {daysUntilExam === 0 ? 'Dzisiaj!' :
                 daysUntilExam === 1 ? 'Jutro!' :
                 `Za ${daysUntilExam} dni`}
              </span>
              <span className="text-xs text-gray-500">
                {format(parseISO(nextExam.date), "d MMM", { locale: pl })}
              </span>
            </div>
            <div className="font-bold text-gray-800 text-sm mb-1">{nextExam.subject}</div>
            <div className="text-xs text-gray-600 mb-2">{nextExam.scope}</div>
            <div className="flex flex-wrap gap-1">
              {nextExam.topicNames.map(t => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/70 text-gray-600">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" /> {nextExam.durationMinutes} min · sala {nextExam.room}
            </div>
          </div>
        </Card>

        {/* Recent lessons */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-500" /> Ostatnie lekcje
            </h2>
            <Link to="/student/lessons" className="text-xs text-sky-600 hover:underline flex items-center gap-1">
              Wszystkie <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentLessons.map(lesson => (
              <Link
                key={lesson.id}
                to="/student/lessons"
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: lesson.thumbnailColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate group-hover:text-sky-600 transition-colors">
                    {lesson.topicName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(parseISO(lesson.date), "d MMM", { locale: pl })}
                    {lesson.noteId ? ' · notatka' : ''}
                    {lesson.recordingId ? ' · nagranie' : ''}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ThumbsUp className="w-3 h-3" /> {lesson.likes}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
