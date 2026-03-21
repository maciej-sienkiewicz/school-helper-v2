import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

export function TrimmerMock({ onClose }: { onClose: () => void }) {
  const [start, setStart] = useState(10);
  const [end, setEnd] = useState(85);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="bg-white rounded-4xl shadow-2xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Przytnij nagranie</h3>
        <p className="text-sm text-gray-500 mb-6">Ustaw początek i koniec nagrania, które chcesz zachować.</p>

        <div className="mb-6">
          <div className="relative h-12 bg-gradient-to-r from-violet-100 via-violet-200 to-violet-100 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center gap-0.5 px-2">
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-violet-400 rounded-full opacity-60"
                  style={{ height: `${20 + Math.random() * 60}%` }}
                />
              ))}
            </div>
            <div
              className="absolute top-0 bottom-0 bg-violet-500/20 border-l-2 border-r-2 border-violet-500"
              style={{ left: `${start}%`, right: `${100 - end}%` }}
            />
            <div className="absolute top-0 bottom-0 w-3 bg-violet-600 rounded-l cursor-ew-resize" style={{ left: `${start}%` }} />
            <div className="absolute top-0 bottom-0 w-3 bg-violet-600 rounded-r cursor-ew-resize" style={{ left: `${end}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0:00</span><span>23:00</span><span>46:00</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Początek</label>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="100" value={start}
                onChange={e => setStart(Math.min(Number(e.target.value), end - 5))}
                className="flex-1 accent-violet-600" />
              <span className="text-sm font-mono text-gray-700 w-12 text-right">
                {Math.floor(start * 0.46)}:{String(Math.floor((start * 0.46 % 1) * 60)).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Koniec</label>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="100" value={end}
                onChange={e => setEnd(Math.max(Number(e.target.value), start + 5))}
                className="flex-1 accent-violet-600" />
              <span className="text-sm font-mono text-gray-700 w-12 text-right">
                {Math.floor(end * 0.46)}:{String(Math.floor((end * 0.46 % 1) * 60)).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Anuluj</Button>
          <Button variant="primary" size="md" onClick={() => { alert('Nagranie przycięte!'); onClose(); }} className="flex-1">
            <Scissors className="w-4 h-4" /> Zapisz przycięcie
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
