import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, PenLine } from 'lucide-react';
import { mockStudentLessons } from '../../../data/mockData';
import { FlashcardMode } from './studylab/FlashcardMode';
import { BlurtingMode } from './studylab/BlurtingMode';
import { UserFlashcards } from './studylab/UserFlashcards';
import { extractFlashcards } from './studylab/types';

type Mode = 'cards' | 'blurt';

export function TabStudyLab({ subject }: { subject: string }) {
  const [mode, setMode] = useState<Mode>('cards');
  const lessons = useMemo(() => mockStudentLessons.filter(l => l.subject === subject), [subject]);
  const flashcards = useMemo(() => extractFlashcards(lessons), [lessons]);

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
        {(['cards', 'blurt'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${mode === m ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {m === 'cards' ? <Zap className="w-4 h-4" /> : <PenLine className="w-4 h-4" />}
            {m === 'cards' ? 'Fiszki' : 'Blurting'}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-2xl bg-violet-50 border border-violet-100">
        <Zap className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-violet-700">
          {mode === 'cards'
            ? 'Fiszki są automatycznie generowane z notatek nauczyciela. Własne fiszki dodasz zaznaczając tekst w notatce.'
            : 'Blurting — technika aktywnego przypominania. Napisz wszystko, co pamiętasz, a potem sprawdź.'}
        </p>
      </div>

      {/* User flashcards (only in cards mode) */}
      {mode === 'cards' && <UserFlashcards />}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
          {mode === 'cards' && <FlashcardMode cards={flashcards} />}
          {mode === 'blurt' && <BlurtingMode lessons={lessons} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
