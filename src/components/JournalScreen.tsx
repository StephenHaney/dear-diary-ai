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

const chords: Record<string, number[]> = {
  Am: [57, 64, 79],
};
const chordKeys: Record<string, number[]> = {
  '.': chords.Am, // A3 E4 G5
};

const JournalScreen = () => {
  const currentIndex = useRef(0);
  const totalCount = useRef(0);

  return (
    <>
      <textarea
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
          paddingLeft: '60px',
          paddingRight: '30px',
        }}
        placeholder="How are you feeling?"
        onChange={(e) => {
          const newValue = e.currentTarget.value;
          const lastCharacter = newValue[newValue.length - 1];
          if (lastCharacter === ' ' || lastCharacter === '.' || lastCharacter === '!' || lastCharacter === '?') {
            // Score the text
            fetch('/api/sentiment', {
              method: 'post',
              body: JSON.stringify({
                sample: e.currentTarget.value,
              }),
            }).then((res) => {
              if (res.status === 200) {
                try {
                  res.json().then((result) => {
                    console.log(result);
                  });
                } catch (e) {
                  console.log(e);
                }
              }
            });
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
            for (const note of chord) {
              // TODO
            }
          } else {
            // Play the next note in the sequence
            const nextKey = melodies[1].notes![currentIndex.current];
            const nextNote = toNote(nextKey.pitch!);
            sampler.triggerAttackRelease([nextNote], 4, undefined, 0.2);

            // Hide a new svg cover every 5 keystrokes:
            const coverCount = Math.floor(totalCount.current / 5);
            const treeBranch = document.querySelector('#cover-' + coverCount) as SVGElement;
            if (treeBranch) {
              treeBranch.style.transition = 'opacity 0.5s ease-in';
              treeBranch.style.opacity = '0';
            }

            totalCount.current += 1;
            currentIndex.current += 1;
            if (currentIndex.current === melodies[1].notes!.length) {
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

/*
- chords for certain keys
- interpolate real melodies
- bounce around based on sentiment score
- updating URL on key change
- add logrocket and GA
- about us icon / modal
- playback mode
- shoot video (each)
- double check Safari bug
*/
