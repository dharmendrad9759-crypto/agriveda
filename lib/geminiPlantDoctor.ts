import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import { AI_DOCTOR_CROPS, isOtherCrop } from "@/data/ai-doctor-crops";
import { buildKnowledgeContext } from "@/lib/knowledge/retrieve";

/** Ordered fallbacks — older 2.0/1.5 models were shut down June 2026 */
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"] as const;

export function getGeminiApiKey(): string | null {
  const raw = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || "";
  const key = raw.trim().replace(/^["']|["']$/g, "");
  return key.length > 0 ? key : null;
}

function cropLabel(slug: string): string {
  if (isOtherCrop(slug)) return "फसल AI द्वारा पहचानी गई";
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

function knowledgeBlockFor(cropSlug: string): string {
  if (isOtherCrop(cropSlug)) return "";
  const knowledge = buildKnowledgeContext({ cropSlug, maxChunks: 5 });
  return knowledge
    ? `\n\nREFERENCE KNOWLEDGE (ICAR PoP / diagnostic guides — use for doses and disease names):\n${knowledge.slice(0, 2500)}`
    : "";
}

function buildPhotoPrompt(cropSlug: string, symptoms?: string): string {
  const isOther = isOtherCrop(cropSlug);
  const crop = cropLabel(cropSlug);
  const knowledgeBlock = knowledgeBlockFor(cropSlug);
  const notes = symptoms?.trim();

  const cropLine = isOther
    ? `The farmer did NOT select a specific crop (chose "Other"). FIRST identify the crop/plant species from the photo yourself, then diagnose it. State the identified crop name (Hindi + English) at the start of the cropContext field.`
    : `The farmer selected crop: ${crop}`;

  const problemLine = isOther
    ? `If you see a problem, name the most likely pest, disease, or nutrient issue for the crop you identified from the photo, in the Indian context. Include the scientific pathogen/pest name in the pathogen field.`
    : `If you see a problem, name the most likely pest, disease, or nutrient issue for ${crop} in India. Include scientific pathogen/pest name in pathogen field.`;

  const notesBlock = notes
    ? `\n\nFarmer notes / symptoms (use as supporting context with the photo):\n${notes.slice(0, 500)}`
    : "";

  return `You are Agriveda AI Plant Doctor — an expert agronomist helping Indian farmers.

${cropLine}${knowledgeBlock}${notesBlock}

Analyze the uploaded photo carefully. Your answer MUST be based on what you ACTUALLY SEE in this specific image — not a generic template.

RULES:
1. If the image is NOT a crop/plant photo (person, animal, vehicle, food plate, wall, floor, unrelated object, or too blurry to see leaves), set isValidPlantPhoto=false and rejectionReason in simple Hindi (1-2 sentences).
2. If the plant looks healthy with no clear pest/disease/nutrient problem, set diseaseName to "स्वस्थ पौधा / कोई स्पष्ट समस्या नहीं" and give preventive care tips.
3. ${problemLine}
4. confidence: 0-100 based on image clarity and diagnostic certainty. Use below 55 if unsure.
5. severity: Low, Medium, or High only.
6. All farmer advice (whyItHappens, treatments, prevention, cropContext, riskLevel, stage) in SIMPLE HINDI. Technical chemical names can stay in English.
7. activeIngredients: only realistic, legal products used in Indian agriculture with practical doses (ml/L or g/L or kg/acre).
8. visualObservations: 2-3 sentences in Hindi describing exactly what you see in THIS photo (color of spots, pattern, affected part, etc.).
9. Do NOT copy generic text unrelated to the visible symptoms.

Return ONLY valid JSON matching the schema.`;
}

const SYMPTOM_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
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
      description: "Brief Hindi summary of the farmer-described symptoms used for this diagnosis",
    },
  },
  required: [
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

function buildSymptomsPrompt(cropSlug: string, symptoms: string): string {
  const isOther = isOtherCrop(cropSlug);
  const crop = cropLabel(cropSlug);
  const knowledgeBlock = knowledgeBlockFor(cropSlug);

  const cropLine = isOther
    ? `The farmer chose "Other" crop and described symptoms in text (no photo). Infer the crop from the notes if possible, otherwise give a general field-crop diagnosis and state assumptions in cropContext.`
    : `The farmer selected crop: ${crop}`;

  return `You are Agriveda AI Plant Doctor — an expert agronomist helping Indian farmers.

${cropLine}${knowledgeBlock}

The farmer did NOT upload a photo. Diagnose from their symptom description only:

"""
${symptoms.slice(0, 800)}
"""

RULES:
1. Base the diagnosis on the described symptoms for Indian farming conditions — not a generic template.
2. confidence: 0-100; typically 40-70 without a photo. Use below 50 if symptoms are vague.
3. severity: Low, Medium, or High only.
4. All farmer advice (whyItHappens, treatments, prevention, cropContext, riskLevel, stage) in SIMPLE HINDI. Technical chemical names can stay in English.
5. activeIngredients: only realistic, legal products used in Indian agriculture with practical doses (ml/L or g/L or kg/acre).
6. visualObservations: 1-2 sentences in Hindi summarizing the symptoms the farmer described.
7. If symptoms are too vague to diagnose, set diseaseName to "अधिक जानकारी चाहिए" and ask for clearer symptoms or a photo in treatments.

Return ONLY valid JSON matching the schema.`;
}

interface GeminiRawResponse {
  isValidPlantPhoto?: boolean;
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
      "GEMINI_API_KEY galat ya expired hai. Google AI Studio (aistudio.google.com) se nayi key banayein — AIzaSy ya AQ. format dono valid hain."
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

async function callGeminiGenerate(
  model: string,
  apiKey: string,
  prompt: string,
  responseSchema: object,
  image?: { base64: string; mimeType: string }
): Promise<GeminiRawResponse> {
  // Native Gemini endpoint — supports both legacy AIzaSy and new AQ. auth keys
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const parts: Array<Record<string, unknown>> = [{ text: prompt }];
  if (image) {
    parts.push({ inline_data: { mime_type: image.mimeType, data: image.base64 } });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema,
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

async function runGeminiWithFallbacks(
  run: (model: string, apiKey: string) => Promise<DiagnosisResult>
): Promise<DiagnosisResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY सेट नहीं है। .env.local में key add करें — Google AI Studio से free key मिलती है।"
    );
  }

  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    try {
      return await run(model, apiKey);
    } catch (err) {
      if (err instanceof Error && err.message.includes("plant/crop")) {
        throw err;
      }
      if (err instanceof Error && err.message.includes("पत्ती")) {
        throw err;
      }
      if (
        err instanceof Error &&
        (err.message.startsWith("GEMINI_API_KEY") || err.message.includes("limit poori"))
      ) {
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

export async function analyzePlantPhotoWithGemini(
  imageBase64: string,
  mimeType: string,
  cropSlug: string,
  symptoms?: string
): Promise<DiagnosisResult> {
  const prompt = buildPhotoPrompt(cropSlug, symptoms);

  return runGeminiWithFallbacks(async (model, apiKey) => {
    const raw = await callGeminiGenerate(model, apiKey, prompt, RESPONSE_SCHEMA, {
      base64: imageBase64,
      mimeType,
    });

    if (!raw.isValidPlantPhoto) {
      throw new Error(
        raw.rejectionReason?.trim() ||
          "यह plant/crop की photo नहीं लग रही। पत्ती, stem या फसल की clear photo upload करें।"
      );
    }

    return toDiagnosisResult(raw, cropSlug);
  });
}

/** Text-only diagnosis when the farmer skips photo upload. */
export async function analyzeSymptomsWithGemini(
  symptoms: string,
  cropSlug: string
): Promise<DiagnosisResult> {
  const notes = symptoms.trim();
  if (!notes) {
    throw new Error("Symptoms likhein ya photo upload karein");
  }

  const prompt = buildSymptomsPrompt(cropSlug, notes);

  return runGeminiWithFallbacks(async (model, apiKey) => {
    const raw = await callGeminiGenerate(model, apiKey, prompt, SYMPTOM_RESPONSE_SCHEMA);
    return toDiagnosisResult(raw, cropSlug);
  });
}
