/**
 * Batch-translate farmer DATA JSON strings EN → सरल हिंदी via Gemini.
 * Keeps Latin names, chemical technical names, doses, IDs, URLs.
 *
 * Usage: node scripts/translate-data-hi.mjs [file...]
 */
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnvLocal();

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY missing");
  process.exit(1);
}

const SKIP_KEYS = new Set([
  "id",
  "slug",
  "emoji",
  "icon",
  "image",
  "coverImage",
  "technical",
  "dose",
  "dose_per_acre",
  "iracGroup",
  "irac_group",
  "fracGroup",
  "frac_group",
  "scientificName",
  "scientific_name",
  "pathogen",
  "symbol",
  "lang",
  "href",
  "url",
  "type",
  "source",
  "season", // may translate separately
]);

const DEVANAGARI = /[\u0900-\u097F]/;
const LATINISH = /[A-Za-z]{3,}/;

function shouldTranslateKey(key) {
  if (!key) return true;
  if (SKIP_KEYS.has(key)) return false;
  if (/(_id|Id|URL|Url|Href|Slug)$/.test(key)) return false;
  if (key.endsWith("_hi") || key.endsWith("Hi") || key.endsWith("HI")) return false;
  return true;
}

function looksEnglishProse(s) {
  if (typeof s !== "string") return false;
  const t = s.trim();
  if (t.length < 8) return false;
  if (DEVANAGARI.test(t) && !LATINISH.test(t.replace(/\b(N|P|K|Zn|Fe|B|Ca|Mg|S|SC|WP|EC|WG|SL|SP|DAS|DAT|ETL|IRAC|FRAC|pH)\b/g, ""))) {
    return false;
  }
  if (!/[A-Za-z]{4,}/.test(t)) return false;
  if (/^https?:\/\//i.test(t)) return false;
  if (/^\/[a-z0-9_\-./]+$/i.test(t)) return false;
  if (/^[A-Z0-9%.\-+\s/@]+$/.test(t) && t.length < 40) return false; // dose-like
  return true;
}

function collectPaths(node, base = [], out = []) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectPaths(v, base.concat(i), out));
    return out;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (!shouldTranslateKey(k)) continue;
      collectPaths(v, base.concat(k), out);
    }
    return out;
  }
  if (typeof node === "string" && looksEnglishProse(node)) {
    out.push({ path: base, text: node });
  }
  return out;
}

function getAt(root, p) {
  let cur = root;
  for (const k of p) cur = cur[k];
  return cur;
}

function setAt(root, p, value) {
  let cur = root;
  for (let i = 0; i < p.length - 1; i++) cur = cur[p[i]];
  cur[p[p.length - 1]] = value;
}

async function translateBatch(texts) {
  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `You translate farmer agriculture app content from English to सरल हिंदी (Devanagari).

Rules:
- Output ONLY a JSON array of strings, same length/order as input.
- Keep Latin scientific names, chemical technical names, IRAC/FRAC codes, doses, %, units (ml/L, g/ha), product brand names in English inside Hindi sentences.
- No Roman Hinglish. Use Devanagari for Hindi words.
- Keep meaning accurate for Indian farmers.
- Do not wrap in markdown.

INPUT JSON ARRAY:
${JSON.stringify(texts)}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data?.error || data).slice(0, 400));
  }
  let raw = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start < 0 || end < 0) throw new Error("No JSON array in response: " + raw.slice(0, 200));
  const arr = JSON.parse(raw.slice(start, end + 1));
  if (!Array.isArray(arr) || arr.length !== texts.length) {
    throw new Error(`Length mismatch: got ${arr?.length}, expected ${texts.length}`);
  }
  return arr.map((x) => String(x));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function translateFile(filePath) {
  const abs = path.resolve(filePath);
  console.log("\n===", abs);
  const raw = fs.readFileSync(abs, "utf8");
  const json = JSON.parse(raw);
  const items = collectPaths(json);
  console.log("strings to translate:", items.length);
  if (!items.length) return;

  const batches = chunk(items, 18);
  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    const texts = batch.map((b) => b.text);
    process.stdout.write(`  batch ${bi + 1}/${batches.length} (${texts.length})... `);
    let tries = 0;
    for (;;) {
      try {
        const translated = await translateBatch(texts);
        translated.forEach((hi, i) => setAt(json, batch[i].path, hi));
        console.log("ok");
        break;
      } catch (e) {
        tries++;
        console.log("fail", e.message?.slice(0, 120));
        if (tries >= 3) throw e;
        await new Promise((r) => setTimeout(r, 2000 * tries));
      }
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  fs.writeFileSync(abs, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log("wrote", abs);
}

const files = process.argv.slice(2);
const defaults = [
  "data/imports/agriveda-paddy-field-guide.json",
  "data/imports/agriveda-cucumber-field-guide.json",
  "data/imports/agriveda-ipm-batch.json",
  "data/imports/agriveda-weeds-abiotic-batch.json",
  "data/imports/agriveda-nutrient-deficiency-batch.json",
  "data/imports/agriveda-batch-2-priority-crops.json",
];

const list = files.length ? files : defaults;
for (const f of list) {
  await translateFile(f);
}
console.log("\nDONE");
