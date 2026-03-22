import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, FileText, Play, ThumbsUp, MessageCircle,
  Clock, ChevronDown, ChevronUp, Send, Layers,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { mockStudentLessons } from '../../../data/mockData';
import type { StudentLesson, StudentComment } from '../../../types';
import { NoteModal, MockPlayer } from './shared';

// ─── Single lesson card ────────────────────────────────────────────────────────

function LessonCard({ lesson }: { lesson: StudentLesson }) {
  const [noteOpen, setNoteOpen]   = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const [liked, setLiked]         = useState(lesson.hasLiked);
  const [likeCount, setLikeCount] = useState(lesson.likes);
  const [comments, setComments]   = useState<StudentComment[]>(lesson.comments);
  const [newComment, setNewComment] = useState('');

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
      <div className="bg-white rounded-3xl shadow-card border border-white/80 border-l-4 overflow-hidden" style={{ borderLeftColor: '#0ea5e9' }}>
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
            <span className="text-xs text-gray-400 flex items-center gap-0.5 flex-shrink-0 mt-1">
              <Clock className="w-3 h-3" /> {lesson.durationMinutes} min
            </span>
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
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-100 text-violet-700 text-xs font-semibold">
                <Play className="w-3.5 h-3.5" /> Nagranie
              </span>
            )}
          </div>

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
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl min-h-[44px] min-w-[44px] text-sm text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length} {comments.length === 1 ? 'pytanie' : 'pytań'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {/* ── Expandable: player + comments ── */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">

                  {/* Recording player */}
                  {lesson.recordingId && lesson.recordingDurationSeconds && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Nagranie lekcji
                      </p>
                      <MockPlayer durationSeconds={lesson.recordingDurationSeconds} color={lesson.thumbnailColor} />
                    </div>
                  )}

                  {/* Comments – domyślnie zwinięte, widoczne po otwarciu */}
                  <div>
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

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ─── Tab component ─────────────────────────────────────────────────────────────

export function TabLessons({ subject }: { subject: string }) {
  const lessons = mockStudentLessons.filter(l => l.subject === subject);

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
      {/* Banner — oficjalny charakter materiałów */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-200">
        <div className="w-2 h-8 rounded-full bg-sky-400 flex-shrink-0" />
        <p className="text-xs text-sky-700">
          <span className="font-bold">Moja szkoła &mdash;</span> materiały zatwierdzone przez nauczyciela.
        </p>
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
            {list.map(l => <LessonCard key={l.id} lesson={l} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
