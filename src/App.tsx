import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { StudentLayout } from './components/layout/StudentLayout';
import { Login } from './pages/Login';
// Teacher pages
import { Dashboard } from './pages/teacher/Dashboard';
import { Schedule } from './pages/teacher/schedule';
import { ScheduleTemplates } from './pages/teacher/ScheduleTemplates';
import { Recordings } from './pages/teacher/recordings';
import { Tests } from './pages/teacher/Tests';
import { Profile } from './pages/teacher/Profile';
// Student pages
import { StudentDashboard } from './pages/student/Dashboard';
import { StudentExams } from './pages/student/Exams';
import { StudentProfile } from './pages/student/Profile';
import { SubjectPage } from './pages/student/subject';

function AppRoutes() {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={role === 'student' ? '/student' : '/teacher'} replace />} />

      {/* Teacher routes */}
      <Route path="/teacher" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="schedule-templates" element={<ScheduleTemplates />} />
        <Route path="recordings" element={<Recordings />} />
        <Route path="tests" element={<Tests />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Student routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="subject/:subject" element={<SubjectPage />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route path="*" element={<Navigate to={role === 'student' ? '/student' : '/teacher'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
