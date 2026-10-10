const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const AUTH_DIR = path.join(ROOT, "public", "images", "crop-problems", "auth");
const UA = "AgrivedaFieldLibrary/3.0 (https://agriveda-theta.vercel.app; authentic farmer education; ag research)";

const BAD_WORDS = [
  "diagram", "drawing", "illustration", "sketch", "scheme",
  "chemical", "structure", "formula", "molecule", "etoxazole", "compound",
  "map", "chart", "graph", "tree", "phylogeny",
  "stamp", "coin", "banknote", "currency",
  "icon", "logo", "vector", "symbol", "sign",
  "catalog", "book", "cover", "title page", "plate", "advertisement", "eb1911", "1896", "1909", "1911",
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

async function commonsSearch(query) {
  const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "25",
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1280",
  });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
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
        size: Number(info.size) || 0
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.size - a.size);
}

async function downloadToJpeg(url, outPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`DL ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("Image buffer too small");
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outPath);
}

const CRITICAL_FIXES = [
  // 1. Purple blotch onion (must be onion leaf/scape with purple lesion, NOT tomato early blight!)
  {
    target: "disease-alternaria-porri.jpg",
    dir: DISEASES_DIR,
    queries: [
      "Alternaria porri onion",
      "purple blotch onion leaf",
      "purple blotch Allium cepa",
      "Alternaria porri Allium"
    ]
  },
  // 2. Cotton alternaria leaf spot (must be real cotton leaf lesions, NOT 1896 book scan!)
  {
    target: "disease-alternaria-macrospora.jpg",
    dir: DISEASES_DIR,
    queries: [
      "Alternaria macrospora cotton leaf",
      "Alternaria leaf spot cotton Gossypium",
      "Alternaria leaf spot cotton",
      "cotton Alternaria leaf"
    ]
  },
  // 3. Karnal bunt wheat (must be real infected wheat ear or bunted grains, NOT microscope spore!)
  {
    target: "disease-tilletia-indica.jpg",
    dir: DISEASES_DIR,
    queries: [
      "Karnal bunt wheat grains bunted",
      "Tilletia indica wheat kernel",
      "Karnal bunt Tilletia indica wheat",
      "bunted wheat grains"
    ]
  },
  // 4. Sugarcane pyrilla (must be real pyrilla hopper on sugarcane leaf, NOT 1911 book scan!)
  {
    target: "pest-pyrilla-perpusilla.jpg",
    dir: PESTS_DIR,
    queries: [
      "Pyrilla perpusilla sugarcane leaf",
      "Pyrilla perpusilla hopper",
      "sugarcane planthopper Pyrilla",
      "Pyrilla perpusilla"
    ]
  },
  // 5. Plutella xylostella-3 (must be real diamondback moth adult / pupa, NOT Etoxazole.png!)
  {
    target: "pest-plutella-xylostella-3.jpg",
    dir: PESTS_DIR,
    queries: [
      "Plutella xylostella moth on leaf",
      "diamondback moth adult resting",
      "Plutella xylostella adult moth",
      "Plutella xylostella pupa cocoon"
    ]
  },
  // 6. Powdery mildew-2 (must be real powdery mildew on cucumber leaf, NOT Catalog 1961!)
  {
    target: "disease-podosphaera-xanthii-2.jpg",
    dir: DISEASES_DIR,
    queries: [
      "Podosphaera xanthii powdery mildew cucumber leaf",
      "powdery mildew melon leaf white fungus",
      "powdery mildew cucurbit leaf",
      "Podosphaera powdery mildew leaf"
    ]
  }
];

async function runFixes() {
  console.log("Running critical image replacements...");
  for (const item of CRITICAL_FIXES) {
    process.stdout.write(`Fixing ${item.target} ... `);
    let done = false;
    for (const q of item.queries) {
      try {
        const results = await commonsSearch(q);
        if (results.length > 0) {
          const best = results[0];
          const outPath = path.join(item.dir, item.target);
          await downloadToJpeg(best.url, outPath);
          // Also sync to auth dir if present
          const authPath = path.join(AUTH_DIR, item.target);
          if (fs.existsSync(AUTH_DIR)) {
            try { fs.copyFileSync(outPath, authPath); } catch {}
          }
          console.log(`OK! Picked: ${best.title}`);
          done = true;
          break;
        }
      } catch (e) {
        // try next
      }
      await new Promise(r => setTimeout(r, 200));
    }
    if (!done) {
      console.log("FAIL - no match found");
    }
    await new Promise(r => setTimeout(r, 300));
  }
}

runFixes().catch(console.error);
