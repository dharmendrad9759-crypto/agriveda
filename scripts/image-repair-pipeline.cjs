/**
 * REPEATABLE IMAGE REPAIR & VERIFICATION PIPELINE
 * Agriveda Authentic Crop Image Engine
 * 
 * Usage: node scripts/image-repair-pipeline.cjs
 * 
 * Safe rerun: skips verified images, repairs missing/corrupt/low-res/flawed images,
 * syncs threat gallery manifest, and updates image_provenance_manifest.json.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const UA = "AgrivedaImageRepairPipeline/3.0 (https://agriveda-theta.vercel.app; authentic field agriculture photography)";

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
  if (/\(1[89]\d\d\)/.test(t)) return false;
  return true;
}

async function validateLocalImage(relPath) {
  const full = path.join(ROOT, "public", relPath.replace(/^\//, ""));
  if (!fs.existsSync(full)) {
    return { valid: false, reason: "MISSING_IMAGE" };
  }
  const stat = fs.statSync(full);
  if (stat.size < 5000) {
    return { valid: false, reason: "LOW_QUALITY_OR_CORRUPT" };
  }
  try {
    const meta = await sharp(full).metadata();
    if (meta.width < 250 || meta.height < 200) {
      return { valid: false, reason: "LOW_RESOLUTION" };
    }
    return { valid: true, width: meta.width, height: meta.height, size: stat.size };
  } catch (e) {
    return { valid: false, reason: "CORRUPT_IMAGE" };
  }
}

async function searchInatPhoto(taxonName) {
  try {
    const url = `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(taxonName)}&photos=true&per_page=5`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const data = await res.json();
    for (const r of data.results || []) {
      const p = r.photos?.[0];
      if (p?.url) {
        return {
          url: p.url.replace("/square.", "/large.").replace("/medium.", "/large."),
          org: "iNaturalist",
          sourceUrl: `https://www.inaturalist.org/observations/${r.id}`,
          licence: r.license_code || "CC BY-NC",
          attribution: `Observer via iNaturalist observation #${r.id}`
        };
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function searchCommonsPhoto(query) {
  try {
    const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: "6",
      gsrlimit: "10",
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "1280",
    });
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    for (const p of pages) {
      const info = p.imageinfo?.[0];
      if (!info?.url) continue;
      if (!isGoodTitle(p.title || "")) continue;
      const meta = info.extmetadata || {};
      return {
        url: info.thumburl || info.url,
        org: "Wikimedia Commons",
        sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
        licence: meta.LicenseShortName?.value || "CC BY-SA",
        attribution: `${p.title} via Wikimedia Commons`
      };
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function downloadAndOptimize(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("File too small");

  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(destPath);

  return fs.statSync(destPath).size;
}

async function runPipeline() {
  console.log("=================================================");
  console.log("AgriVeda Authentic Crop Image Repair Pipeline");
  console.log("=================================================\n");

  const ccpPath = path.join(ROOT, "data", "crop-curative-problems.ts");
  const ccpContent = fs.readFileSync(ccpPath, "utf8");
  const regex = /prob\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*`\$\{([DP])\}\/([^`]+)`/g;

  let totalAudited = 0;
  let verifiedGood = 0;
  let repairedCount = 0;
  let unresolvedCount = 0;

  const records = [];
  let m;
  while ((m = regex.exec(ccpContent)) !== null) {
    totalAudited++;
    const id = m[1];
    const nameHi = m[2];
    const nameEn = m[3];
    const type = m[4];
    const dir = m[5] === "D" ? "diseases" : "pests";
    const filename = m[6];
    const relPath = `/images/${dir}/${filename}`;

    const status = await validateLocalImage(relPath);
    if (status.valid) {
      verifiedGood++;
    } else {
      console.log(`⚠️ Problem image needs repair: ${relPath} (${status.reason})`);
      // Attempt repair
      let cand = await searchInatPhoto(nameEn);
      if (!cand) cand = await searchCommonsPhoto(`${nameEn} field`);
      if (cand) {
        try {
          const dest = path.join(ROOT, "public", "images", dir, filename);
          await downloadAndOptimize(cand.url, dest);
          console.log(` ✅ Repaired ${relPath} from ${cand.org}`);
          repairedCount++;
        } catch (e) {
          console.log(` ❌ Repair failed: ${e.message}`);
          unresolvedCount++;
        }
      } else {
        unresolvedCount++;
      }
    }
  }

  console.log("\nPipeline Execution Summary:");
  console.log(` - Total curative problem images audited: ${totalAudited}`);
  console.log(` - Verified Good (retained intact): ${verifiedGood}`);
  console.log(` - Repaired / Updated: ${repairedCount}`);
  console.log(` - Unresolved: ${unresolvedCount}`);

  // Re-sync threat gallery manifest
  console.log("\nSyncing threat gallery manifest...");
  require("./generate-threat-gallery-manifest.cjs");

  // Re-sync provenance manifest
  console.log("\nSyncing image provenance manifest...");
  require("./build-image-provenance-manifest.cjs");

  console.log("\n✅ Pipeline completed successfully!");
}

runPipeline().catch(console.error);
