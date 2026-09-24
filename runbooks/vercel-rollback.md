# Incident: Bad Vercel production deployment

## Purpose

Roll back or replace a broken production deploy of the Next.js app.

## Impact

- Wrong UI/API behavior after a release
- Build succeeded but runtime errors
- Env mismatch only on new deployment

## Symptoms

- Regression after a specific deployment timestamp
- Vercel deployment “Ready” but users report errors
- Previous deployment was healthy

## Severity

**P1** (P0 if site hard-down after deploy)

## Immediate Actions

1. Note current deployment ID / time from Vercel.
2. Confirm blast radius via `/api/health` and one critical user path (login or home).

## Diagnosis

1. Vercel → Deployments → compare previous Production.
2. Build logs vs runtime logs for the bad deploy.
3. Check whether env vars changed in the same window.
4. No GitHub Actions CD found in this repo — deploys are Vercel-linked (typically git push to production branch). **NOT VERIFIED:** exact git↔Vercel branch mapping for the live project.

## Recovery

**REQUIRES HUMAN APPROVAL**

1. In Vercel: open last known-good Production deployment → **Promote to Production** / Instant Rollback (wording depends on Vercel UI version).
2. If env caused the break: restore env → Redeploy good commit.
3. Communicate to Android users only if WebView URL still points at the same host (usually automatic).

Local rebuild check (does not change production):

```bash
npm run build
```

## Validation

- Production URL serves expected commit/deployment
- `/api/health` OK
- Spot-check: home, Google login, one API (`/api/weather` or `/api/mandi`)

## Rollback

The promote-previous-deployment step **is** the rollback.

No verified in-repo rollback script (`package.json` has no deploy/rollback npm script).

## Escalation

- Cannot promote previous deploy (permissions)
- Database/schema change coupled to the bad release (coordinate with `supabase-unavailable.md`)

## Do Not

- Do not `git push --force` to rewrite shared history without explicit approval
- Do not delete deployments needed for audit
- Do not change production env “experimentally” without a restore plan

## Root Cause Follow-Up

- Link failing commit and author
- Add a short release checklist: `npm run build`, `npm run check-env`, smoke `/api/health`
