import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, LayoutTemplate } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { mockScheduleTemplates } from '../../../data/mockData';
import type { Class } from '../../../types';

const classColors = ['#e9d5ff', '#ddd6fe', '#bae6fd', '#d1fae5', '#fde68a', '#fecdd3', '#a7f3d0', '#fed7aa'];

function generateId() { return Math.random().toString(36).slice(2, 9); }

export function AddClassModal({ onAdd, onClose }: { onAdd: (cls: Class) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(6);
  const [schoolType, setSchoolType] = useState<'primary' | 'high'>('primary');
  const [subject, setSubject] = useState('Matematyka');
  const [studentCount, setStudentCount] = useState(25);
  const [templateId, setTemplateId] = useState('');
  const [colorIndex, setColorIndex] = useState(0);

  const filteredTemplates = mockScheduleTemplates.filter(t => t.subject === subject && t.grade === grade && t.schoolType === schoolType);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ id: generateId(), name: name.trim(), grade, schoolType, subject, studentCount, color: classColors[colorIndex], templateId: templateId || undefined });
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400';

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
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-800">Nowa klasa</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nazwa klasy *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="np. 6C" className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Przedmiot</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="np. Matematyka" className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Klasa (numer)</label>
              <input type="number" min={1} max={8} value={grade} onChange={e => setGrade(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Typ szkoły</label>
              <select value={schoolType} onChange={e => setSchoolType(e.target.value as 'primary' | 'high')} className={inputCls}>
                <option value="primary">Podstawowa</option>
                <option value="high">Liceum</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Liczba uczniów</label>
              <input type="number" min={1} value={studentCount} onChange={e => setStudentCount(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kolor</label>
              <div className="flex gap-1.5 mt-2">
                {classColors.map((c, i) => (
                  <button key={c} onClick={() => setColorIndex(i)} className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${i === colorIndex ? 'border-violet-500 scale-110' : 'border-transparent'}`} style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <LayoutTemplate className="w-3 h-3" /> Szablon harmonogramu (opcjonalnie)
            </label>
            <select value={templateId} onChange={e => setTemplateId(e.target.value)} className={inputCls}>
              <option value="">— Bez szablonu —</option>
              {mockScheduleTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {filteredTemplates.length > 0 && !templateId && (
              <p className="text-xs text-violet-500 mt-1">Dostępne szablony: {filteredTemplates.map(t => t.name).join(', ')}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button variant="primary" size="sm" onClick={handleAdd} disabled={!name.trim()} className="flex-1">Dodaj klasę</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
