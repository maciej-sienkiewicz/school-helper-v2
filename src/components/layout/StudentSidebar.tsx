import { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck,
  User, GraduationCap, Sparkles, LogOut,
  ChevronDown, ChevronRight, BookOpen
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { mockStudentLessons } from '../../data/mockData';

// derive unique subjects from lessons
const studentSubjects = [...new Set(mockStudentLessons.map(l => l.subject))];

const subjectColors: Record<string, string> = {
  'Matematyka': '#bae6fd',
  'Fizyka': '#d1fae5',
  'Chemia': '#fde68a',
  'Biologia': '#a7f3d0',
  'Historia': '#fecdd3',
};

function subjectColor(s: string) {
  return subjectColors[s] ?? '#e9d5ff';
}

export function StudentSidebar() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const params = useParams<{ subject?: string }>();
  const [lessonsOpen, setLessonsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentSubject = params.subject ? decodeURIComponent(params.subject) : null;

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500 to-blue-700 pointer-events-none" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />

      <div className="relative flex flex-col h-full p-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">SchoolHelper</div>
            <div className="text-xs text-sky-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Portal ucznia
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {/* Dashboard */}
          <NavLink
            to="/student"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-sky-200 hover:text-white hover:bg-white/10'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', isActive ? 'bg-white/20' : '')}>
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                Strona główna
              </>
            )}
          </NavLink>

          {/* Moje lekcje – accordion */}
          <div>
            <button
              onClick={() => setLessonsOpen(o => !o)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer',
                lessonsOpen || currentSubject
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-sky-200 hover:text-white hover:bg-white/10'
              )}
            >
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', lessonsOpen ? 'bg-white/20' : '')}>
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left">Moje lekcje</span>
              {lessonsOpen
                ? <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                : <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              }
            </button>

            {/* Subject sub-items */}
            {lessonsOpen && (
              <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-white/20 pl-3">
                {studentSubjects.map(subject => {
                  const isActive = currentSubject === subject;
                  const color = subjectColor(subject);
                  return (
                    <NavLink
                      key={subject}
                      to={`/student/subject/${encodeURIComponent(subject)}`}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-white/25 text-white shadow-sm'
                          : 'text-sky-200 hover:text-white hover:bg-white/10'
                      )}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {subject}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Egzaminy */}
          <NavLink
            to="/student/exams"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-sky-200 hover:text-white hover:bg-white/10'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', isActive ? 'bg-white/20' : '')}>
                  <CalendarCheck className="w-4 h-4" />
                </div>
                Wszystkie egzaminy
              </>
            )}
          </NavLink>

          {/* Profil */}
          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-sky-200 hover:text-white hover:bg-white/10'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', isActive ? 'bg-white/20' : '')}>
                  <User className="w-4 h-4" />
                </div>
                Profil
              </>
            )}
          </NavLink>
        </nav>

        {/* Student card + logout */}
        <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow">
              {student?.name.split(' ').map(n => n[0]).join('') ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{student?.name ?? 'Uczeń'}</div>
              <div className="text-sky-300 text-xs truncate">Klasa {student?.className}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Wyloguj"
              className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-sky-200" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
