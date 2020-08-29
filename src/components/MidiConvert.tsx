import { useEffect } from 'react';
import * as mm from '@magenta/music/es6';

const MidiConvert = () => {
  useEffect(() => {
    const sequence = mm
      .urlToNoteSequence('/happy-2020-08-27.mid')
      .then((sequence) => console.log(JSON.stringify(sequence)));
  }, []);

  return <div>Check the console</div>;
};

export default MidiConvert;
