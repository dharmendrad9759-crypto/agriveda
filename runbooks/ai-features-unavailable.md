# Incident: AI Doctor / Kisan Saathi unavailable

## Purpose

Restore Gemini-backed AI features.

## Impact

- AI Doctor photo/symptom analysis fails
- Kisan Saathi chat fails
- Farmers see configure / 503 errors

Verified entrypoints:

- `POST /api/ai-doctor/analyze` — 503 if no `GEMINI_API_KEY`
- `POST /api/kisan-saathi/chat` — 503 without Gemini (same key helper)

## Symptoms

- Response status **503** with Hindi/English “configure / GEMINI_API_KEY” message
- `/api/health` → `gemini: missing_key`
- Upstream Gemini quota / model errors in server logs after key is present
- **429** from app rate limit (`lib/rateLimit.ts`) — not a key outage

## Severity

**P1** (core product feature)

## Immediate Actions

1. Health check for `gemini` service.
2. Distinguish: missing key vs quota vs rate limit (429) vs auth (session required on AI Doctor).

## Diagnosis

1. Env: `GEMINI_API_KEY` set on Vercel? (server-only)
2. Local verification without printing value: `npm run check-env`
3. Key validity: Google AI Studio / Cloud console (HUMAN)
4. Model fallbacks: `lib/geminiPlantDoctor.ts` documents ordered model fallbacks — check logs if models retired
5. Session: AI Doctor calls `requireSession` — login must work (`auth-google-failure.md`)
6. Rate limit: bucket `ai:{deviceId}:{ip}` — 20/hour style limit in analyze route — wait or confirm not global outage

## Recovery

| Cause | Recovery | Approval |
|-------|----------|----------|
| Missing key | Set `GEMINI_API_KEY` on Vercel → Redeploy | HUMAN |
| Invalid / revoked key | Rotate key in Google AI Studio; update Vercel; Redeploy | HUMAN |
| Quota exceeded | Upgrade quota / wait / temporary user messaging | HUMAN |
| Client rate limit 429 | Ask user to wait `retryAfterSec`; do not raise limits blindly | SAFE to communicate |

## Validation

- `/api/health` → `gemini: ready`
- Authenticated AI Doctor request with a small test image returns 200 JSON `result`
- Kisan Saathi chat returns a normal reply

## Rollback

Revert to previous known-good API key and redeploy if a rotation broke traffic.

## Escalation

- Key exposed in client logs or git history (do not reproduce secret; rotate immediately — HUMAN)
- Sustained Gemini platform outage

## Do Not

- Do not embed Gemini keys in Capacitor or `NEXT_PUBLIC_*`
- Do not disable session auth on AI routes “to test”
- Do not raise rate limits in production without abuse review

## Root Cause Follow-Up

- Confirm model IDs still valid when Google deprecates versions
- Add operator alert on health `gemini !== ready` if monitoring is added later
