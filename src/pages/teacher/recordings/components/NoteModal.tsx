import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Share2, Trash2, XCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { ShareModal, scopeOptions } from './ShareModal';
import type { Note } from '../../../../types';

interface NoteModalProps {
  note: Note;
  onClose: () => void;
  onAccept?: () => void;
  onDelete?: () => void;
}

export function NoteModal({ note, onClose, onAccept, onDelete }: NoteModalProps) {
  const [content, setContent] = useState(note.summary);
  const [status, setStatus] = useState<'editing' | 'accepted'>(note.status === 'accepted' ? 'accepted' : 'editing');
  const [showShare, setShowShare] = useState(false);

  const handleAccept = () => {
    setStatus('accepted');
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
              const scopeLabel = scopeOptions.find(s => s.scope === scope)?.label ?? scope;
              alert(`Udostępniono notatką (${scopeLabel})`);
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
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-4xl shadow-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{note.topicName}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Notatka AI
                {status === 'accepted' && <Badge variant="green" className="ml-2">Zaakceptowana</Badge>}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Streszczenie</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[100px]"
            />
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

          <div className="flex flex-wrap gap-3">
            {status !== 'accepted' && (
              <Button variant="success" size="md" icon={<CheckCircle2 className="w-4 h-4" />} onClick={handleAccept}>
                Zaakceptuj
              </Button>
            )}
            <Button variant="primary" size="md" icon={<Share2 className="w-4 h-4" />} onClick={() => setShowShare(true)}>
              Udostępnij
            </Button>
            <Button variant="secondary" size="md" onClick={onClose}>Zamknij</Button>
            <Button variant="danger" size="md" icon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>
              Usuń
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
