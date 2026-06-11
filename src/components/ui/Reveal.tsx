"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  /** Entrance direction. Defaults to "up". */
  direction?: Direction;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}

/**
 * Scroll-reveal wrapper. Adds `is-visible` when the element enters the
 * viewport; CSS in globals.css handles the spring transition and honors
 * prefers-reduced-motion.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — ref type narrows per tag; runtime is correct
      ref={ref}
      data-reveal={direction === "up" ? undefined : direction}
      className={`reveal ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
