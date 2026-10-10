const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const UA = "AgrivedaFieldLibrary/3.0 (https://agriveda-theta.vercel.app; farmer authentic field education; ag research)";

// Quality filter words to exclude non-field photos
const BAD_WORDS = [
  "diagram", "drawing", "illustration", "sketch", "scheme",
  "chemical", "structure", "formula", "molecule", "etoxazole", "compound",
  "map", "chart", "graph", "histogram", "tree", "phylogeny",
  "stamp", "coin", "banknote", "currency",
  "icon", "logo", "vector", "symbol", "sign",
  "catalog", "book", "cover", "title page", "plate", "advertisement",
  "microscope", "microscopic", "spore", "uredospore", "teliospore", "conidia", "conidiophore",
  "asci", "hyphae", "section", "histology", "sem", "tem"
];

function isGoodTitle(title) {
  const t = title.toLowerCase();
  for (const b of BAD_WORDS) {
    if (t.includes(b)) return false;
  }
  return true;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function searchCategory(cat) {
  try {
    const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
      action: "query",
      format: "json",
      generator: "categorymembers",
      gcmtitle: `Category:${cat}`,
      gcmtype: "file",
      gcmlimit: "30",
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "1280",
    });
    const data = await fetchJson(url);
    const pages = Object.values(data.query?.pages || {});
    return pages
      .map(p => {
        const info = p.imageinfo?.[0];
        if (!info?.url) return null;
        const mime = info.mime || "";
        if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) return null;
        if (!isGoodTitle(p.title || "")) return null;
        return {
          title: p.title,
          url: info.thumburl || info.url,
          full: info.url,
          size: Number(info.size) || 0
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.size - a.size);
  } catch (e) {
    return [];
  }
}

async function searchCommons(query) {
  try {
    const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: "6",
      gsrlimit: "20",
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "1280",
    });
    const data = await fetchJson(url);
    const pages = Object.values(data.query?.pages || {});
    return pages
      .map(p => {
        const info = p.imageinfo?.[0];
        if (!info?.url) return null;
        const mime = info.mime || "";
        if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) return null;
        if (!isGoodTitle(p.title || "")) return null;
        return {
          title: p.title,
          url: info.thumburl || info.url,
          full: info.url,
          size: Number(info.size) || 0
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.size - a.size);
  } catch (e) {
    return [];
  }
}

async function downloadAndOptimize(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("Image too small / corrupted");
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(destPath);
}

// Test download on a few key targets
async function test() {
  console.log("Ready to download authentic field photos.");
}

test();
