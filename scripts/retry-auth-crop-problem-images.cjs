/**
 * Retry failed Wikimedia downloads with better search queries.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT_DIR = path.join(__dirname, "..", "public", "images", "crop-problems", "auth");
const UA = "AgrivedaCropProblems/1.0 (https://agriveda-theta.vercel.app; farmer education)";

const RETRY = {
  "disease-alternaria-brassicae": ["Alternaria brassicae", "Alternaria leaf spot mustard"],
  "disease-alternaria-porri": ["Alternaria porri", "purple blotch onion leaf"],
  "disease-begomovirus-leaf-curl": ["Tomato yellow leaf curl", "Tomato leaf curl disease"],
  "disease-bhendi-yvmv": ["Okra yellow vein mosaic", "Bhendi yellow vein mosaic"],
  "disease-bipolaris-oryzae": ["Cochliobolus miyabeanus", "brown spot rice leaf"],
  "disease-bipolaris-sorokiniana": ["Cochliobolus sativus", "spot blotch wheat leaf"],
  "disease-cercospora-sojina": ["Cercospora sojina", "frogeye leaf spot soybean"],
  "disease-colletotrichum-capsici": ["Colletotrichum capsici", "anthracnose pepper fruit"],
  "disease-colletotrichum-falcatum": ["Colletotrichum falcatum", "red rot sugarcane stem"],
  "disease-exserohilum-turcicum": ["Setosphaeria turcica", "northern corn leaf blight"],
  "disease-fusarium-oxysporum": ["Fusarium oxysporum wilt plant", "Fusarium wilt symptoms"],
  "disease-leveillula-taurica": ["Leveillula taurica", "powdery mildew pepper leaf"],
  "disease-magnaporthe-oryzae": ["Pyricularia oryzae", "rice blast leaf lesion"],
  "disease-mungbean-yellow-mosaic-virus": ["Mungbean yellow mosaic", "yellow mosaic virus bean leaf"],
  "disease-podosphaera-xanthii": ["Podosphaera xanthii", "powdery mildew cucumber leaf"],
  "disease-potato-virus-y": ["Potato virus Y symptoms", "PVY potato leaf mosaic"],
  "disease-puccinia-melanocephala": ["Puccinia melanocephala", "sugarcane rust leaf"],
  "disease-rhizoctonia-bataticola": ["Macrophomina phaseolina", "charcoal rot plant"],
  "disease-rhizoctonia-solani": ["Rhizoctonia solani sheath blight", "rice sheath blight"],
  "disease-rice-tungro-virus": ["Rice tungro disease", "tungro rice plant"],
  "disease-sclerotium-rolfsii": ["Athelia rolfsii", "southern blight Sclerotium rolfsii"],
  "disease-stemphylium-vesicarium": ["Stemphylium vesicarium", "Stemphylium leaf blight"],
  "disease-ustilago-tritici": ["Ustilago nuda", "loose smut wheat ear"],
  "pest-amrasca-biguttula": ["Amrasca biguttula", "cotton leafhopper"],
  "pest-athalia-proxima": ["Athalia lugens", "mustard sawfly larva"],
  "pest-chilo-partellus": ["Chilo partellus", "spotted stem borer larva"],
  "pest-cnaphalocrocis-medinalis": ["Cnaphalocrocis medinalis", "rice leaf folder"],
  "pest-helicoverpa-armigera": ["Helicoverpa armigera larva", "cotton bollworm caterpillar"],
  "pest-oberea-brevis": ["Oberea", "longhorn beetle stem girdle"],
  "pest-pyrilla-perpusilla": ["Pyrilla perpusilla", "sugarcane leafhopper"],
  "pest-scirpophaga-excerptalis": ["Scirpophaga excerptalis", "sugarcane top borer"],
  "pest-sitobion-avenae": ["Sitobion avenae", "English grain aphid"],
};

async function commonsSearch(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "12",
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
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outPath);
}

async function main() {
  const manifestPath = path.join(OUT_DIR, "_sources.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  let ok = 0;
  let fail = 0;

  for (const [base, queries] of Object.entries(RETRY)) {
    const outFile = path.join(OUT_DIR, `${base}.jpg`);
    if (fs.existsSync(outFile) && fs.statSync(outFile).size > 8000) {
      console.log(`skip existing ${base}`);
      continue;
    }
    let done = false;
    for (const query of queries) {
      process.stdout.write(`→ ${base} [${query}] … `);
      try {
        const json = await commonsSearch(query);
        const best = pickBest(json.query?.pages);
        if (!best) {
          console.log("no");
          await new Promise((r) => setTimeout(r, 350));
          continue;
        }
        await downloadToJpeg(best.url, outFile);
        console.log(`OK ${best.title}`);
        const i = manifest.findIndex((m) => m.base === base);
        const row = { base, ok: true, query, title: best.title, source: best.full };
        if (i >= 0) manifest[i] = row;
        else manifest.push(row);
        ok++;
        done = true;
        break;
      } catch (e) {
        console.log("FAIL", e.message);
      }
      await new Promise((r) => setTimeout(r, 450));
    }
    if (!done) fail++;
    await new Promise((r) => setTimeout(r, 400));
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`retry done ok=${ok} still_fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
