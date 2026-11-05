#!/usr/bin/env node
/**
 * Deployment checklist for the RIVAL API.
 *
 *   npm run deploy:check
 *
 * 1. Confirms the environment a deploy cannot start without.
 * 2. Applies pending Prisma migrations (`prisma migrate deploy`).
 * 3. Creates the first admin account if it does not exist yet.
 * 4. Polls GET /api/health until the running server answers.
 *
 * Safe to run more than once: migrations are idempotent, an existing admin is
 * never overwritten, and the health probe only reads.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const root = path.resolve(import.meta.dirname, "..");
const envFile = path.join(root, ".env");

// Node does not load .env for us outside the app, so mirror what the API does.
if (existsSync(envFile)) process.loadEnvFile(envFile);

const ok = (label, detail = "") => console.log(`  \u2713 ${label}${detail ? ` — ${detail}` : ""}`);
const bad = (label, detail = "") => console.log(`  \u2717 ${label}${detail ? ` — ${detail}` : ""}`);
const skipped = (label, detail = "") => console.log(`  \u2013 ${label}${detail ? ` — ${detail}` : ""}`);

const failures = [];
let step = 0;
function heading(title) {
  step += 1;
  console.log(`\n[${step}/4] ${title}`);
}
function fail(label, detail) {
  bad(label, detail);
  failures.push(label);
}

// ---------------------------------------------------------------- 1. env
heading("Environment");
const required = ["DATABASE_URL", "JWT_SECRET", "CLIENT_ORIGIN"];
for (const key of required) {
  const value = process.env[key];
  if (!value) fail(`${key} is set`, "missing from the environment");
  else ok(`${key} is set`);
}
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  fail("JWT_SECRET is long enough", `${process.env.JWT_SECRET.length} chars, needs 32+`);
}
const origins = (process.env.CLIENT_ORIGIN ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
if (origins.length) {
  const notHttps = origins.filter((value) => !/^https:\/\//.test(value) && value !== "http://localhost:5173");
  ok("CLIENT_ORIGIN parsed", `${origins.length} origin(s): ${origins.join(", ")}`);
  for (const origin of notHttps) {
    fail(`CLIENT_ORIGIN uses https (${origin})`, "browsers block the auth cookie over plain http off localhost");
  }
}
if (process.env.NODE_ENV !== "production") {
  console.log(`  ! NODE_ENV is "${process.env.NODE_ENV ?? "unset"}" — the session cookie is only SameSite=None + Secure in production`);
}
if (failures.length) {
  console.log("\nFix the environment first; the remaining steps need a database and a secret.");
  process.exit(1);
}

// ---------------------------------------------------------- 2. migrations
heading("Database migrations");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const migrated = spawnSync(npx, ["prisma", "migrate", "deploy"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (migrated.status !== 0) fail("prisma migrate deploy", `exit code ${migrated.status ?? "unknown"}`);
else ok("migrations applied");

// -------------------------------------------------------------- 3. admin
heading("First admin account");
const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  skipped("admin seed", "set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first admin");
} else if (password.length < 10) {
  fail("admin password strength", `${password.length} chars, the API requires 10+`);
} else if (!migrated.status) {
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.role === "ADMIN") ok("admin exists", `${email} — password left untouched`);
      else fail("existing account is an admin", `${email} is signed up as ${existing.role}; promote it manually`);
    } else {
      await prisma.user.create({
        data: { email, passwordHash: await bcrypt.hash(password, 12), role: "ADMIN", name: "Admin" },
      });
      ok("admin created", email);
    }
  } catch (error) {
    fail("admin seed", error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

// --------------------------------------------------------------- 4. health
heading("Health endpoint");
const port = process.env.PORT ?? "4000";
const healthUrl = process.env.HEALTH_URL ?? `http://127.0.0.1:${port}/api/health`;
const deadline = Date.now() + 20_000;
let healthy = false;
let lastError = "";
while (Date.now() < deadline && !healthy) {
  try {
    const response = await fetch(healthUrl, { signal: AbortSignal.timeout(4000) });
    const body = await response.json().catch(() => null);
    if (response.ok && body?.ok === true) {
      ok("health responds ok", `${healthUrl} (${response.status})`);
      healthy = true;
      break;
    }
    lastError = `${healthUrl} answered ${response.status}`;
  } catch (error) {
    lastError = error instanceof Error ? error.message : String(error);
  }
  await new Promise((resolve) => setTimeout(resolve, 1500));
}
if (!healthy) {
  fail("health responds ok", `${lastError}. Is the server running? Start it with "npm start" or set HEALTH_URL.`);
}

// --------------------------------------------------------------- summary
console.log("");
if (failures.length) {
  console.log(`${failures.length} check(s) failed:`);
  for (const item of failures) console.log(`  - ${item}`);
  process.exit(1);
}
console.log("Deployment checklist passed. The API is migrated, has an admin, and is answering health checks.");
