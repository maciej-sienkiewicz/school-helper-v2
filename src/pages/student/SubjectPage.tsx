import { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Play, FileText, ThumbsUp, MessageCircle,
  CalendarCheck, ClipboardList, Globe, Clock, MapPin,
  AlertCircle, CheckCircle2, Send, X, ChevronDown, ChevronUp,
  GraduationCap, School, Award, Layers, Sparkles,
  Brain, Zap, RotateCcw, Check, ChevronRight, Timer, Target
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import {
  mockStudentLessons, mockStudentExams,
  mockStudentHomework, mockExternalMaterials,
} from '../../data/mockData';
import type {
  StudentLesson, StudentComment, ExternalMaterial, StudentHomework
} from '../../types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';

// ─── Subject colour map (matches sidebar) ────────────────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  'Matematyka': '#bae6fd',
  'Fizyka':     '#d1fae5',
  'Chemia':     '#fde68a',
  'Biologia':   '#a7f3d0',
  'Historia':   '#fecdd3',
};
function subjectColor(s: string) { return SUBJECT_COLORS[s] ?? '#e9d5ff'; }

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(content: string) {
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

// ─── Note Modal ───────────────────────────────────────────────────────────────

function NoteModal({ content, topicName, onClose }: {
  content: string; topicName: string; onClose: () => void;
}) {
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
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{renderMarkdown(content)}</div>
      </motion.div>
    </div>
  );
}

// ─── Audio Player (mock) ──────────────────────────────────────────────────────

function MockPlayer({
  durationSeconds, color, onTimestamp,
}: {
  durationSeconds: number;
  color: string;
  onTimestamp?: (t: number) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(33);
  const m = Math.floor(durationSeconds / 60);
  const s = durationSeconds % 60;
  const currentSec = Math.floor(durationSeconds * progress / 100);
  const cm = Math.floor(currentSec / 60);
  const cs = currentSec % 60;

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
      <button
        onClick={() => setPlaying(p => !p)}
        style={{ backgroundColor: color }}
        className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow transition-transform active:scale-95 cursor-pointer flex-shrink-0"
      >
        {playing
          ? <span className="flex gap-0.5"><span className="w-1 h-3 bg-white rounded-full" /><span className="w-1 h-3 bg-white rounded-full" /></span>
          : <Play className="w-4 h-4 fill-white" />}
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-400 font-mono">{cm}:{cs.toString().padStart(2,'0')}</span>
          <div
            className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
            onClick={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setProgress(Math.round(((e.clientX - r.left) / r.width) * 100));
            }}
          >
            <div
              className="h-full rounded-full opacity-80 transition-all"
              style={{ backgroundColor: color, width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-mono">{m}:{s.toString().padStart(2,'0')}</span>
        </div>
        {onTimestamp && (
          <button
            onClick={() => onTimestamp(currentSec)}
            className="text-xs text-sky-500 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <Timer className="w-3 h-3" />
            Dodaj adnotację ({cm}:{cs.toString().padStart(2,'0')})
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Tab 1: Lekcje i Notatki ─────────────────────────────────────────────────

interface TimestampNote { ts: number; text: string; }

function LessonCard({ lesson }: { lesson: StudentLesson }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [playerOpen,   setPlayerOpen]   = useState(false);
  const [comments,  setComments]  = useState<StudentComment[]>(lesson.comments);
  const [newComment, setNewComment] = useState('');
  const [liked,     setLiked]     = useState(lesson.hasLiked);
  const [likeCount, setLikeCount] = useState(lesson.likes);
  const [noteOpen,  setNoteOpen]  = useState(false);
  const [tsNotes,   setTsNotes]   = useState<TimestampNote[]>([]);
  const [pendingTs, setPendingTs] = useState<number | null>(null);
  const [tsText,    setTsText]    = useState('');

  const fmtTs = (sec: number) =>
    `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  const handleLike = () => {
    setLiked(p => !p);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  const submitComment = () => {
    if (!newComment.trim()) return;
    setComments(p => [...p, {
      id: `c-${Date.now()}`, studentName: 'anonim',
      text: newComment.trim(), createdAt: new Date().toISOString(), isOwn: true,
    }]);
    setNewComment('');
  };

  const submitTsNote = () => {
    if (!tsText.trim() || pendingTs === null) return;
    setTsNotes(p => [...p, { ts: pendingTs, text: tsText.trim() }]);
    setTsText('');
    setPendingTs(null);
  };

  return (
    <>
      <AnimatePresence>
        {noteOpen && lesson.noteContent && (
          <NoteModal
            content={lesson.noteContent}
            topicName={lesson.topicName}
            onClose={() => setNoteOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Blue left-border = "oficjalna" karta */}
      <div
        className="rounded-3xl bg-white shadow-card border border-white/80 border-l-4 overflow-hidden"
        style={{ borderLeftColor: '#0ea5e9' }}
      >
        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: lesson.thumbnailColor }}
            >
              <GraduationCap className="w-5 h-5 text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">
                {format(parseISO(lesson.date), 'EEEE, d MMMM yyyy', { locale: pl })}
              </p>
              <p className="font-bold text-gray-800 text-sm mt-0.5">{lesson.topicName}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs text-gray-500">{lesson.unitName}</span>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-sky-500 font-medium flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {lesson.durationMinutes} min
                </span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-full font-medium flex-shrink-0">
              Oficjalna
            </span>
          </div>

          {/* Material buttons */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {lesson.noteId ? (
              <button
                onClick={() => setNoteOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5" /> Otwórz notatkę
              </button>
            ) : (
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Brak notatki
              </span>
            )}
            {lesson.recordingId && lesson.recordingDurationSeconds && (
              <button
                onClick={() => setPlayerOpen(p => !p)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5" />
                {playerOpen ? 'Ukryj nagranie' : 'Słuchaj'}
              </button>
            )}
          </div>

          {/* Inline audio player */}
          <AnimatePresence>
            {playerOpen && lesson.recordingDurationSeconds && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  <MockPlayer
                    durationSeconds={lesson.recordingDurationSeconds}
                    color={lesson.thumbnailColor}
                    onTimestamp={t => { setPendingTs(t); setTsText(''); }}
                  />
                  {/* Timestamp annotation input */}
                  <AnimatePresence>
                    {pendingTs !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2"
                      >
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-200 rounded-xl">
                          <span className="text-xs text-sky-500 font-mono font-bold flex-shrink-0">
                            {fmtTs(pendingTs)}
                          </span>
                          <input
                            autoFocus
                            value={tsText}
                            onChange={e => setTsText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && submitTsNote()}
                            placeholder="Twoja adnotacja..."
                            className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700"
                          />
                        </div>
                        <button
                          onClick={submitTsNote}
                          disabled={!tsText.trim()}
                          className="w-11 h-11 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer flex-shrink-0"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Saved annotations list */}
                  {tsNotes.length > 0 && (
                    <div className="space-y-1">
                      {tsNotes.map((n, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs bg-sky-50 rounded-xl px-3 py-2">
                          <span className="font-mono text-sky-500 font-bold flex-shrink-0">{fmtTs(n.ts)}</span>
                          <span className="text-gray-700">{n.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interaction bar – like + comment toggle */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-all cursor-pointer px-3 py-2 rounded-xl min-h-[44px] ${
                liked ? 'text-sky-600 bg-sky-50' : 'text-gray-400 hover:text-sky-500 hover:bg-gray-50'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-sky-500 text-sky-500' : ''}`} />
              {likeCount}
            </button>
            <button
              onClick={() => setCommentsOpen(o => !o)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-sky-500 hover:bg-gray-50 transition-colors cursor-pointer px-3 py-2 rounded-xl min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              {comments.length}
              {comments.length > 0 && (
                commentsOpen
                  ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                  : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>
          </div>

          {/* Comments – collapsed by default */}
          <AnimatePresence>
            {commentsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Pytania ({comments.length})
                    </p>
                    <span className="text-xs text-gray-400">Anonimowe</span>
                  </div>
                  {comments.map(c => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-2xl text-sm ${c.isOwn ? 'bg-sky-50 border border-sky-100' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-xs ${c.isOwn ? 'text-sky-700' : 'text-gray-500'}`}>
                          {c.isOwn ? 'Ty (anonimowo)' : 'Anonimowy uczeń'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(parseISO(c.createdAt), 'd MMM, HH:mm', { locale: pl })}
                        </span>
                      </div>
                      <p className="text-gray-700">{c.text}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-xs text-gray-400">Nikt jeszcze nie zadał pytania. Śmiało!</p>
                  )}
                  <div className="flex gap-2 mt-1">
                    <input
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitComment()}
                      placeholder="Zadaj anonimowe pytanie..."
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    <button
                      onClick={submitComment}
                      disabled={!newComment.trim()}
                      className="w-11 h-11 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function TabLessons({ subject }: { subject: string }) {
  const lessons = mockStudentLessons.filter(l => l.subject === subject);

  if (lessons.length === 0)
    return <p className="text-gray-400 text-sm text-center py-8">Brak lekcji z tego przedmiotu.</p>;

  // Group by unit
  const byUnit = new Map<string, StudentLesson[]>();
  for (const l of lessons) {
    if (!byUnit.has(l.unitName)) byUnit.set(l.unitName, []);
    byUnit.get(l.unitName)!.push(l);
  }

  return (
    <div className="space-y-8">
      {[...byUnit.entries()].map(([unit, list]) => (
        <div key={unit}>
          {/* Section divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4 text-sky-600" />
            </div>
            <span className="text-sm font-bold text-gray-700">{unit}</span>
            <span className="text-xs text-gray-400">
              {list.length} {list.length === 1 ? 'lekcja' : list.length < 5 ? 'lekcje' : 'lekcji'}
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="space-y-3">
            {list.map(l => <LessonCard key={l.id} lesson={l} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab 2: Zadania i Egzaminy ────────────────────────────────────────────────

type HwStatus = 'todo' | 'in_progress' | 'done';

function TabTasksAndExams({ subject }: { subject: string }) {
  const exams = mockStudentExams.filter(e => e.subject === subject);
  const all   = mockStudentHomework.filter(h => h.subject === subject);

  const [statuses, setStatuses] = useState<Record<string, HwStatus>>(() =>
    Object.fromEntries(all.map(h => [h.id, h.done ? 'done' : 'todo']))
  );

  const cycleStatus = (id: string) => {
    setStatuses(prev => {
      const cur = prev[id];
      const next: HwStatus = cur === 'todo' ? 'in_progress' : cur === 'in_progress' ? 'done' : 'todo';
      return { ...prev, [id]: next };
    });
  };

  const statusCfg: Record<HwStatus, { label: string; chip: string; ring: string }> = {
    todo:        { label: 'Do zrobienia', chip: 'bg-gray-100 text-gray-600 border-gray-200',       ring: 'border-gray-100' },
    in_progress: { label: 'W trakcie',    chip: 'bg-amber-100 text-amber-700 border-amber-200',    ring: 'border-amber-200 bg-amber-50' },
    done:        { label: 'Oddane',       chip: 'bg-emerald-100 text-emerald-700 border-emerald-200', ring: 'border-emerald-200 bg-emerald-50' },
  };

  const mandatory = all.filter(h => !h.isExtra);
  const extra     = all.filter(h =>  h.isExtra);

  const HwCard = ({ hw }: { hw: StudentHomework }) => {
    const status = statuses[hw.id] ?? 'todo';
    const cfg    = statusCfg[status];
    const days   = differenceInDays(parseISO(hw.dueDate), new Date());
    const urgent = days <= 2 && status === 'todo';

    return (
      <div className={`p-4 rounded-2xl border-2 transition-all ${urgent ? 'border-red-200 bg-red-50' : cfg.ring}`}>
        <div className="flex items-start gap-3">
          {/* Tap-to-cycle checkbox */}
          <button
            onClick={() => cycleStatus(hw.id)}
            title="Zmień status"
            className="mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer p-3 box-content -mx-1 -my-1"
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
              status === 'done' ? 'bg-emerald-500 border-emerald-500' :
              status === 'in_progress' ? 'border-amber-400 bg-amber-50' :
              'border-gray-300'
            }`}>
              {status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              {status === 'in_progress' && <Clock className="w-3 h-3 text-amber-500" />}
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <p className={`font-bold text-sm mb-1 ${status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {hw.title}
            </p>
            <p className={`text-sm mb-3 ${status === 'done' ? 'text-gray-400' : 'text-gray-600'}`}>
              {hw.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status chip – tap to cycle */}
              <button
                onClick={() => cycleStatus(hw.id)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all min-h-[28px] ${cfg.chip}`}
              >
                {cfg.label}
              </button>
              <span className={`text-xs font-medium flex items-center gap-1 ${urgent ? 'text-red-600' : 'text-gray-500'}`}>
                <CalendarCheck className="w-3 h-3" />
                {status === 'done' ? 'Oddane' :
                  days < 0 ? `Spóźnione o ${Math.abs(days)} dni` :
                  days === 0 ? 'Dzisiaj!' : `Za ${days} dni`
                }
                {' · '}{format(parseISO(hw.dueDate), 'd MMM', { locale: pl })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Egzaminy */}
      {exams.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm font-bold text-gray-700">Egzaminy</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="space-y-3">
            {exams.map(exam => {
              const days = differenceInDays(parseISO(exam.date), new Date());
              const chipCls = days <= 3 ? 'bg-red-100 text-red-700' : days <= 7 ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700';
              const label   = days === 0 ? 'Dzisiaj!' : days === 1 ? 'Jutro!' : `Za ${days} dni`;
              return (
                <div key={exam.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: exam.color }}>
                        <CalendarCheck className="w-4 h-4 text-white/80" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {format(parseISO(exam.date), 'd MMMM yyyy', { locale: pl })}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exam.durationMinutes} min</span>
                          {exam.room && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> sala {exam.room}</span>}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${chipCls}`}>{label}</span>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 mb-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800 mb-0.5">Zakres</p>
                      <p className="text-sm text-amber-700">{exam.scope}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {exam.topicNames.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: exam.color + '60', color: '#374151' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Zadania obowiązkowe */}
      {mandatory.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-sm font-bold text-gray-700">Zadania obowiązkowe</span>
            <span className="text-xs text-gray-400">
              {mandatory.filter(h => statuses[h.id] === 'done').length}/{mandatory.length} zrobionych
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="space-y-2">{mandatory.map(h => <HwCard key={h.id} hw={h} />)}</div>
        </div>
      )}

      {/* Zadania dodatkowe */}
      {extra.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm font-bold text-gray-700">Zadania dodatkowe</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Nadobowiązkowe</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="space-y-2">{extra.map(h => <HwCard key={h.id} hw={h} />)}</div>
        </div>
      )}

      {exams.length === 0 && all.length === 0 && (
        <div className="text-center py-10">
          <CalendarCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Brak egzaminów i zadań z tego przedmiotu.</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Study Lab ─────────────────────────────────────────────────────────

type StudyMode = 'menu' | 'flashcards' | 'quiz' | 'blurting';

interface Flashcard { front: string; back: string; topic: string; }

function generateFlashcards(lessons: StudentLesson[]): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const l of lessons) {
    if (!l.noteContent) continue;
    let section = '';
    for (const line of l.noteContent.split('\n')) {
      if (line.startsWith('## ')) { section = line.slice(3); }
      else if (line.startsWith('- ') && section) {
        cards.push({ front: `${l.topicName} – ${section}`, back: line.slice(2), topic: l.topicName });
      }
    }
  }
  return cards;
}

// Flashcard sub-mode
function FlashcardMode({ lessons, onBack }: { lessons: StudentLesson[]; onBack: () => void }) {
  const cards = useMemo(() => generateFlashcards(lessons), [lessons]);
  const [idx,    setIdx]    = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known,   setKnown]   = useState<Set<number>>(new Set());

  if (!cards.length)
    return (
      <div className="text-center py-12">
        <Brain className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Brak notatek do wygenerowania fiszek.</p>
        <button onClick={onBack} className="mt-4 text-sm text-sky-500 cursor-pointer">← Wróć</button>
      </div>
    );

  const card = cards[idx];
  const next = () => { setFlipped(false); setIdx(i => (i + 1) % cards.length); };
  const prev = () => { setFlipped(false); setIdx(i => (i - 1 + cards.length) % cards.length); };
  const markKnown = () => { setKnown(s => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n; }); next(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">← Fiszki</button>
        <span className="text-xs text-gray-400">{idx + 1}/{cards.length} · {known.size} znam</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: `${((idx + 1) / cards.length) * 100}%` }} />
      </div>
      <motion.div
        key={`${idx}-${flipped}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setFlipped(f => !f)}
        className={`cursor-pointer rounded-3xl p-8 min-h-[200px] flex flex-col items-center justify-center text-center border-2 transition-colors ${
          flipped ? 'bg-violet-50 border-violet-200' : 'bg-white border-gray-100'
        }`}
      >
        <span className="text-xs text-gray-400 uppercase tracking-wider mb-4">
          {flipped ? 'Odpowiedź' : 'Pytanie'} · {card.topic}
        </span>
        <p className={`font-bold text-lg ${flipped ? 'text-violet-700' : 'text-gray-800'}`}>
          {flipped ? card.back : card.front}
        </p>
        <span className="mt-4 text-xs text-gray-400">
          Kliknij, aby {flipped ? 'zobaczyć pytanie' : 'zobaczyć odpowiedź'}
        </span>
      </motion.div>
      <div className="flex gap-2">
        <button onClick={prev} className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold cursor-pointer min-h-[44px]">← Poprzednia</button>
        <button onClick={markKnown} className={`flex-1 py-3 rounded-2xl text-sm font-semibold cursor-pointer min-h-[44px] transition-colors ${
          known.has(idx) ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
        }`}>{known.has(idx) ? '✓ Znam' : 'Znam! →'}</button>
        <button onClick={next} className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold cursor-pointer min-h-[44px]">Następna →</button>
      </div>
    </div>
  );
}

// Quiz sub-mode (mock questions generated from lesson topics)
const MOCK_QUESTIONS = [
  { q: 'Co oznacza zapis ax + b = 0?', opts: ['Równanie kwadratowe','Równanie liniowe','Nierówność','Funkcja'], correct: 1, topic: 'Równania liniowe' },
  { q: 'Ile wynosi 2³ · 2²?',           opts: ['2⁵','2⁶','4⁵','8'],                                           correct: 0, topic: 'Potęgi' },
  { q: 'NWW(4, 6) wynosi:',             opts: ['2','12','24','6'],                                             correct: 1, topic: 'Ułamki' },
  { q: '1% to:',                        opts: ['1/10','1/100','1/1000','1/50'],                                correct: 1, topic: 'Procenty' },
];

function QuizMode({ onBack }: { onBack: () => void }) {
  const [cur,      setCur]      = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);

  const q = MOCK_QUESTIONS[cur];

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (cur + 1 >= MOCK_QUESTIONS.length) { setDone(true); }
    else { setCur(c => c + 1); setSelected(null); }
  };

  if (done) return (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto">
        <Target className="w-8 h-8 text-violet-500" />
      </div>
      <p className="text-2xl font-bold text-gray-800">{score}/{MOCK_QUESTIONS.length}</p>
      <p className="text-gray-500 text-sm">
        {score === MOCK_QUESTIONS.length ? 'Perfekcyjnie! 🎉' : score >= MOCK_QUESTIONS.length * 0.7 ? 'Świetnie! 👍' : 'Ćwicz dalej! 💪'}
      </p>
      <button
        onClick={() => { setCur(0); setSelected(null); setScore(0); setDone(false); }}
        className="px-6 py-2.5 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold cursor-pointer min-h-[44px]"
      >Zacznij od nowa</button>
      <button onClick={onBack} className="block mx-auto text-sm text-gray-500 cursor-pointer">← Wróć</button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">← Quiz</button>
        <span className="text-xs text-gray-400">{cur + 1}/{MOCK_QUESTIONS.length} · {score} pkt</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: `${((cur + 1) / MOCK_QUESTIONS.length) * 100}%` }} />
      </div>
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
        <span className="text-xs text-gray-400">{q.topic}</span>
        <p className="font-bold text-gray-800 text-base mt-2 mb-6">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => pick(i)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer min-h-[44px] border-2 ${
                selected === null    ? 'bg-gray-50 hover:bg-violet-50 hover:border-violet-200 border-gray-100' :
                i === q.correct      ? 'bg-emerald-50 border-emerald-400 text-emerald-700' :
                i === selected       ? 'bg-red-50 border-red-400 text-red-700' :
                                       'bg-gray-50 border-gray-100 opacity-50'
              }`}
            >{opt}</button>
          ))}
        </div>
      </div>
      {selected !== null && (
        <button onClick={next} className="w-full py-3 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold cursor-pointer min-h-[44px]">
          {cur + 1 >= MOCK_QUESTIONS.length ? 'Zakończ' : 'Następne →'}
        </button>
      )}
    </div>
  );
}

// Blurting sub-mode
function BlurtingMode({ lessons, onBack }: { lessons: StudentLesson[]; onBack: () => void }) {
  const withNotes = lessons.filter(l => l.noteContent);
  const [topic,    setTopic]    = useState<StudentLesson | null>(withNotes[0] ?? null);
  const [text,     setText]     = useState('');
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">← Blurting</button>
        {withNotes.length > 1 && (
          <select
            value={topic?.id ?? ''}
            onChange={e => { setTopic(withNotes.find(l => l.id === e.target.value) ?? null); setText(''); setRevealed(false); }}
            className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
          >
            {withNotes.map(l => <option key={l.id} value={l.id}>{l.topicName}</option>)}
          </select>
        )}
      </div>
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-start gap-2">
        <Brain className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-violet-800">Metoda blurtingu</p>
          <p className="text-xs text-violet-600 mt-0.5">Zamknij notatki i wpisz wszystko, co pamiętasz. Potem porównaj z oryginałem.</p>
        </div>
      </div>
      {topic && (
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">{topic.topicName}</p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Wpisz wszystko, co pamiętasz… bez zaglądania do notatek!"
            className="w-full h-40 px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setRevealed(r => !r)}
              className="flex-1 py-2.5 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold cursor-pointer min-h-[44px]"
            >
              {revealed ? 'Ukryj oryginał' : 'Pokaż oryginał'}
            </button>
            <button
              onClick={() => { setText(''); setRevealed(false); }}
              className="py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold cursor-pointer min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <AnimatePresence>
            {revealed && topic.noteContent && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl"
              >
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Oryginalna notatka</p>
                {renderMarkdown(topic.noteContent)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// Study Lab main menu
function TabStudyLab({ subject }: { subject: string }) {
  const lessons = mockStudentLessons.filter(l => l.subject === subject);
  const [mode, setMode] = useState<StudyMode>('menu');

  if (mode === 'flashcards') return <FlashcardMode lessons={lessons} onBack={() => setMode('menu')} />;
  if (mode === 'quiz')       return <QuizMode       onBack={() => setMode('menu')} />;
  if (mode === 'blurting')   return <BlurtingMode   lessons={lessons} onBack={() => setMode('menu')} />;

  const withNotes = lessons.filter(l => l.noteContent).length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-violet-500 to-purple-700 rounded-3xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="font-bold text-sm">Study Lab</span>
        </div>
        <p className="text-xs text-violet-200">Automatycznie generowane ćwiczenia z Twoich notatek lekcyjnych</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-violet-200">
          <span>{withNotes} notatek do nauki</span>
          <span className="text-violet-300">·</span>
          <span>{lessons.length} lekcji</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { id: 'flashcards' as StudyMode, icon: Zap,    title: 'Fiszki',   desc: 'Aktywne przypominanie – pojęcia i definicje z notatek',    color: 'bg-sky-50 border-sky-200',     iconCls: 'bg-sky-100 text-sky-600',     badge: 'Popularne',   badgeCls: 'bg-sky-100 text-sky-600'     },
          { id: 'quiz'       as StudyMode, icon: Target,  title: 'Quiz',     desc: 'Pytania jednokrotnego wyboru oparte na materiale lekcyjnym', color: 'bg-violet-50 border-violet-200', iconCls: 'bg-violet-100 text-violet-600', badge: null,          badgeCls: ''                            },
          { id: 'blurting'   as StudyMode, icon: Brain,   title: 'Blurting', desc: 'Zapisz wszystko, co pamiętasz – porównaj z notatką',         color: 'bg-emerald-50 border-emerald-200', iconCls: 'bg-emerald-100 text-emerald-600', badge: 'Skuteczne', badgeCls: 'bg-emerald-100 text-emerald-600' },
        ].map(({ id, icon: Icon, title, desc, color, iconCls, badge, badgeCls }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${color} text-left cursor-pointer transition-all hover:shadow-sm min-h-[44px]`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconCls}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-gray-800 text-sm">{title}</span>
                {badge && <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeCls}`}>{badge}</span>}
              </div>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 4: Eksploruj ─────────────────────────────────────────────────────────

const SCOPE_LABEL: Record<ExternalMaterial['scope'], string> = {
  school:      'Inna szkoła w mieście',
  county:      'Inny powiat',
  voivodeship: 'Inne województwo',
  all:         'Cała Polska',
};
const SCOPE_ICON: Record<ExternalMaterial['scope'], typeof School> = {
  school: School, county: MapPin, voivodeship: Globe, all: Globe,
};

function ExternalCard({ mat }: { mat: ExternalMaterial }) {
  const [noteOpen,   setNoteOpen]   = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const ScopeIcon = SCOPE_ICON[mat.scope];

  return (
    <>
      <AnimatePresence>
        {noteOpen && mat.noteContent && (
          <NoteModal content={mat.noteContent} topicName={mat.topicName} onClose={() => setNoteOpen(false)} />
        )}
      </AnimatePresence>

      {/* Amber left border – "Społeczność" */}
      <div className="rounded-2xl bg-white border border-amber-200 border-l-4 overflow-hidden" style={{ borderLeftColor: '#f59e0b' }}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: mat.thumbnailColor }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-bold text-gray-800 text-sm">{mat.topicName}</span>
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full font-medium flex-shrink-0">
                  Społeczność
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{mat.unitName}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <ScopeIcon className="w-3 h-3" /> {SCOPE_LABEL[mat.scope]}
                </span>
                <span className="text-xs text-gray-400">{mat.schoolName}, {mat.city}</span>
                <span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <ThumbsUp className="w-3 h-3" /> {mat.likes}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {mat.noteContent && (
              <button
                onClick={() => setNoteOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold cursor-pointer min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5" /> Notatka
              </button>
            )}
            {mat.recordingDurationSeconds && (
              <button
                onClick={() => setPlayerOpen(p => !p)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold cursor-pointer min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5" /> {playerOpen ? 'Ukryj' : 'Słuchaj'}
              </button>
            )}
          </div>

          <AnimatePresence>
            {playerOpen && mat.recordingDurationSeconds && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <MockPlayer durationSeconds={mat.recordingDurationSeconds} color="#f59e0b" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function TabExplore({ subject }: { subject: string }) {
  const materials = mockExternalMaterials.filter(m => m.subject === subject);

  if (materials.length === 0)
    return (
      <Card padding="lg" className="text-center py-10">
        <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Brak materiałów z innych szkół z tego przedmiotu.</p>
      </Card>
    );

  return (
    <div className="space-y-4">
      {/* Amber informational banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200">
        <Globe className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-amber-800">Eksploruj · Materiały Społeczności</p>
            <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full font-medium">Zewnętrzne</span>
          </div>
          <p className="text-xs text-amber-700 mt-0.5">
            Materiały od nauczycieli z innych szkół. Mogą różnić się od programu Twojej klasy – traktuj je jako uzupełnienie, nie zastępstwo oficjalnych materiałów.
          </p>
        </div>
      </div>

      {/* Groups by scope with section dividers */}
      {(['voivodeship', 'county', 'school', 'all'] as ExternalMaterial['scope'][]).map(scope => {
        const group = materials.filter(m => m.scope === scope);
        if (!group.length) return null;
        const ScopeIcon = SCOPE_ICON[scope];
        return (
          <div key={scope}>
            {/* Section divider */}
            <div className="flex items-center gap-2 mt-2 mb-3">
              <ScopeIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{SCOPE_LABEL[scope]}</span>
              <div className="flex-1 h-px bg-amber-100" />
            </div>
            {/* Indented group */}
            <div className="space-y-2 pl-2 border-l-2 border-amber-100 ml-1">
              {group.map(m => <ExternalCard key={m.id} mat={m} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'lessons',  label: 'Lekcje',   icon: BookOpen },
  { id: 'tasks',    label: 'Zadania',   icon: ClipboardList },
  { id: 'studylab', label: 'Study Lab', icon: Sparkles },
  { id: 'explore',  label: 'Eksploruj', icon: Globe },
] as const;
type TabId = typeof TABS[number]['id'];

// ─── Subject Header ───────────────────────────────────────────────────────────

function SubjectHeader({
  subject, teacherName, className: cls, lessons, nextExam,
}: {
  subject: string;
  teacherName: string;
  className: string;
  lessons: StudentLesson[];
  nextExam: ReturnType<typeof mockStudentExams.filter>[number] | undefined;
}) {
  const color = subjectColor(subject);
  const withMaterials = lessons.filter(l => l.noteId || l.recordingId).length;
  const pct = lessons.length > 0 ? Math.round((withMaterials / lessons.length) * 100) : 0;
  const daysToExam = nextExam ? differenceInDays(parseISO(nextExam.date), new Date()) : null;

  const urgency =
    daysToExam === null ? null :
    daysToExam <= 3  ? 'red' :
    daysToExam <= 7  ? 'amber' : 'sky';

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-white/80">
      {/* Top strip – subject identity */}
      <div className="p-5" style={{ backgroundColor: color }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subject}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-gray-700">{teacherName}</span>
              <span className="text-gray-400">·</span>
              <span className="text-xs px-2.5 py-0.5 bg-white/70 backdrop-blur-sm rounded-full font-semibold text-gray-700 border border-white/80">
                Klasa {cls}
              </span>
            </div>
          </div>
          <div
            className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
          >
            <BookOpen className="w-7 h-7 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-4 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Realizacja materiału
          </span>
          <span className="text-xs font-bold text-gray-700">
            {withMaterials}/{lessons.length} lekcji z materiałami
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-sky-500"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% materiału dostępne</p>
      </div>

      {/* Focus card – countdown to next exam */}
      {nextExam && daysToExam !== null && (
        <div className={`px-5 py-4 border-t flex items-center gap-3 ${
          urgency === 'red'   ? 'bg-red-50 border-red-100' :
          urgency === 'amber' ? 'bg-amber-50 border-amber-100' :
                                'bg-sky-50 border-sky-100'
        }`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            urgency === 'red'   ? 'bg-red-100' :
            urgency === 'amber' ? 'bg-amber-100' :
                                  'bg-sky-100'
          }`}>
            <CalendarCheck className={`w-5 h-5 ${
              urgency === 'red'   ? 'text-red-500' :
              urgency === 'amber' ? 'text-amber-500' :
                                    'text-sky-500'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider ${
              urgency === 'red' ? 'text-red-600' : urgency === 'amber' ? 'text-amber-600' : 'text-sky-600'
            }`}>
              Nadchodzące wydarzenie
            </p>
            <p className="text-sm font-bold text-gray-800 truncate mt-0.5">
              {nextExam.topicNames.slice(0, 2).join(', ')}
              {nextExam.topicNames.length > 2 ? ' i inne' : ''}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-2xl font-bold leading-none ${
              urgency === 'red' ? 'text-red-600' : urgency === 'amber' ? 'text-amber-600' : 'text-sky-600'
            }`}>
              {daysToExam === 0 ? 'Dziś' : `${daysToExam}d`}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {daysToExam === 0 ? 'egzamin!' : daysToExam === 1 ? 'jutro' : `za ${daysToExam} dni`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function SubjectPage() {
  const { subject: encodedSubject } = useParams<{ subject: string }>();
  const subject = encodedSubject ? decodeURIComponent(encodedSubject) : null;
  const { student } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('lessons');

  if (!subject) return <Navigate to="/student" replace />;

  const lessons = mockStudentLessons.filter(l => l.subject === subject);
  const exams   = mockStudentExams.filter(e => e.subject === subject);
  const homework = mockStudentHomework.filter(h => h.subject === subject && !h.done);
  const external = mockExternalMaterials.filter(m => m.subject === subject);

  const teacherName = lessons[0]?.teacherName ?? 'Nauczyciel';
  const className   = lessons[0]?.className ?? student?.className ?? '';

  const nextExam = exams.length > 0
    ? [...exams].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())[0]
    : undefined;

  const counts: Record<TabId, number> = {
    lessons:  lessons.length,
    tasks:    homework.length + exams.length,
    studylab: 0,
    explore:  external.length,
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      <SubjectHeader
        subject={subject}
        teacherName={teacherName}
        className={className}
        lessons={lessons}
        nextExam={nextExam}
      />

      {/* Segmented Control */}
      <div className="flex gap-0.5 p-1 bg-gray-100 rounded-2xl">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
              activeTab === id
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            {counts[id] > 0 && (
              <span className={`text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold flex-shrink-0 ${
                activeTab === id ? 'bg-sky-100 text-sky-600' : 'bg-gray-200 text-gray-500'
              }`}>
                {counts[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'lessons'  && <TabLessons        subject={subject} />}
          {activeTab === 'tasks'    && <TabTasksAndExams  subject={subject} />}
          {activeTab === 'studylab' && <TabStudyLab       subject={subject} />}
          {activeTab === 'explore'  && <TabExplore        subject={subject} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
