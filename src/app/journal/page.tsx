import type { Metadata } from "next";
import {
  Container,
  ButtonLink,
  PhotoSlot,
  SectionHeading,
  Badge,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Journal — recipes, pairings & spice notes",
  description:
    "Notes from the ameei kitchen: recipes, pairing ideas, spice know-how, and the stories behind each small batch.",
  alternates: { canonical: "/journal" },
};

const categories = ["Recipes", "Pairings", "Spice Notes", "Behind the Batch"];

// Placeholder entries — swap copy/href as real posts are published.
const entries = [
  {
    category: "Recipes",
    title: "Five ways to cook with a bag of chivda",
    excerpt: "Our snack mixes aren’t just for the bowl. From quick chaat to a crunchy topping for rice, here’s where they go next.",
    read: "5 min read",
    img: "/images/pages/journal-samosas.jpg",
  },
  {
    category: "Pairings",
    title: "What to drink with heat",
    excerpt: "Chai, cold lager, salted lassi — a short field guide to pairing drinks with each of our three spice levels.",
    read: "4 min read",
    img: "/images/pages/journal-pairings.jpg",
  },
  {
    category: "Spice Notes",
    title: "Why we toast before we grind",
    excerpt: "A two-minute look at the single step that does the most for flavour — and why we never skip it.",
    read: "3 min read",
    img: "/images/pages/spices-hero.jpg",
  },
  {
    category: "Behind the Batch",
    title: "What ‘small batch’ actually means here",
    excerpt: "No marketing fog — just how big a batch is, how often we make one, and why we keep it that way.",
    read: "4 min read",
    img: "/images/pages/journal-kitchen.jpg",
  },
  {
    category: "Recipes",
    title: "A snack board for last-minute guests",
    excerpt: "Three mixes, a few fresh bits, ten minutes. The fastest way to make a table look generous.",
    read: "3 min read",
    img: "/images/pages/journal-snackboard.jpg",
  },
  {
    category: "Spice Notes",
    title: "Reading a spice rating",
    excerpt: "Mild, medium, hot — what each level feels like, and how to pick the right one for the room.",
    read: "2 min read",
    img: "/images/pages/journal-curry.jpg",
  },
];

export default function JournalPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-32">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="mb-3 font-display text-editorial italic text-crimson">
                The ameei journal
              </p>
              <h1 className="font-display text-display-hero tracking-tighter text-ink">
                Notes from a
                <br />
                <span className="font-light italic text-crimson">
                  warm kitchen.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-md font-body text-body-lg text-ash">
                Recipes, pairings, and the small details of how we make things —
                written the same way we cook: unhurried, generous, and a little
                bit spicy.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Category chips */}
      <section className="pb-8">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge tone="crimson">All</Badge>
              {categories.map((c) => (
                <Badge key={c} tone="chalk">
                  {c}
                </Badge>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Entries grid */}
      <section className="pb-14 md:pb-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((e, i) => (
              <Reveal key={e.title} delay={(i % 3) * 90} as="article">
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-crimson/10 bg-white/70 shadow-spice backdrop-blur">
                  <PhotoSlot
                    label={e.title}
                    src={e.img}
                    ratio="aspect-[16/10]"
                    className="rounded-none"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge tone="saffron">{e.category}</Badge>
                      <span className="font-body text-body-sm text-ash">{e.read}</span>
                    </div>
                    <h3 className="font-display text-headline-md text-ink">
                      {e.title}
                    </h3>
                    <p className="mt-2 font-body text-body-md text-ash">
                      {e.excerpt}
                    </p>
                    <span className="mt-4 inline-block font-body text-label-caps uppercase tracking-widest text-crimson/60">
                      Coming soon
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter / follow CTA */}
      <section className="pb-20">
        <Container>
          <Reveal direction="scale">
            <div className="relative grid items-center gap-8 overflow-hidden rounded-[1.5rem] bg-crimson-deep px-8 py-12 text-chalk shadow-spice-lg md:grid-cols-2 md:py-14">
              <div>
                <SectionHeading
                  eyebrow="Don’t miss the first entries"
                  title="Be the first to read it"
                  dark
                />
                <p className="mt-3 max-w-md font-body text-body-md text-chalk/80">
                  New recipes and spice notes land here regularly. Follow along
                  for the first taste — and the occasional discount.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href={siteConfig.links.instagram} variant="ghost">
                    Follow On Instagram
                  </ButtonLink>
                  <ButtonLink href="/shop" variant="secondary">
                    Shop The Range
                  </ButtonLink>
                </div>
              </div>
              <PhotoSlot
                label="An overhead spread of fresh, colourful dishes"
                src="/images/pages/journal-flatlay.jpg"
                ratio="aspect-[4/3]"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
