const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const UA = "AgrivedaFieldLibrary/2.0 (https://agriveda-theta.vercel.app; authentic farmer field education)";

const REMAINING = [
  { dir: DISEASES_DIR, file: "disease-ascochyta-rabiei.jpg", queries: ["Ascochyta rabiei chickpea blight", "Ascochyta rabiei", "chickpea blight Ascochyta"] },
  { dir: DISEASES_DIR, file: "disease-uromyces-viciae-fabae.jpg", queries: ["Uromyces viciae-fabae rust", "Uromyces viciae fabae", "lentil rust Uromyces"] },
  { dir: DISEASES_DIR, file: "disease-sclerotium-cepivorum.jpg", queries: ["Sclerotium cepivorum white rot garlic onion", "Stromatinia cepivora white rot", "onion white rot Sclerotium"] },
  { dir: DISEASES_DIR, file: "disease-erysiphe-polygoni.jpg", queries: ["Erysiphe polygoni powdery mildew", "powdery mildew pea Erysiphe", "Erysiphe pisi powdery mildew"] },
  { dir: PESTS_DIR, file: "pest-maruca-vitrata.jpg", queries: ["Maruca vitrata legume pod borer", "Maruca vitrata moth caterpillar", "Maruca vitrata"] },
  { dir: PESTS_DIR, file: "pest-conogethes-punctiferalis.jpg", queries: ["Conogethes punctiferalis shoot borer", "yellow peach moth Conogethes", "Conogethes punctiferalis"] },
  { dir: PESTS_DIR, file: "pest-meloidogyne-incognita.jpg", queries: ["Meloidogyne root knot gall", "Meloidogyne incognita galls root", "root knot nematode galls"] },
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
  for (const t of REMAINING) {
    const outPath = path.join(t.dir, t.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
      console.log(`[EXISTS] ${t.file}`);
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
        break;
      } catch (e) {
        console.log(`err: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  }
}

main().catch(console.error);
