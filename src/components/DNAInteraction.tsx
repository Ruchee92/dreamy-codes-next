"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function DNAInteraction() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden bg-brand-900 border border-brand-800">
            <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 pointer-events-none"></div>

            {/* Decorative interactive elements representing 'DNA' of the brand */}
            <div className="relative flex gap-8 items-center h-64">
                {[...Array(12)].map((_, i) => {
                    // Calculate a wave effect based on mouse position
                    const yOffset = Math.sin((i / 12) * Math.PI * 4 + mousePosition.x / 200) * 40;
                    const scale = 1 + Math.cos((i / 12) * Math.PI * 2 + mousePosition.y / 200) * 0.2;

                    return (
                        <motion.div
                            key={i}
                            className="flex flex-col items-center justify-center gap-12"
                            animate={{ y: yOffset, scale }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        >
                            <div className="w-3 h-3 rounded-full bg-brand-500 shadow-[0_0_15px_rgba(var(--brand-500),0.8)]"></div>
                            <div className="w-[1px] h-20 bg-gradient-to-b from-brand-500 to-white/20"></div>
                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/40 font-display font-bold text-[10px] uppercase tracking-[0.3em]">
                <span>Brand Genetics</span>
                <span>Interactive Component</span>
            </div>
        </div>
    );
}
