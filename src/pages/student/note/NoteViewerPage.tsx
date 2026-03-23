import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Brain, PenLine, Eye,
  Printer, CheckCircle2, Sparkles,
} from 'lucide-react';
import { mockNotes } from '../../../data/mockData';
import { renderMarkdown } from '../subject/shared';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Progress {
  blanks: { filled: number; total: number };
  details: { opened: number; total: number };
}

// ─── HTML injection helpers ───────────────────────────────────────────────────

const INJECTED_CSS = `
<style id="sh-interactive">
/* ── Write-line blanks → interactive inputs ── */
.write-line {
  min-height: 38px !important;
  height: auto !important;
  border: none !important;
  border-bottom: 2px dashed #c4b5fd !important;
  padding: 6px 10px !important;
  border-radius: 6px 6px 0 0 !important;
  cursor: text !important;
  outline: none !important;
  transition: background 0.18s, border-color 0.18s !important;
  background: transparent !important;
  display: block !important;
  font-family: inherit !important;
  font-size: inherit !important;
  color: #1e293b !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
  box-sizing: border-box !important;
}

.write-line:empty::before {
  content: 'Wpisz tutaj swoje myśli…';
  color: #c4b5fd;
  font-style: italic;
  font-size: 13px;
  pointer-events: none;
}

.write-line:focus {
  border-bottom-color: #7c3aed !important;
  background: rgba(124, 58, 237, 0.04) !important;
}

.write-line[data-filled] {
  border-bottom-style: solid !important;
  border-bottom-color: #059669 !important;
  background: rgba(5, 150, 105, 0.03) !important;
}

/* ── Details cue blocks ── */
details {
  border-radius: 10px !important;
  border: 1px solid transparent !important;
  transition: background 0.2s, border-color 0.2s !important;
  overflow: hidden !important;
}

details summary {
  padding: 10px 14px !important;
  cursor: pointer !important;
  user-select: none !important;
  list-style: none !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  border-radius: 10px !important;
  transition: background 0.15s !important;
}

details summary::-webkit-details-marker { display: none !important; }

details summary::before {
  content: '▶' !important;
  font-size: 9px !important;
  color: #94a3b8 !important;
  transition: transform 0.2s !important;
  flex-shrink: 0 !important;
  display: inline-block !important;
}

details[open] > summary::before {
  transform: rotate(90deg) !important;
}

details summary:hover {
  background: #f1f5f9 !important;
}

details[open] {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
}

details > div {
  transition: filter 0.3s ease, opacity 0.3s ease !important;
}

/* ── Practice mode ── */
.practice-mode .write-line:empty::before {
  content: '✦ Uzupełnij tę lukę…' !important;
  color: #7c3aed !important;
  animation: sh-pulse 2s ease-in-out infinite !important;
}

.practice-mode details[open] > div {
  filter: blur(5px) !important;
  opacity: 0.6 !important;
  cursor: pointer !important;
  user-select: none !important;
  transition: filter 0.3s ease, opacity 0.3s ease !important;
}

.practice-mode details[open]:hover > div,
.practice-mode details[open] > div:hover {
  filter: blur(0) !important;
  opacity: 1 !important;
}

.practice-mode details[open]::after {
  content: 'Najedź, aby odkryć odpowiedź' !important;
  display: block !important;
  text-align: center !important;
  font-size: 11px !important;
  color: #7c3aed !important;
  padding: 4px 14px 8px !important;
  font-style: italic !important;
  opacity: 0.8 !important;
}

.practice-mode details[open]:hover::after {
  display: none !important;
}

@keyframes sh-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}
</style>
`;

const INJECTED_JS = `
<script id="sh-interactive-js">
(function () {
  function setup() {
    // Make write-lines contenteditable
    document.querySelectorAll('.write-line').forEach(function (el, i) {
      el.setAttribute('contenteditable', 'true');
      el.dataset.blankId = String(i);
      el.addEventListener('input', function () {
        if (this.textContent.trim()) {
          this.dataset.filled = 'true';
        } else {
          delete this.dataset.filled;
        }
        reportProgress();
      });
    });

    // Track details opens
    document.querySelectorAll('details').forEach(function (el) {
      el.addEventListener('toggle', function () {
        if (this.open) this.dataset.opened = 'true';
        reportProgress();
      });
    });

    reportProgress();
    // Re-report after MathJax has a chance to render
    setTimeout(reportProgress, 2500);
  }

  function reportProgress() {
    var blanks = document.querySelectorAll('.write-line');
    var filled = document.querySelectorAll('.write-line[data-filled]');
    var allDetails = document.querySelectorAll('details');
    var openedDetails = document.querySelectorAll('details[data-opened]');
    window.parent.postMessage({
      type: 'sh-progress',
      blanks: { filled: filled.length, total: blanks.length },
      details: { opened: openedDetails.length, total: allDetails.length },
    }, '*');
  }

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'sh-set-mode') return;
    if (e.data.mode === 'practice') {
      document.body.classList.add('practice-mode');
      document.querySelectorAll('details').forEach(function (d) { d.open = false; });
    } else {
      document.body.classList.remove('practice-mode');
    }
    reportProgress();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
</script>
`;

function buildIframeDoc(html: string): string {
  let result = html;
  // Inject interactive CSS before </head>
  result = result.replace(/<\/head>/i, INJECTED_CSS + '\n</head>');
  // Inject interactive JS before </body>
  result = result.replace(/<\/body>/i, INJECTED_JS + '\n</body>');
  return result;
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function ProgressChip({
  icon,
  filled,
  total,
  colorClass,
}: {
  icon: React.ReactNode;
  filled: number;
  total: number;
  colorClass: string;
}) {
  if (total === 0) return null;
  const done = filled === total;
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
        done ? 'bg-emerald-50 text-emerald-700' : colorClass
      }`}
    >
      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : icon}
      <span>
        {filled}/{total}
      </span>
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
  const [progress, setProgress] = useState<Progress>({
    blanks: { filled: 0, total: 0 },
    details: { opened: 0, total: 0 },
  });
  const [justCompleted, setJustCompleted] = useState(false);

  const note = useMemo(() => mockNotes.find(n => n.id === noteId), [noteId]);
  const isHtml = useMemo(
    () => Boolean(note?.content.trimStart().match(/^<!DOCTYPE|^<html/i)),
    [note],
  );

  // Build iframe document once per note (not per mode change)
  const iframeDoc = useMemo(
    () => (note && isHtml ? buildIframeDoc(note.content) : ''),
    [note, isHtml],
  );

  // Listen for progress messages from the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== 'sh-progress') return;
      setProgress(e.data);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Send mode changes to the iframe via postMessage (no reload)
  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: 'sh-set-mode', mode }, '*');
  }, [mode, iframeReady]);

  // Detect completion
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
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'sh-set-mode', mode }, '*');
    }
  }, [mode]);

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else {
      window.print();
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <p className="text-gray-500">Nie znaleziono notatki.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold"
          >
            Wróć
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="px-4 h-14 flex items-center gap-2 sm:gap-3">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
            title="Wróć"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400 truncate leading-none mb-0.5">
              {note.topicId ? 'Matematyka' : 'Notatka'}
            </div>
            <div className="font-bold text-gray-900 text-sm truncate leading-tight">
              {note.topicName}
            </div>
          </div>

          {/* Progress chips */}
          <div className="hidden sm:flex items-center gap-1.5">
            <ProgressChip
              icon={<PenLine className="w-3.5 h-3.5" />}
              filled={progress.blanks.filled}
              total={progress.blanks.total}
              colorClass="bg-violet-50 text-violet-700"
            />
            <ProgressChip
              icon={<Eye className="w-3.5 h-3.5" />}
              filled={progress.details.opened}
              total={progress.details.total}
              colorClass="bg-sky-50 text-sky-700"
            />
          </div>

          {/* Mode toggle – only for HTML notes */}
          {isHtml && (
            <div className="flex items-center bg-gray-100 rounded-xl p-0.5 flex-shrink-0">
              <button
                onClick={() => setMode('reading')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'reading'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Czytam</span>
              </button>
              <button
                onClick={() => setMode('practice')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'practice'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Brain className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Ćwiczę</span>
              </button>
            </div>
          )}

          {/* Print */}
          {isHtml && (
            <button
              onClick={handlePrint}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
              title="Drukuj"
            >
              <Printer className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {totalItems > 0 && (
          <div className="h-1 bg-gray-100 relative overflow-hidden">
            <motion.div
              className="h-full absolute left-0 top-0"
              style={{
                background: isComplete
                  ? 'linear-gradient(90deg, #059669, #34d399)'
                  : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              }}
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            />
          </div>
        )}
      </header>

      {/* ── Mode / completion banners ── */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            key="complete"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-emerald-600 text-white text-center py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Brawo! Uzupełniłeś całą notatkę. Jesteś o krok bliżej opanowania tematu!
              <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>
        )}
        {!justCompleted && mode === 'practice' && (
          <motion.div
            key="practice"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-violet-600 text-white text-center py-2 text-xs font-semibold">
              ✦ Tryb ćwiczenia — uzupełniaj luki i sprawdzaj wskazówki. Najedź na zamazaną odpowiedź, by ją odkryć.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Note content ── */}
      {isHtml ? (
        <iframe
          ref={iframeRef}
          srcDoc={iframeDoc}
          className="flex-1 w-full border-none"
          style={{ minHeight: 'calc(100vh - 57px)' }}
          onLoad={handleIframeLoad}
          sandbox="allow-scripts allow-same-origin"
          title={note.topicName ?? 'Notatka'}
        />
      ) : (
        /* Plain-text fallback with the existing markdown renderer */
        <div className="flex-1 bg-white max-w-2xl mx-auto w-full my-6 rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-6">{note.topicName}</h1>
          <div className="space-y-1">
            {renderMarkdown(note.content)}
          </div>
        </div>
      )}
    </div>
  );
}
