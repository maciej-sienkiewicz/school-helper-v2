import { ClipboardList, CheckCircle2, CalendarCheck, Award } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { mockStudentHomework } from '../../../data/mockData';
import type { StudentHomework } from '../../../types';

// ─── Single task row ───────────────────────────────────────────────────────────

function TaskRow({ hw, done, onToggle }: { hw: StudentHomework; done: boolean; onToggle: () => void }) {
  const days = differenceInDays(parseISO(hw.dueDate), new Date());
  const urgent = days <= 2 && !done;
  const overdue = days < 0 && !done;

  const dueLabel =
    done    ? 'Zrobione'
    : overdue ? `Spóźnione ${Math.abs(days)}d`
    : days === 0 ? 'Dzisiaj!'
    : days === 1 ? 'Jutro!'
    : `Za ${days} dni`;

  const dueColor =
    done    ? 'text-emerald-600'
    : overdue ? 'text-red-500'
    : urgent  ? 'text-amber-600'
    : 'text-gray-400';

  return (
    <div className={`flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 ${done ? 'opacity-50' : ''}`}>
      <button
        onClick={onToggle}
        className="w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
        style={done
          ? { backgroundColor: '#10b981', borderColor: '#10b981' }
          : { backgroundColor: 'transparent', borderColor: urgent ? '#fca5a5' : '#d1d5db' }
        }
      >
        {done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-snug ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {hw.title}
        </p>
        {hw.description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{hw.description}</p>
        )}
        <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${dueColor}`}>
          <CalendarCheck className="w-3 h-3" />
          {dueLabel} &middot; {format(parseISO(hw.dueDate), 'd MMM', { locale: pl })}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar tile ──────────────────────────────────────────────────────────────

export function SidebarHomework({
  subject,
  doneIds,
  onToggleDone,
}: {
  subject: string;
  doneIds: Set<string>;
  onToggleDone: (id: string) => void;
}) {
  const all = mockStudentHomework.filter(h => h.subject === subject);

  const mandatory = all.filter(h => !h.isExtra);
  const extra     = all.filter(h => h.isExtra);
  const pendingCount = mandatory.filter(h => !doneIds.has(h.id)).length;

  return (
    <div className="bg-white rounded-3xl shadow-card border border-white/80 p-5">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList className="w-4 h-4 text-sky-500" />
        <h2 className="text-sm font-bold text-gray-800">Zadania domowe</h2>
        {pendingCount > 0 && (
          <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full ml-auto">
            {pendingCount} do zrobienia
          </span>
        )}
      </div>

      {all.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">Brak zadań z tego przedmiotu.</p>
      ) : (
        <div>
          {/* Obowiązkowe */}
          {mandatory.length > 0 && (
            <div className="mt-3">
              {mandatory.map(h => (
                <TaskRow key={h.id} hw={h} done={doneIds.has(h.id)} onToggle={() => onToggleDone(h.id)} />
              ))}
            </div>
          )}

          {/* Nadobowiązkowe */}
          {extra.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5 mb-2 pt-2 border-t border-gray-100">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Nadobowiązkowe</span>
              </div>
              {extra.map(h => (
                <TaskRow key={h.id} hw={h} done={doneIds.has(h.id)} onToggle={() => onToggleDone(h.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
