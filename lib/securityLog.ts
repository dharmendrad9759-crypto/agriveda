/** Structured security events. Never pass passwords, tokens, OTPs, or raw secrets. */
const BLOCKED = /password|token|secret|otp|cookie|authorization/i;

export function securityEvent(
  event: string,
  fields: Record<string, string | number | boolean | null | undefined>
): void {
  const safe: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (BLOCKED.test(key) || value === undefined) continue;
    safe[key] = value;
  }
  console.info("[security]", event, safe);
}
