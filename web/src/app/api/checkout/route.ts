import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { rowToProduct } from "@/lib/catalog";
import { getMixRowsByCodes, toResolvedMix } from "@/lib/mixes";
import { priceCart, type CheckoutItem, type ResolvedMix } from "@/lib/checkout";
import { siteConfig } from "@/lib/site";

// Cart lines are untrusted input straight from localStorage. Shape them before
// they reach Prisma — nothing here is injectable, but an unbounded array is a
// free way to make us do thousands of lookups per request.
const bodySchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/).max(80),
        weight: z.string().max(16),
        qty: z.number().int(),
        mixCode: z.string().regex(/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{6,16}$/).optional(),
      }),
    )
    .max(50),
});

/** S3 uploads are already absolute; seeded images are site-relative. */
function absoluteImage(base: string, src: string): string {
  return /^https?:\/\//.test(src) ? src : `${base}${src}`;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to checkout." }, { status: 401 });
  }

  let items: CheckoutItem[];
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    items = parsed.data.items;
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

  // Studio builds: load each referenced mix and RE-PRICE it against the currently
  // deployed table. A mix that no longer validates is left out of the map so
  // priceCart produces the customer-facing "rebuild it" error.
  const codes = [...new Set(items.map((i) => i.mixCode).filter((c): c is string => !!c))];
  const mixes = new Map<string, ResolvedMix>();
  for (const row of await getMixRowsByCodes(codes)) {
    try {
      mixes.set(row.code, toResolvedMix(row));
    } catch (e) {
      console.warn(`Skipping unusable custom mix ${row.code}:`, e);
    }
  }

  let lines;
  try {
    lines = priceCart(catalog, mixes, items);
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
            // Keep the name short — Stripe truncates, and folding the whole
            // ingredient list in here makes the checkout page look broken. The
            // selections go in `description`, which Stripe renders beneath it.
            name: `${l.name} — ${l.weight}`,
            ...(l.mixSummary ? { description: l.mixSummary.slice(0, 500) } : {}),
            images: [absoluteImage(base, l.image)],
            // Lets support recover a build from the Stripe dashboard alone.
            ...(l.mixCode ? { metadata: { mixCode: l.mixCode } } : {}),
          },
        },
      })),
      ...(codes.length
        ? { metadata: { mixCodes: codes.join(",").slice(0, 500) } }
        : {}),
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
