const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const UA = "AgrivedaCropProblems/1.0 (https://agriveda-theta.vercel.app; farmer education)";
const DISEASES = path.join(__dirname, "..", "public", "images", "diseases");
const AUTH = path.join(__dirname, "..", "public", "images", "crop-problems", "auth");

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

function pickCommonScab(pages) {
  const scored = [];
  for (const p of Object.values(pages || {})) {
    const info = p.imageinfo?.[0];
    if (!info?.url) continue;
    const mime = info.mime || "";
    if (!mime.includes("jpeg") && !mime.includes("png")) continue;
    const title = (p.title || "").toLowerCase();
    if (title.includes("logo") || title.includes("icon") || title.includes(".svg")) continue;
    if (title.includes("diagram") || title.includes("tree") || title.includes("phylogen")) continue;
    if (title.includes("culture") || title.includes("petri") || title.includes("agar") || title.includes("microscope")) continue;
    // avoid black scurf / rhizoctonia
    if (title.includes("black scurf") || title.includes("rhizoctonia") || title.includes("sclerotia")) continue;
    let score = Number(info.size) || 0;
    if (title.includes("scab")) score += 900000;
    if (title.includes("streptomyces")) score += 500000;
    if (title.includes("potato") || title.includes("solanum")) score += 400000;
    if (title.includes("common")) score += 200000;
    scored.push({ title: p.title, url: info.thumburl || info.url, full: info.url, score });
  }
  scored.sort((a, b) => b.score - a.score);
  console.log("candidates:");
  for (const s of scored.slice(0, 6)) console.log(s.score, s.title);
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
  const queries = [
    "common scab potato",
    "Streptomyces scabies potato tuber",
    "potato scab lesions",
  ];
  let best = null;
  let used = "";
  for (const q of queries) {
    const json = await commonsSearch(q);
    best = pickCommonScab(json.query?.pages);
    if (best) {
      used = q;
      break;
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  if (!best) throw new Error("no common scab image");
  const auth = path.join(AUTH, "disease-streptomyces-scabies.jpg");
  const dest = path.join(DISEASES, "disease-streptomyces-scabies.jpg");
  await downloadToJpeg(best.url, auth);
  fs.copyFileSync(auth, dest);
  console.log("OK", used, best.title, best.full);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
