import type { SharedMaterial, GeneratedTest } from '../../types';

export const mockSharedMaterials: SharedMaterial[] = [
  {
    id: 'sm1', type: 'note', grade: 6,
    topicName: 'Liczby rzeczywiste – powtórzenie', unitName: 'Liczby i działania',
    subject: 'Matematyka', sharedAt: '2026-03-01', sharedWithClasses: ['6A', '6B'],
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
    subject: 'Matematyka', sharedAt: '2026-03-18', sharedWithClasses: ['6A'],
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
    subject: 'Matematyka', sharedAt: '2026-03-17', sharedWithClasses: ['7A'],
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
    subject: 'Matematyka', sharedAt: '2026-03-18', sharedWithClasses: ['7A'],
    stats: {
      materialId: 'sm4', topicName: 'Funkcja liniowa',
      subject: 'Matematyka', sharedWithClasses: ['7A'],
      totalViews: 14, totalListens: 11, externalViews: 1, commentCount: 0, comments: [],
      classStats: [
        { classId: 'c3', className: '7A', totalStudents: 26, studentsOpened: 12, viewCount: 14, listenCount: 11 },
      ],
    },
  },
];

export const mockGeneratedTests: GeneratedTest[] = [
  {
    id: 'gt1',
    title: 'Sprawdzian: Liczby i wyrażenia algebraiczne',
    createdAt: '2026-03-15',
    config: {
      topicIds: ['tp1', 'tp2', 'tp4'],
      openCount: 2, singleChoiceCount: 3, singleChoiceOptions: 4,
      multipleChoiceCount: 2, multipleChoiceOptions: 4, matchingCount: 1,
    },
    questions: [
      { id: 'q1', type: 'open', points: 3, question: 'Wyjaśnij, czym różnią się liczby wymierne od niewymiernych. Podaj po dwa przykłady.' },
      { id: 'q2', type: 'open', points: 4, question: 'Uprość wyrażenie: (3a² - 2a + 1) + (a² + 5a - 3). Pokaż pełne działanie.' },
      { id: 'q3', type: 'single_choice', points: 1, question: 'Która z poniższych liczb jest niewymierna?', options: ['√4', '√9', '√7', '0,5'], correctAnswer: '√7' },
      { id: 'q4', type: 'single_choice', points: 1, question: 'Ile wynosi 2³ · 2⁻¹?', options: ['2', '4', '8', '16'], correctAnswer: '4' },
      { id: 'q5', type: 'single_choice', points: 1, question: 'Stopień wielomianu 4x³ - 2x + 7 wynosi:', options: ['1', '2', '3', '7'], correctAnswer: '3' },
      { id: 'q6', type: 'multiple_choice', points: 2, question: 'Które z poniższych wyrażeń są wielomianami?', options: ['x² + 3x - 1', '1/x + 2', '√x + 1', '5x³ - x'], correctAnswer: ['x² + 3x - 1', '5x³ - x'] },
      { id: 'q7', type: 'multiple_choice', points: 2, question: 'Zaznacz wszystkie prawdziwe stwierdzenia o potęgach:', options: ['a^m · a^n = a^(m+n)', 'a^m + a^n = a^(m+n)', '(a^m)^n = a^(mn)', 'a^0 = 0'], correctAnswer: ['a^m · a^n = a^(m+n)', '(a^m)^n = a^(mn)'] },
      {
        id: 'q8', type: 'matching', points: 3, question: 'Dopasuj pojęcia do definicji:',
        leftItems: ['Liczba naturalna', 'Liczba pierwsza', 'Liczba wymierna'],
        rightItems: ['Daje się zapisać jako p/q', 'Podzielna tylko przez 1 i siebie', 'Element zbioru {1, 2, 3, ...}'],
        correctPairs: {
          'Liczba naturalna': 'Element zbioru {1, 2, 3, ...}',
          'Liczba pierwsza': 'Podzielna tylko przez 1 i siebie',
          'Liczba wymierna': 'Daje się zapisać jako p/q',
        },
      },
    ],
  },
];

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
