import type { Recording, Note } from '../../types';
import { WZORY_SKROCONEGO_MNOZENIA_HTML } from '../sampleNoteHtml';

export const mockRecordings: Recording[] = [
  {
    id: 'r1', date: '2026-03-18T09:00:00',
    classId: 'c1', className: '6A', subject: 'Matematyka',
    durationSeconds: 2760, status: 'has_note', noteId: 'n2',
    isSharedNote: true, isSharedAudio: false,
    topicId: 'tp2', topicName: 'Potęgi i pierwiastki', thumbnailColor: '#e9d5ff',
  },
  {
    id: 'r2', date: '2026-03-18T11:00:00',
    classId: 'c3', className: '7A', subject: 'Matematyka',
    durationSeconds: 2460, status: 'has_note', noteId: 'n5',
    isSharedNote: true, isSharedAudio: true,
    topicId: 'tp8', topicName: 'Funkcja liniowa', thumbnailColor: '#bae6fd',
  },
  {
    id: 'r3', date: '2026-03-17T09:00:00',
    classId: 'c1', className: '6A', subject: 'Matematyka',
    durationSeconds: 2940, status: 'transcribed',
    isSharedNote: false, isSharedAudio: false,
    topicId: 'tp3', topicName: 'Logarytmy – wprowadzenie', thumbnailColor: '#fde68a',
  },
  {
    id: 'r4', date: '2026-03-17T11:00:00',
    classId: 'c3', className: '7A', subject: 'Matematyka',
    durationSeconds: 1980, status: 'has_note', noteId: 'n4',
    isSharedNote: true, isSharedAudio: false,
    topicId: 'tp7', topicName: 'Pojęcie funkcji', thumbnailColor: '#d1fae5',
  },
  {
    id: 'r5', date: '2026-03-16T09:00:00',
    classId: 'c5', className: '8A', subject: 'Matematyka',
    durationSeconds: 3000, status: 'raw',
    isSharedNote: false, isSharedAudio: false, thumbnailColor: '#fecdd3',
  },
  {
    id: 'r6', date: '2026-03-15T09:00:00',
    classId: 'c6', className: '2LOA', subject: 'Matematyka',
    durationSeconds: 2700, status: 'rejected',
    isSharedNote: false, isSharedAudio: false, thumbnailColor: '#fde68a',
  },
  {
    id: 'r7', date: '2026-03-19T10:00:00',
    classId: 'c4', className: '7B', subject: 'Matematyka',
    durationSeconds: 2580, status: 'transcribing',
    isSharedNote: false, isSharedAudio: false,
    topicId: 'tp9', topicName: 'Funkcja kwadratowa', thumbnailColor: '#d1fae5',
  },
  {
    id: 'r8', date: '2026-03-20T08:00:00',
    classId: 'c2', className: '6B', subject: 'Matematyka',
    durationSeconds: 2880, status: 'has_note', noteId: 'n6',
    isSharedNote: true, isSharedAudio: true,
    topicId: 'tp6', topicName: 'Wzory skróconego mnożenia', thumbnailColor: '#ddd6fe',
  },
];

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
  {
    id: 'n6', recordingId: 'r8',
    topicId: 'tp6', topicName: 'Wzory Skróconego Mnożenia',
    content: WZORY_SKROCONEGO_MNOZENIA_HTML,
    createdAt: '2026-03-23', status: 'accepted', sharedWithClasses: ['c1', 'c2', 'c5'],
  },
];
