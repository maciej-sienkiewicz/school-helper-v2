import { useState, useEffect } from 'react';

export interface UserFlashcard {
  id: string;
  front: string;
  back: string;
  sourceText: string;
  noteTopicName: string;
  createdAt: string;
}

let _cards: UserFlashcard[] = [];
const _listeners = new Set<() => void>();

export const flashcardStore = {
  add(card: Omit<UserFlashcard, 'id' | 'createdAt'>): UserFlashcard {
    const newCard: UserFlashcard = {
      ...card,
      id: `ufc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    _cards = [..._cards, newCard];
    _listeners.forEach(l => l());
    return newCard;
  },
  getAll(): UserFlashcard[] {
    return _cards;
  },
  remove(id: string): void {
    _cards = _cards.filter(c => c.id !== id);
    _listeners.forEach(l => l());
  },
  subscribe(listener: () => void): () => void {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  },
};

export function useUserFlashcards(): UserFlashcard[] {
  const [cards, setCards] = useState<UserFlashcard[]>(_cards);
  useEffect(() => flashcardStore.subscribe(() => setCards(flashcardStore.getAll())), []);
  return cards;
}
