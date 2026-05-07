# WordlyWander

A family travel blog website focused on exploring Bangladesh. WordlyWander chronicles stories from a writing family that roams — featuring destination guides, blog posts, a photo journal, and an about page.

## Run & Operate

- `pnpm --filter @workspace/worldly-wander run dev` — run the frontend (reads PORT env)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema to Neon
- Required env: `DATABASE_URL` — Neon PostgreSQL connection string
- Required env: `SESSION_SECRET` — random secret for JWT signing
- Required env: `PORT=3000`, `BASE_PATH=/` — for local dev

## Vercel Deployment

Files added for Vercel:
- `vercel.json` — install/build/output config + rewrites
- `api/index.ts` — serverless function entry point (re-exports Express app)
- `build-vercel.mjs` — builds frontend for Vercel

**Vercel project settings** (set in dashboard):
- Framework: Other
- Install Command: `corepack enable && pnpm install --no-frozen-lockfile`
- Build Command: `node build-vercel.mjs`
- Output Directory: `artifacts/worldly-wander/dist/public`

**Vercel environment variables** (set in dashboard):
- `DATABASE_URL` — Neon connection string (`postgresql://...@...neon.tech/neondb?sslmode=require`)
- `SESSION_SECRET` — any long random string
- `NODE_ENV` — `production`

**After first deploy, push DB schema to Neon:**
```
DATABASE_URL=your_neon_url pnpm --filter @workspace/db run push
```

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Routing: Wouter
- UI: shadcn/ui components
- API: Express 5 (api-server)
- DB: PostgreSQL + Drizzle ORM (api-server)
- Build: esbuild (CJS bundle for api-server)

## Where things live

- `artifacts/worldly-wander/src/pages/` — all page components
- `artifacts/worldly-wander/src/components/` — Navbar, Footer, BackToTop, StarRating
- `artifacts/worldly-wander/src/contexts/` — ThemeContext, LanguageContext
- `artifacts/worldly-wander/src/data/` — static JSON data (destinations, posts, photos)
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — Drizzle DB schema

## Architecture decisions

- Frontend-only (no backend for the blog itself) — all data lives in JSON files under `src/data/`
- Theme (dark/light) stored in localStorage via ThemeContext
- Language (English/Bengali) managed via React context with a strings object
- Framer Motion for all scroll animations and page transitions
- Wouter for client-side routing with BASE_URL support

## Product

WordlyWander is a magazine-style travel blog with:
1. Home — animated hero, featured destinations, latest posts, photo strip, newsletter
2. Travel Bangladesh — filterable grid of 14 districts with type filters
3. Destination Detail — hero, gallery lightbox, highlights, map embed, family rating, related destinations
4. Blog (Scripts & Suitcases) — searchable, filterable post grid with social share
5. Photo Journal (Postcards & Paragraphs) — masonry grid with full-screen lightbox
6. Our Story — family bio, meaning of WordlyWander, Medium article links

## User preferences

- Warm earthy palette: terracotta, forest green, cream, sandy beige
- Fonts: Playfair Display (serif/headings) + Inter (body)
- Dark/light mode toggle in navbar
- Bengali/English language switcher in navbar
- No emojis in UI (except the flag in language switcher)

## Gotchas

- Always add Google Fonts @import as the FIRST line in index.css before other @import statements
- The WouterRouter uses `base={import.meta.env.BASE_URL.replace(/\/$/, "")}` — keep this
- Unsplash image URLs use the format `https://images.unsplash.com/photo-{id}?w=800&q=80`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
