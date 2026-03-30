"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

interface NavLink {
  name: string;
  href: string;
}

const Navbar = ({ menuItems }: { menuItems?: NavLink[] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultNavLinks = [
    { name: 'Our Work', href: '/our-work' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: "Let's Talk!", href: '/#contact' },
  ];

  const navLinks = menuItems?.length ? menuItems : defaultNavLinks;

  const handleLinkClick = (e: any, href: string) => {
    if (href.startsWith('/#')) {
      // Fixed: pathname is just a string now
      if (pathname === '/') {
        e.preventDefault();
        const id = href.replace('/#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#fcfcfc]/90 backdrop-blur-md border-b border-brand-900/10 py-4' : 'py-6'}`}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Fixed: Changed 'to' to 'href' */}
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer group relative z-10"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Image
              fetchPriority="high"
              src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/DREAMY-CODES-min-2.png"
              alt="Dreamy Codes Official E-commerce Agency Logo"
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
                className={link.name.toLowerCase().includes("let's talk")
                  ? "px-6 py-2 border-2 border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white transition-all duration-300 font-bold"
                  : "hover:text-gray-500 transition-colors"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button aria-label="Toggle Mobile Menu" className="lg:hidden text-brand-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-brand-900/10 p-6 lg:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href} // Fixed: Changed 'to' to 'href'
                className={link.name.toLowerCase().includes("let's talk")
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