import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Video,
  FlaskConical, User, GraduationCap, Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { mockTeacher } from '../../data/mockData';

const navItems = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/schedule', label: 'Klasy & Program', icon: Calendar },
  { to: '/teacher/recordings', label: 'Nagrania', icon: Video },
  { to: '/teacher/tests', label: 'Generator Testów', icon: FlaskConical },
  { to: '/teacher/profile', label: 'Profil', icon: User },
];

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600 to-violet-800 pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />

      <div className="relative flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">SchoolHelper</div>
            <div className="text-xs text-violet-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI dla nauczycieli
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
                    : 'text-violet-200 hover:text-white hover:bg-white/10'
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

        {/* Teacher card */}
        <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow">
              {mockTeacher.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{mockTeacher.name}</div>
              <div className="text-violet-300 text-xs truncate">{mockTeacher.subjects.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
