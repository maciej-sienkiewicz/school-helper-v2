import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockTeacher, mockStudent } from '../data/mockData';
import type { Teacher, Student } from '../types';

type UserRole = 'teacher' | 'student';

interface AuthState {
  role: UserRole;
  teacher: Teacher | null;
  student: Student | null;
}

interface AuthContextValue extends AuthState {
  loginAsTeacher: () => void;
  loginAsStudent: () => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);

  const loginAsTeacher = () =>
    setAuth({ role: 'teacher', teacher: mockTeacher, student: null });

  const loginAsStudent = () =>
    setAuth({ role: 'student', teacher: null, student: mockStudent });

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider
      value={{
        role: auth?.role ?? 'teacher',
        teacher: auth?.teacher ?? null,
        student: auth?.student ?? null,
        loginAsTeacher,
        loginAsStudent,
        logout,
        isLoggedIn: auth !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
