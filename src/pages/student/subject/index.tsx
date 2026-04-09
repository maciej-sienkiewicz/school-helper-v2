import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockStudentHomework } from '../../../data/mockData';
import { SubjectHeader }   from './SubjectHeader';
import { UpcomingStrip }   from './UpcomingStrip';
import { TabLessons }      from './TabLessons';
import { TabStudyLab }     from './TabStudyLab';
import { TabExplore }      from './TabExplore';

// ─── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'lessons',  label: 'Lekcje'    },
  { id: 'studylab', label: 'Ćwicz'     },
  { id: 'explore',  label: 'Materiały' },
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
    setDoneIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-7">

        {/* ── Nagłówek ─────────────────────────────────────────────────────────── */}
        <SubjectHeader subject={subject} />

        {/* ── Pilne: zadania i sprawdziany ─────────────────────────────────────── */}
        <UpcomingStrip subject={subject} doneIds={doneIds} onToggleDone={toggleDone} />

        {/* ── Nawigacja zakładkowa ─────────────────────────────────────────────── */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-5 py-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                  activeTab === id
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Zawartość zakładki ───────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {activeTab === 'lessons'  && <TabLessons  subject={subject} doneIds={doneIds} onToggleDone={toggleDone} />}
            {activeTab === 'studylab' && <TabStudyLab subject={subject} />}
            {activeTab === 'explore'  && <TabExplore  subject={subject} />}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
