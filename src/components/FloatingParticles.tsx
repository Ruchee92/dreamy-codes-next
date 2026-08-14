"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const PARTICLE_COUNT = 15;

interface Particle {
  size: number;
  startX: number;
  duration: number;
  delay: number;
  driftA: number;
  driftB: number;
}

const createParticles = (): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, () => ({
    size: Math.random() * 10 + 5,      // 5px to 15px
    startX: Math.random() * 100,       // 0% to 100%
    duration: Math.random() * 10 + 10, // 10s to 20s
    delay: Math.random() * 5,
    driftA: Math.random() * 50 - 25,
    driftB: Math.random() * 50 - 25,
  }));

const FloatingParticles = () => {
  // Particles are randomised, so they cannot be generated during render: the
  // server and the client would produce different values and React would fail
  // to hydrate. Generating them in an effect means the server emits an empty
  // container and the particles appear on the client only.
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setParticles(createParticles());
  }, []);

  // Purely decorative and infinitely looping, so stop the animation whenever
  // the hero is scrolled out of view rather than burning compositor time for
  // the rest of the session.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((particle, i) => {
        const isEmerald = i % 4 === 0;
        const shapeType = i % 3; // 0: circle, 1: square, 2: plus

        return (
          <motion.div
            key={i}
            className={`absolute ${isEmerald ? 'text-emerald-500' : 'text-[#3432c7]'}`}
            style={{
              left: `${particle.startX}%`,
              bottom: '-20px',
              width: particle.size,
              height: particle.size,
            }}
            animate={
              isInView
                ? {
                    y: ['0vh', '-120vh'],
                    x: [0, particle.driftA, particle.driftB, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 0.4, 0.4, 0],
                  }
                : undefined
            }
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
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
