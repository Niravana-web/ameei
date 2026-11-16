import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rowToProduct } from "@/lib/catalog";
import { defaultPrice, getCategoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const rows = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-headline-lg text-ink">
          Products <span className="text-ash">({rows.length})</span>
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-crimson px-5 py-2 font-body text-label-caps uppercase text-white"
        >
          + Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full border-collapse text-left font-body text-body-md">
          <thead className="bg-chalk text-body-sm uppercase tracking-wide text-ash">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const p = rowToProduct(row);
              return (
                <tr key={row.id} className="border-t border-ink/10">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{p.name}</div>
                    <div className="text-body-sm text-ash">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/80">{getCategoryLabel(p.category)}</td>
                  <td className="px-4 py-3 text-ink/80">{formatPrice(defaultPrice(p))}</td>
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-body-sm ${
                          row.published
                            ? "bg-success/15 text-success"
                            : "bg-ash/15 text-ash"
                        }`}
                      >
                        {row.published ? "Published" : "Draft"}
                      </span>
                      {row.featured && (
                        <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-body-sm text-saffron">
                          Featured
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${row.id}`}
                        className="text-crimson hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteProduct.bind(null, row.id)}>
                        <button
                          type="submit"
                          className="text-ash hover:text-crimson"
                          aria-label={`Delete ${p.name}`}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ash">
                  No products yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
