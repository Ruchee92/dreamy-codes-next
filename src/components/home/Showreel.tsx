"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { navOverDark, useHomeMotion } from './motion';

// Hosted in the WordPress media library (16:9, 32s, H.264/AAC, ~16 MB).
const SRC = 'https://wp.dreamycodes.com/wp-content/uploads/2026/10/v2-draft-8-preview.mp4';
const POSTER = '/home/showreel-poster.webp';

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

// false in the server HTML and during hydration, true once the client has taken over.
const noSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

/**
 * The 32-second promo on the black plate between the proof band and the work reel.
 *
 * Background mode: the film loops muted under a dark overlay with a play button, and
 * only while it is on screen. Clicking play restarts it from the top with sound and the
 * native controls; when it ends it drops back to the background loop.
 *
 * Nothing is fetched until the frame is near the viewport (preload="none" + poster), so
 * it never touches LCP. Reduced motion and save-data skip the background loop (poster +
 * button only). The server HTML renders a plain <video controls>, so it works without JS.
 */
const Showreel = () => {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ready = useHydrated(); // hydrated: switch from plain player to background mode
  const [playing, setPlaying] = useState(false); // the viewer pressed play (sound on, controls on)
  const playingRef = useRef(false);
  const ambientOk = useRef(true);

  useHomeMotion(ref, (_, root) => {
    const offNav = navOverDark(root);
    return () => offNav();
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const nav = navigator as SaveDataNavigator;
    ambientOk.current = !(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || nav.connection?.saveData === true
    );
    // Background loop runs only while the frame is at least half on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (playingRef.current || !ambientOk.current) return;
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(video);

    // The film ran to its end with sound: back to the quiet loop.
    const onEnded = () => {
      if (!playingRef.current) return;
      playingRef.current = false;
      setPlaying(false);
      video.muted = true;
      video.loop = true;
      video.currentTime = 0;
      if (ambientOk.current) video.play().catch(() => {});
    };
    video.addEventListener('ended', onEnded);

    return () => {
      io.disconnect();
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    playingRef.current = true;
    setPlaying(true);
    video.loop = false;
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {
      // Autoplay with sound refused (rare after a click): fall back to muted so it still plays.
      video.muted = true;
      video.play().catch(() => {});
    });
    video.focus({ preventScroll: true });
  };

  const ambient = ready && !playing;

  return (
    <section ref={ref} className="h-showreel" aria-label="Dreamy Codes film">
      <div className="h-container">
        <div className={`h-showreel-frame${ambient ? ' is-ambient' : ''}`}>
          <video
            ref={videoRef}
            className="h-showreel-video"
            src={SRC}
            poster={POSTER}
            preload="none"
            muted
            loop
            playsInline
            controls={!ambient}
            tabIndex={ambient ? -1 : undefined}
            width={1920}
            height={1080}
            aria-label="Dreamy Codes in 32 seconds: more sales from the same traffic, our Shopify work, results and how to book a free strategy call."
          />
          {ambient && (
            <div className="h-showreel-overlay">
              <button type="button" className="h-showreel-play" onClick={playWithSound}>
                <span className="h-showreel-play-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28">
                    <path d="M7 4.5v15L19.5 12z" fill="currentColor" />
                  </svg>
                </span>
                <span className="h-showreel-play-label">Play with sound</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Showreel;
