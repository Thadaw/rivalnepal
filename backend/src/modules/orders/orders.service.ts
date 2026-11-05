import { randomInt } from "node:crypto";
import { Prisma, type Order, type OrderItem, type OrderStatus } from "@prisma/client";
import { prisma } from "../../shared/db";
import { ORDER_FLOW, SHIPPING } from "../../shared/constants";
import { AppError } from "../../shared/errors";
import { changeStock } from "../inventory/inventory.service";
import type { OrderCreateInput } from "./orders.schemas";

const cancellable: OrderStatus[] = ["pending", "confirmed", "printing"];

// Prices, totals and the delivery fee are always computed here, never taken from the browser.
export async function placeOrder(body: OrderCreateInput) {
  const products = await prisma.product.findMany({
    where: { slug: { in: body.items.map((i) => i.slug) }, active: true },
    include: { variants: true },
  });

  const wanted = new Map<string, number>();
  const lines = body.items.map((i) => {
    const product = products.find((x) => x.slug === i.slug);
    const variant = product?.variants.find((x) => x.color === i.color && x.size === i.size);
    if (!product || !variant)
      throw new AppError(400, "An item in your cart is no longer available. Remove it and try again.");
    wanted.set(variant.id, (wanted.get(variant.id) ?? 0) + i.qty);
    return { product, variant, qty: i.qty };
  });
  for (const line of lines)
    if ((wanted.get(line.variant.id) ?? 0) > line.variant.stock)
      throw new AppError(409, `Only ${line.variant.stock} left of ${line.product.name} (${line.variant.color}, ${line.variant.size}).`);

  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const shipping = SHIPPING[body.deliveryArea];

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.order.create({
        data: {
          id: `RV-${randomInt(100000, 1000000)}`,
          customerName: body.fullName,
          phone: body.phone,
          email: body.email ? body.email.toLowerCase() : null,
          district: body.district,
          city: body.city,
          address: body.address,
          landmark: body.landmark || null,
          note: body.note || null,
          deliveryArea: body.deliveryArea,
          payment: body.payment,
          paymentImage: body.payment === "qr" ? body.paymentImage ?? null : null,
          subtotal,
          shipping,
          total: subtotal + shipping,
          items: {
            create: lines.map((l) => ({
              variantId: l.variant.id,
              productId: l.product.id,
              name: l.product.name,
              color: l.variant.color,
              size: l.variant.size,
              qty: l.qty,
              price: l.product.price,
            })),
          },
        },
        include: { items: true },
      });
    } catch (e) {
      // The random order number collided with an existing one; draw again.
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" && attempt < 2) continue;
      throw e;
    }
  }
  throw new AppError(500, "We could not create the order. Try again.");
}

// The phone number must match, so order numbers cannot be guessed by strangers.
export async function findCustomerOrder(id: string, phone: string) {
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order || order.phone !== phone) throw new AppError(404, "We couldn't find that order");
  return order;
}

export async function listOrdersForEmail(email: string) {
  return prisma.order.findMany({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function setOrderStatus(id: string, to: OrderStatus) {
  return prisma.$transaction(async (tx) => {
    const o = await tx.order.findUnique({ where: { id }, include: { items: true } });
    if (!o) throw new AppError(404, "Order not found");

    if (to === "cancelled") {
      if (!cancellable.includes(o.status)) throw new AppError(409, "This order can no longer be cancelled");
    } else if (ORDER_FLOW[ORDER_FLOW.indexOf(o.status as (typeof ORDER_FLOW)[number]) + 1] !== to) {
      throw new AppError(409, "That status change is not allowed");
    }

    // Claim the order. A second request for the same change finds count 0 and stops,
    // so stock is never taken twice.
    const claim = await tx.order.updateMany({ where: { id, status: o.status }, data: { status: to } });
    if (claim.count === 0) throw new AppError(409, "This order was just updated. Refresh and try again.");

    let stockDeducted = o.stockDeducted;
    if (to === "cancelled" && o.stockDeducted) {
      for (const i of o.items)
        if (i.variantId)
          await changeStock(tx, { variantId: i.variantId, delta: i.qty, reason: "order_cancelled", label: i.name, orderId: id });
      stockDeducted = false;
    }
    if (o.status === "pending" && to === "confirmed") {
      for (const i of o.items) {
        if (!i.variantId) throw new AppError(409, `${i.name} (${i.color}, ${i.size}) was removed from the catalogue`);
        await changeStock(tx, {
          variantId: i.variantId,
          delta: -i.qty,
          reason: "order",
          label: `${i.name} (${i.color}, ${i.size})`,
          orderId: id,
        });
      }
      stockDeducted = true;
    }
    return tx.order.update({ where: { id }, data: { stockDeducted }, include: { items: true } });
  });
}

export async function listAdminOrders() {
  return prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 500 });
}

export async function getAdminOrder(id: string) {
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) throw new AppError(404, "Order not found");
  return order;
}

export const toAdminOrder = (o: Order & { items: OrderItem[] }) => ({
  id: o.id,
  customer: o.customerName,
  phone: o.phone,
  email: o.email,
  district: o.district,
  city: o.city,
  address: o.address,
  landmark: o.landmark,
  note: o.note,
  deliveryArea: o.deliveryArea,
  payment: o.payment,
  paymentImage: o.paymentImage,
  subtotal: o.subtotal,
  shipping: o.shipping,
  total: o.total,
  status: o.status,
  createdAt: o.createdAt.toISOString().slice(0, 10),
  stockDeducted: o.stockDeducted,
  items: o.items.map((i) => ({
    productId: i.productId ?? "",
    name: i.name,
    color: i.color,
    size: i.size,
    qty: i.qty,
    price: i.price,
  })),
});

export const toCustomerOrder = (o: Order & { items: OrderItem[] }) => ({
  id: o.id,
  status: o.status,
  payment: o.payment,
  paymentProof: Boolean(o.paymentImage),
  items: o.items.map((i) => ({ name: i.name, color: i.color, size: i.size, qty: i.qty, price: i.price })),
  subtotal: o.subtotal,
  shipping: o.shipping,
  total: o.total,
  customer: { fullName: o.customerName, phone: o.phone, address: o.address, city: o.city, district: o.district },
  createdAt: o.createdAt.toISOString(),
});
