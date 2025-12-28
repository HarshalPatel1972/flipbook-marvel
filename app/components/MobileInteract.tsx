'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function MobileInteract({ onHoverChange }: { onHoverChange: (id: number | null) => void }) {
    const cursorRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    
    // Position state - start near bottom right
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Initial position safely set on mount to avoid hydration mismatch
        x.set(window.innerWidth - 100);
        y.set(window.innerHeight - 150);
    }, []);

    const handleDrag = () => {
        if (!hasInteracted) setHasInteracted(true);

        const rect = cursorRef.current?.getBoundingClientRect();
        if (!rect) return;

        // "Flashlight" collision detection
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Check element under the center of the orb
        const element = document.elementFromPoint(cx, cy);
        
        // Find closest parent with data-project-id
        const card = element?.closest('[data-project-id]');
        
        if (card) {
            const id = Number(card.getAttribute('data-project-id'));
            onHoverChange(id);
        } else {
            onHoverChange(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none md:hidden">
            {/* Instruction Arrow & Text (Fades out on interaction) */}
            <motion.div 
                ref={arrowRef}
                className="absolute"
                style={{ left: x, top: y, x: -60, y: -40 }} // Offset relative to cursor
                initial={{ opacity: 0 }}
                animate={{ opacity: hasInteracted ? 0 : 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <div className="relative w-32">
                     <p className="text-[10px] font-mono text-white/80 w-full text-right mb-1">
                        Use to navigate
                    </p>
                    {/* Wavy Arrow SVG */}
                    <svg width="40" height="40" viewBox="0 0 50 50" className="absolute right-0 rotate-12 stroke-white/60 fill-none">
                        <path d="M10,10 Q20,40 40,30" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <defs>
                            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="0" refY="2" orient="auto">
                                <polygon points="0 0, 6 2, 0 4" fill="currentColor" />
                            </marker>
                        </defs>
                    </svg>
                </div>
            </motion.div>

            {/* Glowing Orb Cursor */}
            <motion.div
                ref={cursorRef}
                drag
                dragMomentum={false}
                onDrag={handleDrag}
                style={{ x, y }}
                className="absolute w-16 h-16 pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
            >
                {/* Visual Orb */}
                <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center animate-pulse-slow">
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
                {/* Glow ring */}
                <div className="absolute inset-0 -z-10 bg-white/5 rounded-full blur-xl" />
            </motion.div>
        </div>
    );
}
