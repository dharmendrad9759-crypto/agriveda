/**
 * Fix mismatched potato disease photos + a few other wrong remaps.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES = path.join(ROOT, "public", "images", "diseases");
const AUTH = path.join(ROOT, "public", "images", "crop-problems", "auth");
const UA = "AgrivedaCropProblems/1.0 (https://agriveda-theta.vercel.app; farmer education)";

const DOWNLOADS = [
  {
    base: "disease-potato-black-scurf",
    queries: [
      "potato black scurf sclerotia",
      "Rhizoctonia solani potato tuber black scurf",
      "black scurf potato",
    ],
  },
  {
    base: "disease-streptomyces-scabies",
    queries: [
      "potato common scab Streptomyces",
      "common scab potato tuber",
      "Streptomyces scabies potato",
    ],
    // force replace — current file looks like black scurf
    force: true,
  },
  {
    base: "disease-begomovirus-leaf-curl",
    queries: [
      "Tomato yellow leaf curl virus",
      "tomato leaf curl symptoms",
      "begomovirus tomato leaf curl",
    ],
    force: true,
  },
  {
    base: "disease-mungbean-yellow-mosaic-virus",
    queries: ["mungbean yellow mosaic virus", "yellow mosaic mung bean leaf"],
  },
  {
    base: "disease-colletotrichum-falcatum",
    queries: ["red rot sugarcane", "Colletotrichum falcatum stem"],
  },
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
      gsrlimit: "12",
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "1280",
    });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`search ${res.status}`);
  return res.json();
}

function pickBest(pages, preferTitle) {
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
    if (title.includes("culture") || title.includes("petri") || title.includes("agar")) continue;
    const license = JSON.stringify(info.extmetadata || {}).toLowerCase();
    let score = Number(info.size) || 0;
    if (mime.includes("jpeg")) score += 400000;
    if (license.includes("public domain") || license.includes("cc0") || license.includes("cc-by")) score += 300000;
    if (preferTitle && preferTitle.some((k) => title.includes(k))) score += 800000;
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

function copyBoth(base) {
  const src = path.join(AUTH, `${base}.jpg`);
  const dest = path.join(DISEASES, `${base}.jpg`);
  fs.copyFileSync(src, dest);
}

async function fetchOne(item) {
  const outAuth = path.join(AUTH, `${item.base}.jpg`);
  if (!item.force && fs.existsSync(outAuth) && fs.statSync(outAuth).size > 8000) {
    console.log(`skip existing ${item.base}`);
    copyBoth(item.base);
    return true;
  }

  for (const query of item.queries) {
    process.stdout.write(`→ ${item.base} [${query}] … `);
    try {
      const json = await commonsSearch(query);
      const prefer =
        item.base.includes("black-scurf")
          ? ["black scurf", "scurf", "rhizoctonia", "potato"]
          : item.base.includes("scabies")
            ? ["scab", "streptomyces", "potato"]
            : item.base.includes("leaf-curl")
              ? ["tomato", "leaf curl", "tylc"]
              : null;
      const best = pickBest(json.query?.pages, prefer);
      if (!best) {
        console.log("no");
        await new Promise((r) => setTimeout(r, 350));
        continue;
      }
      await downloadToJpeg(best.url, outAuth);
      copyBoth(item.base);
      console.log(`OK (${best.title})`);
      return true;
    } catch (e) {
      console.log("FAIL", e.message);
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function main() {
  fs.mkdirSync(AUTH, { recursive: true });
  fs.mkdirSync(DISEASES, { recursive: true });

  // Keep current "streptomyces" photo as black-scurf fallback if download fails
  // (that file already looks like potato black scurf sclerotia).
  const oldScab = path.join(DISEASES, "disease-streptomyces-scabies.jpg");
  const blackFallback = path.join(DISEASES, "disease-potato-black-scurf.jpg");
  if (fs.existsSync(oldScab) && !fs.existsSync(blackFallback)) {
    fs.copyFileSync(oldScab, blackFallback);
    fs.copyFileSync(oldScab, path.join(AUTH, "disease-potato-black-scurf.jpg"));
    console.log("seeded black-scurf from previous scab photo");
  }

  for (const item of DOWNLOADS) {
    const ok = await fetchOne(item);
    if (!ok) console.log(`FAILED ${item.base}`);
  }

  // If black scurf download failed but fallback exists, keep it
  if (fs.existsSync(blackFallback)) {
    console.log("black-scurf file ready:", fs.statSync(blackFallback).size);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
