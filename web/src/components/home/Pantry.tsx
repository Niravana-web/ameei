import Image from "next/image";
import { Container, NoiseOverlay } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { STUDIO_GROUPS } from "@/lib/studio";

export function Pantry() {
  const groups = STUDIO_GROUPS.filter((g) => g.countsTowardMix);
  const total = groups.reduce((n, g) => n + g.options.length, 0);

  return (
    <section className="pb-16 md:pb-24">
      <Container>
        <div className="grid items-stretch gap-10 md:grid-cols-2">
          <Reveal direction="left">
            <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-[#f7e4cf] shadow-spice md:h-full md:min-h-[460px]">
              <NoiseOverlay className="z-10" />
              <Image
                src="/images/products/spicy-crunch-detail-1.jpg"
                alt="Close-up of roasted peanuts, cashews and cereal flakes"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="flex flex-col justify-center gap-7">
            <Reveal>
              <p className="mb-2 font-body text-label-caps uppercase text-crimson">The pantry</p>
              <h2 className="font-display text-display-hero tracking-tighter text-ink">
                {numberWord(total)} ingredients.
                <br />
                <span className="font-light italic text-crimson-deep">Thousands of pouches.</span>
              </h2>
              <p className="mt-4 max-w-md font-body text-body-lg text-ash">
                Everything is dry-roasted in small batches. Nothing is fried, colored or preserved.
              </p>
            </Reveal>

            <div className="flex flex-col gap-5">
              {groups.map((g, i) => (
                <Reveal key={g.id} delay={120 + i * 90}>
                  <p className="mb-2 font-body text-label-caps uppercase text-ash">{g.label}</p>
                  <ul className="flex flex-wrap gap-2">
                    {g.options.map((o) => (
                      <li
                        key={o.id}
                        className="rounded-full border border-ink/10 bg-white px-3.5 py-2 font-body text-body-md font-medium text-ink"
                      >
                        {o.label}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <p className="font-body text-body-md text-ash/80">
              Made in a kitchen that handles peanuts and tree nuts.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function numberWord(n: number): string {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen"];
  return words[n] ?? String(n);
}
