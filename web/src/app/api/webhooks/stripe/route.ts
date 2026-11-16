import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { applyCompletedSession } from "@/lib/orders";

export const runtime = "nodejs"; // raw body needed for signature verification

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature/secret." }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    // Bad signature — reject. Do not trust the payload.
    return NextResponse.json(
      { error: `Webhook signature failed: ${e instanceof Error ? e.message : ""}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    // Idempotent: replays re-apply the same details and never regress status
    // past "paid" (see applyCompletedSession).
    await applyCompletedSession(event.data.object as Stripe.Checkout.Session);
    // ponytail: fulfillment hook goes here (email receipt / shipping). The
    // roasting queue at /admin/queue is the record for now.
  }

  return NextResponse.json({ received: true });
}
