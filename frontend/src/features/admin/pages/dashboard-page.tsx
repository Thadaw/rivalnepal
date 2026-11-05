import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Boxes, Package, RefreshCw, ShoppingCart, Wallet } from "lucide-react";
import { useAdminAnalytics, useAdminDashboard } from "@/features/admin/hooks/use-admin-queries";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatNPR } from "@/shared/lib/utils";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/features/orders/types";

const statusTone: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  printing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const shortDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function DashboardPage() {
  const dashboard = useAdminDashboard();
  const analytics = useAdminAnalytics();
  const data = dashboard.data;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stats = [
    { label: "Total revenue", value: data ? formatNPR(data.sales) : "—", note: "Excludes cancelled orders", icon: Wallet, tone: "text-emerald-600", Trend: ArrowUpRight },
    { label: "Orders", value: data ? String(data.orderCount) : "—", note: "All time", icon: ShoppingCart, tone: "text-emerald-600", Trend: ArrowUpRight },
    { label: "Pending", value: data ? String(data.pending) : "—", note: "Waiting to confirm", icon: Package, tone: "text-amber-600", Trend: ArrowDownRight },
    { label: "Limited stock", value: data ? String(data.lowStock.length) : "—", note: "Variants below threshold", icon: Boxes, tone: "text-amber-600", Trend: ArrowDownRight },
  ];

  const days = (analytics.data?.byDay ?? []).slice(-7);
  const maxRevenue = Math.max(1, ...days.map((day) => day.revenue));
  const topProducts = analytics.data?.topProducts ?? [];
  const recent = data?.recent ?? [];
  const lowStock = data?.lowStock ?? [];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{today}</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            {greeting}<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Here's what's happening with your store.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            dashboard.refetch();
            analytics.refetch();
          }}
          disabled={dashboard.isFetching || analytics.isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
        >
          <RefreshCw size={14} className={dashboard.isFetching || analytics.isFetching ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {dashboard.isError && (
        <div className="mt-6 rounded-2xl border border-dashed border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
          The dashboard could not load. Your session may have expired — refresh the page to sign in again.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, tone, Trend }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">{label}</span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-100"><Icon size={17} /></span>
              </div>
              <p className="display mt-5 text-3xl font-bold">{value}</p>
              <p className={`mt-2 flex items-center gap-1 text-[10px] ${tone}`}>
                <Trend size={13} /> {note}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Sales overview</h2>
                <p className="mt-1 text-xs text-neutral-400">Revenue performance · Last 7 days</p>
              </div>
              <span className="rounded-full bg-lime-100 px-3 py-1 text-[10px] font-bold">Live</span>
            </div>
            {analytics.isLoading ? (
              <div className="mt-8 h-52 animate-pulse rounded-xl bg-neutral-100" />
            ) : days.length === 0 ? (
              <div className="mt-8 grid h-52 place-items-center rounded-xl border border-dashed border-neutral-200 text-center">
                <div>
                  <p className="text-sm font-bold">No sales yet.</p>
                  <p className="mt-1 text-xs text-neutral-400">Revenue will appear here after the first order.</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex h-52 items-end gap-3">
                {days.map((day) => (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-lime-400 transition-all"
                      style={{ height: `${Math.max(4, Math.round((day.revenue / maxRevenue) * 100))}%` }}
                      title={`${shortDate(day.date)} · ${formatNPR(day.revenue)} · ${day.orders} orders`}
                    />
                    <span className="text-[9px] text-neutral-400">{shortDate(day.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="font-bold">Top products</h2>
            <p className="mt-1 text-xs text-neutral-400">Most popular by units sold</p>
            {analytics.isLoading ? (
              <div className="mt-6 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-10 animate-pulse rounded-lg bg-neutral-100" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-neutral-200 px-4 py-8 text-center text-xs text-neutral-400">
                No product sales yet.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {topProducts.map((product, index) => (
                  <div className="flex items-center gap-3" key={product.name}>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-100 text-[10px] font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold">{product.name}</p>
                      <p className="mt-1 text-[10px] text-neutral-400">{formatNPR(product.revenue)}</p>
                    </div>
                    <span className="text-xs font-bold">{product.qty} sold</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Recent orders</h2>
                <p className="mt-1 text-xs text-neutral-400">Latest customer activity</p>
              </div>
              <Link to="/admin/orders" className="text-xs font-bold underline">View all</Link>
            </div>
            {recent.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-200 px-4 py-10 text-center text-xs text-neutral-400">
                No orders yet. New storefront orders will appear here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-xs">
                  <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                    <tr>{["Order", "Customer", "Date", "Total", "Status"].map((heading) => <th className="pb-3 font-semibold" key={heading}>{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {recent.map((order) => (
                      <tr className="border-b border-neutral-100 last:border-0" key={order.id}>
                        <td className="py-4 font-bold">{order.id}</td>
                        <td className="py-4">{order.customer}</td>
                        <td className="py-4 text-neutral-500">{order.createdAt}</td>
                        <td className="py-4 font-semibold">{formatNPR(order.total)}</td>
                        <td className="py-4">
                          <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${statusTone[order.status]}`}>
                            {ORDER_STATUS_LABEL[order.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Limited stock</h2>
                <p className="mt-1 text-xs text-neutral-400">Variants that need attention</p>
              </div>
              <Link to="/admin/inventory" className="text-xs font-bold underline">Inventory</Link>
            </div>
            {lowStock.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-200 px-4 py-10 text-center text-xs text-neutral-400">
                Everything is above the low-stock threshold.
              </p>
            ) : (
              <div className="space-y-3">
                {lowStock.slice(0, 6).map((item, index) => (
                  <div className="flex items-center justify-between gap-3" key={`${item.id}-${item.color}-${item.size}-${index}`}>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">{item.product}</p>
                      <p className="mt-0.5 text-[10px] text-neutral-400">{item.color} · {item.size}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${item.stock === 0 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                      {item.stock === 0 ? "Out" : `${item.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
