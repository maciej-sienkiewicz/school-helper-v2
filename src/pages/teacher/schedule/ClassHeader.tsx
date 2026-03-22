import { GraduationCap, Users } from 'lucide-react';
import { ClassDropdown } from './ClassDropdown';
import type { Class } from '../../../types';

interface Props {
  selectedClass: Class | undefined;
  classes: Class[];
  onSelectClass: (id: string) => void;
  onAddClass: () => void;
}

export function ClassHeader({ selectedClass, classes, onSelectClass, onAddClass }: Props) {
  if (!selectedClass) return null;

  const schoolLabel = selectedClass.schoolType === 'primary' ? 'Szkoła Podstawowa' : 'Liceum';

  return (
    <div className="bg-white rounded-3xl shadow-card border border-white/80 p-5 mb-6">
      <div className="flex items-center justify-between gap-4">

        {/* Left: class info */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-gray-700 flex-shrink-0"
            style={{ backgroundColor: selectedClass.color }}
          >
            {selectedClass.name}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{selectedClass.subject}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {selectedClass.studentCount} uczniów
              </span>
              <span className="text-gray-300">·</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: selectedClass.color, color: '#374151' }}
              >
                {schoolLabel} · Klasa {selectedClass.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Right: dropdown */}
        <ClassDropdown
          classes={classes}
          selectedId={selectedClass.id}
          onSelect={onSelectClass}
          onAddClass={onAddClass}
        />
      </div>
    </div>
  );
}
