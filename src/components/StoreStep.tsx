import { STORE_PLACEHOLDER } from '../data/contactNext';

/**
 * A "What happens next" step with "your store" swapped for the visitor's own
 * domain (already normalised by `storeDomain`). Rendered as React text only.
 * The span is keyed by the domain, so each new value replays its underline draw.
 */
const StoreStep = ({ text, store, className }: { text: string; store?: string | null; className: string }) => {
  const at = text.indexOf(STORE_PLACEHOLDER);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span key={store ?? ''} className={store ? `${className} is-domain` : className}>
        {store ?? STORE_PLACEHOLDER}
      </span>
      {text.slice(at + STORE_PLACEHOLDER.length)}
    </>
  );
};

export default StoreStep;
