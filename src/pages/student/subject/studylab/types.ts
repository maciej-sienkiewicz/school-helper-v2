import type { StudentLesson } from '../../../../types';

export interface Flashcard {
  front: string;
  back: string;
  lessonTopic: string;
  color: string;
}

export function extractFlashcards(lessons: StudentLesson[]): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const lesson of lessons) {
    if (!lesson.noteContent) continue;
    let heading = '';
    let body: string[] = [];
    for (const line of lesson.noteContent.split('\n')) {
      if (line.startsWith('## ')) {
        if (heading && body.some(l => l.trim())) {
          cards.push({ front: heading, back: body.join('\n'), lessonTopic: lesson.topicName, color: lesson.thumbnailColor });
        }
        heading = line.slice(3);
        body = [];
      } else if (heading && !line.startsWith('# ')) {
        body.push(line);
      }
    }
    if (heading && body.some(l => l.trim())) {
      cards.push({ front: heading, back: body.join('\n'), lessonTopic: lesson.topicName, color: lesson.thumbnailColor });
    }
  }
  return cards;
}
