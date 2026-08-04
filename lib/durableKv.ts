/**
 * Durable key-value with TTL for OTP / rate-limits across Vercel isolates.
 * Uses Supabase `app_kv` when SERVICE_ROLE is set; otherwise in-memory (dev / single node).
 */
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";

type MemoryEntry = { value: unknown; expiresAt: number };
const memory = new Map<string, MemoryEntry>();

function purgeMemory(now = Date.now()) {
  for (const [k, v] of memory) {
    if (v.expiresAt <= now) memory.delete(k);
  }
}

export function durableKvReady(): boolean {
  return hasSupabaseServiceRole();
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const now = Date.now();
  if (!hasSupabaseServiceRole()) {
    purgeMemory(now);
    const hit = memory.get(key);
    if (!hit || hit.expiresAt <= now) {
      memory.delete(key);
      return null;
    }
    return hit.value as T;
  }

  const client = createSupabaseServiceClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("app_kv")
      .select("value, expires_at")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return null;
    const exp = data.expires_at ? Date.parse(String(data.expires_at)) : Number.POSITIVE_INFINITY;
    if (Number.isFinite(exp) && exp <= now) {
      await client.from("app_kv").delete().eq("key", key);
      return null;
    }
    return data.value as T;
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: unknown, ttlMs: number): Promise<void> {
  const expiresAt = Date.now() + Math.max(1000, ttlMs);
  if (!hasSupabaseServiceRole()) {
    memory.set(key, { value, expiresAt });
    return;
  }
  const client = createSupabaseServiceClient();
  if (!client) {
    memory.set(key, { value, expiresAt });
    return;
  }
  try {
    await client.from("app_kv").upsert(
      {
        key,
        value,
        expires_at: new Date(expiresAt).toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  } catch {
    memory.set(key, { value, expiresAt });
  }
}

export async function kvDelete(key: string): Promise<void> {
  memory.delete(key);
  if (!hasSupabaseServiceRole()) return;
  const client = createSupabaseServiceClient();
  if (!client) return;
  try {
    await client.from("app_kv").delete().eq("key", key);
  } catch {
    /* ignore */
  }
}

/** Atomic-ish counter for rate limits (read-modify-write; good enough with short windows). */
export async function kvIncr(
  key: string,
  windowMs: number
): Promise<{ count: number; resetAt: number }> {
  const now = Date.now();
  const existing = await kvGet<{ count: number; resetAt: number }>(key);
  if (!existing || now >= existing.resetAt) {
    const next = { count: 1, resetAt: now + windowMs };
    await kvSet(key, next, windowMs);
    return next;
  }
  const next = { count: existing.count + 1, resetAt: existing.resetAt };
  await kvSet(key, next, Math.max(1000, existing.resetAt - now));
  return next;
}
