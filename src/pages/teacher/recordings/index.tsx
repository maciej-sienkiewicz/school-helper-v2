import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, FileText, Share2, Clock } from 'lucide-react';
import { Blob } from '../../../components/ui/Blob';
import { Badge } from '../../../components/ui/Badge';
import { PendingTab } from './tabs/PendingTab';
import { ProcessingTab } from './tabs/ProcessingTab';
import { NotesTab } from './tabs/NotesTab';
import { SharedTab } from './tabs/SharedTab';
import { mockRecordings, mockNotes } from '../../../data/mockData';

type Tab = 'pending' | 'processing' | 'notes' | 'shared';

const tabs: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'pending',    label: 'Oczekujące',   icon: Clock,    description: 'Nowe nagrania do zatwierdzenia' },
  { id: 'processing', label: 'Przetwarzanie', icon: Loader2,  description: 'Trwa generowanie notatek' },
  { id: 'notes',      label: 'Notatki',       icon: FileText, description: 'Gotowe notatki do przejrzenia' },
  { id: 'shared',     label: 'Udostępnione',  icon: Share2,   description: 'Materiały udostępnione uczniom' },
];

export function Recordings() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');

  // Local state to simulate user actions across tabs
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [deletedNoteIds, setDeletedNoteIds] = useState<string[]>([]);

  const handleCreateNote = (recId: string) => {
    setProcessingIds(ids => [...ids, recId]);
    setRejectedIds(ids => ids.filter(id => id !== recId));
    setActiveTab('processing');
  };

  const handleReject = (recId: string) => {
    setRejectedIds(ids => [...ids, recId]);
  };

  const handleDeleteNote = (recId: string) => {
    setDeletedNoteIds(ids => [...ids, recId]);
  };

  // Tab badge counts
  const pendingCount = mockRecordings.filter(
    r => r.status === 'raw' && !rejectedIds.includes(r.id)
  ).length;

  const processingCount = mockRecordings.filter(
    r => r.status === 'transcribing' || r.status === 'transcribed' || processingIds.includes(r.id)
  ).length;

  const notesCount = mockRecordings.filter(
    r => r.status === 'has_note' && !deletedNoteIds.includes(r.id)
  ).filter(r => {
    const note = mockNotes.find(n => n.id === r.noteId);
    return note && note.status !== 'accepted';
  }).length;

  const badgeCounts: Partial<Record<Tab, number>> = {
    pending: pendingCount,
    processing: processingCount,
    notes: notesCount,
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <Blob color="#ddd6fe" size="xl" className="-top-20 -right-20" />
      <Blob color="#bae6fd" size="lg" className="bottom-10 left-10" delay animated />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Nagrania & Materiały</h1>
          <p className="text-gray-500 mt-1">Przewodnik po procesie tworzenia notatek z lekcji</p>
        </motion.div>

        {/* Flow steps indicator */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6 overflow-x-auto pb-1"
        >
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = badgeCounts[tab.id];
            return (
              <div key={tab.id} className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-card'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.id === 'processing' && processingCount > 0 ? 'animate-spin' : ''}`} />
                  <span>{tab.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                      isActive ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
                {idx < tabs.length - 1 && (
                  <div className="w-6 h-px bg-gray-200 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Active tab description */}
        <div className="mb-4 flex items-center gap-2">
          {(() => {
            const tab = tabs.find(t => t.id === activeTab);
            if (!tab) return null;
            const Icon = tab.icon;
            return (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Icon className="w-4 h-4 text-violet-400" />
                <span>{tab.description}</span>
              </div>
            );
          })()}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'pending' && (
              <PendingTab
                onCreateNote={handleCreateNote}
                onReject={handleReject}
                rejectedIds={rejectedIds}
              />
            )}
            {activeTab === 'processing' && (
              <ProcessingTab processingIds={processingIds} />
            )}
            {activeTab === 'notes' && (
              <NotesTab
                deletedNoteIds={deletedNoteIds}
                onDeleteNote={handleDeleteNote}
              />
            )}
            {activeTab === 'shared' && <SharedTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
