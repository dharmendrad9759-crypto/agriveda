const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const UA = "AgrivedaFieldLibrary/2.0 (https://agriveda-theta.vercel.app; authentic farmer field education)";

const RETRY_TARGETS = [
  // Multi-photo Alternaria solani
  { dir: DISEASES_DIR, file: "disease-alternaria-solani-2.jpg", queries: ["Early blight", "Alternaria solani", "Alternaria leaf spot"] },
  { dir: DISEASES_DIR, file: "disease-alternaria-solani-3.jpg", queries: ["tomato leaf early blight", "Alternaria potato leaf", "Alternaria"] },
  
  // Pigeonpea wilt / sterility / blight
  { dir: DISEASES_DIR, file: "disease-fusarium-udum.jpg", queries: ["Fusarium wilt", "Fusarium oxysporum", "wilt pigeonpea"] },
  { dir: DISEASES_DIR, file: "disease-pigeonpea-sterility-mosaic-virus.jpg", queries: ["mosaic virus leaf chlorosis", "plant virus mosaic symptoms", "mosaic virus leaf"] },
  { dir: DISEASES_DIR, file: "disease-phytophthora-drechsleri.jpg", queries: ["Phytophthora stem blight", "Phytophthora blight", "Phytophthora rot"] },

  // Downy mildew / rusts
  { dir: DISEASES_DIR, file: "disease-peronosclerospora-sorghi.jpg", queries: ["maize downy mildew", "Sclerospora downy mildew", "downy mildew maize"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-substriata.jpg", queries: ["Puccinia rust leaf", "cereal rust leaf", "Puccinia"] },
  { dir: DISEASES_DIR, file: "disease-fusarium-moniliforme.jpg", queries: ["Fusarium verticillioides", "Gibberella fujikuroi", "Fusarium maize stalk rot"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-kuehnii.jpg", queries: ["sugarcane rust leaf", "Puccinia sugarcane", "rust sugarcane"] },
  { dir: DISEASES_DIR, file: "disease-xanthomonas-axonopodis-pv-glycines.jpg", queries: ["bacterial pustule", "Xanthomonas leaf spot soybean", "Xanthomonas axonopodis"] },

  // Pests
  { dir: PESTS_DIR, file: "pest-sogatella-furcifera.jpg", queries: ["Delphacidae planthopper", "planthopper rice", "white backed planthopper"] },
  { dir: PESTS_DIR, file: "pest-orseolia-oryzae.jpg", queries: ["Cecidomyiidae gall midge", "gall midge midge insect", "rice gall midge"] },
  { dir: PESTS_DIR, file: "pest-holotrichia-spp.jpg", queries: ["white grub larva scarab", "white grub beetle larva", "Scarabaeidae larva root"] },
  { dir: PESTS_DIR, file: "pest-chilo-infuscatellus.jpg", queries: ["Crambidae moth stem borer", "stem borer caterpillar larva", "Chilo moth"] },
  { dir: PESTS_DIR, file: "pest-chilo-sacchariphagus-indicus.jpg", queries: ["Chilo caterpillar larva", "sugar cane borer", "Chilo moth specimen"] },
  { dir: PESTS_DIR, file: "pest-ceratovacuna-lanigera.jpg", queries: ["woolly aphid colony", "woolly aphid leaf", "aphid sugarcane"] },

  // Multi-photo extras
  { dir: DISEASES_DIR, file: "disease-begomovirus-leaf-curl-2.jpg", queries: ["tomato leaf curl virus", "leaf curl tomato virus", "begomovirus tomato"] },
  { dir: DISEASES_DIR, file: "disease-magnaporthe-oryzae-2.jpg", queries: ["Magnaporthe oryzae", "rice blast leaf", "Pyricularia oryzae"] },
  { dir: DISEASES_DIR, file: "disease-colletotrichum-capsici-2.jpg", queries: ["chilli anthracnose fruit", "pepper anthracnose", "Colletotrichum capsici"] },
  { dir: PESTS_DIR, file: "pest-spodoptera-frugiperda-2.jpg", queries: ["fall armyworm larva maize", "Spodoptera frugiperda caterpillar", "fall armyworm damage"] },
  { dir: PESTS_DIR, file: "pest-scirpophaga-incertulas-2.jpg", queries: ["rice stem borer larva", "yellow stem borer", "Scirpophaga larva"] },
  { dir: PESTS_DIR, file: "pest-nilaparvata-lugens-2.jpg", queries: ["brown planthopper rice", "Nilaparvata lugens", "planthopper rice stem"] },
  { dir: PESTS_DIR, file: "pest-nilaparvata-lugens-3.jpg", queries: ["Nilaparvata", "BPH rice hopper", "brown planthopper insect"] },
  { dir: PESTS_DIR, file: "pest-bemisia-tabaci-3.jpg", queries: ["whitefly leaf underside", "Bemisia tabaci whitefly", "whitefly nymphs"] },
];

async function commonsSearch(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "15",
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "1280",
    });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`search ${res.status}`);
  return res.json();
}

function pickBest(pages) {
  if (!pages) return null;
  const scored = [];
  for (const p of Object.values(pages)) {
    const info = p.imageinfo?.[0];
    if (!info?.url) continue;
    const mime = info.mime || "";
    if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) continue;
    const title = (p.title || "").toLowerCase();
    if (title.includes("logo") || title.includes("icon") || title.includes(".svg")) continue;
    if (title.includes("diagram") || title.includes("drawing") || title.includes("illustration")) continue;
    if (title.includes("map") || title.includes("chart")) continue;
    const license = JSON.stringify(info.extmetadata || {}).toLowerCase();
    let score = Number(info.size) || 0;
    if (mime.includes("jpeg")) score += 400000;
    if (license.includes("public domain") || license.includes("cc0") || license.includes("cc-by")) score += 300000;
    scored.push({ title: p.title, url: info.thumburl || info.url, full: info.url, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored[0] || null;
}

async function downloadToJpeg(url, outPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`dl ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outPath);
}

async function main() {
  console.log(`Retrying downloads for ${RETRY_TARGETS.length} items...`);
  let ok = 0;
  for (const t of RETRY_TARGETS) {
    const outPath = path.join(t.dir, t.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 15000) {
      console.log(`[ALREADY EXISTS] ${t.file}`);
      ok++;
      continue;
    }
    let done = false;
    for (const q of t.queries) {
      process.stdout.write(`Fetching ${t.file} via [${q}] ... `);
      try {
        const json = await commonsSearch(q);
        const best = pickBest(json.query?.pages);
        if (!best) {
          console.log("no match");
          await new Promise((r) => setTimeout(r, 250));
          continue;
        }
        await downloadToJpeg(best.url, outPath);
        console.log(`SUCCESS! (${best.title})`);
        done = true;
        ok++;
        break;
      } catch (e) {
        console.log(`err: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 300));
    }
    if (!done) console.log(`FAILED ${t.file}`);
  }
  console.log(`Retry finished: ${ok} present.`);
}

main().catch(console.error);
