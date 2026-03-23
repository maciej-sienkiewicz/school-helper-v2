import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FlaskConical, Upload, Calendar, CheckCircle2, FileQuestion, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { mockGeneratedTests } from '../../../data/mockData';
import type { GeneratedTest } from '../../../types';

export interface ScheduledExam {
  id: string;
  classId: string;
  date: string;
  testTitle: string;
  source: 'generator' | 'file';
  generatedTestId?: string;
  /** topic IDs covered (from GeneratedTest.config.topicIds or empty for file-based) */
  topicIds: string[];
}

type Tab = 'generator' | 'file';

interface Props {
  classId: string;
  className: string;
  onAdd: (exam: ScheduledExam) => void;
  onClose: () => void;
  /** If editing an existing exam */
  initial?: ScheduledExam;
}

export function ScheduleTestModal({ classId, className, onAdd, onClose, initial }: Props) {
  const navigate = useNavigate();
  const [tab, setTab]           = useState<Tab>(initial?.source ?? 'generator');
  const [selectedTest, setSelectedTest] = useState<GeneratedTest | null>(
    initial?.generatedTestId
      ? mockGeneratedTests.find(t => t.id === initial.generatedTestId) ?? null
      : null,
  );
  const [date, setDate]         = useState(initial?.date ?? '');
  const [file, setFile]         = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState(initial?.source === 'file' ? initial.testTitle : '');
  const [dragOver, setDragOver] = useState(false);

  const isEdit = !!initial;

  const canConfirm =
    date.trim() !== '' &&
    (tab === 'generator' ? selectedTest !== null : file !== null || (isEdit && initial?.source === 'file'));

  const handleConfirm = () => {
    if (!canConfirm) return;
    const exam: ScheduledExam = {
      id: initial?.id ?? `exam-${Date.now()}`,
      classId,
      date,
      source: tab,
      testTitle:
        tab === 'generator'
          ? (selectedTest!.title)
          : (file?.name ?? fileTitle),
      generatedTestId: tab === 'generator' ? selectedTest!.id : undefined,
      topicIds: tab === 'generator' ? (selectedTest!.config.topicIds ?? []) : [],
    };
    onAdd(exam);
    onClose();
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-sky-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">
              {isEdit ? 'Edytuj egzamin' : 'Zaplanuj egzamin'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-4 pl-10">
          Klasa: <span className="font-medium text-gray-600">{className}</span>
        </p>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-4">
          {([
            { id: 'generator' as Tab, label: 'Z Generatora Testów', icon: FlaskConical },
            { id: 'file'      as Tab, label: 'Z pliku',             icon: Upload },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${tab === id ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {/* ── Generator tests ─────────────────────────────────────── */}
              {tab === 'generator' && (
                <div className="space-y-2">
                  {mockGeneratedTests.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <FileQuestion className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-400">Brak wygenerowanych testów.</p>
                      <p className="text-xs text-gray-300 mt-1 mb-4">
                        Utwórz test w Generatorze Testów, a pojawi się tutaj.
                      </p>
                      <button
                        onClick={() => { onClose(); navigate('/teacher/tests'); }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Przejdź do Generatora Testów <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => { onClose(); navigate('/teacher/tests'); }}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-sky-500 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <FlaskConical className="w-3.5 h-3.5" /> Utwórz nowy test w Generatorze <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      {mockGeneratedTests.map(test => {
                        const isSelected = selectedTest?.id === test.id;
                        const totalPoints = test.questions.reduce((s, q) => s + q.points, 0);
                        return (
                          <button
                            key={test.id}
                            onClick={() => setSelectedTest(isSelected ? null : test)}
                            className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-sky-400 bg-sky-50' : 'border-gray-100 hover:border-sky-200 hover:bg-sky-50/40'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'bg-sky-200' : 'bg-gray-100'}`}>
                                <FlaskConical className={`w-4 h-4 ${isSelected ? 'text-sky-700' : 'text-gray-400'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-800 leading-tight">{test.title}</div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-xs text-gray-400">
                                    {test.questions.length} pytań · {totalPoints} pkt
                                  </span>
                                  <span className="text-gray-200">·</span>
                                  <span className="text-xs text-gray-400">
                                    {new Date(test.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                                {test.config.topicIds?.length > 0 && (
                                  <div className="text-xs text-sky-500 mt-1">
                                    {test.config.topicIds.length} {test.config.topicIds.length === 1 ? 'temat' : 'tematy'}
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}

              {/* ── File ────────────────────────────────────────────────── */}
              {tab === 'file' && (
                <div className="space-y-3">
                  <label
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${dragOver ? 'border-sky-400 bg-sky-50' : file ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50/30'}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => {
                      e.preventDefault(); setDragOver(false);
                      const f = e.dataTransfer.files[0];
                      if (f) { setFile(f); setFileTitle(f.name.replace(/\.[^.]+$/, '')); }
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0] ?? null;
                        if (f) { setFile(f); setFileTitle(f.name.replace(/\.[^.]+$/, '')); }
                      }}
                    />
                    {file ? (
                      <>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-emerald-700">{file.name}</p>
                          <p className="text-xs text-emerald-500 mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <span className="text-xs text-gray-400">Kliknij, by wybrać inny plik</span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Przeciągnij plik lub kliknij</p>
                          <p className="text-xs text-gray-400 mt-0.5">PDF, DOCX, TXT</p>
                        </div>
                      </>
                    )}
                  </label>

                  {(file || (isEdit && initial?.source === 'file')) && (
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block font-medium">Nazwa egzaminu</label>
                      <input
                        value={fileTitle}
                        onChange={e => setFileTitle(e.target.value)}
                        placeholder="np. Sprawdzian z algebry"
                        className={inputCls}
                      />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Date picker — always visible */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Data egzaminu *
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!canConfirm}
            onClick={handleConfirm}
            icon={<Clock className="w-3.5 h-3.5" />}
            className="flex-1"
          >
            {isEdit ? 'Zapisz zmiany' : 'Zaplanuj egzamin'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
