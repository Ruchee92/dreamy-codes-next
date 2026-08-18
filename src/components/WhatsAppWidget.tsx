"use client";
import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { X } from 'lucide-react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Subscribed rather than read once into state: the setting can change while the
// page is open, and reading it in an effect would fire an extra render pass.
const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const WHATSAPP_URL = 'https://wa.me/+94714166608';
const MESSAGES = ['Hi there 👋', 'How can I help you?'];
const BRAND_GREEN = '#25D366';

const WhatsAppGlyph = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.99 2.898 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" />
  </svg>
);

/**
 * Floating WhatsApp launcher and chat card.
 *
 * Replaces the third-party Elfsight embed: same job, without the external
 * script, and it can honour the site's own motion preferences.
 */
const WhatsAppWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
  const [time, setTime] = useState('');
  // How many of the scripted messages have landed. Typing shows while more are
  // still to come.
  const [delivered, setDelivered] = useState(0);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Held back so it arrives once the page has settled rather than competing
    // with the hero for attention.
    const timer = setTimeout(() => setIsVisible(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  // Stamped on open rather than during render: the server has no idea what
  // time it is where the visitor is.
  const toggle = useCallback(() => {
    setIsOpen((open) => {
      if (!open) {
        setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
        setDelivered(0);
      }
      return !open;
    });
  }, []);

  // Plays the exchange out on open: type, first line, type again, second line.
  // Reduced motion skips straight to both lines.
  useEffect(() => {
    if (!isOpen) return;

    if (reducedMotion) {
      const show = setTimeout(() => setDelivered(MESSAGES.length), 0);
      return () => clearTimeout(show);
    }

    const timers = MESSAGES.map((_, i) =>
      setTimeout(() => setDelivered(i + 1), 1300 + i * 1400)
    );
    return () => timers.forEach(clearTimeout);
  }, [isOpen, reducedMotion]);

  // Escape closes the card, and focus returns to the launcher that opened it.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !launcherRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[90] flex flex-col items-end gap-3 print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Chat with Dreamy Codes on WhatsApp"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[calc(100vw-2.5rem)] max-w-[320px] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center gap-3 bg-[#128C7E] px-4 py-4 text-white">
              <span className="relative flex-shrink-0">
                <Image
                  src="https://wp.dreamycodes.com/wp-content/uploads/2026/08/founder-Ruchi.jpg"
                  alt=""
                  width={96}
                  height={96}
                  sizes="48px"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <span
                  className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#128C7E] bg-[#25D366]"
                  aria-hidden="true"
                ></span>
              </span>
              <span className="min-w-0">
                <span className="block font-display font-bold leading-tight">Ruchi</span>
                <span className="block text-xs text-white/80">Typically replies in minutes</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  launcherRef.current?.focus();
                }}
                aria-label="Close chat"
                className="-mr-1 ml-auto cursor-pointer rounded p-1 text-white/70 transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#ECE5DD] px-4 py-5">
              <p className="mb-3 text-center text-[10px] font-medium text-black/40">{time}</p>
              <div className="mb-5 flex flex-col items-start gap-2">
                {MESSAGES.slice(0, delivered).map((message) => (
                  <motion.p
                    key={message}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm text-brand-900 shadow-sm"
                  >
                    {message}
                  </motion.p>
                ))}

                {delivered < MESSAGES.length && (
                  <motion.span
                    layout
                    className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm"
                    aria-label="Typing"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="block h-2 w-2 rounded-full bg-gray-400"
                        animate={reducedMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                  </motion.span>
                )}
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3.5 font-display font-bold text-white shadow-sm transition-colors hover:bg-[#1EBE5A]"
              >
                <WhatsAppGlyph size={20} />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={toggle}
            aria-label={isOpen ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
            aria-expanded={isOpen}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            whileHover={reducedMotion ? undefined : { scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)]"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            {/* Idle ripple: a two-ring burst every ~6.8s rather than a
                constant pulse. Driven by CSS so it stays on the compositor;
                animating it through framer-motion scaled a border and jittered.
                The keyframes opt out under prefers-reduced-motion. */}
            {!isOpen && [0, 1].map((i) => (
              <span
                key={i}
                className={`pointer-events-none absolute inset-0 rounded-full border-2 opacity-0 animate-wa-ripple${
                  i === 1 ? ' animate-wa-ripple-delayed' : ''
                }`}
                style={{ borderColor: BRAND_GREEN }}
                aria-hidden="true"
              />
            ))}

            <WhatsAppGlyph size={28} />

            {!isOpen && (
              <span
                className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500"
                aria-hidden="true"
              ></span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatsAppWidget;
