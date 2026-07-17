<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single Next.js 16 (App Router) app — the web app *is* the product; the `android/` Capacitor project is just a WebView shell around it and needs no local service. Standard scripts live in `package.json` (`dev`, `build`, `lint`); package manager is npm (`package-lock.json`).

- Run: `npm run dev` (Turbopack dev server on http://localhost:3000). This is the only service to start — there is no separate backend (API routes live in `app/api/**`), no local DB, and no Docker/compose.
- The app runs with **zero secrets** thanks to graceful degradation. `.env.local` is optional: `SESSION_SECRET` has a dev fallback, and missing external keys make only that feature's route return 503 (or fall back to mock data for mandi). Copy `.env.example` → `.env.local` only when exercising real Supabase/Gemini/OpenWeather/SMS integrations.
- Login is phone-OTP. **In dev the OTP is returned on-screen (and in the `/api/auth/otp/send` JSON as `demoOtp`)** — no SMS provider needed to log in and test end-to-end.
- Onboarding/profile state is stored client-side (localStorage). To re-run the onboarding flow, clear the site's storage (DevTools → Application → Clear site data) and reload.
- `npm run lint` currently reports pre-existing errors/warnings (React Compiler + eslint-config-next 16 rules) unrelated to environment setup; a clean lint is not expected here.
- Android/Capacitor npm scripts (`android:*`, `dev:stop`) are Windows PowerShell and won't run on Linux; use `npx cap sync android` directly if needed.
