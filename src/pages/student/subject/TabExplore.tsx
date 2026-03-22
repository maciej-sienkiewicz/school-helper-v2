import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, FileText, Play, Search, Bookmark,
  MessageCircle, Send, X, User, MapPin,
} from 'lucide-react';
import { mockExternalMaterials } from '../../../data/mockData';
import type { ExternalMaterial, ExploreComment } from '../../../types';
import { NoteModal, MockPlayer } from './shared';

// ─── Types ─────────────────────────────────────────────────────────────────────

type ScopeFilter = 'any' | ExternalMaterial['scope'];
type SortMode    = 'recommended' | 'viewed' | 'newest';

const SCOPE_TABS: { value: ScopeFilter; label: string }[] = [
  { value: 'any',         label: 'Wszystkie'   },
  { value: 'school',      label: 'Moje miasto' },
  { value: 'county',      label: 'Powiat'      },
  { value: 'voivodeship', label: 'Województwo' },
  { value: 'all',         label: 'Cała Polska' },
];

const SORT_TABS: { value: SortMode; label: string }[] = [
  { value: 'recommended', label: 'Polecane'    },
  { value: 'viewed',      label: 'Popularne'   },
  { value: 'newest',      label: 'Najnowsze'   },
];

// ─── Comments panel ────────────────────────────────────────────────────────────

function CommentsPanel({ materialId, initial }: { materialId: string; initial: ExploreComment[] }) {
  const [comments, setComments] = useState<ExploreComment[]>(initial);
  const [draft, setDraft] = useState('');

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setComments(prev => [...prev, { id: `l-${Date.now()}`, text, timestamp: new Date().toISOString() }]);
    setDraft('');
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      <div className="pt-3 mt-3 border-t border-gray-100 space-y-3">
        {comments.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-1">Nikt jeszcze nie skomentował — bądź pierwszy!</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-3 h-3 text-gray-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400">Anonimowy</span>
              <p className="text-sm text-gray-700 mt-0.5 leading-snug">{c.text}</p>
            </div>
          </div>
        ))}

        <div className="flex gap-2 pt-0.5">
          <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-2">
            <User className="w-3 h-3 text-violet-400" />
          </div>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Napisz anonimowo…"
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-shadow"
          />
          <button
            onClick={submit}
            disabled={!draft.trim()}
            className="w-9 h-9 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-25 text-white flex items-center justify-center cursor-pointer self-center flex-shrink-0 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────

interface CardProps {
  mat: ExternalMaterial;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}

function MaterialCard({ mat, liked, saved, onLike, onSave }: CardProps) {
  const [noteOpen,     setNoteOpen]     = useState(false);
  const [playerOpen,   setPlayerOpen]   = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const likeCount    = mat.likes + (liked ? 1 : 0);
  const commentCount = mat.comments?.length ?? 0;

  return (
    <>
      <AnimatePresence>
        {noteOpen && mat.noteContent && (
          <NoteModal content={mat.noteContent} topicName={mat.topicName} onClose={() => setNoteOpen(false)} />
        )}
      </AnimatePresence>

      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        style={{ borderLeftColor: mat.thumbnailColor, borderLeftWidth: 4 }}
      >
        <div className="p-4">

          {/* ── Top row: info + bookmark ──────────────────────────────────────── */}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex-shrink-0"
              style={{ backgroundColor: mat.thumbnailColor + '55' }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm leading-snug">{mat.topicName}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{mat.unitName}</p>
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {mat.schoolName}, {mat.city} · {mat.teacherName}
              </p>
            </div>
            <button
              onClick={onSave}
              title={saved ? 'Usuń z ulubionych' : 'Zapisz do ulubionych'}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0 -mr-1 -mt-0.5"
            >
              <Bookmark className={`w-4 h-4 transition-colors ${saved ? 'text-violet-500 fill-violet-500' : 'text-gray-300'}`} />
            </button>
          </div>

          {/* ── Action row ────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 mt-3">
            {/* Content buttons */}
            {mat.noteContent && (
              <button
                onClick={() => setNoteOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 text-xs font-medium transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Notatka
              </button>
            )}
            {mat.recordingDurationSeconds && (
              <button
                onClick={() => setPlayerOpen(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  playerOpen ? 'bg-violet-100 text-violet-700' : 'bg-violet-50 hover:bg-violet-100 text-violet-600'
                }`}
              >
                <Play className="w-3.5 h-3.5" /> Nagranie
              </button>
            )}

            <div className="flex-1" />

            {/* Social buttons */}
            <button
              onClick={() => setCommentsOpen(o => !o)}
              className={`flex items-center gap-1 text-xs transition-colors cursor-pointer px-2 py-1.5 rounded-xl ${
                commentsOpen ? 'text-violet-600 bg-violet-50' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              {commentCount > 0 && <span className="font-medium">{commentCount}</span>}
            </button>

            <button
              onClick={onLike}
              className={`flex items-center gap-1 text-xs font-medium transition-all cursor-pointer px-2 py-1.5 rounded-xl ${
                liked ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform ${liked ? 'fill-rose-500 scale-110' : ''}`} />
              <span>{likeCount}</span>
            </button>
          </div>

          {/* ── Recording player ──────────────────────────────────────────────── */}
          <AnimatePresence>
            {playerOpen && mat.recordingDurationSeconds && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <MockPlayer durationSeconds={mat.recordingDurationSeconds} color={mat.thumbnailColor} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Comments ──────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {commentsOpen && (
              <CommentsPanel materialId={mat.id} initial={mat.comments ?? []} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ─── Tab ───────────────────────────────────────────────────────────────────────

export function TabExplore({ subject }: { subject: string }) {
  const all = mockExternalMaterials.filter(m => m.subject === subject);

  const [scope,  setScope]  = useState<ScopeFilter>('any');
  const [sort,   setSort]   = useState<SortMode>('recommended');
  const [query,  setQuery]  = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => setLikedIds(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSave = (id: string) => setSavedIds(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const results = useMemo(() => {
    let list = scope === 'any' ? all : all.filter(m => m.scope === scope);

    const q = query.trim().toLowerCase();
    if (q) list = list.filter(m =>
      m.topicName.toLowerCase().includes(q)    ||
      m.unitName.toLowerCase().includes(q)     ||
      m.schoolName.toLowerCase().includes(q)   ||
      m.city.toLowerCase().includes(q)         ||
      m.teacherName.toLowerCase().includes(q)
    );

    if (sort === 'recommended') return [...list].sort((a, b) => b.likes - a.likes);
    if (sort === 'viewed')      return [...list].sort((a, b) => b.views - a.views);
    return [...list].sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));
  }, [all, scope, query, sort]);

  return (
    <div className="space-y-3">

      {/* ── Search ─────────────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Zagadnienie, szkoła, nauczyciel…"
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-shadow"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        )}
      </div>

      {/* ── Scope tabs ─────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto -mx-1 px-1 pb-0.5">
        <div className="flex gap-1 min-w-max">
          {SCOPE_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setScope(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                scope === t.value
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sort + count ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {results.length} {results.length === 1 ? 'materiał' : results.length < 5 ? 'materiały' : 'materiałów'}
        </span>
        <div className="flex gap-1">
          {SORT_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setSort(t.value)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                sort === t.value
                  ? 'font-semibold text-gray-800 bg-gray-100'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {results.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 text-center"
          >
            <p className="text-gray-400 text-sm">
              {query ? `Brak wyników dla „${query}".` : 'Brak materiałów w tym zakresie.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${scope}-${query}-${sort}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-2.5"
          >
            {results.map(m => (
              <MaterialCard
                key={m.id}
                mat={m}
                liked={likedIds.has(m.id)}
                saved={savedIds.has(m.id)}
                onLike={() => toggleLike(m.id)}
                onSave={() => toggleSave(m.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
