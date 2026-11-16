import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PAID_STATUSES, type OrderStatus } from "@/lib/orders";
import { OrderCard } from "@/components/admin/OrderCard";

export const dynamic = "force-dynamic";

type View = "open" | "paid" | "roasting" | "shipped" | "pending" | "cancelled" | "all";

const VIEWS: { id: View; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "paid", label: "To roast" },
  { id: "roasting", label: "Roasting" },
  { id: "shipped", label: "Shipped" },
  { id: "pending", label: "Abandoned" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];

function whereFor(view: View) {
  if (view === "open") return { status: { in: ["paid", "roasting"] } };
  if (view === "all") return {};
  return { status: view };
}

export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: raw } = await searchParams;
  const view: View = VIEWS.some((v) => v.id === raw) ? (raw as View) : "open";

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where: whereFor(view),
      orderBy: view === "shipped" ? { shippedAt: "desc" } : { createdAt: "asc" },
      take: 200,
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const count = (s: OrderStatus) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const badge: Record<View, number> = {
    open: count("paid") + count("roasting"),
    paid: count("paid"),
    roasting: count("roasting"),
    shipped: count("shipped"),
    pending: count("pending"),
    cancelled: count("cancelled"),
    all: counts.reduce((n, c) => n + c._count._all, 0),
  };
  const pouches = orders
    .filter((o) => PAID_STATUSES.includes(o.status as OrderStatus))
    .reduce((n, o) => {
      try {
        return n + (JSON.parse(o.items) as { qty: number }[]).reduce((m, i) => m + i.qty, 0);
      } catch {
        return n;
      }
    }, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-headline-lg text-ink">Roasting queue</h1>
          <p className="mt-1 font-body text-body-sm text-ash">
            Oldest first. {orders.length} orders · {pouches} pouches in this view.
          </p>
        </div>
        <nav aria-label="Queue filter" className="flex flex-wrap gap-2">
          {VIEWS.map((v) => (
            <Link
              key={v.id}
              href={v.id === "open" ? "/admin/queue" : `/admin/queue?view=${v.id}`}
              className={`rounded-full border px-3 py-1.5 font-body text-body-sm transition-colors ${
                v.id === view
                  ? "border-ink bg-ink text-chalk"
                  : "border-ink/15 bg-white text-ink hover:border-crimson/50"
              }`}
            >
              {v.label}
              <span className={`ml-1.5 ${v.id === view ? "text-chalk/70" : "text-ash"}`}>
                {badge[v.id]}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-ink/10 bg-white px-4 py-10 text-center font-body text-body-md text-ash">
          Nothing here. {view === "open" ? "Paid orders land in this queue as soon as Stripe confirms them." : ""}
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
