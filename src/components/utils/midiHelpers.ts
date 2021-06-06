/**
 * Convert a midi note to a pitch class (just the pitch no octave)
 * Credit: https://github.com/Tonejs/Midi/blob/master/src/Note.ts
 */
function midiToPitchClass(midi: number): string {
  const scaleIndexToNote = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = midi % 12;
  return scaleIndexToNote[note];
}

/**
 * Convert a midi note into a pitch
 */
export function toNote(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return midiToPitchClass(midi) + octave.toString();
}
