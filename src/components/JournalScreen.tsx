import React, { useRef, useEffect } from 'react';
import * as mm from '@magenta/music/es6';
import * as Tone from 'tone';
import { Tree } from './Tree';

const seedSequence: mm.INoteSequence = {
  notes: [
    { pitch: 57, program: 24 }, // a3
    { pitch: 60, program: 24 }, // c4
    { pitch: 64, program: 24 }, // e4
    { pitch: 69, program: 24 }, // a4
    { pitch: 71, program: 24 }, // b4
    { pitch: 64, program: 24 }, // e4
    { pitch: 60, program: 24 }, // c4
    { pitch: 71, program: 24 }, // b4
    { pitch: 72, program: 24 }, // c5
    { pitch: 64, program: 24 }, // e4
    { pitch: 60, program: 24 }, // c4
    { pitch: 72, program: 24 }, // c5
    { pitch: 66, program: 24 }, // f#4
    { pitch: 62, program: 24 }, // d4
    { pitch: 57, program: 24 }, // a3
    { pitch: 66, program: 24 }, // f#4
    { pitch: 64, program: 24 }, // e4
    { pitch: 60, program: 24 }, // c4
    { pitch: 57, program: 24 }, // a3
    { pitch: 64, program: 24 }, // e4
    { pitch: 60, program: 24 }, // c4
    { pitch: 57, program: 24 }, // a3
    { pitch: 55, program: 24 }, // g3
    { pitch: 57, program: 24 }, // a3
    { pitch: 57, program: 24 }, // a3
  ],
  quantizationInfo: { stepsPerQuarter: 4 },
  tempos: [{ time: 0, qpm: 120 }],
  totalQuantizedSteps: 24,
};

let playSequence: mm.INoteSequence = {};

const sampler = new Tone.Sampler({
  urls: {
    C4: 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    A4: 'A4.mp3',
  },
  release: 1,
  baseUrl: 'https://tonejs.github.io/audio/salamander/',
}).toDestination();

const musicGen = new mm.MusicRNN(
  'https://storage.googleapis.com/download.magenta.tensorflow.org/tfjs_checkpoints/music_rnn/chord_pitches_improv'
);
musicGen.initialize().then(() => {
  musicGen.continueSequence(seedSequence, 100, 1.1, ['Am', 'G', 'F', 'F']).then((value) => {
    playSequence = value;
    for (const note of playSequence.notes!) {
      note.program = 24;
      note.quantizedStartStep = undefined;
      note.quantizedEndStep = undefined;
    }
  });
});

const silentKeys: Record<string, boolean> = {
  Shift: false,
  Escape: false,
  Enter: false,
  Meta: false,
  Control: false,
  Alt: false,
  Tab: false,
  ' ': false,
  Backspace: false,
  Delete: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

const chords: Record<string, number[]> = {
  Am: [57, 64, 79],
};
const chordKeys: Record<string, number[]> = {
  '.': chords.Am, // A3 E4 G5
};

// Load the chord sounds if they're not already
// for (const chord of Object.values(chords)) {
//   for (const chordNote of chord) {
//     chordsNotes.add(chordNote);
//   }
// }
// const chordNotesAsArray = Array.from(chordsNotes);

const JournalScreen = () => {
  const currentIndex = useRef(0);
  const totalCount = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <>
      <textarea
        ref={textareaRef}
        style={{
          boxSizing: 'border-box',
          height: '99vh',
          width: '100%',
          maxWidth: '600px',
          fontSize: '30px',
          border: 0,
          resize: 'none',
          outline: 'none',
          color: '#333',
          paddingTop: '60px',
          paddingBottom: '60px',
          paddingLeft: '30px',
          paddingRight: '30px',
        }}
        placeholder="Tell me your story"
        onKeyDown={(e) => {
          const shouldBeSilent = silentKeys[e.key];
          if (shouldBeSilent === false || e.metaKey || e.ctrlKey || e.altKey) {
            // Don't play a sound for this key
            return;
          }

          const chord = chordKeys[e.key];
          if (chord) {
            // Play a chord for this key
            for (const note of chord) {
              // TODO
            }
          } else {
            // Play the next note in the sequence
            // const note = playSequence.notes![currentIndex.current];
            //  TODO tone
            sampler.triggerAttackRelease(['Eb4'], 4, undefined, 0.2);

            // Hide a new svg cover every 5 keystrokes:
            const coverCount = Math.floor(totalCount.current / 5);
            const treeBranch = document.querySelector('#cover-' + coverCount) as SVGElement;
            if (treeBranch) {
              treeBranch.style.transition = 'opacity 0.5s ease-in';
              treeBranch.style.opacity = '0';
            }

            currentIndex.current += 1;
            totalCount.current += 1;
            if (currentIndex.current === playSequence.notes!.length) {
              currentIndex.current = 0;
            }
          }
        }}
      ></textarea>

      <Tree />
    </>
  );
};

export default JournalScreen;
