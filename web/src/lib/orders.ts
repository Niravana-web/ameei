import "server-only";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

/** Lifecycle of an Order.status. pending = checkout opened, never completed. */
export const ORDER_STATUSES = ["pending", "paid", "roasting", "shipped", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Statuses that count as money in the door. */
export const PAID_STATUSES: OrderStatus[] = ["paid", "roasting", "shipped"];

export interface OrderItem {
  slug: string;
  name: string;
  weight: string;
  qty: number;
  unitPrice: number;
  mixCode?: string;
  mixSummary?: string;
}

export interface StripeAddress {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export function parseItems(raw: string): OrderItem[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as OrderItem[]) : [];
  } catch {
    return [];
  }
}

export function parseAddress(raw: string | null): StripeAddress | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StripeAddress;
  } catch {
    return null;
  }
}

/** One line per postal line, ready for a label. */
export function formatAddress(a: StripeAddress | null): string[] {
  if (!a) return [];
  const cityLine = [a.city, a.state, a.postal_code].filter(Boolean).join(", ");
  return [a.line1, a.line2, cityLine, a.country].filter((x): x is string => !!x);
}

/**
 * Everything we copy off a completed Checkout Session. Shared by the webhook,
 * the success-page reconciliation and the admin "Sync from Stripe" action so the
 * three paths can never disagree about what an order knows.
 */
export function sessionToOrderPatch(session: Stripe.Checkout.Session) {
  const cd = session.customer_details;
  // Newer API versions put the collected address under collected_information;
  // fall back to the customer's billing address so the card is never blank.
  const collected = (
    session as Stripe.Checkout.Session & {
      collected_information?: {
        shipping_details?: { name?: string | null; address?: StripeAddress | null } | null;
      } | null;
    }
  ).collected_information;
  const ship = collected?.shipping_details ?? null;
  const address = ship?.address ?? cd?.address ?? null;
  const pi = session.payment_intent;

  return {
    email: cd?.email ?? undefined,
    customerName: cd?.name ?? undefined,
    phone: cd?.phone ?? undefined,
    shippingName: ship?.name ?? cd?.name ?? undefined,
    shippingAddress: address ? JSON.stringify(address) : undefined,
    paymentIntentId: typeof pi === "string" ? pi : (pi?.id ?? undefined),
    amountTotal: session.amount_total ?? undefined,
  };
}

/**
 * Apply a completed session to its order. Details are always refreshed; the
 * status only moves pending → paid, so a replayed webhook can never knock a
 * roasting or shipped order back to "paid".
 */
export async function applyCompletedSession(session: Stripe.Checkout.Session) {
  const patch = sessionToOrderPatch(session);
  const completed = session.status === "complete";
  await prisma.$transaction([
    prisma.order.updateMany({ where: { stripeSessionId: session.id }, data: patch }),
    ...(completed
      ? [
          prisma.order.updateMany({
            where: { stripeSessionId: session.id, status: "pending" },
            data: { status: "paid" },
          }),
        ]
      : []),
  ]);
}

/** Re-fetch a session from Stripe and apply it. Used by the admin sync button. */
export async function syncOrderFromStripe(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found.");
  const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
  await applyCompletedSession(session);
}

export function stripePaymentUrl(paymentIntentId: string | null): string | null {
  return paymentIntentId ? `https://dashboard.stripe.com/payments/${paymentIntentId}` : null;
}
