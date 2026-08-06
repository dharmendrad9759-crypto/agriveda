/**
 * Convert parsed sheet grids → compact tank-mix lookup JSON.
 * Run: node scripts/build-tankmix-data.js
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../data/tank-mix");

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9+\-.%() ]/g, "")
    .trim();
}

function mapStatus(raw) {
  const s = String(raw || "").toLowerCase();
  if (s.startsWith("compatible")) return "safe";
  if (s.startsWith("conditional") || s.includes("jar test")) return "caution";
  if (s.startsWith("incompatible") || s.includes("not recommended") || s.includes("do not"))
    return "incompatible";
  if (!s) return "caution";
  return "caution";
}

function pairKey(a, b) {
  const x = norm(a);
  const y = norm(b);
  return x < y ? `${x}||${y}` : `${y}||${x}`;
}

function convertPairs(grid, category) {
  const header = grid[0] || [];
  const out = [];
  for (let i = 1; i < grid.length; i++) {
    const r = grid[i];
    if (!r || !r[0] || !r[2]) continue;
    const status = mapStatus(r[4]);
    out.push({
      category,
      a: norm(r[0]),
      aLabel: String(r[0]).trim(),
      aForm: String(r[1] || "").trim(),
      b: norm(r[2]),
      bLabel: String(r[2]).trim(),
      bForm: String(r[3] || "").trim(),
      status,
      reason: String(r[5] || "").trim(),
      notes: String(r[6] || "").trim(),
      mixOrder: String(r[7] || "").trim(),
      cropNotes: String(r[8] || "").trim(),
      confidence: String(r[10] || "").trim(),
      farmNote: String(r[11] || "").trim(),
    });
  }
  return out;
}

function convertFormulation(grid) {
  const out = [];
  for (let i = 1; i < grid.length; i++) {
    const r = grid[i];
    if (!r || !r[0] || !r[1]) continue;
    const f1 = String(r[0]).match(/\b([A-Z]{1,3})\b/);
    const f2 = String(r[1]).match(/\b([A-Z]{1,3})\b/);
    out.push({
      a: (f1 ? f1[1] : String(r[0])).toUpperCase(),
      b: (f2 ? f2[1] : String(r[1])).toUpperCase(),
      status: mapStatus(r[2]),
      reason: String(r[2] || "").trim(),
      risk: String(r[3] || "").trim(),
      mixOrder: String(r[9] || "").trim(),
      jarAdvice: String(r[8] || "").trim(),
    });
  }
  return out;
}

const sheets = {
  "sheet2.json": "insecticide+insecticide",
  "sheet3.json": "fungicide+fungicide",
  "sheet4.json": "herbicide+herbicide",
  "sheet5.json": "insecticide+fungicide",
};

let allPairs = [];
for (const [file, cat] of Object.entries(sheets)) {
  const grid = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const pairs = convertPairs(grid, cat);
  console.log(cat, pairs.length);
  allPairs = allPairs.concat(pairs);
}

const formGrid = JSON.parse(fs.readFileSync(path.join(dir, "sheet6.json"), "utf8"));
const formulations = convertFormulation(formGrid);
console.log("formulations", formulations.length);

// Unique actives for picker
const actives = new Map();
for (const p of allPairs) {
  if (!actives.has(p.a)) actives.set(p.a, { id: p.a, label: p.aLabel, forms: new Set() });
  if (!actives.has(p.b)) actives.set(p.b, { id: p.b, label: p.bLabel, forms: new Set() });
  if (p.aForm) actives.get(p.a).forms.add(p.aForm);
  if (p.bForm) actives.get(p.b).forms.add(p.bForm);
}

// Infer category from sheet presence
const catHints = {};
for (const p of allPairs) {
  const [x, y] = p.category.split("+");
  catHints[p.a] = catHints[p.a] || new Set();
  catHints[p.b] = catHints[p.b] || new Set();
  catHints[p.a].add(x);
  catHints[p.b].add(y);
}

const molecules = [...actives.values()]
  .map((m) => ({
    id: m.id,
    label: m.label,
    forms: [...m.forms],
    categories: [...(catHints[m.id] || [])],
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const byPair = {};
for (const p of allPairs) {
  byPair[pairKey(p.a, p.b)] = {
    status: p.status,
    category: p.category,
    reason: p.reason,
    notes: p.notes,
    mixOrder: p.mixOrder,
    cropNotes: p.cropNotes,
    confidence: p.confidence,
    farmNote: p.farmNote,
    aLabel: p.aLabel,
    bLabel: p.bLabel,
  };
}

const payload = {
  source: "Pesticide_TankMix_Compatibility_India.xlsx",
  generatedAt: new Date().toISOString(),
  pairCount: Object.keys(byPair).length,
  molecules,
  pairs: byPair,
  formulations,
};

fs.writeFileSync(path.join(dir, "lookup.json"), JSON.stringify(payload));
console.log("lookup pairs", payload.pairCount, "molecules", molecules.length);
console.log("wrote", path.join(dir, "lookup.json"));
