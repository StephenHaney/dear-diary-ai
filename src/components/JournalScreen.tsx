import React, { useRef, useEffect, forwardRef, useCallback } from 'react';
import * as Tone from 'tone';
import { Tree } from './Tree';
import { melodies } from '../melodies';
import { toNote } from './utils/midiHelpers';
import debounce from 'lodash.debounce';
import { persistKeys, dbSelectionEvent, dbKeyPress } from '../firebase/persistKeys';
import { read } from 'fs';
import { readOnly } from 'tone/build/esm/core/util/Interface';

const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const sampler = new Tone.Sampler({
  urls: {
    C1: 'C1.mp3',
    'D#1': 'Ds1.mp3',
    'F#1': 'Fs1.mp3',
    A1: 'A1.mp3',
    C2: 'C2.mp3',
    'D#2': 'Ds2.mp3',
    'F#2': 'Fs2.mp3',
    A2: 'A2.mp3',
    C3: 'C3.mp3',
    'D#3': 'Ds3.mp3',
    'F#3': 'Fs3.mp3',
    A3: 'A3.mp3',
    C4: 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    A4: 'A4.mp3',
    C5: 'C5.mp3',
    C6: 'C6.mp3',
  },
  release: 1,

  baseUrl: 'https://tonejs.github.io/audio/salamander/',

  // onload: () => console.log('done'),
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
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

/** Don't persist these keys, we don't use them: */
const ignoreKeysForPersist = new Set([
  'Shift',
  'ArrowLeft',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'Meta',
  'Escape',
  'Control',
  'Alt',
  'Tab',
]);

type chord = string[];
const chords: Record<string, chord> = {
  Am: ['A2', 'E3', 'C3'],
  Am7: ['A2', 'E3', 'C4', 'G4'],
  Amaj9: ['A2', 'E3', 'B3'],
  C: ['C2', 'E3', 'G3'],
  Cmaj7: ['C3', 'E3', 'G4', 'B4'],
  Cmaj9: ['C2', 'E3', 'B3', 'D4'],
  Cmaj7NoRoot: ['E3', 'G4', 'B4'],
};
const chordKeys: Record<string, Array<chord>> = {
  '.': [chords.C, chords.Am, chords.Cmaj7],
  '!': [chords.Cmaj9, chords.Am7],
  '?': [chords.Cmaj7NoRoot],
};

type Props = {
  readonly?: boolean;
};
const JournalScreen = ({ readonly = false }: Props) => {
  const noteIndex = useRef(0);
  const treeIndex = useRef(0);
  const treeCoverOpacityChange = useRef('0');
  const lastNotePlayed = useRef('C3');

  const unsavedPersists = useRef<Array<dbKeyPress | dbSelectionEvent>>([]);
  const firstKeyPressTime = useRef(0);

  /** Throttled save to the DB to persist any unpersisted key presses */
  const persist = useCallback(
    debounce(
      () => {
        const urlPieces = window.location.pathname.split('/');
        const entryId = urlPieces[2];
        if (entryId) {
          persistKeys(entryId, unsavedPersists.current);
          unsavedPersists.current = [];
        }
      },
      1000,
      { leading: true, trailing: true }
    ),
    []
  );

  return (
    <>
      <textarea
        readOnly={readonly}
        disabled={readonly}
        style={{
          position: 'relative',
          zIndex: 3,
          boxSizing: 'border-box',
          height: '99vh',
          width: '100%',
          maxWidth: '700px',
          fontSize: '33px',
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
        onSelect={(e) => {
          if (!readonly) {
            const textarea = e.currentTarget;
            const selectionStart = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;

            if (selectionStart === selectionEnd && selectionStart === textarea.textLength) {
              // Bail if the selection is at the end, which will happen automatically
              return;
            }

            // Add this key press to the list to be persisted at the next save event
            unsavedPersists.current.push({
              type: 'selection',
              selectionStart,
              selectionEnd,
              timeFromBegin: Date.now() - firstKeyPressTime.current,
            });

            persist();
          }
        }}
        placeholder={readonly ? 'How are you feeling?' : 'How are you feeling?           Start typing'}
        onChange={(e) => {
          if (!readonly) {
            persist();
          }
          // const newValue = e.currentTarget.value;
          // const lastCharacter = newValue[newValue.length - 1];
          // if (lastCharacter === ' ' || lastCharacter === '.' || lastCharacter === '!' || lastCharacter === '?') {
          //   // Score the text
          //   fetch('/api/sentiment', {
          //     method: 'post',
          //     body: JSON.stringify({
          //       sample: e.currentTarget.value,
          //     }),
          //   }).then((res) => {
          //     if (res.status === 200) {
          //       try {
          //         res.json().then((result) => {
          //           console.log(result);
          //         });
          //       } catch (e) {
          //         console.log(e);
          //       }
          //     }
          //   });
          // }
        }}
        onKeyDown={(e) => {
          if (firstKeyPressTime.current === 0) {
            firstKeyPressTime.current = Date.now();
          }

          if (ignoreKeysForPersist.has(e.key) === false) {
            // Add this key press to the list to be persisted at the next save event
            unsavedPersists.current.push({
              type: 'key',
              key: e.key,
              timeFromBegin: Date.now() - firstKeyPressTime.current,
            });
          }

          // If it's a silent key, bail out:
          const shouldBeSilent = silentKeys[e.key];
          if (shouldBeSilent === false || e.metaKey || e.ctrlKey || e.altKey) {
            return;
          }

          // If it's a chord key, play the chord:
          let chord = null;
          if (chordKeys[e.key]) {
            const chordToPlayIndex = Math.floor(Math.random() * chordKeys[e.key].length);
            chord = chordKeys[e.key][chordToPlayIndex];

            // Play a chord for this key
            let delay = 0;
            let velocity = 0.25;

            const chordToUse = Math.random() > 0.7 ? chord.reverse() : chord;

            for (const note of chordToUse) {
              setTimeout(() => {
                const velocity = Math.max(Math.min(Math.random() / 2, 0.5), 0.1);
                sampler.triggerAttackRelease([note], 4, undefined, velocity);
              }, delay);

              // Play the chord slower and lighter as it goes:
              if (delay === 0) {
                delay = 65;
              } else {
                delay *= 2;
              }
              velocity = velocity - 0.25;
            }

            return;
          }

          // If it's backspace or delete, descend the scale
          if (e.key === 'Backspace' || e.key === 'Delete') {
            if (e.currentTarget.value.length === 0) {
              // Bail out if there's nothing to delete
              return;
            }
            const note = lastNotePlayed.current.replace(/[^a-z#+]/gi, '');
            const octave = parseInt(lastNotePlayed.current.replace(/[^0-9+]/gi, ''));
            const noteIndex = allNotes.indexOf(note);

            if (noteIndex !== -1) {
              let descendingNote;
              let descendingNoteOctave;

              if (noteIndex === 0) {
                // Reached the root, lower the octave and grab the max child
                descendingNoteOctave = octave - 1;
                descendingNote = allNotes[allNotes.length - 1];
              } else {
                descendingNoteOctave = octave;
                descendingNote = allNotes[noteIndex - 1];
              }

              if (descendingNoteOctave === 0) {
                // If we reach 0, start up high again
                descendingNoteOctave = 5;
              }

              const noteWithOctave = `${descendingNote}${descendingNoteOctave}`;
              sampler.triggerAttackRelease([noteWithOctave], 3, undefined, 0.15);

              lastNotePlayed.current = noteWithOctave;
            }

            return;
          }

          // Play the next note in the sequence
          const nextKey = melodies[1].notes![noteIndex.current];
          const nextNote = toNote(nextKey.pitch!);

          // Randomize velocity between 0.1 and 0.2, but mostly hit 0.2
          const velocity = Math.max(Math.min(Math.random() / 2, 0.2), 0.1);
          sampler.triggerAttackRelease([nextNote], 3, undefined, velocity);

          // Remember the last note we played:
          lastNotePlayed.current = nextNote;

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
        }}
      ></textarea>

      <Tree />
    </>
  );
};

export default JournalScreen;
