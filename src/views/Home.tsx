"use client";
import ContactSection from '../components/ContactSection';
import Hero from '../components/home/Hero';
import ProofPlate from '../components/home/ProofPlate';
import Showreel from '../components/home/Showreel';
import WorkReel from '../components/home/WorkReel';
import Numbers from '../components/home/Numbers';
import CaseStudies from '../components/home/CaseStudies';
import Capabilities from '../components/home/Capabilities';
import Testimonials from '../components/home/Testimonials';
import Founder from '../components/home/Founder';
import SignOff, { ContactFacts } from '../components/home/SignOff';
import FloaterGuard from '../components/home/FloaterGuard';
import MotionBoot, { MOTION_PRELUDE } from '../components/home/MotionBoot';
import '../components/home/home.css';

/**
 * Homepage, "Engineered Editorial" (round 01). Sections live in
 * components/home; motion is GSAP + Lenis (desktop, fine pointer) and every
 * pre-hidden state is gated on [data-motion] on .h-root, so the server HTML and the
 * no-JS / reduced-motion page are complete.
 */
const Home = () => {
  return (
    <div className="h-root" suppressHydrationWarning>
      {/* Runs at parse time: sets data-motion on .h-root (when motion is allowed) before
          anything below paints, and arms the 2.5s failsafe. */}
      <script dangerouslySetInnerHTML={{ __html: MOTION_PRELUDE }} />
      <Hero />
      <ProofPlate />
      {/* The 32s promo continues the black plate before the work reel (2026-10-18). */}
      <Showreel />
      <WorkReel />
      {/* D-060: the numbers as their own pause between the work and the case studies. */}
      <Numbers />
      <CaseStudies />
      <Capabilities />
      <Testimonials />
      <Founder />
      {/* One contact block (D-014): heading + intro, then the form and one side
          panel. ContactSection's "home" variant renders no section/heading of its own. */}
      <section id="contact" className="h-contact" aria-labelledby="h-contact-title">
        <div className="h-container">
          <SignOff />
          <ContactSection variant="home" aside={<ContactFacts />} />
        </div>
      </section>
      <FloaterGuard />
      <MotionBoot />
    </div>
  );
};

export default Home;
