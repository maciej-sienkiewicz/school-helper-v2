import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';

export function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
