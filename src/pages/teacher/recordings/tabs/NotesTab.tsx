import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Clock, FileText, CheckCircle2, Share2, Trash2, Headphones,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { NoteModal } from '../components/NoteModal';
import { ShareModal, scopeOptions } from '../components/ShareModal';
import { mockRecordings, mockNotes, formatDuration } from '../../../../data/mockData';
import type { Recording, Note } from '../../../../types';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

interface NoteCardProps {
  rec: Recording;
  note: Note;
  onDelete: (recId: string) => void;
}

function NoteCard({ rec, note, onDelete }: NoteCardProps) {
  const [showNote, setShowNote] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [accepted, setAccepted] = useState(note.status === 'accepted');

  return (
    <>
      <AnimatePresence>
        {showNote && (
          <NoteModal
            note={note}
            onClose={() => setShowNote(false)}
            onAccept={() => setAccepted(true)}
            onDelete={() => onDelete(rec.id)}
          />
        )}
        {showShare && (
          <ShareModal
            title={rec.topicName ?? 'Notatka'}
            onClose={() => setShowShare(false)}
            onShare={(scope) => {
              const scopeLabel = scopeOptions.find(s => s.scope === scope)?.label ?? scope;
              alert(`Udostępniono notatką (${scopeLabel})`);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-gray-100 rounded-3xl overflow-hidden hover:shadow-card transition-shadow"
      >
        <div className="flex items-center gap-4 p-5" style={{ background: (rec.thumbnailColor ?? '#f3f4f6') + '40' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: rec.thumbnailColor ?? '#f3f4f6' }}>
            <Mic className="w-5 h-5 text-violet-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-800 truncate">{rec.topicName ?? 'Lekcja bez tematu'}</div>
            <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-2">
              <span className="font-medium">{rec.className}</span>
              <span>·</span>
              <span>{format(parseISO(rec.date), 'd MMMM yyyy, HH:mm', { locale: pl })}</span>
              <span>·</span>
              <Clock className="w-3 h-3" />
              <span>{formatDuration(rec.durationSeconds)}</span>
            </div>
          </div>
          {accepted
            ? <Badge variant="green"><CheckCircle2 className="w-3 h-3 inline mr-1" />Zaakceptowana</Badge>
            : <Badge variant="blue"><Sparkles className="w-3 h-3 inline mr-1" />Notatka gotowa</Badge>
          }
        </div>

        {/* Document excerpt */}
        <div className="px-5 py-3 bg-violet-50/40 border-t border-violet-100">
          <div className="flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {note.content.split('\n\n').slice(1).find(p => p.trim().length > 80) ?? note.content.split('\n\n')[1]}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-white flex flex-wrap items-center gap-2 border-t border-gray-50">
          <Button
            variant="primary" size="sm"
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => setShowNote(true)}
          >
            {accepted ? 'Podejrzyj notatkę' : 'Sprawdź i edytuj'}
          </Button>

          {!accepted && (
            <Button
              variant="success" size="sm"
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={() => setAccepted(true)}
            >
              Zaakceptuj
            </Button>
          )}

          <Button
            variant="ghost" size="sm"
            icon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => setShowShare(true)}
          >
            Udostępnij
          </Button>

          <div className="flex-1" />

          {(rec.isSharedNote || rec.isSharedAudio) && (
            <div className="flex items-center gap-1.5">
              {rec.isSharedNote && (
                <div className="flex items-center gap-1 text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-xl">
                  <FileText className="w-3 h-3" /> Notatka udostępniona
                </div>
              )}
              {rec.isSharedAudio && (
                <div className="flex items-center gap-1 text-xs text-sky-600 bg-sky-50 px-2 py-1 rounded-xl">
                  <Headphones className="w-3 h-3" /> Audio udostępnione
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost" size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            className="text-rose-400 hover:text-rose-600 hover:bg-rose-50"
            onClick={() => onDelete(rec.id)}
          >
            Usuń notatkę
          </Button>
        </div>
      </motion.div>
    </>
  );
}

interface NotesTabProps {
  deletedNoteIds: string[];
  onDeleteNote: (recId: string) => void;
}

export function NotesTab({ deletedNoteIds, onDeleteNote }: NotesTabProps) {
  const recordings = mockRecordings.filter(
    r => r.status === 'has_note' && !deletedNoteIds.includes(r.id)
  );

  if (recordings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">Brak notatek do przejrzenia</p>
        <p className="text-sm mt-1">Wygenerowane notatki pojawią się tu automatycznie</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recordings.map(rec => {
        const note = mockNotes.find(n => n.id === rec.noteId);
        if (!note) return null;
        return (
          <NoteCard
            key={rec.id}
            rec={rec}
            note={note}
            onDelete={onDeleteNote}
          />
        );
      })}
    </div>
  );
}
