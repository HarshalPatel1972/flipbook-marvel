'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generate 15 placeholder high-contrast image URLs
const IMAGE_URLS = Array.from({ length: 15 }, (_, i) => 
  `https://picsum.photos/seed/${i * 47}/1920/1080`
);

export default function IntroLoader() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Phases: loading -> chaos -> snap -> brand -> lift -> hidden
  const [phase, setPhase] = useState<'loading' | 'chaos' | 'snap' | 'brand' | 'lift' | 'hidden'>('loading');

  // Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = IMAGE_URLS.length;
    let isMounted = true;
    
    // Fallback if images hang
    const timer = setTimeout(() => {
       if (isMounted && !imagesLoaded) {
           setImagesLoaded(true);
           setPhase('chaos');
       }
    }, 4000);

    IMAGE_URLS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages && isMounted) {
          clearTimeout(timer);
          setImagesLoaded(true);
          setTimeout(() => setPhase('chaos'), 500);
        }
      };
      img.onerror = () => {
        loadedCount++; // proceed anyway
        if (loadedCount === totalImages && isMounted) {
          clearTimeout(timer);
          setImagesLoaded(true);
          setPhase('chaos');
        }
      };
    });

    return () => { isMounted = false; clearTimeout(timer); };
  }, []);

  // Image Chaos Logic
  useEffect(() => {
    if (phase === 'chaos' || phase === 'snap') {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % IMAGE_URLS.length);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Phase Controller
  useEffect(() => {
    if (phase === 'chaos') {
        const timeout = setTimeout(() => {
            setPhase('snap');
        }, 2500); 
        return () => clearTimeout(timeout);
    }
    if (phase === 'snap') {
         // The snap takes 0.5s. We wait effectively for the animation to finish + buffer
        const timeout = setTimeout(() => {
            setPhase('brand');
        }, 550);
        return () => clearTimeout(timeout);
    }
    if (phase === 'brand') {
        const timeout = setTimeout(() => {
            setPhase('lift');
        }, 1500);
        return () => clearTimeout(timeout);
    }
    if (phase === 'lift') {
        const timeout = setTimeout(() => {
            setPhase('hidden');
        }, 800);
        return () => clearTimeout(timeout);
    }
  }, [phase]);

  if (phase === 'hidden') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Layer 0: The Slide-Up/Exit Wrapper */}
        <motion.div 
            className="absolute inset-0 bg-black"
            initial={false}
            animate={phase === 'lift' ? { y: '-100%' } : { y: '0%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // theatre curtain ease
        >
            
            {/* Layer 1: The Image Chaos (Underneath) */}
            {/* Only visible during chaos/snap. During brand, we hide it or cover it. */}
            <div className="absolute inset-0 z-0 bg-neutral-900 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    {(phase === 'chaos' || phase === 'snap') && (
                        <motion.img
                            key={currentImageIndex}
                            src={IMAGE_URLS[currentImageIndex]}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ scale: 1.0, opacity: 0.8 }}
                            animate={{ scale: 1.1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Layer 2: The Mask (Black Background + White Text -> Multiply) */}
            {/* When Phase == 'brand', we remove multiply so it becomes opaque black BG with white text */}
            <motion.div 
                className={`
                    absolute inset-0 z-10 flex items-center justify-center bg-black
                    ${(phase === 'chaos' || phase === 'snap') ? 'mix-blend-multiply' : ''}
                `}
                // Animate Scale of the Mask Container to create the fly-through effect
                initial={{ scale: 15 }} 
                animate={
                    phase === 'chaos' ? { scale: 12 } :
                    phase === 'snap' ? { scale: 1 } :
                    phase === 'brand' ? { scale: 1 } :
                    { scale: 15 } // default/initial
                }
                transition={
                    phase === 'chaos' ? { duration: 2.5, ease: "linear" } :
                    phase === 'snap' ? { duration: 0.5, ease: [0.25, 1, 0.5, 1] } :
                    { duration: 0 }
                }
            >   
                 {/* Red Brand Box (Behind Text during Brand phase) */}
                 {phase === 'brand' && (
                    <motion.div 
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute w-[120%] h-[120%] bg-[#EC1D24] z-[-1]"
                    />
                 )}

                <div className="relative text-center z-10">
                    <h1 className="text-white font-black text-7xl md:text-9xl tracking-tighter leading-none flex flex-col items-center">
                        <span>PROMPTED</span>
                        <span>BY</span>
                        <span>HARSHAL</span>
                    </h1>
                </div>
            </motion.div>
            
            {/* Flash Effect Overlay */}
            <AnimatePresence>
                {phase === 'brand' && (
                    <motion.div 
                         initial={{ opacity: 1 }}
                         animate={{ opacity: 0 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.2 }}
                         className="absolute inset-0 z-50 bg-white pointer-events-none mix-blend-overlay"
                    />
                )}
            </AnimatePresence>

            {/* Loading Spinner (if needed) */}
            {phase === 'loading' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

        </motion.div>
    </div>
  );
}
