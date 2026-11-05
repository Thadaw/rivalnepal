import { ArrowUpRight, BarChart3, RefreshCw, TrendingUp, Users, Wallet } from "lucide-react";
import { useAdminAnalytics } from "@/features/admin/hooks/use-admin-queries";
import { formatNPR } from "@/shared/lib/utils";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/features/orders/types";

const statusTone: Record<OrderStatus, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-blue-400",
  printing: "bg-purple-400",
  shipped: "bg-indigo-400",
  delivered: "bg-emerald-400",
  cancelled: "bg-red-400",
};

const shortDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function AnalyticsPage() {
  const analytics = useAdminAnalytics();
  const data = analytics.data;

  const byDay = data?.byDay ?? [];
  const maxRevenue = Math.max(1, ...byDay.map((day) => day.revenue));
  const byStatus = data?.byStatus ?? [];
  const maxStatus = Math.max(1, ...byStatus.map((status) => status.count));
  const topProducts = data?.topProducts ?? [];

  const stats = [
    { label: "Revenue", value: data ? formatNPR(data.revenue) : "—", icon: Wallet, tone: "bg-lime-100 text-lime-700" },
    { label: "Orders", value: data ? String(data.orderCount) : "—", icon: BarChart3, tone: "bg-neutral-100 text-neutral-700" },
    { label: "Average order", value: data ? formatNPR(data.averageOrder) : "—", icon: TrendingUp, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Customers", value: data ? String(data.customers) : "—", icon: Users, tone: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Performance</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            Analytics<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Revenue, order flow and best sellers — calculated from live orders.</p>
        </div>
        <button
          type="button"
          onClick={() => analytics.refetch()}
          disabled={analytics.isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
        >
          <RefreshCw size={14} className={analytics.isFetching ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {analytics.isError && (
        <div className="mt-6 rounded-2xl border border-dashed border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
          Analytics could not load. Your session may have expired — refresh the page to sign in again.
        </div>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">{label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></span>
            </div>
            <p className="display mt-4 text-3xl font-bold">{analytics.isLoading ? "—" : value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">Revenue by day</h2>
              <p className="mt-1 text-xs text-neutral-400">Last 14 days · excludes cancelled orders</p>
            </div>
            <span className="rounded-full bg-lime-100 px-3 py-1 text-[10px] font-bold">Live</span>
          </div>
          {analytics.isLoading ? (
            <div className="mt-8 h-56 animate-pulse rounded-xl bg-neutral-100" />
          ) : byDay.length === 0 ? (
            <div className="mt-8 grid h-56 place-items-center rounded-xl border border-dashed border-neutral-200 text-center">
              <div>
                <p className="text-sm font-bold">No revenue yet.</p>
                <p className="mt-1 text-xs text-neutral-400">Daily sales will chart here after the first order.</p>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex h-56 items-end gap-1.5">
              {byDay.map((day) => (
                <div key={day.date} className="group flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-lime-400 transition-all group-hover:bg-lime-500"
                    style={{ height: `${Math.max(4, Math.round((day.revenue / maxRevenue) * 100))}%` }}
                    title={`${shortDate(day.date)} · ${formatNPR(day.revenue)} · ${day.orders} orders`}
                  />
                  <span className="text-[8px] text-neutral-400">{shortDate(day.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold">Orders by status</h2>
          <p className="mt-1 text-xs text-neutral-400">Where every order currently sits</p>
          {analytics.isLoading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-8 animate-pulse rounded-lg bg-neutral-100" />
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {byStatus.map((row) => (
                <div key={row.status}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">{ORDER_STATUS_LABEL[row.status]}</span>
                    <span className="text-neutral-500">{row.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full ${statusTone[row.status]}`}
                      style={{ width: `${Math.round((row.count / maxStatus) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Limited stock</p>
            <p className="mt-1 text-xs text-amber-800">
              {analytics.isLoading ? "—" : data?.lowStock ?? 0} variant{(data?.lowStock ?? 0) === 1 ? "" : "s"} below the threshold.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Best sellers</h2>
            <p className="mt-1 text-xs text-neutral-400">Ranked by units sold across live orders</p>
          </div>
          <ArrowUpRight size={18} className="text-neutral-300" />
        </div>
        {analytics.isLoading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-11 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : topProducts.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-neutral-300 px-4 py-10 text-center text-xs text-neutral-500">
            No product sales yet.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                <tr>{["#", "Product", "Units sold", "Revenue"].map((heading) => <th className="pb-3 font-semibold" key={heading}>{heading}</th>)}</tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.name} className="border-b border-neutral-100 last:border-0">
                    <td className="py-3.5 text-neutral-400">{String(index + 1).padStart(2, "0")}</td>
                    <td className="py-3.5 font-bold">{product.name}</td>
                    <td className="py-3.5">{product.qty}</td>
                    <td className="py-3.5 font-semibold">{formatNPR(product.revenue)}</td>
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
