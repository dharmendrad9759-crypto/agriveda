import { createHmac, randomInt, timingSafeEqual } from "crypto";

type OtpEntry = { hash: string; expiresAt: number; attempts: number };

const store = new Map<string, OtpEntry>();
const MAX_ATTEMPTS = 5;

function otpPepper(): string {
  return process.env.SESSION_SECRET || process.env.AUTH_SECRET || "dev-otp-pepper";
}

function hashOtp(phone: string, otp: string): string {
  return createHmac("sha256", otpPepper()).update(`${phone}:${otp}`).digest("hex");
}

export function saveOtp(phone: string, otp: string, ttlMs = 5 * 60 * 1000) {
  store.set(phone, {
    hash: hashOtp(phone, otp),
    expiresAt: Date.now() + ttlMs,
    attempts: 0,
  });
}

export function verifyOtp(phone: string, otp: string): boolean {
  const entry = store.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return false;
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(phone);
    return false;
  }
  entry.attempts += 1;

  const incoming = hashOtp(phone, otp.trim());
  const a = Buffer.from(entry.hash);
  const b = Buffer.from(incoming);
  const ok = a.length === b.length && timingSafeEqual(a, b);

  if (!ok) return false;
  store.delete(phone);
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
