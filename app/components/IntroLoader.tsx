'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use loremflickr for anime/comic style images
export const IMAGE_URLS = Array.from({ length: 15 }, (_, i) => 
  `https://loremflickr.com/1920/1080/anime,comic?random=${i}`
);

export default function IntroLoader({ images }: { images: string[] }) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use provided images or fallback to prevent crash
  const sourceImages = images && images.length > 0 ? images : [];

  // Phases: 'loading' -> 'animating' -> 'complete'
  const [phase, setPhase] = useState<'loading' | 'animating' | 'complete'>('loading');

  // 1. Preload Images
  useEffect(() => {
    if (sourceImages.length === 0) {
        setPhase('animating'); // Skip loading if no images
        return;
    }

    let loadedCount = 0;
    const totalImages = sourceImages.length;
    let isMounted = true;
    
    // Safety timeout
    const timer = setTimeout(() => {
       if (isMounted && !imagesLoaded) {
           setImagesLoaded(true);
           setPhase('animating');
       }
    }, 8000); 

    sourceImages.forEach((src) => {
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
  }, [sourceImages]);

  // 2. High-Performance Image Flipping
  useEffect(() => {
    if (phase === 'animating' && sourceImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % sourceImages.length);
      }, 100); 

      return () => clearInterval(interval);
    }
  }, [phase, sourceImages]);

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
                    {sourceImages.map((src, index) => (
                        <div 
                            key={src + index} // simple unique key
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
                className="relative flex flex-col items-center justify-center p-12"
                initial={{ scale: 100, rotate: 5 }}
                animate={phase === 'animating' ? { scale: 1, rotate: 0 } : phase === 'complete' ? { scale: 1, rotate: 0 } : { scale: 100, rotate: 5 }}
                transition={{ 
                    duration: 8, 
                    ease: [0.16, 1, 0.3, 1] 
                }}
            >
                {/* Decorative Top Data */}
                <div className="w-full flex justify-between items-end border-b-4 border-white pb-2 mb-2 text-white font-mono text-[1vw] md:text-sm font-bold tracking-widest opacity-80">
                    <span>FIG. 01</span>
                    <span>// SYSTEM_READY</span>
                </div>

                {/* MAIN MASSIVE TITLE */}
                <h1 className="text-white font-black text-[20vw] leading-[0.8] tracking-[-0.08em] scale-y-125 transform-gpu mb-4">
                    FLIPBOOK
                </h1>

                {/* Decorative Bottom Data */}
                <div className="w-full flex justify-between items-start border-t-4 border-white pt-2 text-white font-mono text-[1vw] md:text-sm font-bold tracking-widest opacity-80">
                    <span>CREATIVE_DEV</span>
                    <span>2025</span>
                </div>
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
