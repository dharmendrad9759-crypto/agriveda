/**
 * Rate limiter — durable via Supabase app_kv when SERVICE_ROLE is set (multi-instance safe).
 * Falls back to in-memory for local dev without Supabase.
 */
import { kvIncr } from "@/lib/durableKv";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count };
}

/** Prefer this in API routes (await). */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    const { count, resetAt } = await kvIncr(`rl:${key}`, windowMs);
    if (count > limit) {
      return {
        ok: false,
        retryAfterSec: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
      };
    }
    return { ok: true, remaining: Math.max(0, limit - count) };
  } catch {
    return memoryRateLimit(key, limit, windowMs);
  }
}

/** Sync memory-only fallback for rare sync contexts — prefer `await rateLimit`. */
export function rateLimitSync(key: string, limit: number, windowMs: number): RateLimitResult {
  return memoryRateLimit(key, limit, windowMs);
}

export function clientIp(req: { headers: Headers }): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}
