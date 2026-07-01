import type { SVGProps } from "react";

/** Inline SVG icons — replaces the Material Symbols icon-font request. */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ShoppingBagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 7h12l1 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 7Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-5 8-5s8 1.7 8 5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h16m0 0-6-6m6 6-6 6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function FlameIcon({ size = 20, filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      aria-hidden
      {...props}
    >
      <path d="M12 2c.6 3-1 4.5-2.4 6C8.2 9.6 7 11.2 7 13.5A5.3 5.3 0 0 0 12 19a5.3 5.3 0 0 0 5-5.5c0-1.6-.6-2.9-1.4-4.1-.3 1-.8 1.8-1.7 2.3.3-2.9-.6-6.7-1.9-9.7Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChiliIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.5 4.5c.3-1 1.2-1.8 2.3-2 .4-.1.8.2.7.6-.1.7-.5 1.4-1 1.9 2.1 1 3.5 3.2 3.5 5.7 0 5.5-6.4 10.3-13.1 10.3-3.2 0-5.9-1.5-5.9-3 0-.4.4-.7.8-.5 1.1.5 2.4.7 3.6.5 4.6-.7 7.6-4.6 8-9.2.1-1.6-.2-3.1-1-4.2.7-.2 1.4-.2 2.1-.1Z" />
    </svg>
  );
}
