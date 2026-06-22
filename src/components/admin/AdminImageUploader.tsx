"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/products";
import { CloseIcon } from "@/components/ui/icons";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const btnCls =
  "rounded-lg border border-ink/15 bg-white px-3 py-2 font-body text-body-sm text-ink hover:border-crimson disabled:opacity-50";
const inputCls =
  "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 font-body text-body-md text-ink outline-none focus:border-crimson";
const labelCls = "mb-1 block font-body text-body-sm font-semibold text-ink";

/** POST files to the admin upload route; returns their public URLs. */
async function upload(files: File[]): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");
  return data.urls as string[];
}

export function CardImageUploader({
  defaultSrc,
  defaultAlt,
}: {
  defaultSrc?: string;
  defaultAlt?: string;
}) {
  const [src, setSrc] = useState(defaultSrc ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const [url] = await upload([file]);
      setSrc(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <span className={labelCls}>Card image</span>
        {/* Server action reads this; seeded with the existing URL on edit. */}
        <input type="hidden" name="imageSrc" value={src} />
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="mb-2 h-32 w-32 rounded-lg border border-ink/10 object-cover"
          />
        )}
        <label className={`${btnCls} inline-block cursor-pointer`}>
          {busy ? "Uploading…" : src ? "Replace image" : "Upload image"}
          <input type="file" accept={ACCEPT} onChange={onPick} disabled={busy} hidden />
        </label>
        {error && <p className="mt-1 text-body-sm text-crimson">{error}</p>}
        {!src && <p className="mt-1 text-body-sm text-ash">Required.</p>}
      </div>
      <label className="block">
        <span className={labelCls}>Card image — alt text</span>
        <input name="imageAlt" defaultValue={defaultAlt} required className={inputCls} />
      </label>
    </div>
  );
}

export function GalleryUploader({ defaultImages }: { defaultImages?: ProductImage[] }) {
  const [images, setImages] = useState<ProductImage[]>(defaultImages ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hidden field value matches parseGallery() in actions.ts: "src | alt" per line.
  const serialized = images.map((g) => `${g.src} | ${g.alt}`).join("\n");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const urls = await upload(files);
      setImages((prev) => [...prev, ...urls.map((src) => ({ src, alt: "" }))]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const setAlt = (i: number, alt: string) =>
    setImages((prev) => prev.map((g, j) => (j === i ? { ...g, alt } : g)));
  const remove = (i: number) => setImages((prev) => prev.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) =>
    setImages((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div>
      <span className={labelCls}>Gallery</span>
      <span className="mb-2 block text-body-sm text-ash">
        First image is the main one. Add alt text for each.
      </span>
      <input type="hidden" name="gallery" value={serialized} />

      <div className="space-y-2">
        {images.map((g, i) => (
          <div
            key={`${g.src}-${i}`}
            className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.src} alt="" className="h-16 w-16 shrink-0 rounded object-cover" />
            <input
              value={g.alt}
              onChange={(e) => setAlt(i, e.target.value)}
              placeholder={i === 0 ? "Alt text (main)" : "Alt text"}
              className={inputCls}
            />
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={btnCls}>
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1}
                className={btnCls}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove image"
                className={`${btnCls} text-crimson`}
              >
                <CloseIcon size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <label className={`${btnCls} mt-2 inline-block cursor-pointer`}>
        {busy ? "Uploading…" : "Add gallery images"}
        <input type="file" accept={ACCEPT} multiple onChange={onPick} disabled={busy} hidden />
      </label>
      {error && <p className="mt-1 text-body-sm text-crimson">{error}</p>}
      {images.length === 0 && (
        <p className="mt-1 text-body-sm text-ash">Add at least one image.</p>
      )}
    </div>
  );
}
