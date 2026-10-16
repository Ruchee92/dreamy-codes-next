"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

interface NavLink {
  name: string;
  href: string;
}

interface NavMobileMenuProps {
  id: string;
  open: boolean;
  links: NavLink[];
  menuRef: React.Ref<HTMLDivElement>;
  isCurrent: (link: NavLink) => boolean;
  isCallToAction: (link: NavLink) => boolean;
  currentLine: string;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

/**
 * The phone menu panel, split out of Navbar so motion/react (~45KB gzipped)
 * is fetched after the page has loaded instead of competing with the first
 * paint (D-073). Markup and animation are unchanged.
 */
const NavMobileMenu = ({
  id,
  open,
  links,
  menuRef,
  isCurrent,
  isCallToAction,
  currentLine,
  onLinkClick,
}: NavMobileMenuProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        ref={menuRef}
        id={id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-full left-0 w-full bg-white border-b border-brand-900/10 p-6 lg:hidden flex flex-col gap-6"
      >
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            aria-current={isCurrent(link) ? 'page' : undefined}
            className={isCallToAction(link)
              ? "font-display font-bold text-lg uppercase tracking-widest px-6 py-3 border-2 border-brand-900 text-center"
              : `font-display font-bold text-lg uppercase tracking-widest${isCurrent(link) ? currentLine : ''}`
            }
            onClick={(e) => onLinkClick(e, link.href)}
          >
            {link.name}
          </Link>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

export default NavMobileMenu;
