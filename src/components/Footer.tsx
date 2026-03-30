"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, Linkedin, Facebook } from 'lucide-react';
import Image from 'next/image';

// Added TypeScript interface for the Pinterest props
interface PinterestProps {
  size?: number;
  className?: string;
}

const Pinterest = ({ size = 20, className = "" }: PinterestProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.162 0 7.397 2.965 7.397 6.93 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
  </svg>
);

const Footer = () => {
  const pathname = usePathname();

  // Added TypeScript types for 'e' and 'href'
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      // Fixed: location.pathname is now just pathname
      if (pathname === '/') {
        e.preventDefault();
        const id = href.replace('/#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer 
      className="bg-black text-white py-16"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 100%, #1a1a1a 0%, #000 70%)',
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-3 inline-block">
                <Image 
                  src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/DREAMY-CODES-min-2.png" 
                  alt="Dreamy Codes Official Agency Logo - Shopify Plus Expert Developers" 
                  width={150}
                  height={32}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </Link>
              <p className="text-gray-400 text-sm max-w-xs">Scaling your D2C brand with expert Shopify engineering.</p>
            </div>

            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-500" />
                <a href="mailto:hello@dreamycodes.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">hello@dreamycodes.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-500" />
                <a href="https://api.whatsapp.com/send?phone=94714166608" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+94 (71) 416-6608</a>
              </div>
            </div>

            <div className="flex gap-5 mt-2">
              <a href="https://www.pinterest.com/ecomruchi/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Pinterest">
                <Pinterest size={20} />
              </a>
              <a href="https://www.linkedin.com/in/ruchiramadushan/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61556683471035" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold uppercase tracking-widest text-sm text-white mb-2">Menu</h4>
            <nav className="flex flex-col gap-3 font-display uppercase tracking-widest text-xs font-bold text-gray-400">
              <Link href="/our-work" className="hover:text-white transition-colors">Our Work</Link>
              <Link href="/case-studies" className="hover:text-white transition-colors">Case studies</Link>
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/#contact" onClick={(e) => handleLinkClick(e, '/#contact')} className="hover:text-white transition-colors">Contact us</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold uppercase tracking-widest text-sm text-white mb-2">Legal</h4>
            <nav className="flex flex-col gap-3 font-display uppercase tracking-widest text-xs font-bold text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-xs font-display uppercase tracking-widest">
          Copyright &copy; 2026 Dreamy Codes. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;