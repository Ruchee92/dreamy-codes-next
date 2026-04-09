import React, { useEffect, useRef } from 'react';

const InteractiveBackground = ({ isButtonHovering }: { isButtonHovering: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isButtonHoveringRef = useRef(isButtonHovering);

  useEffect(() => {
    isButtonHoveringRef.current = isButtonHovering;
  }, [isButtonHovering]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const mouse = { x: -1000, y: -1000 };
    let isHovering = false;
    let isIdle = false;
    let idleTimer: number | null = null;
    let initialized = false;
    let currentX = 0;
    let currentY = 0;
    let isWandering = false;
    let wanderStartX = 0;
    let wanderStartY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
        isHovering = true;
        isIdle = false;
        
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => {
          isIdle = true;
        }, 1000);
      } else {
        isHovering = false;
        isIdle = false;
        if (idleTimer) clearTimeout(idleTimer);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const spacing = 50;
    const dots: {x: number, y: number, baseRadius: number}[] = [];
    
    const initDots = () => {
      dots.length = 0;
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      // Align dots exactly with the 50px grid intersections
      for (let x = 0; x <= rect.width; x += spacing) {
        for (let y = 0; y <= rect.height; y += spacing) {
          dots.push({ x, y, baseRadius: 1.5 });
        }
      }
    };
    initDots();
    
    const handleResize = () => {
      resize();
      initDots();
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      const wanderX = width / 2 + 
                 Math.sin(time * 0.5) * (width * 0.3) + 
                 Math.cos(time * 0.3) * (width * 0.1);
      const wanderY = height / 2 + 
                 Math.cos(time * 0.4) * (height * 0.3) + 
                 Math.sin(time * 0.2) * (height * 0.1);

      if (!initialized) {
        currentX = wanderX;
        currentY = wanderY;
        initialized = true;
      }

      const isWanderMode = (!isHovering || isIdle) && !isButtonHoveringRef.current;

      if (isWanderMode && !isWandering) {
        isWandering = true;
        wanderStartX = currentX - (wanderX - width / 2);
        wanderStartY = currentY - (wanderY - height / 2);
      } else if (!isWanderMode) {
        isWandering = false;
      }

      const targetX = isWanderMode ? (wanderStartX + (wanderX - width / 2)) : mouse.x;
      const targetY = isWanderMode ? (wanderStartY + (wanderY - height / 2)) : mouse.y;

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      let effectRadius = 250; 
      if (isButtonHoveringRef.current) {
        effectRadius = 250 + Math.sin(time * 2) * 150;
      }

      dots.forEach(dot => {
        const dx = dot.x - currentX;
        const dy = dot.y - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let radius = dot.baseRadius;
        let opacity = 0.04;

        if (distance < effectRadius) {
          let intensity = 1 - (distance / effectRadius);
          intensity = intensity * intensity * (3 - 2 * intensity);
          
          radius += intensity * 1.5;
          opacity += intensity * 0.35;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17, 17, 17, ${opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', resize);
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default InteractiveBackground;
