import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, RotateCw, ChevronLeft } from 'lucide-react';
import { renderMarkdown } from '../shared';
import type { StudentLesson } from '../../../../types';

export function BlurtingMode({ lessons }: { lessons: StudentLesson[] }) {
  const withNotes = lessons.filter(l => l.noteContent);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userText, setUserText] = useState('');
  const [revealed, setRevealed] = useState(false);

  const selected = withNotes.find(l => l.id === selectedId);

  if (withNotes.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">Brak notatek do powtórki.</p>;
  }

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
      <button onClick={() => setSelectedId(null)} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer">
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
        <button onClick={() => setRevealed(true)} disabled={!userText.trim()} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white font-semibold transition-colors cursor-pointer">
          <Eye className="w-4 h-4" /> Odkryj notatkę nauczyciela
        </button>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-sky-50 border border-sky-200 rounded-3xl p-5">
            <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-3">Notatka nauczyciela</p>
            <div className="text-sm">{renderMarkdown(selected.noteContent!)}</div>
          </motion.div>
        </AnimatePresence>
      )}

      {revealed && (
        <button onClick={() => { setUserText(''); setRevealed(false); setSelectedId(null); }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          <RotateCw className="w-4 h-4" /> Wybierz inny temat
        </button>
      )}
    </div>
  );
}
