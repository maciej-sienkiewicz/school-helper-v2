import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Mic, CheckCircle2, Upload, School, X, Users } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { mockNotes, mockRecordings, formatDuration } from '../../../data/mockData';
import { mockClasses } from '../../../data/mockData';

export function AddMaterialModal({
  type,
  topicId,
  topicName,
  currentClassId,
  onClose,
  onConfirm,
}: {
  type: 'note' | 'recording';
  topicId: string;
  topicName: string;
  currentClassId: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [tab, setTab] = useState<'existing' | 'file'>('existing');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const existingNotes = mockNotes.filter(n => n.topicId === topicId && n.status !== 'deleted');
  const existingRecordings = mockRecordings.filter(r => r.topicId === topicId && r.classId !== currentClassId);
  const items = type === 'note' ? existingNotes : existingRecordings;
  const canConfirm = tab === 'existing' ? selectedId !== null : selectedFile !== null;

  const handleFileChange = (file: File | null) => { setSelectedFile(file); setSelectedId(null); };
  const acceptAttr = type === 'note' ? '.txt,.pdf,.docx,.md' : 'audio/*,.mp3,.wav,.m4a,.aac,.ogg';

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
        className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {type === 'note'
              ? <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center"><FileText className="w-4 h-4 text-violet-600" /></div>
              : <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><Mic className="w-4 h-4 text-amber-600" /></div>
            }
            <h2 className="text-base font-bold text-gray-800">
              {type === 'note' ? 'Dodaj notatkę' : 'Dodaj nagranie'}
            </h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-4 pl-10">
          Temat: <span className="font-medium text-gray-600">{topicName}</span>
        </p>

        <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-2xl">
          {(['existing', 'file'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); t === 'existing' ? setSelectedFile(null) : setSelectedId(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'existing' ? <><School className="w-3.5 h-3.5" /> Z innych klas</> : <><Upload className="w-3.5 h-3.5" /> Z pliku</>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {tab === 'existing' && (
            <div>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    {type === 'note' ? <FileText className="w-6 h-6 text-gray-300" /> : <Mic className="w-6 h-6 text-gray-300" />}
                  </div>
                  <p className="text-sm text-gray-400">Brak dostępnych {type === 'note' ? 'notatek' : 'nagrań'} dla tego tematu z innych klas.</p>
                  <p className="text-xs text-gray-300 mt-1">Możesz dodać {type === 'note' ? 'notatkę' : 'nagranie'} z pliku.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {type === 'note' && existingNotes.map(note => {
                    const classNames = note.sharedWithClasses.map(cid => mockClasses.find(c => c.id === cid)?.name ?? cid).join(', ');
                    return (
                      <button key={note.id} onClick={() => setSelectedId(note.id)}
                        className={`w-full text-left p-3 rounded-2xl border-2 transition-all cursor-pointer ${selectedId === note.id ? 'border-violet-400 bg-violet-50' : 'border-gray-100 hover:border-violet-200 hover:bg-violet-50/40'}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5"><FileText className="w-3 h-3 text-violet-500" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{note.topicName}</div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{note.content.slice(0, 80)}…</p>
                            {classNames && <div className="flex items-center gap-1 mt-1.5"><Users className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-400">{classNames}</span></div>}
                          </div>
                          {selectedId === note.id && <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />}
                        </div>
                      </button>
                    );
                  })}
                  {type === 'recording' && existingRecordings.map(rec => (
                    <button key={rec.id} onClick={() => setSelectedId(rec.id)}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all cursor-pointer ${selectedId === rec.id ? 'border-amber-400 bg-amber-50' : 'border-gray-100 hover:border-amber-200 hover:bg-amber-50/40'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: rec.thumbnailColor ?? '#fde68a' }}>
                          <Mic className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800">{rec.className} · {rec.subject}</div>
                          <div className="text-xs text-gray-500">{new Date(rec.date).toLocaleDateString('pl-PL')} · {formatDuration(rec.durationSeconds)}</div>
                        </div>
                        {selectedId === rec.id && <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'file' && (
            <label
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${dragOver ? 'border-violet-400 bg-violet-50' : selectedFile ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/30'}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileChange(f); }}
            >
              <input type="file" accept={acceptAttr} className="hidden" onChange={e => handleFileChange(e.target.files?.[0] ?? null)} />
              {selectedFile ? (
                <>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-emerald-700">{selectedFile.name}</p>
                    <p className="text-xs text-emerald-500 mt-0.5">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <span className="text-xs text-gray-400">Kliknij, by wybrać inny plik</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center"><Upload className="w-5 h-5 text-gray-400" /></div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">Przeciągnij plik lub kliknij</p>
                    <p className="text-xs text-gray-400 mt-0.5">{type === 'note' ? 'PDF, DOCX, TXT, MD' : 'MP3, WAV, M4A, AAC, OGG'}</p>
                  </div>
                </>
              )}
            </label>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button variant="primary" size="sm" disabled={!canConfirm} onClick={onConfirm} className="flex-1">
            {tab === 'existing' ? 'Wybierz' : 'Dodaj plik'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
