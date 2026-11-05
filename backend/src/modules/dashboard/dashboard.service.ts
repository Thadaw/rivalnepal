import { prisma } from "../../shared/db";
import { LOW_STOCK } from "../../shared/constants";

export async function getDashboard() {
  const [sales, orderCount, pending, low, recent] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "cancelled" } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.variant.findMany({
      where: { stock: { lt: LOW_STOCK } },
      include: { product: true },
      orderBy: { stock: "asc" },
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return {
    sales: sales._sum.total ?? 0,
    orderCount,
    pending,
    lowStock: low.map((v) => ({ id: v.productId, product: v.product.name, color: v.color, size: v.size, stock: v.stock })),
    recent: recent.map((o) => ({
      id: o.id,
      customer: o.customerName,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt.toISOString().slice(0, 10),
    })),
  };
}
