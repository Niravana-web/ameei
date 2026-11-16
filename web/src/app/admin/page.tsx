import Link from "next/link";
import { getAdminStats } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/site";
import {
  Card,
  Label,
  PageHeader,
  Pill,
  Stat,
  Td,
  Th,
  btnPrimary,
  heatTone,
  statusLabel,
  statusTone,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const HEAT_COLORS: Record<string, string> = {
  "No Spice": "#D9CFC8",
  "Medium Spice": "#F4A828",
  "Extra Hot": "#C0162C",
};

function when(d: Date) {
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const yesterday = new Date(today.getTime() - 86400_000).toDateString() === d.toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today ${time}`;
  if (yesterday) return `Yesterday ${time}`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminDashboard() {
  const s = await getAdminStats();
  const monthPouches = Math.max(1, s.month.pouches);
  const avg = s.month.orders ? (s.month.pouches / s.month.orders).toFixed(1) : "–";
  const heatTotal = s.heat.reduce((n, h) => n + h.count, 0) || 1;
  const open = s.toRoast + s.roasting;

  return (
    <>
      <PageHeader
        title="Dashboard"
        sub={new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" }) + " · what the kitchen needs to know"}
        actions={
          <Link href="/admin/queue" className={btnPrimary}>
            Open queue{open ? ` · ${open}` : ""}
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key numbers">
        <Stat
          label="Revenue · 30 days"
          value={formatPrice(s.month.revenueCents / 100)}
          sub={`${s.month.orders} orders · ${s.month.pouches} pouches`}
        />
        <Stat
          label="Today"
          value={formatPrice(s.today.revenueCents / 100)}
          sub={`${s.today.orders} orders · ${s.today.pouches} pouches`}
        />
        <Stat label="Avg. pouches / order" value={avg} sub="paid orders, 30 days" />
        <Stat
          label="People"
          value={String(s.subscribers + s.customers)}
          sub={`${s.customers} buyers · ${s.subscribers} subscribers`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-ink/[0.08] px-4 py-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-sm font-semibold">Roasting queue</h2>
              <span className="text-xs text-ash">oldest first</span>
            </div>
            <Link href="/admin/queue" className="text-xs font-semibold text-crimson-deep hover:text-crimson">
              All orders →
            </Link>
          </div>
          <div className="grid grid-cols-3 border-b border-ink/[0.08]">
            {[
              ["To roast", s.toRoast],
              ["Roasting", s.roasting],
              ["Shipped · 7 days", s.shippedWeek],
            ].map(([l, v], i) => (
              <div key={l} className={`px-4 py-3 ${i < 2 ? "border-r border-ink/[0.08]" : ""}`}>
                <Label>{l}</Label>
                <div className="mt-1 text-[22px] font-bold leading-none tracking-[-0.02em]">{v}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Recipe</Th>
                  <Th>Heat</Th>
                  <Th>Ship to</Th>
                  <Th right>Qty</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {s.recent.map((o) => (
                  <tr key={o.id} className="last:[&>td]:border-b-0">
                    <Td>
                      <Link href={`/admin/queue#${o.id}`} className="font-semibold text-ink hover:text-crimson">
                        #{o.id.slice(-6).toUpperCase()}
                      </Link>
                      <div className="text-xs text-ash">{when(o.createdAt)}</div>
                    </Td>
                    <Td className="max-w-[26rem]">{o.recipe || "—"}</Td>
                    <Td>{o.heat ? <Pill tone={heatTone(o.heat)}>{o.heat.replace(" Spice", "")}</Pill> : "—"}</Td>
                    <Td>{o.place ?? <span className="text-ash">no address</span>}</Td>
                    <Td right>{o.pouches}</Td>
                    <Td>
                      <Pill tone={statusTone(o.status)}>{statusLabel(o.status)}</Pill>
                    </Td>
                  </tr>
                ))}
                {s.recent.length === 0 && (
                  <tr>
                    <Td className="py-8 text-center text-ash">Nothing to roast. Paid orders land here.</Td>
                    <Td /><Td /><Td /><Td /><Td />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold">Most picked</h2>
              <span className="text-xs text-ash">30 days · by pouch</span>
            </div>
            {s.ingredients.length === 0 ? (
              <p className="text-xs text-ash">No pouches yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {s.ingredients.slice(0, 7).map((r) => (
                  <li key={r.label} className="grid grid-cols-[6.5rem_1fr_1.75rem] items-center gap-2.5">
                    <span className="truncate">{r.label}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-[#F0EBE6]">
                      <span
                        className="block h-full rounded-full bg-crimson"
                        style={{ width: `${Math.round((r.count / monthPouches) * 100)}%` }}
                      />
                    </span>
                    <span className="text-right text-xs text-ash">{r.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold">Heat split</h2>
              <span className="text-xs text-ash">30 days</span>
            </div>
            {s.heat.length === 0 ? (
              <p className="text-xs text-ash">No pouches yet.</p>
            ) : (
              <>
                <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
                  {s.heat.map((h) => (
                    <span
                      key={h.label}
                      style={{
                        flex: `0 0 ${(h.count / heatTotal) * 100}%`,
                        background: HEAT_COLORS[h.label] ?? "#D9CFC8",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-ash">
                  {s.heat.map((h) => (
                    <span key={h.label} className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: HEAT_COLORS[h.label] ?? "#D9CFC8" }}
                      />
                      {h.label.replace(" Spice", "")} {Math.round((h.count / heatTotal) * 100)}%
                    </span>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card className="flex flex-col gap-2 p-4">
            <h2 className="text-sm font-semibold">Needs attention</h2>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center justify-between gap-2">
                <Link href="/admin/queue" className="text-ink hover:text-crimson">Open orders without an address</Link>
                <Pill tone={s.attention.noAddress ? "hot" : "muted"}>{s.attention.noAddress}</Pill>
              </li>
              <li className="flex items-center justify-between gap-2">
                <Link href="/admin/queue?view=pending" className="text-ink hover:text-crimson">Abandoned checkouts · 7 days</Link>
                <Pill>{s.attention.abandonedWeek}</Pill>
              </li>
              <li className="flex items-center justify-between gap-2">
                <Link href="/admin/queue?view=roasting" className="text-ink hover:text-crimson">Roasting longer than 24 h</Link>
                <Pill tone={s.attention.roastingLong ? "hot" : "muted"}>{s.attention.roastingLong}</Pill>
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </>
  );
}
