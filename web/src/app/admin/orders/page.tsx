import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/site";

export const dynamic = "force-dynamic";

interface OrderItem {
  slug: string;
  name: string;
  weight: string;
  qty: number;
  unitPrice: number;
  mixCode?: string;
  mixSummary?: string;
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-headline-lg text-ink">
        Orders <span className="text-ash">({orders.length})</span>
      </h1>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-ink/10 px-4 py-8 text-center text-ash">
          No orders yet. Paid Stripe checkouts will appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const items = JSON.parse(o.items) as OrderItem[];
            return (
              <div key={o.id} className="rounded-xl border border-ink/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-ink">{o.email ?? "—"}</span>
                    <span className="ml-2 text-body-sm text-ash">
                      {o.createdAt.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-body-sm ${
                        o.status === "paid"
                          ? "bg-success/15 text-success"
                          : "bg-saffron/20 text-saffron"
                      }`}
                    >
                      {o.status}
                    </span>
                    <span className="font-semibold text-ink">
                      {formatPrice(o.amountTotal / 100)}
                    </span>
                  </div>
                </div>
                <ul className="mt-2 text-body-sm text-ink/70">
                  {items.map((it, i) => (
                    <li key={i}>
                      {it.qty} × {it.name} ({it.weight}) — {formatPrice(it.unitPrice)}
                      {it.mixSummary && (
                        <span className="block text-ink/50">
                          {it.mixSummary} · mix {it.mixCode}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
