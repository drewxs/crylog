import dynamic from 'next/dynamic';

export const MDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});
