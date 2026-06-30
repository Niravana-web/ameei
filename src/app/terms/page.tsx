import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of ameei snacks and purchases made on our site.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="bg-chalk py-16 md:py-24">
      <Container className="max-w-2xl">
        <h1 className="mb-3 font-display text-display-md text-crimson-deep">Terms of Service</h1>
        <p className="mb-10 font-body text-body-sm text-ash">Last updated: June 30, 2025</p>

        <div className="space-y-8 font-body text-body-md text-ink leading-relaxed">
          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">1. Acceptance</h2>
            <p>
              By accessing ameei.com or placing an order you agree to these terms. If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">2. Products and pricing</h2>
            <p>
              All prices are listed in USD and are subject to change without notice. We reserve the right to limit quantities, discontinue products, or correct pricing errors at any time. Product images are for illustrative purposes; slight variations in colour and texture are natural.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">3. Orders and payment</h2>
            <p>
              An order confirmation email does not constitute acceptance of your order — it confirms receipt. We reserve the right to cancel any order and issue a full refund. Payment is processed securely by Stripe. We accept major credit and debit cards.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">4. Shipping</h2>
            <p>
              We ship within 24 hours of payment confirmation on business days. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon handoff to the carrier.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">5. Returns and refunds</h2>
            <p>
              Due to the perishable nature of our products we do not accept returns. If your order arrives damaged or incorrect, contact us at <a href="mailto:hello@ameei.com" className="text-crimson underline hover:text-terracotta">hello@ameei.com</a> within 48 hours of delivery with a photo and we will make it right.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">6. Allergen notice</h2>
            <p>
              Our products are manufactured in a facility that processes peanuts, tree nuts, wheat (gluten), and dairy. Full ingredient and allergen information is listed on each product page. It is your responsibility to review this information before purchasing.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">7. Intellectual property</h2>
            <p>
              All content on this site — including text, images, recipes, and branding — is the property of ameei snacks and may not be reproduced without written permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">8. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, ameei snacks is not liable for indirect, incidental, or consequential damages arising from use of the site or our products. Our total liability for any claim is limited to the amount you paid for the relevant order.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">9. Governing law</h2>
            <p>
              These terms are governed by the laws of the state of Delaware, USA, without regard to conflict-of-law principles.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-headline-md text-crimson-deep">10. Contact</h2>
            <p>
              Questions about these terms? Email <a href="mailto:hello@ameei.com" className="text-crimson underline hover:text-terracotta">hello@ameei.com</a>.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
