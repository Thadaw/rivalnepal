import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, RefreshCw } from "lucide-react";
import type { AdminProduct } from "@/features/admin/api/products.api";
import { useAdminProducts } from "@/features/admin/hooks/use-admin-queries";
import { useDeleteAdminProduct } from "@/features/admin/hooks/use-admin-mutations";
import { stockStatus, stockStatusLabel, stockStatusTone } from "@/shared/lib/inventory";
import { formatNPR } from "@/shared/lib/utils";

export function ProductsPage() {
  const [search, setSearch] = useState("");

  const { data = [], isLoading, isError, isFetching, refetch } = useAdminProducts();
  const remove = useDeleteAdminProduct();

  const filtered = useMemo(
    () => data.filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase())),
    [data, search]
  );

  function confirmDelete(product: AdminProduct) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nIt disappears from the storefront and its variants, photos and stock history go with it. This cannot be undone.`
    );
    if (confirmed) remove.mutate(product.id);
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Catalog management</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            Products<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Manage photos, pricing, publishing and availability.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-neutral-800"
          >
            <Plus size={15} /> Add product
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full rounded-full border-neutral-200 py-2.5 pl-9 pr-4 text-xs focus:border-lime-400 focus:ring-lime-300"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
            <p className="text-sm font-bold">The catalogue could not load.</p>
            <p className="mt-1 text-xs text-neutral-500">Your session may have expired. Try refreshing.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
            <p className="text-sm font-bold">{data.length ? "Nothing matches that search." : "No products yet."}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {data.length ? "Try another term." : "Add your first product to populate the storefront."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((heading) => (
                    <th className="pb-3 font-semibold" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-neutral-100 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} className="h-12 w-10 rounded-lg object-cover" alt={product.name} />
                        ) : (
                          <span className="grid h-12 w-10 place-items-center rounded-lg bg-neutral-100 text-[9px] text-neutral-400">
                            No img
                          </span>
                        )}
                        <div>
                          <p className="font-bold">{product.name}</p>
                          <p className="mt-0.5 text-[10px] text-neutral-400">/product/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td className="font-semibold">{formatNPR(product.price)}</td>
                    <td>
                      {product.stock}{" "}
                      <span className="text-[10px] text-neutral-400">/ {product.variants.length} variants</span>
                    </td>
                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          !product.active
                            ? "bg-neutral-100 text-neutral-500"
                            : stockStatusTone[stockStatus(product.stock)]
                        }`}
                      >
                        {!product.active ? "Unpublished" : stockStatusLabel[stockStatus(product.stock)]}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          title="Edit product"
                          className="rounded-lg border p-2 transition hover:bg-neutral-50"
                        >
                          <Pencil size={13} />
                        </Link>
                        <button
                          type="button"
                          title="Delete product"
                          disabled={remove.isPending && remove.variables === product.id}
                          onClick={() => confirmDelete(product)}
                          className="rounded-lg border p-2 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={13} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
