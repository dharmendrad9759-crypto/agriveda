/**
 * Prints which integrations will work vs return 503 / degrade.
 * Does not print secret values.
 *
 * Usage: npm run check-env
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const ENV_PATH = resolve(ROOT, ".env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function isSet(v) {
  if (!v) return false;
  if (/^your[-_]/i.test(v)) return false;
  if (v.includes("your-project-id")) return false;
  return true;
}

const fileEnv = loadEnvFile(ENV_PATH);
const get = (k) => process.env[k] || fileEnv[k] || "";

const checks = [
  {
    name: "Gemini (AI Doctor / Kisan Saathi)",
    ok: isSet(get("GEMINI_API_KEY")),
    need: "GEMINI_API_KEY",
    without: "503 on AI routes",
  },
  {
    name: "Supabase URL",
    ok: isSet(get("NEXT_PUBLIC_SUPABASE_URL")),
    need: "NEXT_PUBLIC_SUPABASE_URL",
    without: "outbreak write / expert inbox / spray sync need service role too",
  },
  {
    name: "Supabase service role",
    ok: isSet(get("SUPABASE_SERVICE_ROLE_KEY")),
    need: "SUPABASE_SERVICE_ROLE_KEY",
    without: "POST outbreaks/spray-logs/expert → 503; GET outbreaks uses seed",
  },
  {
    name: "Firebase web config",
    ok:
      isSet(get("NEXT_PUBLIC_FIREBASE_API_KEY")) &&
      isSet(get("NEXT_PUBLIC_FIREBASE_PROJECT_ID")) &&
      isSet(get("NEXT_PUBLIC_FIREBASE_APP_ID")),
    need: "NEXT_PUBLIC_FIREBASE_*",
    without: "Google login /api/auth/session/firebase → 503",
  },
  {
    name: "Session secret",
    ok: isSet(get("SESSION_SECRET")) && String(get("SESSION_SECRET")).length >= 16,
    need: "SESSION_SECRET (≥16 chars)",
    without: "dev fallback may be used",
  },
  {
    name: "Admin panel",
    ok: isSet(get("ADMIN_PANEL_SECRET")) && String(get("ADMIN_PANEL_SECRET")).length >= 12,
    need: "ADMIN_PANEL_SECRET",
    without: "/admin auth → 503",
  },
];

console.log(existsSync(ENV_PATH) ? `Loaded ${ENV_PATH}` : `No .env.local (using process.env only)`);
console.log("");
let missing = 0;
for (const c of checks) {
  const mark = c.ok ? "OK " : "MISS";
  if (!c.ok) missing += 1;
  console.log(`[${mark}] ${c.name}`);
  if (!c.ok) console.log(`       need: ${c.need} — else: ${c.without}`);
}
console.log("");
if (missing === 0) {
  console.log("All checked integrations look configured.");
  process.exit(0);
}
console.log(`${missing} missing — copy .env.example → .env.local and fill values.`);
console.log("Also set the same keys on Vercel for production.");
process.exit(1);
