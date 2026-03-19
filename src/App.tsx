import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/teacher/Dashboard';
import { Schedule } from './pages/teacher/Schedule';
import { ScheduleTemplates } from './pages/teacher/ScheduleTemplates';
import { Recordings } from './pages/teacher/Recordings';
import { Tests } from './pages/teacher/Tests';
import { Profile } from './pages/teacher/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/teacher" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="schedule-templates" element={<ScheduleTemplates />} />
          <Route path="recordings" element={<Recordings />} />
          <Route path="tests" element={<Tests />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
