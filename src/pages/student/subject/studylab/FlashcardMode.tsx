import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCw } from 'lucide-react';
import { renderMarkdown } from '../shared';
import type { Flashcard } from './types';

export function FlashcardMode({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  if (cards.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">Brak notatek — fiszki zostaną wygenerowane po dodaniu treści przez nauczyciela.</p>;
  }

  const card = cards[index];
  const go = (dir: 1 | -1) => {
    setIndex(i => (i + dir + cards.length) % cards.length);
    setFlipped(false);
  };
  const toggleKnown = () => {
    setKnown(s => { const n = new Set(s); n.has(index) ? n.delete(index) : n.add(index); return n; });
    go(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{index + 1} / {cards.length} fiszek</span>
        <span className="text-emerald-600 font-semibold">{known.size} opanowanych</span>
      </div>

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

      <div className="flex items-center gap-3">
        <button onClick={() => go(-1)} className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={toggleKnown}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${known.has(index) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {known.has(index) ? 'Opanowane' : 'Oznacz jako opanowane'}
        </button>
        <button onClick={() => go(1)} className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {known.size > 0 && (
        <button onClick={() => { setKnown(new Set()); setIndex(0); setFlipped(false); }} className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <RotateCw className="w-3.5 h-3.5" /> Resetuj postęp
        </button>
      )}
    </div>
  );
}
