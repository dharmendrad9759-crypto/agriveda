import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import { AI_DOCTOR_CROPS } from "@/data/ai-doctor-crops";
import { buildKnowledgeContext } from "@/lib/knowledge/retrieve";

/** Ordered fallbacks — older 2.0/1.5 models were shut down June 2026 */
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"] as const;

export function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || null;
}

function cropLabel(slug: string): string {
  const crop = AI_DOCTOR_CROPS.find((c) => c.slug === slug);
  return crop ? `${crop.name} (${crop.slug})` : slug;
}

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    isValidPlantPhoto: {
      type: "boolean",
      description: "True only if image shows crop plant, leaf, stem, fruit, or visible field symptom",
    },
    rejectionReason: {
      type: "string",
      description: "Simple Hindi reason if not a valid plant photo; empty string if valid",
    },
    diseaseName: { type: "string" },
    pathogen: { type: "string" },
    confidence: { type: "number" },
    severity: { type: "string", enum: ["Low", "Medium", "High"] },
    stage: { type: "string" },
    riskLevel: { type: "string" },
    whyItHappens: { type: "array", items: { type: "string" } },
    environmentalFactors: { type: "array", items: { type: "string" } },
    treatments: { type: "array", items: { type: "string" } },
    activeIngredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          dose: { type: "string" },
          fracIrac: { type: "string" },
        },
        required: ["name", "dose", "fracIrac"],
      },
    },
    prevention: { type: "array", items: { type: "string" } },
    cropContext: { type: "string" },
    visualObservations: {
      type: "string",
      description: "What you actually see in the photo — spots, color, holes, fungus, etc.",
    },
  },
  required: [
    "isValidPlantPhoto",
    "rejectionReason",
    "diseaseName",
    "pathogen",
    "confidence",
    "severity",
    "stage",
    "riskLevel",
    "whyItHappens",
    "environmentalFactors",
    "treatments",
    "activeIngredients",
    "prevention",
    "cropContext",
    "visualObservations",
  ],
};

function buildPrompt(cropSlug: string): string {
  const crop = cropLabel(cropSlug);
  const knowledge = buildKnowledgeContext({ cropSlug, maxChunks: 5 });
  const knowledgeBlock = knowledge
    ? `\n\nREFERENCE KNOWLEDGE (ICAR PoP / diagnostic guides — use for doses and disease names):\n${knowledge.slice(0, 2500)}`
    : "";

  return `You are Agriveda AI Plant Doctor — an expert agronomist helping Indian farmers.

The farmer selected crop: ${crop}${knowledgeBlock}

Analyze the uploaded photo carefully. Your answer MUST be based on what you ACTUALLY SEE in this specific image — not a generic template.

RULES:
1. If the image is NOT a crop/plant photo (person, animal, vehicle, food plate, wall, floor, unrelated object, or too blurry to see leaves), set isValidPlantPhoto=false and rejectionReason in simple Hindi (1-2 sentences).
2. If the plant looks healthy with no clear pest/disease/nutrient problem, set diseaseName to "स्वस्थ पौधा / कोई स्पष्ट समस्या नहीं" and give preventive care tips.
3. If you see a problem, name the most likely pest, disease, or nutrient issue for ${crop} in India. Include scientific pathogen/pest name in pathogen field.
4. confidence: 0-100 based on image clarity and diagnostic certainty. Use below 55 if unsure.
5. severity: Low, Medium, or High only.
6. All farmer advice (whyItHappens, treatments, prevention, cropContext, riskLevel, stage) in SIMPLE HINDI. Technical chemical names can stay in English.
7. activeIngredients: only realistic, legal products used in Indian agriculture with practical doses (ml/L or g/L or kg/acre).
8. visualObservations: 2-3 sentences in Hindi describing exactly what you see in THIS photo (color of spots, pattern, affected part, etc.).
9. Do NOT copy generic text unrelated to the visible symptoms.

Return ONLY valid JSON matching the schema.`;
}

interface GeminiRawResponse {
  isValidPlantPhoto: boolean;
  rejectionReason?: string;
  diseaseName: string;
  pathogen: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  stage: string;
  riskLevel: string;
  whyItHappens: string[];
  environmentalFactors: string[];
  treatments: string[];
  activeIngredients: { name: string; dose: string; fracIrac: string }[];
  prevention: string[];
  cropContext: string;
  visualObservations?: string;
}

function parseGeminiError(status: number, errBody: string): Error {
  let apiMessage = "";
  try {
    const parsed = JSON.parse(errBody) as { error?: { message?: string; code?: number } };
    apiMessage = parsed.error?.message ?? "";
  } catch {
    apiMessage = errBody.slice(0, 180);
  }

  if (status === 404 || apiMessage.includes("not found")) {
    return new Error(`MODEL_NOT_FOUND:${apiMessage || status}`);
  }

  if (status === 403 || status === 401 || /api key|permission|invalid/i.test(apiMessage)) {
    return new Error(
      "GEMINI_API_KEY galat ya expired hai. Google AI Studio (aistudio.google.com) se nayi free key banayein — AIzaSy se shuru honi chahiye."
    );
  }

  if (status === 429 || /quota|rate limit/i.test(apiMessage)) {
    return new Error("Gemini limit poori ho gayi — thodi der baad dubara try karein.");
  }

  return new Error(`Gemini error (${status}): ${apiMessage || "Unknown error"}`);
}

function clampConfidence(n: number): number {
  if (!Number.isFinite(n)) return 50;
  return Math.min(98, Math.max(20, Math.round(n)));
}

function normalizeSeverity(s: string): DiagnosisResult["severity"] {
  const lower = s.toLowerCase();
  if (lower.includes("high")) return "High";
  if (lower.includes("low")) return "Low";
  return "Medium";
}

function toDiagnosisResult(raw: GeminiRawResponse, cropSlug: string): DiagnosisResult {
  return {
    diseaseName: raw.diseaseName?.trim() || "अज्ञात समस्या",
    pathogen: raw.pathogen?.trim() || "—",
    confidence: clampConfidence(raw.confidence),
    severity: normalizeSeverity(raw.severity),
    stage: raw.stage?.trim() || "—",
    riskLevel: raw.riskLevel?.trim() || "—",
    whyItHappens: Array.isArray(raw.whyItHappens) ? raw.whyItHappens.filter(Boolean) : [],
    environmentalFactors: Array.isArray(raw.environmentalFactors)
      ? raw.environmentalFactors.filter(Boolean)
      : [],
    treatments: Array.isArray(raw.treatments) ? raw.treatments.filter(Boolean) : [],
    activeIngredients: Array.isArray(raw.activeIngredients)
      ? raw.activeIngredients.map((a) => ({
          name: a.name || "—",
          dose: a.dose || "—",
          fracIrac: a.fracIrac || "—",
        }))
      : [],
    prevention: Array.isArray(raw.prevention) ? raw.prevention.filter(Boolean) : [],
    cropContext: raw.cropContext?.trim() || cropLabel(cropSlug),
    visualObservations: raw.visualObservations?.trim(),
    source: "gemini",
  };
}

async function callGeminiModel(
  model: string,
  apiKey: string,
  prompt: string,
  imageBase64: string,
  mimeType: string
): Promise<GeminiRawResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw parseGeminiError(res.status, errBody);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return JSON.parse(text) as GeminiRawResponse;
}

export async function analyzePlantPhotoWithGemini(
  imageBase64: string,
  mimeType: string,
  cropSlug: string
): Promise<DiagnosisResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY सेट नहीं है। .env.local में key add करें — Google AI Studio से free key मिलती है।"
    );
  }

  const prompt = buildPrompt(cropSlug);
  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    try {
      const raw = await callGeminiModel(model, apiKey, prompt, imageBase64, mimeType);

      if (!raw.isValidPlantPhoto) {
        throw new Error(
          raw.rejectionReason?.trim() ||
            "यह plant/crop की photo नहीं लग रही। पत्ती, stem या फसल की clear photo upload करें।"
        );
      }

      return toDiagnosisResult(raw, cropSlug);
    } catch (err) {
      if (err instanceof Error && err.message.includes("plant/crop")) {
        throw err;
      }
      if (err instanceof Error && (err.message.startsWith("GEMINI_API_KEY") || err.message.includes("limit poori"))) {
        throw err;
      }
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  if (lastError?.message.startsWith("MODEL_NOT_FOUND")) {
    throw new Error("AI Doctor server update ho chuka hai — page refresh karke dubara try karein.");
  }

  throw lastError ?? new Error("Gemini analysis failed");
}
