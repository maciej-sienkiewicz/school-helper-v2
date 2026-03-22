import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, PenLine, RotateCw, ChevronLeft, ChevronRight, Eye, CheckCircle2 } from 'lucide-react';
import { mockStudentLessons } from '../../../data/mockData';
import type { StudentLesson } from '../../../types';
import { renderMarkdown } from './shared';

// ─── Flashcard generation from lesson note markdown ────────────────────────────

interface Flashcard {
  front: string;
  back: string;
  lessonTopic: string;
  color: string;
}

function extractFlashcards(lessons: StudentLesson[]): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const lesson of lessons) {
    if (!lesson.noteContent) continue;
    let heading = '';
    let body: string[] = [];
    for (const line of lesson.noteContent.split('\n')) {
      if (line.startsWith('## ')) {
        if (heading && body.some(l => l.trim())) {
          cards.push({ front: heading, back: body.join('\n'), lessonTopic: lesson.topicName, color: lesson.thumbnailColor });
        }
        heading = line.slice(3);
        body = [];
      } else if (heading && !line.startsWith('# ')) {
        body.push(line);
      }
    }
    if (heading && body.some(l => l.trim())) {
      cards.push({ front: heading, back: body.join('\n'), lessonTopic: lesson.topicName, color: lesson.thumbnailColor });
    }
  }
  return cards;
}

// ─── Mode: Flashcards ─────────────────────────────────────────────────────────

function FlashcardMode({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  if (cards.length === 0)
    return <p className="text-gray-400 text-sm text-center py-8">Brak notatek — fiszki zostaną wygenerowane po dodaniu treści przez nauczyciela.</p>;

  const card = cards[index];
  const go = (dir: 1 | -1) => {
    setIndex(i => (i + dir + cards.length) % cards.length);
    setFlipped(false);
  };

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{index + 1} / {cards.length} fiszek</span>
        <span className="text-emerald-600 font-semibold">{known.size} opanowanych</span>
      </div>

      {/* Flashcard */}
      <motion.div
        key={`${index}-${flipped}`}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        onClick={() => setFlipped(f => !f)}
        className="cursor-pointer select-none"
      >
        <div
          className="rounded-3xl shadow-card p-6 min-h-[180px] flex flex-col justify-between border-2 transition-colors"
          style={{ borderColor: flipped ? card.color : '#e5e7eb', backgroundColor: flipped ? `${card.color}22` : 'white' }}
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              {flipped ? 'Odpowiedź' : 'Pytanie'} &mdash; {card.lessonTopic}
            </div>
            {flipped
              ? <div className="text-sm">{renderMarkdown(card.back)}</div>
              : <p className="text-lg font-bold text-gray-800">{card.front}</p>
            }
          </div>
          <p className="text-xs text-gray-400 mt-4 text-right">
            {flipped ? 'Kliknij, aby schować' : 'Kliknij, aby odkryć odpowiedź'}
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => go(-1)}
          className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={() => { setKnown(s => { const n = new Set(s); n.has(index) ? n.delete(index) : n.add(index); return n; }); go(1); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${known.has(index) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {known.has(index) ? 'Opanowane' : 'Oznacz jako opanowane'}
        </button>

        <button
          onClick={() => go(1)}
          className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Reset */}
      {known.size > 0 && (
        <button
          onClick={() => { setKnown(new Set()); setIndex(0); setFlipped(false); }}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" /> Resetuj postęp
        </button>
      )}
    </div>
  );
}

// ─── Mode: Blurting ───────────────────────────────────────────────────────────

function BlurtingMode({ lessons }: { lessons: StudentLesson[] }) {
  const withNotes = lessons.filter(l => l.noteContent);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userText, setUserText] = useState('');
  const [revealed, setRevealed] = useState(false);

  const selected = withNotes.find(l => l.id === selectedId);

  if (withNotes.length === 0)
    return <p className="text-gray-400 text-sm text-center py-8">Brak notatek do powtórki.</p>;

  if (!selected) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 font-medium">Wybierz temat do powtórzenia techniką blurtingu:</p>
        {withNotes.map(l => (
          <button
            key={l.id}
            onClick={() => { setSelectedId(l.id); setUserText(''); setRevealed(false); }}
            className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-sky-200 hover:bg-sky-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: l.thumbnailColor }} />
              <div>
                <div className="text-sm font-bold text-gray-800">{l.topicName}</div>
                <div className="text-xs text-gray-500">{l.unitName}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setSelectedId(null)}
        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Zmień temat
      </button>

      <div className="p-4 rounded-2xl border-2 border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selected.thumbnailColor }} />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{selected.unitName}</span>
        </div>
        <p className="text-base font-bold text-gray-800">{selected.topicName}</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
          Napisz wszystko, co pamiętasz o tym temacie
        </label>
        <textarea
          value={userText}
          onChange={e => setUserText(e.target.value)}
          rows={6}
          disabled={revealed}
          placeholder="Wpisz tutaj to, co wiesz o tym temacie — bez zaglądania do notatki..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none disabled:opacity-60"
        />
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          disabled={!userText.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white font-semibold transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" /> Odkryj notatkę nauczyciela
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sky-50 border border-sky-200 rounded-3xl p-5"
          >
            <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-3">Notatka nauczyciela</p>
            <div className="text-sm">{renderMarkdown(selected.noteContent!)}</div>
          </motion.div>
        </AnimatePresence>
      )}

      {revealed && (
        <button
          onClick={() => { setUserText(''); setRevealed(false); setSelectedId(null); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <RotateCw className="w-4 h-4" /> Wybierz inny temat
        </button>
      )}
    </div>
  );
}

// ─── Tab component ─────────────────────────────────────────────────────────────

type Mode = 'cards' | 'blurt';

export function TabStudyLab({ subject }: { subject: string }) {
  const [mode, setMode] = useState<Mode>('cards');
  const lessons = mockStudentLessons.filter(l => l.subject === subject);
  const flashcards = useMemo(() => extractFlashcards(lessons), [subject]);

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
        <button
          onClick={() => setMode('cards')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${mode === 'cards' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Zap className="w-4 h-4" /> Fiszki
        </button>
        <button
          onClick={() => setMode('blurt')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${mode === 'blurt' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <PenLine className="w-4 h-4" /> Blurting
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-2xl bg-violet-50 border border-violet-100">
        <Zap className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-violet-700">
          {mode === 'cards'
            ? 'Fiszki są automatycznie generowane z notatek Twojego nauczyciela.'
            : 'Blurting — technika aktywnego przypominania. Napisz wszystko, co pamiętasz, a potem sprawdź.'}
        </p>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
        >
          {mode === 'cards' && <FlashcardMode cards={flashcards} />}
          {mode === 'blurt' && <BlurtingMode lessons={lessons} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
