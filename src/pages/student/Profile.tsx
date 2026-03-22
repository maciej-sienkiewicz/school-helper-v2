import { motion } from 'framer-motion';
import { User, Mail, BookOpen, CalendarCheck, ThumbsUp, MessageCircle, LogOut } from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { mockStudentLessons, mockStudentExams } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export function StudentProfile() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalLikes = mockStudentLessons.reduce((s, l) => s + l.likes, 0);
  const totalComments = mockStudentLessons.reduce((s, l) => s + l.comments.length, 0);
  const lessonsWithNotes = mockStudentLessons.filter(l => l.noteId).length;
  const lessonsWithRecordings = mockStudentLessons.filter(l => l.recordingId).length;

  const stats = [
    { icon: BookOpen, label: 'Lekcje', value: mockStudentLessons.length, color: 'text-sky-500 bg-sky-50' },
    { icon: CalendarCheck, label: 'Egzaminy', value: mockStudentExams.length, color: 'text-amber-500 bg-amber-50' },
    { icon: ThumbsUp, label: 'Łapki pod materiałami', value: totalLikes, color: 'text-violet-500 bg-violet-50' },
    { icon: MessageCircle, label: 'Komentarze', value: totalComments, color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <SectionTitle icon={<User className="w-4 h-4" />} className="mb-2">
        Profil ucznia
      </SectionTitle>

      {/* Avatar + info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
              {student?.name.split(' ').map(n => n[0]).join('') ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">{student?.name}</h2>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <Mail className="w-3.5 h-3.5" />
                {student?.email}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                  Klasa {student?.className}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                  {student?.grade} klasa
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                  {student?.schoolType === 'primary' ? 'Szkoła podstawowa' : 'Liceum'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} padding="md" className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Material access */}
      <Card padding="lg">
        <h3 className="font-bold text-gray-700 mb-3 text-sm">Dostęp do materiałów</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Lekcje z notatką AI</span>
            <span className="font-bold text-sky-600">{lessonsWithNotes} / {mockStudentLessons.length}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Lekcje z nagraniem</span>
            <span className="font-bold text-violet-600">{lessonsWithRecordings} / {mockStudentLessons.length}</span>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Wyloguj się
      </button>
    </div>
  );
}
