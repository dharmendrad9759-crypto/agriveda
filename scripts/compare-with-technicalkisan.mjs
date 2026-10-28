import fs from "fs";
import path from "path";

// 1. Load technicalkisan sitemap
const sitemapPath = "C:/Users/admin/.gemini/antigravity-ide/brain/7492d21a-8f6f-46d0-8757-817967236f0c/.system_generated/steps/6078/content.md";
const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
const allUrls = Array.from(sitemapContent.matchAll(/<loc>(https:[^<]+)<\/loc>/g)).map(m => m[1]);

console.log("Total URLs in TechnicalKisan:", allUrls.length);

const tkCropProtection = allUrls.filter(u => u.includes("/crop-protection/") && !u.includes("/hi/"));
const tkTools = allUrls.filter(u => u.includes("/tools/") && !u.includes("/hi/"));
const tkSchemes = allUrls.filter(u => u.includes("/state-schemes/") && !u.includes("/hi/"));

console.log("TechnicalKisan Crop Protection items:", tkCropProtection.length);
console.log("TechnicalKisan Tools:", tkTools.length);
console.log("TechnicalKisan State Schemes:", tkSchemes.length);

// 2. Load Agriveda crop problems from data/crop-curative-problems.ts
const curativePath = "data/crop-curative-problems.ts";
const curativeContent = fs.readFileSync(curativePath, "utf8");
const cropMatches = Array.from(curativeContent.matchAll(/"slug":\s*"([^"]+)",\s*"nameHi":\s*"([^"]+)",\s*"nameEn":\s*"([^"]+)"/g));
const problemMatches = Array.from(curativeContent.matchAll(/"id":\s*"([^"]+)",\s*"nameHi":\s*"([^"]+)",\s*"nameEn":\s*"([^"]+)"/g));
console.log("Agriveda Crops in crop-curative-problems:", cropMatches.length);
console.log("Agriveda Problems in crop-curative-problems:", problemMatches.length);


// 3. Load Agriveda schemes
const schemesPath = "data/schemes/farmerSchemes.ts";
const schemesContent = fs.readFileSync(schemesPath, "utf8");
const schemeMatches = Array.from(schemesContent.matchAll(/id:\s*"([^"]+)"/g)).map(m => m[1]);
console.log("Agriveda Schemes count:", schemeMatches.length);
console.log("Agriveda Scheme IDs:", schemeMatches);


// 4. Output samples
console.log("\n--- TechnicalKisan Crop Protection Samples ---");
console.log(tkCropProtection.slice(0, 20).map(u => u.split("/").pop()));

console.log("\n--- TechnicalKisan Tools List ---");
console.log(tkTools.map(u => u.split("/").pop()));
