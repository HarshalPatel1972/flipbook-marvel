'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroLoader() {
  // Phases: 'ice' -> 'fire' -> 'storm' -> 'rebirth' -> 'complete'
  const [phase, setPhase] = useState<'ice' | 'fire' | 'storm' | 'rebirth' | 'complete'>('ice');

  // Master Timeline
  useEffect(() => {
    // 0s: Start Ice
    const fireTimer = setTimeout(() => setPhase('fire'), 3500);   // After 3.5s Ice breaks
    const stormTimer = setTimeout(() => setPhase('storm'), 7000); // After 3.5s Fire is doused
    const rebirthTimer = setTimeout(() => setPhase('rebirth'), 10500); // After 3.5s Storm clears
    const completeTimer = setTimeout(() => setPhase('complete'), 13000); // Reveal

    return () => {
        clearTimeout(fireTimer);
        clearTimeout(stormTimer);
        clearTimeout(rebirthTimer);
        clearTimeout(completeTimer);
    };
  }, []);

  if (phase === 'complete') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans bg-black flex items-center justify-center">
        
        {/* === SVG FILTERS (The Magic) === */}
        <svg className="absolute w-0 h-0">
            <defs>
                {/* Fire Distortion Filter */}
                <filter id="fire-filter">
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="2">
                        <animate attributeName="baseFrequency" dur="10s" values="0.05;0.01" repeatCount="indefinite"/>
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="10" />
                </filter>
                
                {/* Water/Fluid Filter */}
                <filter id="water-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                </filter>
            </defs>
        </svg>

        {/* === BACKGROUND EFFECTS === */}
        <div className="absolute inset-0 z-0">
            {/* Ice Background: Subtle pulsating blue cold */}
            <motion.div 
                className="absolute inset-0 bg-blue-950/20"
                animate={phase === 'ice' ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1 }}
            />
            {/* Fire Background: Red glow vignette */}
            <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.3)_0%,_rgba(0,0,0,1)_80%)]"
                animate={phase === 'fire' ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5 }}
            />
             {/* Storm Background: Flashing Lightning */}
             <motion.div 
                className="absolute inset-0 bg-slate-900/40"
                animate={phase === 'storm' ? { opacity: [0, 0.4, 0, 0.1, 0, 0.8, 0] } : { opacity: 0 }}
                transition={phase === 'storm' ? { duration: 2, repeat: Infinity } : { duration: 0.5 }}
            />
        </div>

        {/* === THE HERO TEXT === */}
        <div className="relative z-10 text-center">
            {/* "PROMPTED BY HARSHAL" */}
            <motion.h1 
                className="font-black text-6xl md:text-9xl leading-none tracking-tighter uppercase relative"
                animate={
                    phase === 'ice' ? { scale: 1, letterSpacing: '0.05em' } : 
                    phase === 'fire' ? { scale: 1.05, letterSpacing: '0.1em' } :
                    phase === 'storm' ? { x: [-2, 2, -2], scale: 1 } : // Violent shake
                    { scale: 1, letterSpacing: '0em', color: '#FFFFFF' }
                }
                transition={
                    phase === 'storm' ? { duration: 0.1, repeat: Infinity } : { duration: 1.5 }
                }
                style={{
                    // Dynamic Style Switching based on Phase
                    ...(phase === 'ice' && {
                        color: 'transparent',
                        WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                        textShadow: '0 0 20px rgba(100,200,255,0.8), 0 0 10px rgba(255,255,255,0.5)',
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #A5F3FC 50%, #000000 100%)',
                        WebkitBackgroundClip: 'text',
                        filter: 'blur(0.5px) contrast(1.2)' // Frosted look
                    }),
                    ...(phase === 'fire' && {
                        color: '#FCA5A5', // bright red center
                        textShadow: '0 0 30px #EF4444, 0 0 10px #F59E0B',
                        filter: 'url(#fire-filter) contrast(1.5)',
                    }),
                    ...(phase === 'storm' && {
                         color: '#E2E8F0',
                         textShadow: '0 0 15px #38BDF8', // Electric Blue Glow
                         filter: 'url(#water-filter)', // Distorted fluid look
                         opacity: 0.9
                    }),
                    ...(phase === 'rebirth' && {
                        color: 'transparent',
                        background: 'linear-gradient(135deg, #e2e8f0 0%, #ffffff 50%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        textShadow: '0 10px 30px rgba(255,255,255,0.3)',
                        filter: 'none', // Clarity
                        transform: 'scale(1)',
                    })
                }}
            >
                <div>PROMPTED</div>
                <div className="text-4xl md:text-6xl my-4 opacity-80">BY</div>
                <div>HARSHAL</div>
            </motion.h1>

            {/* === PARTICLES & OVERLAYS === */}
            
            {/* ICE: Falling Snow / Dust */}
            {phase === 'ice' && (
                <ParticleOverlay type="snow" />
            )}
            
            {/* FIRE: Rising Embers */}
            {phase === 'fire' && (
                <ParticleOverlay type="embers" />
            )}

            {/* STORM: Rain */}
            {phase === 'storm' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="animate-rain w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] mix-blend-overlay"></div>
                    {/* (Simulated simple CSS Rain lines could go here, but keeping it light) */}
                </div>
            )}
        </div>
    </div>
  );
}

// Simple Particle System Component using React/Divs
function ParticleOverlay({ type }: { type: 'snow' | 'embers' }) {
    const particles = Array.from({ length: 20 });
    
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
             {particles.map((_, i) => (
                 <motion.div
                    key={i}
                    initial={{ 
                        opacity: 0, 
                        y: type === 'snow' ? -50 : 100, 
                        x: Math.random() * window.innerWidth 
                    }}
                    animate={{ 
                        opacity: [0, 1, 0], 
                        y: type === 'snow' ? window.innerHeight : -window.innerHeight,
                    }}
                    transition={{ 
                        duration: Math.random() * 2 + 1, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: Math.random() * 2 
                    }}
                    className={`absolute rounded-full
                        ${type === 'snow' ? 'bg-white w-1 h-1 blur-[1px]' : 'bg-orange-500 w-2 h-2 blur-[2px]'}
                    `}
                 />
             ))}
        </div>
    );
}
