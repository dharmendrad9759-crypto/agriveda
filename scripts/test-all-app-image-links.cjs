const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

console.log("=== Testing All App Image Paths on Disk ===");

const testedUrls = new Set();
const missingPaths = [];
const validPaths = [];

function checkUrl(url) {
  if (!url || typeof url !== "string") return;
  if (!url.startsWith("/images/")) return;
  if (testedUrls.has(url)) return;
  testedUrls.add(url);

  const localFile = path.join(ROOT, "public", url.replace(/^\//, ""));
  if (!fs.existsSync(localFile)) {
    missingPaths.push(url);
  } else {
    const size = fs.statSync(localFile).size;
    if (size < 1000) {
      missingPaths.push(`${url} (corrupt/empty: ${size} bytes)`);
    } else {
      validPaths.push({ url, size });
    }
  }
}

// 1. Crop Images
const cropImagesContent = fs.readFileSync(path.join(ROOT, "lib", "crops", "cropImages.ts"), "utf8");
const cropMatches = [...cropImagesContent.matchAll(/"(\/images\/crops\/[^"]+)"/g)];
cropMatches.forEach(m => checkUrl(m[1]));

// 2. Curative Problems
const ccpContent = fs.readFileSync(path.join(ROOT, "data", "crop-curative-problems.ts"), "utf8");
const ccpMatches = [...ccpContent.matchAll(/prob\(\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*`\$\{([DP])\}\/([^`]+)`/g)];
ccpMatches.forEach(m => {
  const dir = m[1] === "D" ? "diseases" : "pests";
  checkUrl(`/images/${dir}/${m[2]}`);
});

// 3. Threat Gallery Manifest
const manifestContent = fs.readFileSync(path.join(ROOT, "lib", "crops", "threatGalleryManifest.ts"), "utf8");
const manifestMatches = [...manifestContent.matchAll(/"(\/images\/(?:diseases|pests)\/[^"]+)"/g)];
manifestMatches.forEach(m => checkUrl(m[1]));

// 4. Weeds
const weedContent = fs.readFileSync(path.join(ROOT, "lib", "weeds", "weedStageImages.ts"), "utf8");
const weedMatches = [...weedContent.matchAll(/"(\/images\/weeds\/[^"]+)"/g)];
weedMatches.forEach(m => checkUrl(m[1]));

// 5. Nutrients
const nutrientBatch = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "imports", "agriveda-nutrient-deficiency-batch.json"), "utf8"));
(nutrientBatch.nutrients || []).forEach(n => {
  checkUrl(`/images/deficiencies/${n.slug}.jpg`);
});

console.log(`Total unique image paths verified: ${testedUrls.size}`);
console.log(`Valid images: ${validPaths.length}`);
console.log(`Missing or corrupt images: ${missingPaths.length}`);

if (missingPaths.length > 0) {
  console.log("Missing paths:", missingPaths);
  process.exit(1);
} else {
  console.log("✅ 100% of referenced image paths exist and are valid!");
}

// 6. Test representative live routes against local Next.js dev server
async function testRoutes() {
  console.log("\n=== Testing Representative Live App Routes ===");
  const routes = [
    "/crops/wheat",
    "/crops/tomato",
    "/crops/paddy",
    "/crop-problems/wheat/karnal-bunt",
    "/crop-problems/tomato/early-blight",
    "/crop-problems/cotton/alternaria",
    "/crop-problems/sugarcane/pyrilla",
    "/crop-problems/onion/purple-blotch",
    "/deficiencies/nitrogen",
    "/deficiencies/zinc",
    "/crops/paddy/care/diseases",
    "/crops/paddy/care/pests"
  ];

  let passed = 0;
  for (const r of routes) {
    try {
      const res = await fetch(`http://127.0.0.1:3000${r}`);
      if (res.status === 200) {
        console.log(` ✅ ${r} -> HTTP 200 OK`);
        passed++;
      } else {
        console.log(` ⚠️ ${r} -> HTTP ${res.status}`);
      }
    } catch (e) {
      console.log(` ❌ ${r} -> Connection failed (${e.message})`);
    }
  }
  console.log(`\nRoute validation: ${passed}/${routes.length} passed.`);
}

testRoutes().catch(console.error);
