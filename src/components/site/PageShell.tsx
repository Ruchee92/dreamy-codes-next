"use client";
import type { ReactNode } from 'react';
import MotionBoot, { MOTION_PRELUDE } from '../home/MotionBoot';
import FloaterGuard from '../home/FloaterGuard';
import PageMotion from './PageMotion';
import '../home/home.css';
import './site.css';

/**
 * Root of every redesigned inner page (round 02): the homepage's design system
 * (`.h-root`, tokens, type, buttons, reveal contract) plus the inner-page kit
 * (`.pg-*`, site.css). Render it inside `<main>`, between Navbar and Footer.
 *
 * Contract (same as home): the server HTML is the final page. Anything that
 * animates in is pre-hidden only under `.h-root[data-motion]` (set by the inline
 * prelude when motion is allowed) and `[data-failsafe]` (2.5s) un-hides all.
 * MotionBoot `immediate`: no shader to wait for, deferred scenes start at once.
 *
 * Anchors: every in-page `#id` link glides via MotionBoot and lands the target
 * 80px from the top (home's default, just under the nav). A target that starts
 * with a rule or border (accordion rows, ruled lists) must carry
 * `data-anchor-offset="-112"` so the rule stays visible below the nav (matches
 * the kit's sticky `top: 112px`).
 */
const PageShell = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={className ? `h-root pg-root ${className}` : 'h-root pg-root'} suppressHydrationWarning>
    {/* Runs at parse time: flags .h-root with data-motion before anything below paints. */}
    <script dangerouslySetInnerHTML={{ __html: MOTION_PRELUDE }} />
    {children}
    <FloaterGuard />
    {/* Last, so page scenes exist before the shared reveals and the refresh plumbing. */}
    <PageMotion />
    <MotionBoot immediate />
  </div>
);

export default PageShell;
