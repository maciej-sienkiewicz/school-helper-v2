import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Brain, PenLine, Eye, Printer, CheckCircle2, Sparkles, ChevronDown, Headphones } from 'lucide-react';
import { mockNotes, mockRecordings } from '../../../data/mockData';
import { renderMarkdown, MockPlayer } from '../subject/shared';
import { flashcardStore } from '../../../data/flashcardStore';
import { buildIframeDoc } from './iframeInjection';
import { generateFlashcard } from './flashcardService';
import { SelectionMenu } from './SelectionMenu';
import { FlashcardPreviewModal } from './FlashcardPreviewModal';
import { CommentModal } from './CommentModal';
import type { Progress, SelectionState, FlashcardPhase } from './types';

// ─── ProgressChip ─────────────────────────────────────────────────────────────

function ProgressChip({ icon, filled, total, colorClass }: {
  icon: React.ReactNode; filled: number; total: number; colorClass: string;
}) {
  if (total === 0) return null;
  const done = filled === total;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${done ? 'bg-emerald-50 text-emerald-700' : colorClass}`}>
      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : icon}
      <span>{filled}/{total}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NoteViewerPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [mode, setMode] = useState<'reading' | 'practice'>('reading');
  const [iframeReady, setIframeReady] = useState(false);
  const [progress, setProgress] = useState<Progress>({ blanks: { filled: 0, total: 0 }, details: { opened: 0, total: 0 } });
  const [justCompleted, setJustCompleted] = useState(false);

  // Selection & flashcard state
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [flashcardPhase, setFlashcardPhase] = useState<FlashcardPhase>({ phase: 'idle' });
  const [commentText, setCommentText] = useState<string | null>(null);

  const note = useMemo(() => mockNotes.find(n => n.id === noteId), [noteId]);
  const isHtml = useMemo(() => Boolean(note?.content.trimStart().match(/^<!DOCTYPE|^<html/i)), [note]);
  const iframeDoc = useMemo(() => (note && isHtml ? buildIframeDoc(note.content) : ''), [note, isHtml]);

  const recording = useMemo(() => note?.recordingId ? mockRecordings.find(r => r.id === note.recordingId) : undefined, [note]);
  const hasAudio = Boolean(recording?.isSharedAudio);
  const [audioExpanded, setAudioExpanded] = useState(true);

  // Messages from iframe (progress + selection)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'sh-progress') {
        setProgress(e.data);
      } else if (e.data?.type === 'sh-selection') {
        if (e.data.text && iframeRef.current) {
          const r = iframeRef.current.getBoundingClientRect();
          setSelection({ text: e.data.text, x: r.left + (e.data.rectLeft + e.data.rectRight) / 2, y: r.top + e.data.rectTop });
        } else {
          setSelection(null);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Clear selection on click outside menu (works for both plain-text and iframe)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const menu = document.getElementById('sh-selection-menu');
      if (menu?.contains(e.target as Node)) return;
      setSelection(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Send mode to iframe
  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: 'sh-set-mode', mode }, '*');
  }, [mode, iframeReady]);

  // Completion detection
  const totalItems = progress.blanks.total + progress.details.total;
  const completedItems = progress.blanks.filled + progress.details.opened;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const isComplete = totalItems > 0 && completedItems === totalItems;

  useEffect(() => {
    if (isComplete) {
      setJustCompleted(true);
      const t = setTimeout(() => setJustCompleted(false), 4000);
      return () => clearTimeout(t);
    }
  }, [isComplete]);

  const handleIframeLoad = useCallback(() => {
    setIframeReady(true);
    iframeRef.current?.contentWindow?.postMessage({ type: 'sh-set-mode', mode }, '*');
  }, [mode]);

  // Selection – plain-text notes
  const handleTextMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { setSelection(null); return; }
    const text = sel.toString().trim();
    if (text.length < 3) { setSelection(null); return; }
    try {
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      setSelection({ text, x: (rect.left + rect.right) / 2, y: rect.top });
    } catch { setSelection(null); }
  }, []);

  // Flashcard flow
  const handleAddFlashcard = useCallback((text: string) => {
    setSelection(null);
    setFlashcardPhase({ phase: 'choose', sourceText: text });
  }, []);

  const handleChooseAI = useCallback(async (sourceText: string) => {
    setFlashcardPhase({ phase: 'loading' });
    try {
      const card = await generateFlashcard(sourceText);
      setFlashcardPhase({ phase: 'preview', card, sourceText });
    } catch {
      setFlashcardPhase({ phase: 'idle' });
    }
  }, []);

  const handleChooseManual = useCallback((sourceText: string) => {
    setFlashcardPhase({ phase: 'preview', card: { front: '', back: '' }, sourceText });
  }, []);

  const handleConfirmFlashcard = useCallback((card: { front: string; back: string }) => {
    if (flashcardPhase.phase !== 'preview') return;
    flashcardStore.add({ front: card.front, back: card.back, sourceText: flashcardPhase.sourceText, noteTopicName: note?.topicName ?? '' });
    setFlashcardPhase({ phase: 'saved' });
    setTimeout(() => setFlashcardPhase({ phase: 'idle' }), 2200);
  }, [flashcardPhase, note]);

  const handleComment = useCallback((text: string) => {
    setSelection(null);
    setCommentText(text);
  }, []);

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <p className="text-gray-500">Nie znaleziono notatki.</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold">Wróć</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="px-4 h-14 flex items-center gap-2 sm:gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer" title="Wróć">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400 truncate leading-none mb-0.5">{note.topicId ? 'Matematyka' : 'Notatka'}</div>
            <div className="font-bold text-gray-900 text-sm truncate leading-tight">{note.topicName}</div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <ProgressChip icon={<PenLine className="w-3.5 h-3.5" />} filled={progress.blanks.filled} total={progress.blanks.total} colorClass="bg-violet-50 text-violet-700" />
            <ProgressChip icon={<Eye className="w-3.5 h-3.5" />} filled={progress.details.opened} total={progress.details.total} colorClass="bg-sky-50 text-sky-700" />
          </div>

          {isHtml && (
            <div className="flex items-center bg-gray-100 rounded-xl p-0.5 flex-shrink-0">
              {(['reading', 'practice'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${mode === m ? (m === 'practice' ? 'bg-violet-600 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : 'text-gray-500 hover:text-gray-700'}`}>
                  {m === 'reading' ? <BookOpen className="w-3.5 h-3.5 flex-shrink-0" /> : <Brain className="w-3.5 h-3.5 flex-shrink-0" />}
                  <span className="hidden sm:inline">{m === 'reading' ? 'Czytam' : 'Ćwiczę'}</span>
                </button>
              ))}
            </div>
          )}

          {isHtml && (
            <button onClick={() => iframeRef.current?.contentWindow?.print() ?? window.print()} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer" title="Drukuj">
              <Printer className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {totalItems > 0 && (
          <div className="h-1 bg-gray-100 relative overflow-hidden">
            <motion.div className="h-full absolute left-0 top-0" style={{ background: isComplete ? 'linear-gradient(90deg,#059669,#34d399)' : 'linear-gradient(90deg,#7c3aed,#a78bfa)' }} initial={false} animate={{ width: `${progressPercent}%` }} transition={{ type: 'spring', stiffness: 60, damping: 15 }} />
          </div>
        )}
      </header>

      {/* Banners */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div key="complete" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-emerald-600 text-white text-center py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Brawo! Uzupełniłeś całą notatkę. Jesteś o krok bliżej opanowania tematu! <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>
        )}
        {!justCompleted && mode === 'practice' && (
          <motion.div key="practice" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-violet-600 text-white text-center py-2 text-xs font-semibold">
              ✦ Tryb ćwiczenia — uzupełniaj luki i sprawdzaj wskazówki. Najedź na zamazaną odpowiedź, by ją odkryć.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note content */}
      {isHtml ? (
        <iframe ref={iframeRef} srcDoc={iframeDoc} className="flex-1 w-full border-none" style={{ minHeight: 'calc(100vh - 57px)' }} onLoad={handleIframeLoad} sandbox="allow-scripts allow-same-origin" title={note.topicName ?? 'Notatka'} />
      ) : (
        <div className="flex-1 bg-white max-w-2xl mx-auto w-full my-6 rounded-2xl shadow-sm border border-gray-100 p-8" onMouseUp={handleTextMouseUp}>
          <h1 className="text-2xl font-black text-gray-900 mb-6">{note.topicName}</h1>
          <div className="space-y-1">{renderMarkdown(note.content)}</div>
        </div>
      )}

      {/* Selection menu */}
      <AnimatePresence>
        {selection && flashcardPhase.phase === 'idle' && commentText === null && (
          <SelectionMenu key="sel-menu" sel={selection} onAddFlashcard={handleAddFlashcard} onComment={handleComment} />
        )}
      </AnimatePresence>

      {/* Flashcard preview */}
      <AnimatePresence>
        {flashcardPhase.phase !== 'idle' && (
          <FlashcardPreviewModal key="fc-modal" state={flashcardPhase} onConfirm={handleConfirmFlashcard} onDiscard={() => setFlashcardPhase({ phase: 'idle' })} onChooseAI={handleChooseAI} onChooseManual={handleChooseManual} />
        )}
      </AnimatePresence>

      {/* Comment modal */}
      <AnimatePresence>
        {commentText !== null && (
          <CommentModal key="comment-modal" selectedText={commentText} onClose={() => setCommentText(null)} />
        )}
      </AnimatePresence>

      {/* Audio player – sliding right panel */}
      {hasAudio && recording && (
        <div className="fixed bottom-6 right-0 z-40 flex items-end">
          {/* Panel */}
          <AnimatePresence initial={false}>
            {audioExpanded && (
              <motion.div
                key="audio-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-l-2xl"
              >
                <div className="w-80 p-4 space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nagranie z lekcji</p>
                  <MockPlayer durationSeconds={recording.durationSeconds} color={recording.thumbnailColor ?? '#7c3aed'} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle tab – fixed size, never changes */}
          <button
            onClick={() => setAudioExpanded(e => !e)}
            className="flex flex-col items-center justify-center gap-1.5 w-9 h-20 rounded-l-2xl shadow-lg border border-r-0 border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
            title={audioExpanded ? 'Zwiń player' : 'Nagranie z lekcji'}
          >
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: recording.thumbnailColor ?? '#e9d5ff' }}>
              <Headphones className="w-3 h-3 text-gray-700" />
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${audioExpanded ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
        </div>
      )}
    </div>
  );
}
