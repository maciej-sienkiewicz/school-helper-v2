import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, BookOpen, School, Camera, Bell, Shield,
  ChevronRight, Sparkles, Star
} from 'lucide-react';
import { Card, SectionTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Blob } from '../../components/ui/Blob';
import { mockTeacher, mockClasses, mockRecordings, mockSharedMaterials } from '../../data/mockData';

const stats = [
  { label: 'Nagrań łącznie', value: mockRecordings.length, color: '#e9d5ff', icon: '🎙️' },
  { label: 'Udostępnionych materiałów', value: mockSharedMaterials.length, color: '#bae6fd', icon: '📤' },
  { label: 'Klas', value: mockClasses.length, color: '#d1fae5', icon: '🏫' },
  { label: 'Uczniów łącznie', value: mockClasses.reduce((s, c) => s + c.studentCount, 0), color: '#fde68a', icon: '👩‍🎓' },
];

const settingsGroups = [
  {
    title: 'Konto',
    items: [
      { icon: <Bell className="w-4 h-4 text-violet-500" />, label: 'Powiadomienia', desc: 'Email i push' },
      { icon: <Shield className="w-4 h-4 text-violet-500" />, label: 'Prywatność i bezpieczeństwo', desc: 'Hasło, 2FA' },
    ],
  },
  {
    title: 'Aplikacja',
    items: [
      { icon: <Sparkles className="w-4 h-4 text-violet-500" />, label: 'Ustawienia AI', desc: 'Język, styl notatek' },
      { icon: <BookOpen className="w-4 h-4 text-violet-500" />, label: 'Domyślna podstawa programowa', desc: 'Edukacja, przedmiot' },
    ],
  },
];

export function Profile() {
  const [name, setName] = useState(mockTeacher.name);
  const [email] = useState(mockTeacher.email);
  const [editing, setEditing] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <Blob color="#d1fae5" size="xl" className="-top-20 -right-20" />
      <Blob color="#e9d5ff" size="lg" className="bottom-20 left-0" delay animated />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative max-w-3xl mx-auto"
      >
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative rounded-4xl overflow-hidden shadow-soft">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />

            <div className="relative p-8 flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
                  {mockTeacher.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Camera className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-extrabold text-white">{name}</h1>
                  <Badge variant="yellow" className="bg-amber-300/30 text-amber-100 ring-amber-300/40">
                    <Star className="w-3 h-3 mr-1" /> Nauczyciel
                  </Badge>
                </div>
                <div className="text-violet-200 text-sm flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> {email}
                </div>
                <div className="text-violet-200 text-sm mt-1 flex items-center gap-2">
                  <School className="w-3.5 h-3.5" /> Szkoła Podstawowa nr 12
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {mockTeacher.subjects.map(s => (
                    <span key={s} className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditing(!editing)}
                className="flex-shrink-0"
              >
                {editing ? 'Anuluj' : 'Edytuj profil'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Edit form */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card padding="lg">
              <SectionTitle icon={<User className="w-4 h-4" />} className="mb-4">Edytuj dane</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Imię i nazwisko</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Email</label>
                  <input
                    value={email}
                    readOnly
                    className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>
              <Button variant="primary" size="md" className="mt-4" onClick={() => setEditing(false)}>
                Zapisz zmiany
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {stats.map(({ label, value, color, icon }) => (
            <Card key={label} padding="md" className="text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2"
                style={{ background: color }}
              >
                {icon}
              </div>
              <div className="text-2xl font-extrabold text-gray-800">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Settings groups */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="space-y-4"
        >
          {settingsGroups.map(group => (
            <Card key={group.title} padding="lg">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Version tag */}
        <div className="mt-8 text-center text-xs text-gray-400">
          SchoolHelper v1.0 MVP · Powered by AI ✨
        </div>
      </motion.div>
    </div>
  );
}
