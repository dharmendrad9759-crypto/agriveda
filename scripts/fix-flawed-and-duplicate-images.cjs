const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");

const UA = "AgrivedaAuthenticImageEngine/3.0 (https://agriveda-theta.vercel.app; authentic field diagnostic photography for Indian agriculture)";

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
  if (/\(1[89]\d\d\)/.test(t)) return false; // Exclude historical 18xx/19xx book scans
  return true;
}

async function getInaturalistPhotos(taxonName, max = 5) {
  try {
    // Try research grade first, then fall back to all if few results
    let url = `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(taxonName)}&quality_grade=research&photos=true&per_page=10`;
    let res = await fetch(url, { headers: { "User-Agent": UA } });
    let data = res.ok ? await res.json() : { results: [] };
    let results = data.results || [];

    if (results.length < 2) {
      url = `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(taxonName)}&photos=true&per_page=10`;
      res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.ok) {
        data = await res.json();
        results = data.results || [];
      }
    }

    const photos = [];
    for (const r of results) {
      for (const p of r.photos || []) {
        if (!p.url) continue;
        const large = p.url.replace("/square.", "/large.").replace("/medium.", "/large.");
        photos.push({
          sourceOrg: "iNaturalist",
          sourcePageUrl: `https://www.inaturalist.org/observations/${r.id}`,
          originalUrl: large,
          licence: r.license_code || "CC-BY-NC",
          attribution: `Photo by ${r.user?.login || 'Observer'} via iNaturalist observation #${r.id}`
        });
        if (photos.length >= max) break;
      }
      if (photos.length >= max) break;
    }
    return photos;
  } catch (e) {
    return [];
  }
}

async function getCommonsPhotos(query, max = 5) {
  try {
    const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: "6",
      gsrlimit: "15",
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "1280",
    });
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    return pages
      .map(p => {
        const info = p.imageinfo?.[0];
        if (!info?.url) return null;
        const mime = info.mime || "";
        if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) return null;
        if (!isGoodTitle(p.title || "")) return null;
        const meta = info.extmetadata || {};
        return {
          sourceOrg: "Wikimedia Commons",
          sourcePageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
          originalUrl: info.thumburl || info.url,
          licence: meta.LicenseShortName?.value || "CC BY-SA",
          attribution: `${p.title} via Wikimedia Commons (${meta.Artist?.value ? meta.Artist.value.replace(/<[^>]+>/g, '') : 'Wikimedia Commons'})`,
          size: Number(info.size) || 0
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.size - a.size)
      .slice(0, max);
  } catch (e) {
    return [];
  }
}

async function downloadAndOptimize(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("File too small");

  // Verify it's a real photograph and has minimum resolution
  const image = sharp(buf);
  const metadata = await image.metadata();
  if (metadata.width < 300 || metadata.height < 200) {
    throw new Error(`Image resolution too low: ${metadata.width}x${metadata.height}`);
  }

  await image
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(destPath);

  return { width: metadata.width, height: metadata.height, size: fs.statSync(destPath).size };
}

// Target replacement list
const TARGET_REPLACEMENTS = [
  // 1. Onion Purple Blotch (Replace wrong Alternaria solani image with true Alternaria porri)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-alternaria-porri",
    crop: "Onion",
    cropSci: "Allium cepa",
    condition: "Purple Blotch",
    conditionSci: "Alternaria porri",
    taxon: "Alternaria porri",
    commons: "Alternaria porri onion purple blotch",
    slotsToReplace: [1, 2, 3]
  },
  // 2. Cotton Alternaria Leaf Spot (Replace 1896 book illustration)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-alternaria-macrospora",
    crop: "Cotton",
    cropSci: "Gossypium hirsutum",
    condition: "Alternaria Leaf Spot",
    conditionSci: "Alternaria macrospora",
    taxon: "Alternaria macrospora",
    commons: "Alternaria leaf spot cotton Gossypium",
    slotsToReplace: [1, 2, 3]
  },
  // 3. Sugarcane Pyrilla (Replace 1911 Hawaii book plate)
  {
    category: "pest",
    dir: PESTS_DIR,
    base: "pest-pyrilla-perpusilla",
    crop: "Sugarcane",
    cropSci: "Saccharum officinarum",
    condition: "Pyrilla / Leafhopper",
    conditionSci: "Pyrilla perpusilla",
    taxon: "Pyrilla perpusilla",
    commons: "Pyrilla perpusilla sugarcane leafhopper",
    slotsToReplace: [1, 2, 3]
  },
  // 4. Onion Basal Rot (Disentangle from shared generic fusarium)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-fusarium-oxysporum",
    crop: "Onion",
    cropSci: "Allium cepa",
    condition: "Basal Rot",
    conditionSci: "Fusarium oxysporum f. sp. cepae",
    taxon: "Fusarium oxysporum",
    commons: "Fusarium oxysporum onion basal rot bulb",
    slotsToReplace: [2, 3]
  },
  // 5. Chickpea Wilt (Disentangle from shared generic fusarium)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-fusarium-ciceri",
    crop: "Chickpea",
    cropSci: "Cicer arietinum",
    condition: "Fusarium Wilt",
    conditionSci: "Fusarium oxysporum f. sp. ciceris",
    taxon: "Fusarium oxysporum",
    commons: "Fusarium wilt chickpea Cicer arietinum",
    slotsToReplace: [2, 3]
  },
  // 6. Banana Panama Disease (Disentangle from shared generic fusarium)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-fusarium-cubense",
    crop: "Banana",
    cropSci: "Musa acuminata",
    condition: "Panama Disease / Fusarium Wilt",
    conditionSci: "Fusarium oxysporum f. sp. cubense",
    taxon: "Fusarium oxysporum",
    commons: "Fusarium wilt banana Panama disease Musa",
    slotsToReplace: [2, 3]
  },
  // 7. Tomato Fusarium Wilt
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-fusarium-lycopersici",
    crop: "Tomato",
    cropSci: "Solanum lycopersicum",
    condition: "Fusarium Wilt",
    conditionSci: "Fusarium oxysporum f. sp. lycopersici",
    taxon: "Fusarium oxysporum",
    commons: "Fusarium wilt tomato Solanum lycopersicum vascular",
    slotsToReplace: [2, 3]
  },
  // 8. Mungbean Yellow Mosaic Virus (Disentangle from Okra YVMV)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-mungbean-yellow-mosaic-virus",
    crop: "Moong / Mungbean",
    cropSci: "Vigna radiata",
    condition: "Yellow Mosaic Virus",
    conditionSci: "Mungbean yellow mosaic virus (MYMV)",
    taxon: "Begomovirus",
    commons: "Mungbean yellow mosaic virus Vigna leaf symptoms",
    slotsToReplace: [2, 3]
  },
  // 9. Okra Yellow Vein Mosaic Virus
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-bhendi-yvmv",
    crop: "Okra / Bhindi",
    cropSci: "Abelmoschus esculentus",
    condition: "Yellow Vein Mosaic Virus",
    conditionSci: "Bhendi yellow vein mosaic virus (BYVMV)",
    taxon: "Begomovirus",
    commons: "Abelmoschus esculentus yellow vein mosaic okra",
    slotsToReplace: [2, 3]
  },
  // 10. Chickpea Ascochyta Blight (Replace duplicate slot 2)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-ascochyta-rabiei",
    crop: "Chickpea",
    cropSci: "Cicer arietinum",
    condition: "Ascochyta Blight",
    conditionSci: "Ascochyta rabiei",
    taxon: "Ascochyta rabiei",
    commons: "Ascochyta rabiei chickpea blight lesions",
    slotsToReplace: [2]
  },
  // 11. Bacterial Wilt (Disentangle duplicate slot 2 & 3)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-ralstonia-solanacearum",
    crop: "Solanaceous",
    cropSci: "Solanum",
    condition: "Bacterial Wilt",
    conditionSci: "Ralstonia solanacearum",
    taxon: "Ralstonia solanacearum",
    commons: "Ralstonia solanacearum bacterial wilt field plant",
    slotsToReplace: [3]
  },
  // 12. Rice Bacterial Leaf Blight (Disentangle duplicate slot 2 & 3)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-xanthomonas-oryzae",
    crop: "Paddy / Rice",
    cropSci: "Oryza sativa",
    condition: "Bacterial Leaf Blight",
    conditionSci: "Xanthomonas oryzae pv. oryzae",
    taxon: "Xanthomonas oryzae",
    commons: "Xanthomonas oryzae bacterial leaf blight rice",
    slotsToReplace: [3]
  },
  // 13. Rice Yellow Stem Borer (Disentangle duplicate slot 2 & 3)
  {
    category: "pest",
    dir: PESTS_DIR,
    base: "pest-scirpophaga-incertulas",
    crop: "Paddy / Rice",
    cropSci: "Oryza sativa",
    condition: "Yellow Stem Borer",
    conditionSci: "Scirpophaga incertulas",
    taxon: "Scirpophaga incertulas",
    commons: "Scirpophaga incertulas rice stem borer moth deadheart",
    slotsToReplace: [3]
  },
  // 14. Soybean Bacterial Pustule (Replace 183x161 low-res)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-xanthomonas-axonopodis-pv-glycines",
    crop: "Soybean",
    cropSci: "Glycine max",
    condition: "Bacterial Pustule",
    conditionSci: "Xanthomonas axonopodis pv. glycines",
    taxon: "Xanthomonas axonopodis",
    commons: "Xanthomonas axonopodis bacterial pustule soybean Glycine max",
    slotsToReplace: [1]
  },
  // 15. Pigeonpea Pod Fly (Replace low-res)
  {
    category: "pest",
    dir: PESTS_DIR,
    base: "pest-melanagromyza-obtusa",
    crop: "Pigeonpea / Arhar",
    cropSci: "Cajanus cajan",
    condition: "Pod Fly",
    conditionSci: "Melanagromyza obtusa",
    taxon: "Melanagromyza",
    commons: "Melanagromyza obtusa pod fly Cajanus cajan pigeonpea",
    slotsToReplace: [1]
  },
  // 16. Sugarcane Rust (Replace low-res & disentangle)
  {
    category: "disease",
    dir: DISEASES_DIR,
    base: "disease-puccinia-melanocephala",
    crop: "Sugarcane",
    cropSci: "Saccharum officinarum",
    condition: "Brown Rust",
    conditionSci: "Puccinia melanocephala",
    taxon: "Puccinia melanocephala",
    commons: "Puccinia melanocephala sugarcane rust leaf",
    slotsToReplace: [1, 2, 3]
  }
];

async function run() {
  console.log(`Starting authentic replacement for ${TARGET_REPLACEMENTS.length} targeted conditions...`);
  const logs = [];

  for (const item of TARGET_REPLACEMENTS) {
    console.log(`\nProcessing ${item.base} (${item.crop} - ${item.condition}) for slots [${item.slotsToReplace.join(", ")}]...`);
    
    // Fetch from iNat and Commons
    const inatPhotos = await getInaturalistPhotos(item.taxon, 6);
    const commonsPhotos = await getCommonsPhotos(item.commons, 6);
    const pool = [...inatPhotos, ...commonsPhotos];

    if (pool.length === 0) {
      console.log(` ❌ No authentic candidate photos found for ${item.base}`);
      logs.push({ item: item.base, status: "NO_CANDIDATE" });
      continue;
    }

    console.log(`  Found ${pool.length} authentic candidates (${inatPhotos.length} iNat, ${commonsPhotos.length} Commons)`);
    let poolIdx = 0;

    for (const slot of item.slotsToReplace) {
      const fileName = slot === 1 ? `${item.base}.jpg` : `${item.base}-${slot}.jpg`;
      const targetPath = path.join(item.dir, fileName);

      let success = false;
      while (poolIdx < pool.length && !success) {
        const candidate = pool[poolIdx++];
        try {
          console.log(`  Downloading slot ${slot} from ${candidate.sourceOrg}: ${candidate.originalUrl}`);
          const res = await downloadAndOptimize(candidate.originalUrl, targetPath);
          console.log(`   ✅ Saved ${fileName} (${res.width}x${res.height}, ${(res.size/1024).toFixed(1)} KB)`);
          logs.push({
            item: item.base,
            slot,
            fileName,
            sourceOrg: candidate.sourceOrg,
            sourcePageUrl: candidate.sourcePageUrl,
            originalUrl: candidate.originalUrl,
            licence: candidate.licence,
            attribution: candidate.attribution,
            status: "SUCCESS"
          });
          success = true;
        } catch (e) {
          console.log(`   ⚠️ Candidate failed: ${e.message}`);
        }
      }

      if (!success) {
        console.log(`   ❌ Could not fill slot ${slot} for ${item.base}`);
      }
    }

    // Polite delay
    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync(path.join(ROOT, "scripts", "replacement-log.json"), JSON.stringify(logs, null, 2), "utf8");
  console.log("\nFinished replacements. Results logged in scripts/replacement-log.json");
}

run().catch(console.error);
