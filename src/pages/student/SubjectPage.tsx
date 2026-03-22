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

// ─── Placeholder tabs (filled in later commits) ───────────────────────────────

function TabLessons({ subject }: { subject: string }) {
  const lessons = mockStudentLessons.filter(l => l.subject === subject);
  if (lessons.length === 0)
    return <p className="text-gray-400 text-sm text-center py-8">Brak lekcji z tego przedmiotu.</p>;
  return (
    <div className="space-y-3">
      {lessons.map(l => (
        <Card key={l.id} padding="md">
          <p className="font-bold text-sm text-gray-800">{l.topicName}</p>
          <p className="text-xs text-gray-500">{l.unitName}</p>
        </Card>
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
