import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, FileText, Play, ThumbsUp, MessageCircle,
  ChevronDown, ChevronUp, Send, Layers, BookOpen, CheckCircle2,
  Circle, Mic,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { mockStudentLessons, mockUnits, mockTopics, mockTopicStatuses } from '../../../data/mockData';
import type { StudentLesson, StudentComment } from '../../../types';
import { NoteModal, MockPlayer } from './shared';

// ─── Single lesson card ────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  cardRef,
}: {
  lesson: StudentLesson;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const [noteOpen, setNoteOpen]           = useState(false);
  const [playerOpen, setPlayerOpen]       = useState(false);
  const [commentsOpen, setCommentsOpen]   = useState(false);
  const [liked, setLiked]                 = useState(lesson.hasLiked);
  const [likeCount, setLikeCount]         = useState(lesson.likes);
  const [comments, setComments]           = useState<StudentComment[]>(lesson.comments);
  const [newComment, setNewComment]       = useState('');

  const toggleLike = () => {
    setLiked(p => !p);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      { id: `c-${Date.now()}`, studentName: 'anonim', text: newComment.trim(), createdAt: new Date().toISOString(), isOwn: true },
    ]);
    setNewComment('');
  };

  return (
    <>
      <AnimatePresence>
        {noteOpen && lesson.noteContent && (
          <NoteModal content={lesson.noteContent} topicName={lesson.topicName} onClose={() => setNoteOpen(false)} />
        )}
      </AnimatePresence>

      {/* Niebieskie obramowanie lewe — "oficjalny" charakter materiału */}
      <div
        ref={cardRef}
        className="bg-white rounded-3xl shadow-card border border-white/80 border-l-4 overflow-hidden"
        style={{ borderLeftColor: '#0ea5e9' }}
      >
        <div className="p-5">

          {/* Header */}
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: lesson.thumbnailColor }}
            >
              <GraduationCap className="w-5 h-5 text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400">
                {format(parseISO(lesson.date), 'EEEE, d MMMM yyyy', { locale: pl })}
              </div>
              <div className="font-bold text-gray-800 text-sm mt-0.5">{lesson.topicName}</div>
              <div className="text-xs text-gray-500">{lesson.unitName}</div>
            </div>
          </div>

          {/* Material buttons */}
          <div className="flex items-center gap-2 mt-3">
            {lesson.noteId
              ? (
                <button
                  onClick={() => setNoteOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
                >
                  <FileText className="w-3.5 h-3.5" /> Otwórz notatkę
                </button>
              )
              : <span className="text-xs text-gray-300 flex items-center gap-1"><FileText className="w-3 h-3" /> Brak notatki</span>
            }
            {lesson.recordingId && (
              <button
                onClick={() => setPlayerOpen(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[44px] ${
                  playerOpen
                    ? 'bg-violet-200 text-violet-800'
                    : 'bg-violet-100 hover:bg-violet-200 text-violet-700'
                }`}
              >
                <Play className="w-3.5 h-3.5" /> Nagranie
              </button>
            )}
          </div>

          {/* ── Recording player (shown only when Nagranie is toggled) ── */}
          <AnimatePresence>
            {playerOpen && lesson.recordingId && lesson.recordingDurationSeconds && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Nagranie lekcji
                  </p>
                  <MockPlayer durationSeconds={lesson.recordingDurationSeconds} color={lesson.thumbnailColor} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Interaction bar ── */}
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
            {/* Like */}
            <button
              onClick={toggleLike}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl min-h-[44px] min-w-[44px] transition-all cursor-pointer text-sm font-semibold
                         hover:bg-sky-50 active:scale-95"
              style={{ color: liked ? '#0ea5e9' : '#9ca3af' }}
            >
              <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-sky-500 text-sky-500' : ''}`} />
              <span>{likeCount}</span>
            </button>

            {/* Comments toggle */}
            <button
              onClick={() => setCommentsOpen(e => !e)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl min-h-[44px] min-w-[44px] text-sm text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length} {comments.length === 1 ? 'pytanie' : 'pytań'}</span>
              {commentsOpen ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {/* ── Expandable: comments only ── */}
          <AnimatePresence>
            {commentsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Pytania ({comments.length})
                    </p>
                    <span className="text-xs text-gray-400">Anonimowe</span>
                  </div>

                  {comments.map(c => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-2xl text-sm mb-2 ${c.isOwn ? 'bg-sky-50 border border-sky-100' : 'bg-gray-50'}`}
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
                    <p className="text-xs text-gray-400 mb-3">Nikt jeszcze nie zadał pytania — śmiało!</p>
                  )}

                  <div className="flex gap-2">
                    <input
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addComment()}
                      placeholder="Zadaj anonimowe pytanie do tej lekcji..."
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    <button
                      onClick={addComment}
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

// ─── Curriculum panel ──────────────────────────────────────────────────────────

function CurriculumPanel({
  lessons,
  onTopicClick,
}: {
  lessons: StudentLesson[];
  onTopicClick: (topicId: string) => void;
}) {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(['u1']));

  const toggleUnit = (id: string) =>
    setExpandedUnits(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Build a topicId → lesson map
  const lessonByTopicId = new Map<string, StudentLesson>();
  for (const l of lessons) {
    if (l.topicId) lessonByTopicId.set(l.topicId, l);
  }

  // Build unitId → completed count from lessons
  const completedTopicIdsByUnit = new Map<string, Set<string>>();
  for (const l of lessons) {
    if (l.topicId) {
      const topic = mockTopics.find(t => t.id === l.topicId);
      if (topic) {
        if (!completedTopicIdsByUnit.has(topic.unitId))
          completedTopicIdsByUnit.set(topic.unitId, new Set());
        completedTopicIdsByUnit.get(topic.unitId)!.add(topic.id);
      }
    }
  }

  // Also use mockTopicStatuses for status indicators
  const getStatus = (topicId: string) =>
    mockTopicStatuses.find(s => s.topicId === topicId);

  return (
    <div className="space-y-2">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        {[
          { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, label: 'Zrealizowany' },
          { icon: <FileText className="w-3.5 h-3.5 text-violet-500" />, label: 'Ma notatkę' },
          { icon: <Mic className="w-3.5 h-3.5 text-amber-500" />, label: 'Ma nagranie' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1 text-gray-500">
            {icon} {label}
          </div>
        ))}
      </div>

      {mockUnits.map(unit => {
        const topics = mockTopics.filter(t => t.unitId === unit.id);
        const isExpanded = expandedUnits.has(unit.id);
        const completedInUnit = completedTopicIdsByUnit.get(unit.id)?.size ?? 0;

        return (
          <div key={unit.id} className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleUnit(unit.id)}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-bold text-gray-800">{unit.name}</span>
                <div className="text-xs text-gray-500 mt-0.5">
                  {completedInUnit}/{topics.length} tematów zrealizowanych
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${topics.length ? (completedInUnit / topics.length) * 100 : 0}%` }}
                />
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="divide-y divide-gray-50">
                    {topics.map(topic => {
                      const status = getStatus(topic.id);
                      const hasLesson = lessonByTopicId.has(topic.id);
                      const isDone = hasLesson || status?.completed;

                      return (
                        <div
                          key={topic.id}
                          className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                            hasLesson ? 'hover:bg-sky-50/60 cursor-pointer' : ''
                          }`}
                          onClick={hasLesson ? () => onTopicClick(topic.id) : undefined}
                        >
                          {isDone
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          }
                          <span className={`flex-1 text-sm ${isDone ? 'text-gray-600' : 'text-gray-400'} ${hasLesson ? 'font-medium' : ''}`}>
                            {topic.name}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {status?.hasNote && (
                              <div className="w-5 h-5 rounded-lg bg-violet-100 flex items-center justify-center" title="Ma notatkę">
                                <FileText className="w-3 h-3 text-violet-500" />
                              </div>
                            )}
                            {status?.hasRecording && (
                              <div className="w-5 h-5 rounded-lg bg-amber-100 flex items-center justify-center" title="Ma nagranie">
                                <Mic className="w-3 h-3 text-amber-500" />
                              </div>
                            )}
                            {hasLesson && (
                              <ChevronDown className="w-3.5 h-3.5 text-sky-400 rotate-[-90deg]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab component ─────────────────────────────────────────────────────────────

export function TabLessons({ subject }: { subject: string }) {
  const lessons = mockStudentLessons.filter(l => l.subject === subject);
  const [curriculumOpen, setCurriculumOpen] = useState(false);

  // Refs for each lesson card keyed by lesson id
  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const scrollToTopic = (topicId: string) => {
    const lesson = lessons.find(l => l.topicId === topicId);
    if (!lesson) return;
    const el = cardRefs.current.get(lesson.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Brief highlight flash
      el.style.transition = 'box-shadow 0.3s';
      el.style.boxShadow = '0 0 0 3px #0ea5e9';
      setTimeout(() => { el.style.boxShadow = ''; }, 1200);
    }
    // Close curriculum panel after navigation
    setCurriculumOpen(false);
  };

  if (lessons.length === 0)
    return <p className="text-gray-400 text-sm text-center py-12">Brak lekcji z tego przedmiotu.</p>;

  // Group by curriculum unit
  const byUnit = new Map<string, StudentLesson[]>();
  for (const l of lessons) {
    if (!byUnit.has(l.unitName)) byUnit.set(l.unitName, []);
    byUnit.get(l.unitName)!.push(l);
  }

  return (
    <div className="space-y-6">
      {/* Program nauczania — expandable */}
      <div className="rounded-2xl border border-sky-200 overflow-hidden">
        <button
          onClick={() => setCurriculumOpen(o => !o)}
          className="w-full flex items-center gap-3 p-4 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
        >
          <div className="w-2 h-8 rounded-full bg-sky-400 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-1">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-bold text-sky-700">Program nauczania</span>
          </div>
          {curriculumOpen
            ? <ChevronUp className="w-4 h-4 text-sky-500 flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-sky-500 flex-shrink-0" />
          }
        </button>

        <AnimatePresence>
          {curriculumOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white border-t border-sky-100">
                <CurriculumPanel lessons={lessons} onTopicClick={scrollToTopic} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {[...byUnit.entries()].map(([unit, list]) => (
        <div key={unit}>
          {/* Section divider */}
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm font-bold text-gray-600">{unit}</span>
            <span className="text-xs text-gray-400">({list.length})</span>
            <div className="flex-1 h-px bg-gray-100 ml-1" />
          </div>

          <div className="space-y-2">
            {list.map(l => (
              <LessonCard
                key={l.id}
                lesson={l}
                cardRef={el => cardRefs.current.set(l.id, el)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
