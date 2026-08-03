/** Translate remaining English arrays: prevention, commonFarmerMistakes, expertTips. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP = path.join(__dirname, "../.tmp/agriveda-nutrient-deficiency-batch.en.bak.json");
const FILE = path.join(__dirname, "../data/imports/agriveda-nutrient-deficiency-batch.json");
const CACHE = path.join(__dirname, "../.tmp/nutrient-hi-missing-cache.json");

const FIELDS = ["prevention", "commonFarmerMistakes", "expertTips"];

const PROTECT = [
  /\bNeem-coated Urea\b/gi, /\bDAP\b/g, /\bSSP\b/g, /\bUrea\b/gi, /\bBorax\b/gi,
  /\bGypsum\b/gi, /\bSolubor\b/gi, /\bCAN\b/g, /\bNPK\b/g, /\bKNO3\b/g,
  /\bFeSO4\b/g, /\bZnSO4\b/g, /\bMnSO4\b/g, /\bCuSO4\b/g, /\bMgSO4\b/g,
  /\bCaNO3\b/g, /\bCa-EDTA\b/g, /\bFe-EDDHA\b/gi, /\bRhizobium\b/gi,
  /\bFoliar\b/gi, /\bBasal\b/gi, /\bFertigation\b/gi, /\bLCC\b/g,
  /\bIMMOBILE\b/gi, /\bBER\b/g, /\bSOP\b/g, /\bMOP\b/g, /\bFYM\b/g,
  /\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:%|kg|g|L)\/(?:acre|L)\b/gi,
  /\d+(?:\.\d+)?\s*%\s*\([^)]+\)/g, /\d+(?:\.\d+)?\s*%\b/g,
];

function protect(text) {
  const ph = [];
  let out = text;
  for (const re of PROTECT) {
    out = out.replace(re, (m) => {
      const id = ph.length;
      ph.push(m);
      return `\uE000${id}\uE001`;
    });
  }
  return { out, ph };
}

function restore(text, ph) {
  return text.replace(/\uE000(\d+)\uE001/g, (_, i) => ph[Number(i)] ?? _);
}

function isMostlyEnglish(s) {
  const e = (s.match(/[A-Za-z]/g) || []).length;
  const d = (s.match(/[\u0900-\u097F]/g) || []).length;
  return e > d + 10;
}

async function tr(text) {
  const { out, ph } = protect(text);
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=" +
    encodeURIComponent(out);
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url);
      const parsed = JSON.parse(await res.text());
      return restore(parsed[0]?.map((x) => x[0]).join("") ?? text, ph);
    } catch {
      await sleep(500 * (i + 1));
    }
  }
  return text;
}

function post(s) {
  return s
    .replace(/नाइट्रोजन/g, "N").replace(/बोरॉन/g, "B").replace(/बोरोन/g, "B")
    .replace(/यूरिया/g, "Urea").replace(/मृदा/g, "मिट्टी").replace(/कृषक/g, "किसान")
    .replace(/सिंचाई/g, "पानी देना").replace(/\bborax\b/gi, "Borax").replace(/\burea\b/gi, "Urea");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE, "utf8")); } catch { return {}; }
}

async function main() {
  const backup = JSON.parse(fs.readFileSync(BACKUP, "utf8"));
  const current = JSON.parse(fs.readFileSync(FILE, "utf8"));
  const cache = loadCache();
  let n = 0;

  for (let i = 0; i < backup.nutrients.length; i++) {
    for (const field of FIELDS) {
      const orig = backup.nutrients[i][field] ?? [];
      const cur = current.nutrients[i][field] ?? [];
      current.nutrients[i][field] = [];
      for (let j = 0; j < orig.length; j++) {
        const en = orig[j];
        const existing = cur[j] ?? "";
        if (!isMostlyEnglish(existing)) {
          current.nutrients[i][field].push(existing);
        } else if (cache[en]) {
          current.nutrients[i][field].push(cache[en]);
        } else {
          const hi = post(await tr(en));
          cache[en] = hi;
          current.nutrients[i][field].push(hi);
          n++;
          if (n % 30 === 0) {
            fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
            process.stdout.write(`\r${n}...`);
          }
          await sleep(100);
        }
      }
    }
  }

  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
  fs.writeFileSync(FILE, JSON.stringify(current, null, 2) + "\n", "utf8");
  JSON.parse(fs.readFileSync(FILE, "utf8"));
  console.log(`\nTranslated ${n} missing strings. JSON.parse OK`);
}

main().catch((e) => { console.error(e); process.exit(1); });
