import React, { useState } from 'react';
import { AboutOverlay } from './AboutOverlay';

type Props = {
  readonly: boolean;
};
export const ShareAndAbout = ({ readonly }: Props) => {
  const [aboutIsOpen, setAboutIsOpen] = useState(false);

  return (
    <>
      {aboutIsOpen && <AboutOverlay setIsOpen={setAboutIsOpen} />}

      <div style={{ position: 'fixed', zIndex: 3, bottom: 20, left: 60, textAlign: 'right', display: 'flex' }}>
        {readonly === false && <button onClick={() => window.location.reload()}>Play back</button>}
        <br />
        <br />
        <button
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=This%20app%20makes%20music%20out%20of%20your%20journal%20entry,%20so%20cool!%20Check%20out%20mine%20and%20make%20yours%20${window.location.href}`
            )
          }
        >
          Share on Twitter
        </button>
        <br />
        <br />
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy playback link</button>
        <br />
        <br />
        <button onClick={() => setAboutIsOpen(true)}>About</button>
      </div>
    </>
  );
};
