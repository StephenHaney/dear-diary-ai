import React, { useRef } from 'react';
import * as mm from '@magenta/music/es6';

const sequence: mm.INoteSequence = {
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
  totalTime: 8,
};
// const player = new mm.Player();
const player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
player.loadSamples(sequence);

// Pop that player onto our window so we can inspect it easily
(window as any).player = player;

const specialKeys: Record<string, boolean> = {
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

const JournalScreen = () => {
  const currentIndex = useRef(0);

  return (
    <div style={{ paddingTop: '60px', paddingBottom: '60px', paddingLeft: '30px', paddingRight: '30px' }}>
      <textarea
        style={{
          height: '300px',
          width: '600px',
          minWidth: '300px',
          fontSize: '30px',
          border: 0,
          resize: 'none',
          outline: 'none',
          color: '#333',
        }}
        placeholder="Start typing . . ."
        onKeyDown={(e) => {
          const specialInstructions = specialKeys[e.key];
          if (specialInstructions === false) {
            // Don't play a sound for this key
            return;
          }
          const note = sequence.notes![currentIndex.current];

          player.playNoteDown(note);
          player.playNoteUp(note);
          currentIndex.current += 1;
          if (currentIndex.current === sequence.notes!.length) {
            currentIndex.current = 0;
          }
        }}
      ></textarea>
    </div>
  );
};

export default JournalScreen;
