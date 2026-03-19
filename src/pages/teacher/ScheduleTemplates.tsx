import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutTemplate, Plus, Trash2, ChevronDown, ChevronUp,
  BookOpen, GraduationCap, Pencil, Check, X, Save
} from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Blob } from '../../components/ui/Blob';
import { mockScheduleTemplates } from '../../data/mockData';
import type { ScheduleTemplate, TemplateUnit, TemplateTopic } from '../../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function TemplateEditor({
  template,
  onSave,
  onCancel,
}: {
  template: ScheduleTemplate | null;
  onSave: (t: ScheduleTemplate) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(template?.name ?? '');
  const [description, setDescription] = useState(template?.description ?? '');
  const [subject, setSubject] = useState(template?.subject ?? 'Matematyka');
  const [grade, setGrade] = useState<number>(template?.grade ?? 6);
  const [schoolType, setSchoolType] = useState<'primary' | 'high'>(template?.schoolType ?? 'primary');
  const [units, setUnits] = useState<TemplateUnit[]>(template?.units ?? []);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(template?.units.map(u => u.id) ?? []));
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newTopicName, setNewTopicName] = useState<Record<string, string>>({});

  const toggleUnit = (id: string) =>
    setExpandedUnits(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const addUnit = () => {
    const id = generateId();
    const newUnit: TemplateUnit = { id, name: 'Nowy dział', order: units.length + 1, topics: [] };
    setUnits(prev => [...prev, newUnit]);
    setExpandedUnits(prev => new Set([...prev, id]));
    setEditingUnitId(id);
    setEditValue('Nowy dział');
  };

  const saveUnitName = (unitId: string) => {
    setUnits(prev => prev.map(u => u.id === unitId ? { ...u, name: editValue } : u));
    setEditingUnitId(null);
  };

  const deleteUnit = (unitId: string) =>
    setUnits(prev => prev.filter(u => u.id !== unitId));

  const addTopic = (unitId: string) => {
    const topicName = newTopicName[unitId]?.trim();
    if (!topicName) return;
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      const newTopic: TemplateTopic = { id: generateId(), name: topicName, order: u.topics.length + 1 };
      return { ...u, topics: [...u.topics, newTopic] };
    }));
    setNewTopicName(prev => ({ ...prev, [unitId]: '' }));
  };

  const saveTopicName = (unitId: string, topicId: string) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      return { ...u, topics: u.topics.map(t => t.id === topicId ? { ...t, name: editValue } : t) };
    }));
    setEditingTopicId(null);
  };

  const deleteTopic = (unitId: string, topicId: string) =>
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      return { ...u, topics: u.topics.filter(t => t.id !== topicId) };
    }));

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: template?.id ?? generateId(),
      name: name.trim(),
      description: description.trim() || undefined,
      subject,
      grade,
      schoolType,
      units,
      createdAt: template?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="space-y-5">
      {/* Meta fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Nazwa szablonu *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="np. Matematyka kl. 6 SP"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Przedmiot</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="np. Matematyka"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Opis (opcjonalny)</label>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Krótki opis szablonu..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Klasa</label>
            <input
              type="number"
              min={1}
              max={8}
              value={grade}
              onChange={e => setGrade(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Typ szkoły</label>
            <select
              value={schoolType}
              onChange={e => setSchoolType(e.target.value as 'primary' | 'high')}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="primary">Podstawowa</option>
              <option value="high">Liceum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Units */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Działy i tematy</span>
          <Button variant="ghost" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addUnit}>
            Dodaj dział
          </Button>
        </div>

        <div className="space-y-3">
          {units.map(unit => (
            <div key={unit.id} className="border border-gray-200 rounded-2xl overflow-hidden">
              {/* Unit header */}
              <div className="flex items-center gap-2 p-3 bg-gray-50">
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {expandedUnits.has(unit.id)
                    ? <ChevronUp className="w-4 h-4 text-gray-500" />
                    : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {editingUnitId === unit.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveUnitName(unit.id); if (e.key === 'Escape') setEditingUnitId(null); }}
                      className="flex-1 px-2 py-1 rounded-lg border border-violet-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                    <button onClick={() => saveUnitName(unit.id)} className="p-1 rounded-lg bg-violet-100 hover:bg-violet-200 cursor-pointer">
                      <Check className="w-3.5 h-3.5 text-violet-600" />
                    </button>
                    <button onClick={() => setEditingUnitId(null)} className="p-1 rounded-lg hover:bg-gray-200 cursor-pointer">
                      <X className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800">{unit.name}</span>
                    <button
                      onClick={() => { setEditingUnitId(unit.id); setEditValue(unit.name); }}
                      className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <Badge variant="gray">{unit.topics.length} tem.</Badge>
                <button
                  onClick={() => deleteUnit(unit.id)}
                  className="p-1 rounded-lg hover:bg-rose-100 hover:text-rose-600 text-gray-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Topics */}
              <AnimatePresence>
                {expandedUnits.has(unit.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-3 pb-3 pt-1 space-y-1.5">
                      {unit.topics.map((topic, idx) => (
                        <div key={topic.id} className="flex items-center gap-2 pl-6">
                          <span className="text-xs text-gray-400 w-5 text-right">{idx + 1}.</span>
                          {editingTopicId === topic.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                autoFocus
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') saveTopicName(unit.id, topic.id);
                                  if (e.key === 'Escape') setEditingTopicId(null);
                                }}
                                className="flex-1 px-2 py-1 rounded-lg border border-violet-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                              />
                              <button onClick={() => saveTopicName(unit.id, topic.id)} className="p-1 rounded-lg bg-violet-100 hover:bg-violet-200 cursor-pointer">
                                <Check className="w-3 h-3 text-violet-600" />
                              </button>
                              <button onClick={() => setEditingTopicId(null)} className="p-1 rounded-lg hover:bg-gray-200 cursor-pointer">
                                <X className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center gap-2 group">
                              <span className="flex-1 text-sm text-gray-700">{topic.name}</span>
                              <button
                                onClick={() => { setEditingTopicId(topic.id); setEditValue(topic.name); }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition-all cursor-pointer"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteTopic(unit.id, topic.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-100 hover:text-rose-500 text-gray-400 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add topic input */}
                      <div className="flex items-center gap-2 pl-6 mt-2">
                        <span className="text-xs text-gray-300 w-5" />
                        <input
                          value={newTopicName[unit.id] ?? ''}
                          onChange={e => setNewTopicName(prev => ({ ...prev, [unit.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') addTopic(unit.id); }}
                          placeholder="Dodaj temat..."
                          className="flex-1 px-2 py-1 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:text-gray-700"
                        />
                        <button
                          onClick={() => addTopic(unit.id)}
                          disabled={!newTopicName[unit.id]?.trim()}
                          className="p-1.5 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-600 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {units.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-2xl">
              Brak działów. Kliknij „Dodaj dział", aby rozpocząć.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" size="md" onClick={onCancel}>Anuluj</Button>
        <Button
          variant="primary"
          size="md"
          icon={<Save className="w-4 h-4" />}
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Zapisz szablon
        </Button>
      </div>
    </div>
  );
}

export function ScheduleTemplates() {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>(mockScheduleTemplates);
  const [selectedId, setSelectedId] = useState<string | null>(mockScheduleTemplates[0]?.id ?? null);
  const [mode, setMode] = useState<'view' | 'create' | 'edit'>('view');
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  const selected = templates.find(t => t.id === selectedId) ?? null;

  const toggleUnit = (id: string) =>
    setExpandedUnits(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSave = (t: ScheduleTemplate) => {
    setTemplates(prev => {
      const exists = prev.find(x => x.id === t.id);
      return exists ? prev.map(x => x.id === t.id ? t : x) : [...prev, t];
    });
    setSelectedId(t.id);
    setMode('view');
    setExpandedUnits(new Set(t.units.map(u => u.id)));
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (selectedId === id) setSelectedId(templates.find(t => t.id !== id)?.id ?? null);
  };

  const totalTopics = (t: ScheduleTemplate) => t.units.reduce((s, u) => s + u.topics.length, 0);

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <Blob color="#ddd6fe" size="xl" className="-top-20 -left-20" />
      <Blob color="#a7f3d0" size="lg" className="top-1/2 -right-10" delay animated />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Szablony harmonogramów</h1>
          <p className="text-gray-500 mt-1">Twórz szablony z działami i tematami, a następnie przypisuj je do klas</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Template list */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card padding="lg" className="h-fit">
              <div className="flex items-center justify-between mb-5">
                <SectionTitle icon={<LayoutTemplate className="w-4 h-4" />}>Moje szablony</SectionTitle>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3 h-3" />}
                  onClick={() => { setMode('create'); setSelectedId(null); }}
                >
                  Nowy
                </Button>
              </div>

              <div className="space-y-2">
                {templates.map(t => (
                  <motion.div
                    key={t.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelectedId(t.id); setMode('view'); setExpandedUnits(new Set()); }}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      selectedId === t.id && mode === 'view'
                        ? 'ring-2 ring-violet-400 bg-violet-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm truncate">{t.name}</div>
                      <div className="text-xs text-gray-500">
                        {t.units.length} działów · {totalTopics(t)} tematów
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(t.id); }}
                      className="p-1.5 rounded-xl hover:bg-rose-100 hover:text-rose-600 text-gray-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}

                {templates.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Brak szablonów. Kliknij „Nowy", aby utworzyć.
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Right: Detail / Editor */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <Card padding="lg">
              <AnimatePresence mode="wait">
                {mode === 'create' && (
                  <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center justify-between mb-5">
                      <SectionTitle icon={<Plus className="w-4 h-4" />}>Nowy szablon</SectionTitle>
                    </div>
                    <TemplateEditor template={null} onSave={handleSave} onCancel={() => setMode('view')} />
                  </motion.div>
                )}

                {mode === 'edit' && selected && (
                  <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center justify-between mb-5">
                      <SectionTitle icon={<Pencil className="w-4 h-4" />}>Edytuj szablon</SectionTitle>
                    </div>
                    <TemplateEditor template={selected} onSave={handleSave} onCancel={() => setMode('view')} />
                  </motion.div>
                )}

                {mode === 'view' && selected && (
                  <motion.div key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center justify-between mb-2">
                      <SectionTitle icon={<BookOpen className="w-4 h-4" />}>{selected.name}</SectionTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Pencil className="w-3.5 h-3.5" />}
                          onClick={() => { setMode('edit'); setExpandedUnits(new Set(selected.units.map(u => u.id))); }}
                        >
                          Edytuj
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() => handleDelete(selected.id)}
                        >
                          Usuń
                        </Button>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <Badge variant="purple">{selected.subject}</Badge>
                      <Badge variant="blue">
                        Klasa {selected.grade} · {selected.schoolType === 'primary' ? 'SP' : 'LO'}
                      </Badge>
                      <Badge variant="gray">{selected.units.length} działów</Badge>
                      <Badge variant="gray">{totalTopics(selected)} tematów</Badge>
                    </div>

                    {selected.description && (
                      <p className="text-sm text-gray-500 mb-5 p-3 bg-gray-50 rounded-2xl">{selected.description}</p>
                    )}

                    {/* Units & Topics */}
                    <div className="space-y-3">
                      {selected.units.map(unit => {
                        const isExpanded = expandedUnits.has(unit.id);
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
                                <div className="text-xs text-gray-500 mt-0.5">{unit.topics.length} tematów</div>
                              </div>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="divide-y divide-gray-50">
                                    {unit.topics.map((topic, idx) => (
                                      <div key={topic.id} className="flex items-center gap-3 px-4 py-2.5">
                                        <span className="text-xs text-gray-400 w-5 text-right">{idx + 1}.</span>
                                        <span className="text-sm text-gray-700">{topic.name}</span>
                                      </div>
                                    ))}
                                    {unit.topics.length === 0 && (
                                      <div className="px-4 py-3 text-xs text-gray-400">Brak tematów w tym dziale</div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {mode === 'view' && !selected && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center text-gray-400">
                    <LayoutTemplate className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm">Wybierz szablon z listy lub utwórz nowy</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
