import type { MovementReason, Prisma } from "@prisma/client";
import { prisma } from "../../shared/db";
import { AppError } from "../../shared/errors";

// The only place stock changes. The guarded updateMany makes the check and the change one
// atomic statement, so two orders can never take the last item.
export async function changeStock(
  tx: Prisma.TransactionClient,
  c: { variantId: string; delta: number; reason: MovementReason; label: string; note?: string; orderId?: string }
) {
  const res = await tx.variant.updateMany({
    where: { id: c.variantId, ...(c.delta < 0 ? { stock: { gte: -c.delta } } : {}) },
    data: { stock: { increment: c.delta } },
  });
  if (res.count === 0) throw new AppError(409, `Not enough stock for ${c.label}. Restock it first.`);
  await tx.stockMovement.create({
    data: { variantId: c.variantId, delta: c.delta, reason: c.reason, note: c.note, orderId: c.orderId },
  });
}

export async function listInventory() {
  const rows = await prisma.variant.findMany({
    include: {
      product: true,
      movements: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
    },
    orderBy: [{ productId: "asc" }, { id: "asc" }],
  });
  return rows.map((v) => ({
    key: v.id,
    variantId: v.id,
    productId: v.productId,
    name: v.product.name,
    category: v.product.category,
    sku: v.sku,
    color: v.color,
    colorHex: v.colorHex,
    size: v.size,
    stock: v.stock,
    lastMovementAt: v.movements[0]?.createdAt.toISOString(),
  }));
}

export async function listMovements() {
  const rows = await prisma.stockMovement.findMany({
    include: { variant: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const variantIds = [...new Set(rows.map((m) => m.variantId))];
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    select: { id: true, stock: true },
  });
  // Rows arrive newest first, so walk backwards from the current stock to
  // reconstruct the balance that existed immediately after each movement.
  const running = new Map(variants.map((v) => [v.id, v.stock]));
  return rows.map((m) => {
    const stockAfter = running.get(m.variantId) ?? 0;
    running.set(m.variantId, stockAfter - m.delta);
    return {
      id: m.id,
      at: m.createdAt.toISOString(),
      variantId: m.variantId,
      productId: m.variant.productId,
      productName: m.variant.product.name,
      sku: m.variant.sku,
      color: m.variant.color,
      size: m.variant.size,
      delta: m.delta,
      stockAfter,
      reason: m.reason,
      note: m.note ?? undefined,
      ref: m.orderId ?? undefined,
    };
  });
}

export async function adjustStock(input: {
  variantId: string;
  delta: number;
  reason: MovementReason;
  note?: string;
}) {
  const result = await prisma.$transaction(async (tx) => {
    const v = await tx.variant.findUnique({ where: { id: input.variantId }, include: { product: true } });
    if (!v) throw new AppError(404, "Variant not found");
    await changeStock(tx, {
      variantId: input.variantId,
      delta: input.delta,
      reason: input.reason,
      note: input.note,
      label: `${v.product.name} (${v.color}, ${v.size})`,
    });
    return tx.variant.findUniqueOrThrow({ where: { id: input.variantId }, select: { stock: true } });
  });
  return { variantId: input.variantId, delta: input.delta, stock: result.stock };
}
