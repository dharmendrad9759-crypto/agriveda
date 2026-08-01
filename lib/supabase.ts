import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Project URL only: https://xxxx.supabase.co
 * Strips /rest/v1, quotes, trailing slashes — those cause PGRST125
 * "Invalid path specified in request URL".
 * Rejects dashboard/marketing hosts (supabase.com) which return HTML 404.
 */
export function normalizeSupabaseUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let s = raw.trim().replace(/^["']+|["']+$/g, "");
  if (!s) return null;
  try {
    if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
    const u = new URL(s);
    const host = u.host.toLowerCase();
    // Must be project API host — not www/dashboard marketing site
    if (host === "supabase.com" || host === "www.supabase.com" || host.endsWith(".supabase.com")) {
      return null;
    }
    if (!host.endsWith(".supabase.co") && !host.includes("supabase")) {
      // Allow self-hosted later; for Agriveda require *.supabase.co
      if (!host.endsWith(".supabase.co")) return null;
    }
    if (!host.endsWith(".supabase.co")) return null;
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

export function getSupabaseUrl(): string | null {
  return normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function isSupabaseConfigured(): boolean {
  return !!(getSupabaseUrl() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
}

export function hasSupabaseServiceRole(): boolean {
  return !!(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

/**
 * Browser singleton — public anon key only.
 * After RLS lockdown, browser cannot read/write tables directly.
 * Prefer Next.js API routes + service role on the server.
 */
export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const url = getSupabaseUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;

  if (!browserClient) {
    browserClient = createClient(url, key);
  }
  return browserClient;
}

/** @deprecated Prefer createSupabaseServiceClient for server APIs */
export function createSupabaseServerClient(): SupabaseClient | null {
  return createSupabaseServiceClient() ?? createSupabaseAnonServerClient();
}

function createSupabaseAnonServerClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Server-only: bypasses RLS. NEVER import this into client components.
 * Required for spray/outbreak/farmer APIs after anon policies are removed.
 */
export function createSupabaseServiceClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/^["']+|["']+$/g, "");
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
