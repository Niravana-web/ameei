import Link from "next/link";
import { getAdminStats } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/site";

export const dynamic = "force-dynamic";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <p className="font-body text-label-caps uppercase text-ash">{label}</p>
      <p className="mt-2 font-display text-3xl font-black tracking-tight text-ink">{value}</p>
      {sub && <p className="mt-1 font-body text-body-sm text-ash">{sub}</p>}
    </div>
  );
}

function Bars({ rows, total }: { rows: { label: string; count: number }[]; total: number }) {
  if (rows.length === 0) return <p className="font-body text-body-sm text-ash">No pouches yet.</p>;
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[8rem_1fr_2.5rem] items-center gap-3 font-body text-body-sm">
          <span className="truncate text-ink">{r.label}</span>
          <span className="h-2 overflow-hidden rounded-full bg-chalk">
            <span
              className="block h-full rounded-full bg-crimson"
              style={{ width: `${total ? Math.round((r.count / total) * 100) : 0}%` }}
            />
          </span>
          <span className="text-right text-ash">{r.count}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function AdminDashboard() {
  const s = await getAdminStats();
  const monthPouches = s.month.pouches || 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-headline-lg text-ink">Dashboard</h1>
        <Link
          href="/admin/queue"
          className="rounded-full bg-crimson px-5 py-2 font-body text-label-caps uppercase text-white"
        >
          Roasting queue · {s.toRoast + s.roasting} open
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Today"
          value={formatPrice(s.today.revenueCents / 100)}
          sub={`${s.today.orders} orders · ${s.today.pouches} pouches`}
        />
        <Stat
          label="Last 7 days"
          value={formatPrice(s.week.revenueCents / 100)}
          sub={`${s.week.orders} orders · ${s.week.pouches} pouches`}
        />
        <Stat
          label="Last 30 days"
          value={formatPrice(s.month.revenueCents / 100)}
          sub={`${s.month.orders} orders · ${s.month.pouches} pouches`}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <Stat label="To roast" value={String(s.toRoast)} sub="paid, not started" />
        <Stat label="Roasting" value={String(s.roasting)} sub="in the kitchen" />
        <Stat label="Shipped" value={String(s.shippedWeek)} sub="last 7 days" />
        <Stat
          label="People"
          value={String(s.subscribers + s.customers)}
          sub={`${s.customers} buyers · ${s.subscribers} subscribers`}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h2 className="mb-4 font-display text-headline-md text-ink">
            Most picked <span className="font-body text-body-sm font-normal text-ash">30 days, by pouch</span>
          </h2>
          <Bars rows={s.ingredients} total={monthPouches} />
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h2 className="mb-4 font-display text-headline-md text-ink">
            Heat split <span className="font-body text-body-sm font-normal text-ash">30 days</span>
          </h2>
          <Bars rows={s.heat} total={monthPouches} />
          <p className="mt-5 font-body text-body-sm text-ash">
            Buyers and subscribers, with CSV export, are under{" "}
            <Link href="/admin/customers" className="text-crimson hover:underline">
              Customers
            </Link>
            . The pouch&apos;s listing name and photo on Stripe come from{" "}
            <Link href="/admin/products" className="text-crimson hover:underline">
              the product row
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
