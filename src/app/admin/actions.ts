"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Defense in depth: actions are directly invocable, so re-check the role here too
// (not only in the layout).
async function requireAdmin() {
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;
  if (role !== "admin") throw new Error("Forbidden: admin role required.");
}

const imageSchema = z.object({ src: z.string().min(1), alt: z.string().min(1) });

const productSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes."),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(["savory-mixes", "roasted-nuts", "spice-blends"]),
  spiceLevel: z.coerce.number().int().min(1).max(3),
  badge: z.enum(["BESTSELLER", "NEW"]).nullable(),
  image: imageSchema,
  gallery: z.array(imageSchema).min(1, "Add at least one gallery image."),
  weights: z
    .array(z.object({ label: z.string().min(1), price: z.number().positive() }))
    .min(1, "Add at least one weight/price."),
  defaultWeight: z.string().min(1),
  ingredients: z.string().min(1),
  nutrition: z.string().min(1),
  shipping: z.string().min(1),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

/** Parse one-per-line "label,price" into weights. */
function parseWeights(raw: string) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, price] = line.split(",").map((s) => s.trim());
      return { label, price: Number(price) };
    });
}

/** Parse one-per-line "src | alt" into images. */
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

function readForm(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const parsed = productSchema.parse({
    slug: get("slug"),
    name: get("name"),
    tagline: get("tagline"),
    description: get("description"),
    category: get("category"),
    spiceLevel: get("spiceLevel"),
    badge: get("badge") === "" ? null : get("badge"),
    image: { src: get("imageSrc"), alt: get("imageAlt") },
    gallery: parseGallery(get("gallery")),
    weights: parseWeights(get("weights")),
    defaultWeight: get("defaultWeight"),
    ingredients: get("ingredients"),
    nutrition: get("nutrition"),
    shipping: get("shipping"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sortOrder: get("sortOrder") || "0",
  });

  // The default weight must be one of the listed weights.
  if (!parsed.weights.some((w) => w.label === parsed.defaultWeight)) {
    throw new Error(
      `Default weight "${parsed.defaultWeight}" is not in the weights list.`,
    );
  }

  return {
    slug: parsed.slug,
    name: parsed.name,
    tagline: parsed.tagline,
    description: parsed.description,
    category: parsed.category,
    spiceLevel: parsed.spiceLevel,
    badge: parsed.badge,
    image: JSON.stringify(parsed.image),
    gallery: JSON.stringify(parsed.gallery),
    weights: JSON.stringify(parsed.weights),
    defaultWeight: parsed.defaultWeight,
    ingredients: parsed.ingredients,
    nutrition: parsed.nutrition,
    shipping: parsed.shipping,
    featured: parsed.featured,
    published: parsed.published,
    sortOrder: parsed.sortOrder,
  };
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/shop/${slug}`);
}

export type FormState = { error?: string };

function toMessage(e: unknown): string {
  if (e instanceof z.ZodError) {
    return e.issues.map((i) => `${i.path.join(".") || "field"}: ${i.message}`).join("; ");
  }
  if (e instanceof Error) {
    if (e.message.includes("Unique constraint")) return "That slug is already in use.";
    return e.message;
  }
  return "Something went wrong.";
}

export async function createProduct(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  let data: ReturnType<typeof readForm>;
  try {
    data = readForm(formData);
    await prisma.product.create({ data });
  } catch (e) {
    return { error: toMessage(e) };
  }
  revalidateStorefront(data.slug);
  redirect("/admin"); // throws NEXT_REDIRECT — must stay outside the try/catch
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  let data: ReturnType<typeof readForm>;
  try {
    data = readForm(formData);
    await prisma.product.update({ where: { id }, data });
  } catch (e) {
    return { error: toMessage(e) };
  }
  revalidateStorefront(data.slug);
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const row = await prisma.product.delete({ where: { id } });
  revalidateStorefront(row.slug);
}
