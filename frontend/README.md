# Rival Nepal — Frontend

React + TypeScript storefront and admin dashboard for a Nepal-based streetwear brand.
Tailwind CSS, TanStack Query, React Hook Form + Zod, Zustand cart, shadcn-style primitives.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev                  # http://localhost:5173
```
The dev build talks to `http://localhost:4000/api`, so start the backend first
(`cd ../backend && npm run dev`). To point somewhere else, copy `.env.example` to
`.env.development` and set `VITE_API_URL`.

## Build and preview
```bash
npm run build                # tsc -b && vite build -> dist/
npm run preview              # serves dist/ locally
```

## Deployment
1. Set `VITE_API_URL` in the host's environment before building, e.g.
   `https://api.rivalnepal.com/api`. Leave it empty when the same host proxies
   `/api` to the backend; the app then calls `/api` on its own origin.
2. Build command `npm run build`, output directory `dist`.
3. Deep links (`/shop`, `/product/:slug`, `/admin/*`, …) are client-side routes, so the
   host must serve `index.html` for unknown paths. `vercel.json` and
   `public/_redirects` (Netlify / Cloudflare Pages) already do this.
4. Serve over HTTPS and set the backend's `CLIENT_ORIGIN` to this site's exact origin —
   the session cookie is `Secure; SameSite=None` in production.

## Structure
```
src/
  app/          QueryClient, providers (QueryClientProvider + Router + Toaster), route table
  main.tsx      React entry, mounts <AppProviders><App /></AppProviders>
  shared/
    api/        apiFetch (single HTTP entry point) + types
    components/ ui/ (shadcn primitives) and layout/ (header, footer, shell)
    hooks/      cross-feature hooks
    lib/        formatting and class helpers
  features/
    auth/ account/ cart/ catalog/ checkout/ content/ newsletter/ orders/ admin/ ...
      api/        endpoint functions built on apiFetch
      hooks/      TanStack Query queries and mutations
      schemas/    Zod form schemas
      components/ feature-specific UI
      pages/      route components, exported as <Name>Page
```

Server state lives in TanStack Query (`src/app/query-client.ts`); the cart is the only
client-owned state and stays in a persisted Zustand store. Forms use React Hook Form with
Zod resolvers; every mutation invalidates the query keys it affects.

## Notes
- Prices are stored and rendered in NPR.
- Admin routes are gated by the backend session: the layout redirects anonymous users to
  `/admin/login` and non-admins to the storefront; every admin endpoint also enforces
  `requireAdmin` server-side.
- Product, order, inventory and settings data all come from the API — there is no mock data
  layer left in the bundle.
