import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Check, Loader2, CheckCircle2 } from 'lucide-react';
import type { FlashcardPhase } from './types';

interface Props {
  state: FlashcardPhase;
  onConfirm: () => void;
  onDiscard: () => void;
}

export function FlashcardPreviewModal({ state, onConfirm, onDiscard }: Props) {
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
        className="relative w-full max-w-md mx-4 mb-6 sm:mb-0 bg-white rounded-3xl shadow-2xl overflow-hidden"
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
                    <p className="text-xs text-gray-400">Sprawdź i zatwierdź</p>
                  </div>
                </div>
                <button
                  onClick={onDiscard}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2 mb-5">
                <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">Przód — pytanie</p>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{state.card.front}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tył — odpowiedź</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{state.card.back}</p>
                </div>
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
