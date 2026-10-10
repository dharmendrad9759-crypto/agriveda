const fs = require("fs");
const path = require("path");

const diseasesDir = path.join(__dirname, "..", "public", "images", "diseases");
const pestsDir = path.join(__dirname, "..", "public", "images", "pests");

const diseases = fs.readdirSync(diseasesDir).filter(f => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp"));
const pests = fs.readdirSync(pestsDir).filter(f => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp"));

console.log("Total disease image files:", diseases.length);
console.log("Total pest image files:", pests.length);

const baseDiseases = [...new Set(diseases.map(f => f.replace(/-[23]\.[^.]+$/, "").replace(/\.[^.]+$/, "")))];
const basePests = [...new Set(pests.map(f => f.replace(/-[23]\.[^.]+$/, "").replace(/\.[^.]+$/, "")))];

console.log("Unique disease threat bases:", baseDiseases.length);
console.log("Unique pest threat bases:", basePests.length);

const diseasesWithMulti = baseDiseases.filter(b => diseases.includes(b + "-2.jpg") || diseases.includes(b + "-3.jpg"));
const pestsWithMulti = basePests.filter(b => pests.includes(b + "-2.jpg") || pests.includes(b + "-3.jpg"));

console.log("Diseases with multi photos:", diseasesWithMulti.length, "out of", baseDiseases.length);
console.log("Pests with multi photos:", pestsWithMulti.length, "out of", basePests.length);

console.log("\nBase diseases lacking multi photos (sample 15):", baseDiseases.filter(b => !diseasesWithMulti.includes(b)).slice(0, 15));
console.log("\nBase pests lacking multi photos (sample 15):", basePests.filter(b => !pestsWithMulti.includes(b)).slice(0, 15));
