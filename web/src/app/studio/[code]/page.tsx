import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMixByCode } from "@/lib/mixes";
import { getProductBySlug } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/primitives";
import { StudioBuilder } from "@/components/studio/StudioBuilder";
import { STUDIO_PRICING_VERSION, STUDIO_PRODUCT_SLUG } from "@/lib/studio";

const FALLBACK_IMAGE = "/images/pouch/pouch-table.jpg";

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
    <Container className="pb-20 pt-28 md:pt-36">
      <header className="mb-10">
        <div className="max-w-2xl">
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
              This pouch was built before our current size and price. It opens at today&apos;s
              8 oz pouch and price.
            </p>
          )}
        </div>
      </header>

      <StudioBuilder image={image} initialSelection={mix.selection} />
    </Container>
  );
}
