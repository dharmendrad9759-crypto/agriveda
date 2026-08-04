import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { kvDelete, kvGet, kvSet } from "@/lib/durableKv";

type OtpEntry = { hash: string; expiresAt: number; attempts: number };

const MAX_ATTEMPTS = 5;
const DEFAULT_TTL_MS = 5 * 60 * 1000;

function otpPepper(): string {
  return process.env.SESSION_SECRET || process.env.AUTH_SECRET || "dev-otp-pepper";
}

function hashOtp(phone: string, otp: string): string {
  return createHmac("sha256", otpPepper()).update(`${phone}:${otp}`).digest("hex");
}

function otpKey(phone: string): string {
  return `otp:${phone}`;
}

/** Durable OTP (Supabase app_kv when configured — survives Vercel multi-instance). */
export async function saveOtp(phone: string, otp: string, ttlMs = DEFAULT_TTL_MS) {
  const entry: OtpEntry = {
    hash: hashOtp(phone, otp),
    expiresAt: Date.now() + ttlMs,
    attempts: 0,
  };
  await kvSet(otpKey(phone), entry, ttlMs);
}

export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  const key = otpKey(phone);
  const entry = await kvGet<OtpEntry>(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    await kvDelete(key);
    return false;
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    await kvDelete(key);
    return false;
  }

  entry.attempts += 1;
  const remainingMs = Math.max(1000, entry.expiresAt - Date.now());

  const incoming = hashOtp(phone, otp.trim());
  const a = Buffer.from(entry.hash);
  const b = Buffer.from(incoming);
  const ok = a.length === b.length && timingSafeEqual(a, b);

  if (!ok) {
    await kvSet(key, entry, remainingMs);
    return false;
  }
  await kvDelete(key);
  return true;
}

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return null;
}

export function generateOtp(): string {
  return String(randomInt(100000, 1000000));
}

export function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.AGRIVEDA_FORCE_PROD_AUTH === "true"
  );
}
