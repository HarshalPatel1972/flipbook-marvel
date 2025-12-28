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
        
        <div className="relative z-10 flex flex-col items-center gap-8 text-center pt-20">
             {/* Antigravity Logo */}
             <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center gap-4"
             >
                <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center p-6 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-pulse-slow">
                     <img 
                        src="/img/google-antigravity-logo.png" 
                        alt="Antigravity" 
                        className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                     />
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
                    Antigravity
                </h2>
             </motion.div>

             {/* Divider */}
             <motion.div 
                className="w-px h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"
                initial={{ height: 0 }}
                animate={{ height: 64 }}
                transition={{ delay: 1 }}
             />

             {/* NextJS Logo */}
             <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col items-center gap-3"
             >
                <p className="text-[10px] md:text-xs text-neutral-400 uppercase tracking-[0.2em]">Powered by</p>
                <img 
                    src="/img/icons8-next.js.svg" 
                    alt="Next.js" 
                    className="h-8 md:h-10 w-auto invert opacity-80 hover:opacity-100 transition-opacity"
                />
             </motion.div>
        </div>
    </motion.div>
  );
}
