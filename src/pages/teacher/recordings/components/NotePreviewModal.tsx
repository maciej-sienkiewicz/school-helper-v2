import { motion } from 'framer-motion';
import { FileText, XCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import type { Note } from '../../../../types';

function DocRenderer({ content }: { content: string }) {
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="font-[Georgia,serif] text-gray-800 space-y-4">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (i === 0) {
          return (
            <h1 key={i} className="text-2xl font-bold text-gray-900 leading-snug font-sans pb-3 border-b border-gray-200">
              {trimmed}
            </h1>
          );
        }
        const isHeading = trimmed.length < 80 && !trimmed.endsWith('.') && !trimmed.endsWith(',') && !trimmed.includes('\n');
        if (isHeading) {
          return (
            <h2 key={i} className="text-base font-bold text-violet-700 mt-6 mb-1 font-sans">
              {trimmed}
            </h2>
          );
        }
        return (
          <p key={i} className="text-sm leading-7 text-gray-700">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

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
        initial={{ scale: 0.97, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl flex flex-col w-full max-w-3xl max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <FileText className="w-4 h-4 text-violet-500" />
          <span className="font-semibold text-gray-800 text-sm flex-1 truncate">{note.topicName}</span>
          <Badge variant="green">Zaakceptowana</Badge>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer ml-1">
            <XCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Document */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-10 py-8 max-w-2xl mx-auto">
            <DocRenderer content={note.content} />
          </div>
        </div>

        <div className="flex px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>Zamknij</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
