/**
 * Dump crops + pests + diseases + weeds to a plain text list.
 * Run: node scripts/dump-pdw-list.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../data/pest-disease.ts"), "utf8");

// Split by crop blocks: slug: "..."
const cropBlocks = [];
const slugRe = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let m;
const slugHits = [];
while ((m = slugRe.exec(src))) {
  slugHits.push({ slug: m[1], name: m[2], index: m.index });
}

function extractArrayItems(block, key) {
  const re = new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\n\\s*\\],`, "m");
  const hit = block.match(re);
  if (!hit) return [];
  const body = hit[1];
  const items = [];
  const itemRe =
    /\{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)"(?:,\s*(?:scientific|pathogen):\s*"([^"]*)")?/g;
  let im;
  while ((im = itemRe.exec(body))) {
    items.push({ name: im[1], sci: im[2] || "" });
  }
  return items;
}

const hiMap = {
  paddy: "धान",
  wheat: "गेहूँ",
  maize: "मक्का",
  bajra: "बाजरा",
  potato: "आलू",
  tomato: "टमाटर",
  onion: "प्याज",
  chilli: "मिर्च",
  cauliflower: "फूलगोभी",
  cucumber: "खीरा",
  brinjal: "बैंगन",
  bhindi: "भिंडी",
  cotton: "कपास",
  sugarcane: "गन्ना",
  soybean: "सोयाबीन",
  moongfali: "मूंगफली",
  mustard: "सरसों",
  pulses: "अरहर",
  moong: "मूंग",
  chana: "चना",
  masoor: "मसूर",
  urad: "उड़द",
  ginger: "अदरक",
  garlic: "लहसुन",
  mango: "आम",
  banana: "केला",
  grapes: "अंगूर",
  turmeric: "हल्दी",
  capsicum: "शिमला मिर्च",
  cabbage: "पत्ता गोभी",
};

const lines = [];
lines.push("AgriVeda — फसल / रोग / कीट / खरपतवार पूरी लिस्ट");
lines.push("(source: data/pest-disease.ts)");
lines.push("");

let cropN = 0,
  pestN = 0,
  disN = 0,
  weedN = 0;

for (let i = 0; i < slugHits.length; i++) {
  const start = slugHits[i].index;
  const end = i + 1 < slugHits.length ? slugHits[i + 1].index : src.length;
  const block = src.slice(start, end);
  // skip helper exports at end that aren't crop entries
  if (!block.includes("pests:") && !block.includes("diseases:")) continue;

  const { slug, name } = slugHits[i];
  // only real crop data objects inside cropPestDiseaseData
  if (start < src.indexOf("cropPestDiseaseData")) continue;
  if (src.indexOf("export function emptyCropPestDisease") > 0 && start > src.indexOf("export function emptyCropPestDisease"))
    continue;

  const diseases = extractArrayItems(block, "diseases");
  const pests = extractArrayItems(block, "pests");
  const weeds = extractArrayItems(block, "weeds");

  cropN++;
  const hi = hiMap[slug] || name;
  lines.push("========================================");
  lines.push(`फसल: ${hi} (${name}) [${slug}]`);
  lines.push("----------------------------------------");
  lines.push(`रोग (${diseases.length}):`);
  diseases.forEach((x, idx) => {
    disN++;
    lines.push(`  ${idx + 1}. ${x.name}${x.sci ? " — " + x.sci : ""}`);
  });
  lines.push(`कीट (${pests.length}):`);
  pests.forEach((x, idx) => {
    pestN++;
    lines.push(`  ${idx + 1}. ${x.name}${x.sci ? " — " + x.sci : ""}`);
  });
  lines.push(`खरपतवार (${weeds.length}):`);
  weeds.forEach((x, idx) => {
    weedN++;
    lines.push(`  ${idx + 1}. ${x.name}${x.sci ? " — " + x.sci : ""}`);
  });
  lines.push("");
}

lines.push("========================================");
lines.push(`कुल: फसल ${cropN} | रोग ${disN} | कीट ${pestN} | खरपतवार ${weedN}`);

const out = path.join(__dirname, "../CROPS_PESTS_DISEASES_WEEDS_LIST.txt");
fs.writeFileSync(out, lines.join("\n"), "utf8");
console.log("Wrote", out);
console.log({ cropN, disN, pestN, weedN });
