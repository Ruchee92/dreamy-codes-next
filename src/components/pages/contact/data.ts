// /contact-us content (round 02). Published lines and copy.md (round-02) only:
// no response-time promise, one "Shopify Partners" claim (Fact 3).
import { reviewBy } from '../../home/data';
import { CONTACT_FOUNDER, CONTACT_STEPS } from '../../../data/contactNext';

export const INTRO = 'Tell us where your store is stuck. We audit it before the call, so we can talk about specific fixes.';

export const STEPS = CONTACT_STEPS;

export const SENT = 'Sent. We’re working on your audit.';

/**
 * CRO 5: proof at the point of action, under the form heading (all PUBLISHED). It
 * replaces the old facts list: price and timezones sit above submit, and the
 * credentials are here, so a facts block would only repeat them.
 */
export const TRUST = ['300+ projects completed', 'Shopify Partners', 'Building since 2023'];

export const FOUNDER = CONTACT_FOUNDER;

const stacy = reviewBy('Stacy');
const florence = reviewBy('Florence');
/** Two published 5★ excerpts (D-041), verbatim. D-055: Florence replaces Emily (Emily stays on the Succly chapter). */
export const REVIEWS = [
  { excerpt: '“…he was patient, responsive and open to collaborating…”', name: stacy.name, role: stacy.role, image: stacy.image, monogram: stacy.monogram },
  { excerpt: `“${florence.excerpt}”`, name: florence.name, role: florence.role, image: florence.image, monogram: florence.monogram },
];

/** CRO: the price and the timezones at the decision point, directly above submit (PUBLISHED). */
export const PRE_SUBMIT = 'Projects start at $990. We work in EST & GMT timezones.';


/** The three required fields the progress counts (the URL is optional). */
export const REQUIRED = ['name', 'email', 'message'] as const;
