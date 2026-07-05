type OtpEntry = { otp: string; expiresAt: number };

const store = new Map<string, OtpEntry>();

export function saveOtp(phone: string, otp: string, ttlMs = 5 * 60 * 1000) {
  store.set(phone, { otp, expiresAt: Date.now() + ttlMs });
}

export function verifyOtp(phone: string, otp: string): boolean {
  const entry = store.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return false;
  }
  if (entry.otp !== otp.trim()) return false;
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
  return String(Math.floor(100000 + Math.random() * 900000));
}
