'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use loremflickr for anime/comic style images
export const IMAGE_URLS = Array.from({ length: 15 }, (_, i) => 
  `https://loremflickr.com/1920/1080/anime,comic?random=${i}`
);

export default function IntroLoader({ images, onComplete }: { images: string[], onComplete?: () => void }) {
  const [phase, setPhase] = useState<'falling' | 'reveal' | 'solidify' | 'complete'>('falling');
  const sourceImages = images && images.length > 0 ? images : [];

  const onCompleteRef = React.useRef(onComplete);
  useEffect(() => {
     onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Phase Orchestration
  useEffect(() => {
    // 1. Reveal Title
    setTimeout(() => setPhase('reveal'), 2500);
    // 2. Solidify (Images stop/fade, Title becomes solid & settled)
    setTimeout(() => setPhase('solidify'), 6000);
    // 3. Complete (Scroll unlocked, overlay removed)
    setTimeout(() => {
        setPhase('complete');
        if (onCompleteRef.current) onCompleteRef.current();
    }, 7500);
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden bg-black pointer-events-none flex items-center justify-center transition-all duration-500 ${phase === 'complete' ? 'z-0 opacity-0' : 'z-50 opacity-100'}`}>
        
        {/* Layer 1: Falling Images Stream */}
        <div className="absolute inset-0 w-full h-full perspective-500 overflow-hidden">
             {/* Only render falling images before 'solidify' phase to optimize performance/visuals */}
             {phase !== 'solidify' && phase !== 'complete' && (
               <AnimatePresence>
                   {Array.from({ length: 15 }).map((_, i) => (
                       <FallingImage 
                            key={i} 
                            src={sourceImages[i % sourceImages.length]} 
                            delay={i * 0.3} 
                        />
                   ))}
               </AnimatePresence>
             )}
        </div>

        {/* Layer 2: Transition Overlay (Fade background to black, making title pop) */}
        <motion.div 
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={phase === 'solidify' || phase === 'complete' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.5 }}
        />

        {/* Layer 3: The Massive Title */}
        <motion.div 
            className="relative z-20 flex flex-col items-center justify-center mix-blend-exclusion"
            initial={{ opacity: 0, scale: 3 }}
            animate={
                phase === 'falling' ? { opacity: 0, scale: 3 } :
                phase === 'reveal' ? { opacity: 1, scale: 1.1 } : 
                { opacity: 1, scale: 1 } // Settled state
            }
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Title Width controlled to 85% of Viewport Width as requested */}
            <h1 
                className="text-white font-black leading-none tracking-tighter text-center" 
                style={{ fontSize: '15vw', width: '85vw' }}
            >
                FLIPBOOK
            </h1>
            
            {/* Technical Sub-labels only visible when settled */}
            <div 
                className={`flex justify-between w-[85vw] text-white/60 font-mono text-[10px] md:text-sm mt-2 md:mt-4 overflow-hidden transition-all duration-1000 ease-out ${phase === 'solidify' || phase === 'complete' ? 'opacity-100 h-auto' : 'opacity-0 h-0'}`}
            >
                 <span>EST. 2025</span>
                 <span>CREATIVE DEVELOPER</span>
            </div>
        </motion.div>
    </div>
  );
}

// Sub-component for individual falling image physics
function FallingImage({ src, delay }: { src: string, delay: number }) {
    return (
        <motion.div
            className="absolute left-0 right-0 mx-auto w-[70vw] md:w-[40vw] h-[40vh] md:h-[50vh]"
            initial={{ y: '-150%', rotateX: 20, opacity: 0 }}
            animate={{ 
                y: '150vh', // Fall through bottom
                rotateX: Math.random() * 60 - 30, // Random tumble
                rotateZ: Math.random() * 20 - 10,
                opacity: [0, 1, 1, 0] // Fade in/out
            }}
            transition={{ 
                duration: 3 + Math.random() * 2, // Variable speed 3-5s
                repeat: Infinity, 
                ease: "linear", 
                delay: delay 
            }}
        >
            <img 
                src={src} 
                className="w-full h-full object-cover rounded-lg shadow-2xl opacity-80" 
                alt="" 
            />
        </motion.div>
    );
}
