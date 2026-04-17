# BFF FR — AI Skilling

The Bloomsbury Football Foundation Fundraising team's weekly ritual for levelling up on AI tools (Claude, Granola, Notion).

See [OBJECTIVES.md](./OBJECTIVES.md) for the full project charter: mission, BEM framework, UX philosophy, challenge cadence, and roadmap.

---

## Stack

- [Next.js 16](https://nextjs.org) (App Router, React 19, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/) for celebration moments
- [Airtable](https://airtable.com) as the backing store (server-side REST API only)
- [Railway](https://railway.app) for hosting, auto-deployed from GitHub `main`

## Local development

```bash
npm install
cp .env.example .env.local        # fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
|---|---|
| `AIRTABLE_API_KEY` | Personal access token from [airtable.com/create/tokens](https://airtable.com/create/tokens) with `data.records:read/write` on the base |
| `AIRTABLE_BASE_ID` | The base ID from the Airtable URL (`app…`) |
| `ADMIN_PASSCODE` | Shared passcode for `/admin` (keep in a password manager) |
| `NEXT_PUBLIC_APP_URL` | Canonical public URL (set to the Railway URL after first deploy) |

Secrets live in `.env.local` locally (gitignored) and in Railway's **Variables** tab in production. Never committed.

## Deployment

Deployment is automatic: every push to `main` triggers a Railway build via Nixpacks. See the deployment runbook in the internal plan doc for the initial GitHub ↔ Railway setup.

## Structure

```
app/               # App Router routes
  me/              # Personal dashboard + avatar picker
  challenges/      # Weekly path view
  team/            # Activity feed + collective progress
  admin/           # Passcode-gated cockpit
  api/             # Server routes: Airtable proxy + admin
components/        # UI primitives, avatar, progress, team, reveal, onboarding
lib/               # airtable, bem logic, session, time, admin, motion
content/           # Seed data for weekly drops
```
