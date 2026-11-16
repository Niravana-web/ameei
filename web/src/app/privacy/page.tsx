import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ameei snacks collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="bg-chalk py-16 md:py-24">
      <Container className="max-w-2xl">
        <h1 className="mb-3 font-display text-display-md text-crimson-deep">Privacy Policy</h1>
        <p className="mb-10 font-body text-body-sm text-ash">Last updated: June 30, 2025</p>

        <div className="space-y-8 font-body text-body-md text-ink leading-relaxed">
          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">1. Information we collect</h2>
            <p>
              When you place an order we collect your name, email address, shipping address, and payment details (processed securely by Stripe — we never store full card numbers). If you create an account we also store your login credentials via Clerk. We collect browsing data (pages visited, device type, referrer) through standard server logs.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">2. How we use it</h2>
            <p>
              We use your information to fulfil and ship orders, send order confirmations and shipping updates, respond to customer service enquiries, and — only if you opted in — send our newsletter. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">3. Third-party services</h2>
            <p>
              We share data only with the services necessary to operate: <strong>Stripe</strong> (payment processing), <strong>Clerk</strong> (authentication), and our shipping carrier. Each operates under its own privacy policy and applicable data-protection law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">4. Cookies</h2>
            <p>
              We use strictly necessary cookies for authentication sessions and your shopping cart. We do not use advertising or cross-site tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">5. Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any time by emailing us at <a href="mailto:hello@ameei.com" className="text-crimson underline hover:text-terracotta">hello@ameei.com</a>. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">6. Data retention</h2>
            <p>
              Order records are retained for seven years to comply with tax and accounting obligations. Account data is deleted within 30 days of an account-deletion request.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">7. Changes to this policy</h2>
            <p>
              We may update this policy as our practices evolve. Material changes will be communicated by email to registered customers and by updating the date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">8. Contact</h2>
            <p>
              Questions? Email us at <a href="mailto:hello@ameei.com" className="text-crimson underline hover:text-terracotta">hello@ameei.com</a>.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
