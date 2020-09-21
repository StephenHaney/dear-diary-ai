import React, { useRef, useEffect, forwardRef, useCallback } from 'react';
import { Tree } from './Tree';
import { melodies } from '../melodies';
import { toNote } from './utils/midiHelpers';
import debounce from 'lodash.debounce';
import * as Tone from 'tone';
import throttle from 'lodash.debounce';
import { persistKeys, dbSelectionEvent, dbKeyPress } from '../firebase/persistKeys';
import { ShareAndAbout } from './ShareAndAbout';
import { ProductHuntBadge } from './ProductHuntBadge';
import styled from '@emotion/styled';

const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

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
  'CapsLock',
  'Home',
  'End',
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

const JournalTextArea = styled.textarea({
  position: 'relative',
  zIndex: 3,
  boxSizing: 'border-box',
  height: 'calc(100vh - 180px)',
  width: '100%',
  maxWidth: '700px',
  fontSize: '33px',
  border: 0,
  resize: 'none',
  outline: 'none',
  color: '#333',
  paddingTop: '60px',
  paddingBottom: '60px',
  paddingLeft: '20px',
  paddingRight: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',

  '@media (min-width: 768px)': {
    height: 'calc(100vh - 110px)',
    paddingTop: '60px',
    paddingBottom: '60px',
    paddingLeft: '60px',
    paddingRight: '30px',
  },
});

type Props = {
  readonly?: boolean;
  sampler: Tone.Sampler;
};
const JournalScreen = ({ readonly = false, sampler }: Props) => {
  const noteIndex = useRef(0);
  const treeIndex = useRef(0);
  const treeCoverOpacityChange = useRef('0');
  const lastNotePlayed = useRef('C3');

  const unsavedPersists = useRef<Array<dbKeyPress | dbSelectionEvent>>([]);
  const lastSelectionWasAtLength = useRef(true);
  const firstKeyPressTime = useRef(0);
  const currentSentiment = useRef(0.5);

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

  const readSentiment = useCallback(
    throttle(
      (sample: string) =>
        // Score the text
        fetch('/api/sentiment', {
          method: 'post',
          body: JSON.stringify({ sample }),
        }).then((res) => {
          if (res.status === 200) {
            try {
              res.json().then((result) => {
                // Assign the new sentiment score as a 0-1 scale
                currentSentiment.current = Number.isFinite(result.sentiment)
                  ? Math.min(Math.max((result.sentiment + 1) / 2, 0), 1)
                  : 0.5;

                console.log('new sentiment ' + currentSentiment.current);
              });
            } catch (e) {
              console.log(e);
            }
          }
        }),
      1000,
      { leading: true, trailing: true }
    ),
    []
  );

  return (
    <>
      <JournalTextArea
        spellCheck="false"
        autoFocus={true}
        readOnly={readonly}
        disabled={readonly}
        onSelect={(e) => {
          if (!readonly) {
            const textarea = e.currentTarget;
            const selectionStart = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;

            if (selectionStart === selectionEnd && selectionStart === textarea.textLength) {
              // Bail if the selection is at the end, and the previous selection was at the end
              // We don't need this info as it will happen automatically and we can save some space
              if (lastSelectionWasAtLength.current === true) {
                return;
              }
              lastSelectionWasAtLength.current = true;
            } else {
              lastSelectionWasAtLength.current = false;
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
        placeholder="How are you feeling? &#10;Start typing"
        onChange={(e) => {
          if (!readonly) {
            persist();
          }
          const newValue = e.currentTarget.value;
          const lastCharacter = newValue[newValue.length - 1];

          if (lastCharacter === ' ' || lastCharacter === '.' || lastCharacter === '!' || lastCharacter === '?') {
            const totalEntry = e.currentTarget.value;
            // Move the sentiment with the most recent writing:
            const recentWriting = totalEntry.substring(totalEntry.length - 65);
            readSentiment(recentWriting);
          }
        }}
        onKeyDown={(e) => {
          if (firstKeyPressTime.current === 0) {
            firstKeyPressTime.current = Date.now();
          }

          // Bail early for OS key combos
          if (e.metaKey || e.ctrlKey) {
            return;
          }

          const dbKey: dbKeyPress = {
            type: 'key',
            key: e.key,
            timeFromBegin: Date.now() - firstKeyPressTime.current,
            notes: [],
          };

          if (ignoreKeysForPersist.has(e.key) === false) {
            // Add this key press to the list to be persisted at the next save event
            // The notes will get filled in before the persist happens
            unsavedPersists.current.push(dbKey);
          }

          // If it's a silent key, bail out:
          const shouldBeSilent = silentKeys[e.key];
          if (shouldBeSilent === false) {
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
            const duration = 4;

            for (const note of chordToUse) {
              setTimeout(() => {
                sampler.triggerAttackRelease([note], duration, undefined, velocity);
              }, delay);
              // Add it to the DB copy:
              dbKey.notes.push({ note: note, duration, velocity, delayFromKeyPress: delay });

              // Play the chord slower and lighter as it goes:
              if (delay === 0) {
                delay = 65;
              } else {
                delay *= 2;
              }
              velocity = velocity - 0.175 * velocity;
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
              const velocity = 0.15;
              const duration = 3;
              sampler.triggerAttackRelease([noteWithOctave], duration, undefined, velocity);
              // Add it to the DB copy:
              dbKey.notes.push({ note: noteWithOctave, duration, velocity, delayFromKeyPress: 0 });

              lastNotePlayed.current = noteWithOctave;
            }

            return;
          }

          // Play the next note in the sequence
          // console.log('sentiment score: ' + currentSentiment.current);
          const melodyIndex = Math.round(melodies.length * currentSentiment.current);
          console.log({ melodyIndex });
          const melody = melodies[melodyIndex] ?? melodies[0];

          let nextKey;
          if (noteIndex.current > melody.notes.length - 1) {
            // If we're above this melody's last note, use the last note:
            nextKey = melody.notes[melody.notes.length - 1];
          } else {
            // Otherwise, use the key at this index:
            nextKey = melody.notes[noteIndex.current];
          }
          const nextNote = toNote(nextKey.pitch!);

          // Randomize velocity between 0.1 and 0.2, but mostly hit 0.2
          const velocity = Math.max(Math.min(Math.random() / 2, 0.2), 0.1);
          const duration = 3;
          sampler.triggerAttackRelease([nextNote], duration, undefined, velocity);
          // Add it to the DB copy:
          dbKey.notes.push({ note: nextNote, duration, velocity, delayFromKeyPress: 0 });

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
      ></JournalTextArea>

      <Tree />

      <ShareAndAbout readonly={readonly} />

      {/* <ProductHuntBadge /> */}
    </>
  );
};

export default JournalScreen;
