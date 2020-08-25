import { useEffect } from 'react';
import * as mm from '@magenta/music/es6';

const MidiConvert = () => {
  useEffect(() => {
    const sequence = mm.urlToNoteSequence('/sad.mid').then((sequence) => console.log(sequence));
  }, []);

  return <div>Check the console</div>;
};

export default MidiConvert;
