/**
 * Open WhatsApp with prefilled text so farmers can forward Q&A / advice.
 * Uses wa.me (works on Android/iOS when WhatsApp is installed).
 */

const MAX_CHARS = 3500;

export function buildConsultWhatsAppText(opts: {
  cropName: string;
  question: string;
  answer: string;
  expertName?: string | null;
  isHi?: boolean;
}): string {
  const hi = opts.isHi !== false;
  const q = opts.question.trim().slice(0, 500);
  const a = opts.answer.trim().slice(0, 2200);
  const expert = (opts.expertName || "").trim();
  const crop = opts.cropName.trim() || (hi ? "फसल" : "Crop");

  if (hi) {
    return [
      "🌱 Agriveda — विशेषज्ञ सलाह",
      `फसल: ${crop}`,
      "",
      "❓ सवाल:",
      q,
      "",
      `✅ जवाब${expert ? ` (${expert})` : ""}:`,
      a,
      "",
      "— Agriveda ऐप",
    ].join("\n");
  }

  return [
    "🌱 Agriveda — Expert advice",
    `Crop: ${crop}`,
    "",
    "❓ Question:",
    q,
    "",
    `✅ Answer${expert ? ` (${expert})` : ""}:`,
    a,
    "",
    "— Agriveda app",
  ].join("\n");
}

/** Opens WhatsApp compose with text. Returns false if blocked. */
export function openWhatsAppWithText(text: string): boolean {
  if (typeof window === "undefined") return false;
  const body = text.trim().slice(0, MAX_CHARS);
  if (!body) return false;
  const url = `https://wa.me/?text=${encodeURIComponent(body)}`;
  try {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) return true;
    // Popup blocked — same-tab fallback
    window.location.href = url;
    return true;
  } catch {
    return false;
  }
}
