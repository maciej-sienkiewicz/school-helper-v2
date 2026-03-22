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

function TabTasksAndExams({ subject }: { subject: string }) {
  const exams = mockStudentExams.filter(e => e.subject === subject);
  const hw = mockStudentHomework.filter(h => h.subject === subject);
  return (
    <div className="space-y-3">
      {exams.map(e => (
        <Card key={e.id} padding="md">
          <p className="font-bold text-sm text-gray-800">{e.scope}</p>
          <p className="text-xs text-gray-500">{format(parseISO(e.date), 'd MMMM yyyy', { locale: pl })}</p>
        </Card>
      ))}
      {hw.map(h => (
        <Card key={h.id} padding="md">
          <p className="font-bold text-sm text-gray-800">{h.title}</p>
          <p className="text-xs text-gray-500">{h.description}</p>
        </Card>
      ))}
    </div>
  );
}

function TabStudyLab({ subject: _subject }: { subject: string }) {
  return (
    <Card padding="lg" className="text-center py-10">
      <Brain className="w-8 h-8 text-gray-300 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">Study Lab – wkrótce dostępny</p>
    </Card>
  );
}

function TabExplore({ subject }: { subject: string }) {
  const materials = mockExternalMaterials.filter(m => m.subject === subject);
  if (materials.length === 0)
    return (
      <Card padding="lg" className="text-center py-10">
        <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Brak materiałów z innych szkół.</p>
      </Card>
    );
  return (
    <div className="space-y-3">
      {materials.map(m => (
        <Card key={m.id} padding="md">
          <p className="font-bold text-sm text-gray-800">{m.topicName}</p>
          <p className="text-xs text-gray-500">{m.schoolName}, {m.city}</p>
        </Card>
      ))}
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
