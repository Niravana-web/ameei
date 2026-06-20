import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { NewsletterForm } from "@/components/NewsletterForm";
import { siteConfig } from "@/lib/site";

const shopLinks = [
  { label: "All Snacks", href: "/shop" },
  { label: "Crunch Mixes", href: "/shop" },
  { label: "Gift Sets", href: "/shop" },
  { label: "Wholesale", href: "/shop" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Sustainability", href: "#" },
  { label: "Contact", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="w-full rounded-t-[2rem] border-t border-crimson-deep/10 bg-chalk">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Newsletter */}
          <div className="md:col-span-2 md:pr-16">
            <h2 className="mb-3 font-display text-headline-lg text-crimson-deep">
              Get a little spice in your inbox.
            </h2>
            <p className="mb-6 font-body text-body-md text-ash">
              Join the inner circle for early access to small-batch drops and
              ancestral recipes.
            </p>
            <NewsletterForm />
          </div>

          {/* Shop links */}
          <nav aria-label="Footer — shop" className="mt-10 flex flex-col gap-2.5 md:mt-0">
            <span className="mb-2 font-body text-label-caps uppercase text-crimson">
              Shop
            </span>
            {shopLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-body-md text-ash transition-colors hover:text-terracotta"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal links */}
          <nav aria-label="Footer — legal" className="mt-10 flex flex-col gap-2.5 md:mt-0">
            <span className="mb-2 font-body text-label-caps uppercase text-crimson">
              Legal
            </span>
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-body-md text-ash transition-colors hover:text-terracotta"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom strip */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-crimson-deep/10 pt-6 font-body text-[10px] uppercase tracking-[0.2em] text-ash md:flex-row">
          <p>
            © {new Date().getFullYear()} ameei snacks. crunch with a little
            spice.
          </p>
          <div className="flex gap-6">
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-crimson"
            >
              Instagram
            </a>
            <a
              href={siteConfig.links.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-crimson"
            >
              TikTok
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
