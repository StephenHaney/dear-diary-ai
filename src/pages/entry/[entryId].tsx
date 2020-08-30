import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase/initFirebase';
import { Entry } from '../../firebase/createEntry';
import dynamic from 'next/dynamic';

const EntryPlayback = () => {
  const router = useRouter();
  const { entryId } = router.query;
  const [entryData, setEntryData] = useState<Entry | null>(null);

  const JournalScreen = dynamic(() => import('../../components/JournalScreen'), {
    ssr: false,
  });

  useEffect(() => {
    if (entryId && typeof entryId === 'string') {
      db.collection('entries')
        .doc(entryId)
        .get()
        .then((entry) => {
          const entryData = entry.data() as Entry;
          if (entryData) {
            setEntryData(entryData);
            // FIX
            setTimeout(() => {
              let lastKeyTime = 0;
              // Don't do this, just moving fast for the JAM! Use a ref
              const textArea = document.querySelector('textarea');
              for (const [time, keychar] of Object.entries(entryData.keys)) {
                // If there's more than 1 second between notes, squish it down to 1s:
                const playTime = parseInt(time) - lastKeyTime > 1000 ? lastKeyTime + 1000 : parseInt(time);
                lastKeyTime = playTime;

                if (textArea) {
                  setTimeout(() => {
                    textArea.dispatchEvent(
                      new KeyboardEvent('keydown', { key: keychar, bubbles: true, cancelable: true })
                    );

                    textArea.value += keychar;
                  }, playTime);
                }
              }
            }, 500);
          }
        });
    }
  }, [entryId]);

  if (entryData === null) {
    return null;
  }

  return <JournalScreen readonly={true} />;
};

export default EntryPlayback;
