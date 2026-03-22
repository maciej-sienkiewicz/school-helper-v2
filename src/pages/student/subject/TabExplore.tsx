import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, School, MapPin, ThumbsUp, FileText, Play, Search, Star,
  MessageCircle, Send, ChevronDown, ChevronUp, Eye, TrendingUp,
  Clock, X, BookOpen, User,
} from 'lucide-react';
import { mockExternalMaterials } from '../../../data/mockData';
import type { ExternalMaterial, ExploreComment } from '../../../types';
import { NoteModal, MockPlayer } from './shared';

// ─── Constants ─────────────────────────────────────────────────────────────────

const SCOPE_LABEL: Record<ExternalMaterial['scope'], string> = {
  school:      'Inna szkoła w mieście',
  county:      'Inny powiat',
  voivodeship: 'Inne województwo',
  all:         'Cała Polska',
};

const SCOPE_ICON: Record<ExternalMaterial['scope'], typeof Globe> = {
  school: School, county: MapPin, voivodeship: Globe, all: Globe,
};

// scope order for filtering tabs
const SCOPE_TABS = [
  { value: 'all' as const,         label: 'Cała Polska',           icon: Globe  },
  { value: 'voivodeship' as const, label: 'Inne województwo',      icon: Globe  },
  { value: 'county' as const,      label: 'Inny powiat',           icon: MapPin },
  { value: 'school' as const,      label: 'Moje miasto',           icon: School },
] as const;

type ScopeFilter = typeof SCOPE_TABS[number]['value'] | 'favorites';
type SearchMode  = 'topic' | 'school' | 'teacher';
type SortMode    = 'recommended' | 'viewed' | 'newest';

// ─── Anonymous comments panel ─────────────────────────────────────────────────

function CommentsPanel({
  materialId,
  initial,
}: {
  materialId: string;
  initial: ExploreComment[];
}) {
  const [comments, setComments] = useState<ExploreComment[]>(initial);
  const [draft, setDraft] = useState('');

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setComments(prev => [
      ...prev,
      { id: `local-${Date.now()}`, text, timestamp: new Date().toISOString() },
    ]);
    setDraft('');
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      key={`comments-${materialId}`}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="pt-3 border-t border-gray-100 mt-3 space-y-3">
        {comments.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">
            Brak komentarzy. Bądź pierwszy!
          </p>
        )}
        {comments.map(c => (
          <div key={c.id} className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-3 h-3 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-gray-500">Anonimowy</span>
                <span className="text-[10px] text-gray-400">{fmtDate(c.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-700 mt-0.5">{c.text}</p>
            </div>
          </div>
        ))}

        {/* Comment input */}
        <div className="flex gap-2 pt-1">
          <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
            <User className="w-3 h-3 text-violet-400" />
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Dodaj anonimowy komentarz..."
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              className="w-9 h-9 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer flex-shrink-0 self-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Material card ────────────────────────────────────────────────────────────

interface CardProps {
  mat: ExternalMaterial;
  liked: boolean;
  onLike: () => void;
  isFavSchool: boolean;
  isFavTeacher: boolean;
  onToggleFavSchool: () => void;
  onToggleFavTeacher: () => void;
}

function ExternalCard({
  mat, liked, onLike,
  isFavSchool, isFavTeacher,
  onToggleFavSchool, onToggleFavTeacher,
}: CardProps) {
  const [noteOpen,     setNoteOpen]     = useState(false);
  const [playerOpen,   setPlayerOpen]   = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const ScopeIcon = SCOPE_ICON[mat.scope];
  const likeCount = mat.likes + (liked ? 1 : 0);
  const commentCount = (mat.comments?.length ?? 0);

  return (
    <>
      <AnimatePresence>
        {noteOpen && mat.noteContent && (
          <NoteModal content={mat.noteContent} topicName={mat.topicName} onClose={() => setNoteOpen(false)} />
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
        {/* Coloured top accent strip */}
        <div className="h-1 w-full" style={{ backgroundColor: mat.thumbnailColor }} />

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: mat.thumbnailColor }}
            >
              <BookOpen className="w-5 h-5 text-white drop-shadow" style={{ color: 'rgba(0,0,0,0.45)' }} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Scope + school badges */}
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                  <ScopeIcon className="w-3 h-3" /> {SCOPE_LABEL[mat.scope]}
                </span>
              </div>

              {/* Title */}
              <p className="font-bold text-gray-800 text-sm leading-snug">{mat.topicName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{mat.unitName}</p>
            </div>
          </div>

          {/* School + teacher info */}
          <div className="mt-2.5 flex items-center gap-3 flex-wrap">
            {/* School */}
            <button
              onClick={onToggleFavSchool}
              title={isFavSchool ? 'Usuń szkołę z ulubionych' : 'Dodaj szkołę do ulubionych'}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-amber-600 transition-colors cursor-pointer group"
            >
              <School className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="group-hover:underline">{mat.schoolName}, {mat.city}</span>
              <Star
                className={`w-3 h-3 flex-shrink-0 transition-colors ${isFavSchool ? 'text-amber-400 fill-amber-400' : 'text-gray-300 group-hover:text-amber-300'}`}
              />
            </button>

            <span className="text-gray-200">|</span>

            {/* Teacher */}
            <button
              onClick={onToggleFavTeacher}
              title={isFavTeacher ? 'Usuń nauczyciela z ulubionych' : 'Dodaj nauczyciela do ulubionych'}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-amber-600 transition-colors cursor-pointer group"
            >
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="group-hover:underline">{mat.teacherName}</span>
              <Star
                className={`w-3 h-3 flex-shrink-0 transition-colors ${isFavTeacher ? 'text-amber-400 fill-amber-400' : 'text-gray-300 group-hover:text-amber-300'}`}
              />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {mat.views.toLocaleString('pl-PL')}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(mat.sharedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* Note */}
            {mat.noteContent && (
              <button
                onClick={() => setNoteOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 text-xs font-semibold transition-colors cursor-pointer min-h-[36px]"
              >
                <FileText className="w-3.5 h-3.5" /> Notatka
              </button>
            )}

            {/* Recording */}
            {mat.recordingDurationSeconds && (
              <button
                onClick={() => setPlayerOpen(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[36px] ${
                  playerOpen
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-violet-50 hover:bg-violet-100 text-violet-600'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Nagranie
                {playerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Like */}
            <button
              onClick={onLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                liked
                  ? 'bg-rose-100 text-rose-600 scale-105'
                  : 'bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-500'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500' : ''}`} />
              {likeCount}
            </button>

            {/* Comments toggle */}
            <button
              onClick={() => setCommentsOpen(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[36px] ${
                commentsOpen
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-gray-100 hover:bg-violet-50 text-gray-500 hover:text-violet-500'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {commentCount}
            </button>
          </div>

          {/* Player */}
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

          {/* Comments */}
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

// ─── Tab component ─────────────────────────────────────────────────────────────

export function TabExplore({ subject }: { subject: string }) {
  const allMaterials = mockExternalMaterials.filter(m => m.subject === subject);

  // ── Filters & search state ──────────────────────────────────────────────────
  const [scopeFilter,  setScopeFilter]  = useState<ScopeFilter>('all');
  const [searchMode,   setSearchMode]   = useState<SearchMode>('topic');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [sortMode,     setSortMode]     = useState<SortMode>('recommended');

  // ── Interaction state ───────────────────────────────────────────────────────
  const [likedIds,        setLikedIds]        = useState<Set<string>>(new Set());
  const [favSchools,      setFavSchools]      = useState<Set<string>>(new Set());
  const [favTeachers,     setFavTeachers]     = useState<Set<string>>(new Set());

  const toggleLike    = (id: string) => setLikedIds(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFavSchool   = (name: string) => setFavSchools(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const toggleFavTeacher  = (name: string) => setFavTeachers(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });

  // ── Derived list ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = allMaterials;

    // Scope / favorites filter
    if (scopeFilter === 'favorites') {
      list = list.filter(m => favSchools.has(m.schoolName) || favTeachers.has(m.teacherName));
    } else {
      list = list.filter(m => m.scope === scopeFilter);
    }

    // Search
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      if (searchMode === 'topic')   list = list.filter(m => m.topicName.toLowerCase().includes(q) || m.unitName.toLowerCase().includes(q));
      if (searchMode === 'school')  list = list.filter(m => m.schoolName.toLowerCase().includes(q) || m.city.toLowerCase().includes(q));
      if (searchMode === 'teacher') list = list.filter(m => m.teacherName.toLowerCase().includes(q));
    }

    // Sort
    if (sortMode === 'recommended') list = [...list].sort((a, b) => b.likes - a.likes);
    if (sortMode === 'viewed')      list = [...list].sort((a, b) => b.views - a.views);
    if (sortMode === 'newest')      list = [...list].sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));

    return list;
  }, [allMaterials, scopeFilter, searchMode, searchQuery, sortMode, favSchools, favTeachers]);

  const favCount = allMaterials.filter(m => favSchools.has(m.schoolName) || favTeachers.has(m.teacherName)).length;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Scope selector ───────────────────────────────────────────────────── */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-1.5 min-w-max">
          {SCOPE_TABS.map(({ value, label, icon: Icon }) => {
            const active = scopeFilter === value;
            const count = allMaterials.filter(m => m.scope === value).length;
            return (
              <button
                key={value}
                onClick={() => setScopeFilter(value)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[40px] ${
                  active
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {count > 0 && (
                  <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                    active ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Favorites tab */}
          <button
            onClick={() => setScopeFilter('favorites')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[40px] ${
              scopeFilter === 'favorites'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${scopeFilter === 'favorites' ? 'fill-white' : ''}`} />
            Ulubione
            {favCount > 0 && (
              <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                scopeFilter === 'favorites' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-600'
              }`}>
                {favCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Search ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 space-y-2.5">
        {/* Search mode tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {([
            { value: 'topic'   as const, label: 'Zagadnienie', icon: BookOpen },
            { value: 'school'  as const, label: 'Szkoła / Miasto', icon: School },
            { value: 'teacher' as const, label: 'Nauczyciel', icon: User },
          ]).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { setSearchMode(value); setSearchQuery(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                searchMode === value
                  ? 'bg-white text-violet-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            key={searchMode}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              searchMode === 'topic'   ? 'Szukaj zagadnienia lub działu…' :
              searchMode === 'school'  ? 'Szukaj szkoły lub miasta…' :
                                        'Szukaj nauczyciela…'
            }
            className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* ── Sort options ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sortuj:</span>
        <div className="flex gap-1.5 overflow-x-auto">
          {([
            { value: 'recommended' as const, label: 'Polecane',    icon: TrendingUp },
            { value: 'viewed'      as const, label: 'Przeglądane', icon: Eye        },
            { value: 'newest'      as const, label: 'Najnowsze',   icon: Clock      },
          ]).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSortMode(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                sortMode === value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Favorites hint ───────────────────────────────────────────────────── */}
      {(favSchools.size > 0 || favTeachers.size > 0) && scopeFilter !== 'favorites' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-700 flex-1">
            Masz <strong>{favSchools.size + favTeachers.size}</strong> ulubionych.{' '}
            <button
              onClick={() => setScopeFilter('favorites')}
              className="underline cursor-pointer font-semibold hover:text-amber-900"
            >
              Pokaż ulubione
            </button>
          </p>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-50 rounded-3xl p-10 text-center"
          >
            {scopeFilter === 'favorites' ? (
              <>
                <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm font-medium">Brak ulubionych materiałów.</p>
                <p className="text-gray-400 text-xs mt-1">Kliknij ★ przy szkole lub nauczycielu, aby dodać do ulubionych.</p>
              </>
            ) : searchQuery ? (
              <>
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm font-medium">Brak wyników dla „{searchQuery}".</p>
                <p className="text-gray-400 text-xs mt-1">Spróbuj innej frazy lub zmień tryb wyszukiwania.</p>
              </>
            ) : (
              <>
                <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Brak materiałów z tego zakresu dla tego przedmiotu.</p>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`${scopeFilter}-${searchQuery}-${sortMode}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            <p className="text-xs text-gray-400 font-medium">
              {filtered.length} {filtered.length === 1 ? 'materiał' : filtered.length < 5 ? 'materiały' : 'materiałów'}
            </p>
            {filtered.map(m => (
              <ExternalCard
                key={m.id}
                mat={m}
                liked={likedIds.has(m.id)}
                onLike={() => toggleLike(m.id)}
                isFavSchool={favSchools.has(m.schoolName)}
                isFavTeacher={favTeachers.has(m.teacherName)}
                onToggleFavSchool={() => toggleFavSchool(m.schoolName)}
                onToggleFavTeacher={() => toggleFavTeacher(m.teacherName)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
