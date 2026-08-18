import { NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/geminiPlantDoctor";
import { getSupabaseUrl, hasSupabaseServiceRole } from "@/lib/supabase";
import { isFcmSendConfigured } from "@/lib/push/fcmSend";

export const dynamic = "force-dynamic";

function isProd() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

type Svc = "ready" | "missing_key" | "url_only" | "missing" | "dev_fallback";

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
  const mandi = Boolean(process.env.DATA_GOV_API_KEY?.trim());
  const sessionSecret = Boolean(
    (process.env.SESSION_SECRET || process.env.AUTH_SECRET || "").trim().length >= 16
  );
  const fcm = isFcmSendConfigured();

  const services: Record<string, Svc> = {
    gemini: gemini ? "ready" : "missing_key",
    supabase: supabaseService ? "ready" : supabaseUrl ? "url_only" : "missing",
    firebase: firebase ? "ready" : "missing_key",
    mandi: mandi ? "ready" : "missing_key",
    sessionSecret: sessionSecret ? "ready" : isProd() ? "missing_key" : "dev_fallback",
    fcm: fcm ? "ready" : "missing_key",
  };

  const criticalDown = !gemini || !supabaseService || !firebase || (isProd() && !sessionSecret);
  const ok = !criticalDown;

  if (isProd()) {
    return NextResponse.json({ ok, services });
  }

  return NextResponse.json({
    ok,
    services,
    notes: {
      gemini: gemini
        ? undefined
        : "AI Doctor / Kisan Saathi return 503 until GEMINI_API_KEY is set",
      supabase: supabaseService
        ? undefined
        : "Farm sync / outbreaks / expert inbox need SUPABASE_SERVICE_ROLE_KEY — run supabase/farmer-cloud-sync.sql",
      firebase: firebase ? undefined : "Google login session exchange returns 503",
      mandi: mandi ? undefined : "Mandi falls back to mock until DATA_GOV_API_KEY is set",
      sessionSecret: sessionSecret
        ? undefined
        : "Dev uses fallback secret; production requires SESSION_SECRET (≥16 chars)",
      fcm: fcm
        ? undefined
        : "Push send needs FIREBASE_SERVICE_ACCOUNT_JSON (+ project id). Tokens still register to Supabase.",
    },
  });
}
