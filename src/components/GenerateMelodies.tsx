import { useEffect } from 'react';
import { MusicVAE, INoteSequence, sequences } from '@magenta/music/es6';
import { toMidi } from './utils/midiHelpers';

const MidiConvert = () => {
  useEffect(() => {
    const vae = new MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_16bar_small_q2');

    const SAD: INoteSequence = {
      ticksPerQuarter: 480,
      timeSignatures: [{ time: 0, numerator: 4, denominator: 4 }],
      tempos: [{ time: 0, qpm: 80 }],
      notes: [
        { pitch: 57, velocity: 76, startTime: 0, endTime: 0.1, program: 0 },
        { pitch: 57, velocity: 71, startTime: 0.5, endTime: 0.5875, program: 0 },
        { pitch: 57, velocity: 93, startTime: 0.75, endTime: 2.96875, program: 0 },
        { pitch: 59, velocity: 100, startTime: 3, endTime: 3.5328124999999995, program: 0 },
        { pitch: 60, velocity: 76, startTime: 3.5734375, endTime: 3.7437499999999995, program: 0 },
        { pitch: 59, velocity: 109, startTime: 3.75, endTime: 5.9937499999999995, program: 0 },
        { pitch: 64, velocity: 117, startTime: 6, endTime: 6.567187499999999, program: 0 },
        { pitch: 65, velocity: 110, startTime: 6.573437499999999, endTime: 6.74375, program: 0 },
        { pitch: 64, velocity: 110, startTime: 6.75, endTime: 8.93125, program: 0 },
        { pitch: 71, velocity: 124, startTime: 9, endTime: 9.5546875, program: 0 },
        { pitch: 72, velocity: 105, startTime: 9.573437499999999, endTime: 9.74375, program: 0 },
        { pitch: 71, velocity: 111, startTime: 9.75, endTime: 10.86875, program: 0 },
        { pitch: 67, velocity: 119, startTime: 10.875, endTime: 11.24375, program: 0 },
        { pitch: 69, velocity: 117, startTime: 11.25, endTime: 12.715625, program: 0 },
      ],
      quantizationInfo: { stepsPerQuarter: 4 },
    };

    const HAPPY: INoteSequence = {
      ticksPerQuarter: 480,
      timeSignatures: [{ time: 0, numerator: 4, denominator: 4 }],
      tempos: [{ time: 0, qpm: 80 }],
      notes: [
        { pitch: 57, velocity: 83, startTime: 0.219791666666667, endTime: 0.465625, program: 0 },
        { pitch: 60, velocity: 89, startTime: 0.469791666666667, endTime: 0.715625, program: 0 },
        { pitch: 64, velocity: 99, startTime: 0.719791666666667, endTime: 1.965625, program: 0 },
        { pitch: 53, velocity: 103, startTime: 1.969791666666667, endTime: 2.215625, program: 0 },
        { pitch: 57, velocity: 80, startTime: 2.219791666666667, endTime: 2.465625, program: 0 },
        { pitch: 60, velocity: 96, startTime: 2.469791666666667, endTime: 2.715625, program: 0 },
        { pitch: 64, velocity: 85, startTime: 2.719791666666667, endTime: 2.965625, program: 0 },
        { pitch: 65, velocity: 83, startTime: 2.969791666666667, endTime: 3.215625, program: 0 },
        { pitch: 64, velocity: 97, startTime: 3.219791666666667, endTime: 3.469791666666667, program: 0 },
        { pitch: 62, velocity: 99, startTime: 3.469791666666667, endTime: 3.715625, program: 0 },
        { pitch: 64, velocity: 97, startTime: 3.719791666666667, endTime: 3.965625, program: 0 },
        { pitch: 53, velocity: 99, startTime: 3.969791666666667, endTime: 4.215625, program: 0 },
        { pitch: 57, velocity: 95, startTime: 4.219791666666667, endTime: 4.465625, program: 0 },
        { pitch: 60, velocity: 90, startTime: 4.469791666666667, endTime: 4.690625, program: 0 },
        { pitch: 62, velocity: 107, startTime: 4.719791666666667, endTime: 5.969791666666667, program: 0 },
        { pitch: 55, velocity: 97, startTime: 5.969791666666667, endTime: 6.215625, program: 0 },
        { pitch: 59, velocity: 63, startTime: 6.219791666666667, endTime: 6.465625, program: 0 },
        { pitch: 62, velocity: 80, startTime: 6.469791666666667, endTime: 6.711458333333333, program: 0 },
        { pitch: 64, velocity: 52, startTime: 6.719791666666667, endTime: 6.965625, program: 0 },
        { pitch: 65, velocity: 111, startTime: 6.969791666666667, endTime: 7.215625, program: 0 },
        { pitch: 64, velocity: 82, startTime: 7.219791666666667, endTime: 7.451041666666667, program: 0 },
        { pitch: 62, velocity: 76, startTime: 7.469791666666667, endTime: 7.715625, program: 0 },
        { pitch: 64, velocity: 98, startTime: 7.719791666666667, endTime: 7.965625, program: 0 },
        { pitch: 55, velocity: 91, startTime: 7.969791666666667, endTime: 8.215625, program: 0 },
        { pitch: 59, velocity: 78, startTime: 8.219791666666667, endTime: 8.465625, program: 0 },
        { pitch: 62, velocity: 71, startTime: 8.469791666666667, endTime: 8.715625, program: 0 },
        { pitch: 64, velocity: 102, startTime: 8.719791666666667, endTime: 9.965625, program: 0 },
        { pitch: 53, velocity: 93, startTime: 9.969791666666667, endTime: 10.215625, program: 0 },
        { pitch: 57, velocity: 87, startTime: 10.219791666666667, endTime: 10.465625, program: 0 },
        { pitch: 60, velocity: 79, startTime: 10.469791666666667, endTime: 10.715625, program: 0 },
        { pitch: 64, velocity: 75, startTime: 10.719791666666667, endTime: 10.948958333333334, program: 0 },
        { pitch: 65, velocity: 91, startTime: 10.969791666666667, endTime: 11.215625, program: 0 },
        { pitch: 64, velocity: 98, startTime: 11.219791666666667, endTime: 11.465625, program: 0 },
        { pitch: 62, velocity: 100, startTime: 11.469791666666667, endTime: 11.715625, program: 0 },
        { pitch: 64, velocity: 94, startTime: 11.719791666666667, endTime: 11.965625, program: 0 },
        { pitch: 62, velocity: 53, startTime: 11.969791666666667, endTime: 12.215625, program: 0 },
        { pitch: 60, velocity: 68, startTime: 12.219791666666666, endTime: 12.465625, program: 0 },
        { pitch: 59, velocity: 82, startTime: 12.469791666666666, endTime: 12.715625, program: 0 },
        { pitch: 53, velocity: 57, startTime: 12.719791666666666, endTime: 12.969791666666666, program: 0 },
      ],
    };

    const quantizedHappy = sequences.quantizeNoteSequence(HAPPY, 4);
    const quantizedSad = sequences.quantizeNoteSequence(SAD, 4);

    vae.initialize().then(() => {
      vae.interpolate([quantizedSad, quantizedHappy], 3).then((melodies) => {
        console.log(JSON.stringify(melodies));
      });
    });
  }, []);

  return <div>Check the console!</div>;
};

export default MidiConvert;
