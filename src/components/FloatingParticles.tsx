"use client";

import React from 'react';
import { motion } from 'motion/react';

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 10 + 5; // 5px to 15px
        const startX = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 10 + 10; // 10s to 20s
        const delay = Math.random() * 5;
        const isEmerald = i % 4 === 0;
        const shapeType = i % 3; // 0: circle, 1: square, 2: plus
        
        return (
          <motion.div
            key={i}
            className={`absolute ${isEmerald ? 'text-emerald-500' : 'text-[#3432c7]'}`}
            style={{
              left: `${startX}%`,
              bottom: '-20px',
              width: size,
              height: size,
            }}
            animate={{
              y: ['0vh', '-120vh'],
              x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.4, 0.4, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            }}
          >
            {shapeType === 0 && <div className="w-full h-full rounded-full border border-current" />}
            {shapeType === 1 && <div className="w-full h-full border border-current" />}
            {shapeType === 2 && (
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current -translate-y-1/2" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-current -translate-x-1/2" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingParticles;
