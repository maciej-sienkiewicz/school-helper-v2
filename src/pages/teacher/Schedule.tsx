import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Trash2, CheckCircle2, Circle, FileText,
  Share2, Mic, BookOpen, ChevronDown, ChevronUp, GraduationCap,
  LayoutTemplate, X, Pencil, Copy
} from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Blob } from '../../components/ui/Blob';
import {
  mockClasses, mockUnits, mockTopics, mockTopicStatuses, mockScheduleTemplates
} from '../../data/mockData';
import type { Class, CurriculumUnit, ScheduleTemplate } from '../../types';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const subjectColors: Record<string, string> = {
  Matematyka: '#e9d5ff',
  Fizyka: '#bae6fd',
};

type ScheduleTab = 'classes' | 'templates';

// ─── Add Class Modal ──────────────────────────────────────────────────────────

function AddClassModal({
  templates,
  onClose,
  onAdd,
}: {
  templates: ScheduleTemplate[];
  onClose: () => void;
  onAdd: (cls: Omit<Class, 'id'>) => void;
}) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('6');
  const [schoolType, setSchoolType] = useState<'primary' | 'high'>('primary');
  const [subject, setSubject] = useState('Matematyka');
  const [studentCount, setStudentCount] = useState('24');
  const [templateId, setTemplateId] = useState('');

  const colors = ['#e9d5ff', '#ddd6fe', '#bae6fd', '#d1fae5', '#fde68a', '#fecdd3', '#a7f3d0'];

  const filteredTemplates = templates.filter(
    t => t.subject === subject && t.schoolType === schoolType && t.grade === Number(grade)
  );

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      grade: Number(grade),
      schoolType,
      subject,
      studentCount: Number(studentCount),
      color: colors[Math.floor(Math.random() * colors.length)],
      templateId: templateId || undefined,
    });
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Dodaj klasę</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Nazwa klasy</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="np. 6C, 7B, 3LOA"
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Typ szkoły</label>
              <select
                value={schoolType}
                onChange={e => setSchoolType(e.target.value as 'primary' | 'high')}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                <option value="primary">Szkoła podstawowa</option>
                <option value="high">Liceum</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Rocznik</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                {(schoolType === 'primary' ? [4, 5, 6, 7, 8] : [1, 2, 3]).map(g => (
                  <option key={g} value={g}>Klasa {g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Przedmiot</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                <option>Matematyka</option>
                <option>Fizyka</option>
                <option>Chemia</option>
                <option>Biologia</option>
                <option>Historia</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Liczba uczniów</label>
              <input
                type="number"
                value={studentCount}
                onChange={e => setStudentCount(e.target.value)}
                min="1" max="50"
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Szablon harmonogramu <span className="text-gray-400 normal-case font-normal">(opcjonalnie)</span>
            </label>
            {filteredTemplates.length > 0 ? (
              <select
                value={templateId}
                onChange={e => setTemplateId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                <option value="">— Bez szablonu —</option>
                {filteredTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400">
                Brak szablonów dla {subject} klasa {grade} ({schoolType === 'primary' ? 'SP' : 'LO'})
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            className="flex-1"
            icon={<Plus className="w-4 h-4" />}
          >
            Dodaj klasę
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Template Detail Modal ────────────────────────────────────────────────────

function TemplateDetailModal({
  template,
  onClose,
}: {
  template: ScheduleTemplate;
  onClose: () => void;
}) {
  const units = mockUnits.filter(u => template.unitIds.includes(u.id));
  const topics = mockTopics.filter(t => template.topicIds.includes(t.id));

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
        className="bg-white rounded-4xl shadow-2xl p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{template.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="purple">{template.subject}</Badge>
              <Badge variant="blue">
                Klasa {template.grade} · {template.schoolType === 'primary' ? 'SP' : 'LO'}
              </Badge>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {template.description && (
          <p className="text-sm text-gray-500 mb-5 p-3 bg-gray-50 rounded-2xl">{template.description}</p>
        )}

        <div className="space-y-3">
          {units.map(unit => {
            const unitTopics = topics.filter(t => t.unitId === unit.id);
            return (
              <div key={unit.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-3 bg-gray-50">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-3 h-3 text-violet-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">{unit.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{unitTopics.length} tematów</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {unitTopics.map(topic => (
                    <div key={topic.id} className="flex items-center gap-2.5 px-4 py-2.5">
                      <Circle className="w-3 h-3 text-gray-300 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{topic.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" size="md" icon={<Copy className="w-4 h-4" />} onClick={() => alert('Szablon zduplikowany')}>
            Duplikuj
          </Button>
          <Button variant="primary" size="md" icon={<Pencil className="w-4 h-4" />} onClick={() => alert('Edycja szablonu – wkrótce!')}>
            Edytuj szablon
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Create Template Modal ────────────────────────────────────────────────────

function CreateTemplateModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (t: ScheduleTemplate) => void;
}) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Matematyka');
  const [schoolType, setSchoolType] = useState<'primary' | 'high'>('primary');
  const [grade, setGrade] = useState('6');
  const [description, setDescription] = useState('');
  const [selectedUnitIds, setSelectedUnitIds] = useState<Set<string>>(new Set());
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(new Set());

  const toggleUnit = (uid: string) => {
    setSelectedUnitIds(prev => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  };
  const toggleTopic = (tid: string) => {
    setSelectedTopicIds(prev => {
      const next = new Set(prev);
      next.has(tid) ? next.delete(tid) : next.add(tid);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      id: `st_${Date.now()}`,
      name: name.trim(),
      subject,
      schoolType,
      grade: Number(grade),
      description: description.trim() || undefined,
      unitIds: [...selectedUnitIds],
      topicIds: [...selectedTopicIds],
      createdAt: new Date().toISOString().slice(0, 10),
    });
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
        className="bg-white rounded-4xl shadow-2xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Nowy szablon harmonogramu</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Nazwa szablonu</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="np. Matematyka SP klasa 6 – semestr I"
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Opis (opcjonalnie)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Krótki opis zakresu szablonu..."
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Przedmiot</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                <option>Matematyka</option>
                <option>Fizyka</option>
                <option>Chemia</option>
                <option>Biologia</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Typ</label>
              <select
                value={schoolType}
                onChange={e => setSchoolType(e.target.value as 'primary' | 'high')}
                className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                <option value="primary">SP</option>
                <option value="high">LO</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Klasa</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                {(schoolType === 'primary' ? [4, 5, 6, 7, 8] : [1, 2, 3]).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Unit & topic selection */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Wybierz działy i tematy
            </label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {mockUnits.map(unit => {
                const unitTopics = mockTopics.filter(t => t.unitId === unit.id);
                const unitSelected = selectedUnitIds.has(unit.id);
                return (
                  <div key={unit.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                    <label className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer hover:bg-violet-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={unitSelected}
                        onChange={() => toggleUnit(unit.id)}
                        className="accent-violet-600 w-4 h-4"
                      />
                      <span className="text-sm font-semibold text-gray-800">{unit.name}</span>
                    </label>
                    <div className="divide-y divide-gray-50">
                      {unitTopics.map(topic => (
                        <label key={topic.id} className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-violet-50/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedTopicIds.has(topic.id)}
                            onChange={() => toggleTopic(topic.id)}
                            className="accent-violet-600 w-3.5 h-3.5"
                          />
                          <span className="text-sm text-gray-700">{topic.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            className="flex-1"
            icon={<LayoutTemplate className="w-4 h-4" />}
          >
            Utwórz szablon
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Templates Tab ────────────────────────────────────────────────────────────

function TemplatesTab() {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>(mockScheduleTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const addTemplate = (t: ScheduleTemplate) => setTemplates(prev => [...prev, t]);
  const removeTemplate = (id: string) => setTemplates(prev => prev.filter(t => t.id !== id));

  const grouped = templates.reduce<Record<string, ScheduleTemplate[]>>((acc, t) => {
    const key = `${t.subject} · ${t.schoolType === 'primary' ? 'Szkoła podstawowa' : 'Liceum'}`;
    (acc[key] = acc[key] ?? []).push(t);
    return acc;
  }, {});

  return (
    <>
      <AnimatePresence>
        {selectedTemplate && (
          <TemplateDetailModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
        )}
        {showCreate && (
          <CreateTemplateModal onClose={() => setShowCreate(false)} onAdd={addTemplate} />
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {Object.entries(grouped).map(([group, tmplts]) => (
          <motion.div key={group} variants={itemVariants}>
            <Card padding="lg">
              <div className="flex items-center justify-between mb-5">
                <SectionTitle icon={<LayoutTemplate className="w-4 h-4" />}>{group}</SectionTitle>
                <Badge variant="purple">{tmplts.length} szablonów</Badge>
              </div>
              <div className="space-y-3">
                {tmplts.map(t => {
                  const unitCount = t.unitIds.length;
                  const topicCount = t.topicIds.length;
                  return (
                    <motion.div
                      key={t.id}
                      whileTap={{ scale: 0.98 }}
                      className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-card transition-shadow"
                    >
                      <button
                        onClick={() => setSelectedTemplate(t)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-violet-50/50 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <LayoutTemplate className="w-4 h-4 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                          {t.description && (
                            <div className="text-xs text-gray-500 mt-0.5 truncate">{t.description}</div>
                          )}
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {unitCount} {unitCount === 1 ? 'dział' : unitCount < 5 ? 'działy' : 'działów'}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" /> {topicCount} tematów
                            </span>
                            <span>Klasa {t.grade} · {t.schoolType === 'primary' ? 'SP' : 'LO'}</span>
                            <span>Utworzono {format(parseISO(t.createdAt), 'd MMM yyyy', { locale: pl })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={e => { e.stopPropagation(); removeTemplate(t.id); }}
                            className="p-1.5 rounded-xl hover:bg-rose-100 hover:text-rose-600 text-gray-300 transition-all cursor-pointer"
                            title="Usuń szablon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronDown className="w-4 h-4 text-gray-300" />
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        ))}

        {templates.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card padding="lg" className="text-center py-12">
              <LayoutTemplate className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <div className="text-gray-500 font-semibold">Brak szablonów</div>
              <div className="text-sm text-gray-400 mt-1">Utwórz pierwszy szablon harmonogramu</div>
            </Card>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreate(true)}
          >
            Nowy szablon
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}

// ─── Classes & Curriculum Tab ─────────────────────────────────────────────────

function ClassesTab() {
  const [myClasses, setMyClasses] = useState<Class[]>(mockClasses);
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[0].id);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(['u1', 'u3']));
  const [showAddClass, setShowAddClass] = useState(false);

  const selectedClass = myClasses.find(c => c.id === selectedClassId);

  const getTopicStatus = (topicId: string, classId: string) =>
    mockTopicStatuses.find(s => s.topicId === topicId && s.classId === classId);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      next.has(unitId) ? next.delete(unitId) : next.add(unitId);
      return next;
    });
  };

  const removeClass = (id: string) => {
    setMyClasses(prev => prev.filter(c => c.id !== id));
    if (selectedClassId === id) setSelectedClassId(myClasses.find(c => c.id !== id)?.id ?? '');
  };

  const addClass = (cls: Omit<Class, 'id'>) => {
    const newClass: Class = { id: `c_${Date.now()}`, ...cls };
    setMyClasses(prev => [...prev, newClass]);
    setSelectedClassId(newClass.id);
  };

  const groupedByGrade = myClasses.reduce<Record<string, Class[]>>((acc, cls) => {
    const key = cls.schoolType === 'primary' ? `Klasa ${cls.grade} (SP)` : `Klasa ${cls.grade} (LO)`;
    (acc[key] = acc[key] ?? []).push(cls);
    return acc;
  }, {});

  return (
    <>
      <AnimatePresence>
        {showAddClass && (
          <AddClassModal
            templates={mockScheduleTemplates}
            onClose={() => setShowAddClass(false)}
            onAdd={addClass}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: My classes */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card padding="lg" className="h-fit">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle icon={<Users className="w-4 h-4" />}>Moje klasy</SectionTitle>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3 h-3" />}
                onClick={() => setShowAddClass(true)}
              >
                Dodaj
              </Button>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedByGrade).map(([group, classes]) => (
                <div key={group}>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                    {group}
                  </div>
                  <div className="space-y-2">
                    {classes.map(cls => (
                      <motion.div
                        key={cls.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedClassId(cls.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                          selectedClassId === cls.id
                            ? 'ring-2 ring-violet-400 bg-violet-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-gray-700 flex-shrink-0"
                          style={{ background: cls.color }}
                        >
                          {cls.name}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 text-sm">{cls.subject}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {cls.studentCount} uczniów
                            {cls.templateId && (
                              <span className="ml-1 text-violet-400 flex items-center gap-0.5">
                                · <LayoutTemplate className="w-2.5 h-2.5" /> szablon
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); removeClass(cls.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-100 hover:text-rose-600 text-gray-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(
                  myClasses.reduce<Record<string, number>>((acc, c) => {
                    acc[c.subject] = (acc[c.subject] ?? 0) + 1; return acc;
                  }, {})
                ).map(([subj, count]) => (
                  <div key={subj} className="p-2.5 rounded-2xl text-center" style={{ background: subjectColors[subj] ?? '#e5e7eb' }}>
                    <div className="text-lg font-bold text-gray-800">{count}</div>
                    <div className="text-xs text-gray-600">{subj}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right: Curriculum */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle icon={<BookOpen className="w-4 h-4" />}>
                Podstawa programowa
                {selectedClass && (
                  <span
                    className="ml-2 px-2.5 py-0.5 rounded-full text-sm font-bold"
                    style={{ background: selectedClass.color }}
                  >
                    {selectedClass.name}
                  </span>
                )}
              </SectionTitle>
              <Badge variant="purple">{selectedClass?.subject ?? 'Matematyka'}</Badge>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-5 text-xs">
              {[
                { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, label: 'Zrealizowany' },
                { icon: <FileText className="w-3.5 h-3.5 text-violet-500" />, label: 'Ma notatkę' },
                { icon: <Share2 className="w-3.5 h-3.5 text-sky-500" />, label: 'Udostępniony' },
                { icon: <Mic className="w-3.5 h-3.5 text-amber-500" />, label: 'Ma nagranie' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1 text-gray-500">
                  {icon} {label}
                </div>
              ))}
            </div>

            {/* Units & topics */}
            <div className="space-y-3">
              {mockUnits.map((unit: CurriculumUnit) => {
                const topics = mockTopics.filter(t => t.unitId === unit.id);
                const isExpanded = expandedUnits.has(unit.id);
                const completedCount = topics.filter(t =>
                  getTopicStatus(t.id, selectedClassId)?.completed
                ).length;

                return (
                  <div key={unit.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleUnit(unit.id)}
                      className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-violet-50 transition-colors cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-bold text-gray-800">{unit.name}</span>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {completedCount}/{topics.length} tematów zrealizowanych
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all"
                          style={{ width: `${topics.length ? (completedCount / topics.length) * 100 : 0}%` }}
                        />
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="divide-y divide-gray-50">
                            {topics.map(topic => {
                              const status = getTopicStatus(topic.id, selectedClassId);
                              return (
                                <div
                                  key={topic.id}
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-violet-50/50 transition-colors"
                                >
                                  <button
                                    className="flex-shrink-0 cursor-pointer"
                                    onClick={() => alert(`Przełączono temat: ${topic.name}`)}
                                  >
                                    {status?.completed
                                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      : <Circle className="w-4 h-4 text-gray-300" />
                                    }
                                  </button>

                                  <span className={`flex-1 text-sm ${status?.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                    {topic.name}
                                  </span>

                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    {status?.hasNote && (
                                      <div className="w-5 h-5 rounded-lg bg-violet-100 flex items-center justify-center" title="Ma notatkę">
                                        <FileText className="w-3 h-3 text-violet-500" />
                                      </div>
                                    )}
                                    {status?.isShared && (
                                      <div className="w-5 h-5 rounded-lg bg-sky-100 flex items-center justify-center" title="Udostępniony">
                                        <Share2 className="w-3 h-3 text-sky-500" />
                                      </div>
                                    )}
                                    {status?.hasRecording && (
                                      <div className="w-5 h-5 rounded-lg bg-amber-100 flex items-center justify-center" title="Ma nagranie">
                                        <Mic className="w-3 h-3 text-amber-500" />
                                      </div>
                                    )}
                                    {!status && (
                                      <span className="text-xs text-gray-300">—</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon={<Plus className="w-3 h-3" />}
              className="mt-4"
              onClick={() => alert('Dodawanie tematu – wkrótce!')}
            >
              Dodaj temat
            </Button>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

// ─── Main Schedule Page ───────────────────────────────────────────────────────

export function Schedule() {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('classes');

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <Blob color="#ddd6fe" size="xl" className="-top-20 -left-20" />
      <Blob color="#a7f3d0" size="lg" className="top-1/2 -right-10" delay animated />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Klasy & Program nauczania</h1>
          <p className="text-gray-500 mt-1">Zarządzaj klasami, szablonami harmonogramów i śledź postęp realizacji podstawy programowej</p>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-6 p-1 bg-white rounded-2xl shadow-card w-fit">
          {([
            { id: 'classes' as ScheduleTab, label: 'Klasy & Curriculum', icon: Users },
            { id: 'templates' as ScheduleTab, label: 'Szablony harmonogramu', icon: LayoutTemplate },
          ]).map(({ id, label, icon: Icon }) => (
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
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'classes' && (
            <motion.div
              key="classes"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <ClassesTab />
            </motion.div>
          )}
          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <TemplatesTab />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
