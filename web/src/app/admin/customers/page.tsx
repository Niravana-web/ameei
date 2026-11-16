import { getPeople } from "@/lib/people";
import { formatPrice } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const people = await getPeople();
  const buyers = people.filter((p) => p.orders > 0).length;
  const subs = people.filter((p) => p.subscriber).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-headline-lg text-ink">Customers</h1>
          <p className="mt-1 font-body text-body-sm text-ash">
            {people.length} people · {buyers} buyers · {subs} subscribers. One row per email.
          </p>
        </div>
        <a
          href="/admin/customers/export"
          className="rounded-full bg-crimson px-5 py-2 font-body text-label-caps uppercase text-white"
        >
          Download CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
        <table className="w-full border-collapse text-left font-body text-body-sm">
          <thead className="bg-chalk text-label-caps uppercase text-ash">
            <tr>
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Where</th>
              <th className="px-4 py-3">Heat</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Pouches</th>
              <th className="px-4 py-3 text-right">Spent</th>
              <th className="px-4 py-3">Last seen</th>
              <th className="px-4 py-3">Tags</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.email} className="border-t border-ink/10 align-top">
                <td className="px-4 py-3">
                  <div className="font-semibold text-ink">{p.name ?? "—"}</div>
                  <div className="text-ash">{p.email}</div>
                  {p.phone && <div className="text-ash">{p.phone}</div>}
                </td>
                <td className="px-4 py-3 text-ink/80">
                  {[p.city, p.state].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-ink/80">{p.lastHeat ?? "—"}</td>
                <td className="px-4 py-3 text-right text-ink">{p.orders || "—"}</td>
                <td className="px-4 py-3 text-right text-ink">{p.pouches || "—"}</td>
                <td className="px-4 py-3 text-right text-ink">
                  {p.spentCents ? formatPrice(p.spentCents / 100) : "—"}
                </td>
                <td className="px-4 py-3 text-ink/80">
                  {(p.lastOrder ?? p.firstSeen).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap gap-1">
                    {p.orders > 0 && (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-success">
                        {p.orders > 1 ? "repeat" : "bought"}
                      </span>
                    )}
                    {p.subscriber && (
                      <span className="rounded-full bg-saffron/25 px-2 py-0.5 text-ink">
                        {p.source ?? "subscriber"}
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-ash">
                  No buyers or subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 font-body text-body-sm text-ash">
        The CSV matches the columns in <code>ads/crm/ameei_crm.csv</code> closely enough to paste in.
        Customer data stays in this database and your download; it is never committed.
      </p>
    </div>
  );
}
