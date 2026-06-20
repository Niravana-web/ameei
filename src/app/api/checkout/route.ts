import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { rowToProduct } from "@/lib/catalog";
import { priceCart, type CheckoutItem } from "@/lib/checkout";
import { siteConfig } from "@/lib/site";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to checkout." }, { status: 401 });
  }

  let items: CheckoutItem[];
  try {
    const body = await req.json();
    items = Array.isArray(body?.items) ? body.items : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Load only the requested products, published, from the DB — the source of truth for price.
  const slugs = [...new Set(items.map((i) => i.slug))];
  const rows = await prisma.product.findMany({
    where: { slug: { in: slugs }, published: true },
  });
  const catalog = new Map(rows.map((r) => [r.slug, rowToProduct(r)]));

  let lines;
  try {
    lines = priceCart(catalog, items);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not price your cart." },
      { status: 400 },
    );
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const amountTotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: "usd",
          unit_amount: l.unitPrice,
          product_data: {
            name: `${l.name} — ${l.weight}`,
            images: [`${base}${l.image}`],
          },
        },
      })),
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "IN", "AU"],
      },
      success_url: `${base}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cart`,
    });

    // Record a pending order keyed by the session id; the webhook flips it to "paid".
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        userId,
        amountTotal,
        currency: "usd",
        status: "pending",
        items: JSON.stringify(lines),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    // Most likely a missing/invalid STRIPE_SECRET_KEY in dev.
    console.error("Stripe checkout failed:", e);
    return NextResponse.json(
      { error: "Payment provider error. Check STRIPE_SECRET_KEY." },
      { status: 502 },
    );
  }
}
