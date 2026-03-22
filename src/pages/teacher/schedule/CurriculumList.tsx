import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, ChevronDown, ChevronUp, CheckCircle2, Circle,
  FileText, Mic, Share2, LayoutTemplate,
} from 'lucide-react';
import { mockUnits, mockTopics, mockTopicStatuses, mockScheduleTemplates } from '../../../data/mockData';
import type { CurriculumTopic, TopicStatus } from '../../../types';

interface Props {
  selectedClassId: string;
  templateId?: string;
  onTopicClick: (topic: CurriculumTopic, status: TopicStatus | undefined) => void;
}

export function CurriculumList({ selectedClassId, templateId, onTopicClick }: Props) {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(['u1', 'u3']));

  const toggleUnit = (id: string) =>
    setExpandedUnits(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const getStatus = (topicId: string) =>
    mockTopicStatuses.find(s => s.topicId === topicId && s.classId === selectedClassId);

  const assignedTemplate = templateId ? mockScheduleTemplates.find(t => t.id === templateId) : null;

  return (
    <div>
      {/* Assigned template info */}
      {assignedTemplate && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-violet-50 rounded-2xl text-xs text-violet-700 border border-violet-100">
          <LayoutTemplate className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Szablon: <strong>{assignedTemplate.name}</strong></span>
          <span className="text-violet-300">·</span>
          <span>{assignedTemplate.units.length} działów</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        {[
          { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, label: 'Zrealizowany' },
          { icon: <FileText className="w-3.5 h-3.5 text-violet-500" />, label: 'Ma notatkę' },
          { icon: <Share2 className="w-3.5 h-3.5 text-sky-500" />, label: 'Udostępniony' },
          { icon: <Mic className="w-3.5 h-3.5 text-amber-500" />, label: 'Ma nagranie' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1 text-gray-500">{icon} {label}</div>
        ))}
      </div>

      {/* Units */}
      <div className="space-y-3">
        {mockUnits.map(unit => {
          const topics = mockTopics.filter(t => t.unitId === unit.id);
          const isExpanded = expandedUnits.has(unit.id);
          const completedCount = topics.filter(t => getStatus(t.id)?.completed).length;

          return (
            <div key={unit.id} className="border border-gray-100 rounded-2xl overflow-hidden">
              {/* Unit header */}
              <button
                onClick={() => toggleUnit(unit.id)}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-violet-50/60 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-bold text-gray-800">{unit.name}</span>
                  <div className="text-xs text-gray-500 mt-0.5">{completedCount}/{topics.length} tematów zrealizowanych</div>
                </div>
                {/* Progress bar */}
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all"
                    style={{ width: `${topics.length ? (completedCount / topics.length) * 100 : 0}%` }}
                  />
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>

              {/* Topics */}
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
                        const status = getStatus(topic.id);
                        return (
                          <button
                            key={topic.id}
                            onClick={() => onTopicClick(topic, status)}
                            className="w-full group/row flex items-center gap-3 px-4 py-3 hover:bg-violet-50/50 transition-colors cursor-pointer text-left"
                          >
                            {status?.completed
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                            }

                            <span className={`flex-1 text-sm ${status?.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                              {topic.name}
                            </span>

                            {/* Status icons */}
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
                              <ChevronDown className="w-3.5 h-3.5 text-violet-300 -rotate-90 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                            </div>
                          </button>
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
    </div>
  );
}
