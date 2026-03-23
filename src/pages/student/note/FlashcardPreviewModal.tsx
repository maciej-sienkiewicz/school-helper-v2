import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Check, Loader2, CheckCircle2, Pencil, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { FlashcardPhase } from './types';

interface Props {
  state: FlashcardPhase;
  onConfirm: (card: { front: string; back: string }) => void;
  onDiscard: () => void;
  onChooseAI: (sourceText: string) => void;
  onChooseManual: (sourceText: string) => void;
}

// ─── Card face ────────────────────────────────────────────────────────────────

function CardFace({ side, text }: { side: 'front' | 'back'; text: string }) {
  const isFront = side === 'front';
  const gradient = isFront
    ? 'linear-gradient(145deg, #7c3aed 0%, #4c1d95 100%)'
    : 'linear-gradient(145deg, #1d4ed8 0%, #1e3a8a 100%)';
  const label = isFront ? 'HASŁO' : 'WYJAŚNIENIE';
  const hint = isFront ? 'kliknij aby obrócić' : 'kliknij aby wrócić';

  return (
    <div
      className="absolute inset-0 rounded-2xl flex flex-col overflow-hidden shadow-lg"
      style={{
        backfaceVisibility: 'hidden',
        transform: isFront ? undefined : 'rotateY(180deg)',
        background: gradient,
      }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      {/* Inner frame */}
      <div className="absolute inset-3 rounded-xl border border-white/20 pointer-events-none" />
      {/* Corner accents */}
      <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-sm" />
      <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr-sm" />
      <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl-sm" />
      <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-sm" />

      <div className="relative flex justify-center pt-6">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{label}</span>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-8 py-2">
        {text ? (
          <p
            className="text-white text-center font-bold leading-snug"
            style={{
              fontSize: text.length > 80 ? '0.85rem' : text.length > 40 ? '1rem' : '1.2rem',
              textShadow: '0 1px 8px rgba(0,0,0,0.3)',
            }}
          >
            {text}
          </p>
        ) : (
          <p className="text-white/30 text-sm italic text-center">Brak treści — edytuj poniżej</p>
        )}
      </div>

      <div className="relative flex justify-center pb-5">
        <span className="text-[9px] font-semibold tracking-widest text-white/30 uppercase">{hint}</span>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function FlashcardPreviewModal({ state, onConfirm, onDiscard, onChooseAI, onChooseManual }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editedFront, setEditedFront] = useState('');
  const [editedBack, setEditedBack] = useState('');

  useEffect(() => {
    if (state.phase === 'preview') {
      setIsFlipped(false);
      setEditedFront(state.card.front);
      setEditedBack(state.card.back);
      // Auto-open edit panel when card comes from manual entry (empty front)
      setEditOpen(!state.card.front);
    }
  }, [state.phase]);

  const canConfirm = editedFront.trim().length > 0 && editedBack.trim().length > 0;

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={state.phase !== 'loading' ? onDiscard : undefined}
      />

      <motion.div
        className="relative w-full max-w-md mx-4 mb-6 sm:mb-0 bg-white rounded-3xl shadow-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="wait">

          {/* ── Loading ── */}
          {state.phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-10 flex flex-col items-center gap-4"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 className="w-8 h-8 text-violet-500" />
              </motion.div>
              <p className="text-sm text-gray-500 font-medium">Generuję fiszkę z zaznaczonego tekstu…</p>
            </motion.div>
          )}

          {/* ── Choose method ── */}
          {state.phase === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Nowa fiszka</p>
                    <p className="text-xs text-gray-400">Jak chcesz ją wypełnić?</p>
                  </div>
                </div>
                <button
                  onClick={onDiscard}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Manual */}
                <button
                  onClick={() => onChooseManual(state.sourceText)}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all cursor-pointer group text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-violet-100 flex items-center justify-center transition-colors">
                    <Pencil className="w-5 h-5 text-gray-500 group-hover:text-violet-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 text-center">Wpisz sam</p>
                    <p className="text-[11px] text-gray-400 text-center leading-snug mt-0.5">
                      Samodzielnie określ hasło i wyjaśnienie
                    </p>
                  </div>
                </button>

                {/* AI */}
                <button
                  onClick={() => onChooseAI(state.sourceText)}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all cursor-pointer group text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-violet-100/0 group-hover:from-violet-50/60 group-hover:to-violet-100/40 transition-all" />
                  <div className="relative w-11 h-11 rounded-xl bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center transition-colors">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="relative">
                    <p className="text-sm font-bold text-gray-800 text-center">AI uzupełni</p>
                    <p className="text-[11px] text-gray-400 text-center leading-snug mt-0.5">
                      Wygeneruj fiszkę z zaznaczonego tekstu
                    </p>
                  </div>
                  <span className="relative text-[9px] font-black uppercase tracking-widest text-violet-500 bg-violet-100 px-2 py-0.5 rounded-full">
                    Auto
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Preview ── */}
          {state.phase === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Nowa fiszka</p>
                    <p className="text-xs text-gray-400">Kliknij kartę, aby ją obrócić</p>
                  </div>
                </div>
                <button
                  onClick={onDiscard}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* 3D Flip Card */}
              <div className="mb-3 select-none" style={{ perspective: '1200px' }}>
                <motion.div
                  className="relative w-full cursor-pointer"
                  style={{ height: '220px', transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                  onClick={() => setIsFlipped(f => !f)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CardFace side="front" text={editedFront} />
                  <CardFace side="back" text={editedBack} />
                </motion.div>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mb-3">
                <div className="rounded-full transition-all duration-300" style={{ width: !isFlipped ? '20px' : '8px', height: '8px', background: !isFlipped ? '#7c3aed' : '#e2e8f0' }} />
                <div className="rounded-full transition-all duration-300" style={{ width: isFlipped ? '20px' : '8px', height: '8px', background: isFlipped ? '#1d4ed8' : '#e2e8f0' }} />
              </div>

              {/* Edit toggle */}
              <button
                onClick={() => setEditOpen(o => !o)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-violet-600 hover:bg-violet-50 transition-colors cursor-pointer mb-3"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edytuj treść
                {editOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Edit panel */}
              <AnimatePresence>
                {editOpen && (
                  <motion.div
                    key="edit-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 pb-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-violet-500 mb-1 ml-1">
                          Hasło (przód)
                        </label>
                        <textarea
                          value={editedFront}
                          onChange={e => setEditedFront(e.target.value)}
                          rows={2}
                          placeholder="Wpisz hasło lub pytanie…"
                          className="w-full rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-gray-800 font-semibold placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1 ml-1">
                          Wyjaśnienie (tył)
                        </label>
                        <textarea
                          value={editedBack}
                          onChange={e => setEditedBack(e.target.value)}
                          rows={3}
                          placeholder="Wpisz odpowiedź lub wyjaśnienie…"
                          className="w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onDiscard}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-600 transition-colors cursor-pointer"
                >
                  Porzuć
                </button>
                <button
                  onClick={() => canConfirm && onConfirm({ front: editedFront, back: editedBack })}
                  disabled={!canConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Zatwierdź
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Saved ── */}
          {state.phase === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-10 flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Fiszka dodana!</p>
                <p className="text-sm text-gray-400 mt-1">Znajdziesz ją w Laboratorium nauki → Fiszki</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
