# Agriveda security audit

Date: 11 Nov 2026. Static review plus local probes. Not a pentest. Production Supabase, Vercel IAM, and provider billing dashboards were not logged into.

**Release gate: CONDITIONAL.** Do not call the app 100% secure.

## Architecture (confirmed in repo)

| Layer | What the repo actually uses |
| --- | --- |
| App | Next.js 16.2.9 App Router, React 19. No `"use server"` actions. |
| Native | Capacitor 8 Android WebView. `android/app/google-services.json` holds the public Firebase client key (same class as `NEXT_PUBLIC_FIREBASE_*`). |
| Auth | Google idToken verified on the server (`app/api/auth/session/firebase/route.ts`). Phone OTP routes return HTTP 410. |
| Session | HMAC httpOnly cookie `agriveda_session`, `SameSite=Strict`, 30 days, `jti` revoked on logout (`lib/session.ts`, `lib/sessionRevoke.ts`). |
| Admin | Separate HMAC cookie. Pages under `/admin/*` except the login page are gated in `proxy.ts`. |
| Data | Supabase via **service role** on the server (`lib/supabase.ts`). RLS is deny-by-default in `supabase/schema.sql` and `supabase/rls-lockdown.sql`. Service role bypasses RLS. |
| AI | Gemini key read only on the server (`lib/geminiPlantDoctor.ts`). Routes: `POST /api/ai-doctor/analyze`, `POST /api/kisan-saathi/chat`. |
| Public data | Crop guides, weather, mandi, geo reverse, outbreak radar GET. |
| Not present | Webhooks, Server Actions, password-reset email flow, in-app admin MFA, a CMS that writes pesticide doses. |

Trust boundary: the browser holds a public anon key and farmer profile cache. Private rows are supposed to be reachable only through session-scoped API routes that use the service role.

## Attack surface

42 route handlers under `app/api/**/route.ts`. Farmer mutations require `requireSession`. Admin mutations require `requireAdmin` / `requirePermission`. Identity for farm-sync, spray logs, expert queries, outbreaks, and notifications is the session `deviceId` or phone, not `body.farmerId`.

## Findings

Severity is exploitability in this repo, not a checkbox score.

| ID | Sev | Status | Evidence | Remaining risk |
| --- | --- | --- | --- | --- |
| C1 | Critical | Partial | `lib/supabase.ts` service client bypasses RLS. Lockdown SQL exists. | **Unverified** whether production has run `rls-lockdown.sql`. Anon key is in the client bundle by design. |
| H1 | High | Fixed in code | `lib/panelUsers.ts` manager flags no longer use `\|\| true`. Test: `lib/panelUsers.permissions.test.ts`. | Live two-account UI test not run. |
| H2 | High | Fixed in code | `lib/rateLimit.ts` + `lib/durableKv.ts` fail closed in production if KV/RPC is down. AI and Firebase login call `requireDurableRateLimit`. | Dev still uses memory. Prod RPC must exist (`supabase/app-kv-incr-rpc.sql`). |
| H3 | High | Fixed in code | Firebase route uses `body.takeover === true` only. Client sends takeover only after confirm (`FarmerOnboardingGate.tsx`). | Stolen Google token can still request takeover after the user confirms a dialog. |
| H4 | High | Verified locally | `GET /api/tts` without cookie → **401**. `curl` 11 Nov 2026. | Authenticated abuse still costs bandwidth; limit is 30/min per device+IP. |
| H5 | High | Partial | Logout wipes profile, GPS, and photo keys (`lib/appReset.ts`). Photos are not copied into localStorage (`lib/aiDoctorExpertReferral.ts`). | While logged in, profile JSON in localStorage is plaintext. |
| H6 | High | Partial | CSP pins connect/img hosts. `unsafe-eval` omitted when `NODE_ENV===production` (`next.config.ts`). | Dev response still shows `unsafe-eval`. `unsafe-inline` remains for boot scripts. Production build not executed in this pass. |
| H7 | High | Fixed in code | Unassigned expert queue only if `assignQueries` (`lib/adminQueryAccess.ts`). Phone masked otherwise. Test file present. | Not exercised with two live expert cookies. |
| M-priv | Medium | Fixed in code | Non-owner cannot set manager role, `canManageExperts`, `canViewAll`, or reset another user's password (`app/api/admin/experts`). `updatePanelUser` rejects `role === "owner"`. | No HTTP test with a manager session. |
| M-cache | Medium | Verified locally | `GET /api/farm-sync` and `/api/tts` return `cache-control: private, no-store`. | Public weather/mandi responses are still cacheable. |
| M-ai | Medium | Partial | Farmer text is wrapped as untrusted in `lib/geminiPlantDoctor.ts` and `lib/geminiKisanSaathi.ts`. Model output is not used as an authorization decision. | No prompt-injection red team. Bad agronomic text can still be shown. |
| M-exif | Medium | Partial | Decodable images are redrawn on canvas before upload (`lib/aiDiagnosis.ts`), which drops EXIF. | HEIC/HEIF that the browser cannot decode is sent as-is and may keep GPS. |
| M-deps | High (supply chain) | Open | `npm audit --omit=dev` on 11 Nov 2026: **2 critical, 11 high, 4 moderate** (17 total). | Not auto-fixed. `npm audit fix --force` was not run. |
| M-mfa | High (ops) | Unverified | No admin TOTP in the app. | MFA belongs on GitHub, Vercel, Supabase, and Google accounts. Not confirmed from this repo. |
| L-health | Low | Fixed in code | Production `/api/health` returns `{ok}` unless `HEALTH_PROBE_SECRET` matches. Dev still returns the service map (observed locally). | Dev map is expected. |
| L-git | Info | Partial | `git ls-files` shows `.env.example` only. No `.env.local` or keystore in the index. | Full history scanner (gitleaks) was not installed. `google-services.json` is tracked and contains a public Firebase web key. |

## Controls checked and not forced

| Control | Result |
| --- | --- |
| Webhooks (signature/replay) | N/A — no webhook routes |
| Server Actions | N/A — none |
| Password reset enumeration | N/A — Google login only; OTP removed |
| Open redirects | No user-supplied redirect targets found. Redirects are internal paths. |
| Pesticide CMS writes | N/A — doses live in repo data files, not an admin write API |
| SSRF | Geo/weather/TTS use fixed hosts. Outbreak `photoUrl` must be this project's Supabase origin (`lib/privacyMask.ts`). |
| IDOR on farm APIs | Code binds writes to session `deviceId`. Not proven with two live users. |
| AI billing | Session + durable rate limit: AI Doctor 20/hour, Kisan Saathi 40/hour, per device+IP. No provider budget dashboard in repo. |
| File type | Magic-byte sniff before Gemini (`lib/imageSniff.ts`). Tested. |
| Secrets in client | Gemini, service role, session, admin secrets are not `NEXT_PUBLIC_`. Public Firebase and Supabase anon keys are. |

## What this audit did not do

- Log into production Supabase and run `verify-rls.sql`
- Rotate any live key
- Run Semgrep, CodeQL, Gitleaks, or OWASP ZAP
- Run `next build`
- Red-team Gemini
- Confirm GitHub branch protection or cloud MFA
