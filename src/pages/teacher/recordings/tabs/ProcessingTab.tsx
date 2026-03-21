import { motion } from 'framer-motion';
import { Mic, Clock, Loader2, FileSearch } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { mockRecordings, formatDuration } from '../../../../data/mockData';
import type { Recording } from '../../../../types';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

const stageConfig: Record<string, { label: string; description: string; variant: 'yellow' | 'blue' }> = {
  transcribing: {
    label: 'Transkrypcja...',
    description: 'Nagranie jest zamieniane na tekst. Może to potrwać kilka godzin.',
    variant: 'yellow',
  },
  transcribed: {
    label: 'Generowanie notatki...',
    description: 'Transkrypcja gotowa. AI tworzy teraz notatkę z lekcji.',
    variant: 'blue',
  },
};

function ProcessingCard({ rec }: { rec: Recording }) {
  const stage = stageConfig[rec.status] ?? stageConfig['transcribing'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-100 rounded-3xl overflow-hidden"
    >
      <div className="flex items-center gap-4 p-5" style={{ background: (rec.thumbnailColor ?? '#f3f4f6') + '40' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative" style={{ background: rec.thumbnailColor ?? '#f3f4f6' }}>
          <Mic className="w-5 h-5 text-violet-700" />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Loader2 className="w-3 h-3 text-violet-500 animate-spin" />
          </span>
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
        <Badge variant={stage.variant}>{stage.label}</Badge>
      </div>

      <div className="px-5 py-4 bg-white border-t border-gray-50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileSearch className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{stage.description}</p>
            <p className="text-xs text-gray-400 mt-1">Notatka pojawi się automatycznie w zakładce „Notatki"</p>
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full"
            initial={{ width: '15%' }}
            animate={{ width: ['15%', '75%', '35%', '65%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

interface ProcessingTabProps {
  processingIds: string[];
}

export function ProcessingTab({ processingIds }: ProcessingTabProps) {
  const processing = mockRecordings.filter(
    r => r.status === 'transcribing' || r.status === 'transcribed' || processingIds.includes(r.id)
  );

  if (processing.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <Loader2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">Brak nagrań w trakcie przetwarzania</p>
        <p className="text-sm mt-1">Tu pojawią się nagrania, dla których zlecono tworzenie notatki</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100">
        <Loader2 className="w-4 h-4 text-amber-500 animate-spin flex-shrink-0" />
        <p className="text-sm text-amber-700">
          Przetwarzanie może potrwać kilka godzin. Wróć później, aby sprawdzić gotowe notatki.
        </p>
      </div>
      {processing.map(rec => (
        <ProcessingCard key={rec.id} rec={rec} />
      ))}
    </div>
  );
}
