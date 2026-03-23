import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useUserFlashcards, flashcardStore } from '../../../../data/flashcardStore';

export function UserFlashcards() {
  const cards = useUserFlashcards();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;

  const card = cards[Math.min(index, cards.length - 1)];
  const go = (dir: 1 | -1) => {
    setIndex(i => Math.max(0, Math.min(cards.length - 1, i + dir)));
    setFlipped(false);
  };
  const remove = () => {
    flashcardStore.remove(card.id);
    setIndex(i => Math.max(0, i - 1));
    setFlipped(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-bold text-gray-800">Moje fiszki z notatek</span>
          <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded-full">{cards.length}</span>
        </div>
        <span className="text-xs text-gray-400">{Math.min(index + 1, cards.length)} / {cards.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id + flipped}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          onClick={() => setFlipped(f => !f)}
          className="cursor-pointer select-none"
        >
          <div className={`rounded-2xl p-5 min-h-[130px] flex flex-col justify-between border-2 transition-colors ${flipped ? 'bg-violet-50 border-violet-200' : 'bg-white border-gray-200'}`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {flipped ? 'Tył — odpowiedź' : 'Przód — pytanie'}
                </span>
                <button
                  onMouseDown={e => { e.stopPropagation(); remove(); }}
                  className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors"
                  title="Usuń fiszkę"
                >
                  <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                </button>
              </div>
              <p className={`text-sm leading-relaxed ${flipped ? 'text-gray-700' : 'font-semibold text-gray-800'}`}>
                {flipped ? card.back : card.front}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-right">
              {flipped ? 'Kliknij, aby schować' : 'Kliknij, aby odkryć'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {cards.length > 1 && (
        <div className="flex items-center gap-2">
          <button onClick={() => go(-1)} disabled={index === 0} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex-1 flex justify-center gap-1">
            {cards.map((_, i) => (
              <button key={i} onClick={() => { setIndex(i); setFlipped(false); }} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-violet-500' : 'bg-gray-300'}`} />
            ))}
          </div>
          <button onClick={() => go(1)} disabled={index === cards.length - 1} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {card.noteTopicName && (
        <p className="text-xs text-gray-400 text-center">
          Ze: <span className="font-medium">{card.noteTopicName}</span>
        </p>
      )}
    </div>
  );
}
