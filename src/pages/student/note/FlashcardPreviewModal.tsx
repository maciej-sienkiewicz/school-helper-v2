import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Check, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { FlashcardPhase } from './types';

interface Props {
  state: FlashcardPhase;
  onConfirm: () => void;
  onDiscard: () => void;
}

function CardFace({
  side,
  text,
  flipped,
}: {
  side: 'front' | 'back';
  text: string;
  flipped: boolean;
}) {
  const isFront = side === 'front';

  const gradient = isFront
    ? 'linear-gradient(145deg, #7c3aed 0%, #4c1d95 100%)'
    : 'linear-gradient(145deg, #1d4ed8 0%, #1e3a8a 100%)';

  const label = isFront ? 'HASŁO' : 'WYJAŚNIENIE';

  const faceStyle: React.CSSProperties = {
    backfaceVisibility: 'hidden',
    transform: isFront ? undefined : 'rotateY(180deg)',
    background: gradient,
  };

  return (
    <div
      className="absolute inset-0 rounded-2xl flex flex-col overflow-hidden shadow-lg"
      style={faceStyle}
    >
      {/* Subtle dot-grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Inner frame border */}
      <div className="absolute inset-3 rounded-xl border border-white/20 pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-sm" />
      <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr-sm" />
      <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl-sm" />
      <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-sm" />

      {/* Label top */}
      <div className="relative flex justify-center pt-6">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
          {label}
        </span>
      </div>

      {/* Main text — centered */}
      <div className="relative flex-1 flex items-center justify-center px-8 py-2">
        <p
          className="text-white text-center font-bold leading-snug"
          style={{
            fontSize: text.length > 80 ? '0.85rem' : text.length > 40 ? '1rem' : '1.2rem',
            textShadow: '0 1px 8px rgba(0,0,0,0.3)',
          }}
        >
          {text}
        </p>
      </div>

      {/* Flip hint bottom */}
      <div className="relative flex justify-center pb-5">
        <span className="text-[9px] font-semibold tracking-widest text-white/30 uppercase">
          {isFront ? (flipped ? '' : 'kliknij aby obrócić') : 'kliknij aby wrócić'}
        </span>
      </div>
    </div>
  );
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
              <div className="mb-4 select-none" style={{ perspective: '1200px' }}>
                <motion.div
                  className="relative w-full cursor-pointer"
                  style={{
                    height: '240px',
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                  onClick={() => setIsFlipped(f => !f)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CardFace side="front" text={state.card.front} flipped={isFlipped} />
                  <CardFace side="back" text={state.card.back} flipped={isFlipped} />
                </motion.div>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mb-5">
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: !isFlipped ? '20px' : '8px',
                    height: '8px',
                    background: !isFlipped ? '#7c3aed' : '#e2e8f0',
                  }}
                />
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isFlipped ? '20px' : '8px',
                    height: '8px',
                    background: isFlipped ? '#1d4ed8' : '#e2e8f0',
                  }}
                />
              </div>

              {/* Actions */}
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
