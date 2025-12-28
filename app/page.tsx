'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import IntroLoader from './components/IntroLoader';

// Project Data for Meta-Portfolio Navigation (Strictly User Provided)
const PROJECTS = [
  { id: 1, title: 'A1 Tantra', image: '/img/A1Tantra.png', link: 'https://a1-tantra.vercel.app' },
  { id: 2, title: 'Ghibli Elevator', image: '/img/Elevator.png', link: 'https://ghibli-elevator.vercel.app' },
  { id: 3, title: 'Argument Arbiter', image: '/img/Argument.png', link: 'https://argument-arbiter.vercel.app' },
  { id: 4, title: 'Timeline', image: '/img/Timline-app.png', link: 'https://timeline.vercel.app' },
  { id: 5, title: 'Pari Physiotherapy', image: '/img/Pari.png', link: 'https://pari-physiotherapy.vercel.app' },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0], index: number }) {
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
            className="relative w-[300px] h-[200px] md:w-[350px] md:h-[220px] rounded-xl bg-neutral-900 border border-white/10 group perspective-1000 cursor-pointer z-10 hover:z-50"
        >
            <Link href={project.link} className="block w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute inset-0 overflow-hidden rounded-xl bg-black transform-gpu">
                    <motion.div 
                        className="absolute inset-[-20%] w-[140%] h-[140%]"
                        style={{ x: imgX, y: imgY }}
                    >
                         <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                            loading="eager"
                        />
                    </motion.div>
                </div>

                {/* Glare/Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />

                {/* Floating Label */}
                <div 
                    className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-between pointer-events-none"
                    style={{ transform: "translateZ(30px)" }}
                >   
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xl">
                        <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">{project.title}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-500 selection:text-white relative overflow-hidden flex flex-col items-center justify-center perspective-[2000px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.2),rgba(0,0,0,1))] pointer-events-none" />

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

      <IntroLoader images={PROJECTS.map(p => p.image)} />

      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-4">
        <div className="w-full max-w-7xl flex flex-wrap justify-center items-center gap-8 md:gap-12 pointer-events-auto">
           {PROJECTS.map((project, i) => (
               <ProjectCard key={project.id} project={project} index={i} />
           ))}
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
