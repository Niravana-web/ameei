import Image from "next/image";
import { Container, NoiseOverlay, ButtonLink } from "@/components/ui/primitives";
import { ArrowRightIcon } from "@/components/ui/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-28">
      {/* Warm gradient wash, top-right */}
      <div
        aria-hidden
        className="absolute right-0 top-0 -z-10 h-full w-1/2 rounded-bl-[80px] bg-gradient-to-bl from-blush/20 to-transparent"
      />
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* Copy */}
          <div className="z-10 space-y-5 md:col-span-6">
            <div className="animate-drop-in inline-block rounded-full border border-crimson-deep/20 bg-white/50 px-3 py-1.5 shadow-sm backdrop-blur-md">
              <span className="font-body text-label-caps uppercase text-crimson-deep">
                Small-Batch Drops
              </span>
            </div>
            <h1 className="animate-drop-in delay-1 font-display text-display-hero tracking-tighter text-ember">
              Crunch with
              <br />a little bit
              <br />
              <span className="font-light italic text-crimson-deep">of spice.</span>
            </h1>
            <p className="animate-fade-up delay-3 max-w-md font-body text-body-lg text-ash">
              Small-batch Indian snack mixes — roasted, spiced, and packed the
              way they&apos;re meant to be. Rooted in Indian family recipes,
              made and shipped fresh across the US, with a little bit of
              mischief.
            </p>
            <div className="animate-fade-up delay-4 pt-2">
              <ButtonLink href="/shop" className="animate-pulse-glow">
                Shop the Range
                <ArrowRightIcon size={16} />
              </ButtonLink>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative mt-10 h-[320px] md:col-span-6 md:mt-0 md:h-[420px]">
            <div className="animate-fade-up delay-2 absolute inset-0 overflow-hidden rounded-[1.5rem] border border-chalk/30 bg-white/40 shadow-2xl backdrop-blur-2xl md:-translate-y-4 md:translate-x-8">
              <NoiseOverlay />
              <Image
                src="/images/products/hero-chivda-bowl.jpg"
                alt="Handmade ceramic bowl filled with golden Indian chivda mix — flattened rice, peanuts, and roasted lentils glistening with spices"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-[1.5rem] object-cover opacity-90 mix-blend-multiply"
              />
            </div>
            {/* Floating badge */}
            <div className="animate-float absolute -bottom-6 -left-2 flex h-24 w-24 items-center justify-center rounded-full border-4 border-chalk bg-white p-1.5 shadow-2xl md:-left-6 md:h-28 md:w-28">
              <Image
                src="/images/badge.png"
                alt="ameei shield badge"
                width={112}
                height={112}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
