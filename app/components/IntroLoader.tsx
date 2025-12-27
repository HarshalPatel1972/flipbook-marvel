'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generate 15 placeholder high-contrast image URLs for the flipbook effect
const IMAGE_URLS = Array.from({ length: 15 }, (_, i) => 
  `https://picsum.photos/seed/${i * 123}/1920/1080`
);

export default function IntroLoader() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // States: 'loading' -> 'flipbook' -> 'reveal' -> 'complete'
  const [phase, setPhase] = useState<'loading' | 'flipbook' | 'reveal' | 'complete'>('loading');

  // 1. Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = IMAGE_URLS.length;
    
    // Safety timeout in case images fail
    const safetyTimeout = setTimeout(() => {
      if (!imagesLoaded) {
        setImagesLoaded(true);
        setPhase('flipbook');
      }
    }, 3000);

    IMAGE_URLS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          clearTimeout(safetyTimeout);
          setImagesLoaded(true);
          // Small delay before starting
          setTimeout(() => setPhase('flipbook'), 200);
        }
      };
      img.onerror = () => {
        // Count errors as loaded to proceed anyway
        loadedCount++;
        if (loadedCount === totalImages) {
            clearTimeout(safetyTimeout);
            setImagesLoaded(true);
            setPhase('flipbook');
        }
      };
    });
    
    return () => clearTimeout(safetyTimeout);
  }, []);

  // 2. Logic Controller
  useEffect(() => {
    if (phase === 'flipbook') {
      // Phase 1: Comic Flip (0s - 3s)
      // Rapid image cycling
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % IMAGE_URLS.length);
      }, 80);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setPhase('reveal');
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else if (phase === 'reveal') {
      // Phase 2: Zoom & Reveal (3s - 4s) + Hold (4s - 5s)
      // The reveal transition takes about 1s (css/motion). We hold for 1s after.
      // Total time here = 2s before exiting.
      const timeout = setTimeout(() => {
        setPhase('complete');
      }, 2000); // 1s transition + 1s hold
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        >
            {/* Container for Zoom Effect */}
            <motion.div
              className="relative flex flex-col items-center justify-center p-12"
              initial={{ scale: 1.2 }}
              animate={phase === 'reveal' ? { scale: 1 } : { scale: 1.2 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                {/* Red Brand Box - Fades in behind text during reveal */}
                <motion.div
                    className="absolute inset-0 bg-[#EC1D24]"
                    initial={{ opacity: 0 }}
                    animate={phase === 'reveal' ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }} 
                />

                {/* Text Content */}
                <h1 
                  className={`
                    relative z-10 flex flex-col items-center justify-center text-center
                    font-black text-7xl md:text-9xl leading-[0.85] tracking-tighter uppercase
                    transition-colors duration-700
                  `}
                  style={{
                    // Style switching based on phase
                    color: phase === 'reveal' ? '#FFFFFF' : 'transparent',
                    backgroundImage: phase === 'flipbook' ? `url(${IMAGE_URLS[currentImageIndex]})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitBackgroundClip: phase === 'flipbook' ? 'text' : 'border-box',
                    backgroundClip: phase === 'flipbook' ? 'text' : 'border-box',
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span>PROMPTED</span>
                    <span>BY</span>
                    <span>HARSHAL</span>
                  </div>
                </h1>
            </motion.div>

            {/* Loading Indicator (Optional) */}
            {phase === 'loading' && (
                <div className="absolute bottom-10 text-neutral-500 text-sm animate-pulse">
                    LOADING ASSETS...
                </div>
            )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
