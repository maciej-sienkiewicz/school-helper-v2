import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, BarChart2, BookOpen, ClipboardList,
  FileText, Mic, CheckCircle2, Share2, Plus, Edit3,
  MousePointerClick, X, Calendar, Star, Trash2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Class, CurriculumTopic, TopicStatus } from '../../../types';
import type { Homework } from './AddHomeworkModal';

export interface TopicEngagement {
  studentsOpenedNote: number;
  studentsListenedRecording: number;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{children}</span>
    </div>
  );
}

function EngagementBar({ label, count, total, color }: {
  label: string; count: number; total: number; color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-bold text-gray-700">
          {count}<span className="text-gray-400 font-normal">/{total}</span>
          <span className="text-gray-400 font-normal ml-1">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-64 text-center px-6 py-12">
      <div className="w-14 h-14 rounded-3xl bg-violet-50 flex items-center justify-center mb-4">
        <MousePointerClick className="w-7 h-7 text-violet-300" />
      </div>
      <p className="text-sm font-semibold text-gray-500">Wybierz temat</p>
      <p className="text-xs text-gray-400 mt-1 max-w-[180px]">
        Kliknij dowolny temat z listy, aby zobaczyć szczegóły
      </p>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

interface Props {
  topic: CurriculumTopic | null;
  status: TopicStatus | undefined;
  engagement: TopicEngagement | undefined;
  cls: Class | undefined;
  homeworkList: Homework[];
  onClose: () => void;
  onOpenAddMaterial: (type: 'note' | 'recording', topicId: string, topicName: string) => void;
  onOpenAddHomework: (topicId: string, topicName: string) => void;
  onDeleteHomework: (id: string) => void;
}

export function LessonDetailPanel({
  topic, status, engagement, cls, homeworkList,
  onClose, onOpenAddMaterial, onOpenAddHomework, onDeleteHomework,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {!topic || !cls ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: cls.color }}
                >
                  <GraduationCap className="w-5 h-5 text-gray-700/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-gray-800 leading-tight">{topic.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{cls.name} · {cls.subject}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">

              {/* ── Zaangażowanie ───────────────────────────────────────────── */}
              <div>
                <SectionLabel icon={<BarChart2 className="w-3.5 h-3.5" />}>Zaangażowanie</SectionLabel>

                {/* Stat chips */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2.5 rounded-2xl bg-gray-50 text-center">
                    <div className="text-lg font-bold text-gray-800">{cls.studentCount}</div>
                    <div className="text-[10px] text-gray-500 leading-tight mt-0.5">Uczniów</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-violet-50 text-center">
                    <div className="text-lg font-bold text-violet-700">{engagement?.studentsOpenedNote ?? 0}</div>
                    <div className="text-[10px] text-violet-500 leading-tight mt-0.5">Notatka</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-center">
                    <div className="text-lg font-bold text-amber-700">{engagement?.studentsListenedRecording ?? 0}</div>
                    <div className="text-[10px] text-amber-500 leading-tight mt-0.5">Nagranie</div>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  {status?.hasNote && engagement ? (
                    <EngagementBar
                      label="Otworzyło notatkę"
                      count={engagement.studentsOpenedNote}
                      total={cls.studentCount}
                      color="#8b5cf6"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs">Brak notatki — brak danych</span>
                    </div>
                  )}
                  {status?.hasRecording && engagement ? (
                    <EngagementBar
                      label="Odsłuchało nagranie"
                      count={engagement.studentsListenedRecording}
                      total={cls.studentCount}
                      color="#f59e0b"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mic className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs">Brak nagrania — brak danych</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Materiały ───────────────────────────────────────────────── */}
              <div>
                <SectionLabel icon={<BookOpen className="w-3.5 h-3.5" />}>Materiały</SectionLabel>

                <div className="space-y-2">
                  {/* Note row */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/60">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800">Notatka</div>
                      <div className="text-xs text-gray-400">
                        {status?.hasNote ? 'Dostępna dla uczniów' : 'Brak notatki'}
                      </div>
                    </div>
                    {status?.hasNote && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                    <Button
                      variant={status?.hasNote ? 'secondary' : 'primary'}
                      size="sm"
                      icon={status?.hasNote ? <Edit3 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      onClick={() => onOpenAddMaterial('note', topic.id, topic.name)}
                    >
                      {status?.hasNote ? 'Edytuj' : 'Dodaj'}
                    </Button>
                  </div>

                  {/* Recording row */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/60">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800">Nagranie</div>
                      <div className="text-xs text-gray-400">
                        {status?.hasRecording ? 'Dostępne dla uczniów' : 'Brak nagrania'}
                      </div>
                    </div>
                    {status?.hasRecording && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                    <Button
                      variant={status?.hasRecording ? 'secondary' : 'primary'}
                      size="sm"
                      icon={status?.hasRecording ? <Edit3 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      onClick={() => onOpenAddMaterial('recording', topic.id, topic.name)}
                    >
                      {status?.hasRecording ? 'Edytuj' : 'Dodaj'}
                    </Button>
                  </div>

                  {status?.isShared && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-sky-50 border border-sky-100">
                      <Share2 className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                      <span className="text-xs text-sky-700">Materiały udostępnione uczniom</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Zadania domowe ───────────────────────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel icon={<ClipboardList className="w-3.5 h-3.5" />}>
                    Zadania domowe
                    {homeworkList.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold normal-case tracking-normal">
                        {homeworkList.length}
                      </span>
                    )}
                  </SectionLabel>
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {homeworkList.map(hw => (
                      <motion.div
                        key={hw.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-3 p-3 rounded-2xl border border-gray-100 bg-orange-50/40 group/hw"
                      >
                        <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ClipboardList className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800 leading-tight">{hw.title}</span>
                            {hw.isExtra && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                                <Star className="w-2.5 h-2.5" /> Nadobowiązkowe
                              </span>
                            )}
                          </div>
                          {hw.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{hw.description}</p>
                          )}
                          {hw.dueDate && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(hw.dueDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => onDeleteHomework(hw.id)}
                          className="w-6 h-6 rounded-lg hover:bg-red-100 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover/hw:opacity-100 flex-shrink-0 mt-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {homeworkList.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">Brak zadań domowych dla tego tematu</p>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => onOpenAddHomework(topic.id, topic.name)}
                    className="w-full justify-center mt-1"
                  >
                    Dodaj zadanie domowe
                  </Button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
