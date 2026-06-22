import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { validateUpload, processToWebp, imageKey } from "@/lib/image";
import { ensureBucket, uploadImage } from "@/lib/s3";

export const runtime = "nodejs"; // sharp + AWS SDK need Node, not Edge

const MAX_FILES = 10;

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let files: File[];
  try {
    const form = await req.formData();
    files = form.getAll("files").filter((f): f is File => f instanceof File);
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Too many files (max ${MAX_FILES}).` },
      { status: 400 },
    );
  }

  for (const f of files) {
    const err = validateUpload(f);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }

  try {
    await ensureBucket();
    const urls = await Promise.all(
      files.map(async (f) => {
        const webp = await processToWebp(Buffer.from(await f.arrayBuffer()));
        return uploadImage(webp, imageKey(), "image/webp");
      }),
    );
    return NextResponse.json({ urls });
  } catch (e) {
    console.error("S3 upload failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 502 },
    );
  }
}
