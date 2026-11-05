import { PrismaClient, type Category } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

const C = {
  ink: { name: "Charcoal", hex: "#1c1c1a" }, bone: { name: "Bone", hex: "#e8e4da" }, olive: { name: "Olive", hex: "#59594f" },
  graphite: { name: "Graphite", hex: "#3a3a36" }, stone: { name: "Stone", hex: "#d9d6ce" },
};
const clothing = ["S", "M", "L", "XL"];
const sku = (slug: string, c: string, s: string) => `${slug}-${c}-${s}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-");

const items: { slug: string; name: string; category: Category; price: number; tag?: string; description: string; images: string[]; colors: { name: string; hex: string }[]; sizes: string[] }[] = [
  {
    slug: "himal-static-tee", name: "Himal Static Tee", category: "tshirts", price: 1890, tag: "New",
    description: "Heavy cotton tee with a front print of the Himalayan skyline broken into static lines.",
    images: [img("photo-1521572163474-6864f9cf17ab"), img("photo-1583743814966-8936f5b7be1a")],
    colors: [C.ink, C.bone], sizes: clothing,
  },
  {
    slug: "damauli-signal-tee", name: "Damauli Signal Tee", category: "tshirts", price: 1790, tag: "New",
    description: "Relaxed fit tee with a chest print inspired by lakeside streetlights and ridge-line antennas.",
    images: [img("photo-1503341504253-dff4815485f1"), img("photo-1521572163474-6864f9cf17ab")],
    colors: [C.bone, C.ink], sizes: clothing,
  },
  {
    slug: "yak-pile-hoodie", name: "Yak Pile Hoodie", category: "hoodies", price: 4290,
    description: "Brushed fleece hoodie with a large back print and a deep hood for winter.",
    images: [img("photo-1556821840-3a63f95609a7"), img("photo-1578681994506-b8f463449011")],
    colors: [C.graphite, C.ink], sizes: clothing,
  },
  {
    slug: "monsoon-shell-jacket", name: "Monsoon Shell Jacket", category: "jackets", price: 6490, tag: "Limited",
    description: "Light shell jacket with a water-resistant finish and a small chest print.",
    images: [img("photo-1551028719-00167b16eac5")],
    colors: [C.olive, C.ink], sizes: clothing,
  },
  {
    slug: "damauli-cap", name: "Damauli Cap", category: "accessories", price: 990,
    description: "Six-panel cap with an embroidered front mark and an adjustable strap.",
    images: [img("photo-1588850561407-ed78c282e89b")],
    colors: [C.ink, C.stone], sizes: ["One size"],
  },
  {
    slug: "prayer-flag-tote", name: "Prayer Flag Tote", category: "accessories", price: 1290,
    description: "Sturdy canvas tote with a flag-pattern print on both sides.",
    images: [img("photo-1590874103328-eac38a683ce7")],
    colors: [C.stone, C.ink], sizes: ["One size"],
  },
];

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) throw new Error("Set SEED_ADMIN_EMAIL and a SEED_ADMIN_PASSWORD of at least 10 characters in .env");
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: { email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12), role: "ADMIN", name: "Admin" },
  });

  for (const p of items) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      // Re-running the seed fills in missing photography without overwriting
      // images or other fields that were edited through the admin.
      if (existing.images.length === 0) {
        await prisma.product.update({ where: { slug: p.slug }, data: { images: p.images } });
      }
      continue;
    }
    const created = await prisma.product.create({
      data: {
        slug: p.slug, name: p.name, category: p.category, price: p.price, tag: p.tag, description: p.description,
        images: p.images,
        variants: { create: p.colors.flatMap((c) => p.sizes.map((s) => ({ color: c.name, colorHex: c.hex, size: s, stock: 12, sku: sku(p.slug, c.name, s) }))) },
      },
      include: { variants: true },
    });
    await prisma.stockMovement.createMany({ data: created.variants.map((v) => ({ variantId: v.id, delta: 12, reason: "restock" as const, note: "Opening stock" })) });
  }
  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());
