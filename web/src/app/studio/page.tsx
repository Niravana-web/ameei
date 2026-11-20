import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/catalog";
import { siteConfig, formatPrice } from "@/lib/site";
import { Container } from "@/components/ui/primitives";
import { StudioBuilder } from "@/components/studio/StudioBuilder";
import {
  STUDIO_POUCH,
  STUDIO_PRODUCT_SLUG,
  findPreset,
  presetSelection,
} from "@/lib/studio";

/** Shown in the summary card until the build-your-own row has its own photo. */
const FALLBACK_IMAGE = "/images/pouch/pouch-table.jpg";

export const metadata: Metadata = {
  title: "Studio — build your pouch",
  description: `Build your ${STUDIO_POUCH.label} pouch: pick nuts, cereals and extras, set the heat and the salt. One price, roasted to order and shipped across the US.`,
  alternates: { canonical: `${siteConfig.url}/studio` },
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string }>;
}) {
  const { preset: presetId } = await searchParams;
  const preset = findPreset(presetId);
  // The Studio no longer depends on the product row's photo: the pouch shot is
  // the brand's, not a recipe's. Keep the lookup so the cart line image follows
  // /admin if someone uploads a better one.
  const product = await getProductBySlug(STUDIO_PRODUCT_SLUG);
  const image = product?.image.src && product.image.src !== "/images/products/hero-chivda-bowl.jpg"
    ? product.image.src
    : FALLBACK_IMAGE;

  return (
    <Container className="pb-20 pt-28 md:pt-36">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 font-body text-label-caps uppercase text-crimson">
          {preset ? `House recipe · ${preset.name}` : "The Studio"}
        </p>
        <h1 className="font-display text-display-hero tracking-tighter text-ink">
          Build your pouch.
          <br />
          <span className="font-light italic text-crimson-deep">We roast it this week.</span>
        </h1>
        <p className="mt-4 font-body text-editorial text-ash">
          {preset
            ? `${preset.blurb} Change anything you like before it goes in the pouch.`
            : `${STUDIO_POUCH.label.replace("oz", " oz")}. One price, ${formatPrice(STUDIO_POUCH.priceCents / 100)}. Pick as many ingredients as you like, then set the heat and the salt. Nothing here costs extra.`}
        </p>
      </header>

      <StudioBuilder image={image} initialSelection={preset ? presetSelection(preset) : undefined} />
    </Container>
  );
}
