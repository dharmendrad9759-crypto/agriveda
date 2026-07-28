# Agriveda — Architecture & Frontend Spec (short)

Farmer-first Android (Capacitor) + Next.js web app. Production shell loads the Vercel HTTPS URL.

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| UI | Next.js App Router + React 19 + Tailwind 4 | Fast shipping, one codebase for web + WebView |
| Motion | Framer Motion (reduced on native) + CSS page enter | Premium feel without janking low-end phones |
| Native | Capacitor 8 (Android) | Play Store shell around the same UI |
| Auth | OTP / Firebase session cookies | Farmer phone login |
| Data | Supabase (Postgres) + localStorage caches | Outbreaks, spray logs, farmer records |
| AI | Google Gemini (server routes) | AI Doctor photo/symptoms + Kisan Saathi |
| Weather | Open-Meteo (+ fallbacks) | Free, India-friendly |
| Hosting | Vercel | HTTPS for Capacitor production |

## Folder map

- `app/` — routes + API (`app/api/*`)
- `components/` — UI by domain (`dashboard`, `ai-doctor`, `crops`, …)
- `lib/` — domain logic, Supabase helpers, analytics, rate limits
- `data/` — crop catalogs, mock snapshots
- `hooks/` — client state (farm, weather, AI history)
- `android/` — Capacitor native project

## Design system (frontend)

- Fonts: **Outfit** (UI 400/500/600/700), **Fraunces** (display titles)
- Colors: CSS vars `--av-accent`, `--av-surface`, `--av-text-*` (light/dark + native dark)
- Tokens: `lib/design/tokens.ts` (`AV.*`)
- Spacing: prefer compact (`space-y-4`, chips `text-[11px]`)
- Layout: **fit screen width** — avoid sideways overflow for tools; use 3-col grids
- Motion: boot splash once/session; native UI motion reduced; page enter ~320ms CSS

## Data rules

- Prefer **explicit `.select(columns)`** — never ship secrets via `SELECT *`
- Cap list fetches (`.limit(100–200)`) — add cursor/offset when lists grow further
- Rate-limit public/AI/auth routes (`lib/rateLimit.ts`)

## Env / config (never commit secrets)

- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Gemini API key (server-only)
- Firebase / OTP secrets as required
- `CAPACITOR_SERVER_URL=https://…` for production sync

## Analytics & feedback

- `lib/analytics.ts` + `POST /api/analytics` — page_view, tool_open, bug_report
- In-app **Report bug**: `/report-bug`
- Support / ask: `/ask-query`

## Deliberately not in v1 polish

- Full Play Billing lifecycle hardening
- Heavy SEO (sitemap) — native + logged tools first
- Third-party analytics SDKs (Mixpanel/PostHog) until volume justifies
