export function maskPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "");
  if (d.length < 10) return "••••";
  return `${d.slice(0, 2)}••••${d.slice(-2)}`;
}

export function isAllowedHttpsPhotoUrl(url: string): boolean {
  if (!url.startsWith("https://") || url.length > 2000) return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (supabase) {
    try {
      if (parsed.origin === new URL(supabase).origin) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}
