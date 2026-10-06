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
  "azoxystrobin-250-sc": "/images/chem/real/azoxystrobin-250-sc.jpg",
  "azoxystrobin-difenoconazole": "/images/chem/real/azoxystrobin-difenoconazole.jpg",
  "azoxystrobin-difenoconazole-sc": "/images/chem/real/azoxystrobin-difenoconazole-sc.jpg",
  "bispyribac-sodium-10-sc": "/images/chem/real/bispyribac-sodium-10-sc.jpg",
  "carbendazim-50-wp": "/images/chem/real/carbendazim-50-wp.jpg",
  "carbendazim-mancozeb-wp": "/images/chem/real/carbendazim-mancozeb-wp.jpg",
  "chlorantraniliprole-18-5-sc": "/images/chem/real/chlorantraniliprole-18-5-sc.jpg",
  "chlorothalonil-75-wp": "/images/chem/real/chlorothalonil-75-wp.jpg",
  "copper-hydroxide-53-8-df": "/images/chem/real/copper-hydroxide-53-8-df.jpg",
  "copper-oxychloride-50-wp": "/images/chem/real/copper-oxychloride-50-wp.jpg",
  "difenoconazole-25-ec": "/images/chem/real/difenoconazole-25-ec.jpg",
  "dimethomorph-50-wp": "/images/chem/real/dimethomorph-50-wp.jpg",
  "emamectin-benzoate-5-sg": "/images/chem/real/emamectin-benzoate-5-sg.jpg",
  "imidacloprid-17-8-sl": "/images/chem/real/imidacloprid-17-8-sl.jpg",
  "mancozeb-75-wp": "/images/chem/real/mancozeb-75-wp.jpg",
  "metalaxyl-m-mancozeb-wp": "/images/chem/real/metalaxyl-m-mancozeb-wp.jpg",
  "pendimethalin-30-ec": "/images/chem/real/pendimethalin-30-ec.jpg",
  "propineb-70-wp": "/images/chem/real/propineb-70-wp.jpg",
  "tebuconazole-25-9-ec": "/images/chem/real/tebuconazole-25-9-ec.jpg",
  "tebuconazole-trifloxystrobin": "/images/chem/real/tebuconazole-trifloxystrobin.jpg",
  "tebuconazole-trifloxystrobin-wg": "/images/chem/real/tebuconazole-trifloxystrobin-wg.jpg",
  "thiamethoxam-25-wg": "/images/chem/real/thiamethoxam-25-wg.jpg",
};

export function hasRealBottlePhoto(technical: string): boolean {
  const hit = lookupChemBottle(technical);
  return Boolean(hit?.slug && REAL_BOTTLE_PHOTOS[hit.slug]);
}

export function chemBottleImageSrc(technical: string): string {
  const hit = lookupChemBottle(technical);
  if (hit?.slug && REAL_BOTTLE_PHOTOS[hit.slug]) {
    return REAL_BOTTLE_PHOTOS[hit.slug];
  }
  const pkgType = getChemPackageType(technical, hit?.formulation);
  if (pkgType === "pouch") {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      renderChemPouchSvg(technical, hit?.category)
    )}`;
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    renderChemBottleSvg(technical, hit?.category)
  )}`;
}


