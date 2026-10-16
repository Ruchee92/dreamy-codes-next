type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Runs `cb` after the window `load` event and the next idle moment (2s cap),
 * so non-critical chunks never compete with first paint or hydration (D-073).
 * Returns a cleanup for useEffect.
 */
export function whenIdleAfterLoad(cb: () => void): () => void {
  const w = window as IdleWindow;
  let idle = 0;
  let timer = 0;
  const start = () => {
    if (w.requestIdleCallback) idle = w.requestIdleCallback(cb, { timeout: 2000 });
    else timer = window.setTimeout(cb, 200);
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
  return () => {
    window.removeEventListener('load', start);
    if (idle) w.cancelIdleCallback?.(idle);
    window.clearTimeout(timer);
  };
}
