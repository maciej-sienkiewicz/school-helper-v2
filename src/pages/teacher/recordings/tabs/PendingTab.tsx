import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Scissors, Sparkles, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { TrimmerMock } from '../components/TrimmerMock';
import { mockRecordings, formatDuration } from '../../../../data/mockData';
import type { Recording } from '../../../../types';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

interface PendingCardProps {
  rec: Recording;
  onCreateNote: (recId: string) => void;
  onReject: (recId: string) => void;
}

function PendingCard({ rec, onCreateNote, onReject }: PendingCardProps) {
  const [showTrimmer, setShowTrimmer] = useState(false);

  return (
    <>
      <AnimatePresence>
        {showTrimmer && <TrimmerMock onClose={() => setShowTrimmer(false)} />}
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
          <Badge variant="gray">Nowe nagranie</Badge>
        </div>

        <div className="px-5 py-3 bg-white flex flex-wrap items-center gap-2 border-t border-gray-50">
          <Button variant="ghost" size="sm" icon={<Play className="w-3.5 h-3.5" />} onClick={() => alert('Odtwarzanie...')}>
            Odtwórz
          </Button>
          <Button variant="ghost" size="sm" icon={<Scissors className="w-3.5 h-3.5" />} onClick={() => setShowTrimmer(true)}>
            Przytnij
          </Button>

          <div className="flex-1" />

          <Button
            variant="ghost" size="sm"
            icon={<XCircle className="w-3.5 h-3.5" />}
            className="text-rose-400 hover:text-rose-600 hover:bg-rose-50"
            onClick={() => onReject(rec.id)}
          >
            Odrzuć
          </Button>
          <Button
            variant="primary" size="sm"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => onCreateNote(rec.id)}
          >
            Utwórz notatkę
          </Button>
        </div>
      </motion.div>
    </>
  );
}

function RejectedSection({ recordings }: { recordings: Recording[] }) {
  const [open, setOpen] = useState(false);
  if (recordings.length === 0) return null;

  return (
    <div className="mt-6 border border-dashed border-gray-200 rounded-3xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <XCircle className="w-4 h-4 text-gray-400" />
        </div>
        <span className="flex-1 text-sm font-semibold text-gray-400">Odrzucone ({recordings.length})</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-2 border-t border-dashed border-gray-200">
              {recordings.map(rec => (
                <div key={rec.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl opacity-60">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">{rec.topicName ?? 'Nagranie odrzucone'}</div>
                    <div className="text-xs text-gray-400">{rec.className} · {format(parseISO(rec.date), 'd MMM yyyy', { locale: pl })}</div>
                  </div>
                  <Badge variant="rose">Odrzucone</Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PendingTabProps {
  onCreateNote: (recId: string) => void;
  onReject: (recId: string) => void;
  rejectedIds: string[];
}

export function PendingTab({ onCreateNote, onReject, rejectedIds }: PendingTabProps) {
  const pending = mockRecordings.filter(
    r => r.status === 'raw' && !rejectedIds.includes(r.id)
  );
  const rejected = mockRecordings.filter(
    r => r.status === 'rejected' || rejectedIds.includes(r.id)
  );

  if (pending.length === 0 && rejected.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <Mic className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">Brak oczekujących nagrań</p>
        <p className="text-sm mt-1">Nowe nagrania pojawią się tu po zakończeniu lekcji</p>
      </div>
    );
  }

  return (
    <div>
      {pending.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">Wszystkie nagrania zostały przetworzone</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map(rec => (
            <PendingCard key={rec.id} rec={rec} onCreateNote={onCreateNote} onReject={onReject} />
          ))}
        </div>
      )}
      <RejectedSection recordings={rejected} />
    </div>
  );
}
