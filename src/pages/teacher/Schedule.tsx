import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Trash2, CheckCircle2, Circle, FileText,
  Share2, Mic, BookOpen, ChevronDown, ChevronUp, GraduationCap
} from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Blob } from '../../components/ui/Blob';
import {
  mockClasses, mockUnits, mockTopics, mockTopicStatuses
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

  const groupedByGrade = myClasses.reduce<Record<string, Class[]>>((acc, cls) => {
    const key = cls.schoolType === 'primary' ? `Klasa ${cls.grade} (SP)` : `Klasa ${cls.grade} (LO)`;
    (acc[key] = acc[key] ?? []).push(cls);
    return acc;
  }, {});

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

              {showAddClass && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 p-3 bg-violet-50 rounded-2xl border border-violet-200 text-sm text-violet-600"
                >
                  Funkcja dodawania klas będzie dostępna wkrótce 🔜
                </motion.div>
              )}

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
                          className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
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
                <Badge variant="purple">Matematyka</Badge>
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
      </motion.div>
    </div>
  );
}
