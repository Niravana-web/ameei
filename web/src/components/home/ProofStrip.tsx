import { Container } from "@/components/ui/primitives";

const proofs = [
  "Roasted, never fried",
  "Nothing artificial",
  "Blended the week it ships",
  "Made and shipped in the US",
];

export function ProofStrip() {
  return (
    <section className="bg-ember py-8 text-chalk">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {proofs.map((p) => (
            <li key={p} className="flex items-center gap-2.5 font-body text-body-md font-medium">
              <span aria-hidden className="h-2 w-2 rounded-full bg-amber-glow" />
              {p}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
