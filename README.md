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
- Watch pages (`/watch/[id]`) with a simulated
  player (play/pause, seek, captions, next, full screen; keyboard shortcuts
  k/space, j/l, arrows, m, c, f), subscribe and share buttons, expandable
  description, comments you can add (saved), like and sort, and related
  videos.
- Hamburger menu drawer (native `<dialog>`: Escape, backdrop click and focus
  handling come for free).

Other links lead to a "not built yet" page. Videos, channels and comments
come from the database (see below); likes and subscriptions reset on reload.

## Database (Supabase Postgres + Drizzle)

The schema lives in `src/db/schema.ts` (channels, videos, comments) and
migrations in `drizzle/`, and the queries the pages use in
`src/db/queries.ts`. Pages render per request, so edits made in Supabase's
Table Editor show up immediately. `src/lib/data.ts` is only the seed data
(plus a few static UI pieces: categories, sidebar channels, the guest user).

Comments are saved through a server action
(`src/app/watch/[id]/actions.ts`). There are no accounts yet, so everyone
posts as the shared guest "@you" channel; likes and subscriptions are not
saved.

### On Vercel (how this project is deployed)

Production deploys run `scripts/predeploy.ts` before `next build` (via the
`vercel-build` script): it applies pending migrations and seeds the database
if it is empty. Preview deploys skip it.

Connection strings come from the Supabase ↔ Vercel integration
(`POSTGRES_URL` for the app, `POSTGRES_URL_NON_POOLING` for migrations), or
from `DATABASE_URL` / `DIRECT_URL` if you set those yourself; see
`src/db/url.ts`. The build log shows which variable was used.

Tables have row-level security enabled, so Supabase's public Data API can't
touch them; the app connects directly and is unaffected.

### Locally (optional)

`cp .env.example .env.local`, fill in the same variables, then
`npm run db:migrate` and `npm run db:seed` (which replaces all data with the
seed data). After changing the schema run `npm run db:generate` to write a
new migration. `npm run db:studio` opens a table browser.

In app code, import `db` from `@/db` (server components and server actions
only).
