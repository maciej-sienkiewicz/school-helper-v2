import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, FileText, Share2, Trash2, Play, Scissors, ChevronDown,
  ChevronUp, Eye, Headphones, MessageSquare, Users,
  BookOpen, CheckCircle2, XCircle, Sparkles, ExternalLink, Clock, AlertCircle,
  School, Globe, MapPin, Building2, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Blob } from '../../components/ui/Blob';
import { mockRecordings, mockNotes, mockSharedMaterials, mockClasses, formatDuration } from '../../data/mockData';
import type { Recording, Note, SharedMaterial, ShareScope } from '../../types';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

type Tab = 'recordings' | 'shared';

const statusConfig: Record<string, { label: string; variant: 'purple' | 'green' | 'yellow' | 'blue' | 'rose' | 'gray'; color: string }> = {
  raw: { label: 'Surowe', variant: 'gray', color: '#f3f4f6' },
  transcribing: { label: 'Transkrybowanie...', variant: 'yellow', color: '#fef3c7' },
  transcribed: { label: 'Do przejrzenia', variant: 'blue', color: '#e0f2fe' },
  has_note: { label: 'Notatka gotowa', variant: 'green', color: '#d1fae5' },
  rejected: { label: 'Odrzucone', variant: 'rose', color: '#ffe4e6' },
};

const scopeOptions: { scope: ShareScope; label: string; description: string; icon: React.ReactNode }[] = [
  { scope: 'class', label: 'Wybrana klasa', description: 'Tylko uczniowie wybranej klasy', icon: <Users className="w-4 h-4" /> },
  { scope: 'grade', label: 'Wybrany rocznik', description: 'Wszystkie klasy w tym roczniku', icon: <BookOpen className="w-4 h-4" /> },
  { scope: 'school', label: 'Cała szkoła', description: 'Wszyscy uczniowie w szkole', icon: <School className="w-4 h-4" /> },
  { scope: 'county', label: 'Cały powiat', description: 'Uczniowie z całego powiatu', icon: <Building2 className="w-4 h-4" /> },
  { scope: 'voivodeship', label: 'Całe województwo', description: 'Uczniowie z całego województwa', icon: <MapPin className="w-4 h-4" /> },
  { scope: 'all', label: 'Wszyscy', description: 'Publicznie dostępne dla wszystkich', icon: <Globe className="w-4 h-4" /> },
];

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ title, onClose, onShare }: {
  title: string;
  onClose: () => void;
  onShare: (scope: ShareScope, classId?: string, grade?: number) => void;
}) {
  const [selectedScope, setSelectedScope] = useState<ShareScope>('class');
  const [selectedClassId, setSelectedClassId] = useState(mockClasses[0]?.id ?? '');
  const [selectedGrade, setSelectedGrade] = useState(6);

  const grades = [...new Set(mockClasses.map(c => c.grade))].sort((a, b) => a - b);

  const handleShare = () => {
    onShare(
      selectedScope,
      selectedScope === 'class' ? selectedClassId : undefined,
      selectedScope === 'grade' ? selectedGrade : undefined,
    );
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-4xl shadow-2xl p-8 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Udostępnij materiał</h3>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
            <XCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
            Zakres udostępnienia
          </label>
          <div className="space-y-2">
            {scopeOptions.map(({ scope, label, description, icon }) => (
              <button
                key={scope}
                onClick={() => setSelectedScope(scope)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  selectedScope === scope
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedScope === scope ? 'bg-violet-200 text-violet-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{label}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
                {selectedScope === scope && <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional sub-selectors */}
        <AnimatePresence>
          {selectedScope === 'class' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5"
            >
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Wybierz klasę
              </label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {mockClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} – {cls.subject} ({cls.studentCount} uczniów)
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {selectedScope === 'grade' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5"
            >
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Wybierz rocznik
              </label>
              <select
                value={selectedGrade}
                onChange={e => setSelectedGrade(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {grades.map(g => {
                  const classes = mockClasses.filter(c => c.grade === g);
                  return (
                    <option key={g} value={g}>
                      Klasa {g} ({classes.length} klas, {classes.reduce((s, c) => s + c.studentCount, 0)} uczniów)
                    </option>
                  );
                })}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button variant="primary" size="md" icon={<Share2 className="w-4 h-4" />} onClick={handleShare} className="flex-1">
            Udostępnij
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Trimmer ──────────────────────────────────────────────────────────────────

function TrimmerMock({ onClose }: { onClose: () => void }) {
  const [start, setStart] = useState(10);
  const [end, setEnd] = useState(85);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="bg-white rounded-4xl shadow-2xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Przytnij nagranie</h3>
        <p className="text-sm text-gray-500 mb-6">Ustaw początek i koniec nagrania, które chcesz zachować.</p>

        <div className="mb-6">
          <div className="relative h-12 bg-gradient-to-r from-violet-100 via-violet-200 to-violet-100 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center gap-0.5 px-2">
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-violet-400 rounded-full opacity-60"
                  style={{ height: `${20 + Math.random() * 60}%` }}
                />
              ))}
            </div>
            <div
              className="absolute top-0 bottom-0 bg-violet-500/20 border-l-2 border-r-2 border-violet-500"
              style={{ left: `${start}%`, right: `${100 - end}%` }}
            />
            <div className="absolute top-0 bottom-0 w-3 bg-violet-600 rounded-l cursor-ew-resize" style={{ left: `${start}%` }} />
            <div className="absolute top-0 bottom-0 w-3 bg-violet-600 rounded-r cursor-ew-resize" style={{ left: `${end}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0:00</span><span>23:00</span><span>46:00</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Początek</label>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="100" value={start}
                onChange={e => setStart(Math.min(Number(e.target.value), end - 5))}
                className="flex-1 accent-violet-600" />
              <span className="text-sm font-mono text-gray-700 w-12 text-right">
                {Math.floor(start * 0.46)}:{String(Math.floor((start * 0.46 % 1) * 60)).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Koniec</label>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="100" value={end}
                onChange={e => setEnd(Math.max(Number(e.target.value), start + 5))}
                className="flex-1 accent-violet-600" />
              <span className="text-sm font-mono text-gray-700 w-12 text-right">
                {Math.floor(end * 0.46)}:{String(Math.floor((end * 0.46 % 1) * 60)).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button variant="primary" size="md" onClick={() => { alert('Nagranie przycięte!'); onClose(); }} className="flex-1">
            <Scissors className="w-4 h-4" /> Zapisz przycięcie
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Note Modal ───────────────────────────────────────────────────────────────

function NoteModal({ note, onClose }: { note: Note; onClose: () => void }) {
  const [content, setContent] = useState(note.summary);
  const [status, setStatus] = useState<'editing' | 'accepted'>(note.status === 'accepted' ? 'accepted' : 'editing');
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <AnimatePresence>
        {showShare && (
          <ShareModal
            title={note.topicName ?? 'Notatka'}
            onClose={() => setShowShare(false)}
            onShare={(scope) => {
              const scopeLabel = scopeOptions.find(s => s.scope === scope)?.label ?? scope;
              alert(`Udostępniono notatką (${scopeLabel})`);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-4xl shadow-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{note.topicName}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Notatka AI
                {status === 'accepted' && <Badge variant="green" className="ml-2">Zaakceptowana</Badge>}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Streszczenie</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[100px]"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Kluczowe pojęcia</label>
            <div className="space-y-2">
              {note.concepts.map((c, i) => (
                <div key={i} className="flex gap-3 p-3 bg-violet-50 rounded-2xl">
                  <div className="font-semibold text-sm text-violet-700 min-w-[140px]">{c.term}</div>
                  <div className="text-sm text-gray-600">{c.definition}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {status !== 'accepted' && (
              <Button variant="success" size="md" icon={<CheckCircle2 className="w-4 h-4" />} onClick={() => setStatus('accepted')}>
                Zaakceptuj
              </Button>
            )}
            <Button variant="primary" size="md" icon={<Share2 className="w-4 h-4" />} onClick={() => setShowShare(true)}>
              Udostępnij
            </Button>
            <Button variant="secondary" size="md" onClick={onClose}>Zamknij</Button>
            <Button variant="danger" size="md" icon={<Trash2 className="w-4 h-4" />} onClick={() => { alert('Notatka usunięta'); onClose(); }}>
              Usuń
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ─── Recording Card ───────────────────────────────────────────────────────────

function RecordingCard({ rec }: { rec: Recording }) {
  const [showTrimmer, setShowTrimmer] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [generatingNote, setGeneratingNote] = useState(false);
  const [noteGenerated, setNoteGenerated] = useState(rec.status === 'has_note');

  const note = mockNotes.find(n => n.id === rec.noteId);
  const cfg = statusConfig[rec.status] ?? statusConfig['raw'];

  const handleGenerateNote = () => {
    setGeneratingNote(true);
    setTimeout(() => { setGeneratingNote(false); setNoteGenerated(true); }, 2000);
  };

  if (rec.status === 'rejected') {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 opacity-60">
        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
          <XCircle className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500">{rec.topicName ?? 'Nagranie odrzucone'}</div>
          <div className="text-xs text-gray-400">{rec.className} · {format(parseISO(rec.date), 'd MMM yyyy', { locale: pl })}</div>
        </div>
        <Badge variant="rose">Odrzucone</Badge>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showTrimmer && <TrimmerMock onClose={() => setShowTrimmer(false)} />}
        {showNote && note && <NoteModal note={note} onClose={() => setShowNote(false)} />}
        {showShare && (
          <ShareModal
            title={rec.topicName ?? 'Nagranie'}
            onClose={() => setShowShare(false)}
            onShare={(scope) => {
              const scopeLabel = scopeOptions.find(s => s.scope === scope)?.label ?? scope;
              alert(`Udostępniono nagranie (${scopeLabel})`);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-gray-100 rounded-3xl overflow-hidden hover:shadow-card transition-shadow"
      >
        <div className="flex items-center gap-4 p-5" style={{ background: rec.thumbnailColor + '40' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: rec.thumbnailColor }}>
            <Mic className="w-5 h-5 text-violet-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-800 truncate">{rec.topicName ?? 'Lekcja bez tematu'}</div>
            <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-2">
              <span className="font-medium">{rec.className}</span>
              <span>·</span>
              <span>{format(parseISO(rec.date), 'd MMMM yyyy, HH:mm', { locale: pl })}</span>
              <span>·</span>
              <Clock className="w-3 h-3" />
              <span>{formatDuration(rec.durationSeconds)}</span>
            </div>
          </div>
          <Badge variant={cfg.variant}>{cfg.label}</Badge>
        </div>

        <div className="px-5 py-3 bg-white flex flex-wrap items-center gap-2 border-t border-gray-50">
          <Button variant="ghost" size="sm" icon={<Play className="w-3.5 h-3.5" />} onClick={() => alert('Odtwarzanie...')}>
            Odtwórz
          </Button>
          <Button variant="ghost" size="sm" icon={<Scissors className="w-3.5 h-3.5" />} onClick={() => setShowTrimmer(true)}>
            Przytnij
          </Button>

          {rec.status === 'transcribed' && !noteGenerated && (
            <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />} loading={generatingNote} onClick={handleGenerateNote}>
              {generatingNote ? 'Generowanie...' : 'Wygeneruj notatkę'}
            </Button>
          )}

          {(noteGenerated || rec.status === 'has_note') && note && (
            <Button variant="secondary" size="sm" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => setShowNote(true)}>
              {note.status === 'accepted' ? 'Podejrzyj notatkę' : 'Sprawdź notatkę'}
            </Button>
          )}

          {(noteGenerated || rec.status === 'has_note') && (
            <Button variant="ghost" size="sm" icon={<Share2 className="w-3.5 h-3.5" />} onClick={() => setShowShare(true)}>
              Udostępnij
            </Button>
          )}

          <div className="flex-1" />

          {(rec.isSharedNote || rec.isSharedAudio) && (
            <div className="flex items-center gap-1.5">
              {rec.isSharedNote && (
                <div className="flex items-center gap-1 text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-xl">
                  <FileText className="w-3 h-3" /> Notatka udostępniona
                </div>
              )}
              {rec.isSharedAudio && (
                <div className="flex items-center gap-1 text-xs text-sky-600 bg-sky-50 px-2 py-1 rounded-xl">
                  <Headphones className="w-3 h-3" /> Audio udostępnione
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />}
            className="text-rose-400 hover:text-rose-600 hover:bg-rose-50"
            onClick={() => alert('Nagranie zostanie odrzucone')}
          >
            Odrzuć
          </Button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Shared Material Row (detail, used inside table) ─────────────────────────

function SharedMaterialDetail({ mat }: { mat: SharedMaterial }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-50 last:border-0">
      {/* Table row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full grid grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-violet-50/50 transition-colors cursor-pointer text-left text-sm"
      >
        <div className="min-w-0">
          <div className="font-medium text-gray-800 truncate">{mat.topicName}</div>
          <div className="text-xs text-gray-500 truncate">{mat.unitName}</div>
        </div>
        <Badge variant={mat.type === 'both' ? 'purple' : 'green'} className="flex-shrink-0">
          {mat.type === 'note' ? 'Notatka' : mat.type === 'audio' ? 'Audio' : 'Nota + Audio'}
        </Badge>
        <span className="text-xs text-gray-500 flex-shrink-0">{format(parseISO(mat.sharedAt), 'd MMM yy', { locale: pl })}</span>
        <span className="text-xs text-gray-600 flex items-center gap-1 flex-shrink-0">
          <Eye className="w-3 h-3 text-violet-400" />{mat.stats.totalViews}
        </span>
        <span className="text-xs text-gray-600 flex items-center gap-1 flex-shrink-0">
          <MessageSquare className="w-3 h-3 text-emerald-400" />{mat.stats.commentCount}
        </span>
        <div className="flex-shrink-0">
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 bg-gray-50/50">
              {/* Stats cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {[
                  { icon: <Eye className="w-4 h-4 text-violet-500" />, value: mat.stats.totalViews, label: 'Wyświetleń', bg: '#ede9fe' },
                  { icon: <Headphones className="w-4 h-4 text-sky-500" />, value: mat.stats.totalListens, label: 'Odsłuchań', bg: '#e0f2fe' },
                  { icon: <MessageSquare className="w-4 h-4 text-emerald-500" />, value: mat.stats.commentCount, label: 'Komentarzy', bg: '#d1fae5' },
                  { icon: <ExternalLink className="w-4 h-4 text-amber-500" />, value: mat.stats.externalViews, label: 'Spoza szkoły', bg: '#fef3c7' },
                ].map(({ icon, value, label, bg }) => (
                  <div key={label} className="p-3 rounded-2xl text-center" style={{ background: bg }}>
                    <div className="flex justify-center mb-1">{icon}</div>
                    <div className="text-xl font-bold text-gray-800">{value}</div>
                    <div className="text-xs text-gray-600">{label}</div>
                  </div>
                ))}
              </div>

              {/* Per-class stats */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Statystyki klas</div>
                <div className="space-y-2">
                  {mat.stats.classStats.map(cs => {
                    const pct = Math.round((cs.studentsOpened / cs.totalStudents) * 100);
                    const notOpened = cs.totalStudents - cs.studentsOpened;
                    return (
                      <div key={cs.classId} className="p-3 bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-gray-800">{cs.className}</span>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="w-3 h-3" /> {cs.studentsOpened} otworzyło
                            </span>
                            {notOpened > 0 && (
                              <span className="flex items-center gap-1 text-rose-500">
                                <AlertCircle className="w-3 h-3" /> {notOpened} nie otworzyło
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0</span>
                          <span>{pct}% uczniów</span>
                          <span>{cs.totalStudents}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comments */}
              {mat.stats.comments.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Komentarze ({mat.stats.commentCount})
                  </div>
                  <div className="space-y-2">
                    {mat.stats.comments.map(c => (
                      <div key={c.id} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-2xl">
                        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700 flex-shrink-0">
                          {c.studentName[0]}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-700">
                            {c.studentName} <span className="font-normal text-gray-400">({c.className})</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-0.5">{c.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1 border-t border-gray-100">
                <Button variant="secondary" size="sm" icon={<Share2 className="w-3.5 h-3.5" />} onClick={() => alert('Zmień status udostępnienia')}>
                  Zmień dostęp
                </Button>
                <Button variant="ghost" size="sm" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => alert('Przejdź do edycji notatki')}>
                  Edytuj notatkę
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Grade Section (collapsible) ──────────────────────────────────────────────

function GradeSection({ grade, materials }: { grade: number; materials: SharedMaterial[] }) {
  const [open, setOpen] = useState(true);

  const label = grade <= 8
    ? `Klasa ${grade} (Szkoła podstawowa)`
    : `Klasa ${grade - 8} (Liceum)`;

  return (
    <div className="border border-gray-100 rounded-3xl overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 hover:bg-violet-50/50 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-violet-600" />
        </div>
        <h3 className="flex-1 font-bold text-gray-800 text-left">{label}</h3>
        <Badge variant="purple">{materials.length} materiałów</Badge>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span>Temat / Dział</span>
              <span>Typ</span>
              <span>Data</span>
              <span>Wyświetl.</span>
              <span>Koment.</span>
              <span />
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {materials.map(mat => (
                <SharedMaterialDetail key={mat.id} mat={mat} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Recordings() {
  const [activeTab, setActiveTab] = useState<Tab>('recordings');

  const byGrade = mockSharedMaterials.reduce<Record<number, SharedMaterial[]>>((acc, m) => {
    (acc[m.grade] = acc[m.grade] ?? []).push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <Blob color="#ddd6fe" size="xl" className="-top-20 -right-20" />
      <Blob color="#bae6fd" size="lg" className="bottom-10 left-10" delay animated />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Nagrania & Materiały</h1>
          <p className="text-gray-500 mt-1">Zarządzaj nagraniami lekcji i udostępnionymi materiałami</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white rounded-2xl shadow-card w-fit">
          {([
            { id: 'recordings', label: 'Nagrania', icon: Mic },
            { id: 'shared', label: 'Udostępnione', icon: Share2 },
          ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'recordings' && (
            <motion.div
              key="recordings"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {mockRecordings.map(rec => (
                <RecordingCard key={rec.id} rec={rec} />
              ))}
            </motion.div>
          )}

          {activeTab === 'shared' && (
            <motion.div
              key="shared"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {Object.entries(byGrade)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([grade, mats]) => (
                  <GradeSection key={grade} grade={Number(grade)} materials={mats} />
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
