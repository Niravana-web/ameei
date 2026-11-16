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
import { STUDIO_GROUPS, STUDIO_PRESETS, normalizeSelection, optionLabel, presetSelection, canonicalMixKey } from "@/lib/studio";
import { saveOrderNotes, setOrderStatus, shipOrder, syncOrder } from "@/app/admin/queue/actions";
import { Label, Pill, btn, btnOk, btnPrimary, heatTone, input, statusLabel, statusTone } from "@/components/admin/ui";

const PRESET_KEYS = new Map(STUDIO_PRESETS.map((p) => [canonicalMixKey(presetSelection(p)), p.name]));

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
        const preset = PRESET_KEYS.get(canonicalMixKey(sel));
        const heat = optionLabel("spice", sel.spice);
        return (
          <div key={code}>
            <dl className="grid grid-cols-[3.9rem_1fr] gap-x-2.5 gap-y-0.5 text-[12.5px]">
              {STUDIO_GROUPS.filter((g) => g.countsTowardMix).map((g) => {
                const ids = sel[g.id as "nuts" | "cereals" | "extras"];
                return (
                  <div key={g.id} className="contents">
                    <dt className="pt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#8E7F81]">{g.label}</dt>
                    <dd className={ids.length ? "text-ink" : "text-ash/60"}>
                      {ids.length ? ids.map((id) => optionLabel(g.id, id)).join(", ") : "none"}
                    </dd>
                  </div>
                );
              })}
              <dt className="pt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#8E7F81]">Heat</dt>
              <dd><Pill tone={heatTone(heat)}>{heat}</Pill></dd>
              <dt className="pt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#8E7F81]">Salt</dt>
              <dd className="text-ink">{optionLabel("salt", sel.salt)}</dd>
            </dl>
            <p className="mt-2 text-xs text-ash">
              mix {code}
              {preset ? ` · ${preset} preset, unchanged` : ""}
            </p>
          </div>
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
  const started =
    status === "roasting" && o.roastedAt
      ? `started ${Math.max(1, Math.round((new Date().getTime() - o.roastedAt.getTime()) / 3600_000))} h ago`
      : null;

  return (
    <article id={o.id} className="grid gap-4 border-t border-ink/[0.08] px-4 py-3.5 xl:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-bold">#{o.id.slice(-6).toUpperCase()}</span>
          <Pill tone={statusTone(status)}>{statusLabel(status)}</Pill>
          <span className="text-xs text-ash">
            {when}
            {started ? ` · ${started}` : ""}
            {o.shippedAt
              ? ` · shipped ${o.shippedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}${
                  o.carrier || o.trackingNumber ? ` · ${[o.carrier, o.trackingNumber].filter(Boolean).join(" ")}` : ""
                }`
              : ""}
          </span>
          <span className="ml-auto font-semibold">
            {pouches} {pouches === 1 ? "pouch" : "pouches"} · {formatPrice(o.amountTotal / 100)}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((it, i) => (
            <div key={i}>
              {items.length > 1 && (
                <p className="mb-1 text-[12.5px] font-semibold">
                  {it.qty} × {it.weight}
                </p>
              )}
              {it.mixCode ? <Recipe codes={[it.mixCode]} /> : <p className="text-xs text-ash">{it.name}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="text-[12.5px]">
        <Label>Ship to</Label>
        {address.length ? (
          <address className="mt-1 not-italic leading-[1.5] text-ink">
            <strong>{o.shippingName ?? o.customerName ?? ""}</strong>
            {address.map((l, i) => (
              <span key={i} className="block">{l}</span>
            ))}
          </address>
        ) : (
          <p className="mt-1 text-ash">{status === "pending" ? "Checkout never completed." : "No address on file."}</p>
        )}
        <p className="mt-1.5 text-xs text-ash">
          {o.email ?? "no email"}
          {o.phone ? ` · ${o.phone}` : ""}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-3 text-xs font-semibold">
          {payUrl && (
            <a href={payUrl} target="_blank" rel="noopener noreferrer" className="text-crimson-deep hover:text-crimson">
              Stripe payment ↗
            </a>
          )}
          {needsSync && (
            <form action={syncOrder.bind(null, o.id)}>
              <button type="submit" className="text-crimson-deep hover:text-crimson">Sync from Stripe</button>
            </form>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap gap-2">
          {status === "paid" && (
            <form action={setOrderStatus.bind(null, o.id, "roasting")}>
              <button type="submit" className={btnPrimary}>Start roasting</button>
            </form>
          )}
          {status === "roasting" && (
            <form action={setOrderStatus.bind(null, o.id, "paid")}>
              <button type="submit" className={btn}>Back to queue</button>
            </form>
          )}
          {(status === "paid" || status === "roasting") && (
            <form action={setOrderStatus.bind(null, o.id, "cancelled")}>
              <button type="submit" className={btn}>Cancel</button>
            </form>
          )}
          {status === "shipped" && (
            <form action={setOrderStatus.bind(null, o.id, "roasting")}>
              <button type="submit" className={btn}>Un-ship</button>
            </form>
          )}
          {status === "cancelled" && (
            <form action={setOrderStatus.bind(null, o.id, "paid")}>
              <button type="submit" className={btn}>Restore</button>
            </form>
          )}
        </div>

        {(status === "paid" || status === "roasting") && (
          <form action={shipOrder} className="flex flex-wrap items-end gap-1.5">
            <input type="hidden" name="orderId" value={o.id} />
            <label className="flex flex-col gap-0.5">
              <Label>Carrier</Label>
              <input name="carrier" placeholder="USPS" defaultValue={o.carrier ?? ""} className={`${input} w-[84px]`} />
            </label>
            <label className="flex flex-1 basis-[140px] flex-col gap-0.5">
              <Label>Tracking</Label>
              <input name="trackingNumber" placeholder="9400 1000 …" defaultValue={o.trackingNumber ?? ""} className={`${input} w-full`} />
            </label>
            <button type="submit" className={btnOk}>Mark shipped</button>
          </form>
        )}

        <form action={saveOrderNotes} className="flex items-end gap-1.5">
          <input type="hidden" name="orderId" value={o.id} />
          <label className="flex flex-1 flex-col gap-0.5">
            <Label>Kitchen note</Label>
            <input
              name="notes"
              defaultValue={o.notes ?? ""}
              placeholder="Gift note, allergy flag, batch…"
              className={`${input} w-full`}
            />
          </label>
          <button type="submit" className={btn}>Save</button>
        </form>
      </div>
    </article>
  );
}
