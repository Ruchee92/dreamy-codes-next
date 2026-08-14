"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import {
  scrollIntoViewRespectingMotionPreference,
  scrollToRespectingMotionPreference,
} from '../utils/motion';

interface NavLink {
  name: string;
  href: string;
}

const MOBILE_MENU_ID = 'mobile-nav-menu';

const Navbar = ({ menuItems }: { menuItems?: NavLink[] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // While the menu is open it covers the page, so the page behind it must not
  // scroll, Escape must close it, and Tab must not walk out of it into content
  // the visitor cannot see.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusable?.length) return;

      // The toggle stays part of the loop so the menu can always be closed
      // from the keyboard without tabbing into the page behind it.
      const items = [toggleButtonRef.current, ...Array.from(focusable)].filter(
        Boolean
      ) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const defaultNavLinks = [
    { name: 'Our Work', href: '/our-work' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact Us', href: '/#contact' },
  ];

  const navLinks = menuItems?.length ? menuItems : defaultNavLinks;

  // Which entry gets the outlined button treatment. Keyed off the target
  // rather than the label, so a rename in the WordPress menu cannot silently
  // demote the call to action back to a plain text link.
  const isCallToAction = (link: NavLink) => link.href.replace(/\/$/, '') === '/#contact';

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('/#')) {
      if (pathname === '/') {
        e.preventDefault();
        const id = href.replace('/#', '');
        const target = document.getElementById(id);
        if (target) scrollIntoViewRespectingMotionPreference(target);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      aria-label="Primary"
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#fcfcfc]/90 backdrop-blur-md border-b border-brand-900/10 py-4' : 'py-6'}`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Fixed: Changed 'to' to 'href' */}
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer group relative z-10"
            onClick={() => {
              setIsMobileMenuOpen(false);
              scrollToRespectingMotionPreference({ top: 0 });
            }}
          >
            <Image
              fetchPriority="high"
              src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/DREAMY-CODES-min-2.png"
              alt="Dreamy Codes"
              width={200}
              height={48}
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-10 items-center font-display text-sm font-medium uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href} // Fixed: Changed 'to' to 'href'
                onClick={(e) => handleLinkClick(e, link.href)}
                className={isCallToAction(link)
                  ? "px-6 py-2 border-2 border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white transition-all duration-300 font-bold"
                  : "hover:text-gray-500 transition-colors"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            ref={toggleButtonRef}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls={MOBILE_MENU_ID}
            className="lg:hidden text-brand-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            id={MOBILE_MENU_ID}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-brand-900/10 p-6 lg:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href} // Fixed: Changed 'to' to 'href'
                className={isCallToAction(link)
                  ? "font-display font-bold text-lg uppercase tracking-widest px-6 py-3 border-2 border-brand-900 text-center"
                  : "font-display font-bold text-lg uppercase tracking-widest"
                }
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;