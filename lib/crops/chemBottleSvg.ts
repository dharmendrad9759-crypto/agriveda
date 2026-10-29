import {
  bottleCategory,
  bottleLabelParts,
  getChemPackageType,
  lookupChemBottle,
} from "@/lib/crops/chemBottle";
import type { ChemBottleCategory } from "@/data/chem-bottle-catalog";

const KIND_THEME: Record<
  ChemBottleCategory,
  {
    en: string;
    hi: string;
    capColor: string;
    capGrad: string;
    accent: string;
    cibrcColor: string;
    cibrcText: string;
  }
> = {
  insecticide: {
    en: "INSECTICIDE",
    hi: "कीटनाशक",
    capColor: "#15803d",
    capGrad: "#166534",
    accent: "#16a34a",
    cibrcColor: "#3b82f6", // Blue = Moderately toxic / Caution
    cibrcText: "DANGER / विष",
  },
  fungicide: {
    en: "FUNGICIDE",
    hi: "फफूंदनाशक",
    capColor: "#1d4ed8",
    capGrad: "#1e40af",
    accent: "#2563eb",
    cibrcColor: "#22c55e", // Green = Slightly toxic / Caution
    cibrcText: "CAUTION / सावधानी",
  },
  herbicide: {
    en: "HERBICIDE",
    hi: "खरपतवारनाशक",
    capColor: "#c2410c",
    capGrad: "#9a3412",
    accent: "#ea580c",
    cibrcColor: "#3b82f6", // Blue
    cibrcText: "CAUTION / सावधानी",
  },
  pgr: {
    en: "PLANT TONIC",
    hi: "वृद्धि वर्धक",
    capColor: "#7e22ce",
    capGrad: "#581c87",
    accent: "#9333ea",
    cibrcColor: "#22c55e", // Green
    cibrcText: "SAFE / सुरक्षित",
  },
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Product-shot SVG: white realistic bottle, farm landscape, technical name boldly printed on the label. */
export function renderChemBottleSvg(technical: string, category?: ChemBottleCategory): string {
  const hit = lookupChemBottle(technical);
  const kind = category ?? hit?.category ?? bottleCategory(technical);
  const theme = KIND_THEME[kind] || KIND_THEME.insecticide;

  // Use standardized technical name if matched, else parse
  const techStringToUse = hit ? `${hit.name} ${hit.formulation}` : technical;
  const { formulation, nameLines } = bottleLabelParts(techStringToUse);

  const longest = Math.max(...nameLines.map((l) => l.length), 1);
  const nameSize = longest > 14 ? 10.5 : longest > 11 ? 12 : 14;
  const nameStart = 166 - (nameLines.length - 1) * 9;
  const formSize = (formulation?.length ?? 0) > 12 ? 8.5 : 10;

  const names = nameLines
    .map(
      (line, i) =>
        `<text x="120" y="${nameStart + i * 16}" text-anchor="middle" fill="#0f2942" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${nameSize}" font-weight="900" letter-spacing="0.3">${esc(
          line
        )}</text>`
    )
    .join("");

  const formBlock = formulation
    ? `<rect x="68" y="210" width="104" height="22" rx="11" fill="${theme.accent}"/>
       <text x="120" y="225" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${formSize}" font-weight="900" letter-spacing="0.8">${esc(
         formulation
       )}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 400" width="240" height="400">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bfe3f7"/>
      <stop offset="45%" stop-color="#eaf4dc"/>
      <stop offset="100%" stop-color="#84c954"/>
    </linearGradient>
    <linearGradient id="bottleBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e2ebf0"/>
      <stop offset="25%" stop-color="#ffffff"/>
      <stop offset="75%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.capGrad}"/>
      <stop offset="40%" stop-color="${theme.capColor}"/>
      <stop offset="100%" stop-color="${theme.capGrad}"/>
    </linearGradient>
    <filter id="shadow" x="-8%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Background Farm Atmosphere -->
  <rect width="240" height="400" fill="url(#skyGrad)"/>
  
  <!-- Subtle ground shadow -->
  <ellipse cx="120" cy="370" rx="98" ry="14" fill="#4d381e" opacity="0.38"/>

  <!-- Bottle Group with Shadow -->
  <g filter="url(#shadow)">
    <!-- Colored Screw Cap -->
    <rect x="85" y="24" width="70" height="30" rx="7" fill="url(#capGrad)" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1"/>
    <!-- Cap Ridges for grip -->
    <line x1="93" y1="28" x2="93" y2="48" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="102" y1="28" x2="102" y2="48" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="111" y1="28" x2="111" y2="48" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="120" y1="28" x2="120" y2="48" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="129" y1="28" x2="129" y2="48" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="138" y1="28" x2="138" y2="48" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="147" y1="28" x2="147" y2="48" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>

    <!-- Bottle Neck -->
    <rect x="96" y="52" width="48" height="18" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
    <rect x="92" y="66" width="56" height="5" rx="2" fill="#e2e8f0"/>

    <!-- Bottle Body (3D Contour) -->
    <path d="M56 82 C56 70 72 68 92 68 H148 C168 68 184 70 184 82 V332 C184 350 162 362 120 362 C78 362 56 350 56 332 Z" fill="url(#bottleBody)" stroke="#94a3b8" stroke-width="1.2"/>

    <!-- Measurement Graduation Marks on side -->
    <line x1="60" y1="130" x2="68" y2="130" stroke="#94a3b8" stroke-width="1.2"/>
    <line x1="60" y1="160" x2="65" y2="160" stroke="#94a3b8" stroke-width="1"/>
    <line x1="60" y1="190" x2="68" y2="190" stroke="#94a3b8" stroke-width="1.2"/>
    <line x1="60" y1="220" x2="65" y2="220" stroke="#94a3b8" stroke-width="1"/>
    <line x1="60" y1="250" x2="68" y2="250" stroke="#94a3b8" stroke-width="1.2"/>
    <line x1="60" y1="280" x2="65" y2="280" stroke="#94a3b8" stroke-width="1"/>
    <text x="61" y="127" fill="#64748b" font-size="5.5" font-weight="700">1000ml</text>
    <text x="61" y="187" fill="#64748b" font-size="5.5" font-weight="700">500ml</text>
    <text x="61" y="247" fill="#64748b" font-size="5.5" font-weight="700">250ml</text>

    <!-- Main Front Label Surface -->
    <rect x="67" y="112" width="106" height="184" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    
    <!-- Top Category Header Strip -->
    <path d="M67 118 C67 114 70 112 75 112 H165 C170 112 173 114 173 118 V128 H67 Z" fill="${theme.accent}"/>
    <text x="120" y="124" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="7" font-weight="800" letter-spacing="1">${theme.en} · ${theme.hi}</text>

    <!-- Certification / Stamp -->
    <rect x="76" y="134" width="88" height="11" rx="5.5" fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.8"/>
    <text x="120" y="142" text-anchor="middle" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="6" font-weight="700" letter-spacing="0.5">TECHNICAL GRADE / CIB&amp;RC</text>

    <!-- Technical Name Block (Central & Bold) -->
    ${names}

    <!-- Formulation Pill Block -->
    ${formBlock}

    <!-- CIBRC Official Toxicity Diamond at bottom of label -->
    <g transform="translate(120, 266)">
      <!-- Outer Diamond -->
      <polygon points="0,-16 16,0 0,16 -16,0" fill="#ffffff" stroke="#334155" stroke-width="1.2"/>
      <!-- Lower Triangle (Toxicity Class Color: Green/Blue/Yellow) -->
      <polygon points="-16,0 16,0 0,16" fill="${theme.cibrcColor}"/>
      <!-- Upper Triangle Text / Skull -->
      <text x="0" y="-4" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="4.5" font-weight="900">CAUTION</text>
      <!-- Lower Triangle Text -->
      <text x="0" y="9" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="4" font-weight="800">सावधान</text>
    </g>

    <!-- Bottom Govt Approved Text -->
    <text x="120" y="291" text-anchor="middle" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="5.5" font-weight="700">100% GENUINE TECHNICAL</text>
  </g>
</svg>`;
}

/** Product-shot SVG: realistic metallic sealed agro foil pouch / sachet packet for powders and granules (WP, WG, WDG, SG, SP). */
export function renderChemPouchSvg(technical: string, category?: ChemBottleCategory): string {
  const hit = lookupChemBottle(technical);
  const kind = category ?? hit?.category ?? bottleCategory(technical);
  const theme = KIND_THEME[kind] || KIND_THEME.fungicide;

  const techStringToUse = hit ? `${hit.name} ${hit.formulation}` : technical;
  const { formulation, nameLines } = bottleLabelParts(techStringToUse);

  const longest = Math.max(...nameLines.map((l) => l.length), 1);
  const nameSize = longest > 14 ? 10 : longest > 11 ? 11.5 : 13;
  const nameStart = 185 - (nameLines.length - 1) * 8.5;
  const formSize = (formulation?.length ?? 0) > 12 ? 8 : 9.5;

  const names = nameLines
    .map(
      (line, i) =>
        `<text x="120" y="${nameStart + i * 16}" text-anchor="middle" fill="#0f2942" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${nameSize}" font-weight="900" letter-spacing="0.3">${esc(
          line
        )}</text>`
    )
    .join("");

  const formBlock = formulation
    ? `<rect x="68" y="226" width="104" height="20" rx="10" fill="${theme.accent}"/>
       <text x="120" y="239" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${formSize}" font-weight="900" letter-spacing="0.8">${esc(
         formulation
       )}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 400" width="240" height="400">
  <defs>
    <linearGradient id="pouchSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bfe3f7"/>
      <stop offset="45%" stop-color="#eaf4dc"/>
      <stop offset="100%" stop-color="#84c954"/>
    </linearGradient>
    <linearGradient id="pouchFoil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b0bec5"/>
      <stop offset="15%" stop-color="#f8fafc"/>
      <stop offset="30%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#90a4ae"/>
    </linearGradient>
    <linearGradient id="crimpGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#78909c"/>
      <stop offset="25%" stop-color="#e2e8f0"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="75%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#78909c"/>
    </linearGradient>
    <filter id="pouchShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background Farm Atmosphere -->
  <rect width="240" height="400" fill="url(#pouchSky)"/>
  
  <!-- Ground Shadow -->
  <ellipse cx="120" cy="372" rx="90" ry="14" fill="#4d381e" opacity="0.4"/>

  <!-- Pouch Body Group with Drop Shadow -->
  <g filter="url(#pouchShadow)">
    <!-- Stand-Up Pouch Body Outline -->
    <path d="M52 48 H188 C192 48 195 52 194 56 L184 350 C183 358 174 364 160 364 H80 C66 364 57 358 56 350 L46 56 C45 52 48 48 52 48 Z" fill="url(#pouchFoil)" stroke="#78909c" stroke-width="1.2"/>

    <!-- Metallic Specular Light Ribbon -->
    <path d="M78 50 L84 358 H98 L92 50 Z" fill="#ffffff" opacity="0.5"/>

    <!-- Top Heat-Seal Crimp Band -->
    <rect x="51" y="48" width="138" height="38" rx="2" fill="url(#crimpGrad)" stroke="#78909c" stroke-width="0.8"/>
    
    <!-- Top Crimp Ribs (Heat Sealing ridges) -->
    <g stroke="#64748b" stroke-width="1.2" opacity="0.55">
      <line x1="58" y1="50" x2="58" y2="84"/><line x1="64" y1="50" x2="64" y2="84"/><line x1="70" y1="50" x2="70" y2="84"/>
      <line x1="76" y1="50" x2="76" y2="84"/><line x1="82" y1="50" x2="82" y2="84"/><line x1="88" y1="50" x2="88" y2="84"/>
      <line x1="94" y1="50" x2="94" y2="84"/><line x1="100" y1="50" x2="100" y2="84"/><line x1="106" y1="50" x2="106" y2="84"/>
      <line x1="112" y1="50" x2="112" y2="84"/><line x1="118" y1="50" x2="118" y2="84"/><line x1="124" y1="50" x2="124" y2="84"/>
      <line x1="130" y1="50" x2="130" y2="84"/><line x1="136" y1="50" x2="136" y2="84"/><line x1="142" y1="50" x2="142" y2="84"/>
      <line x1="148" y1="50" x2="148" y2="84"/><line x1="154" y1="50" x2="154" y2="84"/><line x1="160" y1="50" x2="160" y2="84"/>
      <line x1="166" y1="50" x2="166" y2="84"/><line x1="172" y1="50" x2="172" y2="84"/><line x1="178" y1="50" x2="178" y2="84"/>
    </g>

    <!-- Euro Slot Punch Hole at Top Center -->
    <path d="M106 60 H134 C136 60 137 62 137 64 C137 68 132 70 120 70 C108 70 103 68 103 64 C103 62 104 60 106 60 Z" fill="#94a3b8" stroke="#64748b" stroke-width="0.8"/>

    <!-- Left & Right Tear Notches (V-Cut) -->
    <polygon points="49,76 56,79 49,82" fill="#78909c"/>
    <polygon points="191,76 184,79 191,82" fill="#78909c"/>

    <!-- Main Front Printed Artwork Panel -->
    <rect x="56" y="98" width="128" height="236" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Top Category Banner -->
    <rect x="56" y="98" width="128" height="26" rx="6" fill="${theme.accent}"/>
    <rect x="56" y="114" width="128" height="10" fill="${theme.accent}"/>
    <text x="120" y="115" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="900" letter-spacing="1">${theme.en} · ${theme.hi}</text>

    <!-- Sealed Foil Sachet Badge -->
    <rect x="66" y="132" width="108" height="12" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.8"/>
    <text x="120" y="141" text-anchor="middle" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="6.5" font-weight="800" letter-spacing="0.5">SEALED AGRO PACKET · CIB&amp;RC</text>

    <!-- Technical Name Block -->
    ${names}

    <!-- Formulation Pill Block -->
    ${formBlock}

    <!-- CIBRC Toxicity Diamond -->
    <g transform="translate(120, 276)">
      <polygon points="0,-15 15,0 0,15 -15,0" fill="#ffffff" stroke="#334155" stroke-width="1.2"/>
      <polygon points="-15,0 15,0 0,15" fill="${theme.cibrcColor}"/>
      <text x="0" y="-3" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="4.2" font-weight="900">CAUTION</text>
      <text x="0" y="9" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="4" font-weight="800">सावधान</text>
    </g>

    <!-- Net Content Badge -->
    <rect x="76" y="302" width="88" height="16" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.8"/>
    <text x="120" y="313" text-anchor="middle" fill="#334155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="6.5" font-weight="800">Net Wt: 250g / 500g (पैकेट)</text>

    <!-- Bottom Heat Seal Band -->
    <rect x="57" y="342" width="126" height="20" rx="2" fill="url(#crimpGrad)" stroke="#78909c" stroke-width="0.8"/>
    <g stroke="#64748b" stroke-width="1.2" opacity="0.55">
      <line x1="62" y1="344" x2="62" y2="360"/><line x1="68" y1="344" x2="68" y2="360"/><line x1="74" y1="344" x2="74" y2="360"/>
      <line x1="80" y1="344" x2="80" y2="360"/><line x1="86" y1="344" x2="86" y2="360"/><line x1="92" y1="344" x2="92" y2="360"/>
      <line x1="98" y1="344" x2="98" y2="360"/><line x1="104" y1="344" x2="104" y2="360"/><line x1="110" y1="344" x2="110" y2="360"/>
      <line x1="116" y1="344" x2="116" y2="360"/><line x1="122" y1="344" x2="122" y2="360"/><line x1="128" y1="344" x2="128" y2="360"/>
      <line x1="134" y1="344" x2="134" y2="360"/><line x1="140" y1="344" x2="140" y2="360"/><line x1="146" y1="344" x2="146" y2="360"/>
      <line x1="152" y1="344" x2="152" y2="360"/><line x1="158" y1="344" x2="158" y2="360"/><line x1="164" y1="344" x2="164" y2="360"/>
      <line x1="170" y1="344" x2="170" y2="360"/><line x1="176" y1="344" x2="176" y2="360"/>
    </g>
  </g>
</svg>`;
}

export const REAL_BOTTLE_PHOTOS: Record<string, string> = {
  "1-methylcyclopropene": "/images/chem/real/1-methylcyclopropene-1-mcp.jpg",
  "1-methylcyclopropene-1-mcp": "/images/chem/real/1-methylcyclopropene-1-mcp.jpg",
  "2-4-d": "/images/chem/real/2-4-d-amine-58-sl.jpg",
  "2-4-d-amine": "/images/chem/real/2-4-d-amine-58-sl.jpg",
  "2-4-d-amine-58-sl": "/images/chem/real/2-4-d-amine-58-sl.jpg",
  "abamectin-1-9-ec": "/images/chem/real/abamectin-1-9-ec.jpg",
  "acephate-75-sp": "/images/chem/real/acephate-75-sp.jpg",
  "acetamiprid-20-sp": "/images/chem/real/acetamiprid-20-sp.jpg",
  "acuron": "/images/chem/real/bicyclopyrone-ec.jpg",
  "acynonapyr": "/images/chem/real/acynonapyr-20-sc.jpg",
  "acynonapyr-20-sc": "/images/chem/real/acynonapyr-20-sc.jpg",
  "afidopyropen": "/images/chem/real/afidopyropen-50-dc.jpg",
  "afidopyropen-50-dc": "/images/chem/real/afidopyropen-50-dc.jpg",
  "alachlor": "/images/chem/real/alachlor-50-ec.jpg",
  "alachlor-50-ec": "/images/chem/real/alachlor-50-ec.jpg",
  "alika": "/images/chem/real/thiamethoxam-lambda-zc.jpg",
  "alion": "/images/chem/real/indaziflam-500-sc.jpg",
  "ametoctradin": "/images/chem/real/ametoctradin-dimethomorph-sc.jpg",
  "ametoctradin-dimethomorph": "/images/chem/real/ametoctradin-dimethomorph-sc.jpg",
  "ametoctradin-dimethomorph-27-20-27-sc": "/images/chem/real/ametoctradin-dimethomorph-sc.jpg",
  "ametoctradin-dimethomorph-sc": "/images/chem/real/ametoctradin-dimethomorph-sc.jpg",
  "amisulbrom": "/images/chem/real/amisulbrom-17-7-sc.jpg",
  "amisulbrom-17-7-sc": "/images/chem/real/amisulbrom-17-7-sc.jpg",
  "ampligo": "/images/chem/real/chlorantraniliprole-lambda-zc.jpg",
  "ampligo-150-zc": "/images/chem/real/chlorantraniliprole-lambda-zc.jpg",
  "anilofos": "/images/chem/real/anilofos-30-ec.jpg",
  "anilofos-30-ec": "/images/chem/real/anilofos-30-ec.jpg",
  "arylex": "/images/chem/real/halauxifen-methyl-ec.jpg",
  "atrazine-50-wp": "/images/chem/real/atrazine-50-wp.jpg",
  "azadirachtin": "/images/chem/real/neem-oil-10000-ppm.jpg",
  "azoxystrobin-11-tebuconazole-18-3-sc": "/images/chem/real/azoxystrobin-11-tebuconazole-18-3-sc.jpg",
  "azoxystrobin-23-sc": "/images/chem/real/azoxystrobin-23-sc.jpg",
  "azoxystrobin-250-sc": "/images/chem/real/azoxystrobin-250-sc.jpg",
  "azoxystrobin-difenoconazole": "/images/chem/real/azoxystrobin-difenoconazole.jpg",
  "azoxystrobin-difenoconazole-sc": "/images/chem/real/azoxystrobin-difenoconazole-sc.jpg",
  "azoxystrobin-tebuconazole": "/images/chem/real/azoxystrobin-11-tebuconazole-18-3-sc.jpg",
  "bacillus-thuringiensis": "/images/chem/real/bacillus-thuringiensis-wp.jpg",
  "bacillus-thuringiensis-wp": "/images/chem/real/bacillus-thuringiensis-wp.jpg",
  "banana-spray-oil": "/images/chem/real/mineral-oil.jpg",
  "baroque": "/images/chem/real/etoxazole-10-sc.jpg",
  "belt": "/images/chem/real/flubendiamide-20-wg.jpg",
  "belt-480-sc": "/images/chem/real/flubendiamide-20-wg.jpg",
  "benomyl": "/images/chem/real/benomyl-50-wp.jpg",
  "benomyl-50-wp": "/images/chem/real/benomyl-50-wp.jpg",
  "benzovindiflupyr": "/images/chem/real/benzovindiflupyr-100-ec.jpg",
  "benzovindiflupyr-100-ec": "/images/chem/real/benzovindiflupyr-100-ec.jpg",
  "benzpyrimoxan": "/images/chem/real/benzpyrimoxan-10-sc.jpg",
  "benzpyrimoxan-10-sc": "/images/chem/real/benzpyrimoxan-10-sc.jpg",
  "beta-cyfluthrin": "/images/chem/real/beta-cyfluthrin-8-49-sc.jpg",
  "beta-cyfluthrin-8-49": "/images/chem/real/beta-cyfluthrin-8-49-sc.jpg",
  "beta-cyfluthrin-8-49-sc": "/images/chem/real/beta-cyfluthrin-8-49-sc.jpg",
  "bicyclopyrone": "/images/chem/real/bicyclopyrone-ec.jpg",
  "bicyclopyrone-ec": "/images/chem/real/bicyclopyrone-ec.jpg",
  "bifenthrin": "/images/chem/real/bifenthrin-10-ec.jpg",
  "bifenthrin-10-ec": "/images/chem/real/bifenthrin-10-ec.jpg",
  "bismerthiazol": "/images/chem/real/bismerthiazol-20-wp.jpg",
  "bismerthiazol-20-wp": "/images/chem/real/bismerthiazol-20-wp.jpg",
  "bispyribac-sodium-10-sc": "/images/chem/real/bispyribac-sodium-10-sc.jpg",
  "bleaching-powder": "/images/chem/real/bleaching-powder.jpg",
  "borax": "/images/chem/real/boron-20.jpg",
  "bordeaux-mixture": "/images/chem/real/bordeaux-mixture.jpg",
  "boron": "/images/chem/real/boron-20.jpg",
  "boron-20": "/images/chem/real/boron-20.jpg",
  "bran-cutworm-bait": "/images/chem/real/bran-cutworm-bait.jpg",
  "broflanilide": "/images/chem/real/broflanilide-20-sc.jpg",
  "broflanilide-20-sc": "/images/chem/real/broflanilide-20-sc.jpg",
  "broflanilide-300-sc": "/images/chem/real/broflanilide-300-sc.jpg",
  "buprofezin-25-sc": "/images/chem/real/buprofezin-25-sc.jpg",
  "butachlor": "/images/chem/real/butachlor-50-ec.jpg",
  "butachlor-50-ec": "/images/chem/real/butachlor-50-ec.jpg",
  "cabrio-top": "/images/chem/real/metiram-55-pyraclostrobin-5-wg.jpg",
  "calcium-boron": "/images/chem/real/calcium-boron.jpg",
  "calcium-nitrate": "/images/chem/real/calcium-boron.jpg",
  "captan": "/images/chem/real/captan-50-wp.jpg",
  "captan-50-wp": "/images/chem/real/captan-50-wp.jpg",
  "captan-hexaconazole": "/images/chem/real/captan-hexaconazole-wp.jpg",
  "captan-hexaconazole-wp": "/images/chem/real/captan-hexaconazole-wp.jpg",
  "carbaryl": "/images/chem/real/carbaryl-50-wp.jpg",
  "carbaryl-50-wp": "/images/chem/real/carbaryl-50-wp.jpg",
  "carbendazim-12-mancozeb-63-wp": "/images/chem/real/carbendazim-mancozeb-wp.jpg",
  "carbendazim-50-wp": "/images/chem/real/carbendazim-50-wp.jpg",
  "carbendazim-mancozeb-wp": "/images/chem/real/carbendazim-mancozeb-wp.jpg",
  "carbofuran-3-cg": "/images/chem/real/carbofuran-3-cg.jpg",
  "carbofuran-3-g": "/images/chem/real/carbofuran-3-cg.jpg",
  "carboxin-37-5-thiram-37-5-ds": "/images/chem/real/carboxin-thiram-ds.jpg",
  "carboxin-thiram-ds": "/images/chem/real/carboxin-thiram-ds.jpg",
  "cartap-4-gr": "/images/chem/real/cartap-4-gr.jpg",
  "cartap-50-sp": "/images/chem/real/cartap-50-sp.jpg",
  "cartap-hydrochloride-50-sp": "/images/chem/real/cartap-50-sp.jpg",
  "chelated-calcium": "/images/chem/real/calcium-boron.jpg",
  "chelated-zinc": "/images/chem/real/chelated-zinc-12.jpg",
  "chelated-zinc-12": "/images/chem/real/chelated-zinc-12.jpg",
  "chess": "/images/chem/real/pymetrozine-50-wg.jpg",
  "chlorantraniliprole-0-4-gr": "/images/chem/real/chlorantraniliprole-0-4-gr.jpg",
  "chlorantraniliprole-18-5-sc": "/images/chem/real/chlorantraniliprole-18-5-sc.jpg",
  "chlorfenapyr": "/images/chem/real/chlorfenapyr-10-sc.jpg",
  "chlorfenapyr-10-sc": "/images/chem/real/chlorfenapyr-10-sc.jpg",
  "chlorimuron": "/images/chem/real/chlorimuron-ethyl-25-wp.jpg",
  "chlorimuron-ethyl": "/images/chem/real/chlorimuron-ethyl-25-wp.jpg",
  "chlorimuron-ethyl-25-wp": "/images/chem/real/chlorimuron-ethyl-25-wp.jpg",
  "chlormequat-chloride": "/images/chem/real/chlormequat-chloride-50-sl.jpg",
  "chlormequat-chloride-50-sl": "/images/chem/real/chlormequat-chloride-50-sl.jpg",
  "chlorothalonil-75-wp": "/images/chem/real/chlorothalonil-75-wp.jpg",
  "chlorpyrifos-1-5-dp": "/images/chem/real/chlorpyrifos-1-5-dp.jpg",
  "chlorpyrifos-20-ec": "/images/chem/real/chlorpyrifos-20-ec.jpg",
  "chlorpyrifos-50-cypermethrin-5": "/images/chem/real/chlorpyrifos-50-cypermethrin-5-ec.jpg",
  "chlorpyrifos-50-cypermethrin-5-ec": "/images/chem/real/chlorpyrifos-50-cypermethrin-5-ec.jpg",
  "chlorpyrifos-dp": "/images/chem/real/chlorpyrifos-1-5-dp.jpg",
  "chlorpyriphos-1-5-dp": "/images/chem/real/chlorpyrifos-1-5-dp.jpg",
  "chlorpyriphos-20-ec": "/images/chem/real/chlorpyrifos-20-ec.jpg",
  "cimegra": "/images/chem/real/broflanilide-20-sc.jpg",
  "cinmethylin": "/images/chem/real/cinmethylin-ec.jpg",
  "cinmethylin-ec": "/images/chem/real/cinmethylin-ec.jpg",
  "clodinafop": "/images/chem/real/clodinafop-15-wp.jpg",
  "clodinafop-15-wp": "/images/chem/real/clodinafop-15-wp.jpg",
  "clodinafop-propargyl-15-wp": "/images/chem/real/clodinafop-15-wp.jpg",
  "clothianidin": "/images/chem/real/clothianidin-50-wdg.jpg",
  "clothianidin-50-wdg": "/images/chem/real/clothianidin-50-wdg.jpg",
  "colt": "/images/chem/real/pyrifluquinazon-20-sc.jpg",
  "copper-hydroxide-53-8-df": "/images/chem/real/copper-hydroxide-53-8-df.jpg",
  "copper-oxychloride-50-wp": "/images/chem/real/copper-oxychloride-50-wp.jpg",
  "council-activ": "/images/chem/real/triafamone-ethoxysulfuron-wg.jpg",
  "cppu": "/images/chem/real/forchlorfenuron-01-l.jpg",
  "cue-lure-trap": "/images/chem/real/pheromone-trap.jpg",
  "cyantraniliprole-10-od": "/images/chem/real/cyantraniliprole-10-od.jpg",
  "cyazofamid": "/images/chem/real/cyazofamid-34-5-sc.jpg",
  "cyazofamid-34-5-sc": "/images/chem/real/cyazofamid-34-5-sc.jpg",
  "cyflufenamid": "/images/chem/real/cyflufenamid-5-ew.jpg",
  "cyflufenamid-5-ew": "/images/chem/real/cyflufenamid-5-ew.jpg",
  "cyflumetofen": "/images/chem/real/cyflumetofen-20-sc.jpg",
  "cyflumetofen-20-sc": "/images/chem/real/cyflumetofen-20-sc.jpg",
  "cyhalodiamide": "/images/chem/real/cyhalodiamide-10-sc.jpg",
  "cyhalodiamide-10-sc": "/images/chem/real/cyhalodiamide-10-sc.jpg",
  "cyhalofop-butyl": "/images/chem/real/cyhalofop-butyl-10-ec.jpg",
  "cyhalofop-butyl-10-ec": "/images/chem/real/cyhalofop-butyl-10-ec.jpg",
  "cymbush": "/images/chem/real/cypermethrin-10-ec.jpg",
  "cymbush-10-ec": "/images/chem/real/cypermethrin-10-ec.jpg",
  "cymoxanil-8-mancozeb-64-wp": "/images/chem/real/cymoxanil-mancozeb-wp.jpg",
  "cymoxanil-mancozeb-wp": "/images/chem/real/cymoxanil-mancozeb-wp.jpg",
  "cypermethrin": "/images/chem/real/cypermethrin-10-ec.jpg",
  "cypermethrin-10-ec": "/images/chem/real/cypermethrin-10-ec.jpg",
  "cypermethrin-25-ec": "/images/chem/real/cypermethrin-25-ec.jpg",
  "cypyrafluone": "/images/chem/real/cypyrafluone-sc.jpg",
  "cypyrafluone-sc": "/images/chem/real/cypyrafluone-sc.jpg",
  "danitol": "/images/chem/real/fenpropathrin-10-ec.jpg",
  "deltamethrin-2-8-ec": "/images/chem/real/deltamethrin-2-8-ec.jpg",
  "diafenthiuron-50-wp": "/images/chem/real/diafenthiuron-50-wp.jpg",
  "dichlorvos": "/images/chem/real/dichlorvos-76-ec.jpg",
  "dichlorvos-76-ec": "/images/chem/real/dichlorvos-76-ec.jpg",
  "dicloromezotiaz": "/images/chem/real/dicloromezotiaz-10-sc.jpg",
  "dicloromezotiaz-10-sc": "/images/chem/real/dicloromezotiaz-10-sc.jpg",
  "diclosulam": "/images/chem/real/diclosulam-84-wdg.jpg",
  "diclosulam-84-wdg": "/images/chem/real/diclosulam-84-wdg.jpg",
  "difenoconazole-25-ec": "/images/chem/real/difenoconazole-25-ec.jpg",
  "dimethoate-30-ec": "/images/chem/real/dimethoate-30-ec.jpg",
  "dimethomorph-50-wp": "/images/chem/real/dimethomorph-50-wp.jpg",
  "dinocap": "/images/chem/real/dinocap-48-ec.jpg",
  "dinocap-48-ec": "/images/chem/real/dinocap-48-ec.jpg",
  "dinotefuran-20-sg": "/images/chem/real/dinotefuran-20-sg.jpg",
  "diuron": "/images/chem/real/diuron-80-wp.jpg",
  "diuron-80-wp": "/images/chem/real/diuron-80-wp.jpg",
  "domark": "/images/chem/real/tetraconazole-3-8-ew.jpg",
  "dropp": "/images/chem/real/thidiazuron-50-wp.jpg",
  "edifenphos-50-ec": "/images/chem/real/edifenphos-50-ec.jpg",
  "ekalux": "/images/chem/real/quinalphos-25-ec.jpg",
  "elatus-plus": "/images/chem/real/benzovindiflupyr-100-ec.jpg",
  "elatus-plus-100-ec": "/images/chem/real/benzovindiflupyr-100-ec.jpg",
  "elevore": "/images/chem/real/halauxifen-methyl-ec.jpg",
  "emamectin-benzoate-5-sg": "/images/chem/real/emamectin-benzoate-5-sg.jpg",
  "epyrifenacil": "/images/chem/real/epyrifenacil-ec.jpg",
  "epyrifenacil-ec": "/images/chem/real/epyrifenacil-ec.jpg",
  "ethalfluralin": "/images/chem/real/ethalfluralin-35-4-ec.jpg",
  "ethalfluralin-35-4-ec": "/images/chem/real/ethalfluralin-35-4-ec.jpg",
  "ethoxysulfuron": "/images/chem/real/ethoxysulfuron-15-wdg.jpg",
  "ethoxysulfuron-15-wdg": "/images/chem/real/ethoxysulfuron-15-wdg.jpg",
  "etofenprox": "/images/chem/real/etofenprox-10-ew.jpg",
  "etofenprox-10-ew": "/images/chem/real/etofenprox-10-ew.jpg",
  "etoxazole": "/images/chem/real/etoxazole-10-sc.jpg",
  "etoxazole-10-sc": "/images/chem/real/etoxazole-10-sc.jpg",
  "evito": "/images/chem/real/fluoxastrobin-480-sc.jpg",
  "famoxadone-cymoxanil-sc": "/images/chem/real/famoxadone-cymoxanil-sc.jpg",
  "fenamidone": "/images/chem/real/fenamidone-10-sc.jpg",
  "fenamidone-10": "/images/chem/real/fenamidone-10-sc.jpg",
  "fenamidone-10-sc": "/images/chem/real/fenamidone-10-sc.jpg",
  "fenazaquin": "/images/chem/real/fenazaquin-10-ec.jpg",
  "fenazaquin-10-ec": "/images/chem/real/fenazaquin-10-ec.jpg",
  "fenpropathrin": "/images/chem/real/fenpropathrin-10-ec.jpg",
  "fenpropathrin-10-ec": "/images/chem/real/fenpropathrin-10-ec.jpg",
  "fenpyroximate": "/images/chem/real/fenpyroximate-5-ec.jpg",
  "fenpyroximate-5-ec": "/images/chem/real/fenpyroximate-5-ec.jpg",
  "fenquinotrione": "/images/chem/real/fenquinotrione-sc.jpg",
  "fenquinotrione-sc": "/images/chem/real/fenquinotrione-sc.jpg",
  "fipronil-0-3": "/images/chem/real/fipronil-0-3-gr.jpg",
  "fipronil-0-3-g": "/images/chem/real/fipronil-0-3-gr.jpg",
  "fipronil-0-3-gr": "/images/chem/real/fipronil-0-3-gr.jpg",
  "fipronil-0-6": "/images/chem/real/fipronil-0-6-gr.jpg",
  "fipronil-0-6-g": "/images/chem/real/fipronil-0-6-gr.jpg",
  "fipronil-0-6-gr": "/images/chem/real/fipronil-0-6-gr.jpg",
  "fipronil-40-imidacloprid-40": "/images/chem/real/fipronil-40-imidacloprid-40-wg.jpg",
  "fipronil-40-imidacloprid-40-wg": "/images/chem/real/fipronil-40-imidacloprid-40-wg.jpg",
  "fipronil-5-sc": "/images/chem/real/fipronil-5-sc.jpg",
  "flint": "/images/chem/real/trifloxystrobin-25-wg.jpg",
  "flonicamid-50-wg": "/images/chem/real/flonicamid-50-wg.jpg",
  "florpyrauxifen-benzyl": "/images/chem/real/florpyrauxifen-benzyl-2-7-ec.jpg",
  "florpyrauxifen-benzyl-2-7-ec": "/images/chem/real/florpyrauxifen-benzyl-2-7-ec.jpg",
  "fluazaindolizine": "/images/chem/real/fluazaindolizine-500-sc.jpg",
  "fluazaindolizine-500-sc": "/images/chem/real/fluazaindolizine-500-sc.jpg",
  "fluazinam": "/images/chem/real/fluazinam-39-5-sc.jpg",
  "fluazinam-39-5-sc": "/images/chem/real/fluazinam-39-5-sc.jpg",
  "flubendiamide-20-wg": "/images/chem/real/flubendiamide-20-wg.jpg",
  "flubendiamide-39-sc": "/images/chem/real/flubendiamide-39-sc.jpg",
  "fluchloralin": "/images/chem/real/fluchloralin-45-ec.jpg",
  "fluchloralin-45-ec": "/images/chem/real/fluchloralin-45-ec.jpg",
  "fluensulfone": "/images/chem/real/fluensulfone-480-ec.jpg",
  "fluensulfone-480-ec": "/images/chem/real/fluensulfone-480-ec.jpg",
  "fluindapyr": "/images/chem/real/isopyrazam-12-sc.jpg",
  "flumioxazin": "/images/chem/real/flumioxazin-50-sc.jpg",
  "flumioxazin-50-sc": "/images/chem/real/flumioxazin-50-sc.jpg",
  "fluopicolide-propamocarb": "/images/chem/real/fluopicolide-propamocarb-sc.jpg",
  "fluopicolide-propamocarb-sc": "/images/chem/real/fluopicolide-propamocarb-sc.jpg",
  "fluopyram": "/images/chem/real/fluopyram-34-48-sc.jpg",
  "fluopyram-34-48-sc": "/images/chem/real/fluopyram-34-48-sc.jpg",
  "fluopyram-34-sc": "/images/chem/real/fluopyram-34-48-sc.jpg",
  "fluoxapiprolin": "/images/chem/real/fluoxapiprolin-10-sc.jpg",
  "fluoxapiprolin-10-sc": "/images/chem/real/fluoxapiprolin-10-sc.jpg",
  "fluoxastrobin": "/images/chem/real/fluoxastrobin-480-sc.jpg",
  "fluoxastrobin-480-sc": "/images/chem/real/fluoxastrobin-480-sc.jpg",
  "flupyradifurone": "/images/chem/real/flupyradifurone-17-09-sl.jpg",
  "flupyradifurone-17-09-sl": "/images/chem/real/flupyradifurone-17-09-sl.jpg",
  "flupyradifurone-17-sl": "/images/chem/real/flupyradifurone-17-09-sl.jpg",
  "flupyrimin": "/images/chem/real/flupyrimin-10-sc.jpg",
  "flupyrimin-10-sc": "/images/chem/real/flupyrimin-10-sc.jpg",
  "fluxametamide": "/images/chem/real/fluxametamide-10-ec.jpg",
  "fluxametamide-10-ec": "/images/chem/real/fluxametamide-10-ec.jpg",
  "fluxapyroxad": "/images/chem/real/fluxapyroxad-250-sc.jpg",
  "fluxapyroxad-167": "/images/chem/real/fluxapyroxad-pyraclostrobin-sc.jpg",
  "fluxapyroxad-250": "/images/chem/real/fluxapyroxad-250-sc.jpg",
  "fluxapyroxad-250-sc": "/images/chem/real/fluxapyroxad-250-sc.jpg",
  "fluxapyroxad-pyraclostrobin": "/images/chem/real/fluxapyroxad-pyraclostrobin-sc.jpg",
  "fluxapyroxad-pyraclostrobin-sc": "/images/chem/real/fluxapyroxad-pyraclostrobin-sc.jpg",
  "fontelis": "/images/chem/real/penthiopyrad-20-sc.jpg",
  "forchlorfenuron": "/images/chem/real/forchlorfenuron-01-l.jpg",
  "forchlorfenuron-01-l": "/images/chem/real/forchlorfenuron-01-l.jpg",
  "fosetyl": "/images/chem/real/fosetyl-al-80-wp.jpg",
  "fosetyl-al": "/images/chem/real/fosetyl-al-80-wp.jpg",
  "fosetyl-al-80-wp": "/images/chem/real/fosetyl-al-80-wp.jpg",
  "galileo": "/images/chem/real/picoxystrobin-22-5-sc.jpg",
  "galileo-way": "/images/chem/real/picoxystrobin-propiconazole-sc.jpg",
  "gallant": "/images/chem/real/haloxyfop-r-methyl-10-5-ec.jpg",
  "glyphosate-41-sl": "/images/chem/real/glyphosate-41-sl.jpg",
  "gracia": "/images/chem/real/fluxametamide-10-ec.jpg",
  "halauxifen-methyl": "/images/chem/real/halauxifen-methyl-ec.jpg",
  "halauxifen-methyl-ec": "/images/chem/real/halauxifen-methyl-ec.jpg",
  "halosulfuron": "/images/chem/real/halosulfuron-75-wg.jpg",
  "halosulfuron-75-wg": "/images/chem/real/halosulfuron-75-wg.jpg",
  "halosulfuron-methyl-75-wg": "/images/chem/real/halosulfuron-75-wg.jpg",
  "haloxyfop-r-methyl": "/images/chem/real/haloxyfop-r-methyl-10-5-ec.jpg",
  "haloxyfop-r-methyl-10-5-ec": "/images/chem/real/haloxyfop-r-methyl-10-5-ec.jpg",
  "hexaconazole-5-ec": "/images/chem/real/hexaconazole-5-ec.jpg",
  "hexythiazox": "/images/chem/real/hexythiazox-5-45-ec.jpg",
  "hexythiazox-5-45-ec": "/images/chem/real/hexythiazox-5-45-ec.jpg",
  "homobrassinolide": "/images/chem/real/homobrassinolide-0-04.jpg",
  "homobrassinolide-0-04": "/images/chem/real/homobrassinolide-0-04.jpg",
  "humic-acid": "/images/chem/real/humic-acid-12.jpg",
  "humic-acid-12": "/images/chem/real/humic-acid-12.jpg",
  "imazethapyr": "/images/chem/real/imazethapyr-10-sl.jpg",
  "imazethapyr-10-sl": "/images/chem/real/imazethapyr-10-sl.jpg",
  "imidacloprid-17-8-sl": "/images/chem/real/imidacloprid-17-8-sl.jpg",
  "imidacloprid-17-8-sl-lambda-cyhalothrin-5-ec": "/images/chem/real/imidacloprid-lambda-combo.jpg",
  "imidacloprid-70-ws": "/images/chem/real/imidacloprid-70-ws.jpg",
  "imidacloprid-lambda-combo": "/images/chem/real/imidacloprid-lambda-combo.jpg",
  "incipio": "/images/chem/real/isocycloseram-10-dc.jpg",
  "indaziflam": "/images/chem/real/indaziflam-500-sc.jpg",
  "indaziflam-500-sc": "/images/chem/real/indaziflam-500-sc.jpg",
  "indiflin": "/images/chem/real/inpyrfluxam-30-sc.jpg",
  "indofil-m-45": "/images/chem/real/mancozeb-75-wp.jpg",
  "indoxacarb-14-5-sc": "/images/chem/real/indoxacarb-14-5-sc.jpg",
  "inpyrfluxam": "/images/chem/real/inpyrfluxam-30-sc.jpg",
  "inpyrfluxam-30-sc": "/images/chem/real/inpyrfluxam-30-sc.jpg",
  "intrepid": "/images/chem/real/chlorfenapyr-10-sc.jpg",
  "intrepid-10-sc": "/images/chem/real/chlorfenapyr-10-sc.jpg",
  "ipflufenoquin": "/images/chem/real/ipflufenoquin-20-sc.jpg",
  "ipflufenoquin-20-sc": "/images/chem/real/ipflufenoquin-20-sc.jpg",
  "iprodione-50-wp": "/images/chem/real/iprodione-50-wp.jpg",
  "isoclast": "/images/chem/real/sulfoxaflor-21-8-sc.jpg",
  "isocycloseram": "/images/chem/real/isocycloseram-10-dc.jpg",
  "isocycloseram-10-dc": "/images/chem/real/isocycloseram-10-dc.jpg",
  "isoprothiolane-40-ec": "/images/chem/real/isoprothiolane-40-ec.jpg",
  "isopyrazam": "/images/chem/real/isopyrazam-12-sc.jpg",
  "isopyrazam-12-sc": "/images/chem/real/isopyrazam-12-sc.jpg",
  "jaggery-bait": "/images/tools/jaggery-molasses-bait.jpg",
  "jaggery-molasses-bait": "/images/tools/jaggery-molasses-bait.jpg",
  "kasugamycin-3-sl": "/images/chem/real/kasugamycin-3-sl.jpg",
  "keiron": "/images/chem/real/chlorfenapyr-10-sc.jpg",
  "kitazin": "/images/chem/real/kitazin-48-ec.jpg",
  "kitazin-48-ec": "/images/chem/real/kitazin-48-ec.jpg",
  "kixor": "/images/chem/real/saflufenacil-70-wg.jpg",
  "kresoxim-methyl": "/images/chem/real/kresoxim-methyl-44-sc.jpg",
  "kresoxim-methyl-44-sc": "/images/chem/real/kresoxim-methyl-44-sc.jpg",
  "lambda-cyhalothrin-5-ec": "/images/chem/real/lambda-cyhalothrin-5-ec.jpg",
  "lieto": "/images/chem/real/amisulbrom-17-7-sc.jpg",
  "lihocin": "/images/chem/real/chlormequat-chloride-50-sl.jpg",
  "luximo": "/images/chem/real/cinmethylin-ec.jpg",
  "magnesium-sulphate": "/images/chem/real/magnesium-sulphate.jpg",
  "maiden": "/images/chem/real/hexythiazox-5-45-ec.jpg",
  "malathion-50-ec": "/images/chem/real/malathion-50-ec.jpg",
  "mancozeb-75-wp": "/images/chem/real/mancozeb-75-wp.jpg",
  "mandipropamid": "/images/chem/real/mandipropamid-23-sc.jpg",
  "mandipropamid-23-sc": "/images/chem/real/mandipropamid-23-sc.jpg",
  "meothrin": "/images/chem/real/fenpropathrin-10-ec.jpg",
  "mepiquat-chloride": "/images/chem/real/mepiquat-chloride-5-as.jpg",
  "mepiquat-chloride-5-as": "/images/chem/real/mepiquat-chloride-5-as.jpg",
  "mesosulfuron-iodosulfuron-wg": "/images/chem/real/mesosulfuron-iodosulfuron-wg.jpg",
  "metaflumizone": "/images/chem/real/metaflumizone-24-sc.jpg",
  "metaflumizone-24-sc": "/images/chem/real/metaflumizone-24-sc.jpg",
  "metalaxyl-m-mancozeb-wp": "/images/chem/real/metalaxyl-m-mancozeb-wp.jpg",
  "methoxyfenozide": "/images/chem/real/methoxyfenozide-150-sc.jpg",
  "methoxyfenozide-150-sc": "/images/chem/real/methoxyfenozide-150-sc.jpg",
  "methyl-eugenol-trap": "/images/chem/real/pheromone-trap.jpg",
  "methyl-eugenol-traps": "/images/chem/real/pheromone-trap.jpg",
  "methyl-parathion": "/images/chem/real/methyl-parathion-2-dp.jpg",
  "methyl-parathion-2-dp": "/images/chem/real/methyl-parathion-2-dp.jpg",
  "methyl-parathion-2-dust": "/images/chem/real/methyl-parathion-2-dp.jpg",
  "methyl-parathion-dp": "/images/chem/real/methyl-parathion-2-dp.jpg",
  "metiram": "/images/chem/real/metiram-70-wg.jpg",
  "metiram-55": "/images/chem/real/metiram-55-pyraclostrobin-5-wg.jpg",
  "metiram-55-pyraclostrobin-5-wg": "/images/chem/real/metiram-55-pyraclostrobin-5-wg.jpg",
  "metiram-70-wg": "/images/chem/real/metiram-70-wg.jpg",
  "metiram-70-wg-500-g": "/images/chem/real/metiram-70-wg.jpg",
  "metiram-pyraclostrobin": "/images/chem/real/metiram-55-pyraclostrobin-5-wg.jpg",
  "metrafenone": "/images/chem/real/metrafenone-50-sc.jpg",
  "metrafenone-50-sc": "/images/chem/real/metrafenone-50-sc.jpg",
  "metribuzin": "/images/chem/real/metribuzin-70-wp.jpg",
  "metribuzin-70-wp": "/images/chem/real/metribuzin-70-wp.jpg",
  "metsulfuron-methyl": "/images/chem/real/metsulfuron-methyl-20-wp.jpg",
  "metsulfuron-methyl-20-wp": "/images/chem/real/metsulfuron-methyl-20-wp.jpg",
  "micronutrient-mix": "/images/chem/real/micronutrient-mixture.jpg",
  "micronutrient-mixture": "/images/chem/real/micronutrient-mixture.jpg",
  "micronutrients": "/images/chem/real/micronutrient-mixture.jpg",
  "mineral-oil": "/images/chem/real/mineral-oil.jpg",
  "miravis-duo": "/images/chem/real/pydiflumetofen-fludioxonil-sc.jpg",
  "molasses-bait": "/images/tools/jaggery-molasses-bait.jpg",
  "monocrotophos": "/images/chem/real/monocrotophos-36-sl.jpg",
  "monocrotophos-36-sl": "/images/chem/real/monocrotophos-36-sl.jpg",
  "myclobutanil": "/images/chem/real/myclobutanil-10-wp.jpg",
  "myclobutanil-10-wp": "/images/chem/real/myclobutanil-10-wp.jpg",
  "naa": "/images/chem/real/naa-4-5-sl.jpg",
  "naa-4-5-sl": "/images/chem/real/naa-4-5-sl.jpg",
  "nealta": "/images/chem/real/cyflumetofen-20-sc.jpg",
  "neem-cake": "/images/chem/real/neem-cake.jpg",
  "neem-oil": "/images/chem/real/neem-oil-10000-ppm.jpg",
  "neem-oil-10000-ppm": "/images/chem/real/neem-oil-10000-ppm.jpg",
  "neem-oil-1500-ppm": "/images/chem/real/neem-oil-10000-ppm.jpg",
  "nicosulfuron": "/images/chem/real/nicosulfuron-75-wg.jpg",
  "nicosulfuron-75-wg": "/images/chem/real/nicosulfuron-75-wg.jpg",
  "nimitz": "/images/chem/real/fluensulfone-480-ec.jpg",
  "nishiko": "/images/chem/real/cyflufenamid-5-ew.jpg",
  "novaluron": "/images/chem/real/novaluron-10-ec.jpg",
  "novaluron-10-ec": "/images/chem/real/novaluron-10-ec.jpg",
  "novaluron-emamectin-sc": "/images/chem/real/novaluron-emamectin-sc.jpg",
  "novect": "/images/chem/real/florpyrauxifen-benzyl-2-7-ec.jpg",
  "orchestra": "/images/chem/real/benzpyrimoxan-10-sc.jpg",
  "orthene": "/images/chem/real/acephate-75-sp.jpg",
  "orthene-75-sp": "/images/chem/real/acephate-75-sp.jpg",
  "oxathiapiprolin": "/images/chem/real/oxathiapiprolin-10-1-od.jpg",
  "oxathiapiprolin-10-1-od": "/images/chem/real/oxathiapiprolin-10-1-od.jpg",
  "oxydemeton-methyl": "/images/chem/real/oxydemeton-methyl-25-ec.jpg",
  "oxydemeton-methyl-25-ec": "/images/chem/real/oxydemeton-methyl-25-ec.jpg",
  "oxyfluorfen": "/images/chem/real/oxyfluorfen-23-5-ec.jpg",
  "oxyfluorfen-23-5-ec": "/images/chem/real/oxyfluorfen-23-5-ec.jpg",
  "paclobutrazol": "/images/chem/real/paclobutrazol-23-sc.jpg",
  "paclobutrazol-23-sc": "/images/chem/real/paclobutrazol-23-sc.jpg",
  "parade": "/images/chem/real/pyraziflumid-20-sc.jpg",
  "paraquat": "/images/chem/real/paraquat-dichloride-24-sl.jpg",
  "paraquat-24-sl": "/images/chem/real/paraquat-dichloride-24-sl.jpg",
  "paraquat-dichloride": "/images/chem/real/paraquat-dichloride-24-sl.jpg",
  "paraquat-dichloride-24-sl": "/images/chem/real/paraquat-dichloride-24-sl.jpg",
  "penconazole": "/images/chem/real/penconazole-10-ec.jpg",
  "penconazole-10-ec": "/images/chem/real/penconazole-10-ec.jpg",
  "pencycuron": "/images/chem/real/pencycuron-22-9-sc.jpg",
  "pencycuron-22-9-sc": "/images/chem/real/pencycuron-22-9-sc.jpg",
  "pendimethalin-30-ec": "/images/chem/real/pendimethalin-30-ec.jpg",
  "penflufen": "/images/chem/real/penflufen-240-fs.jpg",
  "penflufen-240-fs": "/images/chem/real/penflufen-240-fs.jpg",
  "penoxsulam": "/images/chem/real/penoxsulam-21-7-sc.jpg",
  "penoxsulam-21-7-sc": "/images/chem/real/penoxsulam-21-7-sc.jpg",
  "penthiopyrad": "/images/chem/real/penthiopyrad-20-sc.jpg",
  "penthiopyrad-20-sc": "/images/chem/real/penthiopyrad-20-sc.jpg",
  "pexalon": "/images/chem/real/triflumezopyrim-10-sc.jpg",
  "pheromone-trap": "/images/chem/real/pheromone-trap.jpg",
  "picoxystrobin": "/images/chem/real/picoxystrobin-22-5-sc.jpg",
  "picoxystrobin-22-5-sc": "/images/chem/real/picoxystrobin-22-5-sc.jpg",
  "picoxystrobin-7-propiconazole-12-sc": "/images/chem/real/picoxystrobin-propiconazole-sc.jpg",
  "picoxystrobin-propiconazole": "/images/chem/real/picoxystrobin-propiconazole-sc.jpg",
  "picoxystrobin-propiconazole-sc": "/images/chem/real/picoxystrobin-propiconazole-sc.jpg",
  "pinoxaden": "/images/chem/real/pinoxaden-5-ec.jpg",
  "pinoxaden-5-ec": "/images/chem/real/pinoxaden-5-ec.jpg",
  "planofix": "/images/chem/real/naa-4-5-sl.jpg",
  "pleora": "/images/chem/real/pyridalyl-10-ec.jpg",
  "plinazolin": "/images/chem/real/isocycloseram-10-dc.jpg",
  "polo": "/images/chem/real/diafenthiuron-50-wp.jpg",
  "polo-500-sc": "/images/chem/real/diafenthiuron-50-wp.jpg",
  "polyram": "/images/chem/real/metiram-70-wg.jpg",
  "potassium-phosphite": "/images/chem/real/potassium-phosphite.jpg",
  "pretilachlor-50-ec": "/images/chem/real/pretilachlor-50-ec.jpg",
  "previcur": "/images/chem/real/propamocarb-53-2-sl.jpg",
  "profenofos-40-cypermethrin-4-ec": "/images/chem/real/profenofos-cypermethrin-ec.jpg",
  "profenofos-50-ec": "/images/chem/real/profenofos-50-ec.jpg",
  "profenofos-cypermethrin-ec": "/images/chem/real/profenofos-cypermethrin-ec.jpg",
  "profenophos": "/images/chem/real/profenofos-50-ec.jpg",
  "profenophos-50-ec": "/images/chem/real/profenofos-50-ec.jpg",
  "prohexadione-calcium": "/images/chem/real/prohexadione-calcium-wdg.jpg",
  "prohexadione-calcium-wdg": "/images/chem/real/prohexadione-calcium-wdg.jpg",
  "prohydrojasmon": "/images/chem/real/prohydrojasmon-5-sl.jpg",
  "prohydrojasmon-5-sl": "/images/chem/real/prohydrojasmon-5-sl.jpg",
  "proline": "/images/chem/real/prothioconazole-37-8-sc.jpg",
  "propamocarb": "/images/chem/real/propamocarb-53-2-sl.jpg",
  "propamocarb-53-2": "/images/chem/real/propamocarb-53-2-sl.jpg",
  "propamocarb-53-2-sl": "/images/chem/real/propamocarb-53-2-sl.jpg",
  "propargite-57-ec": "/images/chem/real/propargite-57-ec.jpg",
  "propiconazole-25-ec": "/images/chem/real/propiconazole-25-ec.jpg",
  "propineb-70-wp": "/images/chem/real/propineb-70-wp.jpg",
  "prothioconazole": "/images/chem/real/prothioconazole-37-8-sc.jpg",
  "prothioconazole-37-8-sc": "/images/chem/real/prothioconazole-37-8-sc.jpg",
  "pseudomonas-fluorescens": "/images/chem/real/pseudomonas-fluorescens-1-wp.jpg",
  "pseudomonas-fluorescens-1-wp": "/images/chem/real/pseudomonas-fluorescens-1-wp.jpg",
  "pydiflumetofen-fludioxonil": "/images/chem/real/pydiflumetofen-fludioxonil-sc.jpg",
  "pydiflumetofen-fludioxonil-7-5-2-5-sc": "/images/chem/real/pydiflumetofen-fludioxonil-sc.jpg",
  "pydiflumetofen-fludioxonil-sc": "/images/chem/real/pydiflumetofen-fludioxonil-sc.jpg",
  "pymetrozine": "/images/chem/real/pymetrozine-50-wg.jpg",
  "pymetrozine-50-wg": "/images/chem/real/pymetrozine-50-wg.jpg",
  "pyraclostrobin-20-wg": "/images/chem/real/pyraclostrobin-20-wg.jpg",
  "pyranica": "/images/chem/real/acynonapyr-20-sc.jpg",
  "pyraziflumid": "/images/chem/real/pyraziflumid-20-sc.jpg",
  "pyraziflumid-20-sc": "/images/chem/real/pyraziflumid-20-sc.jpg",
  "pyrazosulfuron": "/images/chem/real/pyrazosulfuron-10-wp.jpg",
  "pyrazosulfuron-10-wp": "/images/chem/real/pyrazosulfuron-10-wp.jpg",
  "pyrazosulfuron-ethyl-10-wp": "/images/chem/real/pyrazosulfuron-10-wp.jpg",
  "pyridalyl": "/images/chem/real/pyridalyl-10-ec.jpg",
  "pyridalyl-10-ec": "/images/chem/real/pyridalyl-10-ec.jpg",
  "pyrifluquinazon": "/images/chem/real/pyrifluquinazon-20-sc.jpg",
  "pyrifluquinazon-20-sc": "/images/chem/real/pyrifluquinazon-20-sc.jpg",
  "pyriproxyfen-10-ec": "/images/chem/real/pyriproxyfen-10-ec.jpg",
  "pyriproxyfen-bifenthrin-ec": "/images/chem/real/pyriproxyfen-bifenthrin-ec.jpg",
  "pyrithiobac": "/images/chem/real/pyrithiobac-sodium-10-ec.jpg",
  "pyrithiobac-sodium": "/images/chem/real/pyrithiobac-sodium-10-ec.jpg",
  "pyrithiobac-sodium-10-ec": "/images/chem/real/pyrithiobac-sodium-10-ec.jpg",
  "pyrote": "/images/chem/real/fenpyroximate-5-ec.jpg",
  "pyroxasulfone-85-wg": "/images/chem/real/pyroxasulfone-85-wg.jpg",
  "quinalphos": "/images/chem/real/quinalphos-25-ec.jpg",
  "quinalphos-25-ec": "/images/chem/real/quinalphos-25-ec.jpg",
  "quinofumelin": "/images/chem/real/quinofumelin-25-sc.jpg",
  "quinofumelin-25-sc": "/images/chem/real/quinofumelin-25-sc.jpg",
  "quizalofop": "/images/chem/real/quizalofop-5-ec.jpg",
  "quizalofop-5-ec": "/images/chem/real/quizalofop-5-ec.jpg",
  "quizalofop-ethyl-5-ec": "/images/chem/real/quizalofop-5-ec.jpg",
  "reklemel": "/images/chem/real/fluazaindolizine-500-sc.jpg",
  "rynaxypyr": "/images/chem/real/chlorantraniliprole-18-5-sc.jpg",
  "rynaxypyr-20-sc": "/images/chem/real/chlorantraniliprole-18-5-sc.jpg",
  "saflufenacil": "/images/chem/real/saflufenacil-70-wg.jpg",
  "saflufenacil-70-wg": "/images/chem/real/saflufenacil-70-wg.jpg",
  "samurai": "/images/chem/real/tebufenpyrad-20-wp.jpg",
  "seaweed-amino-acids": "/images/chem/real/seaweed-amino-acids.jpg",
  "seaweed-amino-acids-biostimulant": "/images/chem/real/seaweed-amino-acids.jpg",
  "seaweed-viricide": "/images/chem/real/seaweed-amino-acids.jpg",
  "seaweed-viricide-250-ml": "/images/chem/real/seaweed-amino-acids.jpg",
  "sectin": "/images/chem/real/fenamidone-10-sc.jpg",
  "sedaxane": "/images/chem/real/sedaxane-50-fs.jpg",
  "sedaxane-50-fs": "/images/chem/real/sedaxane-50-fs.jpg",
  "sedna": "/images/chem/real/fenpyroximate-5-ec.jpg",
  "sercadis": "/images/chem/real/fluxapyroxad-250-sc.jpg",
  "silicon-spreader": "/images/chem/real/silicon-spreader.jpg",
  "simodis": "/images/chem/real/isocycloseram-10-dc.jpg",
  "simpyl": "/images/chem/real/dicloromezotiaz-10-sc.jpg",
  "sivanto": "/images/chem/real/flupyradifurone-17-09-sl.jpg",
  "sivanto-prime": "/images/chem/real/flupyradifurone-17-09-sl.jpg",
  "solatenol": "/images/chem/real/benzovindiflupyr-100-ec.jpg",
  "solomon": "/images/chem/real/beta-cyfluthrin-8-49-sc.jpg",
  "sonalan": "/images/chem/real/ethalfluralin-35-4-ec.jpg",
  "spinetoram-11-7-sc": "/images/chem/real/spinetoram-11-7-sc.jpg",
  "spinosad-45-sc": "/images/chem/real/spinosad-45-sc.jpg",
  "spiromesifen-22-9-sc": "/images/chem/real/spiromesifen-22-9-sc.jpg",
  "spiropidion": "/images/chem/real/spiropidion-150-ec.jpg",
  "spiropidion-150-ec": "/images/chem/real/spiropidion-150-ec.jpg",
  "spirotetramat": "/images/chem/real/spirotetramat-15-od.jpg",
  "spirotetramat-15-od": "/images/chem/real/spirotetramat-15-od.jpg",
  "streptocycline": "/images/chem/real/streptocycline-sp.jpg",
  "streptocycline-sp": "/images/chem/real/streptocycline-sp.jpg",
  "streptocycline-tetracycline": "/images/chem/real/streptocycline-sp.jpg",
  "sulfosulfuron": "/images/chem/real/sulfosulfuron-75-wg.jpg",
  "sulfosulfuron-75-wg": "/images/chem/real/sulfosulfuron-75-wg.jpg",
  "sulfoxaflor": "/images/chem/real/sulfoxaflor-21-8-sc.jpg",
  "sulfoxaflor-21-8-sc": "/images/chem/real/sulfoxaflor-21-8-sc.jpg",
  "sulfoxaflor-21-sc": "/images/chem/real/sulfoxaflor-21-8-sc.jpg",
  "sulphur-65": "/images/chem/real/sulphur-65-wg.jpg",
  "sulphur-65-wg": "/images/chem/real/sulphur-65-wg.jpg",
  "sulphur-80-wdg": "/images/chem/real/wettable-sulphur-80-wdg.jpg",
  "sumimax": "/images/chem/real/flumioxazin-50-sc.jpg",
  "takumi": "/images/chem/real/flubendiamide-20-wg.jpg",
  "talstar": "/images/chem/real/bifenthrin-10-ec.jpg",
  "tebuconazole": "/images/chem/real/tebuconazole-25-9-ec.jpg",
  "tebuconazole-25-9-ec": "/images/chem/real/tebuconazole-25-9-ec.jpg",
  "tebuconazole-25-ec": "/images/chem/real/tebuconazole-25-9-ec.jpg",
  "tebuconazole-trifloxystrobin": "/images/chem/real/tebuconazole-trifloxystrobin.jpg",
  "tebuconazole-trifloxystrobin-wg": "/images/chem/real/tebuconazole-trifloxystrobin-wg.jpg",
  "tebufenpyrad": "/images/chem/real/tebufenpyrad-20-wp.jpg",
  "tebufenpyrad-20-wp": "/images/chem/real/tebufenpyrad-20-wp.jpg",
  "tembotrione": "/images/chem/real/tembotrione-34-sc.jpg",
  "tembotrione-34-sc": "/images/chem/real/tembotrione-34-sc.jpg",
  "terrad-or": "/images/chem/real/tiafenacil-70-wg.jpg",
  "tetflupyrolimet": "/images/chem/real/tetflupyrolimet-sc.jpg",
  "tetflupyrolimet-sc": "/images/chem/real/tetflupyrolimet-sc.jpg",
  "tetraconazole": "/images/chem/real/tetraconazole-3-8-ew.jpg",
  "tetraconazole-3-8-ew": "/images/chem/real/tetraconazole-3-8-ew.jpg",
  "tetracycline": "/images/chem/real/streptocycline-sp.jpg",
  "tetraniliprole": "/images/chem/real/tetraniliprole-200-sc.jpg",
  "tetraniliprole-200-sc": "/images/chem/real/tetraniliprole-200-sc.jpg",
  "thiacloprid-21-7-sc": "/images/chem/real/thiacloprid-21-7-sc.jpg",
  "thiamethoxam-12-6-lambda-9-5-zc": "/images/chem/real/thiamethoxam-lambda-zc.jpg",
  "thiamethoxam-12-6-lambda-cyhalothrin-9-5-zc": "/images/chem/real/thiamethoxam-lambda-zc.jpg",
  "thiamethoxam-25-wg": "/images/chem/real/thiamethoxam-25-wg.jpg",
  "thiamethoxam-30-fs": "/images/chem/real/thiamethoxam-30-fs.jpg",
  "thiamethoxam-lambda-combo": "/images/chem/real/thiamethoxam-lambda-zc.jpg",
  "thidiazuron": "/images/chem/real/thidiazuron-50-wp.jpg",
  "thidiazuron-50-wp": "/images/chem/real/thidiazuron-50-wp.jpg",
  "thifluzamide": "/images/chem/real/thifluzamide-24-sc.jpg",
  "thifluzamide-24-sc": "/images/chem/real/thifluzamide-24-sc.jpg",
  "thiodicarb": "/images/chem/real/thiodicarb-75-wp.jpg",
  "thiodicarb-75-wp": "/images/chem/real/thiodicarb-75-wp.jpg",
  "thiophanate-methyl-70-wp": "/images/chem/real/thiophanate-methyl-70-wp.jpg",
  "thiram": "/images/chem/real/thiram-75-wp.jpg",
  "thiram-75-wp": "/images/chem/real/thiram-75-wp.jpg",
  "tiafenacil": "/images/chem/real/tiafenacil-70-wg.jpg",
  "tiafenacil-70-wg": "/images/chem/real/tiafenacil-70-wg.jpg",
  "tioxazafen": "/images/chem/real/tioxazafen-500-fs.jpg",
  "tioxazafen-500-fs": "/images/chem/real/tioxazafen-500-fs.jpg",
  "tirexor": "/images/chem/real/trifludimoxazin-wg.jpg",
  "tolfenpyrad": "/images/chem/real/tolfenpyrad-15-ec.jpg",
  "tolfenpyrad-15-ec": "/images/chem/real/tolfenpyrad-15-ec.jpg",
  "topramezone": "/images/chem/real/topramezone-33-sc.jpg",
  "topramezone-33-sc": "/images/chem/real/topramezone-33-sc.jpg",
  "tracer": "/images/chem/real/spinosad-45-sc.jpg",
  "tracer-480-sc": "/images/chem/real/spinosad-45-sc.jpg",
  "transform": "/images/chem/real/sulfoxaflor-21-8-sc.jpg",
  "triadimefon-25-wp": "/images/chem/real/triadimefon-25-wp.jpg",
  "triafamone-ethoxysulfuron": "/images/chem/real/triafamone-ethoxysulfuron-wg.jpg",
  "triafamone-ethoxysulfuron-wg": "/images/chem/real/triafamone-ethoxysulfuron-wg.jpg",
  "triazophos": "/images/chem/real/triazophos-40-ec.jpg",
  "triazophos-40-ec": "/images/chem/real/triazophos-40-ec.jpg",
  "trichoderma-viride-1-wp": "/images/chem/real/trichoderma-viride-1-wp.jpg",
  "tricyclazole-75-wp": "/images/chem/real/tricyclazole-75-wp.jpg",
  "trifloxystrobin": "/images/chem/real/trifloxystrobin-25-wg.jpg",
  "trifloxystrobin-25-wg": "/images/chem/real/trifloxystrobin-25-wg.jpg",
  "trifludimoxazin": "/images/chem/real/trifludimoxazin-wg.jpg",
  "trifludimoxazin-wg": "/images/chem/real/trifludimoxazin-wg.jpg",
  "triflumezopyrim-10-sc": "/images/chem/real/triflumezopyrim-10-sc.jpg",
  "trifluralin": "/images/chem/real/trifluralin-48-ec.jpg",
  "trifluralin-48-ec": "/images/chem/real/trifluralin-48-ec.jpg",
  "tripyrasulfone": "/images/chem/real/tripyrasulfone-sc.jpg",
  "tripyrasulfone-sc": "/images/chem/real/tripyrasulfone-sc.jpg",
  "ustaad": "/images/chem/real/cypermethrin-25-ec.jpg",
  "validamycin-3-l": "/images/chem/real/validamycin-3-l.jpg",
  "vayego": "/images/chem/real/tetraniliprole-200-sc.jpg",
  "vibrance": "/images/chem/real/sedaxane-50-fs.jpg",
  "viricide-seaweed-extract": "/images/chem/real/seaweed-amino-acids.jpg",
  "vivando": "/images/chem/real/metrafenone-50-sc.jpg",
  "wettable-sulphur-80-wdg": "/images/chem/real/wettable-sulphur-80-wdg.jpg",
  "yellow-sticky-trap": "/images/chem/real/yellow-sticky-trap.jpg",
  "zampro": "/images/chem/real/ametoctradin-dimethomorph-sc.jpg",
  "zampro-525-sc": "/images/chem/real/ametoctradin-dimethomorph-sc.jpg",
  "zinc-edta": "/images/chem/real/chelated-zinc-12.jpg",
  "zinc-sulphate": "/images/chem/real/chelated-zinc-12.jpg",
  "zineb": "/images/chem/real/zineb-75-wp.jpg",
  "zineb-75-wp": "/images/chem/real/zineb-75-wp.jpg",
  "ziram": "/images/chem/real/ziram-27-sc.jpg",
  "ziram-27-sc": "/images/chem/real/ziram-27-sc.jpg",
  "zorvec": "/images/chem/real/oxathiapiprolin-10-1-od.jpg",
  "zorvec-enicade": "/images/chem/real/oxathiapiprolin-10-1-od.jpg",
};

export const STATIC_SVG_BOTTLES = new Set<string>([]);

export function hasRealBottlePhoto(technical: string): boolean {
  if (!technical) return false;
  const hit = lookupChemBottle(technical);
  if (hit?.slug && REAL_BOTTLE_PHOTOS[hit.slug]) return true;
  const norm = technical
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (REAL_BOTTLE_PHOTOS[norm]) return true;
  return false;
}

/**
 * 100% Pure Generic Technical Packaging:
 * Returns the authentic photorealistic 3D studio image (with ZERO commercial brands & ZERO company logos),
 * falling back to the vector product shot only if a real photo is not yet in the catalog.
 */
export function chemBottleImageSrc(technical: string): string {
  const hit = lookupChemBottle(technical);
  if (hit?.slug && REAL_BOTTLE_PHOTOS[hit.slug]) {
    return REAL_BOTTLE_PHOTOS[hit.slug];
  }

  const norm = technical
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (REAL_BOTTLE_PHOTOS[norm]) {
    return REAL_BOTTLE_PHOTOS[norm];
  }

  const cat = hit?.category || bottleCategory(technical);
  const pkgType = getChemPackageType(technical, hit?.formulation);
  const svg =
    pkgType === "pouch"
      ? renderChemPouchSvg(technical, cat)
      : renderChemBottleSvg(technical, cat);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

