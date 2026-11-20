import Image from "next/image";
import Link from "next/link";
import { Container, NoiseOverlay, ButtonLink } from "@/components/ui/primitives";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/site";
import { STUDIO_POUCH } from "@/lib/studio";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <div
        aria-hidden
        className="absolute right-0 top-0 -z-10 h-full w-1/2 rounded-bl-[80px] bg-gradient-to-bl from-blush/20 to-transparent"
      />
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="z-10 space-y-6 md:col-span-6">
            <div className="animate-drop-in inline-flex items-center gap-2 rounded-full border border-crimson/20 bg-white px-3.5 py-1.5 shadow-sm">
              <span aria-hidden className="h-2 w-2 rounded-full bg-saffron" />
              <span className="font-body text-label-caps uppercase text-crimson-deep">
                One pouch · built to your order
              </span>
            </div>
            <h1 className="animate-drop-in delay-1 font-display text-display-hero tracking-tighter text-ink">
              One pouch.
              <br />
              Your recipe.
              <br />
              <span className="font-light italic text-crimson-deep">Roasted this week.</span>
            </h1>
            <p className="animate-fade-up delay-3 max-w-lg font-body text-body-lg text-ash">
              ameei makes exactly one thing: an {STUDIO_POUCH.label.replace("oz", " oz")} pouch of
              roasted nuts, cereals and extras, blended the way you ask for it. Pick what goes
              in, set the heat and the salt, and we roast, blend and ship it to your door.
            </p>
            <div className="animate-fade-up delay-4 flex flex-wrap items-center gap-3 pt-1">
              <ButtonLink href="/studio">
                Build your pouch
                <ArrowRightIcon size={16} />
              </ButtonLink>
              <Link
                href="#how"
                className="btn-spice inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-2.5 font-body text-label-caps uppercase text-ink hover:border-ink"
              >
                How it works
              </Link>
            </div>
            <p className="animate-fade-up delay-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-body text-body-md text-ash">
              <span className="font-display text-headline-lg tracking-tight text-ink">
                {formatPrice(STUDIO_POUCH.priceCents / 100)}
              </span>
              <span>
                {STUDIO_POUCH.label.replace("oz", " oz")} · every ingredient, heat and salt level
                included
              </span>
            </p>
          </div>

          <div className="relative md:col-span-6">
            <div className="animate-fade-up delay-2 relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#f7e4cf] shadow-spice-lg">
              <NoiseOverlay className="z-10" />
              <Image
                src="/images/pouch/pouch-hero.jpg"
                alt="An ameei 8 oz pouch beside a wooden bowl of roasted snack mix"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
