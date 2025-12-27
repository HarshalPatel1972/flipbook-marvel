'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use loremflickr for anime/comic style images to match the request
const IMAGE_URLS = Array.from({ length: 15 }, (_, i) => 
  `https://loremflickr.com/1920/1080/anime,comic?random=${i}`
);

export default function IntroLoader() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // States: 'loading' -> 'animating' -> 'complete'
  const [phase, setPhase] = useState<'loading' | 'animating' | 'complete'>('loading');

  // 1. Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = IMAGE_URLS.length;
    let isMounted = true;
    
    // Safety timeout
    const timer = setTimeout(() => {
       if (isMounted && !imagesLoaded) {
           setImagesLoaded(true);
           setPhase('animating');
       }
    }, 5000);

    IMAGE_URLS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages && isMounted) {
          clearTimeout(timer);
          setImagesLoaded(true);
          // Small buffer before starting the show
          setTimeout(() => setPhase('animating'), 500);
        }
      };
      img.onerror = () => {
        loadedCount++; 
        if (loadedCount === totalImages && isMounted) {
          clearTimeout(timer);
          setImagesLoaded(true);
          setPhase('animating');
        }
      };
    });

    return () => { isMounted = false; clearTimeout(timer); };
  }, []);

  // 2. Continuous Image Flipping
  useEffect(() => {
    if (phase === 'animating') {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % IMAGE_URLS.length);
      }, 120); // Slightly slower than 80ms to appreciate the "anime" art

      return () => clearInterval(interval);
    }
  }, [phase]);

  // 3. Phase Completion Logic
  useEffect(() => {
    if (phase === 'animating') {
        const timeout = setTimeout(() => {
            setPhase('complete');
        }, 10000); // 10 seconds total animation
        return () => clearTimeout(timeout);
    }
  }, [phase]);

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden font-sans pointer-events-none`}>
        {/* 
           Image Layer (The content inside the text)
           - Visible during animation.
           - Fades out at the end to reveal the simple solid text.
        */}
        <motion.div 
            className="absolute inset-0 bg-black z-0"
            initial={{ opacity: 1 }}
            animate={phase === 'complete' ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >
             {(phase === 'animating' || phase === 'loading') && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                        src={IMAGE_URLS[currentImageIndex]}
                        className="w-full h-full object-cover opacity-80"
                        alt="Background Art"
                    />
                </div>
             )}
        </motion.div>

        {/* 
            Mask Layer
            - Before Complete: Mix-blend-multiply with Black BG = White Text becomes transparent window.
            - After Complete: Text becomes Solid White (or page title color).
         */}
        <motion.div 
            className={`
                absolute inset-0 z-10 flex items-center justify-center
                ${phase !== 'complete' ? 'bg-black mix-blend-multiply' : ''}
            `}
            initial={{ opacity: 1 }}
            animate={phase === 'complete' ? { backgroundColor: 'rgba(0,0,0,0)' } : { backgroundColor: '#000000' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >   
            <motion.div
                className="relative text-center"
                initial={{ scale: 100 }}
                animate={phase === 'animating' ? { scale: 1 } : phase === 'complete' ? { scale: 1 } : { scale: 100 }}
                transition={{ 
                    duration: 10, 
                    ease: [0.16, 1, 0.3, 1] // long smooth expo ease out
                }}
            >
                <h1 className="text-white font-black text-8xl md:text-[12rem] tracking-tighter leading-none">
                    FlipBook
                </h1>
            </motion.div>
        </motion.div>

        {/* Loading Spinner */}
        {phase === 'loading' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
    </div>
  );
}
