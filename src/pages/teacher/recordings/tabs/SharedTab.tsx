import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, ChevronUp, Eye, Headphones, MessageSquare,
  Users, Share2, FileText,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { NotePreviewModal } from '../components/NotePreviewModal';
import { mockSharedMaterials, mockNotes } from '../../../../data/mockData';
import type { SharedMaterial } from '../../../../types';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

function SharedMaterialDetail({ mat }: { mat: SharedMaterial }) {
  const [expanded, setExpanded] = useState(false);
  const [showNotePreview, setShowNotePreview] = useState(false);

  // Try to find a note matching this material's topic
  const relatedNote = mockNotes.find(n => n.topicName === mat.topicName && n.status === 'accepted');
  const hasNote = mat.type === 'note' || mat.type === 'both';

  return (
    <>
      <AnimatePresence>
        {showNotePreview && relatedNote && (
          <NotePreviewModal note={relatedNote} onClose={() => setShowNotePreview(false)} />
        )}
      </AnimatePresence>

      <div className="border border-gray-100 rounded-3xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-4 p-4 hover:bg-violet-50/60 transition-colors cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 text-sm">{mat.topicName}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {mat.unitName} · {mat.sharedWithClasses.join(', ')} · {format(parseISO(mat.sharedAt), 'd MMM yyyy', { locale: pl })}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{mat.stats.totalViews}</span>
              {mat.stats.totalListens > 0 && <span className="flex items-center gap-1"><Headphones className="w-3 h-3" />{mat.stats.totalListens}</span>}
              {mat.stats.commentCount > 0 && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{mat.stats.commentCount}</span>}
            </div>
            <Badge variant={mat.type === 'both' ? 'purple' : 'green'}>
              {mat.type === 'note' ? 'Notatka' : mat.type === 'audio' ? 'Audio' : 'Notatka + Audio'}
            </Badge>
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 space-y-4 border-t border-gray-100">
                {/* Per-class stats table */}
                <div className="overflow-x-auto rounded-2xl border border-violet-100">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-violet-50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-violet-600 uppercase tracking-wider rounded-tl-2xl">Klasa</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-violet-600 uppercase tracking-wider">Uczniów</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-emerald-600 uppercase tracking-wider">Otworzyło</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-rose-400 uppercase tracking-wider">Nie otworzyło</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-violet-600 uppercase tracking-wider">Wyświetleń</th>
                        {mat.stats.totalListens > 0 && <th className="text-right px-4 py-3 text-xs font-semibold text-sky-500 uppercase tracking-wider">Odsłuchań</th>}
                        {mat.stats.externalViews > 0 && <th className="text-right px-4 py-3 text-xs font-semibold text-amber-500 uppercase tracking-wider rounded-tr-2xl">Spoza szkoły</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {mat.stats.classStats.map((cs, idx) => (
                        <tr
                          key={cs.classId}
                          className={`border-t border-violet-50 transition-colors hover:bg-violet-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                        >
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">{cs.className.slice(0, 2)}</span>
                              <span className="font-medium text-gray-800">{cs.className}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">{cs.totalStudents}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-emerald-600 font-semibold">{cs.studentsOpened}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={cs.totalStudents - cs.studentsOpened > 0 ? 'text-rose-500' : 'text-gray-300'}>
                              {cs.totalStudents - cs.studentsOpened}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600">{cs.viewCount}</td>
                          {mat.stats.totalListens > 0 && <td className="px-4 py-3 text-right text-gray-600">{cs.listenCount}</td>}
                          {mat.stats.externalViews > 0 && <td className="px-4 py-3 text-right text-gray-400">—</td>}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-violet-200 bg-violet-50">
                        <td className="px-4 py-3 rounded-bl-2xl">
                          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Łącznie</span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">
                          {mat.stats.classStats.reduce((s, cs) => s + cs.totalStudents, 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                          {mat.stats.classStats.reduce((s, cs) => s + cs.studentsOpened, 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-rose-500">
                          {mat.stats.classStats.reduce((s, cs) => s + cs.totalStudents - cs.studentsOpened, 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">{mat.stats.totalViews}</td>
                        {mat.stats.totalListens > 0 && <td className="px-4 py-3 text-right font-semibold text-gray-700">{mat.stats.totalListens}</td>}
                        {mat.stats.externalViews > 0 && <td className="px-4 py-3 text-right font-semibold text-gray-700 rounded-br-2xl">{mat.stats.externalViews}</td>}
                      </tr>
                    </tfoot>
                  </table>
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
                  {hasNote && relatedNote && (
                    <Button
                      variant="ghost" size="sm"
                      icon={<FileText className="w-3.5 h-3.5" />}
                      onClick={() => setShowNotePreview(true)}
                    >
                      Podejrzyj notatkę
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function GradeSection({ grade, materials }: { grade: number; materials: SharedMaterial[] }) {
  const [open, setOpen] = useState(true);

  const label = grade <= 8
    ? `Klasa ${grade} (Szkoła podstawowa)`
    : `Klasa ${grade - 8} (Liceum)`;

  return (
    <div className="border border-gray-100 rounded-3xl overflow-hidden">
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
            <div className="p-4 space-y-3 border-t border-gray-100">
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

export function SharedTab() {
  const byGrade = mockSharedMaterials.reduce<Record<number, SharedMaterial[]>>((acc, m) => {
    (acc[m.grade] = acc[m.grade] ?? []).push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(byGrade)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([grade, mats]) => (
          <GradeSection key={grade} grade={Number(grade)} materials={mats} />
        ))}
    </div>
  );
}
