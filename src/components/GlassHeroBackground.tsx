"use client";
import React, { useCallback, useMemo, useState } from 'react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';

/**
 * Full-bleed WebGPU backdrop for the homepage hero ("Glass Agency" look):
 * a soft brand-indigo bloom that follows the cursor with momentum, seen through
 * drifting diagonal fluted-glass ribs, finished with a whisper of film grain.
 *
 * Cursor reactivity is built into ChromaFlow (window-level listeners), so the
 * wrapper stays pointer-events:none and the hero links above it remain clickable.
 * If WebGPU is unavailable the canvas stays transparent, so we fall back to the
 * original grid pattern and the ink-on-white content reads exactly as before.
 *
 * A `hero-backdrop-ready` event fires on `document` once the backdrop is actually
 * painted — or once we know it never will be — so the hero copy can stagger in
 * after it, Apple-style.
 *
 * The <Shader> element is memoised and the ready callback goes through a ref:
 * re-rendering the subtree while the GPU device is still being acquired aborts
 * initialisation, and the canvas then never paints.
 */
const GlassHeroBackground = () => {
  const [unavailable, setUnavailable] = useState(false);
  const [painted, setPainted] = useState(false);

  // The hero copy is released by a parse-time inline script listening for this
  // event, so the reveal never has to wait for React to hydrate.
  const handleReady = useCallback(() => {
    setPainted(true);
    document.dispatchEvent(new Event('hero-backdrop-ready'));
  }, []);

  const handleUnavailable = useCallback(() => {
    setUnavailable(true);
    document.dispatchEvent(new Event('hero-backdrop-ready'));
  }, []);

  const shader = useMemo(() => (
    <Shader
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      onReady={handleReady}
      onUnavailable={handleUnavailable}
    >
      <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
      <ChromaFlow
        baseColor="#ffffff"
        downColor="#3432c7"
        leftColor="#56c2fc"
        rightColor="#5b4fff"
        upColor="#7f66ff"
        // 13 sat at the bottom of the 10-60 range, so colour died almost as
        // soon as it was laid down — with no cursor to feed it, phones saw
        // static texture. 35 leaves a visible wake behind a scroll.
        momentum={35}
        intensity={1.2}
        radius={3.5}
      />
      <FlutedGlass
        aberration={0.61}
        angle={31}
        frequency={8}
        highlight={0.12}
        highlightSoftness={0}
        lightAngle={-90}
        refraction={4}
        shape="rounded"
        softness={1}
        speed={0.15}
      />
      <FilmGrain strength={0.05} />
    </Shader>
  ), [handleReady, handleUnavailable]);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {unavailable && <div className="absolute inset-0 bg-grid-pattern"></div>}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{ opacity: painted ? 1 : 0 }}
      >
        {shader}
      </div>
    </div>
  );
};

export default React.memo(GlassHeroBackground);
