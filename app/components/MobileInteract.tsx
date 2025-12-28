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
        // Initial position Top-Right
        x.set(window.innerWidth - 80);
        y.set(40);
    }, []);

    const handleDrag = () => {
        if (!hasInteracted) setHasInteracted(true);

        const rect = cursorRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Center of the orb
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Check all elements under the center point (pierce through the orb)
        const elements = document.elementsFromPoint(cx, cy);
        
        // Find the first element that belongs to a project card
        const card = elements.find(el => el.closest('[data-project-id]'))?.closest('[data-project-id]');
        
        if (card) {
            const id = Number(card.getAttribute('data-project-id'));
            onHoverChange(id);
        } else {
            onHoverChange(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none md:hidden">
            {/* Instruction Arrow & Text (Disappears immediately on interaction) */}
            <motion.div 
                ref={arrowRef}
                className="absolute"
                style={{ left: x, top: y, x: -140, y: 0 }} // Offset to the Left of the orb
                initial={{ opacity: 0 }}
                animate={{ opacity: hasInteracted ? 0 : 1 }}
                transition={{ delay: 2, duration: 0.2 }} // Initial fade in delay, but we handle click removal fast
            > 
                {!hasInteracted && (
                    <div className="relative w-32 flex items-center justify-end gap-2">
                        <p className="text-[10px] font-mono text-white/80 mb-0.5 whitespace-nowrap">
                            Drag this to navigate
                        </p>
                        {/* Arrow pointing Right (towards orb) */}
                        <svg width="30" height="20" viewBox="0 0 50 20" className="stroke-white/60 fill-none">
                             <path d="M0,10 L40,10" strokeWidth="2" markerEnd="url(#arrowhead_right)" />
                             <defs>
                                <marker id="arrowhead_right" markerWidth="6" markerHeight="4" refX="0" refY="2" orient="auto">
                                    <polygon points="0 0, 6 2, 0 4" fill="currentColor" />
                                </marker>
                             </defs>
                        </svg>
                    </div>
                )}
            </motion.div>

            {/* Glowing Orb Cursor */}
            <motion.div
                ref={cursorRef}
                drag
                dragMomentum={false}
                onDrag={handleDrag}
                onPointerDown={() => setHasInteracted(true)} // Immediate disappear on touch
                style={{ x, y }}
                className="absolute w-10 h-10 pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
            >
                {/* Visual Orb */}
                <motion.div 
                    className="w-full h-full rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center"
                    animate={{ 
                        boxShadow: [
                            "0 0 15px rgba(255,0,0,0.5)",
                            "0 0 15px rgba(0,255,0,0.5)",
                            "0 0 15px rgba(0,0,255,0.5)",
                            "0 0 15px rgba(255,0,0,0.5)"
                        ],
                        backgroundColor: [
                            "rgba(255,0,0,0.1)", 
                            "rgba(0,255,0,0.1)", 
                            "rgba(0,0,255,0.1)", 
                            "rgba(255,0,0,0.1)"
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                </motion.div>
                
                {/* RGB Glow ring */}
                <motion.div 
                    className="absolute inset-0 -z-10 rounded-full blur-xl opacity-60" 
                    animate={{ 
                        backgroundColor: [
                            "#ff0000",
                            "#00ff00",
                            "#0000ff",
                            "#ff0000"
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
}
