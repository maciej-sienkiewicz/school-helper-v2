import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Plus, Users } from 'lucide-react';
import type { Class } from '../../../types';

interface Props {
  classes: Class[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddClass: () => void;
}

export function ClassDropdown({ classes, selectedId, onSelect, onAddClass }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedClass = classes.find(c => c.id === selectedId);

  const groupedByGrade = classes.reduce<Record<string, Class[]>>((acc, cls) => {
    const key = cls.schoolType === 'primary' ? `Klasa ${cls.grade} (SP)` : `Klasa ${cls.grade} (LO)`;
    (acc[key] = acc[key] ?? []).push(cls);
    return acc;
  }, {});

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-violet-300 hover:shadow-md transition-all cursor-pointer"
      >
        {selectedClass && (
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0"
            style={{ background: selectedClass.color }}
          >
            {selectedClass.name.slice(0, 2)}
          </span>
        )}
        <span className="text-sm font-semibold text-gray-800">{selectedClass?.name ?? '—'}</span>
        <span className="text-xs text-gray-400 hidden sm:inline">{selectedClass?.subject}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-3 max-h-80 overflow-y-auto"
          >
            {Object.entries(groupedByGrade).map(([group, groupClasses]) => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1.5">{group}</div>
                {groupClasses.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => { onSelect(cls.id); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all cursor-pointer text-left mb-1 last:mb-0 ${
                      cls.id === selectedId ? 'bg-violet-50 ring-1 ring-violet-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Color badge */}
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-gray-700 flex-shrink-0"
                      style={{ background: cls.color }}
                    >
                      {cls.name}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800">{cls.subject}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Users className="w-3 h-3" />
                        {cls.studentCount} uczniów
                        <span className="text-gray-300">·</span>
                        {cls.schoolType === 'primary' ? 'SP' : 'LO'}
                      </div>
                    </div>

                    {cls.id === selectedId && <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            ))}

            {/* Add class */}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={() => { onAddClass(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl text-violet-600 hover:bg-violet-50 transition-colors cursor-pointer text-sm font-semibold"
              >
                <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                Dodaj nową klasę
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
