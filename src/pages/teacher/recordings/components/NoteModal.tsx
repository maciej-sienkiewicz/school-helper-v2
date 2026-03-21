import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Share2, Trash2, XCircle, CheckCircle2, Edit3, Eye } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { ShareModal, scopeOptions } from './ShareModal';
import type { Note } from '../../../../types';

/** Renders plain-text document with visual heading detection */
function DocRenderer({ content }: { content: string }) {
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="font-[Georgia,serif] text-gray-800 space-y-4">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        // First paragraph = document title
        if (i === 0) {
          return (
            <h1 key={i} className="text-2xl font-bold text-gray-900 leading-snug font-sans pb-3 border-b border-gray-200">
              {trimmed}
            </h1>
          );
        }
        // Short line without trailing period/comma = section heading
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

interface NoteModalProps {
  note: Note;
  onClose: () => void;
  onAccept?: () => void;
  onDelete?: () => void;
}

export function NoteModal({ note, onClose, onAccept, onDelete }: NoteModalProps) {
  const [content, setContent] = useState(note.content);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [accepted, setAccepted] = useState(note.status === 'accepted');
  const [showShare, setShowShare] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    onAccept?.();
  };

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {showShare && (
          <ShareModal
            title={note.topicName ?? 'Notatka'}
            onClose={() => setShowShare(false)}
            onShare={(scope) => {
              const label = scopeOptions.find(s => s.scope === scope)?.label ?? scope;
              alert(`Udostępniono notatkę (${label})`);
            }}
          />
        )}
      </AnimatePresence>

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

            {accepted && <Badge variant="green">Zaakceptowana</Badge>}

            {/* Preview / Edit toggle */}
            <div className="flex p-0.5 bg-gray-100 rounded-xl gap-0.5">
              <button
                onClick={() => setMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'preview' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Podgląd
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'edit' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edytuj
              </button>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer ml-1">
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Document area */}
          <div className="flex-1 overflow-y-auto">
            {mode === 'preview' ? (
              <div className="px-10 py-8 max-w-2xl mx-auto">
                <DocRenderer content={content} />
              </div>
            ) : (
              <div className="px-6 py-4 h-full">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-full min-h-[400px] p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-700 font-mono leading-6 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="Treść notatki..."
                  spellCheck={false}
                />
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0 flex-wrap">
            {!accepted && (
              <Button variant="success" size="sm" icon={<CheckCircle2 className="w-4 h-4" />} onClick={handleAccept}>
                Zaakceptuj
              </Button>
            )}
            <Button variant="primary" size="sm" icon={<Share2 className="w-4 h-4" />} onClick={() => setShowShare(true)}>
              Udostępnij
            </Button>
            <div className="flex-1" />
            <Button variant="secondary" size="sm" onClick={onClose}>Zamknij</Button>
            <Button
              variant="danger" size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleDelete}
            >
              Usuń
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
