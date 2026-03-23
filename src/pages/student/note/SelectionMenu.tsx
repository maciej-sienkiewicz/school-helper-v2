import { motion } from 'framer-motion';
import { MessageSquare, Zap } from 'lucide-react';
import type { SelectionState } from './types';

interface Props {
  sel: SelectionState;
  onAddFlashcard: (text: string) => void;
  onComment: (text: string) => void;
}

export function SelectionMenu({ sel, onAddFlashcard, onComment }: Props) {
  const menuY = Math.max(8, sel.y - 46);
  const menuX = Math.min(Math.max(80, sel.x), window.innerWidth - 80);

  return (
    <motion.div
      id="sh-selection-menu"
      className="fixed z-[500] flex items-center bg-gray-900 rounded-xl shadow-2xl overflow-visible select-none"
      style={{ left: menuX, top: menuY, transform: 'translateX(-50%)' }}
      initial={{ opacity: 0, scale: 0.88, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 4 }}
      transition={{ duration: 0.12 }}
    >
      <button
        onMouseDown={e => { e.preventDefault(); onComment(sel.text); }}
        className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/10 transition-colors cursor-pointer"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Skomentuj
      </button>

      <div className="w-px h-5 bg-gray-700 flex-shrink-0" />

      <button
        onMouseDown={e => { e.preventDefault(); onAddFlashcard(sel.text); }}
        className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-violet-300 hover:bg-white/10 transition-colors cursor-pointer"
      >
        <Zap className="w-3.5 h-3.5" />
        Dodaj fiszkę
      </button>

      {/* Arrow pointing down toward selection */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid #111827',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
    </motion.div>
  );
}
