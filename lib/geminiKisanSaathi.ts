import { KISAN_SAATHI_SYSTEM_PROMPT } from "@/data/agriveda2/kisan-saathi-prompt";
import { getGeminiApiKey } from "@/lib/geminiPlantDoctor";
import { buildKnowledgeContext } from "@/lib/knowledge/retrieve";

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"] as const;

export interface SaathiMessage {
  role: "user" | "assistant";
  content: string;
}

export type ReplyLanguage = "en" | "hi" | "hinglish";

export interface SaathiContext {
  cropSlug?: string;
  cropName?: string;
  district?: string;
  state?: string;
  village?: string;
  lastDiagnosis?: string;
  replyLanguage?: ReplyLanguage;
}

function languageRules(lang: ReplyLanguage = "hinglish"): string {
  switch (lang) {
    case "hi":
      return `LANGUAGE: Jawab SIRF seedhi Devanagari Hindi mein do.
STYLE: Bahut chhota — max 5 bullet points, har point 1 line. Lambi kahani, paragraph ya greeting mat do. Sirf kaam ki baat — dose, samay, product naam.`;
    case "en":
      return `LANGUAGE: Reply ONLY in simple English for farmers.
STYLE: Very short — max 5 bullet points, one line each. No long chat. Only actionable facts — dose, timing, product name.`;
    default:
      return `LANGUAGE: Jawab Roman Hinglish mein do (Hindi + English mix, jaise kisan bolte hain).
STYLE: Bahut chhota — max 5 bullet points. Lambi chat mat likho. Seedha point — dose, samay, dawai naam.`;
  }
}

export async function chatWithKisanSaathi(
  messages: SaathiMessage[],
  context: SaathiContext
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return fallbackReply(messages, context);
  }

  const knowledge = context.cropSlug
    ? buildKnowledgeContext({
        cropSlug: context.cropSlug,
        query: messages[messages.length - 1]?.content ?? "",
        state: context.state,
      })
    : "";

  const lang = context.replyLanguage ?? "hinglish";
  const system = `${KISAN_SAATHI_SYSTEM_PROMPT}

${languageRules(lang)}

Farmer context (use for location-sensitive advice):
- Crop: ${context.cropName ?? context.cropSlug ?? "not specified"}
- Location: ${[context.village, context.district, context.state].filter(Boolean).join(", ") || "North India"}
${context.lastDiagnosis ? `- Recent AI diagnosis: ${context.lastDiagnosis}` : ""}

${knowledge ? `Knowledge base excerpts:\n${knowledge}` : ""}`;

  const contents = [
    { role: "user", parts: [{ text: system }] },
    { role: "model", parts: [{ text: "समझ गया। मैं Kisan Saathi हूँ — आपकी फसल और जगह के हिसाब से सटीक सलाह दूँगा।" }] },
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
            generationConfig: { temperature: 0.55, maxOutputTokens: 512 },
          }),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch {
      continue;
    }
  }

  return fallbackReply(messages, context);
}

function fallbackReply(messages: SaathiMessage[], context: SaathiContext): string {
  const last = messages[messages.length - 1]?.content ?? "";
  return `🌾 Kisan Saathi (offline mode)

आपकी बात: "${last.slice(0, 80)}..."

${context.cropName ? `फसल: ${context.cropName}` : "फसल चुनें"} | ${context.district ?? "स्थान जोड़ें"}

तुरंत मदद:
• फोटो से पहचान → AI Doctor (/ai-doctor)
• लक्षण से खोज → Pest Solver (/pest-solver)
• स्प्रे समय → Weather (/weather)

Gemini API key जोड़ने पर पूरा AI chat चालू होगा।`;
}
