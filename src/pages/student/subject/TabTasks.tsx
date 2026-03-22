import { useState } from 'react';
import {
  CalendarCheck, Clock, MapPin, AlertCircle,
  CheckCircle2, ClipboardList, Award,
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { mockStudentExams, mockStudentHomework } from '../../../data/mockData';
import type { StudentExam, StudentHomework } from '../../../types';

// ─── Exam card ─────────────────────────────────────────────────────────────────

function ExamCard({ exam }: { exam: StudentExam }) {
  const days = differenceInDays(parseISO(exam.date), new Date());
  const chip =
    days <= 0 ? 'bg-red-100 text-red-700' :
    days <= 3 ? 'bg-red-100 text-red-700' :
    days <= 7 ? 'bg-amber-100 text-amber-700' :
    'bg-sky-100 text-sky-700';
  const label =
    days < 0  ? `Minął ${Math.abs(days)} dni temu` :
    days === 0 ? 'Dzisiaj!' :
    days === 1 ? 'Jutro!' :
    `Za ${days} dni`;

  return (
    <div className="bg-white rounded-3xl shadow-card border border-white/80 p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: exam.color }}>
            <CalendarCheck className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <div className="font-bold text-gray-800">
              {format(parseISO(exam.date), 'd MMMM yyyy', { locale: pl })}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exam.durationMinutes} min</span>
              {exam.room && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> sala {exam.room}</span>}
            </div>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${chip}`}>{label}</span>
      </div>

      {/* Scope alert */}
      <div className="bg-amber-50 rounded-2xl p-3 mb-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-800 mb-0.5">Zakres materiału</p>
          <p className="text-sm text-amber-700">{exam.scope}</p>
        </div>
      </div>

      {/* Topic badges */}
      <div className="flex flex-wrap gap-1.5">
        {exam.topicNames.map((t: string) => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: exam.color + '60', color: '#374151' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Homework card ─────────────────────────────────────────────────────────────

function HomeworkCard({ hw, done, onToggle }: { hw: StudentHomework; done: boolean; onToggle: () => void }) {
  const days = differenceInDays(parseISO(hw.dueDate), new Date());
  const urgent = days <= 2 && !done;

  return (
    <div className={`p-4 rounded-2xl border-2 transition-all ${done ? 'border-emerald-200 bg-emerald-50' : urgent ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="w-11 h-11 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
          style={done
            ? { backgroundColor: '#10b981', borderColor: '#10b981' }
            : { backgroundColor: 'transparent', borderColor: urgent ? '#fca5a5' : '#d1d5db' }
          }
        >
          {done && <CheckCircle2 className="w-5 h-5 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm mb-1 ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {hw.title}
          </div>
          <p className={`text-sm mb-2 ${done ? 'text-gray-400' : 'text-gray-600'}`}>{hw.description}</p>
          <span className={`text-xs font-semibold flex items-center gap-1 ${urgent && !done ? 'text-red-600' : 'text-gray-500'}`}>
            <CalendarCheck className="w-3 h-3" />
            {done ? 'Oddane' :
             days < 0 ? `Spóźnione o ${Math.abs(days)} dni` :
             days === 0 ? 'Dzisiaj!' :
             `Za ${days} dni`}
            {' · '}{format(parseISO(hw.dueDate), 'd MMM', { locale: pl })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Tab component ─────────────────────────────────────────────────────────────

export function TabTasks({ subject }: { subject: string }) {
  const exams = mockStudentExams.filter(e => e.subject === subject);
  const all   = mockStudentHomework.filter(h => h.subject === subject);
  const [done, setDone] = useState<Set<string>>(new Set(all.filter(h => h.done).map(h => h.id)));

  const toggle = (id: string) =>
    setDone(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const mandatory = all.filter(h => !h.isExtra);
  const extra     = all.filter(h => h.isExtra);

  const pendingCount = all.filter(h => !done.has(h.id) && !h.isExtra).length;

  return (
    <div className="space-y-8">

      {/* ── Egzaminy ─────────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CalendarCheck className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-700">Egzaminy</span>
          {exams.length > 0 && <span className="text-xs text-gray-400">({exams.length})</span>}
          <div className="flex-1 h-px bg-gray-100 ml-1" />
        </div>

        {exams.length === 0
          ? <div className="bg-gray-50 rounded-3xl p-8 text-center">
              <CalendarCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Brak nadchodzących egzaminów.</p>
            </div>
          : <div className="space-y-3">{exams.map(e => <ExamCard key={e.id} exam={e} />)}</div>
        }
      </section>

      {/* ── Zadania obowiązkowe ───────────────────────────────────────────────── */}
      {mandatory.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">Zadania obowiązkowe</span>
            <span className="text-xs text-gray-400">
              ({mandatory.filter(h => done.has(h.id)).length}/{mandatory.length} zrobionych)
            </span>
            {pendingCount > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                {pendingCount} do zrobienia
              </span>
            )}
            <div className="flex-1 h-px bg-gray-100 ml-1" />
          </div>
          <div className="space-y-2">
            {mandatory.map(h => <HomeworkCard key={h.id} hw={h} done={done.has(h.id)} onToggle={() => toggle(h.id)} />)}
          </div>
        </section>
      )}

      {/* ── Zadania dodatkowe ─────────────────────────────────────────────────── */}
      {extra.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-700">Zadania dodatkowe</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">nadobowiązkowe</span>
            <div className="flex-1 h-px bg-gray-100 ml-1" />
          </div>
          <div className="space-y-2">
            {extra.map(h => <HomeworkCard key={h.id} hw={h} done={done.has(h.id)} onToggle={() => toggle(h.id)} />)}
          </div>
        </section>
      )}

      {all.length === 0 && exams.length === 0 && (
        <div className="bg-gray-50 rounded-3xl p-10 text-center">
          <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Brak zadań i egzaminów z tego przedmiotu.</p>
        </div>
      )}
    </div>
  );
}
