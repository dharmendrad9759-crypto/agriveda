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

export function buildSpraySlipText(opts: {
  hi: boolean;
  crop?: string;
  problem?: string;
  items: {
    title: string;
    brands?: string;
    dose: string;
    tank?: string | null;
  }[];
}): string {
  const hi = opts.hi;
  const lines = [
    hi ? "🌱 Agriveda — दवा पर्ची" : "🌱 Agriveda — spray slip",
    opts.crop ? (hi ? `फसल: ${opts.crop}` : `Crop: ${opts.crop}`) : "",
    opts.problem ? (hi ? `समस्या: ${opts.problem}` : `Problem: ${opts.problem}`) : "",
    "",
  ];
  opts.items.slice(0, 2).forEach((item, i) => {
    lines.push(
      hi
        ? i === 0
          ? "1. पहली पसंद"
          : "2. दूसरा विकल्प"
        : i === 0
          ? "1. First choice"
          : "2. Second option"
    );
    lines.push(item.title);
    if (item.brands) lines.push(item.brands);
    lines.push(hi ? `मात्रा: ${item.dose}` : `Dose: ${item.dose}`);
    if (item.tank) lines.push(item.tank);
    lines.push("");
  });
  lines.push(
    hi
      ? "डिब्बे का लेबल ज़रूर देखें। एक ही दवा बार-बार न लगाएँ।"
      : "Check the bottle label. Do not repeat the same product."
  );
  lines.push("— Agriveda");
  return lines.filter((line, i, arr) => line !== "" || arr[i - 1] !== "").join("\n");
}

export function buildFertilizerSlipText(opts: {
  hi: boolean;
  crop: string;
  acres: number;
  bags: { name: string; amount: string }[];
}): string {
  const hi = opts.hi;
  const acres = String(opts.acres);
  const lines = [
    hi ? "🌱 Agriveda — खाद की पर्ची" : "🌱 Agriveda — fertilizer slip",
    hi ? `फसल: ${opts.crop}` : `Crop: ${opts.crop}`,
    hi ? `खेत: ${acres} एकड़` : `Field: ${acres} acre`,
    "",
    hi ? "दुकान से ये बोरी / किलो:" : "Bags / kg to buy:",
  ];
  for (const bag of opts.bags) {
    lines.push(`• ${bag.name} — ${bag.amount}`);
  }
  lines.push("");
  lines.push(
    hi
      ? "अनुमान है। मिट्टी जाँच और बोरी पर लिखी बात से मिलाएँ।"
      : "Estimate only. Match it with a soil test and the bag label."
  );
  lines.push("— Agriveda");
  return lines.join("\n");
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
