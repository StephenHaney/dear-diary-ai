import Head from 'next/head';
import dynamic from 'next/dynamic';

export default function Home() {
  const JournalScreen = dynamic(() => import('../components/JournalScreen'), {
    ssr: false,
  });

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

      <JournalScreen />
    </>
  );
}
