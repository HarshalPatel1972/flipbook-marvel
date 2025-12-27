'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function IntroLoader() {
  // Extended Disaster Sequence
  // Ice -> Quake -> Fire -> Flood -> Tornado -> Glitch -> Void -> Rebirth
  const [phase, setPhase] = useState<'ice' | 'quake' | 'fire' | 'flood' | 'tornado' | 'glitch' | 'void' | 'rebirth' | 'complete'>('ice');

  useEffect(() => {
    const timeline = [
        { id: 'quake', time: 3000 },
        { id: 'fire', time: 6000 },
        { id: 'flood', time: 9000 },
        { id: 'tornado', time: 12000 },
        { id: 'glitch', time: 15000 },
        { id: 'void', time: 18000 },
        { id: 'rebirth', time: 20000 },
        { id: 'complete', time: 23000 },
    ];

    const timers = timeline.map(event => 
        setTimeout(() => setPhase(event.id as any), event.time)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === 'complete') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans bg-black flex items-center justify-center">
        
        {/* === ADVANCED SVG FILTERS === */}
        <svg className="absolute w-0 h-0">
            <defs>
                {/* Fire/Magma Distortion */}
                <filter id="fire-filter">
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="2">
                         <animate attributeName="baseFrequency" dur="10s" values="0.05;0.01" repeatCount="indefinite"/>
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="15" />
                </filter>
                
                {/* Liquid/Flood Distortion */}
                <filter id="water-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
                </filter>

                {/* Tornado/Wind Blur */}
                <filter id="wind-filter">
                     <feGaussianBlur in="SourceGraphic" stdDeviation="15 0" />
                </filter>
                
                {/* Digital Glitch/Noise */}
                <filter id="glitch-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" />
                    <feColorMatrix type="saturate" values="0" />
                    <feDisplacementMap in="SourceGraphic" scale="20" />
                </filter>
            </defs>
        </svg>

        {/* === DYNAMIC BACKGROUNDS === */}
        <div className="absolute inset-0 z-0 transition-colors duration-700 ease-in-out">
            {/* Ice: Deep Blue Pulse */}
            {phase === 'ice' && <motion.div animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-blue-950/40" />}
            
            {/* Quake: Brown/Dusty Shake */}
            {phase === 'quake' && <motion.div animate={{ x: [-10, 10, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 0.2 }} className="absolute inset-0 bg-stone-900/50" />}

            {/* Fire: Red Vignette */}
            {phase === 'fire' && <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(220,38,38,0.2)_0%,_rgba(0,0,0,1)_80%)]" />}

            {/* Flood: Underwater Teal */}
            {phase === 'flood' && <div className="absolute inset-0 bg-cyan-900/30" />}

            {/* Tornado: Grey Spin */}
            {phase === 'tornado' && <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="absolute inset-0 bg-slate-800/40 blur-3xl opacity-50" />}

            {/* Glitch: Green/Pink Split Background */}
            {phase === 'glitch' && <div className="absolute inset-0 bg-black border-4 border-l-green-500 border-r-pink-500 opacity-20 animate-pulse" />}

            {/* Void: Pure Black Hole */}
            {phase === 'void' && <motion.div animate={{ scale: [1, 0.1] }} className="absolute inset-0 bg-black z-50 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full box-shadow-xl shadow-white" /></motion.div>}
        </div>

        {/* === THE PROTAGONIST (TEXT) === */}
        <div className="relative z-10 text-center mix-blend-screen">
            <motion.h1 
                className="font-black text-6xl md:text-9xl leading-none tracking-tighter uppercase relative"
                animate={
                    phase === 'ice' ? { scale: 1 } :
                    phase === 'quake' ? { x: [-5, 5, -2, 2, 0], y: [2, -2, 0] } :
                    phase === 'fire' ? { scale: 1.05 } :
                    phase === 'flood' ? { skewX: [0, 10, -10, 0] } :
                    phase === 'tornado' ? { x: [0, 100, -100, 0], opacity: 0.6, filter: 'blur(4px)' } :
                    phase === 'glitch' ? { opacity: [1, 0, 1, 0.5, 1], x: [0, -20, 20, 0] } :
                    phase === 'void' ? { scale: 0, opacity: 0 } :
                    phase === 'rebirth' ? { scale: 1, opacity: 1, filter: 'none' } : {}
                }
                transition={
                    phase === 'quake' || phase === 'tornado' || phase === 'glitch' 
                    ? { duration: 0.1, repeat: Infinity } 
                    : { duration: 1 }
                }
                style={{
                    ...(phase === 'ice' && {
                        color: 'transparent',
                        WebkitTextStroke: '2px #A5F3FC',
                        textShadow: '0 0 10px #A5F3FC',
                    }),
                    ...(phase === 'quake' && {
                        color: '#78350f', // Dirt Brown
                        textShadow: '4px 4px 0px #292524',
                        filter: 'blur(0.5px)',
                    }),
                    ...(phase === 'fire' && {
                        color: '#ef4444', 
                        filter: 'url(#fire-filter)',
                        textShadow: '0 0 20px #f97316',
                    }),
                    ...(phase === 'flood' && {
                        color: '#06b6d4',
                        filter: 'url(#water-filter)',
                        opacity: 0.8,
                    }),
                    ...(phase === 'tornado' && {
                        color: '#94a3b8',
                        filter: 'url(#wind-filter)',
                        transformOrigin: 'center',
                    }),
                    ...(phase === 'glitch' && {
                        color: '#22c55e', // Matrix Green
                        textShadow: '-2px 0 #ec4899, 2px 0 #22c55e', // RGB Split
                        filter: 'url(#glitch-filter)',
                        fontFamily: 'monospace', // Tech shift
                    }),
                    ...(phase === 'rebirth' && {
                        background: 'linear-gradient(to right, #ffffff, #94a3b8, #ffffff)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                    })
                }}
            >
                <div>PROMPTED</div>
                <div className="text-4xl md:text-6xl my-4 opacity-80">BY</div>
                <div>HARSHAL</div>
            </motion.h1>

            {/* === PHASE SPECIFIC PARTICLES === */}
            {phase === 'ice' && <ParticleOverlay type="snow" />}
            {phase === 'quake' && <ParticleOverlay type="dust" />}
            {phase === 'fire' && <ParticleOverlay type="embers" />}
            {phase === 'tornado' && <ParticleOverlay type="debris" />}
        </div>
    </div>
  );
}

// Simple Particle System Component using React/Divs
function ParticleOverlay({ type }: { type: 'snow' | 'embers' | 'dust' | 'debris' }) {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate particles only on client-side to access window and avoid hydration mismatch
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            duration: Math.random() * 1 + 0.5,
            delay: Math.random() * 2
        }));
        setParticles(newParticles);
    }, []);
    
    // Config per type
    const config: Record<string, { color: string; size: string; moveY?: number; moveX?: number }> = {
        snow: { color: 'bg-white', size: 'w-1 h-1', moveY: 1000 },
        embers: { color: 'bg-orange-500', size: 'w-2 h-2', moveY: -1000 },
        dust: { color: 'bg-stone-500', size: 'w-3 h-3', moveY: 100 }, // short fall
        debris: { color: 'bg-gray-400', size: 'w-4 h-1', moveY: 0, moveX: 2000 }, // horizontal wind
    };

    const c = config[type];

    if (particles.length === 0) return null;

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
             {particles.map((p) => (
                 <motion.div
                    key={p.id}
                    className={`absolute rounded-full opacity-60 ${c.color} ${c.size}`}
                    initial={{ 
                        opacity: 0, 
                        x: p.x, 
                        y: p.y 
                    }}
                    animate={{ 
                        opacity: [0, 1, 0], 
                        x: c.moveX ? (Math.random() > 0.5 ? 1000 : -1000) : undefined,
                        y: c.moveY ? c.moveY : undefined,
                        rotate: 360
                    }}
                    transition={{ 
                        duration: p.duration, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: p.delay
                    }}
                 />
             ))}
        </div>
    );
}
