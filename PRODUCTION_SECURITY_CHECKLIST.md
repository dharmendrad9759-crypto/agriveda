# Production security checklist

Use this before a Play Store or Vercel release. Items marked **code** are in the repo. Items marked **you** cannot be proven from git.

Release status: **CONDITIONAL** until the **you** rows for RLS, secrets, and MFA are done.

## Credentials

- [ ] **you** — `SESSION_SECRET` and admin secret are random, ≥16 chars, and only in the host env
- [ ] **you** — `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, Firebase service account are not `NEXT_PUBLIC_` and not in git
- [ ] **code** — `.gitignore` ignores `.env*` except `.env.example`, plus `*.keystore` and `keystore.properties`
- [ ] **you** — Firebase / Gemini / data.gov keys have console restrictions and a rotation note
- [ ] **you** — If any key was ever committed, revoke it in the provider. This audit did not rotate keys.

## Authentication

- [ ] **code** — Google token checked on the server; OTP returns 410
- [ ] **code** — Session cookie is httpOnly, Secure in production, SameSite=Strict
- [ ] **code** — Logout and account delete revoke the session id
- [ ] **code** — Second device needs an explicit takeover flag
- [ ] **you** — MFA on GitHub, Vercel, Supabase, Google Cloud (not an in-app feature)

## Authorization

- [ ] **code** — Farmer APIs use session identity, not `body.farmerId`
- [ ] **code** — `/admin/*` pages redirect without a valid admin cookie
- [ ] **code** — Manager cannot grant owner/manager privileges
- [ ] **you** — Click the app as farmer A and confirm farmer B's farm, sprays, and inbox do not load

## Database and storage

- [ ] **you** — Run `supabase/rls-lockdown.sql` and `app_kv_incr` on the live project, then confirm anon `select` fails
- [ ] **code** — Expert photo bucket is set private in the lockdown SQL (must be applied by you)
- [ ] **code** — Outbreak remote photo URLs only allow this Supabase origin
- [ ] **you** — Backups enabled in Supabase and one restore tried on a scratch project

## AI cost and uploads

- [ ] **code** — AI routes require session, durable rate limit in production, and a 5MB cap
- [ ] **code** — Image magic bytes checked before Gemini
- [ ] **code** — Farmer notes are delimited as untrusted; model text is not an auth decision
- [ ] **you** — Set a Gemini billing budget alert in Google AI Studio
- [ ] **you** — HEIC photos may still carry GPS if the phone browser cannot decode them

## HTTP and client

- [ ] **code** — HSTS, `X-Frame-Options: DENY`, nosniff, Permissions-Policy, `frame-ancestors 'none'`
- [ ] **code** — Private APIs send `Cache-Control: private, no-store` (seen locally on farm-sync and TTS)
- [ ] **code** — `productionBrowserSourceMaps: false` (confirm on a production build)
- [ ] **you** — Production CSP must not include `unsafe-eval` (dev still does)

## Logging and dependencies

- [ ] **code** — Admin login and account delete write a `[security]` log line without the password
- [ ] **you** — Ship those logs to a place you actually read
- [ ] **you** — Triage npm audit: 2 critical, 11 high, 4 moderate as of 11 Nov 2026. Do not blind-run `npm audit fix --force`

## Unresolved items that block a clean READY

1. Live RLS not verified.
2. Dependency criticals not patched.
3. No admin MFA inside the product (cloud MFA is the control).
4. No production build in this audit, so production CSP and source maps are config-only.
5. No two-user IDOR test against a real database.
