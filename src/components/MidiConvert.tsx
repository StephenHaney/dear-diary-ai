import { useEffect } from 'react';
import * as mm from '@magenta/music/es6';

const MidiConvert = () => {
  useEffect(() => {
    const sequence = mm
      .urlToNoteSequence('/happy-4-2020-08-30.mid')
      .then((sequence) => console.log(JSON.stringify(sequence)));
  }, []);

  return <div>Check the console</div>;
};

export default MidiConvert;
