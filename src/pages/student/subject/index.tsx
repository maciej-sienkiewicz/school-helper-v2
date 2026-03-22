import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Zap, Globe } from 'lucide-react';
import { mockStudentLessons, mockExternalMaterials, mockStudentHomework } from '../../../data/mockData';
import { SubjectHeader }   from './SubjectHeader';
import { TabLessons }      from './TabLessons';
import { TabStudyLab }     from './TabStudyLab';
import { TabExplore }      from './TabExplore';
import { SidebarExams }    from './SidebarExams';
import { SidebarHomework } from './SidebarHomework';

// ─── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'lessons',  label: 'Lekcje i Notatki', icon: BookOpen },
  { id: 'studylab', label: 'Study Lab',         icon: Zap      },
  { id: 'explore',  label: 'Eksploruj',         icon: Globe    },
] as const;

type TabId = typeof TABS[number]['id'];

// ─── SubjectPage ───────────────────────────────────────────────────────────────

export function SubjectPage() {
  const { subject: encoded } = useParams<{ subject: string }>();
  const subject = encoded ? decodeURIComponent(encoded) : null;
  const [activeTab, setActiveTab] = useState<TabId>('lessons');

  if (!subject) return <Navigate to="/student" replace />;

  const allHomework = mockStudentHomework.filter(h => h.subject === subject);
  const [doneIds, setDoneIds] = useState<Set<string>>(
    new Set(allHomework.filter(h => h.done).map(h => h.id))
  );
  const toggleDone = (id: string) =>
    setDoneIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const counts: Record<TabId, number> = {
    lessons:  mockStudentLessons.filter(l => l.subject === subject).length,
    studylab: mockStudentLessons.filter(l => l.subject === subject && l.noteContent).length,
    explore:  mockExternalMaterials.filter(m => m.subject === subject).length,
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">

      {/* ── Full-width header ─────────────────────────────────────────────────── */}
      <SubjectHeader subject={subject} />

      {/* ── Two-column body ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Main column (2/3) ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Segmented control */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-semibold transition-all cursor-pointer min-h-[44px] ${
                    active ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                  {counts[id] > 0 && (
                    <span className={`text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-bold flex-shrink-0 ${
                      active ? 'bg-sky-100 text-sky-600' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {counts[id]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'lessons'  && <TabLessons  subject={subject} doneIds={doneIds} onToggleDone={toggleDone} />}
              {activeTab === 'studylab' && <TabStudyLab subject={subject} />}
              {activeTab === 'explore'  && <TabExplore  subject={subject} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Sidebar (1/3) ──────────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <SidebarExams    subject={subject} />
          <SidebarHomework subject={subject} doneIds={doneIds} onToggleDone={toggleDone} />
        </div>

      </div>
    </div>
  );
}
