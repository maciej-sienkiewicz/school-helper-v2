import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ClipboardList, Zap, Globe } from 'lucide-react';
import {
  mockStudentLessons, mockStudentExams,
  mockStudentHomework, mockExternalMaterials,
} from '../../../data/mockData';
import { SubjectHeader } from './SubjectHeader';
import { TabLessons }    from './TabLessons';
import { TabTasks }      from './TabTasks';
import { TabStudyLab }   from './TabStudyLab';
import { TabExplore }    from './TabExplore';

// ─── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'lessons',  label: 'Lekcje i Notatki', shortLabel: 'Lekcje',  icon: BookOpen    },
  { id: 'tasks',    label: 'Zadania i Egzaminy',shortLabel: 'Zadania', icon: ClipboardList },
  { id: 'studylab', label: 'Study Lab',         shortLabel: 'Lab',     icon: Zap          },
  { id: 'explore',  label: 'Eksploruj',         shortLabel: 'Eksploruj',icon: Globe        },
] as const;

type TabId = typeof TABS[number]['id'];

// ─── SubjectPage ───────────────────────────────────────────────────────────────

export function SubjectPage() {
  const { subject: encoded } = useParams<{ subject: string }>();
  const subject = encoded ? decodeURIComponent(encoded) : null;
  const [activeTab, setActiveTab] = useState<TabId>('lessons');

  if (!subject) return <Navigate to="/student" replace />;

  // Badge counts (pending/relevant items)
  const counts: Record<TabId, number> = {
    lessons:  mockStudentLessons.filter(l => l.subject === subject).length,
    tasks:    mockStudentHomework.filter(h => h.subject === subject && !h.done).length
            + mockStudentExams.filter(e => e.subject === subject).length,
    studylab: mockStudentLessons.filter(l => l.subject === subject && l.noteContent).length,
    explore:  mockExternalMaterials.filter(m => m.subject === subject).length,
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">

      {/* Header: info card + progress bar + focus countdown */}
      <SubjectHeader subject={subject} />

      {/* ── Segmented control ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-6">
        {TABS.map(({ id, label, shortLabel, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                active ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {/* Show short label on xs, full label from sm */}
              <span className="hidden sm:inline truncate">{label}</span>
              <span className="inline sm:hidden truncate">{shortLabel}</span>

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

      {/* ── Tab content ───────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'lessons'  && <TabLessons  subject={subject} />}
          {activeTab === 'tasks'    && <TabTasks    subject={subject} />}
          {activeTab === 'studylab' && <TabStudyLab subject={subject} />}
          {activeTab === 'explore'  && <TabExplore  subject={subject} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
