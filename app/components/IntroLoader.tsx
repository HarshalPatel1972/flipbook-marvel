'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generate 15 placeholder high-contrast image URLs
const IMAGE_URLS = Array.from({ length: 15 }, (_, i) => 
  `https://picsum.photos/seed/${i + 42}/1920/1080`
);

export default function IntroLoader() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'flipbook' | 'freeze' | 'exit' | 'hidden'>('loading');

  // 1. Preload Images
  useEffect(() => {
    let isMounted = true;
    const preloadParams = IMAGE_URLS.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // proper error handling implies continuing anyway
      });
    });

    Promise.all(preloadParams).then(() => {
      if (isMounted) {
        setImagesLoaded(true);
        setTimeout(() => setPhase('flipbook'), 500); // Short buffer
      }
    });

    return () => { isMounted = false; };
  }, []);

  // 2. Flipbook Animation Sequence
  useEffect(() => {
    if (phase === 'flipbook') {
      // Rapidly switch images every 100ms
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % IMAGE_URLS.length);
      }, 100);

      // Stop after 2.5s and move to 'freeze'
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setPhase('freeze');
      }, 2500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [phase]);

  // 3. Freeze & Brand Reveal Sequence
  useEffect(() => {
    if (phase === 'freeze') {
      // Hold the "Logo Reveal" state (white text + red box) for 1s
      // The state transition triggers the UI change below
      const timeout = setTimeout(() => {
        setPhase('hidden');
      }, 1400); // 1s hold + slight buffer for animation entry
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  // Combined logic: 'hidden' triggers AnimatePresence exit
  
  return (
    <AnimatePresence>
      {phase !== 'hidden' && (
        <motion.div
          key="overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Preloading Phase - Optional loading spinner or black screen */}
          {phase === 'loading' && (
             <div className="text-white opacity-20 text-sm animate-pulse absolute bottom-10">Loading Assets...</div>
          )}

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* The Red Box (Brand Background) - Only visible in freeze */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                phase === 'freeze' 
                  ? { scaleX: 1, opacity: 1 } 
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute inset-0 -mx-4 -my-2 bg-red-700 transform origin-center"
              style={{ zIndex: -1 }}
            />

            {/* The Text Component */}
            <h1 
              className={`
                flex flex-col items-center justify-center text-center
                font-black text-6xl md:text-8xl lg:text-9xl leading-none tracking-tighter uppercase
                transition-all duration-300
                ${
                  phase === 'flipbook' || phase === 'loading'
                    ? 'text-transparent bg-clip-text bg-cover bg-center'
                    : 'text-white'
                }
              `}
              style={{
                backgroundImage: 
                  (phase === 'flipbook' || phase === 'loading') 
                    ? `url(${IMAGE_URLS[currentImageIndex]})` 
                    : 'none',
              }}
            >
              <span>PROMPTED</span>
              <span>BY</span>
              <span>HARSHAL</span>
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
