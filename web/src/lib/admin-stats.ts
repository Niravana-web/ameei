import "server-only";
import { prisma } from "@/lib/prisma";
import { PAID_STATUSES, parseAddress, parseItems } from "@/lib/orders";
import { STUDIO_GROUPS, normalizeSelection, optionLabel } from "@/lib/studio";

export interface Window {
  orders: number;
  pouches: number;
  revenueCents: number;
}

export interface RecentOrder {
  id: string;
  createdAt: Date;
  status: string;
  pouches: number;
  /** Ingredients only, e.g. "Peanuts, Cashews · Cornflakes · Raisins". */
  recipe: string;
  heat: string | null;
  place: string | null;
}

export interface AdminStats {
  today: Window;
  week: Window;
  month: Window;
  toRoast: number;
  roasting: number;
  shippedWeek: number;
  subscribers: number;
  customers: number;
  /** Ingredient → pouches containing it, last 30 days, most-picked first. */
  ingredients: { label: string; count: number }[];
  heat: { label: string; count: number }[];
  attention: { noAddress: number; abandonedWeek: number; roastingLong: number };
  recent: RecentOrder[];
}

function emptyWindow(): Window {
  return { orders: 0, pouches: 0, revenueCents: 0 };
}

/** "Peanuts, Cashews · Cornflakes · Raisins · Medium Spice · Less Salt" → parts. */
export function splitSummary(summary: string | undefined): { recipe: string; heat: string | null } {
  if (!summary) return { recipe: "", heat: null };
  const parts = summary.split(" · ");
  const heat = parts.find((p) => /Spice|Extra Hot/.test(p)) ?? null;
  const recipe = parts.filter((p) => !/Spice|Extra Hot|Salt/.test(p)).join(" · ");
  return { recipe, heat };
}

export async function getAdminStats(now = new Date()): Promise<AdminStats> {
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now.getTime() - 7 * 86400_000);
  const monthStart = new Date(now.getTime() - 30 * 86400_000);
  const dayAgo = new Date(now.getTime() - 86400_000);

  const [orders, subscribers, customers, toRoast, roasting, shippedWeek, noAddress, abandonedWeek, roastingLong, openRows] =
    await Promise.all([
      prisma.order.findMany({
        where: { status: { in: PAID_STATUSES }, createdAt: { gte: monthStart } },
        select: { createdAt: true, amountTotal: true, items: true },
      }),
      prisma.subscriber.count(),
      prisma.order.findMany({
        where: { status: { in: PAID_STATUSES }, email: { not: null } },
        distinct: ["email"],
        select: { email: true },
      }),
      prisma.order.count({ where: { status: "paid" } }),
      prisma.order.count({ where: { status: "roasting" } }),
      prisma.order.count({ where: { status: "shipped", shippedAt: { gte: weekStart } } }),
      prisma.order.count({ where: { status: { in: ["paid", "roasting"] }, shippingAddress: null } }),
      prisma.order.count({ where: { status: "pending", createdAt: { gte: weekStart } } }),
      prisma.order.count({ where: { status: "roasting", roastedAt: { lt: dayAgo } } }),
      prisma.order.findMany({
        where: { status: { in: ["paid", "roasting"] } },
        orderBy: { createdAt: "asc" },
        take: 6,
        select: { id: true, createdAt: true, status: true, items: true, shippingAddress: true },
      }),
    ]);

  const today = emptyWindow();
  const week = emptyWindow();
  const month = emptyWindow();
  const mixQty = new Map<string, number>();

  for (const o of orders) {
    const items = parseItems(o.items);
    const pouches = items.reduce((n, i) => n + i.qty, 0);
    for (const it of items) {
      if (it.mixCode) mixQty.set(it.mixCode, (mixQty.get(it.mixCode) ?? 0) + it.qty);
    }
    for (const [w, start] of [
      [today, dayStart],
      [week, weekStart],
      [month, monthStart],
    ] as const) {
      if (o.createdAt >= start) {
        w.orders += 1;
        w.pouches += pouches;
        w.revenueCents += o.amountTotal;
      }
    }
  }

  // Tally the pantry across the month's pouches, weighted by quantity.
  const codes = [...mixQty.keys()];
  const mixes = codes.length
    ? await prisma.customMix.findMany({
        where: { code: { in: codes } },
        select: { code: true, selection: true },
      })
    : [];
  const ingredientCount = new Map<string, number>();
  const heatCount = new Map<string, number>();
  for (const m of mixes) {
    const qty = mixQty.get(m.code) ?? 0;
    let sel: ReturnType<typeof normalizeSelection>;
    try {
      sel = normalizeSelection(JSON.parse(m.selection));
    } catch {
      continue;
    }
    for (const g of STUDIO_GROUPS) {
      if (!g.countsTowardMix) continue;
      for (const id of sel[g.id as "nuts" | "cereals" | "extras"]) {
        const label = optionLabel(g.id, id);
        ingredientCount.set(label, (ingredientCount.get(label) ?? 0) + qty);
      }
    }
    const heat = optionLabel("spice", sel.spice);
    heatCount.set(heat, (heatCount.get(heat) ?? 0) + qty);
  }
  const sortDesc = (m: Map<string, number>) =>
    [...m.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);

  const recent: RecentOrder[] = openRows.map((o) => {
    const items = parseItems(o.items);
    const first = items[0];
    const { recipe, heat } = splitSummary(first?.mixSummary);
    const a = parseAddress(o.shippingAddress);
    return {
      id: o.id,
      createdAt: o.createdAt,
      status: o.status,
      pouches: items.reduce((n, i) => n + i.qty, 0),
      recipe: items.length > 1 ? `${recipe} +${items.length - 1} more` : recipe,
      heat,
      place: a ? [a.city, a.state].filter(Boolean).join(", ") || null : null,
    };
  });

  return {
    today,
    week,
    month,
    toRoast,
    roasting,
    shippedWeek,
    subscribers,
    customers: customers.length,
    ingredients: sortDesc(ingredientCount),
    heat: sortDesc(heatCount),
    attention: { noAddress, abandonedWeek, roastingLong },
    recent,
  };
}
