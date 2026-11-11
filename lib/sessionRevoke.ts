import { kvGet, kvSet } from "@/lib/durableKv";

function keyFor(jti: string): string {
  return `sess:revoked:${jti}`;
}

export async function isSessionRevoked(jti: string | undefined): Promise<boolean> {
  if (!jti) return false;
  const hit = await kvGet<{ t: number }>(keyFor(jti));
  return Boolean(hit);
}

export async function revokeSessionJti(jti: string, expUnixSec: number): Promise<void> {
  const ttlMs = Math.max(1000, expUnixSec * 1000 - Date.now());
  await kvSet(keyFor(jti), { t: Date.now() }, ttlMs);
}
