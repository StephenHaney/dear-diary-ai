import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRef, useEffect, useLayoutEffect } from 'react';
import '../firebase/initFirebase';
import { generateEntry } from '../firebase/createEntry';
import { useRouter } from 'next/router';
import * as Tone from 'tone';

let sampler: Tone.Sampler;
if (typeof window !== 'undefined') {
  sampler = new Tone.Sampler({
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
}

export default function Home() {
  const router = useRouter();

  const JournalScreen = dynamic(() => import('../components/JournalScreen'), {
    ssr: false,
  });

  const loadingCoverRef = useRef<HTMLDivElement>(null);
  const windRef = useRef<HTMLAudioElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const startMessages = [
    `So tell me a story`,
    `Journal. It will help.`,
    `Take a moment`,
    `Take a breath`,
    `Time will keep flowing`,
    `When can I get my hair cut?`,
    `Let's adopt a dog`,
    `Let it all out`,
    `Begin`,
  ];

  useEffect(() => {
    let messageCounter = 1;
    clearInterval((window as any).buttonInterval);
    (window as any).buttonInterval = setInterval(() => {
      const newMessage = startMessages[messageCounter];

      headlineRef.current!.innerText = newMessage;

      messageCounter = messageCounter + 1;
      if (messageCounter > startMessages.length - 1) {
        messageCounter = 0;
      }
    }, 2600);

    // Clean up
    return () => {
      clearInterval((window as any).buttonInterval);
    };
  }, []);

  function handleStartClick() {
    windRef.current!.play();
    windRef.current!.volume = 0.05;
    loadingCoverRef.current!.style.transition = 'opacity 500ms ease-out';
    loadingCoverRef.current!.style.opacity = '0';

    // Stop the button text from changing
    clearInterval((window as any).buttonInterval);

    setTimeout(() => {
      loadingCoverRef.current!.style.display = 'none';
      // Don't do this, use a ref, just moving fast for the JAM! since forwardRef is being weird
      document.querySelector('textarea')?.focus();
    }, 550);

    generateEntry().then((newId) => {
      history.replaceState({ entryId: newId }, 'New entry', `entry/${newId}`);
    });
  }

  const skipSplash = typeof router.query.write !== 'undefined';
  if (skipSplash) {
    handleStartClick();
  }

  return (
    <>
      <Head>
        <title>Dear Diary AI</title>
      </Head>
      <div
        ref={loadingCoverRef}
        style={{
          position: 'fixed',
          zIndex: 5,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          flexDirection: 'column',
          display: skipSplash ? 'none' : 'flex',
        }}
      >
        <h1 ref={headlineRef}>{startMessages[0]}</h1>
        <button
          onClick={handleStartClick}
          style={{
            marginTop: '30px',
            outline: 'none',
            background: 'white',
            border: '3px solid #333',
            padding: '15px',
            paddingLeft: '40px',
            paddingRight: '40px',
            fontSize: '20px',
            borderRadius: '50px',
            opacity: '0.8',
            cursor: 'pointer',
          }}
        >
          Begin
        </button>
      </div>
      <audio ref={windRef} loop={true}>
        <source src="/wind-birbs.mp3" type="audio/mpeg" />
      </audio>
      <JournalScreen sampler={sampler} />
    </>
  );
}
