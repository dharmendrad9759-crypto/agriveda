import { NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/geminiPlantDoctor";
import { getSupabaseUrl, hasSupabaseServiceRole } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isProd() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

/**
 * Public readiness probe — no secrets.
 * Production: statuses only. Dev: short fix hints.
 */
export async function GET() {
  const gemini = Boolean(getGeminiApiKey());
  const supabaseUrl = Boolean(getSupabaseUrl());
  const supabaseService = hasSupabaseServiceRole();
  const firebase =
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim()) &&
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()) &&
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim());

  const services = {
    gemini: gemini ? "ready" : "missing_key",
    supabase: supabaseService ? "ready" : supabaseUrl ? "url_only" : "missing",
    firebase: firebase ? "ready" : "missing_key",
  } as const;

  if (isProd()) {
    return NextResponse.json({ ok: true, services });
  }

  return NextResponse.json({
    ok: true,
    services,
    notes: {
      gemini: gemini
        ? undefined
        : "AI Doctor / Kisan Saathi return 503 until GEMINI_API_KEY is set",
      supabase: supabaseService
        ? undefined
        : "Outbreak GET uses seed; writes (POST) still need SUPABASE_SERVICE_ROLE_KEY",
      firebase: firebase ? undefined : "Google login session exchange returns 503",
    },
  });
}
