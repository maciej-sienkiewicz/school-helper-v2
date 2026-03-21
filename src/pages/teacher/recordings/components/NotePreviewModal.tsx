import { motion } from 'framer-motion';
import { FileText, XCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import type { Note } from '../../../../types';

interface NotePreviewModalProps {
  note: Note;
  onClose: () => void;
}

export function NotePreviewModal({ note, onClose }: NotePreviewModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-4xl shadow-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{note.topicName}</h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Podgląd notatki
              <Badge variant="green">Zaakceptowana</Badge>
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
            <XCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Streszczenie</label>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-700 leading-relaxed">
            {note.summary}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Kluczowe pojęcia</label>
          <div className="space-y-2">
            {note.concepts.map((c, i) => (
              <div key={i} className="flex gap-3 p-3 bg-violet-50 rounded-2xl">
                <div className="font-semibold text-sm text-violet-700 min-w-[140px]">{c.term}</div>
                <div className="text-sm text-gray-600">{c.definition}</div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="secondary" size="md" onClick={onClose}>Zamknij</Button>
      </motion.div>
    </motion.div>
  );
}
