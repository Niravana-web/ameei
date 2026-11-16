import Image from "next/image";
import Link from "next/link";
import { Container, NoiseOverlay, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { STUDIO_PRESETS } from "@/lib/studio";

/** The three house recipes. Not products: each opens the Studio pre-filled. */
export function HouseRecipes() {
  return (
    <section className="pb-16 md:pb-24">
      <Container>
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <p className="mb-2 font-body text-label-caps uppercase text-crimson">
              Not sure where to start?
            </p>
            <h2 className="font-display text-display-hero tracking-tighter text-ink">
              Three house recipes.
              <br />
              <span className="font-light italic text-crimson-deep">
                Open one, then make it yours.
              </span>
            </h2>
            <p className="mt-4 font-body text-body-lg text-ash">
              These are not separate products. Each one opens the Studio with the pantry already
              ticked, so you can change anything before it goes in the pouch.
            </p>
          </div>
        </Reveal>

        <ul className="grid gap-5 md:grid-cols-3">
          {STUDIO_PRESETS.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 110}>
              <Link
                href={`/studio?preset=${p.id}`}
                className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-crimson/10 bg-white shadow-spice"
              >
                {p.id === "everyday-medium" && (
                  <Badge tone="saffron" className="absolute left-4 top-4 z-20">
                    Most ordered
                  </Badge>
                )}
                <div
                  className={`relative aspect-[4/3] overflow-hidden ${
                    p.heat === "Extra hot" ? "bg-ember-soft" : "bg-[#f7e4cf]"
                  }`}
                >
                  <NoiseOverlay className="z-10" />
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-headline-md text-ink">{p.name}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] ${
                        p.heat === "Extra hot"
                          ? "bg-crimson-deep text-chalk"
                          : "border border-ink/10 bg-chalk text-ink"
                      }`}
                    >
                      {p.heat}
                    </span>
                  </div>
                  <p className="font-body text-body-md text-ash">{p.blurb}</p>
                  <span className="mt-auto pt-2 font-body text-label-caps uppercase text-crimson-deep transition-colors group-hover:text-crimson">
                    Open in Studio →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
