const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const UA = "AgrivedaFieldLibrary/2.0 (https://agriveda-theta.vercel.app; authentic farmer field education)";

const BATCH = [
  // Bacterial blight rice
  { dir: DISEASES_DIR, file: "disease-xanthomonas-oryzae-2.jpg", queries: ["Bacterial blight rice Xanthomonas oryzae leaf lesion", "bacterial leaf blight rice"] },
  { dir: DISEASES_DIR, file: "disease-xanthomonas-oryzae-3.jpg", queries: ["Xanthomonas oryzae milky dew drop bacterial ooze", "Xanthomonas oryzae leaf"] },

  // Brown spot rice
  { dir: DISEASES_DIR, file: "disease-bipolaris-oryzae-2.jpg", queries: ["Bipolaris oryzae brown spot rice leaf", "Cochliobolus miyabeanus rice"] },
  { dir: DISEASES_DIR, file: "disease-bipolaris-oryzae-3.jpg", queries: ["Brown spot rice grain glume lesion Bipolaris", "rice brown spot"] },

  // Brown rust wheat
  { dir: DISEASES_DIR, file: "disease-puccinia-triticina-2.jpg", queries: ["Puccinia triticina leaf rust wheat brown pustule", "brown rust wheat leaf"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-triticina-3.jpg", queries: ["Wheat brown rust pustules field", "Puccinia triticina uredinia"] },

  // Loose smut wheat
  { dir: DISEASES_DIR, file: "disease-ustilago-tritici-2.jpg", queries: ["Ustilago tritici loose smut wheat ear black powder", "loose smut wheat head"] },
  { dir: DISEASES_DIR, file: "disease-ustilago-tritici-3.jpg", queries: ["Wheat loose smut black spike", "Ustilago tritici spikelet"] },

  // Purple blotch onion
  { dir: DISEASES_DIR, file: "disease-alternaria-porri-2.jpg", queries: ["Alternaria porri purple blotch onion leaf purple spot", "purple blotch onion"] },
  { dir: DISEASES_DIR, file: "disease-alternaria-porri-3.jpg", queries: ["Alternaria porri onion scape lesion", "onion purple blotch foliage"] },

  // Powdery mildew
  { dir: DISEASES_DIR, file: "disease-podosphaera-xanthii-2.jpg", queries: ["Podosphaera xanthii powdery mildew cucurbit leaf", "powdery mildew cucumber"] },
  { dir: DISEASES_DIR, file: "disease-podosphaera-xanthii-3.jpg", queries: ["powdery mildew white fungal growth leaf", "Podosphaera powdery mildew"] },

  // Red rot sugarcane
  { dir: DISEASES_DIR, file: "disease-colletotrichum-falcatum-2.jpg", queries: ["Colletotrichum falcatum red rot sugarcane stem split red pith", "red rot sugarcane stem"] },
  { dir: DISEASES_DIR, file: "disease-colletotrichum-falcatum-3.jpg", queries: ["Sugarcane red rot white transverse bands", "Colletotrichum falcatum sugarcane"] },

  // White rust mustard
  { dir: DISEASES_DIR, file: "disease-albugo-candida-2.jpg", queries: ["Albugo candida white rust mustard blister pustule leaf", "white rust mustard leaf"] },
  { dir: DISEASES_DIR, file: "disease-albugo-candida-3.jpg", queries: ["Albugo candida staghead hypertrophy mustard flower", "Albugo candida white rust"] },

  // Rice leaf folder
  { dir: PESTS_DIR, file: "pest-cnaphalocrocis-medinalis-2.jpg", queries: ["Cnaphalocrocis medinalis folded rice leaf white scrape", "rice leaf folder damage"] },
  { dir: PESTS_DIR, file: "pest-cnaphalocrocis-medinalis-3.jpg", queries: ["Cnaphalocrocis medinalis moth rice", "rice leaf roller larva"] },

  // Wheat aphid
  { dir: PESTS_DIR, file: "pest-sitobion-avenae-2.jpg", queries: ["Sitobion avenae aphids wheat ear head colony", "English grain aphid colony wheat"] },
  { dir: PESTS_DIR, file: "pest-sitobion-avenae-3.jpg", queries: ["Sitobion avenae aphid close up", "wheat aphid head"] },

  // Spotted stem borer
  { dir: PESTS_DIR, file: "pest-chilo-partellus-2.jpg", queries: ["Chilo partellus larva spotted stem borer caterpillar", "Chilo partellus caterpillar"] },
  { dir: PESTS_DIR, file: "pest-chilo-partellus-3.jpg", queries: ["Chilo partellus shot hole maize leaf damage", "spotted stem borer dead heart"] },

  // Onion thrips
  { dir: PESTS_DIR, file: "pest-thrips-tabaci-2.jpg", queries: ["Thrips tabaci onion leaf silvering white streak", "onion thrips damage leaf"] },
  { dir: PESTS_DIR, file: "pest-thrips-tabaci-3.jpg", queries: ["Thrips tabaci nymph adult close up", "onion thrips insect"] },

  // Chilli thrips
  { dir: PESTS_DIR, file: "pest-scirtothrips-dorsalis-2.jpg", queries: ["Scirtothrips dorsalis chilli leaf upward curl boat shaped", "chilli thrips upward curling leaf"] },
  { dir: PESTS_DIR, file: "pest-scirtothrips-dorsalis-3.jpg", queries: ["Chilli thrips bronzing fruit damage", "Scirtothrips dorsalis leaf damage"] },

  // Brinjal shoot & fruit borer
  { dir: PESTS_DIR, file: "pest-leucinodes-orbonalis-2.jpg", queries: ["Leucinodes orbonalis brinjal fruit boring exit hole", "brinjal shoot fruit borer larva in fruit"] },
  { dir: PESTS_DIR, file: "pest-leucinodes-orbonalis-3.jpg", queries: ["Leucinodes orbonalis drooping shoot wilted tip", "brinjal borer moth adult"] },

  // Diamondback moth
  { dir: PESTS_DIR, file: "pest-plutella-xylostella-2.jpg", queries: ["Plutella xylostella diamondback moth larva windowing leaf", "diamondback moth caterpillar cabbage"] },
  { dir: PESTS_DIR, file: "pest-plutella-xylostella-3.jpg", queries: ["Plutella xylostella pupa cocoon net cabbage leaf", "diamondback moth adult"] },

  // Mustard aphid
  { dir: PESTS_DIR, file: "pest-lipaphis-erysimi-2.jpg", queries: ["Lipaphis erysimi mustard aphid dense cluster inflorescence", "mustard aphid flower colony"] },
  { dir: PESTS_DIR, file: "pest-lipaphis-erysimi-3.jpg", queries: ["Lipaphis erysimi apterous viviparous female", "mustard aphid curled pod"] },

  // Pink bollworm
  { dir: PESTS_DIR, file: "pest-pectinophora-gossypiella-2.jpg", queries: ["Pectinophora gossypiella pink bollworm rosette flower cotton", "pink bollworm rosette cotton"] },
  { dir: PESTS_DIR, file: "pest-pectinophora-gossypiella-3.jpg", queries: ["Pink bollworm larva inside cotton boll seed damage", "Pectinophora gossypiella larva"] },
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
      gsrlimit: "10",
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
  console.log(`Downloading ${BATCH.length} secondary/tertiary authentic field photos...`);
  let ok = 0;
  for (const t of BATCH) {
    const outPath = path.join(t.dir, t.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
      ok++;
      continue;
    }
    for (const q of t.queries) {
      process.stdout.write(`Fetching ${t.file} via [${q}] ... `);
      try {
        const json = await commonsSearch(q);
        const best = pickBest(json.query?.pages);
        if (!best) {
          console.log("no match");
          await new Promise((r) => setTimeout(r, 200));
          continue;
        }
        await downloadToJpeg(best.url, outPath);
        console.log(`OK! (${best.title})`);
        ok++;
        break;
      } catch (e) {
        console.log(`err: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  console.log(`Done: ${ok} available.`);
}

main().catch(console.error);
