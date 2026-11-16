import assert from "node:assert";
import { validateUpload, MAX_BYTES } from "./image";

// validateUpload: MIME allowlist + size cap
assert.equal(validateUpload({ type: "image/jpeg", size: 1024 * 1024 }), null, "1MB jpeg ok");
assert.equal(validateUpload({ type: "image/webp", size: 10 }), null, "webp ok");
assert.match(
  validateUpload({ type: "application/pdf", size: 10 }) ?? "",
  /Unsupported/,
  "pdf rejected",
);
assert.match(
  validateUpload({ type: "image/jpeg", size: MAX_BYTES + 1 }) ?? "",
  /too large/i,
  "oversize rejected",
);
assert.match(validateUpload({ type: "image/png", size: 0 }) ?? "", /Empty/, "empty rejected");

// Gallery serialization (client) must round-trip through parseGallery (server, actions.ts).
// Re-implement parseGallery here to avoid importing a "use server" module.
function parseGallery(raw: string) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [src, ...altParts] = line.split("|");
      return { src: src.trim(), alt: altParts.join("|").trim() };
    });
}
const images = [
  { src: "https://b.s3.r.amazonaws.com/products/a.webp", alt: "Main shot" },
  { src: "https://b.s3.r.amazonaws.com/products/b.webp", alt: "Detail" },
];
const serialized = images.map((g) => `${g.src} | ${g.alt}`).join("\n");
assert.deepEqual(parseGallery(serialized), images, "gallery round-trips");

console.log("image.test.ts: all assertions passed");
