import type { Order } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/site";
import {
  formatAddress,
  parseAddress,
  parseItems,
  stripePaymentUrl,
  type OrderStatus,
} from "@/lib/orders";
import { STUDIO_GROUPS, normalizeSelection, optionLabel } from "@/lib/studio";
import { saveOrderNotes, setOrderStatus, shipOrder, syncOrder } from "@/app/admin/queue/actions";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-ash/15 text-ash",
  paid: "bg-saffron/25 text-ink",
  roasting: "bg-crimson/10 text-crimson",
  shipped: "bg-success/15 text-success",
  cancelled: "bg-ink/10 text-ink/60",
};

const btn =
  "rounded-full px-4 py-1.5 font-body text-label-caps uppercase transition-colors disabled:opacity-50";
const btnPrimary = `${btn} bg-crimson text-white hover:bg-crimson-deep`;
const btnGhost = `${btn} border border-ink/15 bg-white text-ink hover:border-crimson/50`;

/** One pouch's recipe, grouped the way the kitchen reads it. */
async function Recipe({ codes }: { codes: string[] }) {
  if (codes.length === 0) return null;
  const mixes = await prisma.customMix.findMany({
    where: { code: { in: codes } },
    select: { code: true, selection: true },
  });
  const byCode = new Map(mixes.map((m) => [m.code, m.selection]));
  return (
    <>
      {codes.map((code) => {
        const raw = byCode.get(code);
        if (!raw) return null;
        let sel;
        try {
          sel = normalizeSelection(JSON.parse(raw));
        } catch {
          return null;
        }
        return (
          <dl key={code} className="mt-2 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 font-body text-body-sm">
            {STUDIO_GROUPS.filter((g) => g.countsTowardMix).map((g) => {
              const ids = sel[g.id as "nuts" | "cereals" | "extras"];
              return (
                <div key={g.id} className="contents">
                  <dt className="text-label-caps uppercase text-ash">{g.label}</dt>
                  <dd className={ids.length ? "text-ink" : "text-ash/60"}>
                    {ids.length ? ids.map((id) => optionLabel(g.id, id)).join(", ") : "none"}
                  </dd>
                </div>
              );
            })}
            <dt className="text-label-caps uppercase text-ash">Heat</dt>
            <dd className="font-semibold text-crimson">{optionLabel("spice", sel.spice)}</dd>
            <dt className="text-label-caps uppercase text-ash">Salt</dt>
            <dd className="text-ink">{optionLabel("salt", sel.salt)}</dd>
          </dl>
        );
      })}
    </>
  );
}

export async function OrderCard({ order: o }: { order: Order }) {
  const items = parseItems(o.items);
  const pouches = items.reduce((n, i) => n + i.qty, 0);
  const address = formatAddress(parseAddress(o.shippingAddress));
  const payUrl = stripePaymentUrl(o.paymentIntentId);
  const status = o.status as OrderStatus;
  const needsSync = status !== "pending" && (!o.shippingAddress || !o.paymentIntentId);
  const when = o.createdAt.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <article className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 font-body text-body-sm capitalize ${STATUS_STYLE[status] ?? ""}`}>
              {status}
            </span>
            <span className="font-body text-body-sm text-ash">{when}</span>
            {o.shippedAt && (
              <span className="font-body text-body-sm text-ash">
                · shipped {o.shippedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {o.carrier || o.trackingNumber ? ` · ${[o.carrier, o.trackingNumber].filter(Boolean).join(" ")}` : ""}
              </span>
            )}
          </div>
          <p className="mt-2 font-display text-headline-md text-ink">
            {pouches} {pouches === 1 ? "pouch" : "pouches"}
            <span className="ml-2 font-body text-body-md font-normal text-ash">
              {formatPrice(o.amountTotal / 100)}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status === "paid" && (
            <form action={setOrderStatus.bind(null, o.id, "roasting")}>
              <button type="submit" className={btnPrimary}>Start roasting</button>
            </form>
          )}
          {status === "roasting" && (
            <form action={setOrderStatus.bind(null, o.id, "paid")}>
              <button type="submit" className={btnGhost}>Back to queue</button>
            </form>
          )}
          {(status === "paid" || status === "roasting") && (
            <form action={setOrderStatus.bind(null, o.id, "cancelled")}>
              <button type="submit" className={btnGhost}>Cancel</button>
            </form>
          )}
          {status === "shipped" && (
            <form action={setOrderStatus.bind(null, o.id, "roasting")}>
              <button type="submit" className={btnGhost}>Un-ship</button>
            </form>
          )}
          {status === "cancelled" && (
            <form action={setOrderStatus.bind(null, o.id, "paid")}>
              <button type="submit" className={btnGhost}>Restore</button>
            </form>
          )}
          {payUrl && (
            <a href={payUrl} target="_blank" rel="noopener noreferrer" className={btnGhost}>
              Stripe ↗
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          {items.map((it, i) => (
            <div key={i} className={i ? "mt-4 border-t border-ink/10 pt-4" : ""}>
              <p className="font-body text-body-md text-ink">
                <span className="font-semibold">{it.qty} ×</span> {it.weight} pouch
                {it.mixCode && <span className="ml-2 text-ash">mix {it.mixCode}</span>}
              </p>
              {it.mixCode ? (
                <Recipe codes={[it.mixCode]} />
              ) : (
                <p className="mt-1 font-body text-body-sm text-ash">{it.name}</p>
              )}
            </div>
          ))}
        </div>

        <div className="font-body text-body-sm">
          <p className="text-label-caps uppercase text-ash">Ship to</p>
          {address.length ? (
            <address className="mt-1 not-italic text-ink">
              <span className="block font-semibold">{o.shippingName ?? o.customerName ?? ""}</span>
              {address.map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </address>
          ) : (
            <p className="mt-1 text-ash">
              {status === "pending" ? "Checkout never completed." : "No address on file."}
            </p>
          )}
          <p className="mt-2 text-ink">
            {o.email ?? "no email"}
            {o.phone ? ` · ${o.phone}` : ""}
          </p>
          {needsSync && (
            <form action={syncOrder.bind(null, o.id)} className="mt-2">
              <button type="submit" className="text-crimson hover:underline">
                Sync from Stripe
              </button>
            </form>
          )}

          {(status === "paid" || status === "roasting") && (
            <form action={shipOrder} className="mt-4 flex flex-wrap items-end gap-2">
              <input type="hidden" name="orderId" value={o.id} />
              <label className="flex flex-col gap-1">
                <span className="text-label-caps uppercase text-ash">Carrier</span>
                <input
                  name="carrier"
                  placeholder="USPS"
                  defaultValue={o.carrier ?? ""}
                  className="w-24 rounded-lg border border-ink/15 px-2.5 py-1.5 text-ink"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-label-caps uppercase text-ash">Tracking</span>
                <input
                  name="trackingNumber"
                  placeholder="9400 …"
                  defaultValue={o.trackingNumber ?? ""}
                  className="w-44 rounded-lg border border-ink/15 px-2.5 py-1.5 text-ink"
                />
              </label>
              <button type="submit" className={`${btnPrimary} bg-success hover:bg-success`}>
                Mark shipped
              </button>
            </form>
          )}

          <form action={saveOrderNotes} className="mt-4">
            <input type="hidden" name="orderId" value={o.id} />
            <label className="flex flex-col gap-1">
              <span className="text-label-caps uppercase text-ash">Kitchen notes</span>
              <textarea
                name="notes"
                rows={2}
                defaultValue={o.notes ?? ""}
                placeholder="Gift note, allergy flag, batch number…"
                className="rounded-lg border border-ink/15 px-2.5 py-1.5 text-ink"
              />
            </label>
            <button type="submit" className="mt-1 text-crimson hover:underline">
              Save note
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
