import type { Metadata } from "next";
import {
  Container,
  ButtonLink,
  PhotoSlot,
  SectionHeading,
  Badge,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ChiliIcon, FlameIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Spices — the craft behind the crunch",
  description:
    "Spice is the soul of every ameei snack. How we source, toast, and balance the masalas that go into our small-batch Indian snack mixes.",
  alternates: { canonical: "/spices" },
};

// The four-step method behind every blend.
const method = [
  {
    step: "01",
    title: "Source whole",
    body: "We buy spices whole, never pre-ground — from regions known for each one. Whole spice keeps its oils locked in until the moment we need them.",
  },
  {
    step: "02",
    title: "Toast to wake",
    body: "Every batch is dry-roasted in small lots until the kitchen turns fragrant. Heat coaxes out the oils that powdered spice has long since lost.",
  },
  {
    step: "03",
    title: "Grind fresh",
    body: "Toasted spice is ground in short runs and used quickly. No warehouse months, no flat top-notes — just spice at its loudest.",
  },
  {
    step: "04",
    title: "Balance by taste",
    body: "A blend is finished by tasting, not by formula alone. Salt, heat, sweet, and sour are tuned until the bite is unmistakably ameei.",
  },
];

// Signature pantry — the spices that recur across the range.
const pantry = [
  { name: "Kashmiri Chilli", note: "Deep colour, gentle heat — the blush in every mix." },
  { name: "Cumin", note: "Earthy backbone, toasted until it smells like home." },
  { name: "Black Mustard", note: "The pop and crackle of a tempered pan." },
  { name: "Curry Leaf", note: "Fried crisp for that green, citrus lift." },
  { name: "Asafoetida", note: "A pinch that ties every other note together." },
  { name: "Black Salt", note: "Mineral, savoury, faintly smoky — the moreish edge." },
];

// Heat ladder, mapped to the 1–3 spice level on product pages.
const heat = [
  { level: 1, label: "Mild", body: "Warmth, not fire. Aromatic and easy — built for everyone at the table." },
  { level: 2, label: "Medium", body: "A proper kick that builds slowly. Our most-loved register." },
  { level: 3, label: "Hot", body: "Bold and unapologetic, for the crowd that reaches for chilli first." },
];

export default function SpicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-32">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal>
              <p className="mb-3 font-display text-editorial italic text-crimson">
                The ameei spice philosophy
              </p>
              <h1 className="font-display text-display-hero tracking-tighter text-ink">
                Spice isn&apos;t heat.
                <br />
                <span className="font-light italic text-crimson">
                  It&apos;s memory.
                </span>
              </h1>
              <p className="mt-5 max-w-md font-body text-body-lg text-ash">
                We don&apos;t sell jars of spice — we sell what spice can do. Every
                ameei snack starts with whole spices, toasted and ground in small
                batches, so the flavour you taste is the flavour we built that
                morning.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href="/shop" variant="primary">
                  Taste It In The Snacks
                </ButtonLink>
                <ButtonLink href="/heritage" variant="secondary">
                  Our Heritage
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal direction="right">
              <PhotoSlot
                label="Whole spices, ginger and turmeric laid out before blending"
                src="/images/pages/spices-hero.jpg"
                ratio="aspect-[4/5]"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Method */}
      <section className="py-14 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="From whole spice to finished blend"
              title="How we build a blend"
              align="center"
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {method.map((m, i) => (
              <Reveal key={m.step} delay={i * 90}>
                <div className="h-full rounded-[1.25rem] border border-crimson/10 bg-white/70 p-6 shadow-spice backdrop-blur">
                  <span className="font-display text-headline-md text-saffron">
                    {m.step}
                  </span>
                  <h3 className="mt-2 font-display text-headline-md text-ink">
                    {m.title}
                  </h3>
                  <p className="mt-2 font-body text-body-md text-ash">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pantry */}
      <section className="bg-ember-mist py-14 md:py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <Reveal>
              <ChiliIcon size={36} className="mb-4 text-crimson" />
              <SectionHeading eyebrow="The pantry" title="Spices we reach for again and again" />
              <p className="mt-4 max-w-md font-body text-body-md text-ash">
                A handful of spices show up across the whole range — the quiet
                regulars that give an ameei mix its signature. Here&apos;s what
                they bring to the bowl.
              </p>
            </Reveal>
            <Reveal direction="right">
              <ul className="grid gap-3 sm:grid-cols-2">
                {pantry.map((p) => (
                  <li
                    key={p.name}
                    className="rounded-2xl border border-crimson/10 bg-white/80 p-4 shadow-sm"
                  >
                    <p className="font-display text-editorial text-ink">{p.name}</p>
                    <p className="mt-1 font-body text-body-sm text-ash">{p.note}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Heat ladder */}
      <section className="py-14 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Know your level"
              title="Three degrees of heat"
              align="center"
            />
            <p className="mx-auto mt-3 max-w-xl text-center font-body text-body-md text-ash">
              Every product carries a 1–3 spice rating, so you always know what
              you&apos;re walking into.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {heat.map((h, i) => (
              <Reveal key={h.level} delay={i * 90}>
                <div className="h-full rounded-[1.25rem] border border-crimson/10 bg-white/70 p-6 text-center shadow-spice backdrop-blur">
                  <div className="mb-3 flex items-center justify-center gap-1">
                    {Array.from({ length: 3 }).map((_, n) => (
                      <FlameIcon
                        key={n}
                        size={20}
                        className={n < h.level ? "text-crimson" : "text-crimson/20"}
                      />
                    ))}
                  </div>
                  <Badge tone={h.level === 3 ? "crimson" : "saffron"}>{h.label}</Badge>
                  <p className="mt-3 font-body text-body-md text-ash">{h.body}</p>
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
                The best way to understand our spice{" "}
                <span className="font-light italic text-amber-glow">
                  is to eat it.
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-md font-body text-body-md text-chalk/80">
                Every blend on this page is already at work in the snack range —
                roasted, tossed, and packed in small batches.
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
