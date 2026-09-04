# Agriveda — Play Store ship pack

Use with production HTTPS URL (Vercel), e.g. `https://agriveda-theta.vercel.app`.

## 1) Legal URLs (Console)

| Field | Value |
|-------|--------|
| Privacy policy | `https://agriveda-theta.vercel.app/privacy` |
| Terms (optional store field) | `https://agriveda-theta.vercel.app/terms` |
| Account deletion | In-app: **Settings → खाता हटाएँ** (`DELETE /api/account`) — wipes **this device** + optional Firebase Auth user |
| Data export | In-app: **Settings → मेरा डेटा डाउनलोड** (on-device JSON; server photos/queries deleted with account) |
| Support email | `support@agriveda.in` |

**Before submit:** send a test mail to `support@agriveda.in` from a personal inbox and confirm delivery. Set MX/forwarding on the domain if empty. This cannot be verified from the repo.

## 2) Data Safety form (fill exactly)

### Data collected

| Data type | Collected? | Shared? | Purpose | Required / Optional | Notes |
|-----------|------------|---------|---------|---------------------|--------|
| Email address | Yes | No | Account management | Optional (Google Sign-In) | From Google account when user signs in |
| Name | Yes | No | App functionality | Optional | Google display name / on-device profile |
| Phone number | Yes | No | App functionality | Optional | OTP login is **off**. User may type phone in profile / expert query. Stored for that account/device only |
| Approximate location | Yes | No | App functionality | Optional | Weather / mandi / outbreaks — user permission |
| Precise location | Yes (if GPS used) | No | App functionality | Optional | Same |
| Photos | Yes | Yes* | App functionality | Optional | *Shared with **Google Gemini** only when user runs AI Doctor. Expert-query photos stay in **private** Supabase bucket until account delete. JPEG/PNG/WebP only |
| App interactions | Yes (opt-in) | No | Analytics | Optional | **Off by default** — Settings → Product analytics. No Crashlytics / Sentry / Firebase Crash Reporting |
| Device or other IDs | Yes | No | App functionality | Optional | Anonymous device id for session, queries, spray, account delete |

### Not collected (declare **No**)

- Financial info, health records (beyond crop/pest advice text), contacts, SMS/call log content, web browsing history, installed apps list
- Crash logs / diagnostics SDKs (Crashlytics, Sentry) — **do not tick** these
- Advertising ID

### Security practices

- Data encrypted in transit (HTTPS)
- Users can request deletion: **Yes** (in-app Settings → खाता हटाएँ + email)
- Users can request export: **Yes** (Settings → मेरा डेटा डाउनलोड)
- Committed to Google Play Families? **No** (agriculture tool; target **18+**)

### Data deletion

- Users can delete: Yes  
- How: Settings → खाता हटाएँ — server rows for **this device_id** (farmers, queries, spray, outbreaks, notifications, photos). Does **not** delete other farmers who happen to share a phone number.  
- Email fallback: support@agriveda.in  

### Honest notes for reviewers

- Login is **Google Sign-In** (Firebase / native Capacitor on Android). Phone OTP is disabled.
- Mandi/weather may show **example** data if live API keys missing — UI labels this.
- **No Crashlytics / Sentry** — do **not** claim crash log collection.
- Product analytics is opt-in and PII-scrubbed.
- AI advice is informational — not licensed agronomist / medical substitute (in-app disclaimer).
- Confirm `/api/health` shows gemini + supabase + firebase **ready** before review.

## 3) Store listing copy

### Short description (EN, ≤80 chars)

```
AI crop doctor, weather, mandi & expert help for Indian farmers.
```

### Short description (HI, ≤80 chars)

```
AI फसल डॉक्टर, मौसम, मंडी और विशेषज्ञ सलाह — भारतीय किसानों के लिए।
```

### Full description (EN)

```
Agriveda helps Indian farmers protect crops and take clearer field decisions.

• Sign in with Google
• AI Doctor — leaf photo or symptoms → pest/disease guidance (informational; verify dose on label)
• Weather & spray window hints for your area
• Mandi price trends (live when configured; otherwise clearly labelled example data)
• Crop guides: nutrients, fertilizer, pests & diseases
• Ask an expert — replies can reach the app and WhatsApp/SMS when configured
• Your control — download your data, log out, or permanently delete your account

Internet required for login and AI. Privacy-first: product analytics stays OFF until you turn it on. We do not sell your data.
For ages 18+. Support: support@agriveda.in
Privacy: /privacy · Terms: /terms
```

### Full description (HI)

```
Agriveda भारतीय किसानों को फसल बचाने और सही फैसला लेने में मदद करता है।

• Google से लॉगिन
• AI Doctor — पत्ती की फोटो या लक्षण से कीट/रोग सुझाव (सिर्फ जानकारी; दवा हमेशा लेबल से मिलाएँ)
• मौसम और छिड़काव विंडो
• मंडी भाव (लाइव जब API हो; वरना उदाहरण डेटा — स्क्रीन पर लिखा)
• फसल गाइड — पोषक, खाद, कीट-रोग
• विशेषज्ञ से पूछें — जवाब ऐप / WhatsApp-SMS (जब configured)
• आपका हक — डेटा डाउनलोड, लॉग आउट, या खाता हमेशा के लिए हटाएँ

लॉगिन और AI के लिए इंटरनेट ज़रूरी। निजता पहले: product analytics डिफ़ॉल्ट बंद। डेटा बेचा नहीं जाता।
18+ किसानों के लिए। सहायता: support@agriveda.in
गोपनीयता: /privacy · नियम: /terms
```

## 4) Content rating

- Category: **Tools** / Agriculture advisories  
- User-generated content: limited (expert queries / outbreak reports) — moderate as needed  
- Not medical device — pest/crop advice with disclaimer  
- Not designed for children / Families program: **No** (18+)

## 5) Listing assets (in repo)

| Asset | Spec | File |
|-------|------|------|
| High-res icon | 512×512 PNG | `public/play-listing/high-res-icon-512.png` and `public/icons/icon-512.png` |
| Feature graphic | **1024×500** PNG | `public/play-listing/feature-graphic.png` |
| Phone screenshots | 2–8, 1080×1920 | `public/play-listing/screenshots/` (home, weather, AI doctor, mandi, settings with delete/export) |

Upload these in Play Console → Store listing. Screenshots are listing mockups — recapture from a real device before final submit if Console reviewers expect pixel-perfect in-app UI.

## 6) Vercel production env (must be live)

Set on **Vercel Production** (same names as `.env.example`):

| Variable | Required |
|----------|----------|
| `SESSION_SECRET` | Yes (≥16 chars) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (never `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `NEXT_PUBLIC_FIREBASE_*` | Yes (Google login) |
| `GEMINI_API_KEY` | Yes (AI Doctor) |
| `ADMIN_PANEL_SECRET` | Yes (≥16 in production) |
| `ADMIN_COOKIE_SECRET` | Recommended (≥16) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Recommended (account delete + FCM) |
| `CAPACITOR_SERVER_URL` | For AAB sync only |

Then run `npm run check-env` locally and open `https://YOUR_DOMAIN/api/health`.

**Supabase:** run `supabase/rls-lockdown.sql` then `supabase/verify-rls.sql`. Confirm `expert-query-photos` is **private** and anon cannot SELECT `farmers`.

## 7) Release AAB (do not skip ProductionUrl)

```powershell
# android/keystore.properties present — passwords NOT in git
npm run android:playstore -- -ProductionUrl "https://agriveda-theta.vercel.app"
# Upload: android/app/build/outputs/bundle/release/app-release.aab
```

Without `-ProductionUrl`, Capacitor syncs the **offline stub** and Google login / APIs will not hit production.

Every new upload → bump `versionCode` in `android/app/build.gradle` (and `versionName` / `lib/appMeta.ts`).

## 8) Firebase Play App Signing SHA (required after first AAB)

Play Console re-signs the app. Google Sign-In fails (`DEVELOPER_ERROR` / ApiException 10) until **both** certs are in Firebase:

1. Play Console → Test and release → App integrity → **App signing key certificate** → copy SHA-1 and SHA-256  
2. Also copy **Upload key certificate** SHA-1  
3. Firebase Console → Project settings → Your Android app `com.agriveda.app` → Add fingerprints  
4. Download fresh `google-services.json` if prompted  

This step is in Google/Firebase consoles — not in git.

## 9) Pre-submit smoke test (phone)

1. Cold open splash → **Google Sign-In**  
2. AI Doctor scan + disclaimer visible  
3. Settings → export JSON  
4. Settings → logout  
5. Login again → Settings → **खाता हटाएँ**  
6. `/privacy` and `/terms` over HTTPS  
7. Mail to support@agriveda.in  
8. `/api/health` → gemini / supabase / firebase ready  
