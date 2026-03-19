import type {
  Teacher, Class, CurriculumUnit, CurriculumTopic, TopicStatus,
  Recording, Note, SharedMaterial, GeneratedTest, ScheduleTemplate
} from '../types';

// ─── Teacher ─────────────────────────────────────────────────────────────────

export const mockTeacher: Teacher = {
  id: 't1',
  name: 'Anna Kowalska',
  email: 'a.kowalska@szkola.pl',
  subjects: ['Matematyka', 'Fizyka'],
};

// ─── Classes ─────────────────────────────────────────────────────────────────

export const mockClasses: Class[] = [
  { id: 'c1', name: '6A', grade: 6, schoolType: 'primary', subject: 'Matematyka', studentCount: 24, color: '#e9d5ff' },
  { id: 'c2', name: '6B', grade: 6, schoolType: 'primary', subject: 'Matematyka', studentCount: 22, color: '#ddd6fe' },
  { id: 'c3', name: '7A', grade: 7, schoolType: 'primary', subject: 'Matematyka', studentCount: 26, color: '#bae6fd' },
  { id: 'c4', name: '7B', grade: 7, schoolType: 'primary', subject: 'Matematyka', studentCount: 23, color: '#d1fae5' },
  { id: 'c5', name: '8A', grade: 8, schoolType: 'primary', subject: 'Matematyka', studentCount: 25, color: '#fde68a' },
  { id: 'c6', name: '2LOA', grade: 2, schoolType: 'high', subject: 'Matematyka', studentCount: 30, color: '#fecdd3' },
  { id: 'c7', name: '2LOA', grade: 2, schoolType: 'high', subject: 'Fizyka', studentCount: 30, color: '#a7f3d0' },
];

// ─── Curriculum ──────────────────────────────────────────────────────────────

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
  { topicId: 'tp6', classId: 'c1', completed: false, hasNote: false, isShared: false, hasRecording: false },
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

// ─── Recordings ──────────────────────────────────────────────────────────────

export const mockRecordings: Recording[] = [
  {
    id: 'r1', date: '2026-03-18T09:00:00',
    classId: 'c1', className: '6A', subject: 'Matematyka',
    durationSeconds: 2760, status: 'has_note', noteId: 'n2',
    isSharedNote: true, isSharedAudio: false,
    topicId: 'tp2', topicName: 'Potęgi i pierwiastki',
    thumbnailColor: '#e9d5ff',
  },
  {
    id: 'r2', date: '2026-03-18T11:00:00',
    classId: 'c3', className: '7A', subject: 'Matematyka',
    durationSeconds: 2460, status: 'has_note', noteId: 'n5',
    isSharedNote: true, isSharedAudio: true,
    topicId: 'tp8', topicName: 'Funkcja liniowa',
    thumbnailColor: '#bae6fd',
  },
  {
    id: 'r3', date: '2026-03-17T09:00:00',
    classId: 'c1', className: '6A', subject: 'Matematyka',
    durationSeconds: 2940, status: 'transcribed',
    isSharedNote: false, isSharedAudio: false,
    topicId: 'tp3', topicName: 'Logarytmy – wprowadzenie',
    thumbnailColor: '#fde68a',
  },
  {
    id: 'r4', date: '2026-03-17T11:00:00',
    classId: 'c3', className: '7A', subject: 'Matematyka',
    durationSeconds: 1980, status: 'has_note', noteId: 'n4',
    isSharedNote: true, isSharedAudio: false,
    topicId: 'tp7', topicName: 'Pojęcie funkcji',
    thumbnailColor: '#d1fae5',
  },
  {
    id: 'r5', date: '2026-03-16T09:00:00',
    classId: 'c5', className: '8A', subject: 'Matematyka',
    durationSeconds: 3000, status: 'raw',
    isSharedNote: false, isSharedAudio: false,
    thumbnailColor: '#fecdd3',
  },
  {
    id: 'r6', date: '2026-03-15T09:00:00',
    classId: 'c6', className: '2LOA', subject: 'Matematyka',
    durationSeconds: 2700, status: 'rejected',
    isSharedNote: false, isSharedAudio: false,
    thumbnailColor: '#fde68a',
  },
];

// ─── Notes ───────────────────────────────────────────────────────────────────

export const mockNotes: Note[] = [
  {
    id: 'n1', recordingId: 'r_old1',
    topicId: 'tp1', topicName: 'Liczby rzeczywiste – powtórzenie',
    summary: 'Powtórzenie liczb rzeczywistych: naturalne, całkowite, wymierne, niewymierne. Omówienie osi liczbowej i porównywania liczb. Przykłady działań na ułamkach.',
    concepts: [
      { term: 'Liczby naturalne', definition: 'Liczby całkowite większe od zera: 1, 2, 3, ...' },
      { term: 'Liczby wymierne', definition: 'Liczby dające się zapisać jako ułamek p/q, gdzie q≠0' },
      { term: 'Liczby niewymierne', definition: 'Liczby, których nie można zapisać w postaci ułamka, np. √2, π' },
    ],
    createdAt: '2026-03-01', status: 'accepted', sharedWithClasses: ['c1', 'c2'],
  },
  {
    id: 'n2', recordingId: 'r1',
    topicId: 'tp2', topicName: 'Potęgi i pierwiastki',
    summary: 'Potęgi o wykładniku całkowitym i ułamkowym. Prawa działań na potęgach. Pierwiastki jako potęgi ułamkowe. Upraszczanie wyrażeń z potęgami.',
    concepts: [
      { term: 'Potęga', definition: 'a^n = a · a · ... · a (n razy)' },
      { term: 'Pierwiastek', definition: '∜a = a^(1/n), np. √9 = 3' },
      { term: 'Prawa potęg', definition: 'a^m · a^n = a^(m+n), (a^m)^n = a^(m·n)' },
    ],
    createdAt: '2026-03-18', status: 'accepted', sharedWithClasses: ['c1'],
  },
  {
    id: 'n3', recordingId: 'r_old2',
    topicId: 'tp4', topicName: 'Wielomiany – dodawanie i odejmowanie',
    summary: 'Pojęcie wielomianu, stopień wielomianu, współczynniki. Dodawanie i odejmowanie wielomianów przez łączenie wyrazów podobnych.',
    concepts: [
      { term: 'Wielomian', definition: 'Wyrażenie postaci a_n·x^n + ... + a_1·x + a_0' },
      { term: 'Wyrazy podobne', definition: 'Wyrazy o tej samej potędze zmiennej' },
    ],
    createdAt: '2026-03-10', status: 'draft', sharedWithClasses: [],
  },
  {
    id: 'n4', recordingId: 'r4',
    topicId: 'tp7', topicName: 'Pojęcie funkcji',
    summary: 'Funkcja jako przyporządkowanie. Dziedzina i zbiór wartości. Sposoby określania funkcji: wzorem, tabelą, wykresem. Odczytywanie informacji z wykresu.',
    concepts: [
      { term: 'Funkcja', definition: 'Przyporządkowanie każdemu elementowi dziedziny dokładnie jednego elementu zbioru wartości' },
      { term: 'Dziedzina', definition: 'Zbiór argumentów (wartości x), dla których funkcja jest określona' },
      { term: 'Wykres funkcji', definition: 'Zbiór punktów (x, f(x)) na układzie współrzędnych' },
    ],
    createdAt: '2026-03-17', status: 'accepted', sharedWithClasses: ['c3'],
  },
  {
    id: 'n5', recordingId: 'r2',
    topicId: 'tp8', topicName: 'Funkcja liniowa',
    summary: 'Funkcja liniowa f(x) = ax + b. Interpretacja współczynników a (nachylenie) i b (wyraz wolny). Rysowanie wykresu, wyznaczanie miejsc zerowych i przecięcia z osią Y.',
    concepts: [
      { term: 'Funkcja liniowa', definition: 'f(x) = ax + b, gdzie a ≠ 0' },
      { term: 'Współczynnik kierunkowy', definition: 'Liczba a – określa nachylenie prostej' },
      { term: 'Miejsce zerowe', definition: 'Punkt, w którym f(x) = 0, czyli x₀ = -b/a' },
    ],
    createdAt: '2026-03-18', status: 'accepted', sharedWithClasses: ['c3'],
  },
];

// ─── Shared Materials ─────────────────────────────────────────────────────────

export const mockSharedMaterials: SharedMaterial[] = [
  {
    id: 'sm1', type: 'note', grade: 6,
    topicName: 'Liczby rzeczywiste – powtórzenie', unitName: 'Liczby i działania',
    subject: 'Matematyka', sharedAt: '2026-03-01',
    sharedWithClasses: ['6A', '6B'],
    stats: {
      materialId: 'sm1', topicName: 'Liczby rzeczywiste – powtórzenie',
      subject: 'Matematyka', sharedWithClasses: ['6A', '6B'],
      totalViews: 87, totalListens: 0, externalViews: 3, commentCount: 4,
      comments: [
        { id: 'cm1', studentName: 'Kacper M.', className: '6A', text: 'Super wyjaśnienie! Teraz rozumiem różnicę.', createdAt: '2026-03-02' },
        { id: 'cm2', studentName: 'Zofia T.', className: '6B', text: 'Czy liczba 0 jest naturalna?', createdAt: '2026-03-03' },
        { id: 'cm3', studentName: 'Michał P.', className: '6A', text: 'Bardzo przejrzysta notatka 👍', createdAt: '2026-03-04' },
        { id: 'cm4', studentName: 'Ala W.', className: '6B', text: 'Dziękuję, pomogło przed kartkówką!', createdAt: '2026-03-05' },
      ],
      classStats: [
        { classId: 'c1', className: '6A', totalStudents: 24, studentsOpened: 21, viewCount: 47, listenCount: 0 },
        { classId: 'c2', className: '6B', totalStudents: 22, studentsOpened: 18, viewCount: 40, listenCount: 0 },
      ],
    },
  },
  {
    id: 'sm2', type: 'both', grade: 6,
    topicName: 'Potęgi i pierwiastki', unitName: 'Liczby i działania',
    subject: 'Matematyka', sharedAt: '2026-03-18',
    sharedWithClasses: ['6A'],
    stats: {
      materialId: 'sm2', topicName: 'Potęgi i pierwiastki',
      subject: 'Matematyka', sharedWithClasses: ['6A'],
      totalViews: 12, totalListens: 8, externalViews: 0, commentCount: 1,
      comments: [
        { id: 'cm5', studentName: 'Natalia K.', className: '6A', text: 'Mogę dostać wzornik do pobrania?', createdAt: '2026-03-18' },
      ],
      classStats: [
        { classId: 'c1', className: '6A', totalStudents: 24, studentsOpened: 10, viewCount: 12, listenCount: 8 },
      ],
    },
  },
  {
    id: 'sm3', type: 'note', grade: 7,
    topicName: 'Pojęcie funkcji', unitName: 'Funkcje',
    subject: 'Matematyka', sharedAt: '2026-03-17',
    sharedWithClasses: ['7A'],
    stats: {
      materialId: 'sm3', topicName: 'Pojęcie funkcji',
      subject: 'Matematyka', sharedWithClasses: ['7A'],
      totalViews: 19, totalListens: 0, externalViews: 0, commentCount: 2,
      comments: [
        { id: 'cm6', studentName: 'Tomek R.', className: '7A', text: 'Kiedy test z funkcji?', createdAt: '2026-03-17' },
        { id: 'cm7', studentName: 'Maja S.', className: '7A', text: 'Notatka super!', createdAt: '2026-03-18' },
      ],
      classStats: [
        { classId: 'c3', className: '7A', totalStudents: 26, studentsOpened: 17, viewCount: 19, listenCount: 0 },
      ],
    },
  },
  {
    id: 'sm4', type: 'both', grade: 7,
    topicName: 'Funkcja liniowa', unitName: 'Funkcje',
    subject: 'Matematyka', sharedAt: '2026-03-18',
    sharedWithClasses: ['7A'],
    stats: {
      materialId: 'sm4', topicName: 'Funkcja liniowa',
      subject: 'Matematyka', sharedWithClasses: ['7A'],
      totalViews: 14, totalListens: 11, externalViews: 1, commentCount: 0,
      comments: [],
      classStats: [
        { classId: 'c3', className: '7A', totalStudents: 26, studentsOpened: 12, viewCount: 14, listenCount: 11 },
      ],
    },
  },
];

// ─── Schedule Templates ───────────────────────────────────────────────────────

export const mockScheduleTemplates: ScheduleTemplate[] = [
  {
    id: 'st1',
    name: 'Matematyka – klasa 6 (SP)',
    description: 'Standardowy program dla klasy 6 szkoły podstawowej',
    subject: 'Matematyka',
    grade: 6,
    schoolType: 'primary',
    createdAt: '2026-01-10',
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
    subject: 'Matematyka',
    grade: 7,
    schoolType: 'primary',
    createdAt: '2026-01-10',
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
    subject: 'Fizyka',
    grade: 2,
    schoolType: 'high',
    createdAt: '2026-01-15',
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

// ─── Generated Tests ─────────────────────────────────────────────────────────

export const mockGeneratedTests: GeneratedTest[] = [
  {
    id: 'gt1',
    title: 'Sprawdzian: Liczby i wyrażenia algebraiczne',
    createdAt: '2026-03-15',
    config: {
      topicIds: ['tp1', 'tp2', 'tp4'],
      openCount: 2,
      singleChoiceCount: 3, singleChoiceOptions: 4,
      multipleChoiceCount: 2, multipleChoiceOptions: 4,
      matchingCount: 1,
    },
    questions: [
      {
        id: 'q1', type: 'open', points: 3,
        question: 'Wyjaśnij, czym różnią się liczby wymierne od niewymiernych. Podaj po dwa przykłady.',
      },
      {
        id: 'q2', type: 'open', points: 4,
        question: 'Uprość wyrażenie: (3a² - 2a + 1) + (a² + 5a - 3). Pokaż pełne działanie.',
      },
      {
        id: 'q3', type: 'single_choice', points: 1,
        question: 'Która z poniższych liczb jest niewymierna?',
        options: ['√4', '√9', '√7', '0,5'],
        correctAnswer: '√7',
      },
      {
        id: 'q4', type: 'single_choice', points: 1,
        question: 'Ile wynosi 2³ · 2⁻¹?',
        options: ['2', '4', '8', '16'],
        correctAnswer: '4',
      },
      {
        id: 'q5', type: 'single_choice', points: 1,
        question: 'Stopień wielomianu 4x³ - 2x + 7 wynosi:',
        options: ['1', '2', '3', '7'],
        correctAnswer: '3',
      },
      {
        id: 'q6', type: 'multiple_choice', points: 2,
        question: 'Które z poniższych wyrażeń są wielomianami?',
        options: ['x² + 3x - 1', '1/x + 2', '√x + 1', '5x³ - x'],
        correctAnswer: ['x² + 3x - 1', '5x³ - x'],
      },
      {
        id: 'q7', type: 'multiple_choice', points: 2,
        question: 'Zaznacz wszystkie prawdziwe stwierdzenia o potęgach:',
        options: ['a^m · a^n = a^(m+n)', 'a^m + a^n = a^(m+n)', '(a^m)^n = a^(mn)', 'a^0 = 0'],
        correctAnswer: ['a^m · a^n = a^(m+n)', '(a^m)^n = a^(mn)'],
      },
      {
        id: 'q8', type: 'matching', points: 3,
        question: 'Dopasuj pojęcia do definicji:',
        leftItems: ['Liczba naturalna', 'Liczba pierwsza', 'Liczba wymierna'],
        rightItems: [
          'Daje się zapisać jako p/q',
          'Podzielna tylko przez 1 i siebie',
          'Element zbioru {1, 2, 3, ...}',
        ],
        correctPairs: {
          'Liczba naturalna': 'Element zbioru {1, 2, 3, ...}',
          'Liczba pierwsza': 'Podzielna tylko przez 1 i siebie',
          'Liczba wymierna': 'Daje się zapisać jako p/q',
        },
      },
    ],
  },
];

// ─── Today's classes helper ───────────────────────────────────────────────────

export const todayClasses = [
  { className: '6A', subject: 'Matematyka', time: '08:00', room: '12' },
  { className: '7A', subject: 'Matematyka', time: '10:00', room: '12' },
  { className: '8A', subject: 'Matematyka', time: '12:00', room: '7' },
];

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
