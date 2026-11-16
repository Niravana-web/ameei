import "server-only";
import { prisma } from "@/lib/prisma";
import { PAID_STATUSES, parseItems } from "@/lib/orders";

/** A buyer or subscriber, one row per email, for the admin list and CSV export. */
export interface Person {
  email: string;
  name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  firstSeen: Date;
  lastOrder: Date | null;
  orders: number;
  pouches: number;
  spentCents: number;
  subscriber: boolean;
  source: string | null;
  /** Heat of the most recent pouch, from the mix summary. */
  lastHeat: string | null;
}

function heatFromSummary(summary: string | undefined): string | null {
  if (!summary) return null;
  const m = summary.match(/No Spice|Medium Spice|Extra Hot/);
  return m ? m[0] : null;
}

export async function getPeople(): Promise<Person[]> {
  const [orders, subs] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: PAID_STATUSES }, email: { not: null } },
      orderBy: { createdAt: "asc" },
      select: {
        email: true,
        customerName: true,
        shippingName: true,
        phone: true,
        shippingAddress: true,
        amountTotal: true,
        items: true,
        createdAt: true,
      },
    }),
    prisma.subscriber.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  const people = new Map<string, Person>();
  const key = (e: string) => e.trim().toLowerCase();

  for (const s of subs) {
    people.set(key(s.email), {
      email: key(s.email),
      name: null,
      phone: null,
      city: null,
      state: null,
      firstSeen: s.createdAt,
      lastOrder: null,
      orders: 0,
      pouches: 0,
      spentCents: 0,
      subscriber: true,
      source: s.source,
      lastHeat: s.heat,
    });
  }

  for (const o of orders) {
    const k = key(o.email!);
    const items = parseItems(o.items);
    const pouches = items.reduce((n, i) => n + i.qty, 0);
    let city: string | null = null;
    let state: string | null = null;
    if (o.shippingAddress) {
      try {
        const a = JSON.parse(o.shippingAddress) as { city?: string; state?: string };
        city = a.city ?? null;
        state = a.state ?? null;
      } catch {
        /* keep nulls */
      }
    }
    const p = people.get(k) ?? {
      email: k,
      name: null,
      phone: null,
      city: null,
      state: null,
      firstSeen: o.createdAt,
      lastOrder: null,
      orders: 0,
      pouches: 0,
      spentCents: 0,
      subscriber: false,
      source: "order",
      lastHeat: null,
    };
    p.name = o.shippingName ?? o.customerName ?? p.name;
    p.phone = o.phone ?? p.phone;
    p.city = city ?? p.city;
    p.state = state ?? p.state;
    p.firstSeen = p.firstSeen < o.createdAt ? p.firstSeen : o.createdAt;
    p.lastOrder = o.createdAt;
    p.orders += 1;
    p.pouches += pouches;
    p.spentCents += o.amountTotal;
    p.lastHeat = heatFromSummary(items.at(-1)?.mixSummary) ?? p.lastHeat;
    people.set(k, p);
  }

  return [...people.values()].sort(
    (a, b) => (b.lastOrder ?? b.firstSeen).getTime() - (a.lastOrder ?? a.firstSeen).getTime(),
  );
}

export function peopleToCsv(rows: Person[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = [
    "email", "name", "phone", "city", "state", "first_seen", "last_order",
    "orders", "pouches", "spent_usd", "subscriber", "source", "last_heat",
  ];
  const lines = rows.map((p) =>
    [
      p.email, p.name, p.phone, p.city, p.state,
      p.firstSeen.toISOString().slice(0, 10),
      p.lastOrder ? p.lastOrder.toISOString().slice(0, 10) : "",
      p.orders, p.pouches, (p.spentCents / 100).toFixed(2),
      p.subscriber ? "yes" : "no", p.source, p.lastHeat,
    ].map(esc).join(","),
  );
  return [head.join(","), ...lines].join("\n") + "\n";
}
