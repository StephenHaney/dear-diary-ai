import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';

export default function Home() {
  const JournalScreen = dynamic(() => import('../components/JournalScreen'), {
    ssr: false,
  });

  const loadingCoverRef = useRef<HTMLDivElement>(null);
  const windRef = useRef<HTMLAudioElement>(null);
  const journalTextRef = useRef<HTMLTextAreaElement>(null);
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          flexDirection: 'column',
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
      <JournalScreen />
    </>
  );
}
