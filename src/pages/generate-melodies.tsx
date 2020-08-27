import dynamic from 'next/dynamic';

// All output is to the console
const Output = () => {
  const GenerateMelodies = dynamic(() => import('../components/GenerateMelodies'), {
    ssr: false,
  });

  return <GenerateMelodies />;
};
export default Output;
