# Rival Nepal API

Express 5, TypeScript, Prisma, PostgreSQL. Code is grouped by feature: every folder under
`src/modules` owns its routes, validation schemas and service, and `src/shared` holds the
cross-cutting pieces.

## Run locally
```bash
cd backend
cp .env.example .env        # set JWT_SECRET and SEED_ADMIN_PASSWORD
docker compose up -d        # PostgreSQL
npm install
npx prisma migrate dev      # create the schema
npm run db:seed             # creates the admin and 6 sample products
npm run dev                 # http://localhost:4000/api/health
```

## Folder structure
```
src/
  app.ts                  Express wiring, security headers, health check
  server.ts               Process entry point
  shared/                 Used by every feature
    config.ts             Env validation (zod)
    constants.ts          Shipping rates, low-stock threshold, order status flow
    db.ts                 Prisma client
    errors.ts             AppError
    middleware.ts         requireAuth / requireAdmin / csrfGuard / errorHandler
    schemas.ts            Shared zod primitives (category, Nepali phone)
    slug.ts               Slug and SKU helpers
  modules/
    auth/                 Register, login, logout, profile, password
    account/              Order history for the signed-in customer
    catalog/              Public product listing and product detail
    orders/               Checkout, order tracking, admin order fulfilment
    products/             Admin product CRUD
    inventory/            Stock ledger and adjustments
    designs/              Print designs
    customers/            Admin customer directory
    dashboard/            Admin home summary
    analytics/            Revenue, sales by day, top products
    settings/             Store settings and record counts
    newsletter/           Drop-alert mailing list
    index.ts              Mounts publicApiRouter (/api) and adminApiRouter (/api/admin)
```

A feature folder holds `<feature>.routes.ts` for public routes, `<feature>.admin.routes.ts`
for admin-only routes, `<feature>.schemas.ts` for request validation and
`<feature>.service.ts` for the logic. Services never touch `req`/`res`, so the same code can
be reused by another entry point.

## Endpoints
| Method | Path | Who |
|---|---|---|
| GET | /api/products?category= , /api/products/:slug | public |
| POST | /api/orders | public (rate limited) |
| GET | /api/orders/:id?phone= | public, phone must match |
| POST | /api/newsletter | public (rate limited, idempotent) |
| POST | /api/auth/register, /login, /logout; GET /me; PATCH /profile, /password | customers and admins |
| GET | /api/account/orders | signed-in customer, matched on checkout email |
| GET | /api/admin/dashboard | admin |
| GET | /api/admin/analytics | admin |
| GET | /api/admin/settings | admin |
| GET/POST/PUT/DELETE | /api/admin/products(/:id) | admin |
| GET | /api/admin/inventory, /inventory/movements; POST /inventory/adjust | admin |
| GET | /api/admin/orders(/:id); PATCH /orders/:id/status | admin |
| GET | /api/admin/customers | admin |
| GET/POST/PUT/DELETE | /api/admin/designs(/:id) | admin |
| GET | /api/admin/newsletter/subscribers; DELETE /subscribers/:id | admin |

## Deploy notes
- Set `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET` (32+ chars) and `CLIENT_ORIGIN` in the host's
  environment. `CLIENT_ORIGIN` accepts a comma separated list, so apex + www can both call the API.
- Build and migrate: `npm ci` (runs `prisma generate`), `npm run build`, `npm run db:deploy`, then `npm start`.
- Or run the checklist, which does the last steps in order and tells you what is missing:

  ```bash
  npm run deploy:check   # env → migrations → first admin → GET /api/health
  ```

  It exits non-zero on failure, is safe to re-run (no pending migration is a pass, and an existing admin is
  never overwritten), and only creates the admin when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are set.
  Set `HEALTH_URL` if the server is not on `http://127.0.0.1:$PORT`.
- `GET /api/health` returns `{ "ok": true }`; point the platform health check at `GET /api/health`.
- In production the session cookie is `HttpOnly; Secure; SameSite=None`, so the API must be served over
  HTTPS and `CLIENT_ORIGIN` must be the exact storefront origin (no trailing slash). Localhost keeps
  `SameSite=Lax`, so HTTP still works in development.
- Use HTTPS in production. Back up the database.
