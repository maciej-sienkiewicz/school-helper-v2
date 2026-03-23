import type { CurriculumUnit, CurriculumTopic, TopicStatus, ScheduleTemplate } from '../../types';

export const mockUnits: CurriculumUnit[] = [
  { id: 'u1', name: 'Liczby i działania', order: 1 },
  { id: 'u2', name: 'Wyrażenia algebraiczne', order: 2 },
  { id: 'u3', name: 'Funkcje', order: 3 },
  { id: 'u4', name: 'Geometria płaska', order: 4 },
  { id: 'u5', name: 'Statystyka i rachunek prawdopodobieństwa', order: 5 },
];

export const mockTopics: CurriculumTopic[] = [
  // Liczby i działania
  { id: 'tp1', unitId: 'u1', name: 'Liczby rzeczywiste – powtórzenie', order: 1 },
  { id: 'tp2', unitId: 'u1', name: 'Potęgi i pierwiastki', order: 2 },
  { id: 'tp3', unitId: 'u1', name: 'Logarytmy – wprowadzenie', order: 3 },
  // Wyrażenia algebraiczne
  { id: 'tp4', unitId: 'u2', name: 'Wielomiany – dodawanie i odejmowanie', order: 4 },
  { id: 'tp5', unitId: 'u2', name: 'Mnożenie wielomianów', order: 5 },
  { id: 'tp6', unitId: 'u2', name: 'Wzory skróconego mnożenia', order: 6 },
  // Funkcje
  { id: 'tp7', unitId: 'u3', name: 'Pojęcie funkcji', order: 7 },
  { id: 'tp8', unitId: 'u3', name: 'Funkcja liniowa', order: 8 },
  { id: 'tp9', unitId: 'u3', name: 'Funkcja kwadratowa', order: 9 },
  { id: 'tp10', unitId: 'u3', name: 'Przekształcenia wykresów funkcji', order: 10 },
  // Geometria
  { id: 'tp11', unitId: 'u4', name: 'Trójkąty i ich własności', order: 11 },
  { id: 'tp12', unitId: 'u4', name: 'Koła i okręgi', order: 12 },
  { id: 'tp13', unitId: 'u4', name: 'Pole i obwód figur płaskich', order: 13 },
  // Statystyka
  { id: 'tp14', unitId: 'u5', name: 'Średnia, mediana, dominanta', order: 14 },
  { id: 'tp15', unitId: 'u5', name: 'Diagramy i wykresy', order: 15 },
];

export const mockTopicStatuses: TopicStatus[] = [
  // 6A
  { topicId: 'tp1', classId: 'c1', completed: true, hasNote: true, noteId: 'n1', isShared: true, hasRecording: true },
  { topicId: 'tp2', classId: 'c1', completed: true, hasNote: true, noteId: 'n2', isShared: true, hasRecording: true },
  { topicId: 'tp3', classId: 'c1', completed: true, hasNote: false, isShared: false, hasRecording: true },
  { topicId: 'tp4', classId: 'c1', completed: true, hasNote: true, noteId: 'n3', isShared: false, hasRecording: false },
  { topicId: 'tp5', classId: 'c1', completed: false, hasNote: false, isShared: false, hasRecording: false },
  { topicId: 'tp6', classId: 'c1', completed: true, hasNote: true, noteId: 'n6', isShared: true, hasRecording: true },
  { topicId: 'tp7', classId: 'c1', completed: false, hasNote: false, isShared: false, hasRecording: false },
  { topicId: 'tp8', classId: 'c1', completed: false, hasNote: false, isShared: false, hasRecording: false },
  // 6B
  { topicId: 'tp1', classId: 'c2', completed: true, hasNote: true, noteId: 'n1', isShared: true, hasRecording: true },
  { topicId: 'tp2', classId: 'c2', completed: true, hasNote: false, isShared: false, hasRecording: false },
  { topicId: 'tp3', classId: 'c2', completed: false, hasNote: false, isShared: false, hasRecording: false },
  // 7A
  { topicId: 'tp7', classId: 'c3', completed: true, hasNote: true, noteId: 'n4', isShared: true, hasRecording: true },
  { topicId: 'tp8', classId: 'c3', completed: true, hasNote: true, noteId: 'n5', isShared: true, hasRecording: true },
  { topicId: 'tp9', classId: 'c3', completed: false, hasNote: false, isShared: false, hasRecording: false },
];

export const mockScheduleTemplates: ScheduleTemplate[] = [
  {
    id: 'st1',
    name: 'Matematyka – klasa 6 (SP)',
    description: 'Standardowy program dla klasy 6 szkoły podstawowej',
    subject: 'Matematyka', grade: 6, schoolType: 'primary', createdAt: '2026-01-10',
    units: [
      {
        id: 'stu1', name: 'Liczby i działania', order: 1,
        topics: [
          { id: 'stp1', name: 'Liczby rzeczywiste – powtórzenie', order: 1 },
          { id: 'stp2', name: 'Potęgi i pierwiastki', order: 2 },
          { id: 'stp3', name: 'Logarytmy – wprowadzenie', order: 3 },
        ],
      },
      {
        id: 'stu2', name: 'Wyrażenia algebraiczne', order: 2,
        topics: [
          { id: 'stp4', name: 'Wielomiany – dodawanie i odejmowanie', order: 1 },
          { id: 'stp5', name: 'Mnożenie wielomianów', order: 2 },
          { id: 'stp6', name: 'Wzory skróconego mnożenia', order: 3 },
        ],
      },
      {
        id: 'stu3', name: 'Geometria płaska', order: 3,
        topics: [
          { id: 'stp7', name: 'Trójkąty i ich własności', order: 1 },
          { id: 'stp8', name: 'Koła i okręgi', order: 2 },
          { id: 'stp9', name: 'Pole i obwód figur płaskich', order: 3 },
        ],
      },
    ],
  },
  {
    id: 'st2',
    name: 'Matematyka – klasa 7 (SP)',
    description: 'Program dla klasy 7, rozszerzony o funkcje',
    subject: 'Matematyka', grade: 7, schoolType: 'primary', createdAt: '2026-01-10',
    units: [
      {
        id: 'stu4', name: 'Funkcje', order: 1,
        topics: [
          { id: 'stp10', name: 'Pojęcie funkcji', order: 1 },
          { id: 'stp11', name: 'Funkcja liniowa', order: 2 },
          { id: 'stp12', name: 'Funkcja kwadratowa', order: 3 },
          { id: 'stp13', name: 'Przekształcenia wykresów funkcji', order: 4 },
        ],
      },
      {
        id: 'stu5', name: 'Statystyka', order: 2,
        topics: [
          { id: 'stp14', name: 'Średnia, mediana, dominanta', order: 1 },
          { id: 'stp15', name: 'Diagramy i wykresy', order: 2 },
        ],
      },
    ],
  },
  {
    id: 'st3',
    name: 'Fizyka – klasa 2 LO',
    description: 'Program fizyki dla klasy 2 liceum ogólnokształcącego',
    subject: 'Fizyka', grade: 2, schoolType: 'high', createdAt: '2026-01-15',
    units: [
      {
        id: 'stu6', name: 'Mechanika', order: 1,
        topics: [
          { id: 'stp16', name: 'Kinematyka – powtórzenie', order: 1 },
          { id: 'stp17', name: 'Dynamika Newtona', order: 2 },
          { id: 'stp18', name: 'Praca, moc i energia', order: 3 },
        ],
      },
      {
        id: 'stu7', name: 'Elektryczność i magnetyzm', order: 2,
        topics: [
          { id: 'stp19', name: 'Ładunek elektryczny i pole elektrostatyczne', order: 1 },
          { id: 'stp20', name: 'Prąd elektryczny i obwody', order: 2 },
          { id: 'stp21', name: 'Pole magnetyczne', order: 3 },
        ],
      },
    ],
  },
];
