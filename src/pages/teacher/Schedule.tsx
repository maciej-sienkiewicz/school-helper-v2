import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Trash2, CheckCircle2, Circle, FileText,
  Share2, Mic, BookOpen, ChevronDown, ChevronUp, GraduationCap, LayoutTemplate
} from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Blob } from '../../components/ui/Blob';
import {
  mockClasses, mockUnits, mockTopics, mockTopicStatuses, mockScheduleTemplates
} from '../../data/mockData';
import type { Class, CurriculumUnit } from '../../types';

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

const classColors = ['#e9d5ff', '#ddd6fe', '#bae6fd', '#d1fae5', '#fde68a', '#fecdd3', '#a7f3d0', '#fed7aa'];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function AddClassForm({ onAdd, onCancel }: { onAdd: (cls: Class) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(6);
  const [schoolType, setSchoolType] = useState<'primary' | 'high'>('primary');
  const [subject, setSubject] = useState('Matematyka');
  const [studentCount, setStudentCount] = useState(25);
  const [templateId, setTemplateId] = useState<string>('');
  const [colorIndex, setColorIndex] = useState(0);

  const filteredTemplates = mockScheduleTemplates.filter(
    t => t.subject === subject && t.grade === grade && t.schoolType === schoolType
  );

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: generateId(),
      name: name.trim(),
      grade,
      schoolType,
      subject,
      studentCount,
      color: classColors[colorIndex],
      templateId: templateId || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4 p-4 bg-violet-50 rounded-2xl border border-violet-200 space-y-3"
    >
      <div className="text-sm font-semibold text-violet-700 mb-2">Nowa klasa</div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Nazwa klasy *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="np. 6C"
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Przedmiot</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="np. Matematyka"
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Klasa (numer)</label>
          <input
            type="number" min={1} max={8} value={grade}
            onChange={e => setGrade(Number(e.target.value))}
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Typ szkoły</label>
          <select
            value={schoolType}
            onChange={e => setSchoolType(e.target.value as 'primary' | 'high')}
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="primary">Podstawowa</option>
            <option value="high">Liceum</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Liczba uczniów</label>
          <input
            type="number" min={1} value={studentCount}
            onChange={e => setStudentCount(Number(e.target.value))}
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Kolor</label>
          <div className="flex gap-1.5 mt-1">
            {classColors.map((c, i) => (
              <button
                key={c}
                onClick={() => setColorIndex(i)}
                className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${i === colorIndex ? 'border-violet-500 scale-110' : 'border-transparent'}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Template assignment */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1">
          <LayoutTemplate className="w-3 h-3" /> Szablon harmonogramu (opcjonalnie)
        </label>
        <select
          value={templateId}
          onChange={e => setTemplateId(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="">— Bez szablonu —</option>
          {mockScheduleTemplates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {filteredTemplates.length > 0 && !templateId && (
          <p className="text-xs text-violet-500 mt-1">
            Dostępne szablony dla tej konfiguracji: {filteredTemplates.map(t => t.name).join(', ')}
          </p>
        )}
        {templateId && (
          <div className="mt-2 p-2 bg-violet-100 rounded-xl text-xs text-violet-700 flex items-center gap-1">
            <LayoutTemplate className="w-3 h-3" />
            Szablon: {mockScheduleTemplates.find(t => t.id === templateId)?.name}
            {' · '}
            {mockScheduleTemplates.find(t => t.id === templateId)?.units.length} działów
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="secondary" size="sm" onClick={onCancel}>Anuluj</Button>
        <Button variant="primary" size="sm" onClick={handleAdd} disabled={!name.trim()}>
          Dodaj klasę
        </Button>
      </div>
    </motion.div>
  );
}

export function Schedule() {
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

  const addClass = (cls: Class) => {
    setMyClasses(prev => [...prev, cls]);
    setSelectedClassId(cls.id);
    setShowAddClass(false);
  };

  const groupedByGrade = myClasses.reduce<Record<string, Class[]>>((acc, cls) => {
    const key = cls.schoolType === 'primary' ? `Klasa ${cls.grade} (SP)` : `Klasa ${cls.grade} (LO)`;
    (acc[key] = acc[key] ?? []).push(cls);
    return acc;
  }, {});

  const assignedTemplate = selectedClass?.templateId
    ? mockScheduleTemplates.find(t => t.id === selectedClass.templateId)
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <Blob color="#ddd6fe" size="xl" className="-top-20 -left-20" />
      <Blob color="#a7f3d0" size="lg" className="top-1/2 -right-10" delay animated />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Klasy & Program nauczania</h1>
          <p className="text-gray-500 mt-1">Zarządzaj klasami i śledź postęp realizacji podstawy programowej</p>
        </motion.div>

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
                  onClick={() => setShowAddClass(!showAddClass)}
                >
                  Dodaj
                </Button>
              </div>

              <AnimatePresence>
                {showAddClass && (
                  <AddClassForm onAdd={addClass} onCancel={() => setShowAddClass(false)} />
                )}
              </AnimatePresence>

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
                          className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
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
                                <span className="ml-1 flex items-center gap-0.5 text-violet-500">
                                  <LayoutTemplate className="w-3 h-3" />
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
              <div className="flex items-center justify-between mb-3">
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
                <Badge variant="purple">Matematyka</Badge>
              </div>

              {/* Assigned template info */}
              {assignedTemplate && (
                <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-violet-50 rounded-2xl text-xs text-violet-700 border border-violet-100">
                  <LayoutTemplate className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Szablon: <strong>{assignedTemplate.name}</strong></span>
                  <span className="text-violet-400">·</span>
                  <span>{assignedTemplate.units.length} działów</span>
                </div>
              )}

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
      </motion.div>
    </div>
  );
}
