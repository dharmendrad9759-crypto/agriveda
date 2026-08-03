/** Translate FAQ from original Hinglish/English using Hinglish→English→Hindi pipeline. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP = path.join(__dirname, "../.tmp/agriveda-nutrient-deficiency-batch.en.bak.json");
const FILE = path.join(__dirname, "../data/imports/agriveda-nutrient-deficiency-batch.json");

const HINGLISH = [
  [/\bkyun\??/gi, "why"],
  [/\bkaise\b/gi, "how"],
  [/\bkitna\b/gi, "how much"],
  [/\bkaun sa\b/gi, "which"],
  [/\bkarein\b/gi, "should apply"],
  [/\bdein\b/gi, "apply"],
  [/\bdaalein\b/gi, "apply"],
  [/\bfasal\b/gi, "crop"],
  [/\bpattiyan\b/gi, "leaves"],
  [/\bpatti\b/gi, "leaf"],
  [/\bneeche ki\b/gi, "lower"],
  [/\bpurani\b/gi, "older"],
  [/\bphal\b/gi, "fruit"],
  [/\bmatti\b/gi, "soil"],
  [/\bsinchai\b/gi, "irrigation"],
  [/\bkhaad\b/gi, "fertilizer"],
  [/\bcurd\b/gi, "cauliflower head"],
  [/\btana\b/gi, "stem"],
  [/\bkhokhla\b/gi, "hollow"],
  [/\bhollow\b/gi, "hollow"],
  [/\bkami\b/gi, "deficiency"],
  [/\bzyada\b/gi, "excess"],
  [/\bnahi\b/gi, "not"],
  [/\bhaan\b/gi, "yes"],
  [/\bpar\b/gi, "at"],
  [/\bse\b/gi, "from"],
  [/\bme\b/gi, "in"],
  [/\bki\b/gi, "of"],
  [/\bka\b/gi, "of"],
  [/\bke\b/gi, "of"],
  [/\bko\b/gi, "to"],
  [/\bjaldi\b/gi, "quick"],
  [/\bhariyali\b/gi, "greening"],
  [/\bchhidkav\b/gi, "spray"],
  [/\bnami\b/gi, "moisture"],
  [/\bsthir\b/gi, "steady"],
  [/\brakhein\b/gi, "maintain"],
  [/\btheek\b/gi, "recover"],
  [/\bfayda\b/gi, "benefit"],
  [/\bwajah\b/gi, "reason"],
  [/\bpehle\b/gi, "first"],
  [/\bbar-bar\b/gi, "repeatedly"],
  [/\bsafety\b/gi, "safety"],
  [/\binitiation\b/gi, "initiation"],
  [/\bflowering\b/gi, "flowering"],
  [/\bfoliar\b/gi, "foliar"],
  [/\bbasal\b/gi, "basal"],
  [/\btop-dress\b/gi, "top-dress"],
  [/\bgroundnut\b/gi, "groundnut"],
  [/\bcauliflower\b/gi, "cauliflower"],
  [/\btamatar\b/gi, "tomato"],
  [/\bover-liming\b/gi, "over-liming"],
  [/\bhot spots\b/gi, "hot spots"],
  [/\btest\b/gi, "test"],
  [/\bsandy\b/gi, "sandy"],
  [/\bbrown\b/gi, "brown"],
  [/\bbrowning\b/gi, "browning"],
  [/\bcracking\b/gi, "cracking"],
  [/\bflower drop\b/gi, "flower drop"],
  [/\bfruit set\b/gi, "fruit set"],
  [/\bseed set\b/gi, "seed set"],
  [/\bBER\b/g, "blossom-end rot"],
  [/\bPOPS\b/g, "empty pods"],
  [/\bdeficiency\b/gi, "deficiency"],
  [/\btoxicity\b/gi, "toxicity"],
  [/\bantagonism\b/gi, "antagonism"],
  [/\bupake\b/gi, "uptake"],
  [/\bvolatilisation\b/gi, "volatilisation"],
  [/\bleaching\b/gi, "leaching"],
  [/\bwaterlogging\b/gi, "waterlogging"],
  [/\bnodules\b/gi, "nodules"],
  [/\bbiofertiliser\b/gi, "biofertiliser"],
  [/\blodging\b/gi, "lodging"],
];

const PROTECT = [
  /\bDAP\b/g, /\bSSP\b/g, /\bUrea\b/gi, /\bBorax\b/gi, /\bGypsum\b/gi,
  /\bCAN\b/g, /\bNPK\b/g, /\bKNO3\b/g, /\bFeSO4\b/g, /\bZnSO4\b/g,
  /\bLCC\b/g, /\bSolubor\b/gi, /\bFoliar\b/gi, /\bBasal\b/gi,
  /\bRhizobium\b/gi, /\bCaNO3\b/g,
  /\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:%|kg|g|L)\/(?:acre|L)\b/gi,
  /\d+(?:\.\d+)?\s*%\s*\([^)]+\)/g,
  /\d+(?:\.\d+)?\s*%\b/g,
  /\b\d+(?:\.\d+)?\s*g\/L\b/gi,
];

function hinglishToEnglish(s) {
  let out = s;
  for (const [re, rep] of HINGLISH) out = out.replace(re, rep);
  return out;
}

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

async function translateEnToHi(en) {
  const { out, ph } = protect(en);
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=" +
    encodeURIComponent(out);
  const res = await fetch(url);
  const parsed = JSON.parse(await res.text());
  return restore(parsed[0]?.map((x) => x[0]).join("") ?? en, ph);
}

function post(s) {
  return s
    .replace(/नाइट्रोजन/g, "N")
    .replace(/बोरॉन/g, "B")
    .replace(/बोरोन/g, "B")
    .replace(/यूरिया/g, "Urea")
    .replace(/फूलगोभी का सिर/g, "फूलगोभी की गोभी")
    .replace(/फूलगोभी सिर/g, "फूलगोभी की गोभी")
    .replace(/दही/g, "गोभी")
    .replace(/सिंचाई/g, "पानी देना")
    .replace(/मृदा/g, "मिट्टी")
    .replace(/कृषक/g, "किसान")
    .replace(/\bborax\b/gi, "Borax")
    .replace(/\burea\b/gi, "Urea")
    .replace(/\bfoliar\b/gi, "Foliar")
    .replace(/\bbasal\b/gi, "Basal");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateFaq(q, a) {
  const enQ = hinglishToEnglish(q);
  const enA = hinglishToEnglish(a);
  const hiQ = post(await translateEnToHi(enQ));
  await sleep(100);
  const hiA = post(await translateEnToHi(enA));
  return { q: hiQ, a: hiA };
}

async function main() {
  const backup = JSON.parse(fs.readFileSync(BACKUP, "utf8"));
  const current = JSON.parse(fs.readFileSync(FILE, "utf8"));
  let n = 0;
  for (let i = 0; i < backup.nutrients.length; i++) {
    const orig = backup.nutrients[i].faq ?? [];
    current.nutrients[i].faq = [];
    for (const item of orig) {
      current.nutrients[i].faq.push(await translateFaq(item.q, item.a));
      n++;
      if (n % 20 === 0) process.stdout.write(`\rFAQ ${n}...`);
      await sleep(50);
    }
  }
  fs.writeFileSync(FILE, JSON.stringify(current, null, 2) + "\n", "utf8");
  JSON.parse(fs.readFileSync(FILE, "utf8"));
  console.log(`\nDone: ${n} FAQ pairs from backup. JSON.parse OK`);
}

main().catch((e) => { console.error(e); process.exit(1); });
