import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Newsletter capture. No auth, no rate limit (yet) — the honeypot `website`
// field catches the dumbest bots, and the upsert makes repeat submits harmless.

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  source: z.string().trim().max(32).optional(),
  // Honeypot: hidden in the UI, must stay empty. Bots that fill every input get a 400.
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const { email } = parsed.data;
  const source = parsed.data.source || "footer";

  try {
    // Idempotent: an existing subscriber keeps their original row and source.
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email, source },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Newsletter subscribe failed:", e);
    return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
  }
}
