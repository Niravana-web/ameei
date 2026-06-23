import Link from "next/link";
import Image from "next/image";
import type { ReactNode, ButtonHTMLAttributes } from "react";

/* ── Container ────────────────────────────── */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[80rem] px-5 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

/* ── NoiseOverlay ─────────────────────────── */
export function NoiseOverlay({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`noise-overlay ${className}`} />;
}

/* ── Button ───────────────────────────────── */
type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-crimson-deep text-chalk hover:bg-crimson shadow-[0_4px_20px_rgba(139,13,30,0.4)] hover:shadow-saffron-glow",
  secondary:
    "bg-chalk text-crimson border-2 border-crimson hover:bg-crimson hover:text-chalk",
  ghost:
    "bg-transparent text-chalk border border-saffron hover:bg-saffron/10",
};

const buttonBase =
  "btn-spice inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-body text-label-caps uppercase cursor-pointer";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
}) {
  return (
    <button className={`${buttonBase} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  children,
}: {
  variant?: Variant;
  className?: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${buttonBase} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}

/* ── Badge ────────────────────────────────── */
export function Badge({
  children,
  tone = "saffron",
  className = "",
}: {
  children: ReactNode;
  tone?: "saffron" | "crimson" | "chalk";
  className?: string;
}) {
  const tones = {
    saffron: "bg-saffron text-ink",
    crimson: "bg-crimson text-chalk",
    chalk: "bg-chalk text-crimson border border-crimson/20",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-body text-[9px] font-bold uppercase tracking-[0.16em] shadow-md ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── PhotoSlot ────────────────────────────────
   Editorial image. With `src` it renders a real photo; without one it falls back
   to a captioned gradient placeholder. `label` doubles as alt text / caption. */
export function PhotoSlot({
  label,
  src,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  label: string;
  src?: string;
  className?: string;
  ratio?: string;
}) {
  if (src) {
    return (
      <div
        className={`relative ${ratio} w-full overflow-hidden rounded-[1.25rem] border border-crimson/10 shadow-spice ${className}`}
      >
        <Image
          src={src}
          alt={label.replace(/^Photo\s*[—-]\s*/, "")}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={`relative flex ${ratio} w-full items-end overflow-hidden rounded-[1.25rem] border border-crimson/10 bg-gradient-to-br from-ember-soft via-blush to-saffron-pale shadow-spice ${className}`}
    >
      <NoiseOverlay />
      <span className="relative z-10 m-4 rounded-full bg-white/70 px-3 py-1 font-body text-[10px] uppercase tracking-[0.16em] text-crimson backdrop-blur">
        {label}
      </span>
    </div>
  );
}

/* ── SectionHeading ───────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p
          className={`mb-2 font-display text-editorial italic ${dark ? "text-amber-glow" : "text-crimson"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-headline-lg tracking-tight ${dark ? "text-chalk" : "text-ink"}`}
      >
        {title}
      </h2>
    </div>
  );
}
