import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import { AI_DOCTOR_CROPS, isOtherCrop } from "@/data/ai-doctor-crops";
import { buildKnowledgeContext } from "@/lib/knowledge/retrieve";
import { sanitizeDiagnosisForFarmer } from "@/lib/aiDoctorSanitize";
import { enrichMedicineDisplay } from "@/lib/aiDoctorMedicineBrands";

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
    problemType: {
      type: "string",
      enum: [
        "pest",
        "fungal",
        "bacterial",
        "viral",
        "nutrient",
        "abiotic",
        "healthy",
        "unknown",
      ],
      description:
        "pest=insect/mite; fungal/bacterial/viral=disease; nutrient=deficiency; abiotic=weather/water; healthy=no problem",
    },
    diseaseName: { type: "string" },
    pathogen: { type: "string" },
    confidence: { type: "number" },
    severity: { type: "string", enum: ["Low", "Medium", "High"] },
    stage: { type: "string" },
    riskLevel: { type: "string" },
    whyItHappens: { type: "array", items: { type: "string" } },
    environmentalFactors: { type: "array", items: { type: "string" } },
    treatments: {
      type: "array",
      items: { type: "string" },
      description:
        "Hindi CULTURAL / field steps ONLY. No chemical names, brands, or ml/L doses.",
    },
    activeIngredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "Full technical + formulation, e.g. Hexaconazole 5% SC — not just Hexaconazole",
          },
          dose: { type: "string" },
          fracIrac: { type: "string" },
          brands: {
            type: "array",
            items: { type: "string" },
            description:
              "2-3 real Indian shop brand names (e.g. Contaf Plus, Folicur) farmers can ask for in bazaar",
          },
        },
        required: ["name", "dose", "fracIrac", "brands"],
      },
      description: "ALL spray medicines with dose + market brands — never put these in treatments",
    },
    spraySticker: {
      type: "string",
      description:
        "Hindi: spray sticker/spreader with dose (ml/L). Empty if not spraying.",
    },
    recoveryTonics: {
      type: "array",
      items: { type: "string" },
      description:
        "ONLY fungal/bacterial/viral: seaweed/humic/micronutrient/plant tonics with dose. EMPTY for pest-only, healthy, nutrient, abiotic.",
    },
    prevention: { type: "array", items: { type: "string" } },
    cropContext: { type: "string" },
    visualObservations: {
      type: "string",
      description:
        "1-2 short Hindi sentences: what is visible on the plant. No English jargon.",
    },
  },
  required: [
    "isValidPlantPhoto",
    "rejectionReason",
    "problemType",
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
    "spraySticker",
    "recoveryTonics",
    "prevention",
    "cropContext",
    "visualObservations",
  ],
};

function knowledgeBlockFor(cropSlug: string): string {
  if (isOtherCrop(cropSlug)) return "";
  const knowledge = buildKnowledgeContext({ cropSlug, maxChunks: 8 });
  return knowledge
    ? `\n\nREFERENCE KNOWLEDGE (ICAR PoP / diagnostic guides — prefer these names & doses when symptoms match):\n${knowledge.slice(0, 4000)}`
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

  return `You are Agriveda AI Plant Doctor — accuracy is critical. Ground every claim in the PHOTO + REFERENCE KNOWLEDGE.

${cropLine}${knowledgeBlock}${notesBlock}

Analyze the uploaded photo carefully. Answer MUST match what you ACTUALLY SEE — not a generic crop template.

ACCURACY:
A. Match visible symptoms to ONE most likely diagnosis. If unsure between 2, pick the better match and set confidence below 60.
B. Prefer disease/pest names from REFERENCE KNOWLEDGE when they fit.
C. Do NOT invent symptoms that are not visible. Do NOT pick a random common disease for the crop.
D. Set problemType exactly: pest | fungal | bacterial | viral | nutrient | abiotic | healthy | unknown.

SEPARATION (farmer UI):
1. treatments = ONLY cultural/field steps in simple Hindi (पत्ती काटना, दूरी, पानी, जाल, उखाड़ना). NEVER medicine names, brands, or ml/L.
2. activeIngredients = ALL दवा with practical Indian doses. name MUST be full technical + %.formulation (e.g. "Hexaconazole 5% SC"). brands = 2-3 real Indian shop names (Contaf Plus, Folicur, Tilt…) so farmer can ask in bazaar.
3. recoveryTonics = ONLY if problemType is fungal, bacterial, or viral (seaweed/humic/micronutrient/plant tonics). EMPTY for pest-only, healthy, nutrient, abiotic.
4. Virus: NO direct chemical cure. treatments = rogue + hygiene; activeIngredients = VECTOR control; recoveryTonics OK for vigor — never claim virus cure.
5. Pest-only: recoveryTonics MUST be [].

OTHER:
1. Non-plant photo → isValidPlantPhoto=false + Hindi rejectionReason.
2. Healthy plant → problemType=healthy, diseaseName="स्वस्थ पौधा / कोई स्पष्ट समस्या नहीं", empty activeIngredients + recoveryTonics.
3. ${problemLine}
4. confidence 0-100; below 55 if unsure.
5. severity: Low | Medium | High.
6. Farmer text in SIMPLE HINDI; chemical names OK inside activeIngredients.name.
7. spraySticker when spraying; else empty.
8. visualObservations: 1-2 short Hindi sentences of visible signs only.
9. Never recommend banned actives (Endosulfan, Phorate, Dichlorvos, Monocrotophos on vegetables, Methomyl on fruits/veg, Carbofuran). Prefer labelled modern MoA.
10. If 2 photos provided, use BOTH.

Return ONLY valid JSON matching the schema.`;
}

const SYMPTOM_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    problemType: {
      type: "string",
      enum: [
        "pest",
        "fungal",
        "bacterial",
        "viral",
        "nutrient",
        "abiotic",
        "healthy",
        "unknown",
      ],
    },
    diseaseName: { type: "string" },
    pathogen: { type: "string" },
    confidence: { type: "number" },
    severity: { type: "string", enum: ["Low", "Medium", "High"] },
    stage: { type: "string" },
    riskLevel: { type: "string" },
    whyItHappens: { type: "array", items: { type: "string" } },
    environmentalFactors: { type: "array", items: { type: "string" } },
    treatments: {
      type: "array",
      items: { type: "string" },
      description: "Cultural/field steps only — no medicine names",
    },
    activeIngredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Full technical + formulation, e.g. Tebuconazole 25.9% EC",
          },
          dose: { type: "string" },
          fracIrac: { type: "string" },
          brands: {
            type: "array",
            items: { type: "string" },
            description: "2-3 Indian market brand names",
          },
        },
        required: ["name", "dose", "fracIrac", "brands"],
      },
    },
    spraySticker: {
      type: "string",
      description:
        "Hindi: spray sticker/spreader with dose. Empty if not needed.",
    },
    recoveryTonics: {
      type: "array",
      items: { type: "string" },
      description:
        "Only fungal/bacterial/viral. Empty for pest-only / healthy / nutrient / abiotic.",
    },
    prevention: { type: "array", items: { type: "string" } },
    cropContext: { type: "string" },
    visualObservations: {
      type: "string",
      description: "Brief Hindi summary of the farmer-described symptoms",
    },
  },
  required: [
    "problemType",
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
    "spraySticker",
    "recoveryTonics",
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

  return `You are Agriveda AI Plant Doctor — accuracy first. Diagnose from symptoms + REFERENCE KNOWLEDGE for Indian farming.

${cropLine}${knowledgeBlock}

The farmer did NOT upload a photo. Diagnose from their symptom description only:

"""
${symptoms.slice(0, 800)}
"""

RULES:
1. Prefer knowledge-base disease/pest names that match. Do not invent.
2. confidence: 0-100; typically 40-70 without a photo. Below 50 if vague.
3. problemType: pest | fungal | bacterial | viral | nutrient | abiotic | healthy | unknown.
4. treatments = cultural steps ONLY (no medicine names). activeIngredients = medicines with full name+formulation, dose, and 2-3 bazaar brand names.
5. recoveryTonics ONLY for fungal/bacterial/viral; empty for pest-only.
6. Virus: no direct cure; vector control in activeIngredients; rogue plants in treatments.
7. All farmer advice in SIMPLE HINDI. Chemical names OK in activeIngredients.name.
8. If too vague: diseaseName="अधिक जानकारी चाहिए", ask for photo in treatments.

Return ONLY valid JSON matching the schema.`;
}

interface GeminiRawResponse {
  isValidPlantPhoto?: boolean;
  rejectionReason?: string;
  problemType?: DiagnosisResult["problemType"];
  diseaseName: string;
  pathogen: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  stage: string;
  riskLevel: string;
  whyItHappens: string[];
  environmentalFactors: string[];
  treatments: string[];
  activeIngredients: { name: string; dose: string; fracIrac: string; brands?: string[] }[];
  spraySticker?: string;
  recoveryTonics?: string[];
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
  const base: DiagnosisResult = {
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
      ? raw.activeIngredients.map((a) =>
          enrichMedicineDisplay({
            name: a.name || "—",
            dose: a.dose || "—",
            fracIrac: a.fracIrac || "—",
            brands: Array.isArray((a as { brands?: string[] }).brands)
              ? (a as { brands?: string[] }).brands
              : [],
          })
        )
      : [],
    spraySticker: raw.spraySticker?.trim() || undefined,
    recoveryTonics: Array.isArray(raw.recoveryTonics)
      ? raw.recoveryTonics.map((t) => String(t).trim()).filter(Boolean)
      : [],
    prevention: Array.isArray(raw.prevention) ? raw.prevention.filter(Boolean) : [],
    cropContext: raw.cropContext?.trim() || cropLabel(cropSlug),
    visualObservations: raw.visualObservations?.trim(),
    problemType: raw.problemType,
    source: "gemini",
  };
  return sanitizeDiagnosisForFarmer(base);
}

async function callGeminiGenerate(
  model: string,
  apiKey: string,
  prompt: string,
  responseSchema: object,
  images?: { base64: string; mimeType: string }[]
): Promise<GeminiRawResponse> {
  // Native Gemini endpoint — supports both legacy AIzaSy and new AQ. auth keys
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const parts: Array<Record<string, unknown>> = [{ text: prompt }];
  for (const image of images ?? []) {
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
        temperature: 0.2,
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
  symptoms?: string,
  secondImage?: { base64: string; mimeType: string }
): Promise<DiagnosisResult> {
  const prompt = buildPhotoPrompt(cropSlug, symptoms);
  const images = [{ base64: imageBase64, mimeType }];
  if (secondImage?.base64) images.push(secondImage);

  return runGeminiWithFallbacks(async (model, apiKey) => {
    const raw = await callGeminiGenerate(model, apiKey, prompt, RESPONSE_SCHEMA, images);

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
