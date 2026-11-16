import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

// Mirrors the first entries on /journal. Still "coming soon" there; keep in sync
// when real posts ship.
const posts = [
  {
    category: "Behind the batch",
    title: "What ‘small batch’ actually means here",
    excerpt: "How big a batch is, how often we roast one, and why we keep it that way.",
    img: "/images/pages/journal-kitchen.jpg",
  },
  {
    category: "Heat ladder",
    title: "Reading a spice rating",
    excerpt: "No spice, medium, extra hot: what each rung feels like, and how to pick one for the room.",
    img: "/images/pages/journal-curry.jpg",
  },
];

export function JournalTeaser() {
  return (
    <section id="journal" className="scroll-mt-28 pb-20 md:pb-28">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <Reveal>
            <p className="mb-2 font-body text-label-caps uppercase text-crimson">Journal</p>
            <h2 className="font-display text-headline-lg tracking-tight text-ink">
              Notes from the roaster.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/journal"
              className="group inline-flex items-center gap-2 font-body text-label-caps uppercase text-crimson-deep hover:text-crimson"
            >
              All posts
              <ArrowRightIcon
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
        <ul className="grid gap-5 md:grid-cols-2">
          {posts.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 110}>
              <Link
                href="/journal"
                className="hover-lift flex items-center gap-5 rounded-card border border-crimson/10 bg-white p-4 shadow-spice"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#f7e4cf] md:h-32 md:w-32">
                  <Image src={p.img} alt="" fill sizes="128px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="mb-1.5 font-body text-label-caps uppercase text-ash">
                    {p.category} · Coming soon
                  </p>
                  <h3 className="font-display text-headline-md text-ink">{p.title}</h3>
                  <p className="mt-1.5 font-body text-body-md text-ash">{p.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
