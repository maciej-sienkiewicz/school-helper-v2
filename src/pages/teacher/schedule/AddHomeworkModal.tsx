import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardList, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface Homework {
  id: string;
  topicId: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;
  isExtra: boolean;
}

interface Props {
  topicId: string;
  topicName: string;
  classId: string;
  onAdd: (hw: Homework) => void;
  onClose: () => void;
}

export function AddHomeworkModal({ topicId, topicName, classId, onAdd, onClose }: Props) {
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [dueDate, setDueDate]   = useState('');
  const [isExtra, setIsExtra]   = useState(false);

  const inputCls = 'w-full px-3 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white';

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      id: `hw-${Date.now()}`,
      topicId,
      classId,
      title: title.trim(),
      description: desc.trim(),
      dueDate,
      isExtra,
    });
    onClose();
  };

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
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Dodaj zadanie domowe</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-5 pl-10">
          Temat: <span className="font-medium text-gray-600">{topicName}</span>
        </p>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Tytuł zadania *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="np. Zadania z potęg i pierwiastków, str. 45"
              className={inputCls}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Opis / instrukcja</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Opcjonalny opis lub instrukcja do zadania..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Termin oddania</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className={inputCls}
            />
          </div>

          <button
            onClick={() => setIsExtra(v => !v)}
            className="flex items-center gap-3 cursor-pointer w-full text-left"
          >
            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isExtra ? 'bg-orange-400 border-orange-400' : 'border-gray-300'}`}>
              {isExtra && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-700">Nadobowiązkowe (dodatkowe)</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!title.trim()}
            onClick={handleSubmit}
            className="flex-1"
          >
            Dodaj zadanie
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
