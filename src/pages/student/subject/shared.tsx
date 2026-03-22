import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FileText, X, Bookmark, Send } from 'lucide-react';

// ─── Markdown renderer ────────────────────────────────────────────────────────

export function renderMarkdown(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## '))
      return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-2">{line.slice(3)}</h3>;
    if (line.startsWith('# '))
      return <h2 key={i} className="text-lg font-bold text-gray-900 mb-3">{line.slice(2)}</h2>;
    if (line.startsWith('- '))
      return <li key={i} className="ml-4 text-sm text-gray-700 mb-1 list-disc">{line.slice(2)}</li>;
    if (line.trim() === '')
      return <div key={i} className="h-2" />;
    return <p key={i} className="text-sm text-gray-700 mb-1">{line}</p>;
  });
}

// ─── NoteModal ────────────────────────────────────────────────────────────────

interface NoteModalProps {
  content: string;
  topicName: string;
  onClose: () => void;
}

export function NoteModal({ content, topicName, onClose }: NoteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[82vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-500" /> {topicName}
          </h2>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {renderMarkdown(content)}
        </div>
      </motion.div>
    </div>
  );
}

// ─── MockPlayer (z adnotacjami czasowymi) ─────────────────────────────────────

interface MockPlayerProps {
  durationSeconds: number;
  color: string;
}

export function MockPlayer({ durationSeconds, color }: MockPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0.33);
  const [annotating, setAnnotating] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [annotations, setAnnotations] = useState<{ pos: number; text: string }[]>([]);

  const totalMin = Math.floor(durationSeconds / 60);
  const totalSec = durationSeconds % 60;
  const currentSec = Math.floor(position * durationSeconds);
  const curStr = `${Math.floor(currentSec / 60)}:${(currentSec % 60).toString().padStart(2, '0')}`;
  const totStr = `${totalMin}:${totalSec.toString().padStart(2, '0')}`;

  const addAnnotation = () => {
    if (!annotationText.trim()) return;
    setAnnotations(prev => [...prev, { pos: position, text: annotationText.trim() }]);
    setAnnotationText('');
    setAnnotating(false);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  return (
    <div className="space-y-2">
      {/* Player bar */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
        <button
          onClick={() => setPlaying(p => !p)}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow transition-transform active:scale-95 cursor-pointer flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {playing
            ? <span className="flex gap-0.5"><span className="w-1 h-3 bg-white rounded-full" /><span className="w-1 h-3 bg-white rounded-full" /></span>
            : <Play className="w-4 h-4 fill-white" />}
        </button>

        {/* Track */}
        <div className="flex-1 relative py-2 cursor-pointer" onClick={handleTrackClick}>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${position * 100}%`, backgroundColor: color }} />
          </div>
          {annotations.map((a, i) => (
            <div
              key={i}
              className="absolute top-1.5 w-2 h-2 rounded-full bg-amber-400 border border-white -translate-x-1 cursor-pointer"
              style={{ left: `${a.pos * 100}%` }}
              title={a.text}
            />
          ))}
        </div>

        <span className="text-xs text-gray-500 font-mono whitespace-nowrap">{curStr} / {totStr}</span>

        <button
          onClick={() => setAnnotating(a => !a)}
          className="w-11 h-11 rounded-xl bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          title="Dodaj adnotację do tego momentu"
        >
          <Bookmark className={`w-4 h-4 ${annotating ? 'text-amber-600 fill-amber-400' : 'text-amber-500'}`} />
        </button>
      </div>

      {/* Annotation input */}
      <AnimatePresence>
        {annotating && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex gap-2 pt-1">
              <span className="text-xs text-amber-700 font-mono bg-amber-50 border border-amber-200 px-2 py-2 rounded-xl flex-shrink-0">{curStr}</span>
              <input
                autoFocus
                value={annotationText}
                onChange={e => setAnnotationText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addAnnotation()}
                placeholder="Adnotacja do tego momentu..."
                className="flex-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                onClick={addAnnotation}
                disabled={!annotationText.trim()}
                className="w-11 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Annotations list */}
      {annotations.length > 0 && (
        <div className="space-y-1">
          {annotations.map((a, i) => {
            const sec = Math.floor(a.pos * durationSeconds);
            return (
              <div key={i} className="flex items-start gap-2 text-xs bg-amber-50 rounded-xl px-3 py-2">
                <span className="font-mono text-amber-600 flex-shrink-0">{Math.floor(sec / 60)}:{(sec % 60).toString().padStart(2, '0')}</span>
                <span className="text-gray-600">{a.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
