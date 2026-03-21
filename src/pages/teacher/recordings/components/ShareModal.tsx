import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2, XCircle, CheckCircle2,
  Users, BookOpen, School, Building2, MapPin, Globe,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { mockClasses } from '../../../../data/mockData';
import type { ShareScope } from '../../../../types';

export const scopeOptions: { scope: ShareScope; label: string; description: string; icon: React.ReactNode }[] = [
  { scope: 'class', label: 'Wybrana klasa', description: 'Tylko uczniowie wybranej klasy', icon: <Users className="w-4 h-4" /> },
  { scope: 'grade', label: 'Wybrany rocznik', description: 'Wszystkie klasy w tym roczniku', icon: <BookOpen className="w-4 h-4" /> },
  { scope: 'school', label: 'Cała szkoła', description: 'Wszyscy uczniowie w szkole', icon: <School className="w-4 h-4" /> },
  { scope: 'county', label: 'Cały powiat', description: 'Uczniowie z całego powiatu', icon: <Building2 className="w-4 h-4" /> },
  { scope: 'voivodeship', label: 'Całe województwo', description: 'Uczniowie z całego województwa', icon: <MapPin className="w-4 h-4" /> },
  { scope: 'all', label: 'Wszyscy', description: 'Publicznie dostępne dla wszystkich', icon: <Globe className="w-4 h-4" /> },
];

interface ShareModalProps {
  title: string;
  onClose: () => void;
  onShare: (scope: ShareScope, classId?: string, grade?: number) => void;
}

export function ShareModal({ title, onClose, onShare }: ShareModalProps) {
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
