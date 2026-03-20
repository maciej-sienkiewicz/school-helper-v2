import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, CheckSquare, Type, Shuffle,
  Plus, Minus, Sparkles, Printer, ChevronDown,
  ChevronUp, Check, FileQuestion, GraduationCap
} from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Blob } from '../../components/ui/Blob';
import { mockUnits, mockTopics, mockTopicStatuses, mockGeneratedTests } from '../../data/mockData';
import type { TestQuestion, GeneratedTest } from '../../types';

function exportTestToPDF(test: GeneratedTest) {
  const totalPoints = test.questions.reduce((s, q) => s + q.points, 0);

  const renderQuestion = (q: TestQuestion, index: number): string => {
    const questionHtml = `
      <div class="question">
        <div class="question-header">
          <span class="question-number">${index + 1}.</span>
          <span class="question-text">${q.question}</span>
          <span class="question-points">(${q.points} pkt)</span>
        </div>
        ${renderAnswerArea(q)}
      </div>
    `;
    return questionHtml;
  };

  const renderAnswerArea = (q: TestQuestion): string => {
    if (q.type === 'open') {
      return `
        <div class="answer-lines">
          <div class="answer-line"></div>
          <div class="answer-line"></div>
          <div class="answer-line"></div>
          <div class="answer-line"></div>
        </div>
      `;
    }
    if ((q.type === 'single_choice' || q.type === 'multiple_choice') && q.options) {
      const optionsHtml = q.options.map((opt, i) => `
        <div class="option">
          <span class="option-letter">${String.fromCharCode(65 + i)}.</span>
          <span class="option-text">${opt}</span>
        </div>
      `).join('');
      return `<div class="options">${optionsHtml}</div>`;
    }
    if (q.type === 'matching' && q.leftItems && q.rightItems) {
      const rows = Math.max(q.leftItems.length, q.rightItems.length);
      const rowsHtml = Array.from({ length: rows }, (_, i) => `
        <tr>
          <td class="match-cell match-left">${q.leftItems![i] ?? ''}</td>
          <td class="match-arrow">→</td>
          <td class="match-cell match-right">${q.rightItems![i] ?? ''}</td>
        </tr>
      `).join('');
      return `
        <table class="matching-table">
          <thead>
            <tr>
              <th>Kolumna A</th>
              <th></th>
              <th>Kolumna B</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="answer-lines" style="margin-top:8px">
          <div class="answer-line"></div>
          <div class="answer-line"></div>
        </div>
      `;
    }
    return '';
  };

  const questionsHtml = test.questions.map((q, i) => renderQuestion(q, i)).join('');

  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <title>${test.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      color: #111;
      background: #fff;
      padding: 20mm 20mm 20mm 25mm;
      max-width: 210mm;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .header h1 {
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .header .subtitle {
      font-size: 10pt;
      color: #555;
      margin-top: 4px;
    }
    .student-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
      padding: 12px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #fafafa;
    }
    .student-field label {
      font-size: 9pt;
      font-weight: bold;
      color: #444;
      display: block;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .student-field .field-line {
      border-bottom: 1.5px solid #333;
      height: 22px;
      width: 100%;
    }
    .test-meta {
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      color: #666;
      margin-bottom: 20px;
    }
    .question {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .question-header {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 8px;
    }
    .question-number {
      font-weight: bold;
      font-size: 11pt;
      flex-shrink: 0;
    }
    .question-text {
      font-weight: bold;
      font-size: 11pt;
      flex: 1;
      line-height: 1.5;
    }
    .question-points {
      font-size: 9pt;
      color: #666;
      flex-shrink: 0;
      font-weight: normal;
    }
    .options {
      margin-left: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 16px;
      margin-top: 4px;
    }
    .option {
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-size: 10.5pt;
      line-height: 1.6;
    }
    .option-letter {
      font-weight: bold;
      flex-shrink: 0;
      min-width: 16px;
    }
    .option-text { flex: 1; }
    .answer-lines {
      margin-left: 20px;
      margin-top: 6px;
    }
    .answer-line {
      border-bottom: 1px solid #aaa;
      height: 24px;
      margin-bottom: 6px;
    }
    .matching-table {
      margin-left: 20px;
      margin-top: 4px;
      border-collapse: collapse;
      width: calc(100% - 20px);
      font-size: 10.5pt;
    }
    .matching-table th {
      font-size: 9pt;
      text-align: left;
      color: #555;
      padding: 3px 8px;
      border-bottom: 1px solid #ccc;
      font-weight: bold;
    }
    .match-cell {
      padding: 5px 8px;
      border: 1px solid #ddd;
    }
    .match-left { background: #f5f0ff; }
    .match-right { background: #fffbeb; }
    .match-arrow {
      padding: 0 6px;
      color: #999;
      text-align: center;
      white-space: nowrap;
    }
    .footer {
      margin-top: 24px;
      border-top: 1px solid #ccc;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      color: #777;
    }
    @media print {
      body { padding: 15mm 15mm 15mm 20mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${test.title}</h1>
    <div class="subtitle">Sprawdzian · ${test.createdAt}</div>
  </div>

  <div class="student-info">
    <div class="student-field">
      <label>Imię i nazwisko</label>
      <div class="field-line"></div>
    </div>
    <div class="student-field">
      <label>Klasa</label>
      <div class="field-line"></div>
    </div>
  </div>

  <div class="test-meta">
    <span>Liczba pytań: <strong>${test.questions.length}</strong></span>
    <span>Łącznie punktów: <strong>${totalPoints} pkt</strong></span>
    <span>Czas: <strong>45 minut</strong></span>
  </div>

  ${questionsHtml}

  <div class="footer">
    <span>Wynik: _____ / ${totalPoints} pkt</span>
    <span>Ocena: _____</span>
    <span>Podpis: _____________________</span>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.addEventListener('afterprint', () => URL.revokeObjectURL(url));
  }
}

const topicsWithNotes = new Set(
  mockTopicStatuses.filter(s => s.hasNote).map(s => s.topicId)
);

function CountInput({ value, onChange, min = 0, max = 10 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-8 text-center font-bold text-gray-800 text-sm">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-xl bg-violet-100 hover:bg-violet-200 flex items-center justify-center cursor-pointer"
      >
        <Plus className="w-3 h-3 text-violet-600" />
      </button>
    </div>
  );
}

function QuestionEditor({ question, onChange }: {
  question: TestQuestion;
  onChange: (q: TestQuestion) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const typeLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    open: { label: 'Otwarte', color: '#ddd6fe', icon: <Type className="w-3 h-3 text-violet-600" /> },
    single_choice: { label: 'Jednokrotny wybór', color: '#bae6fd', icon: <Check className="w-3 h-3 text-sky-600" /> },
    multiple_choice: { label: 'Wielokrotny wybór', color: '#d1fae5', icon: <CheckSquare className="w-3 h-3 text-emerald-600" /> },
    matching: { label: 'Dopasowanie', color: '#fde68a', icon: <Shuffle className="w-3 h-3 text-amber-600" /> },
  };

  const t = typeLabels[question.type] ?? typeLabels['open'];

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer text-left"
      >
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: t.color }}
        >
          {t.icon}
        </div>
        <div className="flex-1 text-sm text-gray-700 font-medium line-clamp-1">{question.question}</div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400">{question.points} pkt</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: t.color }}>
            {t.label}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 p-4 space-y-3"
          >
            {/* Question text */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Treść pytania</label>
              <textarea
                value={question.question}
                onChange={e => onChange({ ...question, question: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
                rows={2}
              />
            </div>

            {/* Options for choice questions */}
            {question.options && (
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Opcje odpowiedzi</label>
                <div className="space-y-2">
                  {question.options.map((opt, i) => {
                    const isCorrect = Array.isArray(question.correctAnswer)
                      ? question.correctAnswer.includes(opt)
                      : question.correctAnswer === opt;
                    return (
                      <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl text-sm ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'}`}>
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className={isCorrect ? 'text-emerald-700 font-medium' : 'text-gray-700'}>{opt}</span>
                        {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matching */}
            {question.leftItems && (
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Pary do dopasowania</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    {question.leftItems?.map((item, i) => (
                      <div key={i} className="p-2 bg-violet-50 rounded-xl text-xs text-violet-700 font-medium">{item}</div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {question.rightItems?.map((item, i) => (
                      <div key={i} className="p-2 bg-amber-50 rounded-xl text-xs text-amber-700">{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500">Punkty:</label>
              <CountInput value={question.points} onChange={v => onChange({ ...question, points: v })} min={1} max={10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExistingTestCard({ test }: { test: GeneratedTest }) {
  const [expanded, setExpanded] = useState(false);
  const [questions, setQuestions] = useState(test.questions);

  return (
    <Card padding="lg" className="mt-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800">{test.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">Wygenerowany {test.createdAt} · {test.questions.length} pytań</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<Printer className="w-3.5 h-3.5" />} onClick={() => exportTestToPDF({ ...test, questions })}>
            Eksportuj PDF
          </Button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { count: questions.filter(q => q.type === 'open').length, label: 'otwarte', color: '#ddd6fe' },
          { count: questions.filter(q => q.type === 'single_choice').length, label: 'jednokr.', color: '#bae6fd' },
          { count: questions.filter(q => q.type === 'multiple_choice').length, label: 'wielokr.', color: '#d1fae5' },
          { count: questions.filter(q => q.type === 'matching').length, label: 'dopasow.', color: '#fde68a' },
        ].filter(i => i.count > 0).map(({ count, label, color }) => (
          <span key={label} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: color }}>
            {count} × {label}
          </span>
        ))}
        <span className="text-xs text-gray-400 ml-auto">
          Łącznie: {questions.reduce((s, q) => s + q.points, 0)} pkt
        </span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {questions.map((q) => (
              <QuestionEditor
                key={q.id}
                question={q}
                onChange={updated => setQuestions(prev => prev.map(p => p.id === updated.id ? updated : p))}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function Tests() {
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [customScope, setCustomScope] = useState('');
  const [config, setConfig] = useState({
    openCount: 2,
    singleChoiceCount: 3, singleChoiceOptions: 4,
    multipleChoiceCount: 2, multipleChoiceOptions: 4,
    matchingCount: 1,
  });
  const [generating, setGenerating] = useState(false);
  const [tests, setTests] = useState<GeneratedTest[]>(mockGeneratedTests);

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleGenerate = () => {
    if (selectedTopics.size === 0 && !customScope.trim()) {
      alert('Wybierz co najmniej jeden temat lub wpisz zakres niestandardowy!');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const newTest: GeneratedTest = {
        ...mockGeneratedTests[0],
        id: 'gt_new',
        title: 'Nowy sprawdzian · ' + new Date().toLocaleDateString('pl'),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setTests(prev => [newTest, ...prev]);
    }, 2500);
  };

  const totalQuestions = config.openCount + config.singleChoiceCount + config.multipleChoiceCount + config.matchingCount;

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <Blob color="#fde68a" size="xl" className="-top-20 -right-20" />
      <Blob color="#ddd6fe" size="lg" className="bottom-10 left-0" delay animated />

      <div className="relative max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Generator Testów</h1>
          <p className="text-gray-500 mt-1">Wygeneruj sprawdzian AI na podstawie zrealizowanego materiału</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Topic selector */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Card padding="lg">
              <SectionTitle icon={<FileQuestion className="w-4 h-4" />} className="mb-5">
                Wybierz zakres testu
              </SectionTitle>

              <div className="space-y-3 mb-5">
                {mockUnits.map(unit => {
                  const topics = mockTopics.filter(t => t.unitId === unit.id);
                  const hasAnyNote = topics.some(t => topicsWithNotes.has(t.id));
                  if (!hasAnyNote) return null;

                  return (
                    <div key={unit.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                          <GraduationCap className="w-3 h-3 text-violet-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{unit.name}</span>
                      </div>
                      <div className="pl-8 space-y-1.5">
                        {topics.map(topic => {
                          const hasNote = topicsWithNotes.has(topic.id);
                          const isSelected = selectedTopics.has(topic.id);
                          return (
                            <button
                              key={topic.id}
                              onClick={() => hasNote && toggleTopic(topic.id)}
                              disabled={!hasNote}
                              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm transition-all duration-200 cursor-pointer text-left ${
                                !hasNote
                                  ? 'opacity-40 cursor-not-allowed bg-gray-50'
                                  : isSelected
                                  ? 'bg-violet-600 text-white shadow-md'
                                  : 'bg-gray-50 hover:bg-violet-50 text-gray-700'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                                isSelected ? 'bg-white border-white' : hasNote ? 'border-violet-300 bg-white' : 'border-gray-200 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-violet-600" />}
                              </div>
                              <span className="flex-1">{topic.name}</span>
                              {hasNote && !isSelected && (
                                <span className="text-xs text-violet-400 flex items-center gap-1">
                                  <FileQuestion className="w-3 h-3" /> ma notatkę
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom scope */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wider">
                  Niestandardowy zakres (opcjonalnie)
                </label>
                <textarea
                  value={customScope}
                  onChange={e => setCustomScope(e.target.value)}
                  placeholder="Np. 'Dodaj pytania z całkowania przez podstawienie...'"
                  className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
                  rows={3}
                />
              </div>
            </Card>
          </motion.div>

          {/* Right: Config */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
            className="lg:col-span-2 space-y-4"
          >
            <Card padding="lg">
              <SectionTitle icon={<FlaskConical className="w-4 h-4" />} className="mb-5">
                Konfiguracja testu
              </SectionTitle>

              <div className="space-y-4">
                {/* Open */}
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Type className="w-3.5 h-3.5 text-violet-500" /> Otwarte
                    </div>
                    <CountInput value={config.openCount} onChange={v => setConfig(c => ({ ...c, openCount: v }))} />
                  </div>
                </div>

                {/* Single choice */}
                <div className="p-3 bg-sky-50 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Check className="w-3.5 h-3.5 text-sky-500" /> Jednokrotny wybór
                    </div>
                    <CountInput value={config.singleChoiceCount} onChange={v => setConfig(c => ({ ...c, singleChoiceCount: v }))} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Liczba opcji odpowiedzi</span>
                    <CountInput value={config.singleChoiceOptions} onChange={v => setConfig(c => ({ ...c, singleChoiceOptions: v }))} min={2} max={6} />
                  </div>
                </div>

                {/* Multiple choice */}
                <div className="p-3 bg-emerald-50 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Wielokrotny wybór
                    </div>
                    <CountInput value={config.multipleChoiceCount} onChange={v => setConfig(c => ({ ...c, multipleChoiceCount: v }))} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Liczba opcji odpowiedzi</span>
                    <CountInput value={config.multipleChoiceOptions} onChange={v => setConfig(c => ({ ...c, multipleChoiceOptions: v }))} min={2} max={6} />
                  </div>
                </div>

                {/* Matching */}
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Shuffle className="w-3.5 h-3.5 text-amber-500" /> Dopasowanie
                    </div>
                    <CountInput value={config.matchingCount} onChange={v => setConfig(c => ({ ...c, matchingCount: v }))} />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-2xl text-center">
                <div className="text-2xl font-extrabold text-gray-800">{totalQuestions}</div>
                <div className="text-xs text-gray-500">pytań w teście</div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={<Sparkles className="w-4 h-4" />}
                loading={generating}
                onClick={handleGenerate}
                className="mt-4"
              >
                {generating ? 'Generuję test...' : 'Generuj test AI'}
              </Button>

              {selectedTopics.size > 0 && (
                <div className="mt-3 text-xs text-center text-gray-500">
                  Wybrane tematy: <span className="font-semibold text-violet-600">{selectedTopics.size}</span>
                </div>
              )}
            </Card>

            {/* Tips */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200">
              <div className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Wskazówka
              </div>
              <p className="text-xs text-amber-600">
                AI generuje pytania na podstawie zaakceptowanych notatek. Im więcej tematów wybierzesz, tym bardziej zróżnicowany będzie test.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Generated tests list */}
        <AnimatePresence>
          {tests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mt-10 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Wygenerowane testy</h2>
                <Badge variant="purple">{tests.length}</Badge>
              </div>
              {tests.map(test => (
                <ExistingTestCard key={test.id} test={test} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
