import { prisma } from "../../shared/db";

type Row = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  orders: number;
  spent: number;
  joined: string;
  lastOrder: string | null;
  registered: boolean;
};

const keyFor = (email?: string | null, phone?: string | null) =>
  email ? `e:${email.toLowerCase()}` : phone ? `p:${phone}` : null;

// Registered accounts and guest checkouts are merged on email, then phone,
// so one person shows up once.
export async function listCustomers() {
  const [users, orders] = await Promise.all([
    prisma.user.findMany({ where: { role: "CUSTOMER" }, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      select: { customerName: true, phone: true, email: true, total: true, status: true, createdAt: true },
    }),
  ]);

  const rows = new Map<string, Row>();

  for (const user of users) {
    rows.set(keyFor(user.email)!, {
      id: user.id,
      name: user.name ?? user.email.split("@")[0],
      email: user.email,
      phone: null,
      orders: 0,
      spent: 0,
      joined: user.createdAt.toISOString().slice(0, 10),
      lastOrder: null,
      registered: true,
    });
  }

  for (const order of orders) {
    const key = keyFor(order.email, order.phone);
    if (!key) continue;
    let row = rows.get(key);
    if (!row) {
      row = {
        id: key,
        name: order.customerName,
        email: order.email,
        phone: order.phone,
        orders: 0,
        spent: 0,
        joined: order.createdAt.toISOString().slice(0, 10),
        lastOrder: null,
        registered: false,
      };
      rows.set(key, row);
    }
    row.orders += 1;
    if (order.status !== "cancelled") row.spent += order.total;
    if (!row.phone) row.phone = order.phone;
    if (!row.lastOrder) row.lastOrder = order.createdAt.toISOString().slice(0, 10);
  }

  return [...rows.values()].sort((a, b) => b.spent - a.spent);
}
