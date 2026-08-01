import { NextResponse } from "next/server";
import {
  createSupabaseServiceClient,
  getSupabaseUrl,
  hasSupabaseServiceRole,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { expertQueriesBackendReady } from "@/lib/expertQueries";

/** Public health check — pings Supabase so we can see fetch/DNS issues. */
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

  let ping: {
    ok: boolean;
    ms?: number;
    status?: number;
    error?: string;
    tableOk?: boolean;
    tableError?: string;
  } = { ok: false };

  if (normalized) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${normalized}/rest/v1/`, {
        method: "HEAD",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ""}`,
        },
        signal: AbortSignal.timeout(12_000),
      });
      ping = { ok: res.ok || res.status === 200 || res.status === 401 || res.status === 404, ms: Date.now() - t0, status: res.status };
    } catch (err) {
      ping = {
        ok: false,
        ms: Date.now() - t0,
        error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      };
    }

    if (ping.ok && hasService) {
      try {
        const client = createSupabaseServiceClient();
        if (client) {
          const { error } = await client.from("expert_queries").select("id").limit(1);
          if (error) {
            ping.tableOk = false;
            ping.tableError = error.message;
          } else {
            ping.tableOk = true;
          }
        }
      } catch (err) {
        ping.tableOk = false;
        ping.tableError = err instanceof Error ? err.message : String(err);
      }
    }
  }

  return NextResponse.json({
    ok: expertQueriesBackendReady() && hasService && Boolean(normalized) && ping.ok && ping.tableOk !== false,
    supabaseUrl: Boolean(normalized),
    supabaseHost: normalized ? new URL(normalized).host : null,
    rawUrlHadExtraPath: rawHadExtraPath,
    supabaseAnon: hasAnon,
    supabaseServiceRole: hasService,
    configured: isSupabaseConfigured(),
    ping,
    hint: !normalized
      ? "NEXT_PUBLIC_SUPABASE_URL गलत — सही: https://wpayiyyzxbmyrdqflzya.supabase.co"
      : !ping.ok
        ? ping.error?.includes("fetch failed")
          ? "Vercel → Supabase नेटवर्क फेल। Supabase Dashboard में project Pause तो नहीं? Resume करें। फिर Redeploy।"
          : `Supabase ping fail: ${ping.error || ping.status}`
        : ping.tableOk === false
          ? `expert_queries टेबल/एक्सेस समस्या: ${ping.tableError} — SQL Editor में expert-queries.sql फिर Run करें`
          : !hasService
            ? "SUPABASE_SERVICE_ROLE_KEY missing"
            : "OK",
  });
}
