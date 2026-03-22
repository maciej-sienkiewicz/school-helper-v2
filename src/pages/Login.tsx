import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, User, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { loginAsTeacher, loginAsStudent } = useAuth();
  const navigate = useNavigate();

  const handleTeacher = () => {
    loginAsTeacher();
    navigate('/teacher');
  };

  const handleStudent = () => {
    loginAsStudent();
    navigate('/student');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SchoolHelper</h1>
          <p className="text-gray-500 mt-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>AI dla edukacji</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Wybierz konto</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            To jest wersja demo. Wybierz rolę, aby kontynuować.
          </p>

          <div className="space-y-3">
            {/* Teacher */}
            <button
              onClick={handleTeacher}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-violet-50 hover:border-violet-400 hover:bg-violet-100 transition-all duration-200 group cursor-pointer text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-md flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 group-hover:text-violet-700 transition-colors">
                  Anna Kowalska
                </div>
                <div className="text-sm text-gray-500">Nauczyciel · Matematyka, Fizyka</div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-600 text-xs font-semibold">
                Nauczyciel
              </div>
            </button>

            {/* Student */}
            <button
              onClick={handleStudent}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-sky-50 hover:border-sky-400 hover:bg-sky-100 transition-all duration-200 group cursor-pointer text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-md flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 group-hover:text-sky-700 transition-colors">
                  Kacper Wiśniewski
                </div>
                <div className="text-sm text-gray-500">Uczeń · Klasa 7A</div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-600 text-xs font-semibold">
                Uczeń
              </div>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Wersja demonstracyjna · Dane są przykładowe
        </p>
      </motion.div>
    </div>
  );
}
