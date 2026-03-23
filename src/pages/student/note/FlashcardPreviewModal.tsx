import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Check, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { FlashcardPhase } from './types';

interface Props {
  state: FlashcardPhase;
  onConfirm: () => void;
  onDiscard: () => void;
}

export function FlashcardPreviewModal({ state, onConfirm, onDiscard }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (state.phase === 'preview') setIsFlipped(false);
  }, [state.phase]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
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
          {state.phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-10 flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-8 h-8 text-violet-500" />
              </motion.div>
              <p className="text-sm text-gray-500 font-medium">Generuję fiszkę z zaznaczonego tekstu…</p>
            </motion.div>
          )}

          {state.phase === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-5"
            >
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
              <div className="mb-4 select-none" style={{ perspective: '1200px' }}>
                <div
                  className="relative w-full cursor-pointer"
                  style={{
                    height: '200px',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                  onClick={() => setIsFlipped(f => !f)}
                >
                  {/* Front face — hasło */}
                  <div
                    className="absolute inset-0 bg-violet-50 rounded-2xl p-5 border border-violet-100 flex flex-col"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">
                      Przód — hasło
                    </p>
                    <p className="text-base font-semibold text-gray-800 leading-snug flex-1 overflow-auto">
                      {state.card.front}
                    </p>
                    <p className="text-[11px] text-violet-300 mt-3 text-center">
                      Kliknij, aby zobaczyć wyjaśnienie →
                    </p>
                  </div>

                  {/* Back face — wyjaśnienie */}
                  <div
                    className="absolute inset-0 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                      Tył — wyjaśnienie
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1 overflow-auto">
                      {state.card.back}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-3 text-center">
                      ← Kliknij, aby wrócić do hasła
                    </p>
                  </div>
                </div>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mb-5">
                <div
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{ background: !isFlipped ? '#7c3aed' : '#e2e8f0' }}
                />
                <div
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{ background: isFlipped ? '#64748b' : '#e2e8f0' }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onDiscard}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-600 transition-colors cursor-pointer"
                >
                  Porzuć
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Zatwierdź
                </button>
              </div>
            </motion.div>
          )}

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
