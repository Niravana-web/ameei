import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMixByCode } from "@/lib/mixes";
import { getProductBySlug } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";
import { Container, NoiseOverlay } from "@/components/ui/primitives";
import { StudioBuilder } from "@/components/studio/StudioBuilder";
import { STUDIO_PRICING_VERSION, STUDIO_PRODUCT_SLUG } from "@/lib/studio";

const FALLBACK_IMAGE = "/images/products/hero-chivda-bowl.jpg";

// Share links are per-customer and shouldn't compete with /studio in search,
// hence the noindex below.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const mix = await getMixByCode(code);
  return {
    title: mix ? `${mix.summary} — ${mix.weight}` : "A shared mix",
    description: mix
      ? `A custom mix built in the ameei Studio: ${mix.summary}.`
      : undefined,
    robots: { index: false, follow: true },
    alternates: { canonical: `${siteConfig.url}/studio` },
  };
}

export default async function SharedMixPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const mix = await getMixByCode(code);
  if (!mix) notFound();

  const product = await getProductBySlug(STUDIO_PRODUCT_SLUG);
  const image = product?.image.src ?? FALLBACK_IMAGE;
  // The stored quote is a snapshot; the builder re-prices from the live table,
  // so say so rather than showing two different numbers with no explanation.
  const pricesMoved = mix.pricingVersion !== STUDIO_PRICING_VERSION;

  return (
    <Container className="pb-16 pt-24 md:pt-28">
      <header className="relative mb-10 overflow-hidden rounded-[1.5rem] border border-crimson/10 bg-white/70 p-8 shadow-spice backdrop-blur-xl md:p-10">
        <NoiseOverlay />
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 font-body text-label-caps uppercase text-crimson">
            Shared mix · {mix.code}
          </p>
          <h1 className="font-display text-display-hero tracking-tight text-ink">
            Someone built{" "}
            <span className="font-light italic text-crimson">this one.</span>
          </h1>
          <p className="mt-4 font-body text-editorial text-ash">{mix.summary}</p>
          {pricesMoved && (
            <p className="mt-4 rounded-lg border border-saffron/40 bg-saffron/10 px-3 py-2 font-body text-body-md text-ink">
              Our prices have changed since this mix was built — the total below is
              current.
            </p>
          )}
        </div>
      </header>

      <StudioBuilder image={image} initialSelection={mix.selection} />
    </Container>
  );
}
