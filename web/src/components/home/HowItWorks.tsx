import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Pick from the pantry",
    body: "Three nuts, three cereals, six extras. Take as many as you like, or just one. One price whatever you choose.",
  },
  {
    n: "02",
    title: "Set the heat and the salt",
    body: "No spice, medium, or extra hot. No salt, less, or some. Most people stop at less salt and climb the heat ladder one pouch at a time.",
  },
  {
    n: "03",
    title: "We roast, blend and ship",
    body: "Your pouch is roasted and sealed within 24 hours of the order, then shipped anywhere in the US. Your recipe is saved for next time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-28 py-16 md:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="mb-2 font-body text-label-caps uppercase text-crimson">How it works</p>
            <h2 className="font-display text-display-hero tracking-tighter text-ink">
              Three choices.
              <br />
              <span className="font-light italic text-crimson-deep">Then we get roasting.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md font-body text-body-lg text-ash">
              No shelf of flavors to scroll through. Every pouch starts empty and ends up exactly
              how you ordered it.
            </p>
          </Reveal>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 110}>
              <article className="hover-lift flex h-full flex-col gap-4 rounded-card border border-crimson/10 bg-white p-7 shadow-spice">
                <span className="font-display text-4xl font-black tracking-tighter text-crimson">
                  {s.n}
                </span>
                <h3 className="font-display text-headline-md text-ink">{s.title}</h3>
                <p className="font-body text-body-md text-ash">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
