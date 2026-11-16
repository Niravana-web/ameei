"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useCart, cartLineKey } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import { Container } from "@/components/ui/primitives";
import { PlusIcon, MinusIcon } from "@/components/ui/icons";

export default function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart();
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            weight: i.weight,
            qty: i.qty,
            ...(i.mixCode ? { mixCode: i.mixCode } : {}),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed.");
      window.location.href = data.url; // hosted Stripe Checkout
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <Container className="min-h-screen pb-16 pt-24 md:pt-28">
      <h1 className="mb-8 font-display text-headline-lg text-crimson">Your bag</h1>

      {count === 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-white/70 p-10 text-center">
          <p className="font-body text-body-lg text-ash">Your bag is empty.</p>
          <Link
            href="/shop"
            className="mt-5 inline-block rounded-full bg-crimson px-6 py-2.5 font-body text-label-caps uppercase text-white"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          {/* Lines */}
          <ul className="space-y-4">
            {items.map((it) => (
              <li
                key={cartLineKey(it)}
                className="flex gap-4 rounded-xl border border-ink/10 bg-white/70 p-3"
              >
                <Link
                  href={it.mixCode ? `/studio/${it.mixCode}` : `/shop/${it.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-chalk"
                >
                  <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                        href={it.mixCode ? `/studio/${it.mixCode}` : `/shop/${it.slug}`}
                        className="font-display text-headline-md text-ink hover:text-crimson"
                      >
                        {it.name}
                      </Link>
                      <p className="font-body text-body-md text-ash">{it.weight}</p>
                      {it.mixSummary && (
                        <p className="mt-0.5 max-w-md font-body text-body-md leading-snug text-ash/80">
                          {it.mixSummary}
                        </p>
                      )}
                    </div>
                    <span className="font-body text-body-lg font-bold text-crimson">
                      {formatPrice(it.unitPrice * it.qty)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-ash/30 bg-white p-1">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(it, it.qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-ash hover:bg-chalk hover:text-ink"
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-9 text-center font-body text-body-md text-ink">{it.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(it, it.qty + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-ash hover:bg-chalk hover:text-ink"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(it)}
                      className="font-body text-body-sm text-ash hover:text-crimson"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-ink/10 bg-white/70 p-5">
            <div className="flex justify-between font-body text-body-md text-ink">
              <span>Subtotal</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 font-body text-body-sm text-ash">
              Shipping & tax calculated at checkout.
            </p>
            {error && (
              <p className="mt-3 rounded-lg border border-crimson/30 bg-crimson/5 px-3 py-2 font-body text-body-sm text-crimson">
                {error}
              </p>
            )}
            {isSignedIn ? (
              <button
                type="button"
                onClick={checkout}
                disabled={loading}
                className="btn-spice mt-4 w-full rounded-full bg-crimson py-3.5 font-body text-label-caps uppercase tracking-widest text-white shadow-lg transition-opacity disabled:opacity-60"
              >
                {loading ? "Redirecting…" : "Checkout"}
              </button>
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/cart">
                <button
                  type="button"
                  className="btn-spice mt-4 w-full rounded-full bg-crimson py-3.5 font-body text-label-caps uppercase tracking-widest text-white shadow-lg"
                >
                  Sign in to checkout
                </button>
              </SignInButton>
            )}
            <Link
              href="/shop"
              className="mt-3 block text-center font-body text-body-sm text-ash hover:text-crimson"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </Container>
  );
}
