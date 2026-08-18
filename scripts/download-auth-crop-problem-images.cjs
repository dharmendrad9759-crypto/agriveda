/**
 * Download authentic crop disease/pest photos from Wikimedia Commons (free licenses).
 * Usage: node scripts/download-auth-crop-problem-images.mjs
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT_DIR = path.join(__dirname, "..", "public", "images", "crop-problems", "auth");
const UA = "AgrivedaCropProblems/1.0 (https://agriveda-theta.vercel.app; farmer education; contact via app)";

/** basename without path → Commons search terms (scientific / descriptive) */
const SEARCH = {
  "disease-magnaporthe-oryzae": "Rice blast Magnaporthe oryzae leaf",
  "disease-xanthomonas-oryzae": "Bacterial leaf blight rice Xanthomonas oryzae",
  "disease-bipolaris-oryzae": "Brown spot rice Bipolaris oryzae",
  "disease-rhizoctonia-solani": "Sheath blight rice Rhizoctonia solani",
  "disease-rice-tungro-virus": "Rice tungro virus symptoms",
  "disease-puccinia-striiformis": "Yellow rust wheat Puccinia striiformis",
  "disease-puccinia-triticina": "Brown rust wheat Puccinia triticina",
  "disease-bipolaris-sorokiniana": "Spot blotch wheat Bipolaris sorokiniana",
  "disease-ustilago-tritici": "Loose smut wheat Ustilago tritici",
  "disease-tilletia-indica": "Karnal bunt Tilletia indica",
  "disease-blumeria-graminis": "Powdery mildew wheat Blumeria graminis",
  "disease-exserohilum-turcicum": "Northern corn leaf blight Exserohilum",
  "disease-bipolaris-maydis": "Southern corn leaf blight Bipolaris maydis",
  "disease-puccinia-sorghi": "Common rust maize Puccinia sorghi",
  "disease-alternaria-solani": "Early blight tomato Alternaria solani",
  "disease-phytophthora-infestans": "Late blight potato Phytophthora infestans",
  "disease-begomovirus-leaf-curl": "Tomato leaf curl virus symptoms",
  "disease-ralstonia-solanacearum": "Bacterial wilt Ralstonia solanacearum",
  "disease-fusarium-lycopersici": "Fusarium wilt tomato",
  "disease-streptomyces-scabies": "Potato common scab Streptomyces",
  "disease-potato-virus-y": "Potato virus Y leaf symptoms",
  "disease-alternaria-porri": "Purple blotch onion Alternaria porri",
  "disease-stemphylium-vesicarium": "Stemphylium leaf blight onion",
  "disease-peronospora-destructor": "Downy mildew onion Peronospora",
  "disease-fusarium-oxysporum": "Fusarium basal rot onion",
  "disease-colletotrichum-capsici": "Anthracnose chilli Colletotrichum capsici",
  "disease-leveillula-taurica": "Powdery mildew chilli Leveillula",
  "disease-colletotrichum-gloeosporioides": "Colletotrichum gloeosporioides plant",
  "disease-damping-off": "Damping off seedling disease",
  "disease-phytoplasma-leafhopper-vector": "Little leaf brinjal phytoplasma",
  "disease-phomopsis-vexans": "Phomopsis blight eggplant",
  "disease-xanthomonas-campestris": "Black rot cabbage Xanthomonas campestris",
  "disease-hyaloperonospora-brassicae": "Downy mildew brassica",
  "disease-xanthomonas-citri-malvacearum": "Bacterial blight cotton Xanthomonas",
  "disease-alternaria-macrospora": "Alternaria leaf spot cotton",
  "disease-colletotrichum-falcatum": "Red rot sugarcane Colletotrichum falcatum",
  "disease-sporisorium-scitamineum": "Sugarcane smut Sporisorium",
  "disease-phytoplasma-grassy-shoot": "Grassy shoot sugarcane",
  "disease-puccinia-melanocephala": "Sugarcane rust Puccinia melanocephala",
  "disease-albugo-candida": "White rust mustard Albugo candida",
  "disease-alternaria-brassicae": "Alternaria blight mustard",
  "disease-phakopsora-pachyrhizi": "Soybean rust Phakopsora",
  "disease-cercospora-sojina": "Frogeye leaf spot soybean Cercospora",
  "disease-sclerotium-rolfsii": "Sclerotium rolfsii collar rot",
  "disease-mungbean-yellow-mosaic-virus": "Yellow mosaic virus mungbean",
  "disease-bhendi-yvmv": "Okra yellow vein mosaic virus",
  "disease-podosphaera-xanthii": "Powdery mildew cucumber Podosphaera",
  "disease-pseudoperonospora-cubensis": "Downy mildew cucumber Pseudoperonospora",
  "disease-cercospora-canescens": "Cercospora leaf spot",
  "disease-rhizoctonia-bataticola": "Macrophomina Rhizoctonia bataticola",
  "pest-scirpophaga-incertulas": "Yellow stem borer Scirpophaga incertulas",
  "pest-nilaparvata-lugens": "Brown planthopper Nilaparvata lugens",
  "pest-cnaphalocrocis-medinalis": "Rice leaf folder Cnaphalocrocis",
  "pest-sitobion-avenae": "Wheat aphid Sitobion avenae",
  "pest-odontotermes-obesus": "Termite Odontotermes",
  "pest-spodoptera-frugiperda": "Fall armyworm Spodoptera frugiperda",
  "pest-chilo-partellus": "Spotted stem borer Chilo partellus",
  "pest-atherigona-soccata": "Shoot fly Atherigona",
  "pest-helicoverpa-armigera": "Helicoverpa armigera larva tomato",
  "pest-bemisia-tabaci": "Bemisia tabaci whitefly",
  "pest-liriomyza-trifolii": "Leaf miner Liriomyza",
  "pest-myzus-persicae": "Myzus persicae green peach aphid",
  "pest-phthorimaea-operculella": "Potato tuber moth Phthorimaea",
  "pest-agrotis-ipsilon": "Black cutworm Agrotis ipsilon",
  "pest-agrotis-spp": "Cutworm Agrotis larva",
  "pest-thrips-tabaci": "Onion thrips Thrips tabaci",
  "pest-delia-antiqua": "Onion maggot Delia antiqua",
  "pest-scirtothrips-dorsalis": "Chilli thrips Scirtothrips dorsalis",
  "pest-polyphagotarsonemus-latus": "Broad mite Polyphagotarsonemus",
  "pest-leucinodes-orbonalis": "Brinjal shoot fruit borer Leucinodes",
  "pest-henosepilachna": "Epilachna beetle",
  "pest-amrasca-biguttula": "Cotton jassid Amrasca",
  "pest-plutella-xylostella": "Diamondback moth Plutella xylostella",
  "pest-pieris-brassicae": "Cabbage butterfly Pieris brassicae larva",
  "pest-lipaphis-erysimi": "Mustard aphid Lipaphis erysimi",
  "pest-pectinophora-gossypiella": "Pink bollworm Pectinophora",
  "pest-maconellicoccus-hirsutus": "Mealybug Maconellicoccus",
  "pest-scirpophaga-excerptalis": "Sugarcane top borer Scirpophaga",
  "pest-pyrilla-perpusilla": "Sugarcane pyrilla Pyrilla",
  "pest-odontotermes-spp": "Termite mound Odontotermes",
  "pest-bagrada-hilaris": "Painted bug Bagrada",
  "pest-athalia-proxima": "Mustard sawfly Athalia",
  "pest-spodoptera-litura": "Spodoptera litura larva",
  "pest-oberea-brevis": "Girdle beetle Oberea",
  "pest-earias-vittella": "Spotted bollworm Earias",
  "pest-bactrocera-cucurbitae": "Melon fruit fly Bactrocera",
  "pest-aulacophora-foveicollis": "Red pumpkin beetle Aulacophora",
  "pest-aphis-gossypii": "Aphis gossypii",
};

async function commonsSearch(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: "6",
      gsrlimit: "8",
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
  const list = Object.values(pages);
  const scored = list
    .map((p) => {
      const info = p.imageinfo?.[0];
      if (!info?.url) return null;
      const mime = info.mime || "";
      if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) return null;
      const license = JSON.stringify(info.extmetadata || {}).toLowerCase();
      // skip likely logos / maps
      const title = (p.title || "").toLowerCase();
      if (title.includes("logo") || title.includes("icon") || title.includes("map")) return null;
      let score = info.size || 0;
      if (mime.includes("jpeg")) score += 500000;
      if (license.includes("public domain") || license.includes("cc0") || license.includes("cc-by")) score += 200000;
      if (info.thumburl) score += 10000;
      return { title: p.title, url: info.thumburl || info.url, full: info.url, mime };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
  // fix: I used score but didn't attach - rewrite
  return null;
}

function pickBestFixed(pages) {
  if (!pages) return null;
  const scored = [];
  for (const p of Object.values(pages)) {
    const info = p.imageinfo?.[0];
    if (!info?.url) continue;
    const mime = info.mime || "";
    if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) continue;
    const title = (p.title || "").toLowerCase();
    if (title.includes("logo") || title.includes("icon") || title.includes(".svg")) continue;
    const license = JSON.stringify(info.extmetadata || {}).toLowerCase();
    let score = Number(info.size) || 0;
    if (mime.includes("jpeg")) score += 400000;
    if (license.includes("public domain") || license.includes("cc0") || license.includes("cc-by")) score += 300000;
    scored.push({
      title: p.title,
      url: info.thumburl || info.url,
      full: info.url,
      score,
      licenseSnippet: license.slice(0, 120),
    });
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
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outPath);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const listPath = path.join(__dirname, "_cp-images.txt");
  const lines = fs
    .readFileSync(listPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.startsWith("/images/"));
  const bases = [...new Set(lines.map((l) => path.basename(l, path.extname(l))))];

  const manifest = [];
  let ok = 0;
  let fail = 0;

  for (const base of bases) {
    const query = SEARCH[base] || base.replace(/^disease-|^pest-/g, "").replace(/-/g, " ");
    const outFile = path.join(OUT_DIR, `${base}.jpg`);
    process.stdout.write(`→ ${base} … `);
    try {
      const json = await commonsSearch(query);
      const best = pickBestFixed(json.query?.pages);
      if (!best) {
        console.log("no result");
        fail++;
        manifest.push({ base, ok: false, query });
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      await downloadToJpeg(best.url, outFile);
      console.log(`OK (${best.title})`);
      ok++;
      manifest.push({ base, ok: true, query, title: best.title, source: best.full });
    } catch (e) {
      console.log("FAIL", e.message);
      fail++;
      manifest.push({ base, ok: false, query, error: String(e.message) });
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  fs.writeFileSync(path.join(OUT_DIR, "_sources.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nDone. ok=${ok} fail=${fail} → ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
