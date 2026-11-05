import { prisma } from "../../shared/db";
import { LOW_STOCK, ORDER_STATUSES } from "../../shared/constants";

export async function getAnalytics() {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "asc" } });
  const live = orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((sum, o) => sum + o.total, 0);

  const days = new Map<string, { revenue: number; orders: number }>();
  for (const o of live) {
    const date = o.createdAt.toISOString().slice(0, 10);
    const row = days.get(date) ?? { revenue: 0, orders: 0 };
    row.revenue += o.total;
    row.orders += 1;
    days.set(date, row);
  }

  const products = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const o of live)
    for (const item of o.items) {
      const row = products.get(item.name) ?? { name: item.name, qty: 0, revenue: 0 };
      row.qty += item.qty;
      row.revenue += item.qty * item.price;
      products.set(item.name, row);
    }

  const lowStock = await prisma.variant.count({ where: { stock: { lt: LOW_STOCK } } });

  return {
    revenue,
    orderCount: orders.length,
    liveOrders: live.length,
    averageOrder: live.length ? Math.round(revenue / live.length) : 0,
    customers: new Set(orders.map((o) => o.phone)).size,
    lowStock,
    byDay: [...days.entries()].slice(-14).map(([date, row]) => ({ date, ...row })),
    byStatus: ORDER_STATUSES.map((status) => ({ status, count: orders.filter((o) => o.status === status).length })),
    topProducts: [...products.values()].sort((a, b) => b.qty - a.qty).slice(0, 5),
  };
}
