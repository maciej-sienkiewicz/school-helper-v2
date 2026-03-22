# Dokumentacja funkcjonalności – Widok Nauczyciela

## Spis treści
1. [Dashboard](#1-dashboard)
2. [Zarządzanie Klasami i Programem Nauczania](#2-zarządzanie-klasami-i-programem-nauczania)
3. [Szablony Harmonogramów](#3-szablony-harmonogramów)
4. [Nagrania i Materiały](#4-nagrania-i-materiały)
5. [Generator Testów](#5-generator-testów)
6. [Profil](#6-profil)

---

## 1. Dashboard

Strona główna nauczyciela. Służy jako centralny punkt startowy do codziennej pracy.

**Co nauczyciel może tu zrobić:**
- Zobaczyć powitanie z aktualną datą i godziną
- Uruchomić nowe nagranie lekcji (główny przycisk CTA)
- Sprawdzić tygodniowe statystyki: liczba nagrań, udostępnionych notatek i wygenerowanych testów
- Zobaczyć listę swoich klas zaplanowanych na dziś (z godziną i numerem sali) i szybko uruchomić nagranie dla konkretnej klasy
- Przejrzeć ostatnie nagrania wraz z ich statusem przetwarzania
- Zobaczyć wskazówkę AI, np. informację o uczniach, którzy nie otworzyli jeszcze udostępnionych materiałów

---

## 2. Zarządzanie Klasami i Programem Nauczania

Sekcja służy do zarządzania listą klas nauczyciela oraz śledzenia realizacji programu nauczania.

### 2a. Lista klas

**Co nauczyciel może tu zrobić:**
- Przeglądać wszystkie swoje klasy pogrupowane według poziomu i typu szkoły
- Dodać nową klasę, podając:
  - Nazwę klasy (np. „6C")
  - Przedmiot (np. „Matematyka")
  - Poziom klasy (1–8 dla szkoły podstawowej, 1–3 dla liceum)
  - Typ szkoły (podstawowa / liceum)
  - Liczbę uczniów
  - Kolor klasy (identyfikator wizualny)
  - Opcjonalnie: szablon harmonogramu do przypisania
- Usunąć klasę
- Zobaczyć łączne zestawienie klas według przedmiotu

### 2b. Program nauczania dla wybranej klasy

Po wybraniu klasy nauczyciel widzi jej program nauczania (działy i tematy).

**Co nauczyciel może tu zrobić:**
- Przeglądać działy i tematy w hierarchicznej strukturze
- Rozwijać i zwijać działy
- Śledzić postęp realizacji każdego działu (liczba zrealizowanych tematów / wszystkich tematów)
- Oznaczać pojedynczy temat jako zrealizowany lub niezrealizowany
- Sprawdzać, które tematy mają przypisane notatki, nagrania i czy materiały zostały udostępnione uczniom
- Przypisywać szablon harmonogramu do klasy

**Dodawanie materiałów do tematu:**
- Przypisać notatkę:
  - Wybrać istniejącą notatkę z innej klasy
  - Wgrać plik notatki (PDF, DOCX, TXT, MD)
- Przypisać nagranie:
  - Wybrać istniejące nagranie z innej klasy
  - Wgrać plik audio (MP3, WAV, M4A, AAC, OGG)

---

## 3. Szablony Harmonogramów

Sekcja umożliwia tworzenie i zarządzanie wielokrotnie używalnymi szablonami programu nauczania.

**Co nauczyciel może tu zrobić:**
- Przeglądać listę swoich szablonów
- Stworzyć nowy szablon, podając:
  - Nazwę szablonu
  - Przedmiot
  - Opis (opcjonalnie)
  - Poziom klasy
  - Typ szkoły
- Edytować istniejący szablon
- Usunąć szablon
- Zarządzać działami w ramach szablonu (dodawanie, edycja, usuwanie, kolejność)
- Zarządzać tematami w ramach każdego działu (dodawanie, edycja, usuwanie)
- Zobaczyć podsumowanie szablonu: przedmiot, typ szkoły, liczba działów i tematów

**Cel szablonów:**
Jeden szablon można przypisać do wielu klas (np. wszystkie klasy 6 uczące się matematyki), co zapewnia spójność programu nauczania i eliminuje konieczność wielokrotnego wpisywania tych samych informacji.

---

## 4. Nagrania i Materiały

Sekcja obejmuje cały przepływ pracy z nagraniami lekcji – od przesłania pliku po udostępnienie gotowej notatki uczniom.

### Zakładka 1: Oczekujące

Nowe nagrania, które czekają na decyzję nauczyciela.

**Co nauczyciel może tu zrobić:**
- Przeglądać nowe nagrania z metadanymi (klasa, przedmiot, data, czas trwania)
- Zlecić AI wygenerowanie notatki z nagrania
- Odrzucić nagranie

### Zakładka 2: Przetwarzanie

Nagrania, dla których AI aktualnie generuje transkrypcję lub notatkę.

**Co nauczyciel może tu zrobić:**
- Śledzić postęp przetwarzania
- Zobaczyć liczbę materiałów w trakcie przetwarzania

### Zakładka 3: Notatki

Gotowe notatki wygenerowane przez AI, oczekujące na weryfikację nauczyciela.

**Co nauczyciel może tu zrobić:**
- Przeglądać wygenerowane notatki z podglądem treści
- Otworzyć notatkę, sprawdzić jej pełną treść i edytować ją
- Zaakceptować notatkę (po akceptacji notatka nie może być dalej edytowana)
- Udostępnić notatkę uczniom
- Usunąć notatkę

### Zakładka 4: Udostępnione

Materiały, które zostały już udostępnione uczniom.

**Co nauczyciel może tu zrobić:**
- Przeglądać wszystkie udostępnione materiały z informacją o typie (notatka, audio lub oba)
- Zobaczyć, do których klas dany materiał został udostępniony
- Sprawdzić statystyki zaangażowania uczniów:
  - Łączna liczba wyświetleń
  - Łączna liczba odtworzeń
  - Liczba komentarzy
  - Liczba wyświetleń zewnętrznych (spoza szkoły)
- Rozwinąć szczegóły i zobaczyć statystyki per klasa:
  - Liczba uczniów w klasie
  - Ilu uczniów otworzyło materiał
  - Ilu uczniów nie otworzyło materiału (wyróżnione ostrzeżeniem)
  - Liczba wyświetleń i odtworzeń per klasa
- Przeczytać komentarze uczniów do materiału (z podaniem imienia, klasy i daty)

---

## 5. Generator Testów

Sekcja umożliwia tworzenie testów generowanych przez AI na podstawie zrealizowanego materiału.

### Krok 1: Wybór szablonu

Nauczyciel wybiera szablon harmonogramu, który będzie podstawą testu.

### Krok 2: Wybór zakresu testu

**Co nauczyciel może tu zrobić:**
- Wybrać konkretne tematy z wybranych działów (wielokrotny wybór za pomocą checkboxów)
- Opcjonalnie dodać własne wymagania tekstowe, np. „Dodaj pytania z całkowania przez podstawienie"

### Krok 3: Konfiguracja testu

**Co nauczyciel może tu zrobić:**
- Ustalić liczbę i typ pytań:
  - Pytania otwarte
  - Pytania jednokrotnego wyboru (z możliwością ustawienia liczby opcji: 2–6)
  - Pytania wielokrotnego wyboru (z możliwością ustawienia liczby opcji: 2–6)
  - Zadania na dopasowanie (matching)
- Zobaczyć dynamicznie aktualizowane podsumowanie: łączna liczba pytań i punktów

### Krok 4: Generowanie i zarządzanie testami

**Co nauczyciel może tu zrobić:**
- Uruchomić generowanie testu przez AI
- Przeglądać wygenerowane testy (data, liczba pytań, rozkład typów, łączna punktacja)
- Edytować każde pytanie:
  - Zmienić treść pytania
  - Dostosować opcje odpowiedzi
  - Zmienić liczbę punktów za pytanie (1–10 pkt)
  - Ponownie wygenerować pojedyncze pytanie przez AI
- Eksportować test do PDF (gotowy do druku, z miejscem na dane ucznia, punktację i ocenę)
- Usunąć test

---

## 6. Profil

Sekcja ustawień konta i konfiguracji aplikacji.

**Co nauczyciel może tu zrobić:**
- Zobaczyć swoje dane (imię, email, nazwa szkoły, nauczane przedmioty)
- Edytować imię i nazwisko
- Zobaczyć zbiorcze statystyki: liczba nagrań, udostępnionych materiałów, klas i uczniów
- Zarządzać ustawieniami:
  - Powiadomienia (email i push)
  - Prywatność i bezpieczeństwo (hasło, 2FA)
  - Ustawienia AI (język notatek, styl notatek)
  - Domyślna podstawa programowa (poziom edukacji, przedmiot)

---

## Podsumowanie możliwości nauczyciela

| Obszar | Możliwości |
|---|---|
| Klasy | Tworzenie, przeglądanie i usuwanie klas; przypisywanie szablonów |
| Program nauczania | Śledzenie realizacji tematów i działów; przypisywanie materiałów do tematów |
| Szablony | Tworzenie wielokrotnie używalnych szablonów programu z działami i tematami |
| Nagrania | Uruchamianie nagrań, śledzenie statusu przetwarzania, weryfikacja i edycja AI-notatek |
| Materiały | Udostępnianie notatek i nagrań wybranym klasom; ponowne użycie materiałów w innych klasach |
| Analityka | Monitoring zaangażowania uczniów (wyświetlenia, odtworzenia, komentarze, nieaktywni uczniowie) |
| Testy | Generowanie testów AI z podziałem na typy pytań; edycja i eksport do PDF |
| Profil | Zarządzanie kontem i konfiguracją preferencji AI |
