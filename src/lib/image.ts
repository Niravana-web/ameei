import sharp from "sharp";

export const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_BYTES = 10 * 1024 * 1024; // 10MB

/** Validate an uploaded file. Returns an error message, or null if OK. */
export function validateUpload(file: { type: string; size: number }): string | null {
  if (!ACCEPTED.includes(file.type)) {
    return `Unsupported type "${file.type || "unknown"}". Use JPEG, PNG, WebP, or AVIF.`;
  }
  if (file.size > MAX_BYTES) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 10MB.`;
  }
  if (file.size === 0) return "Empty file.";
  return null;
}

/** Auto-orient, cap width at 1600px, strip metadata, output WebP. */
export async function processToWebp(buf: Buffer): Promise<Buffer> {
  return sharp(buf)
    .rotate() // respect EXIF orientation before stripping metadata
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

/** Random, collision-free S3 key. Client filename is ignored on purpose. */
export function imageKey(): string {
  return `products/${crypto.randomUUID()}.webp`;
}
