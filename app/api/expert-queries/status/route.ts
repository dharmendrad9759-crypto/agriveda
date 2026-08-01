import { NextResponse } from "next/server";
import {
  getSupabaseUrl,
  hasSupabaseServiceRole,
  isSupabaseConfigured,
  normalizeSupabaseUrl,
} from "@/lib/supabase";
import { expertQueriesBackendReady } from "@/lib/expertQueries";

/** Public health check — no secrets. Use to debug "expert not reached". */
export async function GET() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const normalized = getSupabaseUrl();
  const rawHadExtraPath = (() => {
    try {
      const s = raw.trim().replace(/^["']+|["']+$/g, "");
      if (!s) return false;
      const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`;
      const u = new URL(withProto);
      return Boolean(u.pathname && u.pathname !== "/");
    } catch {
      return false;
    }
  })();

  const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const hasService = hasSupabaseServiceRole();

  return NextResponse.json({
    ok: expertQueriesBackendReady() && hasService && Boolean(normalized),
    supabaseUrl: Boolean(normalized),
    supabaseHost: normalized ? new URL(normalized).host : null,
    rawUrlHadExtraPath: rawHadExtraPath,
    supabaseAnon: hasAnon,
    supabaseServiceRole: hasService,
    configured: isSupabaseConfigured(),
    hint: rawHadExtraPath
      ? "NEXT_PUBLIC_SUPABASE_URL में /rest/v1 या extra path है — सिर्फ https://PROJECT.supabase.co रखो, फिर Redeploy"
      : !hasService
        ? "Vercel में SUPABASE_SERVICE_ROLE_KEY (service_role, anon नहीं) डालकर Redeploy करें"
        : !normalized
          ? "NEXT_PUBLIC_SUPABASE_URL missing/invalid"
          : "OK — अगर फिर भी fail हो तो Supabase Table Editor में expert_queries टेबल चेक करें",
    normalizeCheck: normalizeSupabaseUrl("https://demo.supabase.co/rest/v1/") === "https://demo.supabase.co",
  });
}
