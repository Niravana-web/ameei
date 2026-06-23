import type { Metadata } from "next";
import {
  Container,
  ButtonLink,
  PhotoSlot,
  SectionHeading,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ChiliIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Heritage — five generations of crunch",
  description:
    "The ameei story: recipes carried across five generations, made the slow way, in small batches. Bold flavour, ancestral roots, a little bit of mischief.",
  alternates: { canonical: "/heritage" },
};

// Generic, person-free milestones — about the brand, not individuals.
const timeline = [
  {
    era: "The home kitchen",
    body: "It began the way most good things do — at home, with a hot pan, a fistful of spice, and snacks made to be shared rather than sold.",
  },
  {
    era: "The recipe book",
    body: "Quantities written in pinches and handfuls were slowly set down on paper, refined batch after batch until the crunch was right every time.",
  },
  {
    era: "The small-batch promise",
    body: "As word spread, one rule stayed fixed: never scale at the cost of flavour. Keep the batches small, keep the spice fresh, keep the soul intact.",
  },
  {
    era: "ameei today",
    body: "The same recipes, the same standards — now packed for your shelf. Heritage you can open, pour into a bowl, and pass around the room.",
  },
];

// What the brand stands for.
const values = [
  {
    title: "Small batch, always",
    body: "We roast and pack in small lots so every bag tastes like it was made this week — because it was.",
  },
  {
    title: "Real ingredients",
    body: "Whole spices, honest nuts and grains, nothing you can’t pronounce. Flavour comes from craft, not shortcuts.",
  },
  {
    title: "Rooted recipes",
    body: "Every mix traces back to a family kitchen. We modernise the making, never the soul of the recipe.",
  },
  {
    title: "A little mischief",
    body: "Snacking should be fun. We keep the heat playful and the flavours bold enough to start a conversation.",
  },
];

export default function HeritagePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-32">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal>
              <p className="mb-3 font-display text-editorial italic text-crimson">
                Our heritage
              </p>
              <h1 className="font-display text-display-hero tracking-tighter text-ink">
                Five generations,
                <br />
                <span className="font-light italic text-crimson">one bowl.</span>
              </h1>
              <p className="mt-5 max-w-md font-body text-body-lg text-ash">
                ameei isn&apos;t a recipe someone invented last year. It&apos;s
                flavour carried forward — kitchen to kitchen, hand to hand — and
                finally packed so it can travel to yours.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href="/shop" variant="primary">
                  Shop The Range
                </ButtonLink>
                <ButtonLink href="/spices" variant="secondary">
                  The Spice Craft
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal direction="right">
              <PhotoSlot
                label="Photo — well-worn family recipe notes & a brass bowl"
                ratio="aspect-[4/5]"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <ChiliIcon size={36} className="mx-auto mb-5 text-crimson" />
              <h2 className="font-display text-headline-lg text-ink">
                Snacking, we think,{" "}
                <span className="font-light italic text-crimson">
                  is a ritual.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 font-body text-body-lg text-ash">
                It&apos;s the bowl that lands in the middle of the table when
                people arrive. The handful between meals. The taste that pulls a
                memory back into the room. Long before ameei was a brand, it was
                that feeling — made at home, given away freely, never quite
                measured.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-4 font-body text-body-lg text-ash">
                What we&apos;ve done is protect it. The recipes are old; the
                standards are stubborn. We simply make sure the crunch that was
                only ever shared by hand can now reach a few more hands.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-ember-mist py-14 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How we got here"
              title="A recipe, carried forward"
              align="center"
            />
          </Reveal>
          <ol className="mx-auto mt-10 max-w-3xl space-y-4">
            {timeline.map((t, i) => (
              <Reveal key={t.era} delay={i * 90} as="li">
                <div className="flex gap-5 rounded-[1.25rem] border border-crimson/10 bg-white/80 p-6 shadow-sm">
                  <span className="font-display text-headline-md text-saffron">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-editorial text-ink">{t.era}</h3>
                    <p className="mt-1 font-body text-body-md text-ash">{t.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Values */}
      <section className="py-14 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we stand for"
              title="The things we won’t cut corners on"
              align="center"
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="h-full rounded-[1.25rem] border border-crimson/10 bg-white/70 p-6 shadow-spice backdrop-blur">
                  <h3 className="font-display text-headline-md text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-2 font-body text-body-md text-ash">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-crimson-deep px-8 py-12 text-center text-chalk shadow-spice-lg md:py-16">
              <h2 className="font-display text-headline-lg">
                Taste the part of the story{" "}
                <span className="font-light italic text-amber-glow">
                  you can hold.
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-md font-body text-body-md text-chalk/80">
                Every bag is a little piece of where we come from — bold, spiced,
                and made in small batches.
              </p>
              <div className="mt-7">
                <ButtonLink href="/shop" variant="ghost">
                  Shop The Range
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
