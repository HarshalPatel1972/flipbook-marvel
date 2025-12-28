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
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-500 selection:text-white relative overflow-hidden flex flex-col items-center justify-center">
      {/* Pass Project Images to IntroLoader so it flips through them */}
      <IntroLoader images={PROJECTS.map(p => p.image)} />

      {/* Organized Project Grid (Revealed after Loader Fades) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-4">
        <div className="w-full max-w-6xl flex flex-wrap justify-center items-center gap-8 pointer-events-auto">
           {PROJECTS.map((project, i) => {
              return (
                <motion.div
                    key={project.id}
                    className="relative w-64 h-40 bg-neutral-800 border-4 border-white/5 shadow-2xl overflow-hidden cursor-pointer group rounded-lg"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ 
                        scale: 1.25, 
                        zIndex: 60,
                        rotate: 0,
                        transition: { duration: 0.3 }
                    }}
                    transition={{ delay: 8.5 + (i * 0.15), duration: 0.8 }} 
                >
                    <Link href={project.link} className="block w-full h-full relative">
                        <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                            loading="eager"
                        />
                        {/* Project Title Tooltip */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-md p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center justify-center">
                            <p className="text-white text-xs font-bold tracking-widest uppercase">{project.title}</p>
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
