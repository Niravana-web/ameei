"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { navLinks } from "@/lib/site";
import { useCart } from "@/lib/cart";
import {
  ShoppingBagIcon,
  PersonIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/ui/icons";

/**
 * Unified floating pill navbar used on every page.
 * Shrinks slightly + gains shadow on scroll; collapsible menu on mobile.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed left-1/2 z-50 w-[95%] max-w-[72rem] -translate-x-1/2 rounded-full border border-ink/5 bg-white/80 backdrop-blur-2xl transition-all duration-300 ${
        scrolled ? "top-2 scale-[0.985] shadow-spice-lg" : "top-3 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-2 md:px-6 md:py-2.5">
        {/* Left: nav links (desktop) */}
        <nav aria-label="Primary" className="hidden flex-1 items-center gap-6 md:flex">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-label-caps uppercase transition-all duration-200 ${
                isActive(link.href)
                  ? "-translate-y-0.5 border-b-2 border-crimson pb-1 text-crimson"
                  : "text-ink/60 hover:-translate-y-0.5 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center: wordmark */}
        <Link
          href="/"
          aria-label="ameei — home"
          className="font-display text-[1.375rem] font-black italic tracking-tighter text-crimson transition-transform duration-300 hover:scale-105 md:text-[1.625rem]"
        >
          ameei
        </Link>

        {/* Right: links + actions */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <nav aria-label="Secondary" className="hidden items-center gap-6 md:flex">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-label-caps uppercase transition-all duration-200 ${
                  isActive(link.href)
                    ? "-translate-y-0.5 border-b-2 border-crimson pb-1 text-crimson"
                    : "text-ink/60 hover:-translate-y-0.5 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/cart"
            aria-label={`Shopping bag, ${count} item${count === 1 ? "" : "s"}`}
            className="relative rounded-full border border-transparent p-1.5 text-crimson transition-all duration-200 hover:scale-110 hover:border-crimson/30 hover:bg-chalk"
          >
            <ShoppingBagIcon size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[0.625rem] font-bold leading-none text-white">
                {count}
              </span>
            )}
          </Link>
          {isSignedIn ? (
            <span className="hidden items-center sm:flex">
              <UserButton />
            </span>
          ) : (
            <SignInButton mode="modal">
              <button
                aria-label="Sign in"
                className="hidden rounded-full border border-transparent p-1.5 text-crimson transition-all duration-200 hover:scale-110 hover:border-crimson/30 hover:bg-chalk sm:block"
              >
                <PersonIcon size={18} />
              </button>
            </SignInButton>
          )}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 text-crimson md:hidden"
          >
            {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out md:hidden ${
          menuOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="min-h-0 overflow-hidden">
          <ul className="flex flex-col gap-1 px-8">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                className={menuOpen ? "animate-fade-up" : ""}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Link
                  href={link.href}
                  className={`block py-2.5 font-body text-label-caps uppercase ${
                    isActive(link.href) ? "text-crimson" : "text-ink/70"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
