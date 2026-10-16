import type * as React from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

type Common = {
  href: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  external?: boolean;
};

/** Hash targets stay plain anchors (Lenis handles them); paths use next/link. */
const Anchor = ({
  href,
  external,
  className,
  children,
  ...rest
}: Common & { 'data-magnetic'?: string }) => {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
        {children}
      </a>
    );
  }
  if (href.startsWith('#') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
};

/** Two arrows in an overflow box: the first leaves right, a copy arrives from the left. */
const Conveyor = ({ diagonal = false }: { diagonal?: boolean }) => {
  const Icon = diagonal ? ArrowUpRight : ArrowRight;
  return (
    <span className="h-btn-icon" aria-hidden="true">
      <Icon strokeWidth={1.75} />
      <Icon strokeWidth={1.75} />
    </span>
  );
};

export const PrimaryButton = ({
  href,
  children,
  className = '',
  magnetic = false,
  ...rest
}: Common & { magnetic?: boolean; 'data-magnetic'?: string }) => {
  const button = (
    <Anchor
      href={href}
      className={`h-btn h-btn--primary ${className}`}
      {...rest}
      {...(magnetic ? { 'data-magnetic': '' } : {})}
    >
      <span className="h-btn-in">
        <span className="h-btn-label">{children}</span>
        <Conveyor />
      </span>
    </Anchor>
  );
  // The extra 24px of reach around a magnetic button is a padded wrapper.
  return magnetic ? <div className="h-mag">{button}</div> : button;
};

export const SecondaryButton = ({
  href,
  children,
  className = '',
  dark = false,
  external = false,
  ...rest
}: Common & { dark?: boolean }) => (
  <Anchor
    href={href}
    external={external}
    className={`h-btn h-btn--secondary ${dark ? 'h-btn--dark' : ''} ${className}`}
    {...rest}
  >
    <span className="h-btn-in">
      <span className="h-btn-label">{children}</span>
      <Conveyor />
    </span>
  </Anchor>
);

export const ArrowLink = ({
  href,
  children,
  className = '',
  external = false,
  diagonal = false,
  ...rest
}: Common & { diagonal?: boolean }) => {
  const Icon = diagonal ? ArrowUpRight : ArrowRight;
  return (
    <Anchor href={href} external={external} className={`h-link-arrow ${className}`} {...rest}>
      <span className="h-link-text">{children}</span>
      <Icon className="h-link-icon" size={16} strokeWidth={1.75} aria-hidden="true" />
    </Anchor>
  );
};

/** Secondary-styled <button> for actions (not navigation). */
export const SecondaryActionButton = ({
  children,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>) => (
  <button type="button" className="h-btn h-btn--secondary" {...props}>
    <span className="h-btn-in">
      <span className="h-btn-label">{children}</span>
      <Conveyor />
    </span>
  </button>
);

/** 48x48 square icon button with the same ink wipe. */
export const IconButton = ({
  children,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>) => (
  <button type="button" className="h-btn h-btn--secondary h-btn--icon" {...props}>
    <span className="h-btn-in">{children}</span>
  </button>
);
