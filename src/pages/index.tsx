import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRef } from 'react';

export default function Home() {
  const JournalScreen = dynamic(() => import('../components/JournalScreen'), {
    ssr: false,
  });

  const loadingCoverRef = useRef<HTMLDivElement>(null);
  const windRef = useRef<HTMLAudioElement>(null);

  function handleStartClick() {
    windRef.current!.play();
    windRef.current!.volume = 0.3;
    loadingCoverRef.current!.style.transition = 'opacity 500ms ease-out';
    loadingCoverRef.current!.style.opacity = '0';

    setTimeout(() => {
      loadingCoverRef.current!.style.display = 'none';
    }, 550);
  }

  return (
    <>
      <Head>
        <title>One Story, One Song</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="google" content="notranslate" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@432&display=swap" rel="stylesheet" />

        <style>{`
          body {
            margin: 0;
            overscroll-behavior: none;
            font-family: Lora;
            width: 100vw;
            height: 100vh;
          }
          `}</style>
      </Head>

      <div
        ref={loadingCoverRef}
        onClick={handleStartClick}
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
        }}
      >
        <button
          style={{
            marginTop: '30px',
            outline: 'none',
            background: 'white',
            border: '3px solid #333',
            padding: '20px',
            paddingLeft: '40px',
            paddingRight: '40px',
            fontSize: '40px',
            borderRadius: '50px',
            opacity: '0.8',
            cursor: 'pointer',
          }}
        >
          Enter the forest
        </button>
      </div>
      <audio ref={windRef} loop={true}>
        <source src="/wind-birbs.mp3" type="audio/mpeg" />
      </audio>
      <JournalScreen />
    </>
  );
}
