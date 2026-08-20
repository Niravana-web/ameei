import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/site";
import { Container } from "@/components/ui/primitives";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your orders", robots: { index: false } };

interface OrderItem {
  slug: string;
  name: string;
  weight: string;
  qty: number;
  unitPrice: number;
  mixCode?: string;
  mixSummary?: string;
}

export default async function AccountOrdersPage() {
  const { userId } = await auth();
  // proxy.ts gates /admin only; this page is reachable signed-out, so guard here.
  if (!userId) {
    return (
      <Container className="min-h-screen pb-16 pt-24 md:pt-28">
        <h1 className="mb-4 font-display text-headline-lg text-crimson">Your orders</h1>
        <p className="font-body text-body-md text-ash">
          Please sign in to view your orders.
        </p>
      </Container>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <Container className="min-h-screen pb-16 pt-24 md:pt-28">
      <h1 className="mb-8 font-display text-headline-lg text-crimson">Your orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-white/70 p-10 text-center">
          <p className="font-body text-body-lg text-ash">No orders yet.</p>
          <Link
            href="/shop"
            className="mt-5 inline-block rounded-full bg-crimson px-6 py-2.5 font-body text-label-caps uppercase text-white"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const items = JSON.parse(o.items) as OrderItem[];
            return (
              <div key={o.id} className="rounded-xl border border-ink/10 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-body text-body-sm text-ash">
                    {o.createdAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 font-body text-body-sm ${
                        o.status === "paid"
                          ? "bg-success/15 text-success"
                          : "bg-saffron/20 text-saffron"
                      }`}
                    >
                      {o.status}
                    </span>
                    <span className="font-bold text-crimson">
                      {formatPrice(o.amountTotal / 100)}
                    </span>
                  </div>
                </div>
                <ul className="mt-2 font-body text-body-sm text-ink/70">
                  {items.map((it, i) => (
                    <li key={i}>
                      {it.qty} × {it.name} ({it.weight})
                      {it.mixSummary && (
                        <span className="block text-ash">{it.mixSummary}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
