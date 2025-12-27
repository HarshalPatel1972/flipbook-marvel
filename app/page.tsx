'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import IntroLoader from './components/IntroLoader';

// Project Data for Meta-Portfolio Navigation
const PROJECTS = [
  { id: 1, title: 'The Arc', image: 'https://loremflickr.com/800/600/architecture?random=1', link: '/project/arc' },
  { id: 2, title: 'Neon Pulse', image: 'https://loremflickr.com/800/600/cyberpunk?random=2', link: '/project/neon' },
  { id: 3, title: 'Zenith', image: 'https://loremflickr.com/800/600/abstract?random=3', link: '/project/zenith' },
  { id: 4, title: 'Aether', image: 'https://loremflickr.com/800/600/sky?random=4', link: '/project/aether' },
  { id: 5, title: 'Iron Clad', image: 'https://loremflickr.com/800/600/metal?random=5', link: '/project/iron' },
  { id: 6, title: 'Velvet UI', image: 'https://loremflickr.com/800/600/texture?random=6', link: '/project/velvet' },
  { id: 7, title: 'Echoes', image: 'https://loremflickr.com/800/600/water?random=7', link: '/project/echoes' },
  { id: 8, title: 'Prism', image: 'https://loremflickr.com/800/600/glass?random=8', link: '/project/prism' },
  { id: 9, title: 'Nova', image: 'https://loremflickr.com/800/600/space?random=9', link: '/project/nova' },
  { id: 10, title: 'Terra', image: 'https://loremflickr.com/800/600/nature?random=10', link: '/project/terra' },
  { id: 11, title: 'Quantum', image: 'https://loremflickr.com/800/600/science?random=11', link: '/project/quantum' },
  { id: 12, title: 'Flux', image: 'https://loremflickr.com/800/600/light?random=12', link: '/project/flux' },
  { id: 13, title: 'Apex', image: 'https://loremflickr.com/800/600/mountain?random=13', link: '/project/apex' },
  { id: 14, title: 'Cipher', image: 'https://loremflickr.com/800/600/code?random=14', link: '/project/cipher' },
  { id: 15, title: 'Origin', image: 'https://loremflickr.com/800/600/art?random=15', link: '/project/origin' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-500 selection:text-white relative overflow-hidden">
      <IntroLoader />

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
                        left: `${(i % 5) * 20 + (Math.random() * 10 - 5)}%`, 
                        top: `${Math.floor(i / 5) * 25 + (Math.random() * 10 - 5)}%`,
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
