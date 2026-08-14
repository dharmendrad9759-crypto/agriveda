# Agriveda — Play Store ship pack

Use with production HTTPS URL (Vercel), e.g. `https://agriveda-theta.vercel.app`.

## 1) Legal URLs (Console)

| Field | Value |
|-------|--------|
| Privacy policy | `https://agriveda-theta.vercel.app/privacy` |
| Terms (optional store field) | `https://agriveda-theta.vercel.app/terms` |
| Account deletion | In-app: **Settings → खाता हटाएँ** (`DELETE /api/account`) — works for Google Sign-In (deviceId wipe; phone optional) |
| Data export | In-app: **Settings → मेरा डेटा डाउनलोड** |
| Support email | `support@agriveda.in` |

**Before submit:** send a test mail to `support@agriveda.in` from a personal inbox and confirm delivery. Set MX/forwarding on the domain if empty.

## 2) Data Safety form (fill exactly)

### Data collected

| Data type | Collected? | Shared? | Purpose | Required / Optional | Notes |
|-----------|------------|---------|---------|---------------------|--------|
| Email address | Yes | No | Account management | Optional (Google Sign-In) | From Google account when user signs in |
| Name | Yes | No | App functionality | Optional | Google display name / on-device profile |
| Phone number | No* | No | — | — | *Phone OTP login is disabled. Phone may appear only if user types it in profile / expert query — declare accordingly if you collect it |
| Approximate location | Yes | No | App functionality | Optional | Weather / mandi / outbreaks — user permission |
| Precise location | Yes (if GPS used) | No | App functionality | Optional | Same |
| Photos | Yes | Yes* | App functionality | Optional | *Shared with Google Gemini for AI Doctor when user scans. Expert query photos stored in private Supabase bucket until account delete |
| App interactions | Yes (opt-in) | No | Analytics | Optional | **Off by default** — Settings → Product analytics |
| Device or other IDs | Yes | No | App functionality | Optional | Anonymous device id for session, queries, spray, account delete |

### Not collected (declare **No**)

- Financial info, health records (beyond crop/pest advice text), contacts, SMS/call log content, web browsing history, installed apps list, user-generated sensitive docs beyond crop photos they upload.

### Security practices

- Data encrypted in transit (HTTPS)
- Users can request deletion: **Yes** (in-app + email)
- Committed to Google Play Families? **No** (agriculture tool; target **18+**)

### Data deletion

- Users can delete: Yes  
- URL / instructions: Privacy page + Settings → खाता हटाएँ  
- Email fallback: support@agriveda.in  

### Honest notes for reviewers

- Login is **Google Sign-In** (Firebase / native Capacitor on Android). Phone OTP is disabled.
- Mandi/weather may show **example** data if live API keys missing — UI labels this.
- No Crashlytics/Sentry today — do **not** claim crash log collection beyond optional product events.
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

## 5) Listing assets checklist

| Asset | Spec | Status |
|-------|------|--------|
| App icon | 512×512 PNG | Use Play Console high-res from adaptive icon / branding |
| Feature graphic | 1024×500 | Create in `public/play-listing/` or Canva |
| Phone screenshots | 2–8, 16:9 or 9:16 | Capture from real device: Home, AI Doctor, Weather, Mandi, Settings (delete/export visible) |
| Tablet | Optional | Skip for phone-first |

## 6) Release AAB

```powershell
# 1) android/keystore.properties present (from example) — passwords NOT in git
# 2) Production Vercel live + env: SESSION_SECRET, Supabase service role, Gemini, Firebase…
npm run android:playstore -- -ProductionUrl "https://agriveda-theta.vercel.app"
# Upload: android/app/build/outputs/bundle/release/app-release.aab
```

Every new Upload → bump `versionCode` in `android/app/build.gradle` (and preferably `versionName` / `lib/appMeta.ts`).

Verify the AAB is **release-signed** (not debug keystore) before Console upload.

## 7) Pre-submit smoke test (phone)

1. Cold open splash → **Google Sign-In**  
2. AI Doctor scan + disclaimer visible (“सुझाव / लेबल”)  
3. Settings → export JSON  
4. Settings → logout (crops remain)  
5. Login again with Google → Settings → **खाता हटाएँ** (server + wipe; works without phone)  
6. `/privacy` and `/terms` open over HTTPS  
7. Report bug opens mail to support@agriveda.in  
8. `/api/health` → gemini / supabase / firebase ready  
