import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, School, MapPin, ThumbsUp, FileText, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { mockExternalMaterials } from '../../../data/mockData';
import type { ExternalMaterial } from '../../../types';
import { NoteModal, MockPlayer } from './shared';

// ─── Labels & icons per scope ──────────────────────────────────────────────────

const SCOPE_LABEL: Record<ExternalMaterial['scope'], string> = {
  school:      'Inna szkoła w mieście',
  county:      'Inny powiat',
  voivodeship: 'Inne województwo',
  all:         'Cała Polska',
};

const SCOPE_ICON: Record<ExternalMaterial['scope'], typeof Globe> = {
  school: School, county: MapPin, voivodeship: Globe, all: Globe,
};

// ─── External material card ────────────────────────────────────────────────────

function ExternalCard({ mat }: { mat: ExternalMaterial }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ScopeIcon = SCOPE_ICON[mat.scope];

  return (
    <>
      <AnimatePresence>
        {noteOpen && mat.noteContent && (
          <NoteModal content={mat.noteContent} topicName={mat.topicName} onClose={() => setNoteOpen(false)} />
        )}
      </AnimatePresence>

      {/* Amber left border distinguishes community content from official lessons */}
      <div className="bg-white rounded-3xl shadow-card border border-amber-100 border-l-4 overflow-hidden" style={{ borderLeftColor: '#f59e0b' }}>
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex-shrink-0"
              style={{ backgroundColor: mat.thumbnailColor }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                {/* Społeczność badge */}
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">
                  Społeczność
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  <ScopeIcon className="w-3 h-3" /> {SCOPE_LABEL[mat.scope]}
                </span>
              </div>
              <div className="font-bold text-gray-800 text-sm mt-1">{mat.topicName}</div>
              <div className="text-xs text-gray-500 mt-0.5">{mat.unitName}</div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs text-gray-400">{mat.schoolName}, {mat.city}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> {mat.likes}
                </span>
              </div>
            </div>

            {(mat.noteContent || mat.recordingDurationSeconds) && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              >
                {expanded ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
              </button>
            )}
          </div>

          {/* Material buttons */}
          <div className="flex gap-2 mt-3">
            {mat.noteContent && (
              <button
                onClick={() => setNoteOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5" /> Notatka
              </button>
            )}
            {mat.recordingDurationSeconds && (
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 text-violet-600 text-xs font-semibold">
                <Play className="w-3.5 h-3.5" /> Nagranie
              </span>
            )}
          </div>

          {/* Player (expanded) */}
          <AnimatePresence>
            {expanded && mat.recordingDurationSeconds && (
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
        </div>
      </div>
    </>
  );
}

// ─── Tab component ─────────────────────────────────────────────────────────────

const SCOPE_ORDER: ExternalMaterial['scope'][] = ['all', 'voivodeship', 'county', 'school'];

export function TabExplore({ subject }: { subject: string }) {
  const materials = mockExternalMaterials.filter(m => m.subject === subject);

  return (
    <div className="space-y-4">

      {/* Disclaimer banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <Globe className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Materiały z innych szkół</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Te materiały zostały udostępnione przez nauczycieli z innych szkół.
            Mogą się różnić od programu Twojej klasy — traktuj je jako uzupełnienie, nie zastępstwo.
          </p>
        </div>
      </div>

      {materials.length === 0 && (
        <div className="bg-gray-50 rounded-3xl p-10 text-center">
          <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Brak materiałów zewnętrznych z tego przedmiotu.</p>
        </div>
      )}

      {/* Group by scope with section dividers */}
      {SCOPE_ORDER.map(scope => {
        const group = materials.filter(m => m.scope === scope);
        if (group.length === 0) return null;
        const ScopeIcon = SCOPE_ICON[scope];
        return (
          <div key={scope}>
            <div className="flex items-center gap-2 mb-3 mt-2">
              <ScopeIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{SCOPE_LABEL[scope]}</span>
              <div className="flex-1 h-px bg-amber-100 ml-1" />
            </div>
            <div className="space-y-2 pl-1">
              {group.map(m => <ExternalCard key={m.id} mat={m} />)}
            </div>
          </div>
        );
      })}

    </div>
  );
}
