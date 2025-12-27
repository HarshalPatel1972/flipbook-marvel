'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import IntroLoader from './components/IntroLoader';

// Project Data for Meta-Portfolio Navigation
// Project Data for Meta-Portfolio Navigation (Strictly User Provided)
const PROJECTS = [
  { id: 1, title: 'A1 Tantra', image: '/img/A1Tantra.png', link: 'https://a1-tantra.vercel.app' },
  { id: 2, title: 'Ghibli Elevator', image: '/img/Elevator.png', link: 'https://ghibli-elevator.vercel.app' },
  { id: 3, title: 'Argument Arbiter', image: '/img/Argument.png', link: 'https://argument-arbiter.vercel.app' },
  { id: 4, title: 'Timeline', image: '/img/Timline-app.png', link: 'https://timeline.vercel.app' },
  { id: 5, title: 'Pari Physiotherapy', image: '/img/Pari.png', link: 'https://pari-physiotherapy.vercel.app' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-500 selection:text-white relative overflow-hidden">
      {/* Pass Project Images to IntroLoader so it flips through them */}
      <IntroLoader images={PROJECTS.map(p => p.image)} />

      {/* Scattered Project Portal (Revealed after Loader Fades) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none h-screen">
        <div className="relative w-full h-full max-w-[1600px] mx-auto">
           {PROJECTS.map((project, i) => {
              // Deterministic random positioning for stability
              const rotate = ((i * 34567) % 30) - 15; // -15 to 15 deg

              return (
                <motion.div
                    key={project.id}
                    className="absolute w-44 h-28 md:w-64 md:h-40 bg-neutral-800 border-4 border-white/5 shadow-2xl z-10 hover:z-[60] hover:scale-150 transition-all duration-500 ease-out group"
                    style={{
                        // Spread 5 items more centrally 
                        left: `${15 + (i % 3) * 30 + (Math.random() * 10 - 5)}%`, 
                        top: `${30 + Math.floor(i / 3) * 30 + (Math.random() * 10 - 5)}%`,
                        rotate: `${rotate}deg`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 8.5 + (i * 0.1), duration: 0.8 }} 
                >
                    <Link href={project.link} className="block w-full h-full pointer-events-auto cursor-pointer relative">
                        <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        {/* Project Title Tooltip */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <p className="text-white text-xs font-bold text-center tracking-wider uppercase">{project.title}</p>
                        </div>
                    </Link>
                </motion.div>
              );
           })}
        </div>
      </div>

        {/* Branding Footer/Hero Overlay */}
        <div className="absolute bottom-10 left-0 right-0 z-10 text-center pointer-events-none">
             <p className="text-neutral-500 text-sm tracking-widest uppercase mb-2">Meta-Portfolio</p>
             <h2 className="text-white font-black text-2xl tracking-tight">HARSHAL PATEL</h2>
             <p className="mt-4 text-xs text-neutral-600 animate-pulse">Select a memory to enter</p>
        </div>
    </main>
  );
}
