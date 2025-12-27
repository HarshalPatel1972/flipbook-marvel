import IntroLoader from './components/IntroLoader';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-500 selection:text-white">
      <IntroLoader />
      
      {/* Hero Content */}
      <section className="relative h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/20" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            CREATIVE
            <br />
            DEVELOPMENT
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
            Experience the fusion of high-performance engineering and cinematic interface design.
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
              Start Project
            </button>
            <button className="px-8 py-4 border border-neutral-700 bg-black/50 backdrop-blur-sm rounded-full hover:bg-neutral-800 transition-colors">
              View Work
            </button>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="group relative h-96 bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-2xl font-bold mb-2">Project 0{item}</h3>
              <p className="text-neutral-500">Next.js / Framer Motion / WebGL</p>
            </div>
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </section>
    </main>
  );
}
