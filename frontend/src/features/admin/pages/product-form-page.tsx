import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { productSchema, type ProductFormValues } from "@/features/admin/schemas/product-schema";
import { useCreateAdminProduct, useUpdateAdminProduct } from "@/features/admin/hooks/use-admin-mutations";
import { useAdminProduct } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/shared/components/ui/button";

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const productQuery = useAdminProduct(id ?? "");
  const product = productQuery.data;
  const createProduct = useCreateAdminProduct();
  const updateProduct = useUpdateAdminProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "T-Shirts",
      price: 0,
      stock: 0,
      description: "",
      image: "",
      badge: "",
      active: true,
    },
  });

  // Fill the form once per product, without clobbering later edits.
  const loadedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!product || loadedRef.current === product.id) return;
    loadedRef.current = product.id;
    reset({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      image: product.images[0] ?? "",
      badge: product.tag ?? "",
      active: product.active,
    });
  }, [product, reset]);

  const submitProduct = handleSubmit((values) => {
    const image = values.image.trim();
    const badge = values.badge?.trim() || undefined;
    const done = { onSuccess: () => navigate("/admin/products") };

    if (product) {
      // Pass the variant grid through untouched so stock never changes here.
      updateProduct.mutate(
        {
          id: product.id,
          patch: {
            name: values.name,
            category: values.category,
            price: Math.round(values.price),
            description: values.description,
            badge,
            active: values.active,
            images: image ? [image] : [],
            variants: product.variants,
          },
        },
        done,
      );
      return;
    }

    createProduct.mutate(
      {
        id: `rv-${Date.now()}`,
        name: values.name,
        category: values.category,
        price: Math.round(values.price),
        description: values.description,
        badge,
        image,
        images: image ? [image] : [],
        active: values.active,
        stock: values.stock,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White"],
      },
      done,
    );
  });

  const field = "mt-1.5 w-full rounded-xl border-neutral-200 bg-white text-sm focus:border-lime-400 focus:ring-lime-300";

  if (editing && productQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-neutral-100" />
          <div className="h-10 w-64 rounded bg-neutral-100" />
          <div className="h-96 rounded-2xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  if (editing && (productQuery.isError || !product)) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-neutral-300 px-6 py-14 text-center">
        <p className="text-sm font-bold">That product could not be loaded.</p>
        <p className="mt-1 text-xs text-neutral-500">It may have been deleted.</p>
        <Link
          to="/admin/products"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-xs font-bold text-white"
        >
          <ArrowLeft size={14} /> Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black"
      >
        <ArrowLeft size={13} /> Back to products
      </Link>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          {editing ? "Edit product" : "New product"}
        </p>
        <h1 className="display mt-2 text-4xl font-bold uppercase">
          {editing ? "Update" : "Add"} product<span className="text-lime-600">.</span>
        </h1>
        {editing && product && (
          <Link
            to={`/product/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 underline underline-offset-4 hover:text-black"
          >
            /product/{product.slug} <ExternalLink size={12} />
          </Link>
        )}
      </div>

      <form
        onSubmit={submitProduct}
        className="mt-7 space-y-5 rounded-2xl bg-white p-6 shadow-sm"
        noValidate
      >
        <div>
          <label htmlFor="name" className="text-xs font-bold">Product name</label>
          <input id="name" {...register("name")} className={field} placeholder="e.g. Midnight Graphic Tee" />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="text-xs font-bold">Category</label>
            <select id="category" {...register("category")} className={field}>
              <option>T-Shirts</option>
              <option>Hoodies</option>
              <option>Jackets</option>
              <option>Accessories</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="text-xs font-bold">Price (NPR)</label>
            <input id="price" type="number" min={1} step={1} {...register("price", { valueAsNumber: true })} className={field} />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="image" className="text-xs font-bold">Image URL</label>
          <input id="image" {...register("image")} className={field} placeholder="https://..." />
          <p className="mt-1 text-[11px] text-neutral-400">
            Paste a direct link to the photo. Leave it empty to use the category placeholder image.
          </p>
          {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image.message}</p>}
        </div>

        <div>
          <label htmlFor="badge" className="text-xs font-bold">Badge <span className="font-normal text-neutral-400">(optional)</span></label>
          <input id="badge" {...register("badge")} className={field} placeholder="New, Limited, Bestseller…" />
          <p className="mt-1 text-[11px] text-neutral-400">Shown on the product card. Maximum 16 characters.</p>
          {errors.badge && <p className="mt-1 text-xs text-red-600">{errors.badge.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="text-xs font-bold">Description</label>
          <textarea id="description" rows={4} {...register("description")} className={field} placeholder="Describe the fit, fabric and print..." />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
        </div>

        {!editing && (
          <div>
            <label htmlFor="stock" className="text-xs font-bold">Opening stock quantity</label>
            <input
              id="stock"
              type="number"
              min={0}
              step={1}
              {...register("stock", { valueAsNumber: true })}
              className={field}
            />
            <p className="mt-1 text-[11px] text-neutral-400">
              Split evenly across the default colour and size variants (4 colours × 4 sizes).
            </p>
            {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>}
          </div>
        )}

        <label className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <input
            type="checkbox"
            {...register("active")}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-lime-500"
          />
          <span>
            <span className="block text-xs font-bold">Published to the storefront</span>
            <span className="mt-0.5 block text-[11px] leading-5 text-neutral-500">
              {editing
                ? "Unpublish to hide it from the shop while keeping its history and stock."
                : "Customers can see it as soon as it is saved."}
            </span>
          </span>
        </label>

        <div className="flex justify-end gap-3 border-t pt-5">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || createProduct.isPending || updateProduct.isPending}>
            {createProduct.isPending || updateProduct.isPending
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Save product"}
          </Button>
        </div>

        <p className="text-[10px] leading-5 text-neutral-400">
          {editing
            ? "Name, price, photo, badge and publishing status update immediately. Colour, size and stock are left exactly as they are — stock changes live in inventory adjustments."
            : "Saved straight to the live catalogue. Stock is divided across the default variants and can be adjusted later."}
        </p>
      </form>
    </div>
  );
}
