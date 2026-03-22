import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Play, FileText, ThumbsUp, MessageCircle,
  CalendarCheck, ClipboardList, Globe, Clock, MapPin,
  AlertCircle, CheckCircle2, Send, X, ChevronDown, ChevronUp,
  GraduationCap, School, Award, Layers
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import {
  mockStudentLessons, mockStudentExams,
  mockStudentHomework, mockExternalMaterials
} from '../../data/mockData';
import type { StudentLesson, StudentComment, ExternalMaterial } from '../../types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';

// ─── Shared helpers ────────────────────────────────────────────────────────────

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

function NoteModal({ content, topicName, onClose }: { content: string; topicName: string; onClose: () => void }) {
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
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 prose-sm">
          {renderMarkdown(content)}
        </div>
      </motion.div>
    </div>
  );
}

function MockPlayer({ durationSeconds, color }: { durationSeconds: number; color: string }) {
  const [playing, setPlaying] = useState(false);
  const m = Math.floor(durationSeconds / 60);
  const s = durationSeconds % 60;
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
      <button
        onClick={() => setPlaying(p => !p)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow transition-transform active:scale-95 cursor-pointer flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {playing
          ? <span className="flex gap-0.5"><span className="w-1 h-3 bg-white rounded-full" /><span className="w-1 h-3 bg-white rounded-full" /></span>
          : <Play className="w-4 h-4 fill-white" />
        }
      </button>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full w-1/3 rounded-full opacity-70" style={{ backgroundColor: color }} />
      </div>
      <span className="text-xs text-gray-500 font-mono">{m}:{s.toString().padStart(2, '0')}</span>
    </div>
  );
}

// ─── Tab 1: Historia lekcji ────────────────────────────────────────────────────

function LessonCard({ lesson }: { lesson: StudentLesson }) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<StudentComment[]>(lesson.comments);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(lesson.hasLiked);
  const [likeCount, setLikeCount] = useState(lesson.likes);
  const [noteOpen, setNoteOpen] = useState(false);

  const handleLike = () => { setLiked(p => !p); setLikeCount(c => liked ? c - 1 : c + 1); };
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, { id: `c-${Date.now()}`, studentName: 'anonim', text: newComment.trim(), createdAt: new Date().toISOString(), isOwn: true }]);
    setNewComment('');
  };

  return (
    <>
      <AnimatePresence>
        {noteOpen && lesson.noteContent && (
          <NoteModal content={lesson.noteContent} topicName={lesson.topicName} onClose={() => setNoteOpen(false)} />
        )}
      </AnimatePresence>
      <Card padding="md" className="overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: lesson.thumbnailColor }}>
            <GraduationCap className="w-5 h-5 text-white/80" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400">{format(parseISO(lesson.date), "EEEE, d MMMM yyyy", { locale: pl })}</div>
            <div className="font-bold text-gray-800 text-sm mt-0.5">{lesson.topicName}</div>
            <div className="text-xs text-gray-500">{lesson.unitName}</div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs text-gray-400 flex items-center gap-0.5"><Clock className="w-3 h-3" /> {lesson.durationMinutes} min</span>
            <button onClick={() => setExpanded(e => !e)} className="w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
              {expanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Material access buttons */}
        <div className="flex items-center gap-2 mt-3">
          {lesson.noteId
            ? <button onClick={() => setNoteOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-semibold transition-colors cursor-pointer">
                <FileText className="w-3 h-3" /> Otwórz notatkę
              </button>
            : <span className="text-xs text-gray-300 flex items-center gap-1"><FileText className="w-3 h-3" /> Brak notatki</span>
          }
          {lesson.recordingId && lesson.recordingDurationSeconds &&
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 text-violet-700 text-xs font-semibold">
              <Play className="w-3 h-3" /> Nagranie dostępne
            </span>
          }
        </div>

        {/* Like + comments bar */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-semibold transition-all cursor-pointer ${liked ? 'text-sky-600' : 'text-gray-400 hover:text-sky-500'}`}>
            <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-sky-500 text-sky-500' : ''}`} /> {likeCount}
          </button>
          <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-sky-500 transition-colors cursor-pointer">
            <MessageCircle className="w-4 h-4" /> {comments.length} pytań
          </button>
        </div>

        {/* Expanded: player + comments */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
              <div className="pt-4 space-y-4">
                {lesson.recordingId && lesson.recordingDurationSeconds && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nagranie lekcji</p>
                    <MockPlayer durationSeconds={lesson.recordingDurationSeconds} color={lesson.thumbnailColor} />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pytania ({comments.length})</p>
                    <span className="text-xs text-gray-400">Wszystkie anonimowe</span>
                  </div>
                  {comments.map(c => (
                    <div key={c.id} className={`p-3 rounded-2xl text-sm mb-2 ${c.isOwn ? 'bg-sky-50 border border-sky-100' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-xs ${c.isOwn ? 'text-sky-700' : 'text-gray-500'}`}>{c.isOwn ? 'Ty (anonimowo)' : 'Anonimowy uczeń'}</span>
                        <span className="text-xs text-gray-400">{format(parseISO(c.createdAt), "d MMM, HH:mm", { locale: pl })}</span>
                      </div>
                      <p className="text-gray-700">{c.text}</p>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-xs text-gray-400 mb-2">Nikt jeszcze nie zadał pytania. Śmiało!</p>}
                  <div className="flex gap-2">
                    <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                      placeholder="Zadaj anonimowe pytanie do tej lekcji..."
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
                    <button onClick={handleAddComment} disabled={!newComment.trim()} className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer flex-shrink-0">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
}

function TabHistory({ subject }: { subject: string }) {
  const lessons = mockStudentLessons.filter(l => l.subject === subject);
  const byUnit = new Map<string, StudentLesson[]>();
  for (const l of lessons) {
    if (!byUnit.has(l.unitName)) byUnit.set(l.unitName, []);
    byUnit.get(l.unitName)!.push(l);
  }

  if (lessons.length === 0)
    return <p className="text-gray-400 text-sm text-center py-8">Brak lekcji z tego przedmiotu.</p>;

  return (
    <div className="space-y-6">
      {[...byUnit.entries()].map(([unit, list]) => (
        <div key={unit}>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-600">{unit}</span>
            <span className="text-xs text-gray-400">({list.length})</span>
          </div>
          <div className="space-y-2">
            {list.map(l => <LessonCard key={l.id} lesson={l} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab 2: Egzaminy ──────────────────────────────────────────────────────────

function TabExams({ subject }: { subject: string }) {
  const exams = mockStudentExams.filter(e => e.subject === subject);
  if (exams.length === 0)
    return (
      <Card padding="lg" className="text-center py-10">
        <CalendarCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Brak nadchodzących egzaminów z tego przedmiotu.</p>
      </Card>
    );

  return (
    <div className="space-y-4">
      {exams.map(exam => {
        const days = differenceInDays(parseISO(exam.date), new Date());
        const chip = days <= 3 ? 'bg-red-100 text-red-700' : days <= 7 ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700';
        const label = days === 0 ? 'Dzisiaj!' : days === 1 ? 'Jutro!' : `Za ${days} dni`;
        return (
          <Card key={exam.id} padding="lg">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: exam.color }}>
                  <CalendarCheck className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">{format(parseISO(exam.date), "d MMMM yyyy", { locale: pl })}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exam.durationMinutes} min</span>
                    {exam.room && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> sala {exam.room}</span>}
                  </div>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${chip}`}>{label}</span>
            </div>
            <div className="bg-amber-50 rounded-2xl p-3 mb-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-0.5">Zakres materiału</p>
                <p className="text-sm text-amber-700">{exam.scope}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exam.topicNames.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: exam.color + '60', color: '#374151' }}>{t}</span>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Tab 3: Zadania ───────────────────────────────────────────────────────────

function TabHomework({ subject }: { subject: string }) {
  const all = mockStudentHomework.filter(h => h.subject === subject);
  const [done, setDone] = useState<Set<string>>(new Set(all.filter(h => h.done).map(h => h.id)));
  const mandatory = all.filter(h => !h.isExtra);
  const extra = all.filter(h => h.isExtra);

  const toggleDone = (id: string) => setDone(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  if (all.length === 0)
    return (
      <Card padding="lg" className="text-center py-10">
        <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Brak zadań domowych z tego przedmiotu.</p>
      </Card>
    );

  const HwCard = ({ hw }: { hw: typeof all[0] }) => {
    const isDone = done.has(hw.id);
    const days = differenceInDays(parseISO(hw.dueDate), new Date());
    const urgent = days <= 2 && !isDone;
    return (
      <div className={`p-4 rounded-2xl border-2 transition-all ${isDone ? 'border-emerald-200 bg-emerald-50' : urgent ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}>
        <div className="flex items-start gap-3">
          <button onClick={() => toggleDone(hw.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-400'}`}>
            {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-sm mb-1 ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>{hw.title}</div>
            <p className={`text-sm mb-2 ${isDone ? 'text-gray-400' : 'text-gray-600'}`}>{hw.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-semibold flex items-center gap-1 ${urgent && !isDone ? 'text-red-600' : 'text-gray-500'}`}>
                <CalendarCheck className="w-3 h-3" />
                {isDone ? 'Oddane' : days < 0 ? `Spóźnione o ${Math.abs(days)} dni` : days === 0 ? 'Dzisiaj!' : `Za ${days} dni`}
                {' · '}{format(parseISO(hw.dueDate), "d MMM", { locale: pl })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {mandatory.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-700">Zadania obowiązkowe</span>
            <span className="text-xs text-gray-400">({mandatory.filter(h => done.has(h.id)).length}/{mandatory.length} zrobionych)</span>
          </div>
          <div className="space-y-2">{mandatory.map(h => <HwCard key={h.id} hw={h} />)}</div>
        </div>
      )}
      {extra.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-700">Zadania dodatkowe</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">+</span>
          </div>
          <div className="space-y-2">{extra.map(h => <HwCard key={h.id} hw={h} />)}</div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Materiały zewnętrzne ──────────────────────────────────────────────

const scopeLabel: Record<ExternalMaterial['scope'], string> = {
  school: 'Inna szkoła w mieście',
  county: 'Inny powiat',
  voivodeship: 'Inne województwo',
  all: 'Cała Polska',
};
const scopeIcon: Record<ExternalMaterial['scope'], typeof School> = {
  school: School, county: MapPin, voivodeship: Globe, all: Globe,
};

function ExternalCard({ mat }: { mat: ExternalMaterial }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ScopeIcon = scopeIcon[mat.scope];

  return (
    <>
      <AnimatePresence>
        {noteOpen && mat.noteContent && (
          <NoteModal content={mat.noteContent} topicName={mat.topicName} onClose={() => setNoteOpen(false)} />
        )}
      </AnimatePresence>
      <Card padding="md" className="border-l-4" style={{ borderLeftColor: mat.thumbnailColor }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: mat.thumbnailColor }} />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-800 text-sm">{mat.topicName}</div>
            <div className="text-xs text-gray-500 mb-2">{mat.unitName}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                <ScopeIcon className="w-3 h-3" /> {scopeLabel[mat.scope]}
              </span>
              <span className="text-xs text-gray-400">{mat.schoolName}, {mat.city}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <ThumbsUp className="w-3 h-3" /> {mat.likes}
              </span>
            </div>
          </div>
          {(mat.noteContent || mat.recordingDurationSeconds) && (
            <button onClick={() => setExpanded(e => !e)} className="w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0">
              {expanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          {mat.noteContent && (
            <button onClick={() => setNoteOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-semibold transition-colors cursor-pointer">
              <FileText className="w-3 h-3" /> Notatka
            </button>
          )}
          {mat.recordingDurationSeconds && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 text-violet-700 text-xs font-semibold">
              <Play className="w-3 h-3" /> Nagranie
            </span>
          )}
        </div>

        <AnimatePresence>
          {expanded && mat.recordingDurationSeconds && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="pt-3">
                <MockPlayer durationSeconds={mat.recordingDurationSeconds} color={mat.thumbnailColor} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
}

function TabExternal({ subject }: { subject: string }) {
  const materials = mockExternalMaterials.filter(m => m.subject === subject);

  if (materials.length === 0)
    return (
      <Card padding="lg" className="text-center py-10">
        <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Brak materiałów z innych szkół z tego przedmiotu.</p>
      </Card>
    );

  return (
    <div className="space-y-3">
      {/* Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <Globe className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Materiały z innych szkół</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Te materiały zostały udostępnione przez nauczycieli z innych szkół, powiatów lub województw.
            Mogą się różnić od programu Twojej klasy — traktuj je jako uzupełnienie.
          </p>
        </div>
      </div>

      {/* Group by scope */}
      {(['voivodeship', 'county', 'school', 'all'] as ExternalMaterial['scope'][]).map(scope => {
        const group = materials.filter(m => m.scope === scope);
        if (group.length === 0) return null;
        const ScopeIcon = scopeIcon[scope];
        return (
          <div key={scope}>
            <div className="flex items-center gap-2 mb-2 mt-4">
              <ScopeIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{scopeLabel[scope]}</span>
            </div>
            <div className="space-y-2">
              {group.map(m => <ExternalCard key={m.id} mat={m} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'history', label: 'Historia lekcji', icon: BookOpen },
  { id: 'exams',   label: 'Egzaminy',        icon: CalendarCheck },
  { id: 'homework',label: 'Zadania',          icon: ClipboardList },
  { id: 'external',label: 'Z innych szkół',   icon: Globe },
] as const;

type TabId = typeof TABS[number]['id'];

export function SubjectPage() {
  const { subject: encodedSubject } = useParams<{ subject: string }>();
  const subject = encodedSubject ? decodeURIComponent(encodedSubject) : null;
  const [activeTab, setActiveTab] = useState<TabId>('history');

  if (!subject) return <Navigate to="/student" replace />;

  const homeworkCount = mockStudentHomework.filter(h => h.subject === subject && !h.done).length;
  const examsCount = mockStudentExams.filter(e => e.subject === subject).length;
  const externalCount = mockExternalMaterials.filter(m => m.subject === subject).length;

  const counts: Record<TabId, number> = {
    history: mockStudentLessons.filter(l => l.subject === subject).length,
    exams: examsCount,
    homework: homeworkCount,
    external: externalCount,
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{subject}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {counts.history} lekcji · {examsCount} egzaminów · {homeworkCount} zadań do zrobienia
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
            {counts[id] > 0 && (
              <span className={`text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold ${activeTab === id ? 'bg-sky-100 text-sky-600' : 'bg-gray-200 text-gray-500'}`}>
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
          {activeTab === 'history'  && <TabHistory  subject={subject} />}
          {activeTab === 'exams'    && <TabExams    subject={subject} />}
          {activeTab === 'homework' && <TabHomework subject={subject} />}
          {activeTab === 'external' && <TabExternal subject={subject} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
