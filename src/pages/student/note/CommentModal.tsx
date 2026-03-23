import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X, Check, CheckCircle2 } from 'lucide-react';

interface Props {
  selectedText: string;
  onClose: () => void;
}

export function CommentModal({ selectedText, onClose }: Props) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    // Mock: in the future this would POST to the API
    setSaved(true);
    setTimeout(onClose, 1800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-md mx-4 mb-6 sm:mb-0 bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {!saved ? (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Komentarz</p>
                  <p className="text-xs text-gray-400">Do zaznaczonego fragmentu</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-1">Fragment</p>
              <p className="text-xs text-sky-800 leading-relaxed line-clamp-3">{selectedText}</p>
            </div>

            <textarea
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              placeholder="Napisz komentarz lub notatkę do tego fragmentu…"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-600 transition-colors cursor-pointer"
              >
                Anuluj
              </button>
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Dodaj
              </button>
            </div>
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center"
            >
              <CheckCircle2 className="w-8 h-8 text-sky-600" />
            </motion.div>
            <p className="font-bold text-gray-900">Komentarz dodany!</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
