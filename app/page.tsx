'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
// Link is no longer needed for the card wrapper if we use onClick, but could be useful for semantic HTML. 
// However, to enforce the warp effect, we must intercept the click.
import IntroLoader from './components/IntroLoader';
import WarpTransition from './components/WarpTransition';

// Project Data for Meta-Portfolio Navigation (Strictly User Provided)
const PROJECTS = [
  { id: 1, title: 'A1 Tantra', image: '/img/A1Tantra.png', link: 'https://a1-tantra.vercel.app' },
  { id: 2, title: 'Ghibli Elevator', image: '/img/Elevator.png', link: 'https://ghibli-elevator.vercel.app' },
  { id: 3, title: 'Argument Arbiter', image: '/img/Argument.png', link: 'https://argument-arbiter.vercel.app' },
  { id: 4, title: 'Timeline', image: '/img/Timline-app.png', link: 'https://timeline-eight-beta.vercel.app/' },
  { id: 5, title: 'Pari Physiotherapy', image: '/img/Pari.png', link: 'https://pari-physiotherapy.vercel.app' },
];

function ProjectCard({ project, index, onProjectClick }: { project: typeof PROJECTS[0], index: number, onProjectClick: (url: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });
    
    // Inverse Pan for Parallax
    const imgX = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { stiffness: 150, damping: 20 });
    const imgY = useSpring(useTransform(y, [-0.5, 0.5], [-20, 20]), { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 8.5 + (index * 0.2), duration: 1, type: "spring" }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onProjectClick(project.link)} // Trigger Warp
            className="relative w-[300px] h-[200px] md:w-[350px] md:h-[220px] rounded-xl bg-neutral-900 border border-white/10 group perspective-1000 cursor-pointer z-10 hover:z-50"
        >
            <div className="block w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute inset-0 overflow-hidden rounded-xl bg-black transform-gpu">
                    <motion.div 
                        className="absolute inset-[-20%] w-[140%] h-[140%]"
                        style={{ x: imgX, y: imgY }}
                    >
                         <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-active:grayscale-0 group-hover:scale-110 group-active:scale-110 transition-all duration-700 ease-out"
                            loading="eager"
                        />
                    </motion.div>
                </div>

                {/* Glare/Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />

                {/* Floating Label */}
                <div 
                    className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-active:translate-y-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-500 ease-out flex items-center justify-between pointer-events-none"
                    style={{ transform: "translateZ(30px)" }}
                >   
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xl">
                        <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">{project.title}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Home() {
  const [warpState, setWarpState] = useState<{ active: boolean, url: string | null }>({ active: false, url: null });
  const [interactionsEnabled, setInteractionsEnabled] = useState(false);

  // Reset warp state on mount and when returning from navigation (bfcache)
  useEffect(() => {
    // Initial mount reset
    setWarpState({ active: false, url: null });

    const handlePageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
            setWarpState({ active: false, url: null });
        }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleWarpComplete = () => {
      if (warpState.url) {
          window.location.href = warpState.url; 
      }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-500 selection:text-white relative overflow-x-hidden overflow-y-auto">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.2),rgba(0,0,0,1))] pointer-events-none" />

      {/* Warp Transition Overlay */}
      <AnimatePresence mode="wait">
          {warpState.active && <WarpTransition onComplete={handleWarpComplete} />}
      </AnimatePresence>

      {/* Persistent Brand Header (Appears after Intro) */}
      <motion.header 
        className="fixed top-0 left-0 w-full z-40 p-6 md:p-8 flex justify-between items-start pointer-events-none mix-blend-difference"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 7.5, duration: 1.5, ease: "easeOut" }}
      >
        <div>
            <h1 className="text-white font-black text-2xl md:text-3xl tracking-tighter leading-none">
                FLIPBOOK
            </h1>
            <p className="text-white/60 text-[10px] font-mono tracking-widest mt-1">
                VOL. 01
            </p>
        </div>
      </motion.header>

      <IntroLoader 
        images={PROJECTS.map(p => p.image)} 
        onComplete={() => setInteractionsEnabled(true)}
      />

      {/* Project Grid - Scrollable Container */}
      <div className={`relative z-10 w-full min-h-screen flex items-center justify-center p-4 pt-44 md:pt-60 pb-32 transition-opacity duration-1000 ${interactionsEnabled ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 md:opacity-100'}`}>
        {/* Note: opacity-0 on mobile initially prevents flash, but let's just stick to pointer-events. logic: User wants links activated later. */}
        <div className="w-full max-w-7xl flex flex-wrap justify-center items-center gap-8 md:gap-12">
           {PROJECTS.map((project, i) => (
               <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={i} 
                    onProjectClick={(url) => setWarpState({ active: true, url })}
                />
           ))}
        </div>
      </div>

      {/* Persistent Footer Status Bar (Appears after Intro) */}
      <motion.footer 
        className="fixed bottom-0 left-0 w-full z-40 p-6 md:p-8 flex justify-between items-end pointer-events-none mix-blend-difference text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 7.8, duration: 1.5, ease: "easeOut" }}
      >
          {/* Left: Identity & Role */}
          <div className="flex flex-col items-start gap-1">
              <h2 className="font-bold text-lg md:text-xl tracking-tight leading-none">HARSHAL PATEL</h2>
              <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                  <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest opacity-60">Full Stack Engineer</span>
              </div>
          </div>

          {/* Center: Technical Label (Hidden on small mobile) */}
          <div className="hidden md:flex flex-col items-center mb-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">Meta-Portfolio [V1.0]</span>
          </div>

          {/* Right: Interaction Prompt */}
          <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-bold tracking-wide uppercase">Select Memory</span>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              </div>
              <span className="text-[10px] font-mono opacity-50 tracking-wider">HOVER TO DECRYPT</span>
          </div>
      </motion.footer>
    </main>
  );
}
