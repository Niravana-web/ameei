import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { NewsletterForm } from "@/components/NewsletterForm";
import { InstagramIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site";

const siteLinks = [
  { label: "Studio", href: "/studio" },
  { label: "How it works", href: "/#how" },
  { label: "Journal", href: "/journal" },
  { label: "Your orders", href: "/account/orders" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-crimson-deep/10 bg-white">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 md:pr-16">
            <h2 className="mb-3 font-display text-headline-lg text-crimson-deep">
              Get a little spice in your inbox.
            </h2>
            <p className="mb-6 font-body text-body-md text-ash">
              One note a month: what we are roasting, what people are building, and the odd
              recipe.
            </p>
            <NewsletterForm />
          </div>

          <nav aria-label="Footer — site" className="mt-10 flex flex-col gap-2.5 md:mt-0">
            <span className="mb-2 font-body text-label-caps uppercase text-crimson">ameei</span>
            {siteLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-body-md text-ash transition-colors hover:text-crimson"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Footer — say hi and legal" className="mt-10 flex flex-col gap-2.5 md:mt-0">
            <span className="mb-2 font-body text-label-caps uppercase text-crimson">Say hi</span>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-body-md text-ash transition-colors hover:text-crimson"
            >
              <InstagramIcon size={16} />
              @ameei_snacks
            </a>
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-body-md text-ash transition-colors hover:text-crimson"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-crimson-deep/10 pt-6 md:flex-row">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-ash">
            © {new Date().getFullYear()} ameei · crunch with a little bit of spice.
          </p>
          <p className="font-accent text-xl text-crimson-deep">roasted, never fried</p>
        </div>
      </Container>
    </footer>
  );
}
