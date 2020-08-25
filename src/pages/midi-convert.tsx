import dynamic from 'next/dynamic';

// All output is to the console
const Output = () => {
  const MidiConverter = dynamic(() => import('../components/MidiConvert'), {
    ssr: false,
  });

  return <MidiConverter />;
};
export default Output;
