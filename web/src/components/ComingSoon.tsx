import { Container, ButtonLink, NoiseOverlay } from "@/components/ui/primitives";
import { ChiliIcon } from "@/components/ui/icons";

/** Branded placeholder for routes that are on the roadmap. */
export function ComingSoon({
  title,
  italic,
  blurb,
}: {
  title: string;
  italic: string;
  blurb: string;
}) {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center pb-16 pt-24">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-crimson/10 bg-white/70 p-8 text-center shadow-spice backdrop-blur-xl md:p-14">
        <NoiseOverlay />
        <div className="relative z-10">
          <ChiliIcon
            size={40}
            className="animate-float-drift mx-auto mb-6 text-crimson"
          />
          <h1 className="animate-drop-in mb-3 font-display text-headline-lg text-ink">
            {title}{" "}
            <span className="font-light italic text-crimson">{italic}</span>
          </h1>
          <p className="animate-fade-up delay-2 mx-auto mb-4 max-w-md font-body text-body-md text-ash">
            {blurb}
          </p>
          <p className="animate-fade-up delay-3 mb-8 font-accent text-xl text-terracotta">
            something is simmering…
          </p>
          <div className="animate-fade-up delay-4">
            <ButtonLink href="/shop" variant="secondary">
              Shop the Range Instead
            </ButtonLink>
          </div>
        </div>
      </div>
    </Container>
  );
}
