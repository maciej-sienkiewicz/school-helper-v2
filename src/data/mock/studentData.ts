import type { Student, StudentLesson, StudentExam, StudentHomework, ExternalMaterial } from '../../types';

export const mockStudent: Student = {
  id: 's1',
  name: 'Kacper Wiśniewski',
  email: 'k.wisniewski@szkola.pl',
  className: '7A',
  classId: 'c3',
  grade: 7,
  schoolType: 'primary',
};

export const mockStudentLessons: StudentLesson[] = [
  {
    id: 'sl1',
    date: '2026-03-23',
    subject: 'Matematyka',
    topicName: 'Wzory Skróconego Mnożenia',
    unitName: 'Wyrażenia algebraiczne',
    teacherName: 'Anna Kowalska',
    className: '7A',
    durationMinutes: 45,
    topicId: 'tp6',
    noteId: 'n6',
    recordingId: 'r8',
    recordingDurationSeconds: 2880,
    thumbnailColor: '#ddd6fe',
    likes: 21,
    hasLiked: false,
    comments: [
      { id: 'sc1', studentName: 'anonim', text: 'Notatka naprawdę pomogła przed klasówką!', createdAt: '2026-03-23T14:30:00' },
      { id: 'sc2', studentName: 'anonim', text: 'Super przykład z działką budowlaną 😄', createdAt: '2026-03-23T16:10:00' },
    ],
  },
  {
    id: 'sl2',
    date: '2026-03-18',
    subject: 'Matematyka',
    topicName: 'Potęgi – własności i zastosowania',
    unitName: 'Liczby i działania',
    teacherName: 'Anna Kowalska',
    className: '7A',
    durationMinutes: 45,
    topicId: 'tp2',
    noteId: 'n2',
    noteContent: `# Potęgi – własności i zastosowania

## Definicja
Potęga a^n = a × a × ... × a (n razy), gdzie a to podstawa, n to wykładnik.

## Własności potęg
- a^m · a^n = a^(m+n)
- a^m / a^n = a^(m−n)
- (a^m)^n = a^(m·n)
- (a·b)^n = a^n · b^n
- a^0 = 1 (dla a ≠ 0)
- a^(−n) = 1/a^n

## Przykłady
- 2^3 · 2^4 = 2^7 = 128
- 3^5 / 3^2 = 3^3 = 27
- (2^3)^2 = 2^6 = 64`,
    recordingId: 'r4',
    recordingDurationSeconds: 2340,
    thumbnailColor: '#d1fae5',
    likes: 9,
    hasLiked: true,
    comments: [
      { id: 'sc3', studentName: 'anonim', text: 'Dzięki, bardzo pomocne!', createdAt: '2026-03-18T16:00:00', isOwn: true },
    ],
  },
  {
    id: 'sl3',
    date: '2026-03-14',
    subject: 'Matematyka',
    topicName: 'Ułamki – dodawanie i odejmowanie',
    unitName: 'Liczby i działania',
    teacherName: 'Anna Kowalska',
    className: '7A',
    durationMinutes: 45,
    topicId: 'tp1',
    noteId: 'n3',
    noteContent: `# Ułamki – dodawanie i odejmowanie

## Ułamki zwykłe
Aby dodać lub odjąć ułamki, trzeba sprowadzić je do **wspólnego mianownika**.

## NWW (Najmniejsza Wspólna Wielokrotność)
Znajdź NWW mianowników, rozszerz ułamki, a następnie dodaj/odejmij liczniki.

## Przykłady
- 1/3 + 1/4 = 4/12 + 3/12 = 7/12
- 5/6 – 1/4 = 10/12 – 3/12 = 7/12`,
    thumbnailColor: '#fde68a',
    likes: 5,
    hasLiked: false,
    comments: [],
  },
  {
    id: 'sl4',
    date: '2026-03-11',
    subject: 'Matematyka',
    topicName: 'Geometria – pola wielokątów',
    unitName: 'Geometria płaska',
    teacherName: 'Anna Kowalska',
    className: '7A',
    durationMinutes: 45,
    topicId: 'tp13',
    thumbnailColor: '#fecdd3',
    likes: 7,
    hasLiked: false,
    comments: [
      { id: 'sc4', studentName: 'anonim', text: 'Kiedy będzie notatka do tej lekcji?', createdAt: '2026-03-12T10:00:00' },
    ],
  },
  {
    id: 'sl5',
    date: '2026-03-07',
    subject: 'Matematyka',
    topicName: 'Proporcje i procenty',
    unitName: 'Liczby i działania',
    teacherName: 'Anna Kowalska',
    className: '7A',
    durationMinutes: 45,
    topicId: 'tp3',
    noteId: 'n5',
    noteContent: `# Proporcje i procenty

## Procent
1% = 1/100 = 0,01

## Obliczanie procentu z liczby
p% z liczby n = (p × n) / 100

## Podwyżka i obniżka
- Podwyżka o p%: nowa wartość = n × (1 + p/100)
- Obniżka o p%: nowa wartość = n × (1 – p/100)

## Przykłady
- 20% z 350 = 70
- Podwyżka o 15%: 200 × 1,15 = 230`,
    thumbnailColor: '#e9d5ff',
    likes: 12,
    hasLiked: false,
    comments: [],
  },
];

export const mockStudentExams: StudentExam[] = [
  {
    id: 'se1', date: '2026-03-28', subject: 'Matematyka',
    topicNames: ['Równania liniowe', 'Układy równań', 'Nierówności'],
    scope: 'Dział: Wyrażenia algebraiczne (tematy 1–4)',
    className: '7A', teacherName: 'Anna Kowalska', durationMinutes: 45, room: '12', color: '#bae6fd',
  },
  {
    id: 'se2', date: '2026-04-08', subject: 'Matematyka',
    topicNames: ['Potęgi', 'Pierwiastki', 'Logarytmy'],
    scope: 'Dział: Liczby i działania (tematy 2–4)',
    className: '7A', teacherName: 'Anna Kowalska', durationMinutes: 45, room: '12', color: '#d1fae5',
  },
  {
    id: 'se3', date: '2026-04-24', subject: 'Matematyka',
    topicNames: ['Pola wielokątów', 'Twierdzenie Pitagorasa', 'Okrąg i koło'],
    scope: 'Dział: Geometria płaska (cały dział)',
    className: '7A', teacherName: 'Anna Kowalska', durationMinutes: 45, room: '7', color: '#fde68a',
  },
];

export const mockStudentHomework: StudentHomework[] = [
  {
    id: 'sh1', subject: 'Matematyka', title: 'Zadania z równań liniowych',
    description: 'Rozwiąż zadania 1–10 ze str. 78 podręcznika. Pokaż wszystkie kroki rozwiązania.',
    dueDate: '2026-03-25', isExtra: false, done: false, lessonId: 'sl1',
  },
  {
    id: 'sh2', subject: 'Matematyka', title: 'Układy równań – utrwalenie',
    description: 'Rozwiąż układy równań metodą podstawiania: zestaw A (6 zadań) z karty pracy.',
    dueDate: '2026-03-27', isExtra: false, done: true,
  },
  {
    id: 'sh3', subject: 'Matematyka', title: 'Zadania dodatkowe – potęgi',
    description: 'Dla chętnych: zadania konkursowe ze zbioru (str. 45, zad. 12–16). Oceniane plusem.',
    dueDate: '2026-04-04', isExtra: true, done: false, lessonId: 'sl2', attachmentNote: 'n2',
  },
  {
    id: 'sh4', subject: 'Matematyka', title: 'Projekt: statystyka w życiu codziennym',
    description: 'Zbierz dane (np. temperatury tygodniowe) i przedstaw je na wykresie. Opisz średnią i medianę. Min. 1 strona A4.',
    dueDate: '2026-04-15', isExtra: true, done: false,
  },
];

export const mockExternalMaterials: ExternalMaterial[] = [
  {
    id: 'em1', subject: 'Matematyka',
    topicName: 'Równania liniowe z jedną niewiadomą', unitName: 'Wyrażenia algebraiczne',
    type: 'both', scope: 'voivodeship',
    schoolName: 'SP nr 14 im. M. Kopernika', city: 'Kraków',
    teacherInitials: 'M.W.', teacherName: 'Marta Wiśniewska',
    sharedAt: '2026-03-10', likes: 142, views: 1240,
    comments: [
      { id: 'c1a', text: 'Super notatka, bardzo mi pomogła przed klasówką!', timestamp: '2026-03-11T10:20:00Z' },
      { id: 'c1b', text: 'Czy są ćwiczenia z odpowiedziami?', timestamp: '2026-03-12T14:05:00Z' },
      { id: 'c1c', text: 'Nagranie jest świetne, tłumaczy krok po kroku.', timestamp: '2026-03-13T09:00:00Z' },
    ],
    noteContent: `# Równania liniowe – notatka alternatywna\n\n## Schemat rozwiązania krok po kroku\n\n1. **Przenieś niewiadome** na lewą stronę równania\n2. **Przenieś liczby** na prawą stronę\n3. **Uproszcz** obie strony\n4. **Podziel** przez współczynnik przy x\n\n## Typowe błędy uczniów\n- Zapominanie o zmianie znaku przy przenoszeniu\n- Dzielenie tylko jednej strony\n- Błędy przy ułamkach jako współczynnikach\n\n## Ćwiczenia sprawdzające\n- 4x – 8 = 0 → x = 2\n- 7 – 2x = x + 1 → x = 2\n- (x+3)/2 = 5 → x = 7`,
    recordingDurationSeconds: 3120, thumbnailColor: '#bae6fd',
  },
  {
    id: 'em2', subject: 'Matematyka',
    topicName: 'Potęgi – mnożenie i dzielenie', unitName: 'Liczby i działania',
    type: 'note', scope: 'county',
    schoolName: 'SP nr 3', city: 'Wieliczka',
    teacherInitials: 'K.N.', teacherName: 'Krzysztof Nowak',
    sharedAt: '2026-03-05', likes: 67, views: 534,
    comments: [{ id: 'c2a', text: 'Bardzo przejrzyste zestawienie reguł!', timestamp: '2026-03-06T08:30:00Z' }],
    noteContent: `# Potęgi – mnożenie i dzielenie\n\n## Reguła mnożenia potęg o tej samej podstawie\na^m · a^n = a^(m+n)\n\nPrzykład: 3^4 · 3^2 = 3^6 = 729\n\n## Reguła dzielenia potęg o tej samej podstawie\na^m / a^n = a^(m-n)\n\nPrzykład: 5^7 / 5^3 = 5^4 = 625\n\n## Potęgowanie potęgi\n(a^m)^n = a^(m·n)\n\nPrzykład: (2^3)^4 = 2^12 = 4096`,
    thumbnailColor: '#d1fae5',
  },
  {
    id: 'em3', subject: 'Matematyka',
    topicName: 'Geometria – pola figur płaskich', unitName: 'Geometria płaska',
    type: 'recording', scope: 'all',
    schoolName: 'SP im. Jana Pawła II', city: 'Nowy Sącz',
    teacherInitials: 'B.K.', teacherName: 'Beata Kowalczyk',
    sharedAt: '2026-02-20', likes: 389, views: 4710,
    comments: [
      { id: 'c3a', text: 'Najlepsze nagranie z geometrii jakie widziałem/am!', timestamp: '2026-02-21T11:00:00Z' },
      { id: 'c3b', text: 'Pani świetnie tłumaczy, szkoda że nie mamy takiej nauczycielki.', timestamp: '2026-02-25T16:45:00Z' },
      { id: 'c3c', text: 'Pomogło mi na egzaminie próbnym 😊', timestamp: '2026-03-01T20:10:00Z' },
      { id: 'c3d', text: 'Czy jest też nagranie o bryłach?', timestamp: '2026-03-10T12:20:00Z' },
    ],
    recordingDurationSeconds: 2580, thumbnailColor: '#fde68a',
  },
  {
    id: 'em4', subject: 'Matematyka',
    topicName: 'Proporcje i procenty – zastosowania', unitName: 'Liczby i działania',
    type: 'both', scope: 'school',
    schoolName: 'SP nr 8', city: 'Warszawa',
    teacherInitials: 'A.B.', teacherName: 'Anna Brzezińska',
    sharedAt: '2026-03-15', likes: 28, views: 211, comments: [],
    noteContent: `# Procenty w życiu codziennym\n\n## Gdzie używamy procentów?\n- Podatki (VAT 23%)\n- Rabaty w sklepach\n- Odsetki bankowe\n- Statystyki\n\n## Jak liczyć rabat?\nCena po rabacie = cena × (1 – rabat/100)\nPrzykład: 200 zł przy 15% rabacie = 200 × 0,85 = 170 zł`,
    recordingDurationSeconds: 1890, thumbnailColor: '#e9d5ff',
  },
  {
    id: 'em5', subject: 'Matematyka',
    topicName: 'Układy równań – metoda podstawiania', unitName: 'Wyrażenia algebraiczne',
    type: 'note', scope: 'all',
    schoolName: 'ZSP nr 2', city: 'Gdańsk',
    teacherInitials: 'P.M.', teacherName: 'Piotr Mazur',
    sharedAt: '2026-03-18', likes: 201, views: 2890,
    comments: [
      { id: 'c5a', text: 'Nareszcie ktoś to dobrze wyjaśnił!', timestamp: '2026-03-19T09:15:00Z' },
      { id: 'c5b', text: 'Mam pytanie – czy ta metoda działa też dla 3 równań?', timestamp: '2026-03-20T14:30:00Z' },
    ],
    noteContent: `# Układy równań – metoda podstawiania\n\n## Kroki metody podstawiania\n1. Z jednego równania wyraź jedną zmienną\n2. Podstaw do drugiego równania\n3. Rozwiąż równanie z jedną niewiadomą\n4. Wyznacz drugą zmienną\n\n## Przykład\nx + y = 10\n2x – y = 5\n\nZ pierwszego: y = 10 – x\nPodstawiamy: 2x – (10 – x) = 5 → 3x = 15 → x = 5\ny = 10 – 5 = 5`,
    thumbnailColor: '#fecaca',
  },
  {
    id: 'em6', subject: 'Matematyka',
    topicName: 'Twierdzenie Pitagorasa – zadania', unitName: 'Geometria płaska',
    type: 'both', scope: 'voivodeship',
    schoolName: 'SP nr 21', city: 'Wrocław',
    teacherInitials: 'J.K.', teacherName: 'Joanna Kamińska',
    sharedAt: '2026-03-12', likes: 178, views: 1620,
    comments: [{ id: 'c6a', text: 'Zadania z rozwiązaniami – to jest dokładnie to czego szukałam!', timestamp: '2026-03-13T17:00:00Z' }],
    noteContent: `# Twierdzenie Pitagorasa\n\n## Wzór\na² + b² = c²\ngdzie c to przeciwprostokątna\n\n## Zadanie 1\nKatety: a = 3, b = 4. Oblicz c.\nc = √(9 + 16) = √25 = 5\n\n## Zadanie 2\nPrzeciwprostokątna c = 13, kateta a = 5. Oblicz b.\nb = √(169 – 25) = √144 = 12\n\n## Trójkąty pitagorejskie\n- 3, 4, 5\n- 5, 12, 13\n- 8, 15, 17`,
    recordingDurationSeconds: 2100, thumbnailColor: '#a7f3d0',
  },
  {
    id: 'em7', subject: 'Matematyka',
    topicName: 'Statystyka – średnia, mediana, dominanta', unitName: 'Statystyka i prawdopodobieństwo',
    type: 'recording', scope: 'county',
    schoolName: 'SP nr 5 im. T. Kościuszki', city: 'Oświęcim',
    teacherInitials: 'E.W.', teacherName: 'Ewa Wróbel',
    sharedAt: '2026-03-08', likes: 93, views: 870,
    comments: [
      { id: 'c7a', text: 'Różnica między medianą a średnią w końcu zrozumiała!', timestamp: '2026-03-09T10:30:00Z' },
      { id: 'c7b', text: 'Fajnie wytłumaczone na przykładach z życia.', timestamp: '2026-03-10T19:45:00Z' },
    ],
    recordingDurationSeconds: 1740, thumbnailColor: '#c7d2fe',
  },
];
