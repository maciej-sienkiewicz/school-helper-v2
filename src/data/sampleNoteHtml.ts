// Sample rich HTML note – Wzory Skróconego Mnożenia
// This demonstrates the new interactive note format with fill-in-the-blank blanks,
// collapsible cue questions, and MathJax typesetting.

export const WZORY_SKROCONEGO_MNOZENIA_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wzory Skróconego Mnożenia</title>

    <script>
        window.MathJax = {
            tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], processEscapes: true }
        };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        :root {
            --key: #7c3aed;
            --proc: #059669;
            --logic: #2563eb;
            --bg-page: #f8fafc;
            --text-dark: #0f172a;
            --text-muted: #64748b;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: var(--text-dark);
            background-color: #e2e8f0;
            margin: 0;
            padding: 40px;
            line-height: 1.6;
        }

        .notebook-page {
            max-width: 950px;
            margin: 0 auto;
            background: #ffffff;
            padding: 60px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            min-height: 297mm;
        }

        header {
            border-bottom: 2px solid var(--text-dark);
            padding-bottom: 25px;
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .breadcrumb { font-family: monospace; font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        h1 { margin: 10px 0 0 0; font-size: 34px; font-weight: 900; letter-spacing: -0.04em; }

        .pre-test-zone {
            background: #fff7ed;
            border: 2px dashed #f97316;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .pre-test-zone b { color: #ea580c; text-transform: uppercase; font-size: 11px; }

        .lexicon {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            background: #f1f5f9;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 50px;
            border-left: 6px solid var(--key);
        }

        .lexicon-item { font-size: 14px; }
        .lexicon-item b { color: var(--key); display: block; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; margin-bottom: 4px; }

        .terminator-example { display: block; margin-top: 8px; font-style: italic; color: var(--logic); font-size: 12px; border-top: 1px solid #cbd5e1; padding-top: 4px; }

        .cornell-grid {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 50px;
        }

        .margin-cues {
            border-right: 1px solid #f1f5f9;
            padding-right: 30px;
        }

        .cue-block { margin-bottom: 60px; font-size: 14px; }
        details summary { font-weight: 700; color: var(--text-muted); cursor: pointer; list-style: none; }
        details[open] summary { color: var(--text-dark); margin-bottom: 10px; }
        .write-line { border-bottom: 1px solid #e2e8f0; height: 28px; margin-top: 0; }

        .section { margin-bottom: 50px; }

        .section-tag {
            display: inline-block;
            font-size: 12px;
            font-weight: 800;
            background: #f1f5f9;
            padding: 4px 12px;
            border-radius: 20px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
            border: 1px solid #e2e8f0;
        }

        .content-h2 { font-size: 22px; font-weight: 800; margin: 0 0 15px 0; color: #000; }
        .highlight-violet { color: var(--key); font-weight: 700; }
        .highlight-green { color: var(--proc); font-weight: 700; }

        .equation-display {
            background: #f8fafc;
            padding: 30px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
            border: 1px solid #e2e8f0;
        }

        .explainer-text {
            font-size: 14px;
            color: var(--text-muted);
            background: #fdfaff;
            padding: 12px;
            border-left: 3px solid #ddd6fe;
            margin-top: 15px;
            font-style: italic;
        }

        .boxing-king-link {
            margin: 30px 0;
            padding: 20px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            font-size: 13px;
        }
        .boxing-king-link b { color: var(--proc); text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 5px; }

        ul { padding: 0; list-style: none; }
        li { margin-bottom: 14px; padding-left: 25px; position: relative; }
        li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 10px;
            width: 8px;
            height: 2px;
            background: #cbd5e1;
        }

        .summary-card {
            margin-top: 60px;
            padding: 35px;
            background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
            border-radius: 12px;
            border: 1px solid #dbeafe;
        }

        .repetition-system {
            margin-top: 50px;
            border-top: 2px dashed #e2e8f0;
            padding-top: 30px;
        }
        .rep-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 15px;
        }
        .rep-card {
            background: #fff;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 12px;
        }
        .rep-card b { color: var(--logic); display: block; margin-bottom: 5px; text-transform: uppercase; }

        @media print {
            body { background: white; padding: 0; }
            .notebook-page { box-shadow: none; border: none; width: 100%; padding: 40px; }
        }
    </style>
</head>
<body>

<div class="notebook-page">
    <header>
        <div>
            <div class="breadcrumb">Matematyka / Algebra / Klasa 8</div>
            <h1>Wzory Skróconego Mnożenia: Architektura Obliczeń</h1>
        </div>
        <div class="breadcrumb" style="text-align: right;">Data: 23.03.2026<br>V. 14.0 Algebra Master</div>
    </header>

    <div class="pre-test-zone">
        <b>Metoda Ciekawskiego Dziecka (Pre-test):</b>
        Zanim przejdziesz do teorii: Wyobraź sobie, że musisz obliczyć pole kwadratu o boku $101$. Czy potrafisz to zrobić w pamięci, rozbijając $101$ na $100 + 1$ i używając logiki, zamiast mnożenia pisemnego? Zapisz swój tok myślenia:
        <div class="write-line"></div>
    </div>

    <div class="lexicon">
        <div class="lexicon-item">
            <b>Wyrażenie Algebraiczne</b> Zapis matematyczny łączący liczby i litery za pomocą znaków działań.
            <span class="terminator-example">Metoda Terminatora: Jak przepis kulinarny, gdzie litery to składniki, a znaki to instrukcje mieszania.</span>
        </div>
        <div class="lexicon-item">
            <b>Kwadrat Sumy</b> Wynik mnożenia sumy dwóch składników przez samą siebie.
            <span class="terminator-example">Metoda Terminatora: Powiększanie działki budowlanej równocześnie w dwóch kierunkach.</span>
        </div>
        <div class="lexicon-item">
            <b>Redukcja Wyrazów Podobnych</b> Uproszczenie zapisu poprzez dodanie lub odjęcie elementów o tych samych zmiennych.
            <span class="terminator-example">Metoda Terminatora: Sortowanie monet – osobno złotówki, osobno grosze.</span>
        </div>
        <div class="lexicon-item">
            <b>Dwumian</b> Wyrażenie składające się dokładnie z dwóch składników połączonych plusem lub minusem.
            <span class="terminator-example">Metoda Terminatora: Para butów – lewy i prawy tworzą jedną całość.</span>
        </div>
    </div>

    <div class="cornell-grid">
        <div class="margin-cues">
            <div class="cue-block">
                <details>
                    <summary>Rozwiń wzór na kwadrat różnicy:</summary>
                    <div style="padding: 10px; color: var(--text-dark); background: #f8fafc; font-weight: normal; margin-top: 5px;">
                        $(a-b)^2 = a^2 - 2ab + b^2$
                    </div>
                </details>
                <div class="write-line"></div><div class="write-line"></div>
            </div>
            <div class="cue-block">
                <details>
                    <summary>Jaki błąd najczęściej popełniają uczniowie?</summary>
                    <div style="padding: 10px; color: var(--text-dark); background: #f8fafc; font-weight: normal; margin-top: 5px;">
                        Zapominają o "środkowym" wyrazie $2ab$, pisząc błędnie $(a+b)^2 = a^2 + b^2$.
                    </div>
                </details>
                <div class="write-line"></div><div class="write-line"></div>
            </div>
            <div class="cue-block">
                <details>
                    <summary>Jak rozpoznać różnicę kwadratów?</summary>
                    <div style="padding: 10px; color: var(--text-dark); background: #f8fafc; font-weight: normal; margin-top: 5px;">
                        To iloczyn dwóch nawiasów, które różnią się tylko znakiem między tymi samymi wyrazami: $(a-b)(a+b)$.
                    </div>
                </details>
                <div class="write-line"></div><div class="write-line"></div>
            </div>
            <div class="cue-block">
                <details>
                    <summary>Zastosuj wzór dla $(2x + 3)^2$:</summary>
                    <div style="padding: 10px; color: var(--text-dark); background: #f8fafc; font-weight: normal; margin-top: 5px;">
                        $(2x)^2 + 2 \\cdot 2x \\cdot 3 + 3^2 = 4x^2 + 12x + 9$
                    </div>
                </details>
                <div class="write-line"></div><div class="write-line"></div>
            </div>
        </div>

        <div class="content-area">
            <div class="section">
                <span class="section-tag">Fundamenty</span>
                <div class="content-h2">1. Istota skróconego mnożenia</div>
                Wzory skróconego mnożenia to <span class="highlight-violet">gotowe algorytmy</span>, które pozwalają pominąć etap mozolnego mnożenia "każdy przez każdy". Skracają czas pracy i minimalizują ryzyko błędu rachunkowego.
                <div class="explainer-text">To jak skrót klawiszowy w komputerze – zamiast klikać menu, używasz kombinacji przycisków.</div>
            </div>

            <div class="section">
                <span class="section-tag">Architektura</span>
                <div class="content-h2">2. Trzy filary algebry</div>

                <div class="equation-display">
                    <span class="highlight-violet">Kwadrat sumy:</span><br>
                    $$(a+b)^2 = a^2 + 2ab + b^2$$
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">Pierwszy do kwadratu + podwojony iloczyn + drugi do kwadratu</div>
                </div>

                <div class="equation-display">
                    <span class="highlight-violet">Kwadrat różnicy:</span><br>
                    $$(a-b)^2 = a^2 - 2ab + b^2$$
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">Różni się od sumy tylko znakiem minus przy podwojonym iloczynie</div>
                </div>

                <div class="equation-display">
                    <span class="highlight-violet">Różnica kwadratów:</span><br>
                    $$(a-b)(a+b) = a^2 - b^2$$
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">Najbardziej "skuteczny" wzór – środkowe wyrazy redukują się do zera</div>
                </div>
            </div>

            <div class="section">
                <span class="section-tag">Mechanika</span>
                <div class="content-h2">3. Proces transformacji</div>
                Aby poprawnie zastosować wzór, wykonaj <span class="highlight-green">sekwencję kroków</span>:
                <ul>
                    <li><span class="highlight-green">Identyfikacja:</span> Wybierz właściwy wzór na podstawie struktury nawiasów.</li>
                    <li><span class="highlight-green">Podstawienie:</span> Określ, co w Twoim zadaniu jest $a$, a co $b$ (pamiętaj o braniu całych wyrażeń w nawias).</li>
                    <li><span class="highlight-green">Potęgowanie:</span> Oblicz kwadraty współczynników liczbowych i zmiennych.</li>
                </ul>
            </div>

            <div class="boxing-king-link">
                <b>Konektor Króla Boksu (Geometria):</b>
                Wyobraź sobie kwadrat o boku $a+b$. Składa się on z jednego dużego kwadratu $a^2$, jednego małego $b^2$ oraz dwóch prostokątów o polach $ab$. Stąd bierze się składnik $2ab$ we wzorze.
                <div class="write-line"></div>
            </div>
        </div>
    </div>

    <div class="summary-card">
        <span class="section-tag" style="background: var(--logic); color: white; border: none;">Synteza (Metoda Nauczyciela)</span>
        <p style="margin-top: 15px; font-weight: 500;">Wyjaśnij komuś prosto: po co nam te wzory i dlaczego $ (a+b)^2 $ to nie jest po prostu $ a^2 + b^2 $?</p>
        <div class="write-line"></div><div class="write-line"></div>
    </div>

    <div class="repetition-system">
        <span class="section-tag" style="background: var(--text-dark); color: white; border: none;">System Rezerwacji (1-7-30)</span>
        <div class="rep-grid">
            <div class="rep-card"><b>Dzień 1:</b> Uzupełnij luki na marginesie i spróbuj wyprowadzić wzory mnożąc nawiasy klasycznie.</div>
            <div class="rep-card"><b>Dzień 7:</b> Zasłoń prawą stronę notatki i odpowiedz na pytania kontrolne z sekcji Cues.</div>
            <div class="rep-card"><b>Dzień 30:</b> Rozwiąż 5 losowych przykładów z podręcznika, stosując wzory w czasie poniżej 20 sekund na przykład.</div>
        </div>
    </div>
</div>

</body>
</html>`;
