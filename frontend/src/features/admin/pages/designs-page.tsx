import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Palette, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import type { AdminDesign } from "@/features/admin/api/admin.api";
import type { AdminProduct } from "@/features/admin/api/products.api";
import { useDeleteAdminDesign, useSaveAdminDesign } from "@/features/admin/hooks/use-admin-mutations";
import { useAdminDesigns, useAdminProducts } from "@/features/admin/hooks/use-admin-queries";
import { designSchema, type DesignValues } from "@/features/admin/schemas/design-schema";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FormField } from "@/shared/components/ui/form-field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

function DesignFormPanel({
  design,
  products,
  onClose,
}: {
  design: AdminDesign | null;
  products: AdminProduct[];
  onClose: () => void;
}) {
  const [term, setTerm] = useState("");
  const save = useSaveAdminDesign();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DesignValues>({
    resolver: zodResolver(designSchema),
    defaultValues: {
      name: design?.name ?? "",
      description: design?.description ?? "",
      productIds: design?.productIds ?? [],
      active: design?.active ?? true,
    },
  });

  const productIds = watch("productIds");
  const active = watch("active");

  const visibleProducts = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) => product.name.toLowerCase().includes(needle));
  }, [products, term]);

  function toggleProduct(id: string) {
    setValue(
      "productIds",
      productIds.includes(id) ? productIds.filter((value) => value !== id) : [...productIds, id],
      { shouldValidate: true },
    );
  }

  const submit = handleSubmit((values) => {
    save.mutate(
      {
        id: design?.id,
        input: {
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
          active: values.active,
          productIds: values.productIds,
        },
      },
      { onSuccess: onClose },
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {design ? "Edit design" : "New design"}
            </p>
            <p className="display mt-1 text-2xl font-bold">{design ? design.name : "Add a print design"}</p>
            <p className="mt-1 text-xs text-neutral-500">Group the products that share this print.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 hover:bg-neutral-50"
            aria-label="Close design form"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto px-6 py-5">
          <FormField id="design-name" label="Name" error={errors.name?.message}>
            <Input
              id="design-name"
              placeholder="e.g. Everest Line"
              className="rounded-xl border-neutral-200 bg-white focus-visible:border-lime-400"
              {...register("name")}
            />
          </FormField>

          <div className="mt-5">
            <FormField id="design-description" label="Description" optional error={errors.description?.message}>
              <Textarea
                id="design-description"
                rows={3}
                placeholder="The story or inspiration behind this print"
                className="min-h-0 rounded-xl border-neutral-200 bg-white focus-visible:border-lime-400"
                {...register("description")}
              />
            </FormField>
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
            <Checkbox checked={active} onCheckedChange={(value) => setValue("active", value === true)} />
            <span>
              <span className="block text-xs font-bold">Active</span>
              <span className="mt-0.5 block text-[10px] text-neutral-400">Inactive designs stay hidden from the storefront.</span>
            </span>
          </label>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-bold">Products</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {productIds.length} selected
              </span>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search products"
                aria-label="Search products for this design"
                className="w-full rounded-full border-neutral-200 py-2.5 pl-9 pr-4 text-xs focus:border-lime-400 focus:ring-lime-300"
              />
            </div>
            <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-neutral-200">
              {visibleProducts.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-neutral-500">
                  {products.length ? "No products match that search." : "No products yet — add one first."}
                </p>
              ) : (
                visibleProducts.map((product) => {
                  const checked = productIds.includes(product.id);
                  return (
                    <label
                      key={product.id}
                      className="flex cursor-pointer items-center gap-3 border-b border-neutral-100 px-4 py-3 last:border-0 hover:bg-neutral-50"
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleProduct(product.id)} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold">{product.name}</span>
                        <span className="mt-0.5 block text-[10px] text-neutral-400">
                          {product.category} · {product.stock} in stock
                        </span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            <p className="mt-1.5 text-[10px] leading-4 text-neutral-400">
              A product can belong to more than one design.
            </p>
          </div>

          <div className="mt-auto border-t border-neutral-100 pt-5">
            <button
              type="submit"
              disabled={save.isPending}
              className="w-full rounded-full bg-neutral-950 px-5 py-3.5 text-xs font-bold text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : design ? "Save changes" : "Create design"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DesignsPage() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminDesign | "new" | null>(null);

  const designs = useAdminDesigns();
  const products = useAdminProducts();
  const remove = useDeleteAdminDesign();

  const productRows = products.data ?? [];
  const rows = designs.data ?? [];
  const activeCount = rows.filter((design) => design.active).length;
  const linkedProducts = new Set(rows.flatMap((design) => design.productIds)).size;

  const productNames = useMemo(
    () => new Map(productRows.map((product) => [product.id, product.name])),
    [productRows],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    const names = rows.map((design) => design.productIds.map((id) => productNames.get(id) ?? "").join(" "));
    return rows.filter((design, index) =>
      [design.name, design.description, names[index]].some((value) => value.toLowerCase().includes(term)),
    );
  }, [rows, productNames, search]);

  function confirmDelete(design: AdminDesign) {
    const confirmed = window.confirm(
      `Delete "${design.name}"?\n\nThe print grouping is removed, but its products stay in the catalogue. This cannot be undone.`,
    );
    if (confirmed) remove.mutate(design.id);
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Print library</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            Designs<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Group products by print and keep the story behind each drop.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => designs.refetch()}
            disabled={designs.isFetching}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
          >
            <RefreshCw size={14} className={designs.isFetching ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-neutral-800"
          >
            <Plus size={15} /> New design
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Designs", value: rows.length, icon: Palette, tone: "bg-lime-100 text-lime-700" },
          { label: "Active", value: activeCount, icon: Pencil, tone: "bg-emerald-50 text-emerald-700" },
          { label: "Products linked", value: linkedProducts, icon: Link2, tone: "bg-neutral-100 text-neutral-700" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">{label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></span>
            </div>
            <p className="display mt-4 text-3xl font-bold">{designs.isLoading ? "—" : value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search designs or products"
            aria-label="Search designs"
            className="w-full rounded-full border-neutral-200 py-2.5 pl-9 pr-4 text-xs focus:border-lime-400 focus:ring-lime-300"
          />
        </div>

        {designs.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : designs.isError ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
            <p className="text-sm font-bold">Designs could not load.</p>
            <p className="mt-1 text-xs text-neutral-500">Your session may have expired. Try refreshing.</p>
            <button
              type="button"
              onClick={() => designs.refetch()}
              className="mt-4 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center">
            <p className="text-sm font-bold">{rows.length ? "No designs match that search." : "No designs yet."}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {rows.length ? "Try another name or product." : "Create a design to group your prints."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                <tr>
                  {["Design", "Products", "Status", "Actions"].map((heading) => (
                    <th className="pb-3 font-semibold" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((design) => {
                  const names = design.productIds
                    .map((id) => productNames.get(id))
                    .filter((name): name is string => Boolean(name));
                  const preview = names.slice(0, 2).join(", ");
                  return (
                    <tr key={design.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70">
                      <td className="py-3.5">
                        <p className="font-bold">{design.name}</p>
                        <p className="mt-0.5 max-w-md truncate text-[10px] text-neutral-400">
                          {design.description || "No description"}
                        </p>
                      </td>
                      <td className="py-3.5">
                        <p className="font-semibold">
                          {design.productIds.length} {design.productIds.length === 1 ? "product" : "products"}
                        </p>
                        <p className="mt-0.5 max-w-[260px] truncate text-[10px] text-neutral-400">
                          {preview || "No products linked"}
                          {names.length > 2 ? ` +${names.length - 2}` : ""}
                        </p>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            design.active ? "bg-lime-100 text-lime-700" : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {design.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            title="Edit design"
                            onClick={() => setEditing(design)}
                            className="rounded-lg border p-2 transition hover:bg-neutral-50"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            title="Delete design"
                            disabled={remove.isPending && remove.variables === design.id}
                            onClick={() => confirmDelete(design)}
                            className="rounded-lg border p-2 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={13} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <DesignFormPanel
          design={editing === "new" ? null : editing}
          products={productRows}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
