import Image from "next/image";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export function BrandStory() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <Reveal direction="left">
            <div className="relative h-[360px] overflow-hidden rounded-b-[32px] rounded-t-full border-[6px] border-white shadow-2xl md:h-[480px]">
              <Image
                src="/images/products/brand-story.jpg"
                alt="Hands tossing a mixture of roasted nuts, dried fruits, and spices in an antique brass basin, spice dust caught in a sunbeam"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ember/80 to-transparent" />
            </div>
          </Reveal>

          <div className="mt-10 space-y-4 md:mt-0 md:pl-12">
            <Reveal>
              <h2 className="font-display text-display-hero tracking-tighter text-ember">
                From our
                <br />
                kitchen
                <br />
                <span className="font-light italic text-saffron">to yours.</span>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="font-body text-body-lg text-ash">
                We believe that snacking is a ritual. It&apos;s not just about
                filling a craving; it&apos;s about savoring history, texture,
                and uncompromising flavor. Our family recipes have been refined
                over generations to deliver the perfect crunch, every single
                time.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <p className="font-accent text-2xl text-crimson">
                crunch with a little bit of spice
              </p>
            </Reveal>
            <Reveal delay={380} direction="scale">
              <div className="pt-2">
                <Image
                  src="/images/badge.png"
                  alt="ameei badge"
                  width={64}
                  height={64}
                  className="animate-float-drift opacity-80 mix-blend-multiply grayscale"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
