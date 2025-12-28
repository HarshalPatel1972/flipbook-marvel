'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function WarpTransition({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; z: number; pz: number }[] = [];
    const speed = 0.2; // Base speed
    let warpSpeed = 0; // Increases over time

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize stars
    const numStars = 500;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        pz: Math.random() * canvas.width // Previous Z
      });
    }

    const draw = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      warpSpeed += 0.5; // Accelerate

      stars.forEach(star => {
        star.z -= (speed + warpSpeed);

        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
          star.z = canvas.width;
          star.pz = canvas.width;
        }

        const x = (star.x / star.z) * canvas.width + cx;
        const y = (star.y / star.z) * canvas.height + cy;

        const px = (star.x / star.pz) * canvas.width + cx;
        const py = (star.y / star.pz) * canvas.height + cy;

        star.pz = star.z;

        // Draw streak
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - star.z / canvas.width})`;
        ctx.lineWidth = (1 - star.z / canvas.width) * 4;
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // End sequence after 3.5 seconds
    const timer = setTimeout(() => {
        onComplete();
    }, 3500);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div 
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center pt-10">
             
             {/* Made by Antigravity */}
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center gap-2"
             >
                 <span className="text-xs md:text-sm font-mono text-neutral-400 uppercase tracking-widest">
                     Made by
                 </span>
                 
                 <div className="flex items-center justify-center gap-0.5">
                     {/* Replaces 'A' */}
                     <div className="relative w-8 h-8 md:w-10 md:h-10">
                          <img 
                            src="/img/google-antigravity-logo.png" 
                            alt="A" 
                            className="w-full h-full object-contain"
                         />
                     </div>
                     <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-white">
                        ntigravity
                     </h2>
                 </div>
             </motion.div>

             {/* Divider */}
             <motion.div 
                className="w-12 h-px bg-white/30"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 1 }}
             />

             {/* Powered by Next.js */}
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col items-center gap-2"
             >
                <span className="text-[10px] md:text-xs font-mono text-neutral-400 uppercase tracking-widest">
                    Powered by
                </span>
                
                <div className="flex items-center justify-center gap-0.5">
                     {/* Replaces 'N' */}
                     <div className="relative w-6 h-6 md:w-8 md:h-8">
                         <img 
                            src="/img/icons8-next.js.svg" 
                            alt="N" 
                            className="w-full h-full object-contain invert"
                        />
                     </div>
                     <span className="text-lg md:text-xl font-bold tracking-wider text-white">
                        ext.js
                     </span>
                </div>
             </motion.div>

        </div>
    </motion.div>
  );
}
