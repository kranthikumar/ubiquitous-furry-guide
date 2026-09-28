# FurryTube

A dummy video-sharing site for the furry community, built with Next.js 16
(App Router), React 19, TypeScript and Tailwind CSS v4.

Everything is fake: videos, channels and view counts are seed data in
`src/lib/data.ts`, and thumbnails and avatars are cartoon SVGs drawn in
code (`src/components/thumbnail.tsx`, `src/components/critter.tsx`).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`,
`npm run typecheck`.

## What works

- Home page with a responsive video grid, category chips (`?category=`)
  and search (`?q=`) across titles and channel names.
- Full sidebar at ≥1024px, icon rail at 768–1023px, bottom tab bar on phones.
- Watch pages (`/watch/[id]`, prerendered for every video) with a simulated
  player (play/pause, seek, captions, next, full screen; keyboard shortcuts
  k/space, j/l, arrows, m, c, f), subscribe and share buttons, expandable
  description, comments you can add, like and sort, and related videos.
- Hamburger menu drawer (native `<dialog>`: Escape, backdrop click and focus
  handling come for free).

Other links lead to a "not built yet" page. Nothing is persisted: comments,
likes and subscriptions reset on reload.

## Database (Supabase Postgres + Drizzle)

The schema lives in `src/db/schema.ts` (channels, videos, comments) and
migrations in `drizzle/`. The pages still read the fake data in
`src/lib/data.ts`; the seed step copies that data into the database.

### On Vercel (how this project is deployed)

Production deploys run `scripts/predeploy.ts` before `next build` (via the
`vercel-build` script): it applies pending migrations and seeds the database
if it is empty. Preview deploys skip it. It needs these environment
variables, scoped to Production:

- `DIRECT_URL`: Supabase session pooler (port 5432), used for migrations.
- `DATABASE_URL`: Supabase transaction pooler (port 6543), used by the app.

Tables have row-level security enabled, so Supabase's public Data API can't
touch them; the app connects directly and is unaffected.

### Locally (optional)

`cp .env.example .env.local`, fill in the same variables, then
`npm run db:migrate` and `npm run db:seed` (which replaces all data with the
seed data). After changing the schema run `npm run db:generate` to write a
new migration. `npm run db:studio` opens a table browser.

In app code, import `db` from `@/db` (server components and server actions
only).
