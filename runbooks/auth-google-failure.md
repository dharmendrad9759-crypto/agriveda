# Incident: Google login / session failure

## Purpose

Restore farmer Google Sign-In → server session cookie path.

## Impact

- Users cannot complete login
- Session-protected APIs fail (AI Doctor requires session; see `app/api/ai-doctor/analyze/route.ts`)
- Android native Google idToken → `/api/auth/session/firebase` path broken

## Symptoms

- Login UI errors after Google account pick
- `POST /api/auth/session/firebase` returns **503** (`Firebase not configured` or Identity Toolkit failures)
- `/api/health` → `services.firebase` is `missing_key`
- Production: `services.sessionSecret` is `missing_key` (cookies cannot be signed safely)

## Severity

**P1** (P0 if all users locked out during peak)

## Immediate Actions

1. Check health:

```bash
curl -sS https://agriveda-theta.vercel.app/api/health
```

2. Confirm which layer fails: Firebase client config vs session secret vs Identity Toolkit exchange.

## Diagnosis

Verified env (names only — from `.env.example` / `app/api/health/route.ts`):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `SESSION_SECRET` (≥16 chars in production; health marks `dev_fallback` only in non-prod)
- Optional: `NEXT_PUBLIC_APP_URL` (used as `requestUri` for idToken exchange)

Checks:

1. Firebase Console → Authentication → Google provider **enabled**.
2. Authorized domains include the Vercel hostname.
3. Vercel env has all `NEXT_PUBLIC_FIREBASE_*` + `SESSION_SECRET`.
4. Server logs for `/api/auth/session/firebase` (Identity Toolkit error messages — no tokens in logs).
5. Single-device binding: if `SUPABASE_SERVICE_ROLE_KEY` missing, active-device claim may degrade — see `lib/authActiveDevice` / health `supabase` status.

Phone OTP routes exist under `app/api/auth/otp/*` but product guidance says OTP is disabled — do not “fix” prod by re-enabling SMS without product approval.

## Recovery

| Cause | Recovery | Approval |
|-------|----------|----------|
| Missing Firebase public env | Set vars on Vercel → Redeploy | HUMAN |
| Missing/short `SESSION_SECRET` | Set ≥16 char secret → Redeploy | HUMAN |
| Domain not authorized | Add domain in Firebase Auth settings | HUMAN |
| Google provider disabled | Re-enable in Firebase Console | HUMAN |
| Active device lock blocking new phone | Clear binding via product logout path / Supabase `app_kv` (see `.env.example` note) | HUMAN |

## Validation

- Fresh browser: complete Google login; session cookie present for app origin.
- Android WebView / native Google path: idToken exchange returns success (no 503).
- `/api/health` → `firebase: ready`, `sessionSecret: ready`.

## Rollback

If a bad env change broke login: restore previous env values and redeploy ([vercel-rollback.md](./vercel-rollback.md)).

No verified rollback mechanism for Firebase Console toggles other than reversing the Console change.

## Escalation

- Suspected leaked `SESSION_SECRET` or Firebase API key abuse
- Mass logout / cannot claim devices across fleet

## Do Not

- Do not commit real Firebase keys or `SESSION_SECRET`
- Do not disable Firebase Auth to “debug”
- Do not share service-role or admin passwords to unblock login
- Do not enable MSG91/Twilio OTP in production without explicit product decision

## Root Cause Follow-Up

- Document who owns Firebase + Vercel env access
- Re-run `npm run check-env` on a staging clone after env fixes
