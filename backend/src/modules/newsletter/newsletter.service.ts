import { prisma } from "../../shared/db";

// Signing up twice is not an error: the second call just leaves the row untouched.
export async function subscribe(email: string) {
  const normalized = email.toLowerCase();
  await prisma.newsletterSubscriber.upsert({
    where: { email: normalized },
    update: {},
    create: { email: normalized },
  });
  return { email: normalized, subscribed: true };
}

export async function listSubscribers() {
  const rows = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: { id: true, email: true, createdAt: true },
  });
  return rows.map((r) => ({ id: r.id, email: r.email, joined: r.createdAt.toISOString().slice(0, 10) }));
}

export async function removeSubscriber(id: string) {
  await prisma.newsletterSubscriber.delete({ where: { id } });
}
