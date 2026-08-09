/**
 * Validate client/session device ids.
 * Reject PostgREST/filter metacharacters (commas, dots, parens, quotes).
 */
export function isValidDeviceId(id: string): boolean {
  if (!id || id.length < 8 || id.length > 80) return false;
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/** Digits-only 10-digit Indian mobile for filter equality (session phone). */
export function isValidSessionPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}
