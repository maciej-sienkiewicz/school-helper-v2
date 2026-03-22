import type {
  Teacher, Class, CurriculumUnit, CurriculumTopic, TopicStatus,
  Recording, Note, SharedMaterial, GeneratedTest, ScheduleTemplate,
  Student, StudentLesson, StudentExam
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
  {
    id: 'r7', date: '2026-03-19T10:00:00',
    classId: 'c4', className: '7B', subject: 'Matematyka',
    durationSeconds: 2580, status: 'transcribing',
    isSharedNote: false, isSharedAudio: false,
    topicId: 'tp9', topicName: 'Funkcja kwadratowa',
    thumbnailColor: '#d1fae5',
  },
  {
    id: 'r8', date: '2026-03-20T08:00:00',
    classId: 'c2', className: '6B', subject: 'Matematyka',
    durationSeconds: 2880, status: 'raw',
    isSharedNote: false, isSharedAudio: false,
    topicId: 'tp6', topicName: 'Wzory skróconego mnożenia',
    thumbnailColor: '#ddd6fe',
  },
];

// ─── Notes ───────────────────────────────────────────────────────────────────

export const mockNotes: Note[] = [
  {
    id: 'n1', recordingId: 'r_old1',
    topicId: 'tp1', topicName: 'Liczby rzeczywiste – powtórzenie',
    content: `Liczby rzeczywiste – powtórzenie

Liczby rzeczywiste tworzą ciągłą oś liczbową i dzielą się na kilka rozłącznych zbiorów, które razem obejmują wszystkie wartości używane w matematyce szkolnej.

Podział liczb rzeczywistych

Liczby naturalne to liczby całkowite większe od zera: 1, 2, 3, 4, … Zbiór liczb naturalnych oznaczamy symbolem ℕ. Uwaga: 0 nie należy do liczb naturalnych w polskim systemie szkolnym.

Liczby całkowite obejmują liczby naturalne, zero oraz ich wartości ujemne: …, −3, −2, −1, 0, 1, 2, 3, … Oznaczenie: ℤ.

Liczby wymierne to liczby, które można zapisać w postaci ułamka p/q, gdzie p jest liczbą całkowitą, a q – naturalną niezerową. W rozwinięciu dziesiętnym są to liczby skończone lub nieskończone okresowe, np. 1/3 = 0,333…

Liczby niewymierne nie dają się zapisać jako ułamek. Ich rozwinięcie dziesiętne jest nieskończone i nieokresowe. Przykłady: √2 ≈ 1,41421…, π ≈ 3,14159…, e ≈ 2,71828…

Porównywanie i oś liczbowa

Na osi liczbowej liczby rosną w kierunku prawym. Liczba a jest większa od b, jeśli leży dalej na prawo. Dla ułamków: aby porównać p/q i r/s, sprowadzamy do wspólnego mianownika lub korzystamy z iloczynów krzyżowych.

Działania na ułamkach

Dodawanie i odejmowanie: sprowadzamy do wspólnego mianownika, dodajemy/odejmujemy liczniki. Mnożenie: mnożymy licznik przez licznik, mianownik przez mianownik. Dzielenie: mnożymy przez ułamek odwrotny.`,
    createdAt: '2026-03-01', status: 'accepted', sharedWithClasses: ['c1', 'c2'],
  },
  {
    id: 'n2', recordingId: 'r1',
    topicId: 'tp2', topicName: 'Potęgi i pierwiastki',
    content: `Potęgi i pierwiastki

Potęgowanie to skrócony zapis wielokrotnego mnożenia tej samej liczby przez siebie. Zrozumienie praw rządzących potęgami jest kluczowe dla całej algebry szkolnej.

Definicja potęgi

Dla liczby a (podstawy) i naturalnego wykładnika n: a^n = a · a · · · a (n czynników). Szczególne przypadki: a^1 = a, a^0 = 1 (dla a ≠ 0), a^(−n) = 1/a^n.

Prawa działań na potęgach

Mnożenie o tej samej podstawie: a^m · a^n = a^(m+n). Dzielenie: a^m / a^n = a^(m−n). Potęgowanie potęgi: (a^m)^n = a^(m·n). Potęga iloczynu: (a·b)^n = a^n · b^n. Potęga ilorazu: (a/b)^n = a^n / b^n.

Wykładniki ułamkowe i pierwiastki

Pierwiastek n-tego stopnia z a to liczba, której n-ta potęga równa się a. Zapis: ⁿ√a = a^(1/n). Przykłady: √9 = 9^(1/2) = 3, ∛8 = 8^(1/3) = 2. Ogólnie: a^(m/n) = ⁿ√(a^m) = (ⁿ√a)^m.

Upraszczanie wyrażeń

Podczas upraszczania korzystamy z praw potęg, łącząc wyrazy o tej samej podstawie. Ważne: prawa potęg dotyczą mnożenia i dzielenia, nie dodawania – a^m + a^n ≠ a^(m+n).`,
    createdAt: '2026-03-18', status: 'accepted', sharedWithClasses: ['c1'],
  },
  {
    id: 'n3', recordingId: 'r_old2',
    topicId: 'tp4', topicName: 'Wielomiany – dodawanie i odejmowanie',
    content: `Wielomiany – dodawanie i odejmowanie

Wielomian jest jednym z fundamentalnych obiektów algebry. Opanowanie operacji na wielomianach otwiera drogę do rozwiązywania równań wyższych stopni i analizy funkcji.

Definicja i budowa wielomianu

Wielomian jednej zmiennej x to wyrażenie postaci: W(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + … + a₁x + a₀, gdzie współczynniki aᵢ są liczbami rzeczywistymi, a aₙ ≠ 0. Liczba n nazywana jest stopniem wielomianu. Wyrazy o tym samym wykładniku zmiennej to wyrazy podobne.

Dodawanie wielomianów

Aby dodać dwa wielomiany, łączymy wyrazy podobne – dodajemy współczynniki przy tej samej potędze zmiennej. Przykład: (3x² − 2x + 1) + (x² + 5x − 3) = (3+1)x² + (−2+5)x + (1−3) = 4x² + 3x − 2.

Odejmowanie wielomianów

Odejmowanie sprowadza się do dodawania wielomianu przeciwnego. Zmieniamy znaki wszystkich wyrazów wielomianu odejmowanego, a następnie dodajemy. Przykład: (3x² − 2x + 1) − (x² + 5x − 3) = 3x² − 2x + 1 − x² − 5x + 3 = 2x² − 7x + 4.`,
    createdAt: '2026-03-10', status: 'draft', sharedWithClasses: [],
  },
  {
    id: 'n4', recordingId: 'r4',
    topicId: 'tp7', topicName: 'Pojęcie funkcji',
    content: `Pojęcie funkcji

Funkcja jest jednym z najważniejszych pojęć matematyki. Opisuje zależności między wielkościami i stanowi fundament analizy matematycznej, fizyki i informatyki.

Definicja funkcji

Funkcja f z dziedziny D do zbioru wartości Y to przyporządkowanie, które każdemu elementowi x ∈ D przypisuje dokładnie jeden element y ∈ Y. Piszemy y = f(x) i nazywamy y obrazem elementu x, a x – argumentem (lub przeciwobrazem y).

Dziedzina i zbiór wartości

Dziedzina D(f) to zbiór wszystkich argumentów, dla których funkcja jest określona. Zbiór wartości (przeciwdziedzina) to zbiór wszystkich możliwych wyników: {f(x) : x ∈ D(f)}.

Sposoby określania funkcji

Wzorem analitycznym: f(x) = 2x + 1. Tabelą wartości: podajemy pary (x, f(x)). Wykresem: zbiór punktów (x, f(x)) na układzie współrzędnych. Słownie: opisujemy regułę przyporządkowania.

Odczytywanie informacji z wykresu

Z wykresu możemy odczytać: wartość funkcji dla danego argumentu (rzut na oś Y), dziedzinę (rzut wykresu na oś X), zbiór wartości (rzut wykresu na oś Y), miejsca zerowe (punkty przecięcia z osią X) oraz monotoniczność (czy wykres rośnie czy maleje).`,
    createdAt: '2026-03-17', status: 'accepted', sharedWithClasses: ['c3'],
  },
  {
    id: 'n5', recordingId: 'r2',
    topicId: 'tp8', topicName: 'Funkcja liniowa',
    content: `Funkcja liniowa

Funkcja liniowa to najprostszy rodzaj funkcji opisujący proporcjonalne zależności między wielkościami. Jej wykres to prosta, co znacznie ułatwia analizę i interpretację geometryczną.

Postać ogólna i współczynniki

Funkcja liniowa ma postać f(x) = ax + b, gdzie a ≠ 0 (jeśli a = 0, otrzymujemy funkcję stałą). Współczynnik a nazywamy współczynnikiem kierunkowym – określa nachylenie prostej. Współczynnik b to wyraz wolny – wskazuje punkt przecięcia wykresu z osią Y (0, b).

Interpretacja współczynnika kierunkowego

Gdy a > 0: funkcja jest rosnąca (prosta nachylona w górę w prawo). Gdy a < 0: funkcja jest malejąca (prosta nachylona w dół w prawo). Im większa wartość |a|, tym strome nachylenie prostej. Geometrycznie a = tg α, gdzie α to kąt nachylenia prostej do osi X.

Miejsce zerowe

Miejsce zerowe to argument, dla którego f(x) = 0. Wyznaczamy je z równania: ax + b = 0, skąd x₀ = −b/a. Geometrycznie to punkt przecięcia prostej z osią X, o współrzędnych (−b/a, 0).

Rysowanie wykresu

Wystarczą dwa punkty. Najwygodniej wybrać x = 0 → (0, b) oraz x = −b/a → (−b/a, 0). Łączymy oba punkty prostą i zaznaczamy strzałki po obu stronach.`,
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

// ─── Student ──────────────────────────────────────────────────────────────────

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
    date: '2026-03-20',
    subject: 'Matematyka',
    topicName: 'Równania liniowe z jedną niewiadomą',
    unitName: 'Wyrażenia algebraiczne',
    teacherName: 'Anna Kowalska',
    className: '7A',
    durationMinutes: 45,
    noteId: 'n1',
    noteContent: `# Równania liniowe z jedną niewiadomą

## Definicja
Równanie liniowe to równanie postaci **ax + b = 0**, gdzie a ≠ 0.

## Metody rozwiązywania
1. Przenosimy wyrazy z niewiadomą na lewą stronę
2. Przenosimy liczby na prawą stronę
3. Dzielimy obie strony przez współczynnik przy x

## Przykłady
- 2x + 6 = 0 → x = –3
- 3x – 9 = 6 → x = 5
- 5x + 2 = 3x – 4 → 2x = –6 → x = –3

## Sprawdzanie rozwiązania
Zawsze wstawiamy wynik z powrotem do równania i sprawdzamy, czy obie strony są równe.`,
    recordingId: 'r3',
    recordingDurationSeconds: 2687,
    thumbnailColor: '#bae6fd',
    likes: 14,
    hasLiked: false,
    comments: [
      { id: 'sc1', studentName: 'anonim', text: 'Super notatka, wszystko jasne!', createdAt: '2026-03-20T14:30:00' },
      { id: 'sc2', studentName: 'anonim', text: 'Czy te przykłady będą na sprawdzianie?', createdAt: '2026-03-21T09:15:00' },
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
    id: 'se1',
    date: '2026-03-28',
    subject: 'Matematyka',
    topicNames: ['Równania liniowe', 'Układy równań', 'Nierówności'],
    scope: 'Dział: Wyrażenia algebraiczne (tematy 1–4)',
    className: '7A',
    teacherName: 'Anna Kowalska',
    durationMinutes: 45,
    room: '12',
    color: '#bae6fd',
  },
  {
    id: 'se2',
    date: '2026-04-08',
    subject: 'Matematyka',
    topicNames: ['Potęgi', 'Pierwiastki', 'Logarytmy'],
    scope: 'Dział: Liczby i działania (tematy 2–4)',
    className: '7A',
    teacherName: 'Anna Kowalska',
    durationMinutes: 45,
    room: '12',
    color: '#d1fae5',
  },
  {
    id: 'se3',
    date: '2026-04-24',
    subject: 'Matematyka',
    topicNames: ['Pola wielokątów', 'Twierdzenie Pitagorasa', 'Okrąg i koło'],
    scope: 'Dział: Geometria płaska (cały dział)',
    className: '7A',
    teacherName: 'Anna Kowalska',
    durationMinutes: 45,
    room: '7',
    color: '#fde68a',
  },
];
