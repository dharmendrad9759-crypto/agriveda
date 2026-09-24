# Agriveda runbooks

Operational recovery guides for **verified** production systems in this repo.

App: Next.js 16 on **Vercel** + Capacitor Android WebView → `CAPACITOR_SERVER_URL` / `NEXT_PUBLIC_APP_URL` (e.g. `https://agriveda-theta.vercel.app`).

## Quick status

```bash
# Local / any machine that can reach production
curl -sS https://agriveda-theta.vercel.app/api/health

# Local env readiness (no secret values printed)
npm run check-env
```

`GET /api/health` returns `{ ok, services }` where services include: `gemini`, `supabase`, `firebase`, `mandi`, `sessionSecret`, `fcm`.

## Index (by severity)

| Priority | Runbook | When |
|----------|---------|------|
| P0 | [application-down.md](./application-down.md) | Site / API unreachable or `ok: false` with widespread failure |
| P1 | [auth-google-failure.md](./auth-google-failure.md) | Google login / session exchange broken |
| P1 | [supabase-unavailable.md](./supabase-unavailable.md) | Farm sync, outbreaks, expert inbox, spray logs → 503 |
| P1 | [ai-features-unavailable.md](./ai-features-unavailable.md) | AI Doctor / Kisan Saathi → 503 |
| P1 | [vercel-rollback.md](./vercel-rollback.md) | Bad production deploy |
| P2 | [android-production-webview.md](./android-production-webview.md) | Play Store / APK blank or wrong URL |

## SAFE AUTOMATION vs HUMAN APPROVAL

| Action | Class |
|--------|--------|
| Read `/api/health`, Vercel logs, Supabase dashboard status | SAFE AUTOMATION |
| Redeploy previous Vercel deployment | REQUIRES HUMAN APPROVAL |
| Rotate `GEMINI_API_KEY`, Firebase keys, Supabase service role | REQUIRES HUMAN APPROVAL |
| Change `CAPACITOR_SERVER_URL` + ship new Play Store build | REQUIRES HUMAN APPROVAL |
| Delete production data / rotate all secrets at once | REQUIRES HUMAN APPROVAL |

## Intentionally not covered

No queue workers, Docker compose, GitHub Actions CD, or payments exist in this repo — no runbooks for those.

Mandi without `DATA_GOV_API_KEY` falls back to mock data (by design) — not an outage.

Phone OTP routes exist but are disabled product-wise — prefer Google session path.
