export interface Progress {
  blanks: { filled: number; total: number };
  details: { opened: number; total: number };
}

export interface SelectionState {
  text: string;
  x: number; // viewport X – center of selection
  y: number; // viewport Y – top of selection
}

export type FlashcardPhase =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'preview'; card: { front: string; back: string }; sourceText: string }
  | { phase: 'saved' };
