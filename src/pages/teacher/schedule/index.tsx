import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Blob } from '../../../components/ui/Blob';
import { Card, SectionTitle } from '../../../components/ui/Card';
import { mockClasses } from '../../../data/mockData';
import type { Class, CurriculumTopic, TopicStatus } from '../../../types';

import { ClassHeader }       from './ClassHeader';
import { CurriculumList }    from './CurriculumList';
import { LessonDetailPanel } from './LessonDetailPanel';
import { AddMaterialModal }  from './AddMaterialModal';
import { AddClassModal }     from './AddClassModal';
import type { TopicEngagement } from './LessonDetailPanel';

// ─── Mock engagement data per topic per class ─────────────────────────────────

const engagementData: Array<{ topicId: string; classId: string } & TopicEngagement> = [
  { topicId: 'tp1', classId: 'c1', studentsOpenedNote: 18, studentsListenedRecording: 15 },
  { topicId: 'tp2', classId: 'c1', studentsOpenedNote: 20, studentsListenedRecording: 12 },
  { topicId: 'tp3', classId: 'c1', studentsOpenedNote: 0,  studentsListenedRecording: 19 },
  { topicId: 'tp4', classId: 'c1', studentsOpenedNote: 16, studentsListenedRecording: 0  },
  { topicId: 'tp1', classId: 'c2', studentsOpenedNote: 17, studentsListenedRecording: 14 },
  { topicId: 'tp2', classId: 'c2', studentsOpenedNote: 15, studentsListenedRecording: 0  },
  { topicId: 'tp7', classId: 'c3', studentsOpenedNote: 22, studentsListenedRecording: 20 },
  { topicId: 'tp8', classId: 'c3', studentsOpenedNote: 24, studentsListenedRecording: 18 },
];

// ─── Schedule ─────────────────────────────────────────────────────────────────

export function Schedule() {
  const [myClasses, setMyClasses] = useState<Class[]>(mockClasses);
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[0].id);
  const [showAddClass, setShowAddClass] = useState(false);

  const [lessonDetail, setLessonDetail] = useState<{
    topic: CurriculumTopic;
    status: TopicStatus | undefined;
    engagement: TopicEngagement | undefined;
  } | null>(null);

  const [addMaterialModal, setAddMaterialModal] = useState<{
    type: 'note' | 'recording';
    topicId: string;
    topicName: string;
  } | null>(null);

  const selectedClass = myClasses.find(c => c.id === selectedClassId);

  const addClass = (cls: Class) => {
    setMyClasses(prev => [...prev, cls]);
    setSelectedClassId(cls.id);
    setShowAddClass(false);
  };

  const handleClassChange = (id: string) => {
    setSelectedClassId(id);
    setLessonDetail(null);
  };

  const handleTopicClick = (topic: CurriculumTopic, status: TopicStatus | undefined) => {
    const engagement = engagementData.find(e => e.topicId === topic.id && e.classId === selectedClassId);
    setLessonDetail({ topic, status, engagement });
  };

  const handleOpenAddMaterial = (type: 'note' | 'recording', topicId: string, topicName: string) => {
    setAddMaterialModal({ type, topicId, topicName });
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-6 sm:p-8">
      <Blob color="#ddd6fe" size="xl" className="-top-20 -left-20" />
      <Blob color="#a7f3d0" size="lg" className="top-1/2 -right-10" delay animated />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative max-w-7xl mx-auto"
      >
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Klasy & Program nauczania</h1>
          <p className="text-gray-500 mt-1">Śledź realizację podstawy programowej i zarządzaj materiałami</p>
        </div>

        {/* Class header */}
        <ClassHeader
          selectedClass={selectedClass}
          classes={myClasses}
          onSelectClass={handleClassChange}
          onAddClass={() => setShowAddClass(true)}
        />

        {/* Split layout: list | detail panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* Left: curriculum list */}
          {selectedClass ? (
            <Card padding="lg">
              <SectionTitle icon={<BookOpen className="w-4 h-4" />} className="mb-5">
                Podstawa programowa
                <span
                  className="ml-2 px-2.5 py-0.5 rounded-full text-sm font-bold"
                  style={{ background: selectedClass.color }}
                >
                  {selectedClass.name}
                </span>
              </SectionTitle>

              <CurriculumList
                selectedClassId={selectedClassId}
                templateId={selectedClass.templateId}
                selectedTopicId={lessonDetail?.topic.id}
                onTopicClick={handleTopicClick}
              />
            </Card>
          ) : (
            <Card padding="lg">
              <p className="text-center text-gray-400 py-12">Brak klas. Dodaj pierwszą klasę.</p>
            </Card>
          )}

          {/* Right: sticky detail panel */}
          <div className="lg:sticky lg:top-6">
            <LessonDetailPanel
              topic={lessonDetail?.topic ?? null}
              status={lessonDetail?.status}
              engagement={lessonDetail?.engagement}
              cls={selectedClass}
              onClose={() => setLessonDetail(null)}
              onOpenAddMaterial={handleOpenAddMaterial}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Modals (forms only) ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddClass && (
          <AddClassModal onAdd={addClass} onClose={() => setShowAddClass(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addMaterialModal && (
          <AddMaterialModal
            type={addMaterialModal.type}
            topicId={addMaterialModal.topicId}
            topicName={addMaterialModal.topicName}
            currentClassId={selectedClassId}
            onClose={() => setAddMaterialModal(null)}
            onConfirm={() => setAddMaterialModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
