import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase/initFirebase';
import { Entry } from '../../firebase/createEntry';
import dynamic from 'next/dynamic';
import * as Tone from 'tone';
import { persistEventIsSelection, persistEventIsKey } from '../../firebase/persistKeys';
import styled from '@emotion/styled';

const PlayButton = styled.button({
  outline: 'none',
  background: 'transparent',
  opacity: '0',
  cursor: 'pointer',
  padding: '30px',
  border: 0,
  transition: 'transform 1s ease-out, opacity 1s ease-out',
  '&:hover': {
    transform: 'scale(1.07)',
  },
  '&:active': {
    transform: 'scale(1.03)',
  },
});

const EntryPlayback = () => {
  const router = useRouter();
  const { entryId } = router.query;

  const [entryData, setEntryData] = useState<Entry | null>(null);
  const [samplerIsReady, setSamplerIsReady] = useState(false);
  const [ambienceIsReady, setAmbienceIsReady] = useState(false);

  const sampler = useRef<Tone.Sampler>();
  const ambiencePlayer = useRef<Tone.Player>();
  const loadingCoverRef = useRef<HTMLDivElement>(null);

  const JournalScreen = dynamic(() => import('../../components/JournalScreen'), {
    ssr: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sampler.current = new Tone.Sampler({
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

        baseUrl: '/samples/',
        onload: () => setSamplerIsReady(true),
      }).toDestination();

      ambiencePlayer.current = new Tone.Player('/samples/wind-birbs.mp3', () =>
        setAmbienceIsReady(true)
      ).toDestination();
      ambiencePlayer.current.volume.value = -33;
      ambiencePlayer.current.loop = true;
    }
  }, []);

  function handlePlayClick() {
    Tone.start().then(() => {
      // Play the ambience:
      if (ambiencePlayer.current?.state !== 'started') {
        ambiencePlayer.current?.start();
      }
      loadingCoverRef.current!.style.transition = 'opacity 500ms ease-out';
      loadingCoverRef.current!.style.opacity = '0';

      setTimeout(() => {
        loadingCoverRef.current!.style.display = 'none';

        setTimeout(() => {
          let lastKeyTime = 0;
          let runningSquish = 0;
          // Don't do this, just moving fast for the JAM! Use a ref
          const textArea = document.querySelector('textarea');

          if (textArea && entryData!.events) {
            // Keep track of "squished" time we remove from big gaps
            for (const [time, event] of Object.entries(entryData!.events)) {
              // Adjust the playtime for any time we've skipped earlier
              let playTime = parseInt(time) - runningSquish;
              // If there's more than 1 second between notes, squish it down to 1s:
              const timeGap = playTime - lastKeyTime;
              if (timeGap > 1000) {
                // say it's 2500 time gap
                const timeSkipped = timeGap - 1000; // skipping "1500" in this example
                runningSquish += timeSkipped; // add 1500 to running squish
                playTime = playTime - timeSkipped; // adjust the playtime 1500 sooner
              }
              lastKeyTime = playTime;

              if (persistEventIsSelection(event)) {
                // Select event
                setTimeout(() => {
                  textArea.setSelectionRange(event.selectionStart, event.selectionEnd);
                }, playTime);
              } else if (persistEventIsKey(event)) {
                const keychar = event.key;

                setTimeout(() => {
                  if (keychar === 'Backspace') {
                    // If the cursor is at a single place, select -1... otherwise replace the current selection
                    if (textArea.selectionStart === textArea.selectionEnd) {
                      textArea.setSelectionRange(textArea.selectionStart - 1, textArea.selectionEnd);
                    }
                    textArea.setRangeText('');
                  } else if (keychar === 'Enter') {
                    // Fake enter key value:
                    textArea.setRangeText(`\r\n`);
                    textArea.setSelectionRange(textArea.value.length, textArea.value.length);
                  } else {
                    // For normal keys, just add their value:
                    textArea.setRangeText(keychar);
                    textArea.setSelectionRange(textArea.value.length, textArea.value.length);
                  }

                  // Play the notes!
                  for (const note of event.notes) {
                    setTimeout(() => {
                      sampler.current!.triggerAttackRelease([note.note], note.duration, undefined, note.velocity);
                    }, note.delayFromKeyPress);
                  }

                  // Keep the textarea scrolled all the way down
                  textArea.scrollTop = textArea.scrollHeight;
                }, playTime);
              }
            }
          }
        }, 500);
      }, 550);
    });
  }

  useEffect(() => {
    if (entryId && typeof entryId === 'string') {
      db.collection('entries')
        .doc(entryId)
        .get()
        .then((entry) => {
          const entryData = entry.data() as Entry;
          if (entryData) {
            setEntryData(entryData);
          }
        });
    }
  }, [entryId]);

  const ready = samplerIsReady && ambienceIsReady;

  return (
    <>
      {!entryData && (
        <div
          style={{
            position: 'fixed',
            zIndex: 10,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#fff',
          }}
        ></div>
      )}

      <div
        onClick={() => ready && handlePlayClick()}
        ref={loadingCoverRef}
        style={{
          position: 'fixed',
          zIndex: 5,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          flexDirection: 'column',
          opacity: 0.8,
        }}
      >
        <PlayButton style={{ opacity: ready ? 0.8 : 0 }}>
          <h1 style={{ marginBottom: '15px', color: '#282B2E' }}>(sound on)</h1>
          <svg width="29" height="45" viewBox="0 0 29 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 44.6667L-1.93787e-06 0.333346L28.5 22.5L0 44.6667Z" fill="#282B2E" />
          </svg>
        </PlayButton>
      </div>

      {ready && <JournalScreen readonly={true} sampler={sampler.current!} />}
    </>
  );
};

export default EntryPlayback;
