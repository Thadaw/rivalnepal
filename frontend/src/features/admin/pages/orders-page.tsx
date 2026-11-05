import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import type { AdminOrder } from "@/features/admin/api/admin.api";
import { useSetOrderStatus } from "@/features/admin/hooks/use-admin-mutations";
import { useAdminOrders } from "@/features/admin/hooks/use-admin-queries";
import {
  CANCELLABLE_STATUSES,
  nextOrderStatus,
  ORDER_FLOW,
  ORDER_STATUS_LABEL,
  type OrderStatus,
} from "@/features/orders/types";
import { formatNPR } from "@/shared/lib/utils";

const filterOrder: (OrderStatus | "all")[] = ["all", ...ORDER_FLOW, "cancelled"];

const badge: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  printing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const actionLabel: Partial<Record<OrderStatus, string>> = {
  confirmed: "Confirm order",
  printing: "Start printing",
  shipped: "Mark as shipped",
  delivered: "Mark as delivered",
};

export function OrdersPage() {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const { data = [], isLoading, isError, isFetching, refetch } = useAdminOrders();
  const mutation = useSetOrderStatus();

  const advance = (id: string, to: OrderStatus) =>
    mutation.mutate({ id, to }, { onSuccess: () => setSelected(null) });

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: data.length };
    for (const order of data) result[order.status] = (result[order.status] ?? 0) + 1;
    return result;
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (!term) return true;
      return (
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.phone.includes(term) ||
        order.district.toLowerCase().includes(term)
      );
    });
  }, [data, status, search]);

  function cancelOrder(order: AdminOrder) {
    if (!window.confirm(`Cancel ${order.id}? Stock will be returned to the catalogue.`)) return;
    advance(order.id, "cancelled");
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Fulfilment</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            Orders<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Confirm, print, ship and close every order. Confirming deducts stock automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Waiting to confirm", value: counts.pending ?? 0, tone: "bg-amber-50 text-amber-700" },
          { label: "In production", value: (counts.confirmed ?? 0) + (counts.printing ?? 0), tone: "bg-purple-50 text-purple-700" },
          { label: "Delivered", value: counts.delivered ?? 0, tone: "bg-emerald-50 text-emerald-700" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">{stat.label}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${stat.tone}`}>Live</span>
            </div>
            <p className="display mt-4 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {filterOrder.map((option) => {
              const active = status === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                    active ? "bg-neutral-950 text-white" : "border border-neutral-200 text-neutral-500 hover:border-neutral-950"
                  }`}
                >
                  {option === "all" ? "All" : ORDER_STATUS_LABEL[option]}
                  <span className={`ml-1.5 ${active ? "text-lime-300" : "text-neutral-400"}`}>{counts[option] ?? 0}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Order, name, phone or district"
              className="w-full rounded-full border-neutral-200 py-2.5 pl-9 text-xs focus:border-lime-400 focus:ring-lime-300"
              aria-label="Search orders"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
            <p className="text-sm font-bold">Orders could not load.</p>
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
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center">
            <p className="text-sm font-bold">{data.length ? "No orders match this view." : "No orders yet."}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {data.length ? "Try a different status or clear the search." : "New storefront orders will appear here."}
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-xs">
              <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                <tr>
                  {["Order", "Customer", "Deliver to", "Items", "Total", "Status", ""].map((heading, index) => (
                    <th className="pb-3 font-semibold" key={`${heading}-${index}`}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70">
                    <td className="py-3.5">
                      <p className="font-bold">{order.id}</p>
                      <p className="mt-0.5 text-[10px] text-neutral-400">{order.createdAt}</p>
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold">{order.customer}</p>
                      <p className="mt-0.5 text-[10px] text-neutral-400">{order.phone}</p>
                    </td>
                    <td className="py-3.5">
                      <p>{order.city}</p>
                      <p className="mt-0.5 text-[10px] text-neutral-400">{order.district}</p>
                    </td>
                    <td className="py-3.5">{order.items.reduce((sum, item) => sum + item.qty, 0)} pcs</td>
                    <td className="py-3.5 font-semibold">{formatNPR(order.total)}</td>
                    <td className="py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${badge[order.status]}`}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(order)}
                        className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-2 font-bold hover:bg-white"
                      >
                        Manage <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Order</p>
                <p className="display mt-1 text-2xl font-bold">{selected.id}</p>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${badge[selected.status]}`}>
                  {ORDER_STATUS_LABEL[selected.status]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 hover:bg-neutral-50"
                aria-label="Close order"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Placed</p>
                <p className="mt-1 text-xs font-semibold">{selected.createdAt}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600">
                  <Clock size={13} /> {selected.stockDeducted ? "Stock deducted" : "Stock not deducted yet"}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Customer</p>
                <p className="mt-2 text-sm font-bold">{selected.customer}</p>
                <a href={`tel:${selected.phone}`} className="mt-1 flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black">
                  <Phone size={12} /> {selected.phone}
                </a>
                {selected.email && <p className="mt-1 text-xs text-neutral-500">{selected.email}</p>}
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Delivery</p>
                <p className="mt-2 flex items-start gap-1.5 text-xs leading-6 text-neutral-600">
                  <MapPin size={13} className="mt-1 shrink-0" />
                  <span>
                    {selected.address}
                    <br />
                    {selected.city}, {selected.district}
                    {selected.landmark && <><br />Landmark: {selected.landmark}</>}
                  </span>
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-neutral-400">
                  {selected.deliveryArea === "valley" ? "Damauli & Pokhara area" : "Outside the area"} · {selected.payment.toUpperCase()}
                </p>
                {selected.note && (
                  <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-800">
                    Note: {selected.note}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Items</p>
                <div className="mt-2 divide-y divide-neutral-100">
                  {selected.items.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">{item.name}</p>
                        <p className="mt-0.5 text-[10px] text-neutral-400">
                          {item.color} · {item.size} · ×{item.qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs font-bold">{formatNPR(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 text-xs">
                  <div className="flex justify-between text-neutral-500"><span>Subtotal</span><span>{formatNPR(selected.subtotal)}</span></div>
                  <div className="flex justify-between text-neutral-500"><span>Delivery</span><span>{formatNPR(selected.shipping)}</span></div>
                  <div className="flex justify-between pt-1 text-sm font-bold"><span>Total</span><span>{formatNPR(selected.total)}</span></div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 px-6 py-5">
              {(() => {
                const next = nextOrderStatus(selected.status);
                if (!next) return <p className="text-xs text-neutral-500">This order is closed.</p>;
                return (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => advance(selected.id, next)}
                      disabled={mutation.isPending}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3.5 text-xs font-bold text-white disabled:opacity-60"
                    >
                      {actionLabel[next] ?? "Advance order"} <ArrowRight size={14} />
                    </button>
                    {CANCELLABLE_STATUSES.includes(selected.status) && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(selected)}
                        disabled={mutation.isPending}
                        className="w-full rounded-full border border-red-200 px-5 py-3 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        Cancel order
                      </button>
                    )}
                    <p className="pt-1 text-center text-[10px] leading-4 text-neutral-400">
                      Confirming an order deducts stock. Cancelling before shipping returns it.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
