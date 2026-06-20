import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/site";
import { Container } from "@/components/ui/primitives";
import { ClearCart } from "@/components/cart/ClearCart";

export const metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let email: string | null = null;
  let total: number | null = null;
  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? null;
      total = session.amount_total != null ? session.amount_total / 100 : null;
    } catch {
      // Display-only — fulfillment is handled by the webhook, not this page.
    }
  }

  return (
    <Container className="flex min-h-screen flex-col items-center justify-center pb-16 pt-24 text-center">
      <ClearCart />
      <div className="max-w-lg rounded-2xl border border-ink/10 bg-white/70 p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-2xl text-success">
          ✓
        </div>
        <h1 className="font-display text-headline-lg text-crimson">Order confirmed</h1>
        <p className="mt-3 font-body text-body-md text-ink">
          Thank you — your snacks are on their way.
          {email && (
            <>
              {" "}
              A receipt is headed to <span className="font-semibold">{email}</span>.
            </>
          )}
        </p>
        {total != null && (
          <p className="mt-2 font-display text-editorial italic text-ink">
            Total paid: {formatPrice(total)}
          </p>
        )}
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-crimson px-6 py-2.5 font-body text-label-caps uppercase text-white"
        >
          Keep shopping
        </Link>
      </div>
    </Container>
  );
}
