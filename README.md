# Gender Reveal — Live Voting

Next.js 15 + TypeScript + Tailwind CSS app for a Gender Reveal event: guests vote Niño/Niña from
their phone, a Dashboard route projects live results, and an Admin route controls the reveal.

Implements the design in `project/Gender Reveal.dc.html` (the original Claude Design handoff,
kept under `project/` and `chats/` for reference).

## Routes

- `/` — guest flow (mobile): name → vote → optional selfie → optional message → confirmation.
- `/dashboard` — full-screen live results, meant to be projected. Polls/subscribes for live updates
  and shows a confetti reveal overlay when triggered from Admin.
- `/admin` — stats, voter list, and controls to reveal the result, simulate a test voter, and reset
  the vote. Protected by a password gate (see below).

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs immediately with **no configuration** using an in-memory mock data store (seeded with
sample votes) so you can try the full flow locally. To go live for the real event, configure
Supabase as described below.

### Supabase (recommended for the real event)

The mock store only lives in one server process's memory — it won't sync across multiple visitors
on a real deployment. For the actual event, create a Supabase project and:

1. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor. It creates the `votes` and
   `event_settings` tables, enables Realtime, and sets read-only RLS policies (all writes go
   through this app's API routes using the service-role key, never the public anon key).
2. In Storage, create a **public** bucket named `vote-photos` for guest selfies (the migration file
   has the commented-out SQL for this if you prefer doing it that way instead of the UI).
3. Fill in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

Once those three are set, the app automatically switches from the mock store to Supabase, and
`/dashboard` / `/admin` subscribe to Realtime changes instead of polling.

### Admin password

Set `ADMIN_PASSWORD` (and optionally `ADMIN_COOKIE_SECRET`) in `.env.local` to require a password
before `/admin` loads. If `ADMIN_PASSWORD` is left unset, `/admin` stays open — convenient for
local development, but set a password before sharing the link at the real event.

### Camera

The guest photo step asks for camera permission via `getUserMedia`, which requires HTTPS (works
automatically on Vercel). If permission is denied or unavailable, guests get a file-upload fallback
automatically.

## Deploying

Deploy to Vercel as a standard Next.js app; add the same environment variables from `.env.example`
in the Vercel project settings.
