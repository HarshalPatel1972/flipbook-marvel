'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use loremflickr for anime/comic style images
const IMAGE_URLS = Array.from({ length: 15 }, (_, i) => 
  `https://loremflickr.com/1920/1080/anime,comic?random=${i}`
);

export default function IntroLoader() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Phases: 'loading' -> 'animating' -> 'complete'
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
    }, 8000); // 8s timeout to be safe for 15 heavy images

    IMAGE_URLS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages && isMounted) {
          clearTimeout(timer);
          setImagesLoaded(true);
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

  // 2. High-Performance Image Flipping
  useEffect(() => {
    if (phase === 'animating') {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % IMAGE_URLS.length);
      }, 100); // 100ms smooth cycle

      return () => clearInterval(interval);
    }
  }, [phase]);

  // 3. Phase Completion Logic
  useEffect(() => {
    if (phase === 'animating') {
        const timeout = setTimeout(() => {
            setPhase('complete');
        }, 8000); // 8s animation duration
        return () => clearTimeout(timeout);
    }
  }, [phase]);

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden font-sans pointer-events-none`}>
        {/* 
           Layer 1: The Image Stack (Content)
           - We render ALL images absolutely positioned.
           - We toggle opacity. This avoids "decoding" stutter because they are already in the DOM.
        */}
        <motion.div 
            className="absolute inset-0 bg-black z-0"
            initial={{ opacity: 1 }}
            animate={phase === 'complete' ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >
             {/* Render images during 'complete' too so they freeze-frame while fading out */}
             {(phase === 'animating' || phase === 'loading' || phase === 'complete') && (
                <div className="absolute inset-0 w-full h-full">
                    {IMAGE_URLS.map((src, index) => (
                        <div 
                            key={src}
                            className="absolute inset-0 w-full h-full flex items-center justify-center will-change-[opacity]"
                            style={{ 
                                opacity: currentImageIndex === index ? 1 : 0,
                                zIndex: currentImageIndex === index ? 10 : 1,
                            }}
                        >
                             <img 
                                src={src}
                                className="w-full h-full object-cover opacity-80"
                                alt=""
                            />
                        </div>
                    ))}
                </div>
             )}
        </motion.div>

        {/* 
            Layer 2: The Mask (Multiply Blend)
            - Standard "Zoom Out" from scale 100 -> 1
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
                    duration: 8, 
                    ease: [0.16, 1, 0.3, 1] 
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
