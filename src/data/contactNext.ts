// What happens after the contact form is sent. One source for the /contact-us
// side panel and the success dialog (home + /contact-us), so they never drift.
// Published promise only (form note + modal copy, facts-check): no turnaround time.

export const CONTACT_STEPS = [
  'Fill in the form',
  'We send a detailed audit of your store, with a Calendly link',
  'Book your call at a time that suits you',
];

/** Who replies (published portrait and role; Ruchi takes the calls, D-053). */
export const CONTACT_FOUNDER = {
  image: 'https://wp.dreamycodes.com/wp-content/uploads/2026/08/founder-Ruchi.jpg',
  title: 'You’ll talk to Ruchi',
  role: 'Founder & Lead Engineer',
};

/** The words in step 02 that the visitor's own store domain replaces as they type. */
export const STORE_PLACEHOLDER = 'your store';

/**
 * The typed "Current store URL" as a bare domain, or null. Untrusted input:
 * the result is only ever rendered as text (never HTML, never fetched).
 * Strips protocol, `www.`, port, path, query and hash; lowercases; accepts only
 * `label(.label)+` of [a-z0-9-], at most 40 characters.
 */
export function storeDomain(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const host = raw
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#:\s]/)[0];
  if (host.length > 40 || !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host)) return null;
  return host;
}
