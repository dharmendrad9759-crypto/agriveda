# Incident: Supabase unavailable

## Purpose

Recover cloud features that depend on Supabase service role / URL.

## Impact

Routes return **503** when Supabase is not configured or unreachable (verified in code):

- `POST/GET` farm sync — `app/api/farm-sync/route.ts`
- Outbreaks — `app/api/outbreaks/route.ts`
- Spray logs — `app/api/spray-logs/route.ts`
- Push token register — `app/api/push/register/route.ts`
- Expert queries inbox — `app/api/expert-queries/route.ts`

Core static crop guides / localStorage onboarding may still work; cloud sync and expert inbox will not.

## Symptoms

- API JSON: `Supabase not configured` / `Supabase unavailable` / `Expert inbox not configured`
- `/api/health` → `supabase`: `missing` or `url_only` (URL without service role)
- Supabase dashboard project paused / outage

## Severity

**P1**

## Immediate Actions

1. Health:

```bash
curl -sS https://agriveda-theta.vercel.app/api/health
```

2. Confirm whether only sync features fail (site still loads) vs total outage.

## Diagnosis

Env names (`.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only — never `NEXT_PUBLIC_`)

Helpers: `lib/supabase.ts` (`getSupabaseUrl`, `hasSupabaseServiceRole`).

1. Vercel env: URL + service role both set?
2. Supabase project status (dashboard).
3. Schema applied? Repo SQL under `supabase/` (e.g. `farmer-cloud-sync.sql`, `expert-queries.sql`) — run in **Supabase SQL Editor** (manual; not an npm migrate script).
4. RLS / table missing errors in Vercel function logs for the failing route.

## Recovery

| Cause | Recovery | Approval |
|-------|----------|----------|
| Missing service role on Vercel | Add `SUPABASE_SERVICE_ROLE_KEY` → Redeploy | HUMAN |
| Project paused | Resume in Supabase billing/dashboard | HUMAN |
| Missing tables | Run verified SQL from `supabase/*.sql` in SQL Editor | HUMAN |
| Wrong project URL | Point env to correct project → Redeploy | HUMAN |

## Validation

- `/api/health` → `supabase: ready`
- Smoke: authenticated farm-sync or spray-log request succeeds (no 503)
- Expert query create path no longer returns inbox-not-configured

## Rollback

Restore previous Supabase env pairing and redeploy.  
No verified automated DB backup/restore script in this repo — use Supabase dashboard backups if enabled (**NOT VERIFIED** whether backups are turned on for the live project).

## Escalation

- Suspected service-role leak
- Data corruption / mass delete
- Need point-in-time restore

## Do Not

- Do not put `SUPABASE_SERVICE_ROLE_KEY` in client bundles or `NEXT_PUBLIC_*`
- Do not run destructive SQL (`DROP`, truncate) without backup + human approval
- Do not disable RLS “temporarily” in production without approval
- Do not paste real keys into tickets

## Root Cause Follow-Up

- Ensure SQL migrations checklist for new env (schema.sql → farmer-cloud-sync → expert-queries as needed)
- Confirm `npm run check-env` documents expected “without” behavior
