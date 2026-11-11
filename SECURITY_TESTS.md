# Security tests

Date: 11 Nov 2026. Local only. Production was not attacked.

## Passed

Command:

```text
npx vitest run lib/panelUsers.permissions.test.ts lib/imageSniff.test.ts lib/privacyMask.test.ts lib/adminQueryAccess.test.ts lib/deleteFarmerAccount.test.ts
```

Result: **5 files, 16 tests, all passed.**

| Test | What it proves |
| --- | --- |
| `permissionsForUser` manager flags false stay false | The old `\|\| true` RBAC bug stays fixed |
| `sniffImageMime` | JPEG/PNG accepted; random bytes rejected |
| `isAllowedHttpsPhotoUrl` | Arbitrary https hosts rejected |
| `canAccessQuery` | Expert cannot read an unassigned ticket; assignee and assigner can |
| `deleteFarmerAccountServer` | Empty device id rejected; Google-only wipe shape accepted when Supabase is unset |

Live local HTTP (dev server, no cookie):

| Request | Result |
| --- | --- |
| `GET /api/tts?text=hi&lang=hi` | **401** `Login required` and `cache-control: private, no-store` |
| `GET /api/farm-sync` | **401** and `cache-control: private, no-store` |
| `GET /api/admin/home` (earlier in the same day) | **307** to `/admin` |
| `GET /` | **200**, home still renders |

Dev CSP still includes `unsafe-eval` because the dev server is not `NODE_ENV=production`. That is expected from `next.config.ts`.

## Failed

None in the commands above.

## Not executed

| Test | Why |
| --- | --- |
| `next build` / production CSP without `unsafe-eval` | Not run this pass. Do not treat production CSP as verified. |
| Two logged-in farmers reading each other's farm-sync | Needs two Google accounts. Code path is session `deviceId` only. |
| Manager HTTP call trying to create another manager | Needs a manager cookie. Code path now forces `expert` unless the caller role is owner. |
| Prompt-injection against live Gemini | Would spend API quota and is not a deterministic unit test. |
| EXIF GPS strip on a real photo | No fixture image was uploaded. Canvas redraw is the mechanism; HEIC passthrough is still a gap. |
| Supabase RLS as anon | No production SQL session from this environment. |
| `npm audit fix` | Not run. Audit count only: 2 critical, 11 high, 4 moderate (`npm audit --omit=dev`). |
| Semgrep, CodeQL, Gitleaks, OWASP ZAP | Not installed in this pass. |
| Git history secret scan beyond tracked filenames | `git ls-files` showed `.env.example` only for env/keystore patterns. A dedicated scanner was not run. |

## Regression checked

- Home route still returns the farmer shell (browser snapshot of `/`).
- OTP routes were not re-enabled.
- Crop dose data files were not edited.
- Account delete still calls `revokeRequestSession` after the audit-log line was added.
