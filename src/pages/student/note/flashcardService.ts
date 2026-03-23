/** Mock server – generates a flashcard from selected note text. */
export async function generateFlashcard(
  text: string,
): Promise<{ front: string; back: string }> {
  await new Promise(r => setTimeout(r, 850)); // simulate latency

  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);

  const front =
    trimmed.length <= 70
      ? `Wyjaśnij: „${trimmed}"`
      : `Co opisuje poniższy fragment? „${words.slice(0, 7).join(' ')}…"`;

  return { front, back: trimmed };
}
