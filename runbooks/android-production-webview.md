# Incident: Android production WebView blank / wrong server

## Purpose

Fix Play Store / release APK when the Capacitor shell does not load the correct HTTPS app.

## Impact

- Users open app → blank WebView, cleartext blocked, or old/wrong site
- Web may still work in Chrome

## Symptoms

- White/blank screen on Android only
- WebView error for cleartext HTTP in release
- App points at LAN IP or stale URL after release

## Severity

**P2** (P1 if all Play Store users affected post-release)

## Immediate Actions

1. Confirm production web URL still healthy (`application-down.md`).
2. Identify installed `versionCode` vs force-update gates (`MIN_NATIVE_VERSION_CODE` / `NEXT_PUBLIC_MIN_NATIVE_VERSION_CODE` in `.env.example`).

## Diagnosis

Verified config names:

- `CAPACITOR_SERVER_URL` — production **must** be HTTPS (see `.env.example`, `docs/PLAY_STORE.md`)
- `CAPACITOR_ALLOW_CLEARTEXT` — local LAN only; must not be relied on for Play builds
- Capacitor sync scripts: `npm run cap:sync`, `npm run android:prepare`, `npm run android:playstore`

1. What URL is baked into the shipped WebView config (Capacitor server url at build time)?
2. Does that host serve HTTPS successfully?
3. Is force-update killing old APKs unintentionally?

## Recovery

**REQUIRES HUMAN APPROVAL** for store releases.

1. Set `CAPACITOR_SERVER_URL` to the live HTTPS Vercel URL.
2. Rebuild release artifacts using project scripts (`android:bundle` / `android:playstore` — Windows PowerShell scripts in `package.json`).
3. Ship Play Store update; optionally set min native version codes so broken APKs must update.

If only the **website** is wrong, fix Vercel first — WebView will follow the same URL without a new APK.

## Validation

- Install release build → home loads over HTTPS
- Google login works on device
- No cleartext / SSL errors in `adb logcat` (when debugging a physical device)

## Rollback

- Play Console staged rollout halt / previous release track (**HUMAN**, Play Console)
- Revert `CAPACITOR_SERVER_URL` only with a new binary if the bad URL was baked in

No verified one-click APK rollback in-repo.

## Escalation

- Play Console access missing
- Signing keystore issues (`android:keystore` script exists — treat keystore as secret)

## Do Not

- Do not ship `CAPACITOR_ALLOW_CLEARTEXT=true` to Play production
- Do not commit keystore passwords or upload keys
- Do not point production WebView at `http://` LAN IPs

## Root Cause Follow-Up

- Add release checklist item: verify `CAPACITOR_SERVER_URL` before `android:playstore`
- Keep Play listing URLs in sync with `docs/PLAY_STORE.md`
