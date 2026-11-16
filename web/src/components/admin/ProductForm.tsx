"use client";

import { useActionState } from "react";
import type { Product } from "@/lib/products";
import { categories } from "@/lib/products";
import type { FormState } from "@/app/admin/actions";
import { CardImageUploader, GalleryUploader } from "@/components/admin/AdminImageUploader";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

const inputCls =
  "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 font-body text-body-md text-ink outline-none focus:border-crimson";
const labelCls = "mb-1 block font-body text-body-sm font-semibold text-ink";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {hint && <span className="mb-1 block text-body-sm text-ash">{hint}</span>}
      {children}
    </label>
  );
}

export function ProductForm({
  action,
  product,
  featured = false,
  published = true,
  sortOrder = 0,
}: {
  action: Action;
  product?: Product;
  // Admin-only flags not present on the public Product type — passed from the edit page.
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const weightsText = product?.weights.map((w) => `${w.label},${w.price}`).join("\n");

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      {state.error && (
        <p className="rounded-lg border border-crimson/30 bg-crimson/5 px-4 py-3 font-body text-body-sm text-crimson">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" defaultValue={product?.name} required className={inputCls} />
        </Field>
        <Field label="Slug" hint="lowercase-with-dashes">
          <input name="slug" defaultValue={product?.slug} required className={inputCls} />
        </Field>
      </div>

      <Field label="Tagline">
        <input name="tagline" defaultValue={product?.tagline} required className={inputCls} />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          defaultValue={product?.description}
          required
          rows={4}
          className={inputCls}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Category">
          <select name="category" defaultValue={product?.category} className={inputCls}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Spice level">
          <select name="spiceLevel" defaultValue={product?.spiceLevel ?? 1} className={inputCls}>
            <option value={1}>1 — mild</option>
            <option value={2}>2 — medium</option>
            <option value={3}>3 — hot</option>
          </select>
        </Field>
        <Field label="Badge">
          <select name="badge" defaultValue={product?.badge ?? ""} className={inputCls}>
            <option value="">None</option>
            <option value="BESTSELLER">Bestseller</option>
            <option value="NEW">New</option>
          </select>
        </Field>
      </div>

      <Field
        label="Weights & prices"
        hint='One per line: "label,price" — e.g. 300g,12'
      >
        <textarea
          name="weights"
          defaultValue={weightsText}
          required
          rows={3}
          placeholder={"150g,9.5\n300g,16"}
          className={`${inputCls} font-mono`}
        />
      </Field>

      <Field label="Default weight" hint="Must match one label above (e.g. 300g)">
        <input
          name="defaultWeight"
          defaultValue={product?.defaultWeight}
          required
          className={inputCls}
        />
      </Field>

      <CardImageUploader defaultSrc={product?.image.src} defaultAlt={product?.image.alt} />

      <GalleryUploader defaultImages={product?.gallery} />

      <Field label="Ingredients">
        <textarea name="ingredients" defaultValue={product?.ingredients} required rows={3} className={inputCls} />
      </Field>
      <Field label="Nutrition / allergens">
        <textarea name="nutrition" defaultValue={product?.nutrition} required rows={2} className={inputCls} />
      </Field>
      <Field label="Shipping">
        <textarea name="shipping" defaultValue={product?.shipping} required rows={2} className={inputCls} />
      </Field>

      <div className="grid items-end gap-5 sm:grid-cols-3">
        <Field label="Sort order" hint="lower = earlier">
          <input name="sortOrder" type="number" defaultValue={sortOrder} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 font-body text-body-md text-ink">
          <input type="checkbox" name="featured" defaultChecked={featured} />
          Featured on home
        </label>
        <label className="flex items-center gap-2 font-body text-body-md text-ink">
          <input type="checkbox" name="published" defaultChecked={published} />
          Published
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-crimson px-7 py-2.5 font-body text-label-caps uppercase text-white transition-opacity disabled:opacity-50"
        >
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        <a
          href="/admin"
          className="rounded-full border border-ink/15 px-7 py-2.5 font-body text-label-caps uppercase text-ink/70"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
