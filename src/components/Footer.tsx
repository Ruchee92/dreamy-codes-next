"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Linkedin, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';
import './footer.css';

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
    aria-hidden="true"
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.162 0 7.397 2.965 7.397 6.93 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
  </svg>
);

// lucide-react still exports the pre-rebrand bird as `Twitter`, so the current
// mark is drawn here.
const XMark = ({ size = 20, className = "" }: PinterestProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const EMAIL = 'hello@dreamycodes.com';
const WHATSAPP_HREF = 'https://api.whatsapp.com/send?phone=94714166608';
const PHONE_LABEL = '+94 (71) 416-6608';

const COMPANY_LINKS = [
  { href: '/our-work', label: 'Our work' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact-us', label: 'Contact us' },
  { href: '/blog', label: 'Blog' },
];

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/terms-of-service', label: 'Terms of service' },
  { href: '/refund-policy', label: 'Refund policy' },
];

const SOCIALS = [
  { href: 'https://www.pinterest.com/ecomruchi/', label: 'Pinterest', Icon: Pinterest },
  { href: 'https://www.linkedin.com/in/ruchiramadushan/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://www.facebook.com/profile.php?id=61556683471035', label: 'Facebook', Icon: Facebook },
  { href: 'https://x.com/RuchiShopify', label: 'X', Icon: XMark },
  { href: 'https://www.instagram.com/dreamycodes9/', label: 'Instagram', Icon: Instagram },
];

/**
 * Shared site footer (D-031): a display-size email as the closing moment, then a
 * 12-column link grid and a bottom bar with the partner badge. Styles live in
 * footer.css (plain CSS, `ft-` prefix) so they apply on every route.
 */
const Footer = () => {
  return (
    <footer className="ft">
      <div className="ft-wrap">
        <div className="ft-top">
          <a href={`mailto:${EMAIL}`} className="ft-email">
            <span className="ft-email-text">{EMAIL}</span>
            <ArrowUpRight className="ft-email-arrow" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <div className="ft-aside">
            <p className="ft-tagline">Scaling your D2C brand with expert Shopify engineering.</p>
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="ft-link">
              WhatsApp {PHONE_LABEL}
            </a>
          </div>
        </div>

        <div className="ft-grid">
          <div className="ft-brand">
            <Link href="/" className="ft-logo" aria-label="Dreamy Codes home">
              {/* Footer artwork is supplied light on transparent: no inversion needed. */}
              <Image
                src="https://wp.dreamycodes.com/wp-content/uploads/2026/08/Footer-logo-Dreamy-Codes.png"
                alt="Dreamy Codes"
                width={450}
                height={87}
                sizes="(min-width: 1024px) 240px, 210px"
                className="ft-logo-img"
              />
            </Link>
            <ul className="ft-socials">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="ft-social" aria-label={label}>
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="ft-col ft-col--company" aria-labelledby="ft-company">
            <p id="ft-company" className="ft-col-title">Company</p>
            <ul className="ft-list">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="ft-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="ft-col ft-col--legal" aria-labelledby="ft-legal">
            <p id="ft-legal" className="ft-col-title">Legal</p>
            <ul className="ft-list">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="ft-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          {/* No separate Contact column: the email and WhatsApp already lead the footer above. */}
        </div>

        <div className="ft-bar">
          <p className="ft-copy">
            Copyright &copy; {new Date().getFullYear()} Dreamy Codes (Pvt) Ltd. All Rights Reserved.
          </p>
          {/* Partner artwork is light on transparent, so it reads on black as is. */}
          <Image
            src="https://wp.dreamycodes.com/wp-content/uploads/2026/08/shopify-partners.png"
            alt="Shopify Partners"
            width={559}
            height={107}
            sizes="150px"
            className="ft-badge"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
