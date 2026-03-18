import { motion } from 'framer-motion';
import { Mic, Clock, BookOpen, ChevronRight, Zap, Star, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Blob } from '../../components/ui/Blob';
import { mockRecordings, todayClasses, formatDuration } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Dashboard() {
  const navigate = useNavigate();
  const recentRecordings = mockRecordings.slice(0, 3);

  const today = format(new Date(), 'EEEE, d MMMM', { locale: pl });

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      {/* Background blobs */}
      <Blob color="#ddd6fe" size="xl" className="-top-20 -right-20" />
      <Blob color="#bae6fd" size="lg" className="top-1/2 -right-10" delay animated />
      <Blob color="#a7f3d0" size="md" className="bottom-10 left-1/3" animated />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-sm font-medium text-violet-400 uppercase tracking-widest mb-1">
            {today}
          </p>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Dzień dobry, Anno! 👋
          </h1>
          <p className="text-gray-500 mt-1">Co dziś planujemy?</p>
        </motion.div>

        {/* Hero Card — Start Recording */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative rounded-4xl overflow-hidden shadow-glow">
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-8 right-16 w-12 h-12 bg-amber-300/30 rounded-full" />
            <div className="absolute bottom-12 right-32 w-6 h-6 bg-white/20 rounded-full" />

            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Icon area */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl flex-shrink-0"
              >
                <Mic className="w-12 h-12 text-white drop-shadow-lg" />
              </motion.div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Główna akcja</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
                  Rozpocznij nagrywanie
                </h2>
                <p className="text-violet-200 text-sm md:text-base">
                  Nagraj lekcję, a AI automatycznie wygeneruje notatkę dla uczniów
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => alert('Nagrywanie uruchomione! 🎙️')}
                className="flex-shrink-0 flex items-center gap-3 bg-white text-violet-700 font-bold px-7 py-4 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer text-base"
              >
                <Mic className="w-5 h-5" />
                Nagraj lekcję
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Nagrań w tym tygodniu', value: '5', icon: Mic, color: '#e9d5ff', textColor: 'text-violet-600' },
            { label: 'Udostępnionych notatek', value: '4', icon: BookOpen, color: '#d1fae5', textColor: 'text-emerald-600' },
            { label: 'Testów wygenerowanych', value: '1', icon: Star, color: '#fde68a', textColor: 'text-amber-600' },
          ].map(({ label, value, icon: Icon, color, textColor }) => (
            <Card key={label} padding="md" className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: color }}
              >
                <Icon className={`w-5 h-5 ${textColor}`} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-800">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's classes */}
          <motion.div variants={itemVariants}>
            <Card padding="lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  Dziś uczysz
                </h3>
                <Badge variant="purple">{todayClasses.length} lekcji</Badge>
              </div>

              {/* Decorative top blob */}
              <div className="space-y-3">
                {todayClasses.map((cls, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-violet-700 flex-shrink-0"
                      style={{ background: ['#e9d5ff', '#bae6fd', '#d1fae5'][i] }}
                    >
                      {cls.className}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">{cls.subject}</div>
                      <div className="text-xs text-gray-500">godz. {cls.time} · sala {cls.room}</div>
                    </div>
                    <button className="text-xs text-violet-500 hover:text-violet-700 font-medium cursor-pointer">
                      Nagraj →
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent recordings */}
          <motion.div variants={itemVariants}>
            <Card padding="lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-500" />
                  Ostatnie nagrania
                </h3>
                <button
                  onClick={() => navigate('/teacher/recordings')}
                  className="text-xs text-violet-500 hover:text-violet-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  Wszystkie <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {recentRecordings.map((rec) => {
                  const statusMap: Record<string, { label: string; variant: 'purple' | 'green' | 'yellow' | 'blue' | 'rose' | 'gray' }> = {
                    raw: { label: 'Surowe', variant: 'gray' },
                    transcribing: { label: 'Transkrybowanie...', variant: 'yellow' },
                    transcribed: { label: 'Do przejrzenia', variant: 'blue' },
                    has_note: { label: 'Notatka gotowa', variant: 'green' },
                    rejected: { label: 'Odrzucone', variant: 'rose' },
                  };
                  const s = statusMap[rec.status] ?? statusMap['raw'];
                  return (
                    <div
                      key={rec.id}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/teacher/recordings')}
                    >
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: rec.thumbnailColor ?? '#e9d5ff' }}
                      >
                        <Mic className="w-4 h-4 text-violet-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate">
                          {rec.topicName ?? 'Lekcja bez tematu'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {rec.className} · {format(parseISO(rec.date), 'd MMM', { locale: pl })} · {formatDuration(rec.durationSeconds)}
                        </div>
                      </div>
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </div>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="mt-4"
                onClick={() => navigate('/teacher/recordings')}
              >
                Pokaż wszystkie nagrania
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Quick tip */}
        <motion.div variants={itemVariants} className="mt-6">
          <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-800">Wskazówka AI</div>
              <div className="text-xs text-amber-700">3 uczniów z klasy 7A nie otworzyło jeszcze notatki z "Funkcji liniowej". Może warto przypomnieć?</div>
            </div>
            <Button variant="secondary" size="sm">
              <Clock className="w-3 h-3" />
              Sprawdź
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
