import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, GraduationCap, BarChart2, BookOpen, ClipboardList,
  FileText, Mic, CheckCircle2, Share2, Plus, Edit3,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Class, CurriculumTopic, TopicStatus } from '../../../types';

export interface TopicEngagement {
  studentsOpenedNote: number;
  studentsListenedRecording: number;
}

type Tab = 'engagement' | 'materials' | 'homework';

const TABS: { id: Tab; label: string; icon: typeof BarChart2 }[] = [
  { id: 'engagement', label: 'Zaangażowanie', icon: BarChart2 },
  { id: 'materials',  label: 'Materiały',     icon: BookOpen  },
  { id: 'homework',   label: 'Zadanie domowe', icon: ClipboardList },
];

function EngagementBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-bold text-gray-800">
          {count}<span className="text-gray-400 font-normal">/{total}</span>
          <span className="text-xs text-gray-400 font-normal ml-1">({pct}%)</span>
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

interface Props {
  topic: CurriculumTopic;
  status: TopicStatus | undefined;
  engagement: TopicEngagement | undefined;
  cls: Class;
  onClose: () => void;
  onOpenAddMaterial: (type: 'note' | 'recording', topicId: string, topicName: string) => void;
}

export function LessonDetailModal({ topic, status, engagement, cls, onClose, onOpenAddMaterial }: Props) {
  const [tab, setTab] = useState<Tab>('engagement');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');
  const [hwIsExtra, setHwIsExtra] = useState(false);
  const [hwAdded, setHwAdded] = useState(false);

  const submitHomework = () => {
    if (!hwTitle.trim()) return;
    setHwAdded(true);
    setTimeout(() => {
      setHwTitle(''); setHwDesc(''); setHwDueDate(''); setHwIsExtra(false); setHwAdded(false);
    }, 2000);
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-gray-700 flex-shrink-0" style={{ background: cls.color }}>
              <GraduationCap className="w-5 h-5 text-gray-700/70" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight">{topic.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{cls.name} · {cls.subject}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-4">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >

              {/* ── Engagement ──────────────────────────────────────────────── */}
              {tab === 'engagement' && (
                <div className="space-y-5">
                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-gray-50 text-center">
                      <div className="text-xl font-bold text-gray-800">{cls.studentCount}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Uczniów łącznie</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-violet-50 text-center">
                      <div className="text-xl font-bold text-violet-700">{engagement?.studentsOpenedNote ?? 0}</div>
                      <div className="text-xs text-violet-500 mt-0.5">Otworzyło notatkę</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-50 text-center">
                      <div className="text-xl font-bold text-amber-700">{engagement?.studentsListenedRecording ?? 0}</div>
                      <div className="text-xs text-amber-500 mt-0.5">Odsłuchało nagranie</div>
                    </div>
                  </div>

                  {/* Engagement bars */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-4">
                    {status?.hasNote && engagement ? (
                      <EngagementBar
                        label="Uczniów otworzyło notatkę"
                        count={engagement.studentsOpenedNote}
                        total={cls.studentCount}
                        color="#8b5cf6"
                      />
                    ) : (
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                        <span className="text-sm">Brak notatki — brak danych o otwarciach</span>
                      </div>
                    )}
                    {status?.hasRecording && engagement ? (
                      <EngagementBar
                        label="Uczniów odsłuchało nagranie"
                        count={engagement.studentsListenedRecording}
                        total={cls.studentCount}
                        color="#f59e0b"
                      />
                    ) : (
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"><Mic className="w-4 h-4" /></div>
                        <span className="text-sm">Brak nagrania — brak danych o odsłuchaniach</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Materials ───────────────────────────────────────────────── */}
              {tab === 'materials' && (
                <div className="space-y-3">
                  {/* Note card */}
                  <div className="p-4 rounded-2xl border border-violet-100 bg-violet-50/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">Notatka</div>
                        <div className="text-xs text-gray-400">{status?.hasNote ? 'Dostępna dla uczniów' : 'Brak notatki'}</div>
                      </div>
                      {status?.hasNote && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dodana
                        </span>
                      )}
                    </div>
                    <Button
                      variant={status?.hasNote ? 'secondary' : 'primary'}
                      size="sm"
                      icon={status?.hasNote ? <Edit3 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      onClick={() => onOpenAddMaterial('note', topic.id, topic.name)}
                      className="w-full justify-center"
                    >
                      {status?.hasNote ? 'Edytuj notatkę' : 'Dodaj notatkę'}
                    </Button>
                  </div>

                  {/* Recording card */}
                  <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Mic className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">Nagranie</div>
                        <div className="text-xs text-gray-400">{status?.hasRecording ? 'Dostępne dla uczniów' : 'Brak nagrania'}</div>
                      </div>
                      {status?.hasRecording && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dodane
                        </span>
                      )}
                    </div>
                    <Button
                      variant={status?.hasRecording ? 'secondary' : 'primary'}
                      size="sm"
                      icon={status?.hasRecording ? <Edit3 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      onClick={() => onOpenAddMaterial('recording', topic.id, topic.name)}
                      className="w-full justify-center"
                    >
                      {status?.hasRecording ? 'Edytuj nagranie' : 'Dodaj nagranie'}
                    </Button>
                  </div>

                  {/* Sharing indicator */}
                  {status?.isShared && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-sky-50 border border-sky-100">
                      <Share2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                      <span className="text-sm text-sky-700">Materiały są udostępnione uczniom</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── Homework ────────────────────────────────────────────────── */}
              {tab === 'homework' && (
                <div className="space-y-4">
                  <AnimatePresence>
                    {hwAdded && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-emerald-700 font-medium">Zadanie domowe zostało dodane!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Tytuł zadania *</label>
                    <input
                      value={hwTitle}
                      onChange={e => setHwTitle(e.target.value)}
                      placeholder="np. Zadania z potęg i pierwiastków, str. 45"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Opis / instrukcja</label>
                    <textarea
                      value={hwDesc}
                      onChange={e => setHwDesc(e.target.value)}
                      placeholder="Opcjonalny opis lub instrukcja do zadania..."
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Termin oddania</label>
                    <input type="date" value={hwDueDate} onChange={e => setHwDueDate(e.target.value)} className={inputCls} />
                  </div>

                  <button
                    onClick={() => setHwIsExtra(v => !v)}
                    className="flex items-center gap-3 cursor-pointer w-full text-left"
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${hwIsExtra ? 'bg-orange-400 border-orange-400' : 'border-gray-300'}`}>
                      {hwIsExtra && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-700">Nadobowiązkowe (dodatkowe)</span>
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ClipboardList className="w-3.5 h-3.5" />}
                    onClick={submitHomework}
                    disabled={!hwTitle.trim() || hwAdded}
                    className="w-full justify-center"
                  >
                    Dodaj zadanie domowe
                  </Button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
