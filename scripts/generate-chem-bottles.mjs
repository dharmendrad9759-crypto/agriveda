import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images", "chem", "bottles");

const KIND = {
  insecticide: "INSECTICIDE",
  fungicide: "FUNGICIDE",
  herbicide: "HERBICIDE",
  pgr: "PGR",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapName(name) {
  const raw = String(name).replace(/\s+/g, " ").trim();
  if (!raw) return [];
  if (raw.includes("+")) {
    return raw
      .split("+")
      .map((part, i) => {
        const t = part.trim().toUpperCase();
        return i === 0 ? t : `+ ${t}`;
      })
      .slice(0, 3);
  }
  const words = raw.split(" ").filter(Boolean);
  if (words.length >= 2) {
    const lines = [];
    let cur = "";
    for (const w of words.map((x) => x.toUpperCase())) {
      const next = cur ? `${cur} ${w}` : w;
      if (next.length <= 10) cur = next;
      else {
        if (cur) lines.push(cur);
        cur = w;
      }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
  }
  const u = raw.toUpperCase();
  if (u.length <= 12) return [u];
  if (u.length <= 20) {
    const mid = Math.ceil(u.length / 2);
    return [u.slice(0, mid), u.slice(mid)];
  }
  const a = Math.ceil(u.length / 3);
  return [u.slice(0, a), u.slice(a, a * 2), u.slice(a * 2)];
}

function svgFor(name, formulation, category) {
  const nameLines = wrapName(name);
  const longest = Math.max(...nameLines.map((l) => l.length), 1);
  const nameSize = longest > 12 ? 11 : longest > 9 ? 13 : 15;
  const nameStart = 168 - (nameLines.length - 1) * 8;
  const formSize = String(formulation || "").length > 14 ? 8 : 10;
  const names = nameLines
    .map(
      (line, i) =>
        `<text x="120" y="${nameStart + i * 16}" text-anchor="middle" fill="#1d4f9c" font-family="Arial, Helvetica, sans-serif" font-size="${nameSize}" font-weight="800">${esc(line)}</text>`
    )
    .join("");
  const formBlock = formulation
    ? `<rect x="74" y="214" width="92" height="20" rx="10" fill="#2f9e44"/>
       <text x="120" y="228" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${formSize}" font-weight="800">${esc(formulation)}</text>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 400" width="240" height="400">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9fd4f0"/>
      <stop offset="42%" stop-color="#d7ec9a"/>
      <stop offset="100%" stop-color="#7fbf4a"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e8eef3"/>
      <stop offset="38%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#d5dde4"/>
    </linearGradient>
    <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#dfe6ec"/>
    </linearGradient>
  </defs>
  <rect width="240" height="400" fill="url(#sky)"/>
  <ellipse cx="120" cy="368" rx="96" ry="14" fill="#6b4a22" opacity="0.45"/>
  <rect x="86" y="28" width="68" height="28" rx="7" fill="url(#cap)" stroke="#c5d0d8" stroke-width="1"/>
  <rect x="90" y="32" width="60" height="2.2" rx="1" fill="#ffffff" opacity="0.7"/>
  <rect x="90" y="37" width="60" height="2.2" rx="1" fill="#b7c4cc"/>
  <rect x="90" y="42" width="60" height="2.2" rx="1" fill="#b7c4cc"/>
  <rect x="90" y="47" width="60" height="2.2" rx="1" fill="#b7c4cc"/>
  <rect x="98" y="54" width="44" height="16" rx="4" fill="#f4f7fa" stroke="#d3dbe2" stroke-width="0.8"/>
  <path d="M58 78 C58 68 74 64 92 64 H148 C166 64 182 68 182 78 V330 C182 348 160 360 120 360 C80 360 58 348 58 330 Z" fill="url(#body)" stroke="#c8d2da" stroke-width="1.2"/>
  <rect x="72" y="118" width="96" height="168" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <rect x="72" y="118" width="96" height="12" rx="6" fill="#2f9e44"/>
  <circle cx="120" cy="138" r="6" fill="#3bb54a"/>
  <circle cx="120" cy="138" r="3" fill="#ffffff"/>
  ${names}
  ${formBlock}
  <text x="120" y="${formulation ? 252 : 232}" text-anchor="middle" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="8" font-weight="800" letter-spacing="1.2">${KIND[category] || "INSECTICIDE"}</text>
  <rect x="84" y="262" width="72" height="12" rx="6" fill="#1d4f9c"/>
  <text x="120" y="271" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="6.5" font-weight="700">TECHNICAL NAME</text>
  <circle cx="120" cy="292" r="12" fill="none" stroke="#3bb54a" stroke-width="2"/>
  <path d="M114 294 l4 4 8-9" fill="none" stroke="#2f9e44" stroke-width="1.6" stroke-linecap="round"/>
</svg>
`;
}

const extras = [
  ["deltamethrin-2-8-ec", "Deltamethrin", "2.8% EC", "insecticide"],
  ["emamectin-benzoate-5-sg", "Emamectin benzoate", "5% SG", "insecticide"],
  ["fipronil-0-3-gr", "Fipronil", "0.3% GR", "insecticide"],
  ["imidacloprid-17-8-sl", "Imidacloprid", "17.8% SL", "insecticide"],
  ["thiamethoxam-25-wg", "Thiamethoxam", "25% WG", "insecticide"],
  ["acephate-75-sp", "Acephate", "75% SP", "insecticide"],
  ["cartap-4-gr", "Cartap hydrochloride", "4% GR", "insecticide"],
  ["buprofezin-25-sc", "Buprofezin", "25% SC", "insecticide"],
  ["spinosad-45-sc", "Spinosad", "45% SC", "insecticide"],
  ["lambda-cyhalothrin-5-ec", "Lambda-cyhalothrin", "5% EC", "insecticide"],
  ["carbendazim-50-wp", "Carbendazim", "50% WP", "fungicide"],
  ["tricyclazole-75-wp", "Tricyclazole", "75% WP", "fungicide"],
  ["mancozeb-75-wp", "Mancozeb", "75% WP", "fungicide"],
  ["hexaconazole-5-ec", "Hexaconazole", "5% EC", "fungicide"],
  ["azoxystrobin-250-sc", "Azoxystrobin", "250 SC", "fungicide"],
  ["pretilachlor-50-ec", "Pretilachlor", "50% EC", "herbicide"],
  ["butachlor-50-ec", "Butachlor", "50% EC", "herbicide"],
];

const src = await import("../data/modern-technicals.ts");
const items = [
  ...src.MODERN_TECHNICALS.map((t) => [t.slug, t.name, t.formulation, t.category]),
  ...extras,
];

mkdirSync(outDir, { recursive: true });
for (const [slug, name, formulation, category] of items) {
  writeFileSync(join(outDir, `${slug}.svg`), svgFor(name, formulation, category), "utf8");
}
console.log(`Wrote ${items.length} bottle images to ${outDir}`);
