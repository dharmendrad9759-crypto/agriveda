import { KISAN_SAATHI_SYSTEM_PROMPT } from "@/data/agriveda2/kisan-saathi-prompt";
import { getGeminiApiKey } from "@/lib/geminiPlantDoctor";
import { buildKnowledgeContext } from "@/lib/knowledge/retrieve";

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"] as const;

export interface SaathiMessage {
  role: "user" | "assistant";
  content: string;
}

export type ReplyLanguage = "en" | "hi";

export interface SaathiContext {
  cropSlug?: string;
  cropName?: string;
  district?: string;
  state?: string;
  village?: string;
  lastDiagnosis?: string;
  replyLanguage?: ReplyLanguage | "hinglish";
}

export type SaathiChatResult = { reply: string; offline: boolean };

function languageRules(lang: ReplyLanguage | "hinglish" = "hi"): string {
  const normalized: ReplyLanguage = lang === "en" ? "en" : "hi";
  if (normalized === "en") {
    return `LANGUAGE: Reply ONLY in simple English for farmers.
STYLE: Give a COMPLETE answer — never truncate mid-advice. Use clear bullets. Include dose, timing, product names. For spray schedules list every stage fully.`;
  }
  return `LANGUAGE: Reply ONLY in simple spoken Devanagari Hindi for Indian farmers. No Roman Hinglish.
Keep main product/tool words in English inside brackets, e.g. स्प्रे (Spray), खाद (Fertilizer).
STYLE: Complete answer — never truncate. Simple bullets. Always include dose, timing, product names. For spray schedules list every stage fully.`;
}

/**
 * Live Gemini only. When key missing / all models fail → `{ offline: true }` (caller returns 503).
 * Never invent a fake AI answer that looks live.
 */
export async function chatWithKisanSaathi(
  messages: SaathiMessage[],
  context: SaathiContext
): Promise<SaathiChatResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return { reply: "", offline: true };
  }

  const knowledge = context.cropSlug
    ? buildKnowledgeContext({
        cropSlug: context.cropSlug,
        query: messages[messages.length - 1]?.content ?? "",
        state: context.state,
      })
    : "";

  const lang = context.replyLanguage === "en" ? "en" : "hi";
  const system = `${KISAN_SAATHI_SYSTEM_PROMPT}

${languageRules(lang)}

Farmer context (use for location-sensitive advice):
- Crop: ${context.cropName ?? context.cropSlug ?? "not specified"}
- Location: ${[context.village, context.district, context.state].filter(Boolean).join(", ") || "North India"}
${context.lastDiagnosis ? `- Recent AI diagnosis: ${context.lastDiagnosis}` : ""}

${knowledge ? `Knowledge base excerpts:\n${knowledge}` : ""}`;

  const contents = [
    { role: "user", parts: [{ text: system }] },
    {
      role: "model",
      parts: [
        {
          text: "समझ गया। मैं Kisan Saathi हूँ — आपकी फसल और जगह के हिसाब से सटीक सलाह दूँगा।",
        },
      ],
    },
    ...messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
  ];

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.55, maxOutputTokens: 4096 },
          }),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return { reply: text.trim(), offline: false };
    } catch {
      continue;
    }
  }

  return { reply: "", offline: true };
}
