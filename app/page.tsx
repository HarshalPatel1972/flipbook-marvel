import IntroLoader from './components/IntroLoader';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-500 selection:text-white flex items-center justify-center">
      <IntroLoader />
    </main>
  );
}
