import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Blob } from '../../../components/ui/Blob';
import { Card, SectionTitle } from '../../../components/ui/Card';
import { mockClasses } from '../../../data/mockData';
import type { Class, CurriculumTopic, TopicStatus } from '../../../types';

import { ClassHeader }           from './ClassHeader';
import { CurriculumList }        from './CurriculumList';
import { LessonDetailPanel }     from './LessonDetailPanel';
import { ScheduledExamsSection } from './ScheduledExamsSection';
import { AddMaterialModal }      from './AddMaterialModal';
import { AddClassModal }         from './AddClassModal';
import { AddHomeworkModal }      from './AddHomeworkModal';
import { ScheduleTestModal }     from './ScheduleTestModal';
import type { TopicEngagement }  from './LessonDetailPanel';
import type { Homework }         from './AddHomeworkModal';
import type { ScheduledExam }    from './ScheduleTestModal';

// ─── Mock engagement data ─────────────────────────────────────────────────────

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

// ─── Seed data ────────────────────────────────────────────────────────────────

const initialHomework: Homework[] = [
  {
    id: 'hw-seed-1', topicId: 'tp1', classId: 'c1',
    title: 'Zadania z potęg, str. 45 zad. 1–8',
    description: '', dueDate: '2026-03-28', isExtra: false,
  },
  {
    id: 'hw-seed-2', topicId: 'tp1', classId: 'c1',
    title: 'Esej: zastosowania potęg w fizyce',
    description: 'Min. 1 strona A4', dueDate: '2026-04-04', isExtra: true,
  },
];

const initialExams: ScheduledExam[] = [
  {
    id: 'exam-seed-1', classId: 'c1',
    date: '2026-04-10',
    testTitle: 'Sprawdzian: Liczby i wyrażenia algebraiczne',
    source: 'generator', generatedTestId: 'gt1',
    topicIds: ['tp1', 'tp2', 'tp4'],
  },
];

// ─── Schedule ─────────────────────────────────────────────────────────────────

export function Schedule() {
  const [myClasses, setMyClasses]             = useState<Class[]>(mockClasses);
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[0].id);
  const [showAddClass, setShowAddClass]       = useState(false);
  const [homeworkItems, setHomeworkItems]     = useState<Homework[]>(initialHomework);
  const [examItems, setExamItems]             = useState<ScheduledExam[]>(initialExams);

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

  const [addHomeworkModal, setAddHomeworkModal] = useState<{
    topicId: string;
    topicName: string;
  } | null>(null);

  // null = closed, undefined = new exam, ScheduledExam = editing
  const [scheduleTestModal, setScheduleTestModal] = useState<ScheduledExam | undefined | null>(null);

  const selectedClass = myClasses.find(c => c.id === selectedClassId);
  const classExams    = examItems.filter(e => e.classId === selectedClassId);

  const topicHomework = lessonDetail
    ? homeworkItems.filter(h => h.topicId === lessonDetail.topic.id && h.classId === selectedClassId)
    : [];

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

  const handleUpsertExam = (exam: ScheduledExam) => {
    setExamItems(prev => {
      const exists = prev.find(e => e.id === exam.id);
      return exists ? prev.map(e => e.id === exam.id ? exam : e) : [...prev, exam];
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-6 sm:p-8">
      <Blob color="#ddd6fe" size="xl" className="-top-20 -left-20" />
      <Blob color="#a7f3d0" size="lg" className="top-1/2 -right-10" delay animated />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative max-w-7xl mx-auto space-y-6"
      >
        {/* Page title */}
        <div>
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

        {/* ── Split layout: program | temat ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
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

          <div className="flex flex-col gap-6">
            <LessonDetailPanel
              topic={lessonDetail?.topic ?? null}
              status={lessonDetail?.status}
              engagement={lessonDetail?.engagement}
              cls={selectedClass}
              homeworkList={topicHomework}
              onClose={() => setLessonDetail(null)}
              onOpenAddMaterial={(type, topicId, topicName) =>
                setAddMaterialModal({ type, topicId, topicName })
              }
              onOpenAddHomework={(topicId, topicName) =>
                setAddHomeworkModal({ topicId, topicName })
              }
              onDeleteHomework={id =>
                setHomeworkItems(prev => prev.filter(h => h.id !== id))
              }
              onScheduleTest={() => setScheduleTestModal(undefined)}
            />
            <ScheduledExamsSection
              exams={classExams}
              onScheduleTest={() => setScheduleTestModal(undefined)}
              onEditExam={exam => setScheduleTestModal(exam)}
              onDeleteExam={id => setExamItems(prev => prev.filter(e => e.id !== id))}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
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

      <AnimatePresence>
        {addHomeworkModal && (
          <AddHomeworkModal
            topicId={addHomeworkModal.topicId}
            topicName={addHomeworkModal.topicName}
            classId={selectedClassId}
            onAdd={hw => setHomeworkItems(prev => [...prev, hw])}
            onClose={() => setAddHomeworkModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scheduleTestModal !== null && selectedClass && (
          <ScheduleTestModal
            classId={selectedClassId}
            className={`${selectedClass.name} — ${selectedClass.subject}`}
            initial={scheduleTestModal}
            onAdd={handleUpsertExam}
            onClose={() => setScheduleTestModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
