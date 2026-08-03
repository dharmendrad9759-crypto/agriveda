/**
 * Translate weeds-abiotic batch, batch-2 priority crops, and pest-disease.ts
 * farmer prose EN → सरल हिंदी via Google Translate + term protection.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CACHE = path.join(ROOT, ".tmp/weeds-batch2-pest-hi-cache.json");

const PROTECT_PATTERNS = [
  /\b[A-Z][a-z]+(?:\s+[a-z]+){0,3}\s+\d+(?:\.\d+)?(?:%|\s*(?:SC|WP|EC|WG|SL|SP|FS|SG|WDG|L|G))\b/g,
  /\b(?:Carbendazim|Thiram|Thiamethoxam|Emamectin|Chlorantraniliprole|Buprofezin|Pymetrozine|Triflumezopyrim|Cartap|Flubendiamide|Spinosad|Imidacloprid|Tricyclazole|Isoprothiolane|Validamycin|Hexaconazole|Streptocycline|Copper oxychloride|Mancozeb|Propiconazole|Tebuconazole|Carboxin|Dimethoate|Chlorpyrifos|Quinalphos|Indoxacarb|HaNPV|Metalaxyl|Carbofuran|Tembotrione|Halosulfuron|Pendimethalin|Clodinafop|Metsulfuron|Atrazine|Alachlor|Metribuzin|Rimsulfuron|Glyphosate|Oxyfluorfen|Quizalofop|Imazethapyr|Fipronil|Spinetoram|Azadirachtin|Diafenthiuron|Pyriproxyfen|Acetamiprid|Abamectin|Spiromesifen|Novaluron|Malathion|Iprodione|Neem oil|Bordeaux paste|Wettable sulphur|Trichoderma|Rhizobium|PSB|Ferrous sulphate|Zinc sulphate|ZnSO4|FeSO4|MgSO4|KNO3|Urea|Gypsum|DAP|MOP|NPK|FYM)\b(?:\s+\d+(?:\.\d+)?(?:%|\s*(?:SC|WP|EC|WG|SL|SP|FS|SG|WDG))?)?/gi,
  /\b\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:%|kg|g|L|ml|t|q)\/(?:acre|ha|L|acres?|kg seed)\b/gi,
  /\b\d+(?:\.\d+)?\s*(?:ml|g|kg|L)\/L\b/gi,
  /\b@\s*\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:ml|g|kg|L|%)\/(?:L|ha|kg|acre)\b/gi,
  /\b(?:IRAC|FRAC|HRAC)\s+[\d\w+\/\s-]+/gi,
  /\b(?:PE|PoE|EPoE|DSR|DAT|DAS|DAP|DAP)\b/g,
  /\b[A-Z][a-z]+\s+[a-z]+(?:\s+[a-z]+)?\s+(?:\d+(?:\.\d+)?%?\s*(?:SC|WP|EC|WG|SL|SP|FS|SG|WDG)?)/gi,
  /\b(?:Pretilachlor|Bispyribac|Pyrazosulfuron|Pendimethalin|Cyhalofop|Ethoxysulfuron|Atrazine|Tembotrione|Topramezone|2,4-D|Halosulfuron|Imazamox|Diclosulam|Fluchloralin|Quizalofop|Ethoxysulfuron|Triazophos|Spinetoram|Azoxystrobin|Difenoconazole|Propiconazole|Hexaconazole|Carbendazim|Metalaxyl|Streptocycline|Bordeaux|Epiricania|Trichogramma|Cryptolaemus|SlNPV|Bt cotton|Sub1|CSR-\d+|Swarna-Sub1|JS-\d+-\d+|ZnSO4|FeSO4|MgSO4|KNO3|Zn|Fe|Mg|N|P|K|pH|EC|MoA|ETL|PHI|YMV|BLW|tungro|NPV|FS|BBF|PoP|MSP|Rs|MOP|CAN|LCC)\b/gi,
  /\b[A-Z][a-z]*(?:\/[A-Z][a-z]*)+\b/g,
  /\b(?:Oryza sativa|Zea mays|Glycine max|Echinochloa|Cyperus|Monochoria|Digitaria|Phalaris|Chenopodium|Parthenium|Trianthema|Commelina|Amaranthus|Celosia|Eleusine|Leptochloa|Ischaemum|Ammania|Ludwigia|Nilaparvata|Scirpophaga|Spodoptera|Helicoverpa|Bemisia|Rhizoctonia|Magnaporthe|Xanthomonas|Fusarium|Pythium|Alternaria|Phytophthora|Colletotrichum|Ustilaginoidea|Bipolaris|Puccinia|Tilletia|Exserohilum|Claviceps|Sclerospora|Atherigona|Chilo|Coniesta|Agrotis|Phthorimaea|Myzus|Odontotermes|Sitobion|Nephotettix|Cnaphalocrocis|Melanagromyza|Oberea|Chrysodeixis|Lipaphis|Bagrada|Athalia|Albugo|Sclerotinia|Cercospora|Callosobruchus|Idioscopus|Bactrocera|Drosicha|Oidium|Lasiodiplodia|Pentalonia|Cosmopolites|Chaetanaphothrips|Mycosphaerella|Plasmopara|Erysiphe|Elsinoe|Scirtothrips|Altica|Maconellicoccus|Phakopsora|Macrophomina|Pectinophora|Amrasca|Scirpophaga|Pyrilla|Colletotrichum falcatum|Sporisorium|Begomovirus|Leveillula|Ralstonia|Stemphylium|Delia|Liriomyza|Aphis|Polyphagotarsonemus|Melanagromyza|Obereopsis|Phakopsora pachyrhizi)\b(?:\s+[a-z]+(?:\s+[a-z]+)?)?/gi,
  /\b\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:DAS|DAT|DAP|DAP|days?|wk|weeks?)\b/gi,
  /\b(?:mid-June|early July|Kharif|Rabi|Zaid|quintal|qtl|Rs \d+)\b/gi,
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
  if (/^[\d\s.\-+%()/NA:,;—–\-]+$/.test(text.trim())) return text;
  if (/^[\u0900-\u097F\s\d.,;:!?\-—–()]+$/.test(text.trim()) && !/[A-Za-z]{5,}/.test(text)) return text;

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
      await sleep(500 * (attempt + 1));
    }
  }
  return text;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
}

function postProcessHi(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/कृषक/g, "किसान")
    .replace(/कृषकों/g, "किसान")
    .replace(/मृदा/g, "मिट्टी")
    .replace(/फसलों/g, "फसल")
    .replace(/पौधों/g, "पौध")
    .replace(/खरपतवारों/g, "खरपतवार")
    .replace(/ कीट /g, " कीट ")
    .replace(/spray/gi, "spray")
    .replace(/yield/gi, "उपज");
}

async function cachedTranslate(text, cache, stats) {
  const key = `en::${text}`;
  if (cache[key]) {
    stats.cached++;
    return cache[key];
  }
  await sleep(120);
  const hi = postProcessHi(await translateText(text));
  cache[key] = hi;
  stats.translated++;
  if (stats.translated % 40 === 0) {
    saveCache(cache);
    process.stdout.write(`\r  translated ${stats.translated}, cached ${stats.cached}...`);
  }
  return hi;
}

function shouldTranslateString(key, value, context = {}) {
  if (typeof value !== "string") return false;
  const t = value.trim();
  if (t.length < 3) return false;
  if (/^https?:\/\//.test(t)) return false;

  const skipKeys = new Set([
    "exportVersion", "compiledAt", "sourceDocuments", "scientificName",
    "technical", "dose", "slug", "emoji", "image", "id", "status", "das",
    "activeIngredient", "herbicide", "hrac", "irac", "frac", "phi",
    "pathogen", "name", "hindiName", "type", "symbol", "references",
    "duration", "yield", "season", "verified", "schemaVersion", "lastUpdated",
    "iracGroup", "fracGroup", "scientific_name", "preEmergence", "postEmergence",
  ]);

  if (skipKeys.has(key)) return false;

  // pest-disease: always translate control & culturalControl
  if (key === "control" || key === "culturalControl") return /[A-Za-z]{3,}/.test(t);

  // stage: translate if descriptive English (not just chemical codes)
  if (key === "stage") {
    if (/[\u0900-\u097F]/.test(t) && !/[A-Za-z]{6,}/.test(t)) return false;
    return /[A-Za-z]{4,}/.test(t);
  }

  // Already mostly Hindi
  if (/[\u0900-\u097F]/.test(t)) {
    const latin = (t.match(/[A-Za-z]/g) || []).length;
    const dev = (t.match(/[\u0900-\u097F]/g) || []).length;
    if (dev > latin * 2) return false;
  }

  if (!/[A-Za-z]{4,}/.test(t)) return false;
  if (/^[\d\s\-–—/().%,@+]+$/.test(t)) return false;

  return true;
}

async function walkTranslate(node, cache, stats, parentKey = "") {
  if (typeof node === "string") {
    if (shouldTranslateString(parentKey, node)) {
      return cachedTranslate(node, cache, stats);
    }
    return node;
  }
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) {
      if (typeof item === "string" && shouldTranslateString(parentKey, item)) {
        out.push(await cachedTranslate(item, cache, stats));
      } else {
        out.push(await walkTranslate(item, cache, stats, parentKey));
      }
    }
    return out;
  }
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "string" && shouldTranslateString(k, v, { parentKey })) {
        out[k] = await cachedTranslate(v, cache, stats);
      } else if (typeof v === "object" && v !== null) {
        out[k] = await walkTranslate(v, cache, stats, k);
      } else {
        out[k] = v;
      }
    }
    return out;
  }
  return node;
}

async function translateJsonFile(relPath, cache, stats) {
  const abs = path.join(ROOT, relPath);
  console.log(`\n=== ${relPath}`);
  const data = JSON.parse(fs.readFileSync(abs, "utf8"));
  const translated = await walkTranslate(data, cache, stats);
  fs.writeFileSync(abs, JSON.stringify(translated, null, 2) + "\n", "utf8");
  JSON.parse(fs.readFileSync(abs, "utf8"));
  console.log(`\n  wrote ${relPath} — JSON.parse OK`);
}

async function translatePestDisease(cache, stats) {
  const abs = path.join(ROOT, "data/pest-disease.ts");
  console.log("\n=== data/pest-disease.ts");
  let src = fs.readFileSync(abs, "utf8");

  const re = /(control|culturalControl|stage):\s*"((?:\\.|[^"\\])*)"/g;
  const matches = [...src.matchAll(re)];
  console.log(`  fields to check: ${matches.length}`);

  for (const m of matches) {
    const key = m[1];
    const raw = m[2].replace(/\\"/g, '"');
    if (!shouldTranslateString(key, raw)) continue;
    const hi = await cachedTranslate(raw, cache, stats);
    if (hi === raw) continue;
    const escaped = hi.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    src = src.replace(m[0], `${key}: "${escaped}"`);
  }

  fs.writeFileSync(abs, src, "utf8");
  console.log("  wrote pest-disease.ts");
}

async function main() {
  const cache = loadCache();
  const stats = { translated: 0, cached: 0 };

  await translateJsonFile("data/imports/agriveda-weeds-abiotic-batch.json", cache, stats);
  saveCache(cache);

  await translateJsonFile("data/imports/agriveda-batch-2-priority-crops.json", cache, stats);
  saveCache(cache);

  await translatePestDisease(cache, stats);
  saveCache(cache);

  console.log(`\nDone. Translated: ${stats.translated}, cached: ${stats.cached}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
