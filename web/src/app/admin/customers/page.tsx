import Link from "next/link";
import { getPeople } from "@/lib/people";
import { formatPrice } from "@/lib/site";
import { Card, PageHeader, Pill, Stat, Td, Th, btnPrimary, heatTone } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

type View = "all" | "buyers" | "repeat" | "subscribers";
const VIEWS: { id: View; label: string }[] = [
  { id: "all", label: "All" },
  { id: "buyers", label: "Buyers" },
  { id: "repeat", label: "Repeat" },
  { id: "subscribers", label: "Subscribed, not bought" },
];

function initials(name: string | null, email: string) {
  const src = name?.trim() || email.split("@")[0];
  const parts = src.split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: raw } = await searchParams;
  const view: View = VIEWS.some((v) => v.id === raw) ? (raw as View) : "all";
  const people = await getPeople();
  const weekAgo = new Date().getTime() - 7 * 86400_000;

  const buyers = people.filter((p) => p.orders > 0);
  const repeat = people.filter((p) => p.orders > 1);
  const subsOnly = people.filter((p) => p.subscriber && p.orders === 0);
  const subs = people.filter((p) => p.subscriber);
  const newWeek = people.filter((p) => p.firstSeen.getTime() >= weekAgo).length;
  const bySource = subs.reduce<Record<string, number>>((m, p) => {
    const k = p.source ?? "other";
    m[k] = (m[k] ?? 0) + 1;
    return m;
  }, {});

  const rows =
    view === "buyers" ? buyers : view === "repeat" ? repeat : view === "subscribers" ? subsOnly : people;
  const counts: Record<View, number> = {
    all: people.length,
    buyers: buyers.length,
    repeat: repeat.length,
    subscribers: subsOnly.length,
  };

  return (
    <>
      <PageHeader
        title="Customers"
        sub="Buyers and subscribers, one row per email"
        actions={
          <a href="/admin/customers/export" className={btnPrimary}>
            Download CSV
          </a>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="People summary">
        <Stat label="People" value={String(people.length)} sub={`+${newWeek} this week`} />
        <Stat label="Buyers" value={String(buyers.length)} sub={`${repeat.length} repeat`} />
        <Stat
          label="Subscribers"
          value={String(subs.length)}
          sub={Object.entries(bySource).map(([k, v]) => `${v} ${k}`).join(" · ") || "none yet"}
        />
        <Stat label="Subscribed, not bought" value={String(subsOnly.length)} sub="your outreach list" />
      </section>

      <nav aria-label="People filter" className="flex flex-wrap gap-2">
        {VIEWS.map((v) => {
          const on = v.id === view;
          return (
            <Link
              key={v.id}
              href={v.id === "all" ? "/admin/customers" : `/admin/customers?view=${v.id}`}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors ${
                on ? "border-ink bg-ink text-chalk" : "border-ink/15 bg-white text-ink hover:border-crimson/50"
              }`}
            >
              {v.label}
              <span className={`text-[11px] ${on ? "text-chalk/70" : "text-[#8E7F81]"}`}>{counts[v.id]}</span>
            </Link>
          );
        })}
      </nav>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>Person</Th>
                <Th>Where</Th>
                <Th>Heat</Th>
                <Th right>Orders</Th>
                <Th right>Pouches</Th>
                <Th right>Spent</Th>
                <Th>Last seen</Th>
                <Th>Tags</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.email} className="last:[&>td]:border-b-0">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-[#FFF1EC] text-[11px] font-bold text-crimson-deep">
                        {initials(p.name, p.email)}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold">{p.name ?? "—"}</div>
                        <div className="truncate text-xs text-ash">
                          {p.email}
                          {p.phone ? ` · ${p.phone}` : ""}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>{[p.city, p.state].filter(Boolean).join(", ") || "—"}</Td>
                  <Td>{p.lastHeat ? <Pill tone={heatTone(p.lastHeat)}>{p.lastHeat.replace(" Spice", "")}</Pill> : "—"}</Td>
                  <Td right>{p.orders || "—"}</Td>
                  <Td right>{p.pouches || "—"}</Td>
                  <Td right>{p.spentCents ? formatPrice(p.spentCents / 100) : "—"}</Td>
                  <Td>
                    {(p.lastOrder ?? p.firstSeen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Td>
                  <Td>
                    <span className="flex flex-wrap gap-1">
                      {p.orders > 1 && <Pill tone="up">repeat</Pill>}
                      {p.orders === 1 && <Pill tone="up">bought</Pill>}
                      {p.subscriber && <Pill tone="warn">{p.source ?? "subscriber"}</Pill>}
                    </span>
                  </Td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <Td className="py-10 text-center text-ash">No one in this view yet.</Td>
                  <Td /><Td /><Td /><Td /><Td /><Td /><Td />
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-ink/[0.08] px-4 py-2.5 text-xs text-ash">
          Showing {rows.length} of {people.length}. The CSV matches the outreach sheet&apos;s columns; customer data stays in this database and your download.
        </p>
      </Card>
    </>
  );
}
