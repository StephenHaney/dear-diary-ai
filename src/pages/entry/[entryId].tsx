import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase/initFirebase';
import { Entry } from '../../firebase/createEntry';
import dynamic from 'next/dynamic';

const EntryPlayback = () => {
  const router = useRouter();
  const { entryId } = router.query;
  const [entryData, setEntryData] = useState<Entry | null>(null);

  const loadingCoverRef = useRef<HTMLDivElement>(null);

  const JournalScreen = dynamic(() => import('../../components/JournalScreen'), {
    ssr: false,
  });

  function handlePlayClick() {
    loadingCoverRef.current!.style.transition = 'opacity 500ms ease-out';
    loadingCoverRef.current!.style.opacity = '0';

    setTimeout(() => {
      loadingCoverRef.current!.style.display = 'none';

      // FIX
      setTimeout(() => {
        let lastKeyTime = 0;
        // Don't do this, just moving fast for the JAM! Use a ref
        const textArea = document.querySelector('textarea');
        for (const [time, keychar] of Object.entries(entryData!.keys)) {
          // If there's more than 1 second between notes, squish it down to 1s:
          const playTime = parseInt(time) - lastKeyTime > 1000 ? lastKeyTime + 1000 : parseInt(time);
          lastKeyTime = playTime;
          if (textArea) {
            setTimeout(() => {
              textArea.dispatchEvent(new KeyboardEvent('keydown', { key: keychar, bubbles: true, cancelable: true }));
              textArea.value += keychar;
            }, playTime);
          }
        }
      }, 500);
    }, 550);
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
        <button
          onClick={handlePlayClick}
          style={{
            outline: 'none',
            background: 'transparent',
            opacity: '0.8',
            cursor: 'pointer',
            padding: '30px',
            border: 0,
          }}
        >
          <h1 style={{ marginBottom: '15px', color: '#282B2E' }}>Start</h1>
          <svg width="29" height="45" viewBox="0 0 29 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 44.6667L-1.93787e-06 0.333346L28.5 22.5L0 44.6667Z" fill="#282B2E" />
          </svg>
        </button>
      </div>
      <JournalScreen readonly={true} />
    </>
  );
};

export default EntryPlayback;
