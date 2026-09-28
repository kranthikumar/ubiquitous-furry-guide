# FurryTube

A dummy video-sharing site for the furry community, built with Next.js 16
(App Router), React 19, TypeScript and Tailwind CSS v4.

Content lives in Postgres (Supabase) and is managed in the `/admin` UI. A
fresh database is seeded with made-up videos and channels
(`src/db/seed-data.ts`); videos without a thumbnail image show cartoon art
drawn in code (`src/components/thumbnail.tsx`, `src/components/critter.tsx`).

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
- Watch pages (`/watch/[id]`): a native video player when the video has a
  file URL, otherwise a simulated player (play/pause, seek, captions, next,
  full screen; keyboard shortcuts k/space, j/l, arrows, m, c, f); expandable
  description; comments you can post (saved), like and sort; related videos.
- Full sidebar at ≥1024px, icon rail at 768–1023px, bottom tab bar on phones,
  and a hamburger menu drawer.
- **Admin UI at `/admin`** to create, edit and delete videos, channels,
  comments and categories (see below).

Everything shown on the site comes from the database. Likes and the
Subscribe button are visual only (they need user accounts); other links lead
to a "not built yet" page.

## Admin (`/admin`)

- **Videos**: title, id (URL slug, fixed after creation), channel,
  description, views, duration, publish time (UTC), categories, optional
  thumbnail image URL and video file URL (`.mp4`/`.webm`), and the cartoon
  art JSON used when there is no thumbnail image.
- **Channels**: name, handle, subscriber count, avatar (species and colours
  with a live preview), and whether/where it appears under "Followed
  Channels" in the sidebar. Deleting a channel deletes its videos and
  comments. The `you` channel is the shared guest everyone comments as.
- **Comments**: filter by video, post as any channel, edit, delete.
- **Categories**: the home page chips; renaming a slug or deleting a
  category updates every tagged video.

> **The admin has no authentication yet.** Anyone who knows the URL can
> change or delete content. It is excluded from search engines (`noindex`),
> but add a login (e.g. Supabase Auth plus a check in `src/app/admin/layout.tsx`
> and in each server action under `src/app/admin/*/actions.ts`) before
> sharing the site more widely.

## Database (Supabase Postgres + Drizzle)

The schema lives in `src/db/schema.ts` (channels, videos, comments) and
migrations in `drizzle/`, and the queries in `src/db/queries.ts` (site) and
`src/db/admin-queries.ts` (admin). Tables: `channels`, `videos`,
`comments`, `categories` (home page chips; `videos.categories` holds their
slugs) and `followed_channels` (the sidebar list). Pages render per request,
so admin or Table Editor edits show up immediately. `src/db/seed-data.ts`
only fills a fresh database.

Comments are saved through a server action
(`src/app/(site)/watch/[id]/actions.ts`). There are no accounts yet, so everyone
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
