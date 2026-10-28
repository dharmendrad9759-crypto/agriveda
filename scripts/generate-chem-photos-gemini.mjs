/**
 * Generates fully AI-rendered photorealistic agrochemical package photos
 * (whole bottle / pouch rendered together with its label — no pasted overlays).
 *
 * Usage: node scripts/generate-chem-photos-gemini.mjs [slug ...]
 * Uses GEMINI_API_KEY from .env.local. Resumable: skips slugs listed in
 * scripts/data/chem-photo-gen-done.json unless passed explicitly.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUT_DIR = "public/images/chem/real";
const DONE_FILE = "scripts/data/chem-photo-gen-done.json";
const MODEL = process.env.CHEM_IMAGE_MODEL || "gemini-3.1-flash-image";

const env = fs.readFileSync(".env.local", "utf8");
const apiKey = env.match(/GEMINI_API_KEY=([^\r\n]+)/)?.[1]?.trim();
if (!apiKey) throw new Error("GEMINI_API_KEY missing in .env.local");

const CAT = {
  insecticide: { word: "INSECTICIDE", cap: "red", band: "green", diamond: "blue" },
  fungicide: { word: "FUNGICIDE", cap: "blue", band: "blue", diamond: "green" },
  herbicide: { word: "HERBICIDE", cap: "orange", band: "dark green", diamond: "blue" },
  pgr: { word: "PLANT GROWTH REGULATOR", cap: "purple", band: "purple", diamond: "green" },
};

// kind: "bottle" | "pouch"; title lines exactly as printed on label
const ITEMS = [
  // herbicide pouches
  { slug: "clodinafop-15-wp", kind: "pouch", cat: "herbicide", title: ["CLODINAFOP-PROPARGYL 15% WP"], sub: "SELECTIVE HERBICIDE", qty: "160 g" },
  { slug: "sulfosulfuron-75-wg", kind: "pouch", cat: "herbicide", title: ["SULFOSULFURON 75% WG"], sub: "SELECTIVE HERBICIDE", qty: "13.5 g" },
  { slug: "metsulfuron-methyl-20-wp", kind: "pouch", cat: "herbicide", title: ["METSULFURON-METHYL 20% WP"], sub: "SELECTIVE HERBICIDE", qty: "8 g" },
  { slug: "ethoxysulfuron-15-wdg", kind: "pouch", cat: "herbicide", title: ["ETHOXYSULFURON 15% WDG"], sub: "SELECTIVE HERBICIDE", qty: "50 g" },
  { slug: "halosulfuron-75-wg", kind: "pouch", cat: "herbicide", title: ["HALOSULFURON-METHYL 75% WG"], sub: "SELECTIVE HERBICIDE", qty: "36 g" },
  { slug: "metribuzin-70-wp", kind: "pouch", cat: "herbicide", title: ["METRIBUZIN 70% WP"], sub: "SELECTIVE HERBICIDE", qty: "250 g" },
  { slug: "pyrazosulfuron-10-wp", kind: "pouch", cat: "herbicide", title: ["PYRAZOSULFURON-ETHYL 10% WP"], sub: "SELECTIVE HERBICIDE", qty: "80 g" },
  { slug: "chlorimuron-ethyl-25-wp", kind: "pouch", cat: "herbicide", title: ["CHLORIMURON-ETHYL 25% WP"], sub: "SELECTIVE HERBICIDE", qty: "15 g" },
  { slug: "mesosulfuron-iodosulfuron-wg", kind: "pouch", cat: "herbicide", title: ["MESOSULFURON 3% +", "IODOSULFURON 0.6% WG"], sub: "SELECTIVE HERBICIDE", qty: "160 g" },
  { slug: "diuron-80-wp", kind: "pouch", cat: "herbicide", title: ["DIURON 80% WP"], sub: "HERBICIDE", qty: "500 g" },
  { slug: "diclosulam-84-wdg", kind: "pouch", cat: "herbicide", title: ["DICLOSULAM 84% WDG"], sub: "SELECTIVE HERBICIDE", qty: "12.4 g" },
  // other pouches
  { slug: "fosetyl-al-80-wp", kind: "pouch", cat: "fungicide", title: ["FOSETYL-AL 80% WP"], sub: "SYSTEMIC FUNGICIDE", qty: "250 g" },
  { slug: "carbaryl-50-wp", kind: "pouch", cat: "insecticide", title: ["CARBARYL 50% WP"], sub: "CARBAMATE INSECTICIDE", qty: "500 g" },
  { slug: "myclobutanil-10-wp", kind: "pouch", cat: "fungicide", title: ["MYCLOBUTANIL 10% WP"], sub: "SYSTEMIC FUNGICIDE", qty: "250 g" },
  // herbicide bottles
  { slug: "butachlor-50-ec", kind: "bottle", cat: "herbicide", title: ["BUTACHLOR 50% EC"], sub: "PRE-EMERGENCE HERBICIDE", qty: "1 LITRE" },
  { slug: "2-4-d-amine-58-sl", kind: "bottle", cat: "herbicide", title: ["2,4-D AMINE SALT 58% SL"], sub: "SELECTIVE HERBICIDE", qty: "1 LITRE" },
  { slug: "imazethapyr-10-sl", kind: "bottle", cat: "herbicide", title: ["IMAZETHAPYR 10% SL"], sub: "SELECTIVE HERBICIDE", qty: "1 LITRE" },
  { slug: "quizalofop-5-ec", kind: "bottle", cat: "herbicide", title: ["QUIZALOFOP-ETHYL 5% EC"], sub: "SELECTIVE HERBICIDE", qty: "500 ml" },
  { slug: "tembotrione-34-sc", kind: "bottle", cat: "herbicide", title: ["TEMBOTRIONE 34.4% SC"], sub: "POST-EMERGENCE HERBICIDE", qty: "400 ml" },
  { slug: "topramezone-33-sc", kind: "bottle", cat: "herbicide", title: ["TOPRAMEZONE 33.6% SC"], sub: "POST-EMERGENCE HERBICIDE", qty: "75 ml" },
  { slug: "pinoxaden-5-ec", kind: "bottle", cat: "herbicide", title: ["PINOXADEN 5.1% EC"], sub: "SELECTIVE HERBICIDE", qty: "400 ml" },
  { slug: "oxyfluorfen-23-5-ec", kind: "bottle", cat: "herbicide", title: ["OXYFLUORFEN 23.5% EC"], sub: "HERBICIDE", qty: "500 ml" },
  { slug: "penoxsulam-21-7-sc", kind: "bottle", cat: "herbicide", title: ["PENOXSULAM 21.7% SC"], sub: "SELECTIVE HERBICIDE", qty: "100 ml" },
  { slug: "cyhalofop-butyl-10-ec", kind: "bottle", cat: "herbicide", title: ["CYHALOFOP-BUTYL 10% EC"], sub: "SELECTIVE HERBICIDE", qty: "500 ml" },
  { slug: "pyrithiobac-sodium-10-ec", kind: "bottle", cat: "herbicide", title: ["PYRITHIOBAC-SODIUM 10% EC"], sub: "SELECTIVE HERBICIDE", qty: "250 ml" },
  { slug: "fluchloralin-45-ec", kind: "bottle", cat: "herbicide", title: ["FLUCHLORALIN 45% EC"], sub: "PRE-PLANT HERBICIDE", qty: "1 LITRE" },
  // insecticide / fungicide / pgr bottles
  { slug: "spirotetramat-15-od", kind: "bottle", cat: "insecticide", title: ["SPIROTETRAMAT 15.31% OD"], sub: "SYSTEMIC INSECTICIDE", qty: "500 ml" },
  { slug: "spiropidion-150-ec", kind: "bottle", cat: "insecticide", title: ["SPIROPIDION 150 SC"], sub: "INSECTICIDE", qty: "200 ml" },
  { slug: "fenazaquin-10-ec", kind: "bottle", cat: "insecticide", title: ["FENAZAQUIN 10% EC"], sub: "ACARICIDE / MITICIDE", qty: "500 ml" },
  { slug: "triazophos-40-ec", kind: "bottle", cat: "insecticide", title: ["TRIAZOPHOS 40% EC"], sub: "ORGANOPHOSPHATE INSECTICIDE", qty: "1 LITRE" },
  { slug: "mandipropamid-23-sc", kind: "bottle", cat: "fungicide", title: ["MANDIPROPAMID 23.4% SC"], sub: "FUNGICIDE", qty: "500 ml" },
  { slug: "penflufen-240-fs", kind: "bottle", cat: "fungicide", title: ["PENFLUFEN 240 FS"], sub: "SEED TREATMENT FUNGICIDE", qty: "100 ml" },
  { slug: "pencycuron-22-9-sc", kind: "bottle", cat: "fungicide", title: ["PENCYCURON 22.9% SC"], sub: "FUNGICIDE", qty: "250 ml" },
  { slug: "picoxystrobin-propiconazole-sc", kind: "bottle", cat: "fungicide", title: ["PICOXYSTROBIN 7.05% +", "PROPICONAZOLE 11.71% SC"], sub: "SYSTEMIC FUNGICIDE", qty: "400 ml" },
  { slug: "paclobutrazol-23-sc", kind: "bottle", cat: "pgr", title: ["PACLOBUTRAZOL 23% SC"], sub: "PLANT GROWTH REGULATOR", qty: "500 ml" },
  { slug: "mepiquat-chloride-5-as", kind: "bottle", cat: "pgr", title: ["MEPIQUAT CHLORIDE 5% AS"], sub: "PLANT GROWTH REGULATOR", qty: "500 ml" },
  { slug: "forchlorfenuron-01-l", kind: "bottle", cat: "pgr", title: ["FORCHLORFENURON 0.1% L"], sub: "PLANT GROWTH REGULATOR", qty: "250 ml" },
];

function buildPrompt(it) {
  const c = CAT[it.cat];
  const title = it.title.map((t) => `"${t}"`).join(" and on the next line ");
  const common =
    `centered on a plain soft white-grey seamless studio background, soft natural shadow, square composition, ` +
    `photographed like a real product photo. The label must look printed on the package (curving with its surface), not a sticker floating on top. ` +
    `Label text, printed exactly: large bold black title ${title}; below it "${it.sub}"; a ${c.diamond} diamond toxicity symbol; ` +
    `small text "KEEP OUT OF REACH OF CHILDREN", "${it.kind === "pouch" ? "NET WEIGHT" : "NET CONTENTS"}: ${it.qty}", "FOR AGRICULTURAL USE ONLY". ` +
    `Absolutely no brand name, no company name, no logo, no extra words. Sharp, correctly spelled, legible text.`;
  if (it.kind === "pouch") {
    return (
      `Photorealistic studio product photograph of one standing silver metallic foil agrochemical pouch with a crimped heat-sealed top edge and tear notch, ` +
      `with a printed white label area and a ${c.band} top band reading "${c.word}", ` +
      common
    );
  }
  return (
    `Photorealistic studio product photograph of one white HDPE agrochemical bottle (${it.qty}) with a ${c.cap} translucent measuring cap with ml graduations, ` +
    `with a printed white wrap-around label that has a ${c.band} top band reading "${c.word}", ` +
    common
  );
}

async function generate(it) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: buildPrompt(it) }] }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1" } },
  };
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
    const data = part?.inlineData?.data || part?.inline_data?.data;
    if (data) {
      const out = path.join(OUT_DIR, `${it.slug}.jpg`);
      await sharp(Buffer.from(data, "base64")).resize(1024, 1024, { fit: "cover" }).jpeg({ quality: 92 }).toFile(out);
      return out;
    }
    console.warn(`  attempt ${attempt} failed for ${it.slug}:`, JSON.stringify(json).slice(0, 300));
    await new Promise((r) => setTimeout(r, 4000 * attempt));
  }
  throw new Error(`Failed: ${it.slug}`);
}

const done = new Set(fs.existsSync(DONE_FILE) ? JSON.parse(fs.readFileSync(DONE_FILE, "utf8")) : []);
const only = process.argv.slice(2);
const queue = ITEMS.filter((it) => (only.length ? only.includes(it.slug) : !done.has(it.slug)));
console.log(`Generating ${queue.length} photos with ${MODEL}...`);
for (const it of queue) {
  try {
    const out = await generate(it);
    done.add(it.slug);
    fs.mkdirSync(path.dirname(DONE_FILE), { recursive: true });
    fs.writeFileSync(DONE_FILE, JSON.stringify([...done], null, 2));
    console.log(`OK ${out}`);
  } catch (e) {
    console.error(String(e));
  }
}
