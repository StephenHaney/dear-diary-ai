import React, { useRef, useEffect, forwardRef } from 'react';
import * as Tone from 'tone';
import { Tree } from './Tree';
import { melodies } from '../melodies';
import { toNote } from './utils/midiHelpers';

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

const chords: Record<string, string[]> = {
  Am: ['A3', 'E4', 'G5'],
};
const chordKeys: Record<string, string[]> = {
  '.': chords.Am,
  '!': chords.Am,
  '?': chords.Am,
};

const JournalScreen = () => {
  const noteIndex = useRef(0);
  const treeIndex = useRef(0);
  const treeCoverOpacityChange = useRef('0');

  return (
    <>
      <textarea
        style={{
          position: 'relative',
          zIndex: 3,
          boxSizing: 'border-box',
          height: '99vh',
          width: '100%',
          maxWidth: '700px',
          fontSize: '30px',
          border: 0,
          resize: 'none',
          outline: 'none',
          color: '#333',
          paddingTop: '60px',
          paddingBottom: '60px',
          paddingLeft: '60px',
          paddingRight: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}
        placeholder="How are you feeling?"
        onChange={(e) => {
          const newValue = e.currentTarget.value;
          const lastCharacter = newValue[newValue.length - 1];
          if (lastCharacter === ' ' || lastCharacter === '.' || lastCharacter === '!' || lastCharacter === '?') {
            // Score the text
            // fetch('/api/sentiment', {
            //   method: 'post',
            //   body: JSON.stringify({
            //     sample: e.currentTarget.value,
            //   }),
            // }).then((res) => {
            //   if (res.status === 200) {
            //     try {
            //       res.json().then((result) => {
            //         console.log(result);
            //       });
            //     } catch (e) {
            //       console.log(e);
            //     }
            //   }
            // });
          }
        }}
        onKeyDown={(e) => {
          const shouldBeSilent = silentKeys[e.key];
          if (shouldBeSilent === false || e.metaKey || e.ctrlKey || e.altKey) {
            // Don't play a sound for this key
            return;
          }

          const chord = chordKeys[e.key];
          if (chord) {
            // Play a chord for this key
            sampler.triggerAttackRelease(chord, 2, undefined, 0.25);
          } else {
            // Play the next note in the sequence
            const nextKey = melodies[1].notes![noteIndex.current];
            const nextNote = toNote(nextKey.pitch!);

            // Randomize velocity between 0.1 and 0.2, but mostly hit 0.2
            const velocity = Math.max(Math.min(Math.random() / 2, 0.2), 0.1);
            sampler.triggerAttackRelease([nextNote], 4, undefined, velocity);

            // Hide a new svg cover every N keystrokes:
            const coverCount = Math.floor(treeIndex.current / 6);
            const treeBranch = document.querySelector('#cover-' + coverCount) as SVGElement;
            if (treeBranch) {
              treeBranch.style.transition = 'opacity 0.5s ease-in';
              treeBranch.style.opacity = treeCoverOpacityChange.current;
            }
            // Hard coding magic numberz for JAM spririt... update this if we want multiple graphics later
            if (coverCount === 21) {
              // We've hit the end of the tree, start over
              treeIndex.current = 0;
              treeCoverOpacityChange.current = treeCoverOpacityChange.current === '1' ? '0' : '1';
            }

            // +/- 1 to the tree index
            treeIndex.current += 1;
            // +1 to the note index
            noteIndex.current += 1;
            if (noteIndex.current === melodies[1].notes!.length) {
              // Restart the melody if we've run out of notes
              noteIndex.current = 0;
            }
          }
        }}
      ></textarea>

      <Tree />
    </>
  );
};

export default JournalScreen;
