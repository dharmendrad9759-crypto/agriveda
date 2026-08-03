/**
 * Translate agriveda-nutrient-deficiency-batch.json to सरल हिंदी (Devanagari).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "data/imports/agriveda-nutrient-deficiency-batch.json");
const OUT = SRC;
const CACHE = path.join(ROOT, ".tmp/nutrient-hi-translation-cache-v2.json");

const SKIP_KEYS = new Set([
  "slug", "symbol", "name", "exportVersion", "compiledAt", "sourceDocuments",
  "references", "fertilizer", "nutrientContent", "schemaVersion", "lastUpdated",
  "verified", "source", "crop",
]);

const KEEP_VALUE_KEYS = new Set([
  "soilApplicationDose", "foliarSprayDose", "fertigationDose", "waterQuantity",
  "numberOfApplications", "sprayInterval", "expectedRecoveryTime", "formsTakenUp",
]);

/** Multi-word / distinct tokens only — NO single-letter symbols (breaks English words) */
const PROTECT_PATTERNS = [
  /\bNeem-coated Urea\b/gi,
  /\bDi-ammonium Phosphate\b/gi,
  /\bCalcium Ammonium Nitrate\b/gi,
  /\bAmmonium Sulphate\b/gi,
  /\bPotassium Nitrate\b/gi,
  /\bCalcium Nitrate\b/gi,
  /\bCalcium Sulphate\b/gi,
  /\bBoronated NPK\b/gi,
  /\bWater-soluble\b/gi,
  /\bLeaf Colour Chart\b/gi,
  /\bSolubor\b/gi,
  /\bRhizobium\b/gi,
  /\bAzotobacter\b/gi,
  /\bAzospirillum\b/gi,
  /\bFeSO4\b/gi,
  /\bZnSO4\b/gi,
  /\bMnSO4\b/gi,
  /\bCuSO4\b/gi,
  /\bMgSO4\b/gi,
  /\bCa-EDTA\b/gi,
  /\bCaNO3\b/gi,
  /\bKNO3\b/gi,
  /\bH3BO3\b/gi,
  /\bBO3\^3-\b/gi,
  /\bP2O5\b/gi,
  /\bK2O\b/gi,
  /\bCAN\b/g,
  /\bDAP\b/g,
  /\bSSP\b/g,
  /\bMOP\b/g,
  /\bNPK\b/g,
  /\bFYM\b/g,
  /\bBER\b/g,
  /\bLCC\b/g,
  /\bSPAD\b/g,
  /\bEDTA\b/gi,
  /\bPOPS\b/g,
  /\bIMMOBILE\b/gi,
  /\bUrea\b/gi,
  /\bGypsum\b/gi,
  /\bBorax\b/gi,
  /\bBoric acid\b/gi,
  /\bDolomite\b/gi,
  /\bVermicompost\b/gi,
  /\bFertigation\b/gi,
  /\bFoliar\b/gi,
  /\bBasal\b/gi,
  /\bTop-dress\b/gi,
  /\bBroadcast\b/gi,
  /\bDrip\b/gi,
  /\bMulch\b/gi,
  /\bPolyhouse\b/gi,
  /\bChlorosis\b/gi,
  /\bLodging\b/gi,
  /\bButtoning\b/gi,
  // Dose patterns
  /\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:%|kg|g|L|ml|t)\/(?:acre|L|acres?)\b/gi,
  /\d+(?:\.\d+)?\s*%\s*\([^)]+\)/g,
  /\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:kg|g|L|ml|t)\/acre\b/gi,
  /\b\d+(?:\.\d+)?\s*%\b/g,
  /\bNA\b/g,
];

function protectTerms(text) {
  const placeholders = [];
  let out = text;
  for (const re of PROTECT_PATTERNS) {
    out = out.replace(re, (match) => {
      const id = placeholders.length;
      placeholders.push(match);
      return `\uE000${id}\uE001`;
    });
  }
  return { text: out, placeholders };
}

function restoreTerms(text, placeholders) {
  return text.replace(/\uE000(\d+)\uE001/g, (_, i) => placeholders[Number(i)] ?? _);
}

async function translateText(text, sourceLang = "en") {
  if (!text?.trim()) return text;
  if (/^[\d\s.\-+%()/NA:,]+$/i.test(text.trim())) return text;

  const { text: protectedText, placeholders } = protectTerms(text);
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=hi&dt=t&q=` +
    encodeURIComponent(protectedText);

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const parsed = JSON.parse(await res.text());
      const translated = parsed[0]?.map((x) => x[0]).join("") ?? text;
      return restoreTerms(translated, placeholders);
    } catch {
      await sleep(600 * (attempt + 1));
    }
  }
  return text;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE, "utf8")); } catch { return {}; }
}

function saveCache(cache) {
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
}

function cacheKey(text, lang) {
  return `${lang}::${text}`;
}

function postProcessHi(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/पौधों/g, "पौध")
    .replace(/पौधे/g, "पौध")
    .replace(/कृषक/g, "किसान")
    .replace(/कृषकों/g, "किसान")
    .replace(/मृदा/g, "मिट्टी")
    .replace(/नाइट्रोजन/g, "N")
    .replace(/फास्फोरस/g, "P")
    .replace(/पोटेशियम/g, "K")
    .replace(/कैल्शियम/g, "Ca")
    .replace(/मैग्नीशियम/g, "Mg")
    .replace(/सल्फर/g, "S")
    .replace(/लोहा/g, "Fe")
    .replace(/जिंक/g, "Zn")
    .replace(/बोरॉन/g, "B")
    .replace(/तांबा/g, "Cu")
    .replace(/मैंगनीज/g, "Mn")
    .replace(/मॉलिब्डेनम/g, "Mo")
    .replace(/सिंचाई/g, "पानी देना")
    .replace(/सिंचन/g, "पानी");
}

function isRomanHinglish(s) {
  const latin = (s.match(/[A-Za-z]/g) || []).length;
  const dev = (s.match(/[\u0900-\u097F]/g) || []).length;
  return latin > 8 && dev < latin;
}

async function translateValue(key, value, cache, stats) {
  if (typeof value === "string") {
    if (SKIP_KEYS.has(key) || KEEP_VALUE_KEYS.has(key)) return value;
    const lang = (key === "q" || key === "a") && isRomanHinglish(value) ? "auto" : "en";
    const ck = cacheKey(value, lang);
    if (cache[ck]) { stats.cached++; return cache[ck]; }
    await sleep(100);
    const translated = postProcessHi(await translateText(value, lang));
    cache[ck] = translated;
    stats.translated++;
    if (stats.translated % 50 === 0) {
      saveCache(cache);
      process.stdout.write(`\rTranslated ${stats.translated} (+${stats.cached} cached)...`);
    }
    return translated;
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((v) => translateNode(v, null, cache, stats)));
  }
  if (value && typeof value === "object") {
    return translateNode(value, key, cache, stats);
  }
  return value;
}

async function translateNode(node, parentKey, cache, stats) {
  if (Array.isArray(node)) {
    return Promise.all(node.map((v) => translateNode(v, parentKey, cache, stats)));
  }
  if (!node || typeof node !== "object") return node;

  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (SKIP_KEYS.has(k) || KEEP_VALUE_KEYS.has(k)) {
      out[k] = v;
    } else if (typeof v === "string") {
      out[k] = await translateValue(k, v, cache, stats);
    } else {
      out[k] = await translateNode(v, k, cache, stats);
    }
  }
  return out;
}

function postProcessTree(node) {
  if (typeof node === "string") return postProcessHi(node);
  if (Array.isArray(node)) return node.map(postProcessTree);
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = (SKIP_KEYS.has(k) || KEEP_VALUE_KEYS.has(k) || k === "fertilizer")
        ? v : postProcessTree(v);
    }
    return out;
  }
  return node;
}

async function main() {
  // Clear bad v1 cache
  const data = JSON.parse(fs.readFileSync(SRC, "utf8"));
  const cache = loadCache();
  const stats = { translated: 0, cached: 0 };

  console.log(`Translating ${data.nutrients.length} nutrients (v2)...`);
  const translatedNutrients = [];
  for (const nutrient of data.nutrients) {
    console.log(`\n→ ${nutrient.slug}`);
    translatedNutrients.push(postProcessTree(await translateNode(nutrient, null, cache, stats)));
    saveCache(cache);
  }

  const out = { ...data, nutrients: translatedNutrients };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
  JSON.parse(fs.readFileSync(OUT, "utf8"));
  console.log(`\nDone. Translated: ${stats.translated}, cached: ${stats.cached}`);
  console.log("JSON.parse OK");
}

main().catch((e) => { console.error(e); process.exit(1); });
