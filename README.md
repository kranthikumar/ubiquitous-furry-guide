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
`src/lib/data.ts`; `npm run db:seed` copies that data into the database.

1. `cp .env.example .env.local` and fill in `DATABASE_URL` (Supabase
   transaction pooler, port 6543) and, ideally, `DIRECT_URL` (session pooler,
   port 5432) from Supabase → Connect → ORMs → Drizzle.
2. `npm run db:migrate` creates the tables (with row-level security on, so
   Supabase's public Data API can't touch them).
3. `npm run db:seed` loads the seed data. Safe to re-run.

After changing the schema: `npm run db:generate` to write a new migration,
then `npm run db:migrate`. `npm run db:studio` opens a table browser.

In app code, import `db` from `@/db` (server components and server actions
only).
