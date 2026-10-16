"use client";
import { useEffect, useRef } from 'react';
import { gsap, lenisRef } from '../../home/motion';
import { helixBatches, helixGeo, helixSvgPaths, paintBatches, STATIC_THETA, type HelixGeo } from './helix';

// Static frames for the server HTML: one per box size (CSS shows one). Wide
// viewBoxes, cropped from the left (`slice`), so any width shows the same frame
// without distortion. Computed once at module load.
const SVG_DESKTOP = { w: 1920, h: 240, paths: helixSvgPaths(helixGeo(1920, 240)) };
const SVG_PHONE = { w: 767, h: 120, paths: helixSvgPaths(helixGeo(767, 120)) };

const StaticHelix = ({ w, h, paths, className }: typeof SVG_DESKTOP & { className: string }) => (
  <svg className={`ab-dna-svg ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMinYMid slice" focusable="false">
    {paths.map((p, i) =>
      p.fill ? (
        <path key={i} d={p.d} fill={p.fill} />
      ) : (
        <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth={p.w} strokeLinecap={p.cap} />
      ),
    )}
  </svg>
);

const IDLE = 0.35; // rad/s: calm, it is hero texture, not the page's signature

/**
 * /about hero: "what's in our DNA?" drawn as a horizontal 3D double helix
 * (D-051, AD H1–H4). Two strands with real grooves (the second trails by
 * ~135°), depth from width and opacity (front strand indigo, back strand ink),
 * a paper knockout under every front piece so the strands pass over and under
 * each other, and fewer, bolder base pairs (two-colour rungs, square nodes on
 * the near end). Painted back to front in depth-bucketed batches (helix.ts).
 * - Intro: the strands unzip in from the left with the kit's hero-rule timing.
 * - Idle: a slow spin, drawn at 30fps. Scroll velocity spins it faster.
 * - Fine pointer: a local wring under the cursor (phase + a little swell, Gaussian),
 *   full frame rate while it acts; it unwinds over 600ms after the pointer leaves.
 * - Runs only while on screen and the tab is visible.
 * Reduced motion / no JS: the server SVG of the same frame in the same fixed
 * box (no canvas, no loop, zero CLS).
 */
const DnaHelix = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'ab-dna-canvas';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    box.appendChild(canvas);

    let g: HelixGeo = helixGeo(box.clientWidth, box.clientHeight);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      g = helixGeo(box.clientWidth, box.clientHeight);
      canvas.width = Math.round(g.W * dpr);
      canvas.height = Math.round(g.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    // Intro timing matches the kit's hero rule (h-draw, 1000ms at 600ms).
    const ease = gsap.parseEase('dc');
    const t0 = performance.now() + Math.max(120, 600 - performance.now());
    let theta = STATIC_THETA;
    let spin = 0;
    let px = 0;
    let aimPx = 0;
    let wring = 0;
    let pointerIn = false;
    let lastY = window.scrollY;
    let last = performance.now();
    let lastDraw = 0;
    let raf = 0;
    let painted = false;

    const draw = (reveal: number) => {
      ctx.clearRect(0, 0, g.W, g.H);
      paintBatches(ctx, helixBatches(g, { theta, px, wring, reveal }));
      if (!painted) {
        painted = true;
        box.setAttribute('data-live', ''); // the canvas now covers the static SVG
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const y = window.scrollY;
      const v = lenisRef.current ? lenisRef.current.velocity : y - lastY;
      lastY = y;
      spin = Math.max(-3, Math.min(3, (spin + v * 0.0025) * 0.92));
      theta += (IDLE + spin) * dt;
      px += (aimPx - px) * 0.1;
      wring = pointerIn ? wring + (1 - wring) * 0.1 : Math.max(0, wring - dt / 0.6);
      const p = Math.min(1, Math.max(0, (now - t0) / 1000));
      // Idle spin at 30fps; full rate during the intro, a scroll spin or a wring.
      const busy = p < 1 || Math.abs(spin) > 0.02 || wring > 0.001;
      if (!busy && now - lastDraw < 32) return;
      lastDraw = now;
      draw(ease(p));
    };

    let visible = false;
    const run = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) {
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(tick);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    }, { rootMargin: '100px' });
    io.observe(box);
    document.addEventListener('visibilitychange', run);

    const ro = new ResizeObserver(() => {
      size();
      if (!visible) draw(1);
    });
    ro.observe(box);

    // Pointer (fine pointers only), anywhere over the hero: the wring follows x.
    const hero = box.closest('.pg-hero') as HTMLElement | null;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX - box.getBoundingClientRect().left;
      if (!pointerIn && wring < 0.05) px = x; // a fresh wring starts under the pointer
      aimPx = x;
      pointerIn = true;
    };
    const onLeave = () => {
      pointerIn = false;
    };
    if (hero && fine) {
      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', run);
      if (hero && fine) {
        hero.removeEventListener('pointermove', onMove);
        hero.removeEventListener('pointerleave', onLeave);
      }
      canvas.remove();
      box.removeAttribute('data-live');
    };
  }, []);

  return (
    <div ref={ref} className="ab-dna" aria-hidden="true">
      <StaticHelix {...SVG_DESKTOP} className="ab-dna-svg--d" />
      <StaticHelix {...SVG_PHONE} className="ab-dna-svg--m" />
    </div>
  );
};

export default DnaHelix;
