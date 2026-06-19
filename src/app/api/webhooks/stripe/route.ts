import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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
    const session = event.data.object as Stripe.Checkout.Session;
    // Idempotent: updateMany on the unique session id; replays just re-set the same row.
    await prisma.order.updateMany({
      where: { stripeSessionId: session.id },
      data: {
        status: "paid",
        email: session.customer_details?.email ?? null,
        amountTotal: session.amount_total ?? undefined,
      },
    });
    // ponytail: fulfillment hook goes here (email receipt / shipping). Order row + Stripe
    // Dashboard are the record for now.
  }

  return NextResponse.json({ received: true });
}
