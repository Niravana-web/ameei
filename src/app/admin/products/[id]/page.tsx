import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rowToProduct } from "@/lib/catalog";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id } });
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-headline-lg text-ink">
        Edit — {row.name}
      </h1>
      <ProductForm
        action={updateProduct.bind(null, row.id)}
        product={rowToProduct(row)}
        featured={row.featured}
        published={row.published}
        sortOrder={row.sortOrder}
      />
    </div>
  );
}
