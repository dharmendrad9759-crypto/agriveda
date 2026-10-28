import fs from "fs";

// 1. Read sitemap
const sitemapPath = "C:/Users/admin/.gemini/antigravity-ide/brain/7492d21a-8f6f-46d0-8757-817967236f0c/.system_generated/steps/6078/content.md";
const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
const allUrls = Array.from(sitemapContent.matchAll(/<loc>(https:[^<]+)<\/loc>/g)).map(m => m[1]);
const tkProtectionUrls = allUrls.filter(u => u.includes("/crop-protection/") && !u.includes("/hi/"));

// 2. Read index content if available
let tkTitles = {};
const indexPath = "C:/Users/admin/.gemini/antigravity-ide/brain/7492d21a-8f6f-46d0-8757-817967236f0c/.system_generated/steps/6086/content.md";
if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  // Extract link and title pairs: href="/(hi/)?crop-protection/([^"]+)" ... title/text
  const cardRegex = /href=["']\/(?:hi\/)?crop-protection\/([^"']+)["'][^>]*>[\s\S]*?<h[23][^>]*>(.*?)<\/h[23]>/g;
  let m;
  while ((m = cardRegex.exec(indexHtml)) !== null) {
    const slug = m[1];
    const title = m[2].replace(/<[^>]+>/g, "").trim();
    tkTitles[slug] = title;
  }
}

console.log("Total TK Protection Slugs:", tkProtectionUrls.length);
console.log("Found titles for slugs:", Object.keys(tkTitles).length);

// 3. Extract unique slugs
const tkSlugs = tkProtectionUrls.map(u => u.split("/").pop());

// 4. Group by type / crop
const deficiencies = tkSlugs.filter(s => s.includes("deficiency"));
const pests = [];
const diseases = [];

console.log("\n--- DEFICIENCIES in TechnicalKisan (" + deficiencies.length + ") ---");
deficiencies.forEach(d => console.log(`  - ${d}: ${tkTitles[d] || ""}`));

// Read Agriveda curative problems
const curativePath = "data/crop-curative-problems.ts";
const curativeContent = fs.readFileSync(curativePath, "utf8");
const agrivedaProblems = Array.from(curativeContent.matchAll(/"id":\s*"([^"]+)",\s*"nameHi":\s*"([^"]+)",\s*"nameEn":\s*"([^"]+)"/g))
  .map(m => ({ id: m[1], nameHi: m[2], nameEn: m[3] }));

console.log("\nTotal Agriveda Curative Problems:", agrivedaProblems.length);

// Check overlap and differences
const agrivedaIds = new Set(agrivedaProblems.map(p => p.id.toLowerCase()));
const inBoth = [];
const inTKOnly = [];

for (const slug of tkSlugs) {
  const match = agrivedaProblems.find(p => 
    p.id.toLowerCase() === slug.toLowerCase() ||
    slug.includes(p.id.toLowerCase()) ||
    p.id.toLowerCase().includes(slug)
  );
  if (match) {
    inBoth.push({ tkSlug: slug, agrivedaId: match.id, title: tkTitles[slug] || match.nameHi });
  } else {
    inTKOnly.push({ tkSlug: slug, title: tkTitles[slug] || "" });
  }
}

console.log(`\nMatching items: ${inBoth.length}`);
console.log(`TK only items: ${inTKOnly.length}`);
console.log("\n--- SAMPLE TK ITEMS NOT IN AGRIVEDA (first 30) ---");
inTKOnly.slice(0, 30).forEach(item => {
  console.log(`  - [${item.tkSlug}] ${item.title}`);
});
