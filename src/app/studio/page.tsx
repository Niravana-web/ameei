import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";
import { Container, NoiseOverlay } from "@/components/ui/primitives";
import { StudioBuilder } from "@/components/studio/StudioBuilder";
import { STUDIO_PRODUCT_SLUG } from "@/lib/studio";

/** Used until the build-your-own product row has real photography. */
const FALLBACK_IMAGE = "/images/products/hero-chivda-bowl.jpg";

export const metadata: Metadata = {
  title: "Studio — Build Your Own Mix",
  description:
    "Build your own American Healthy Mix: choose your nuts, cereals and extras, then set your spice and salt. Blended to order and shipped within 24 hours.",
  alternates: { canonical: `${siteConfig.url}/studio` },
};

export default async function StudioPage() {
  const product = await getProductBySlug(STUDIO_PRODUCT_SLUG);
  const image = product?.image.src ?? FALLBACK_IMAGE;

  return (
    <Container className="pb-16 pt-24 md:pt-28">
      <header className="relative mb-10 overflow-hidden rounded-[1.5rem] border border-crimson/10 bg-white/70 p-8 shadow-spice backdrop-blur-xl md:p-10">
        <NoiseOverlay />
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 font-body text-label-caps uppercase text-crimson">
            The Studio
          </p>
          <h1 className="font-display text-display-hero tracking-tight text-ink">
            Build it{" "}
            <span className="font-light italic text-crimson">your way.</span>
          </h1>
          <p className="mt-4 font-body text-editorial text-ash">
            Pick your nuts, your cereals, your extras. Set the heat and the salt.
            We blend it to order — no two bags have to be the same.
          </p>
        </div>
      </header>

      <StudioBuilder image={image} />
    </Container>
  );
}
