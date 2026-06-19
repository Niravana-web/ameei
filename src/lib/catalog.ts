import "server-only";
import { prisma } from "@/lib/prisma";
import type {
  Product,
  ProductImage,
  Weight,
  SpiceLevel,
  Category,
  Badge,
} from "@/lib/products";
import type { Product as Row } from "@prisma/client";

/** Map a DB row (JSON-string columns) to the typed Product the UI expects. */
export function rowToProduct(row: Row): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    weights: JSON.parse(row.weights) as Weight[],
    defaultWeight: row.defaultWeight,
    category: row.category as Category,
    spiceLevel: row.spiceLevel as SpiceLevel,
    badge: (row.badge as Badge | null) ?? undefined,
    image: JSON.parse(row.image) as ProductImage,
    gallery: JSON.parse(row.gallery) as ProductImage[],
    ingredients: row.ingredients,
    nutrition: row.nutrition,
    shipping: row.shipping,
  };
}

const PUBLISHED = { published: true } as const;
const ORDER = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ where: PUBLISHED, orderBy: ORDER });
  return rows.map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row && row.published ? rowToProduct(row) : undefined;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { ...PUBLISHED, featured: true },
    orderBy: ORDER,
    take: 3,
  });
  // Fall back to first 3 published if nothing is flagged featured.
  if (rows.length) return rows.map(rowToProduct);
  return (await getAllProducts()).slice(0, 3);
}

export async function getRelatedProducts(slug: string, count = 3): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { ...PUBLISHED, slug: { not: slug } },
    orderBy: ORDER,
    take: count,
  });
  return rows.map(rowToProduct);
}
