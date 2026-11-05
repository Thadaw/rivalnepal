import { prisma } from "../../shared/db";
import { LOW_STOCK, SHIPPING } from "../../shared/constants";

export async function getSettings(adminId: string) {
  const [user, products, variants, customers, orders] = await Promise.all([
    prisma.user.findUnique({ where: { id: adminId } }),
    prisma.product.count(),
    prisma.variant.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count(),
  ]);

  return {
    storeName: "Rival Nepal",
    currency: "NPR",
    shipsFrom: "Damauli (near Pokhara), Nepal",
    shipping: { valley: SHIPPING.valley, outside: SHIPPING.outside },
    lowStockThreshold: LOW_STOCK,
    adminEmail: user?.email ?? "",
    counts: { products, variants, customers, orders },
  };
}
