import Link from "next/link";
import { Container, NoiseOverlay } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

/** First-order offer. The code lives in Stripe (coupon firstpouch15). */
export function OfferBand() {
  return (
    <section className="pb-16 md:pb-24">
      <Container>
        <Reveal direction="scale">
          <div className="relative flex flex-col gap-8 overflow-hidden rounded-panel bg-ember p-8 text-chalk shadow-spice-lg md:flex-row md:items-center md:justify-between md:p-12">
            <NoiseOverlay />
            <div className="relative z-10 max-w-xl">
              <p className="mb-2 font-body text-label-caps uppercase text-amber-glow">
                First pouch?
              </p>
              <h2 className="font-display text-display-hero tracking-tighter">
                Fifteen percent off
                <br />
                <span className="font-light italic text-amber-glow">the one you build first.</span>
              </h2>
              <p className="mt-4 font-body text-body-md text-rosewood">
                Use code{" "}
                <strong className="font-bold tracking-wider text-chalk">FIRSTPOUCH</strong> at
                checkout. First order only, no minimum.
              </p>
            </div>
            <Link
              href="/studio"
              className="btn-spice relative z-10 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-saffron px-7 py-3 font-body text-label-caps uppercase text-ink"
            >
              Start building
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
