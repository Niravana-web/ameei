import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-headline-lg text-ink">Add product</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
