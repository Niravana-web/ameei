import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PAID_STATUSES, parseItems, type OrderStatus } from "@/lib/orders";
import { OrderCard } from "@/components/admin/OrderCard";
import { Card, PageHeader } from "@/components/admin/ui";

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
    .reduce((n, o) => n + parseItems(o.items).reduce((m, i) => m + i.qty, 0), 0);

  return (
    <>
      <PageHeader
        title="Roasting queue"
        sub={`${view === "shipped" ? "Newest first" : "Oldest first"} · ${orders.length} orders · ${pouches} pouches in this view`}
      />

      <nav aria-label="Queue filter" className="flex flex-wrap gap-2">
        {VIEWS.map((v) => {
          const on = v.id === view;
          return (
            <Link
              key={v.id}
              href={v.id === "open" ? "/admin/queue" : `/admin/queue?view=${v.id}`}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors ${
                on ? "border-ink bg-ink text-chalk" : "border-ink/15 bg-white text-ink hover:border-crimson/50"
              }`}
            >
              {v.label}
              <span className={`text-[11px] ${on ? "text-chalk/70" : "text-[#8E7F81]"}`}>{badge[v.id]}</span>
            </Link>
          );
        })}
      </nav>

      <Card className="overflow-hidden">
        <div className="hidden gap-4 bg-[#FBF8F4] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8E7F81] xl:grid xl:grid-cols-[1.5fr_1fr_1fr]">
          <span>Order · recipe</span>
          <span>Ship to</span>
          <span>Actions</span>
        </div>
        {orders.length === 0 ? (
          <p className="px-4 py-10 text-center text-ash">
            Nothing here.{view === "open" ? " Paid orders land in this queue as soon as Stripe confirms them." : ""}
          </p>
        ) : (
          orders.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </Card>
    </>
  );
}
