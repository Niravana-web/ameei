import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createMix } from "@/lib/mixes";
import { STUDIO_PRODUCT_NAME } from "@/lib/studio";

// Deliberately NOT sign-in gated: the cart already lets anyone build up an order
// and only /api/checkout requires auth. Putting the wall in front of the Studio
// would gate the fun part. userId is attached opportunistically when present.

const bodySchema = z.object({
  selection: z.object({
    weight: z.string().max(16),
    nuts: z.array(z.string().max(40)).max(20).optional(),
    cereals: z.array(z.string().max(40)).max(20).optional(),
    extras: z.array(z.string().max(40)).max(20).optional(),
    spice: z.string().max(40).optional(),
    salt: z.string().max(40).optional(),
  }),
});

export async function POST(req: Request) {
  const { userId } = await auth();

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mix." }, { status: 400 });
  }

  try {
    // createMix normalizes and validates; unknown ingredients are dropped and an
    // empty or malformed mix throws with a customer-readable message.
    const mix = await createMix({ selection: parsed.data.selection, userId });
    return NextResponse.json({
      code: mix.code,
      weight: mix.weight,
      summary: mix.summary,
      unitPriceCents: mix.priceCents,
      name: STUDIO_PRODUCT_NAME,
    });
  } catch (e) {
    console.error("Saving custom mix failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save your mix." },
      { status: 400 },
    );
  }
}
