# Security fixes

Local code only. No production deploy, no live key rotation, no database migration was executed.

Regression rule: existing farmer flows stay. Security controls were not removed to make a feature pass.

## This pass (11 Nov 2026)

| Change | Files | Why | Rollback |
| --- | --- | --- | --- |
| Private API responses are not shared-cacheable | `proxy.ts` | Stops CDN/shared caches storing farmer or admin JSON | Remove the `Cache-Control` block |
| Only an owner can grant manager / view-all / manage-experts or reset a panel password | `app/api/admin/experts/route.ts`, `app/api/admin/experts/[id]/route.ts` | Stops a manager from cloning a stronger manager | Revert those two routes |
| Farmer text is marked untrusted before Gemini | `lib/geminiPlantDoctor.ts`, `lib/geminiKisanSaathi.ts` | Prompt injection must not be treated as system instructions. Model output still cannot change auth. | Revert the prompt strings |
| Upload path redraws decodable images (drops EXIF/GPS) | `lib/aiDiagnosis.ts` | Small JPEGs previously skipped canvas and kept GPS metadata | Restore the 1.2MB early return. HEIC that cannot decode is unchanged. |
| Browser source maps off for production builds | `next.config.ts` | `productionBrowserSourceMaps: false` | Set it back to true only if you accept public maps |
| Security event log without secrets | `lib/securityLog.ts`, admin login, account delete | Login failure/success and account delete are recorded as event name + id, not passwords | Remove the `securityEvent` calls |

Verified in this pass: private cache header and 401 on `/api/farm-sync` and `/api/tts` (curl against local dev). Unit tests listed in `SECURITY_TESTS.md`.

## Already in the tree from the previous hardening pass

These are present in the working tree and were not reverted:

- Manager RBAC no longer forces `assign` and `viewAll` (`lib/panelUsers.ts`)
- TTS requires a session, rate limit, and lang allowlist
- Production rate limit fails closed when durable KV/RPC is down
- Google device takeover only when the client sends `takeover: true` after confirm
- Expert unassigned queue and phone masking (`lib/adminQueryAccess.ts`)
- CSP host allowlists; `unsafe-eval` removed when `NODE_ENV` is production
- Admin UI gate in `proxy.ts` (HMAC cookie)
- Supabase `error.message` not returned to farm-sync or push clients
- Production health hides the service map unless `HEALTH_PROBE_SECRET` is sent
- Outbreak photo URLs limited to this Supabase origin
- AI Doctor checks magic bytes, not the client MIME string
- Android JS bridge cannot clear `FLAG_SECURE`
- Capacitor WebView that omits build headers is treated as native when force-update is on
- Logout revokes the session `jti` and clears local profile/GPS/photo keys
- Farmer and admin cookies are `SameSite=Strict`
- Cross-site mutating requests with a foreign `Origin` are rejected

## Not changed on purpose

- Service-role data access. Replacing it with per-user RLS would be a new data layer, not a small patch.
- `unsafe-inline` in CSP. Boot theme scripts in `app/layout.tsx` need it. A nonce migration can break the first paint.
- Live `ADMIN_PANEL_SECRET`. Optional `ADMIN_PANEL_PASSWORD_HASH` is documented in `.env.example`. Rotation was not performed.
- npm vulnerabilities. No `npm audit fix --force`.
- Agronomic dose tables. No crop or pesticide numbers were edited.

## External steps (need your approval)

1. In the Supabase SQL editor, run `supabase/rls-lockdown.sql`, `supabase/app-kv-incr-rpc.sql`, then `verify-rls.sql` if present. Confirm anon cannot `select` farmers.
2. Set long random `SESSION_SECRET` and `ADMIN_PANEL_SECRET` (or a scrypt `ADMIN_PANEL_PASSWORD_HASH`) on Vercel. Do not commit them.
3. Turn on MFA for GitHub, Vercel, Supabase, and the Google Cloud project. This repo cannot do that.
4. Restrict the Firebase and Gemini keys in their consoles (HTTP referrer / API restrictions).
5. Review the 2 critical and 11 high npm advisories and upgrade only packages whose changelog you accept.
6. Ship a new Android build so the FLAG_SECURE change in `MainActivity.java` is on devices.
