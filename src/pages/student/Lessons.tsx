import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Play, FileText, ThumbsUp, MessageCircle,
  ChevronDown, ChevronUp, Send, Clock, GraduationCap, X
} from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { mockStudentLessons } from '../../data/mockData';
import type { StudentLesson, StudentComment } from '../../types';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

// ─── Note modal ───────────────────────────────────────────────────────────────

function NoteModal({ content, topicName, onClose }: { content: string; topicName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-500" /> {topicName}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {content.split('\n').map((line, i) => {
            if (line.startsWith('## '))
              return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-2">{line.slice(3)}</h3>;
            if (line.startsWith('# '))
              return <h2 key={i} className="text-lg font-bold text-gray-900 mb-3">{line.slice(2)}</h2>;
            if (line.startsWith('- '))
              return <li key={i} className="ml-4 text-sm text-gray-700 mb-1 list-disc">{line.slice(2)}</li>;
            if (line.trim() === '')
              return <div key={i} className="h-2" />;
            return <p key={i} className="text-sm text-gray-700 mb-1">{line}</p>;
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Recording mock player ────────────────────────────────────────────────────

function RecordingPlayer({ durationSeconds, color }: { durationSeconds: number; color: string }) {
  const [playing, setPlaying] = useState(false);
  const m = Math.floor(durationSeconds / 60);
  const s = durationSeconds % 60;
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
      <button
        onClick={() => setPlaying(p => !p)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow transition-transform active:scale-95 cursor-pointer"
        style={{ backgroundColor: color }}
      >
        {playing ? (
          <span className="flex gap-0.5">
            <span className="w-1 h-3 bg-white rounded-full" />
            <span className="w-1 h-3 bg-white rounded-full" />
          </span>
        ) : (
          <Play className="w-4 h-4 fill-white" />
        )}
      </button>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full w-1/3 rounded-full opacity-70" style={{ backgroundColor: color }} />
      </div>
      <span className="text-xs text-gray-500 font-mono">
        {m}:{s.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

// ─── Lesson card ──────────────────────────────────────────────────────────────

function LessonCard({ lesson }: { lesson: StudentLesson }) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<StudentComment[]>(lesson.comments);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(lesson.hasLiked);
  const [likeCount, setLikeCount] = useState(lesson.likes);
  const [noteOpen, setNoteOpen] = useState(false);

  const handleLike = () => {
    setLiked(p => !p);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: `new-${Date.now()}`,
      studentName: 'anonim',
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
      isOwn: true,
    }]);
    setNewComment('');
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

      <Card padding="md" className="overflow-hidden">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: lesson.thumbnailColor }}
          >
            <GraduationCap className="w-5 h-5 text-white/80" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400 mb-0.5">
              {format(parseISO(lesson.date), "EEEE, d MMMM yyyy", { locale: pl })}
            </div>
            <div className="font-bold text-gray-800 text-sm">{lesson.topicName}</div>
            <div className="text-xs text-gray-500">{lesson.unitName} · {lesson.teacherName}</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lesson.durationMinutes} min
            </span>
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              {expanded ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Material badges */}
        <div className="flex gap-2 mt-3">
          {lesson.noteId && (
            <button
              onClick={() => setNoteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileText className="w-3 h-3" /> Notatka
            </button>
          )}
          {lesson.recordingId && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
              <Play className="w-3 h-3" /> Nagranie
            </span>
          )}
          {!lesson.noteId && !lesson.recordingId && (
            <span className="text-xs text-gray-400">Brak materiałów</span>
          )}
        </div>

        {/* Like + comment counts */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-semibold transition-all cursor-pointer ${
              liked ? 'text-sky-600' : 'text-gray-400 hover:text-sky-500'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-sky-500 text-sky-500' : ''}`} />
            {likeCount}
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-sky-500 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            {comments.length} komentarzy
          </button>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Recording player */}
                {lesson.recordingId && lesson.recordingDurationSeconds && (
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Nagranie lekcji
                    </div>
                    <RecordingPlayer
                      durationSeconds={lesson.recordingDurationSeconds}
                      color={lesson.thumbnailColor}
                    />
                  </div>
                )}

                {/* Comments */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Komentarze ({comments.length})
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-200 inline-flex items-center justify-center text-gray-500 font-bold leading-none" style={{ fontSize: 8 }}>?</span>
                      Wszystkie komentarze są anonimowe
                    </span>
                  </div>
                  {comments.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {comments.map(c => (
                        <div
                          key={c.id}
                          className={`p-3 rounded-2xl text-sm ${
                            c.isOwn
                              ? 'bg-sky-50 border border-sky-100'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold text-xs ${c.isOwn ? 'text-sky-700' : 'text-gray-500'}`}>
                              {c.isOwn ? 'Ty (anonimowo)' : 'Anonimowy uczeń'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {format(parseISO(c.createdAt), "d MMM, HH:mm", { locale: pl })}
                            </span>
                          </div>
                          <p className="text-gray-700">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mb-3">Brak komentarzy. Bądź pierwszy!</p>
                  )}

                  {/* Add comment */}
                  <div className="flex gap-2">
                    <input
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                      placeholder="Napisz anonimowy komentarz lub pytanie..."
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                    >
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export function StudentLessons() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <SectionTitle icon={<BookOpen className="w-4 h-4" />} className="mb-6">
        Moje lekcje
      </SectionTitle>
      <div className="space-y-3">
        {mockStudentLessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
