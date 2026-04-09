import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Play, Send, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { mockStudentLessons, mockStudentHomework } from '../../../data/mockData';
import type { StudentLesson, StudentComment, StudentHomework } from '../../../types';
import { MockPlayer } from './shared';

// ─── Checkbox wiersz zadania domowego ─────────────────────────────────────────

function HomeworkRow({
  hw,
  done,
  onToggle,
}: {
  hw: StudentHomework;
  done: boolean;
  onToggle: () => void;
}) {
  const days    = differenceInDays(parseISO(hw.dueDate), new Date());
  const overdue = days < 0 && !done;
  const urgent  = !overdue && days <= 2 && !done;

  const label =
    done      ? 'Zrobione'
    : overdue ? 'Zaległe!'
    : days === 0 ? 'Dzisiaj!'
    : days === 1 ? 'Jutro!'
    : `Za ${days} dni`;

  const labelColor =
    done      ? 'text-emerald-600'
    : overdue ? 'text-red-500'
    : urgent  ? 'text-amber-600'
    :            'text-gray-400';

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 text-left cursor-pointer transition-opacity group ${done ? 'opacity-40' : ''}`}
    >
      {/* Checkbox */}
      <div
        className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
        style={
          done
            ? { backgroundColor: '#10b981', borderColor: '#10b981' }
            : { borderColor: overdue ? '#fca5a5' : '#d1d5db' }
        }
      >
        {done && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3L9 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <span className={`flex-1 text-xs font-medium leading-snug ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {hw.title}
        {hw.isExtra && <span className="text-amber-500 ml-1 font-semibold">+</span>}
      </span>

      <span className={`text-xs font-semibold flex-shrink-0 ${labelColor}`}>{label}</span>
    </button>
  );
}

// ─── Karta lekcji ──────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  homework,
  doneIds,
  onToggleDone,
  cardRef,
}: {
  lesson: StudentLesson;
  homework: StudentHomework[];
  doneIds: Set<string>;
  onToggleDone: (id: string) => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const navigate = useNavigate();
  const [playerOpen, setPlayerOpen]     = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments]         = useState<StudentComment[]>(lesson.comments);
  const [newComment, setNewComment]     = useState('');

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        studentName: 'anonim',
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
        isOwn: true,
      },
    ]);
    setNewComment('');
  };

  // Tylko pending zadania w karcie lekcji
  const pendingHw = homework.filter(h => !doneIds.has(h.id));
  const doneHw    = homework.filter(h =>  doneIds.has(h.id));
  const allHw     = [...pendingHw, ...doneHw];

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      {/* ── Główna treść lekcji ── */}
      <div className="px-5 py-4">

        {/* Data */}
        <p className="text-xs text-gray-400 mb-1">
          {format(parseISO(lesson.date), 'd MMMM yyyy', { locale: pl })}
        </p>

        {/* Temat i dział */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{lesson.topicName}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{lesson.unitName}</p>

        {/* Materiały */}
        {(lesson.noteId || lesson.recordingId) && (
          <div className="flex items-center gap-2 mt-3">
            {lesson.noteId && (
              <button
                onClick={() => navigate(`/student/note/${lesson.noteId}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Notatka
              </button>
            )}
            {lesson.recordingId && (
              <button
                onClick={() => setPlayerOpen(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  playerOpen
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Nagranie
              </button>
            )}
          </div>
        )}

        {/* Odtwarzacz nagrania */}
        <AnimatePresence>
          {playerOpen && lesson.recordingId && lesson.recordingDurationSeconds && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4">
                <MockPlayer durationSeconds={lesson.recordingDurationSeconds} color="#f3f4f6" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Zadania domowe powiązane z lekcją ── */}
      {allHw.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-50 space-y-2.5">
          {allHw.map(hw => (
            <HomeworkRow
              key={hw.id}
              hw={hw}
              done={doneIds.has(hw.id)}
              onToggle={() => onToggleDone(hw.id)}
            />
          ))}
        </div>
      )}

      {/* ── Pytania do lekcji (ukryte domyślnie) ── */}
      {comments.length > 0 && (
        <div className="border-t border-gray-50">
          <button
            onClick={() => setCommentsOpen(o => !o)}
            className="w-full flex items-center gap-2 px-5 py-3 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{comments.length} {comments.length === 1 ? 'pytanie' : 'pytań'}</span>
            {commentsOpen
              ? <ChevronUp className="w-3.5 h-3.5 ml-auto" />
              : <ChevronDown className="w-3.5 h-3.5 ml-auto" />
            }
          </button>

          <AnimatePresence>
            {commentsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 space-y-2">
                  {comments.map(c => (
                    <div
                      key={c.id}
                      className={`px-3 py-2.5 rounded-xl text-xs ${
                        c.isOwn ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="font-semibold text-gray-400 mr-2">
                        {c.isOwn ? 'Ty' : 'Anonimowy uczeń'}
                      </span>
                      {c.text}
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <input
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addComment()}
                      placeholder="Zadaj anonimowe pytanie…"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="w-9 h-9 rounded-xl bg-gray-900 hover:bg-gray-700 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Jeśli brak komentarzy, pokaż pole do zadania pytania */}
      {comments.length === 0 && (
        <div className="border-t border-gray-50 px-5 py-3">
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addComment()}
              placeholder="Zadaj anonimowe pytanie do tej lekcji…"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="w-9 h-9 rounded-xl bg-gray-900 hover:bg-gray-700 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Zakładka Lekcje ───────────────────────────────────────────────────────────

export function TabLessons({
  subject,
  doneIds,
  onToggleDone,
}: {
  subject: string;
  doneIds: Set<string>;
  onToggleDone: (id: string) => void;
}) {
  // Sortuj od najnowszej do najstarszej
  const lessons = mockStudentLessons
    .filter(l => l.subject === subject)
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  const homework = mockStudentHomework.filter(h => h.subject === subject);

  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  if (lessons.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-12">
        Brak lekcji z tego przedmiotu.
      </p>
    );
  }

  // Grupuj po dziale, zachowując kolejność chronologiczną (dział = najnowsza lekcja w nim)
  const byUnit = new Map<string, StudentLesson[]>();
  for (const l of lessons) {
    if (!byUnit.has(l.unitName)) byUnit.set(l.unitName, []);
    byUnit.get(l.unitName)!.push(l);
  }

  return (
    <div className="space-y-8">
      {[...byUnit.entries()].map(([unit, list]) => (
        <div key={unit}>
          {/* Nagłówek działu */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {unit}
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Karty lekcji */}
          <div className="space-y-2">
            {list.map(l => (
              <LessonCard
                key={l.id}
                lesson={l}
                homework={homework.filter(h => h.lessonId === l.id)}
                doneIds={doneIds}
                onToggleDone={onToggleDone}
                cardRef={el => cardRefs.current.set(l.id, el)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
