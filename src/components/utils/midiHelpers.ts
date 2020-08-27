// generates an array where indices correspond to midi notes
// Credit: from https://medium.com/@torinblankensmith/melody-mixer-using-deeplearn-js-to-mix-melodies-in-the-browser-8ad5b42b4d0b
const everyNote = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B,'
  .repeat(20)
  .split(',')
  .map(function (x, i) {
    return x + '' + Math.floor(i / 12);
  });

// returns the midi pitch value for the given note.
// returns -1 if not found
export function toMidi(note: string | number) {
  return everyNote.indexOf(note.toString());
}

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
