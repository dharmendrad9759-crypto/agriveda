# Incident: Application / API down

## Purpose

Recover when the Agriveda web app or API is unreachable for farmers (browser + Android WebView).

## Impact

- Web and Capacitor WebView cannot load pages
- All `app/api/*` routes fail
- Native shell shows blank / error if it only loads the remote URL

## Symptoms

- Production URL does not load (DNS, SSL, or Vercel outage)
- `GET /api/health` fails to connect or returns non-200
- Vercel dashboard shows failed deployment or project paused

## Severity

**P0**

## Immediate Actions

1. Confirm scope: browser vs Android only vs both.
2. Hit health (no secrets):

```bash
curl -sS -o /tmp/av-health.json -w "%{http_code}" https://agriveda-theta.vercel.app/api/health
```

3. Open Vercel project → Deployments / Status (REQUIRES HUMAN APPROVAL for any deploy action).

## Diagnosis

1. **HTTP layer** — Does `https://agriveda-theta.vercel.app` respond?
2. **Health probe** — `GET /api/health` implemented in `app/api/health/route.ts`.
3. **Vercel** — Latest production deployment Ready? Build logs show errors?
4. **DNS / SSL** — Browser padlock / certificate errors (hosting provider UI).
5. **Partial vs total** — If HTML loads but APIs fail, jump to dependency runbooks (`supabase-unavailable`, `auth-google-failure`, `ai-features-unavailable`).

## Recovery

| Situation | Action | Approval |
|-----------|--------|----------|
| Bad new deploy | Promote previous successful deployment | HUMAN |
| Env vars wiped on Vercel | Restore from team secret store; redeploy | HUMAN |
| Vercel platform outage | Wait / status.vercel.com; communicate to users | HUMAN |
| Domain mispointed | Fix DNS at registrar to Vercel | HUMAN |

App starts with Next.js (`npm run build` / `npm start` locally; Vercel runs production build). There is **no Docker** compose in this repo.

## Validation

- `curl -sS https://agriveda-theta.vercel.app/api/health` returns JSON with `"ok": true` (or known degraded services that match expected env).
- Home page loads in browser.
- Android WebView loads the same HTTPS origin (see `android-production-webview.md`).

## Rollback

Use Vercel “Promote” / redeploy previous production deployment — see [vercel-rollback.md](./vercel-rollback.md).

No verified in-repo CLI rollback script.

## Escalation

Stop automation and escalate to a human if:

- Health stays down > 15 minutes after hosting status is green
- SSL/DNS changes are required
- Suspected account compromise on Vercel/Firebase/Supabase

## Do Not

- Do not force-push or rewrite git history to “fix” production
- Do not delete the Vercel project
- Do not change `CAPACITOR_SERVER_URL` without a planned Android release
- Do not paste secret values into chat/tickets

## Root Cause Follow-Up

- Capture failing deployment ID and build log excerpt
- Confirm env presence via Vercel UI (names only) and local `npm run check-env` for staging/dev
- Review whether monitoring alerts are needed (NOT VERIFIED: no Sentry/Crashlytics in repo)
