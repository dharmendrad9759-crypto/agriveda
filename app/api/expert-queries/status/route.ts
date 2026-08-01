import { NextResponse } from "next/server";
import { hasSupabaseServiceRole, isSupabaseConfigured } from "@/lib/supabase";
import { expertQueriesBackendReady } from "@/lib/expertQueries";

/** Public health check — no secrets. Use to debug "expert not reached". */
export async function GET() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const hasService = hasSupabaseServiceRole();
  return NextResponse.json({
    ok: expertQueriesBackendReady() && hasService,
    supabaseUrl: hasUrl,
    supabaseAnon: hasAnon,
    supabaseServiceRole: hasService,
    configured: isSupabaseConfigured(),
    hint: !hasService
      ? "Vercel में SUPABASE_SERVICE_ROLE_KEY (service_role, anon नहीं) डालकर Redeploy करें"
      : !hasUrl
        ? "NEXT_PUBLIC_SUPABASE_URL missing"
        : "OK — अगर फिर भी fail हो तो Supabase Table Editor में expert_queries टेबल चेक करें",
  });
}
