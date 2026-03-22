import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, CalendarCheck,
  User, GraduationCap, Sparkles, LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/student', label: 'Strona główna', icon: LayoutDashboard, end: true },
  { to: '/student/lessons', label: 'Moje lekcje', icon: BookOpen },
  { to: '/student/exams', label: 'Egzaminy', icon: CalendarCheck },
  { to: '/student/profile', label: 'Profil', icon: User },
];

export function StudentSidebar() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden">
      {/* Gradient background – sky/blue theme for student */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500 to-blue-700 pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />

      <div className="relative flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
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

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                    isActive ? 'bg-white/20' : 'bg-transparent'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Student card + logout */}
        <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
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
