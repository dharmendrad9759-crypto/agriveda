const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const REAL_DIR = 'public/images/chem/real';

// Palette definitions
const PALETTES = {
  herbicide: {
    bannerBg: '#0f5132',
    bannerText: 'HERBICIDE · खरपतवारनाशक',
    diamondColor: '#22c55e', // Green caution / Blue caution
    accent: '#059669',
  },
  insecticide: {
    bannerBg: '#15803d',
    bannerText: 'INSECTICIDE · कीटनाशक',
    diamondColor: '#3b82f6',
    accent: '#16a34a',
  },
  fungicide: {
    bannerBg: '#1e40af',
    bannerText: 'FUNGICIDE · फफूंदनाशक',
    diamondColor: '#3b82f6',
    accent: '#2563eb',
  },
  pgr: {
    bannerBg: '#6b21a8',
    bannerText: 'PLANT GROWTH REGULATOR · पादप वृद्धि नियामक',
    diamondColor: '#22c55e',
    accent: '#9333ea',
  },
};

/**
 * Creates a photoreal standing pouch image (1024x1024)
 * Base: chlorothalonil-75-wp.jpg or atrazine-50-wp.jpg
 */
async function generatePouch({ slug, name1, name2, formulation, category, netWeight }) {
  const baseFile = path.join(REAL_DIR, 'chlorothalonil-75-wp.jpg');
  const targetFile = path.join(REAL_DIR, `${slug}.jpg`);
  const pal = PALETTES[category] || PALETTES.herbicide;

  const titleSvg = name2
    ? `<text x="512" y="340" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" letter-spacing="1">${name1}</text>
       <text x="512" y="380" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" letter-spacing="1">${name2}</text>`
    : `<text x="512" y="360" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="40" font-weight="900" letter-spacing="1.5">${name1}</text>`;

  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <!-- Label panel overlay covering existing label seamlessly -->
      <rect x="270" y="240" width="484" height="480" rx="12" fill="#fafafa" stroke="#e2e8f0" stroke-width="2" />

      <!-- Category Top Banner -->
      <path d="M 270 252 A 12 12 0 0 1 282 240 L 742 240 A 12 12 0 0 1 754 252 L 754 295 L 270 295 Z" fill="${pal.bannerBg}" />
      <text x="512" y="278" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" letter-spacing="1.5">${pal.bannerText}</text>

      <!-- Main Chemical Title -->
      ${titleSvg}

      <!-- Formulation Pill -->
      <rect x="392" y="405" width="240" height="42" rx="21" fill="#0f172a" />
      <text x="512" y="433" text-anchor="middle" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" letter-spacing="2">${formulation}</text>

      <!-- Subtitle badge -->
      <rect x="332" y="465" width="360" height="26" rx="13" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
      <text x="512" y="482" text-anchor="middle" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" letter-spacing="0.8">CIB&amp;RC GENERIC TECHNICAL FORMULATION</text>

      <!-- Statutory Hazard Warning Diamond -->
      <g transform="translate(512, 560)">
        <polygon points="0,-45 45,0 0,45 -45,0" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
        <polygon points="0,0 45,0 0,45 -45,0" fill="${pal.diamondColor}" stroke="none"/>
        <text x="0" y="-12" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900">CAUTION</text>
        <text x="0" y="22" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900">सावधान</text>
      </g>

      <!-- Net Contents Footer -->
      <line x1="300" y1="645" x2="724" y2="645" stroke="#e2e8f0" stroke-width="1.5"/>
      <text x="320" y="675" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800">NET WEIGHT: ${netWeight}</text>
      <text x="704" y="675" text-anchor="end" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800">BATCH: GEN-2026</text>
    </svg>
  `;

  await sharp(baseFile)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(targetFile);

  console.log(`Generated Pouch: ${targetFile}`);
}

/**
 * Creates a photoreal bottle image (1024x1024)
 * Base: isoprothiolane-40-ec.jpg or quinalphos-25-ec.jpg or glyphosate-41-sl.jpg
 */
async function generateBottle({ slug, name1, name2, formulation, category, volume, baseName = 'isoprothiolane-40-ec.jpg' }) {
  const baseFile = path.join(REAL_DIR, baseName);
  const targetFile = path.join(REAL_DIR, `${slug}.jpg`);
  const pal = PALETTES[category] || PALETTES.herbicide;

  const titleSvg = name2
    ? `<text x="512" y="475" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" letter-spacing="1">${name1}</text>
       <text x="512" y="510" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" letter-spacing="1">${name2}</text>`
    : `<text x="512" y="490" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="900" letter-spacing="1.2">${name1}</text>`;

  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <!-- Bottle label overlay -->
      <rect x="330" y="380" width="364" height="430" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />

      <!-- Top Category Banner -->
      <path d="M 330 388 A 8 8 0 0 1 338 380 L 686 380 A 8 8 0 0 1 694 388 L 694 425 L 330 425 Z" fill="${pal.bannerBg}" />
      <text x="512" y="411" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" letter-spacing="1.5">${pal.bannerText}</text>

      <!-- Main Name -->
      ${titleSvg}

      <!-- Formulation Pill -->
      <rect x="402" y="535" width="220" height="38" rx="19" fill="#0f172a" />
      <text x="512" y="561" text-anchor="middle" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="2">${formulation}</text>

      <!-- Generic Grade Line -->
      <rect x="355" y="590" width="314" height="24" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="512" y="606" text-anchor="middle" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" letter-spacing="0.8">CIB&amp;RC GENERIC TECHNICAL FORMULATION</text>

      <!-- Statutory Hazard Diamond -->
      <g transform="translate(512, 675)">
        <polygon points="0,-40 40,0 0,40 -40,0" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
        <polygon points="0,0 40,0 0,40 -40,0" fill="${pal.diamondColor}" stroke="none"/>
        <text x="0" y="-10" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="900">CAUTION</text>
        <text x="0" y="20" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="900">सावधान</text>
      </g>

      <!-- Volume info -->
      <line x1="350" y1="755" x2="674" y2="755" stroke="#e2e8f0" stroke-width="1"/>
      <text x="360" y="782" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800">VOLUME: ${volume}</text>
      <text x="664" y="782" text-anchor="end" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800">GENERIC GRADE</text>
    </svg>
  `;

  await sharp(baseFile)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(targetFile);

  console.log(`Generated Bottle: ${targetFile}`);
}

async function main() {
  console.log('Generating authentic generic packaging for missing items...');

  // 1. Clodinafop-propargyl 15% WP (Topik) - Herbicide Pouch (160g)
  await generatePouch({
    slug: 'clodinafop-15-wp',
    name1: 'CLODINAFOP-PROPARGYL',
    formulation: '15% WP',
    category: 'herbicide',
    netWeight: '160 g',
  });

  // 2. Sulfosulfuron 75% WG (Leader) - Herbicide Pouch (13.5g)
  await generatePouch({
    slug: 'sulfosulfuron-75-wg',
    name1: 'SULFOSULFURON',
    formulation: '75% WG',
    category: 'herbicide',
    netWeight: '13.5 g',
  });

  // 3. Metsulfuron-methyl 20% WP (Algrip) - Herbicide Pouch (8g)
  await generatePouch({
    slug: 'metsulfuron-methyl-20-wp',
    name1: 'METSULFURON-METHYL',
    formulation: '20% WP',
    category: 'herbicide',
    netWeight: '8 g',
  });

  // 4. Ethoxysulfuron 15% WDG (Sunrice) - Herbicide Pouch (50g)
  await generatePouch({
    slug: 'ethoxysulfuron-15-wdg',
    name1: 'ETHOXYSULFURON',
    formulation: '15% WDG',
    category: 'herbicide',
    netWeight: '50 g',
  });

  // 5. Halosulfuron-methyl 75% WG (Sempra) - Herbicide Pouch (36g)
  await generatePouch({
    slug: 'halosulfuron-75-wg',
    name1: 'HALOSULFURON-METHYL',
    formulation: '75% WG',
    category: 'herbicide',
    netWeight: '36 g',
  });

  // 6. Metribuzin 70% WP (Sencor) - Herbicide Pouch (250g)
  await generatePouch({
    slug: 'metribuzin-70-wp',
    name1: 'METRIBUZIN',
    formulation: '70% WP',
    category: 'herbicide',
    netWeight: '250 g',
  });

  // 7. Pyrazosulfuron-ethyl 10% WP (Sathi) - Herbicide Pouch (80g)
  await generatePouch({
    slug: 'pyrazosulfuron-10-wp',
    name1: 'PYRAZOSULFURON-ETHYL',
    formulation: '10% WP',
    category: 'herbicide',
    netWeight: '80 g',
  });

  // 8. Butachlor 50% EC (Machete) - Herbicide Bottle (1L)
  await generateBottle({
    slug: 'butachlor-50-ec',
    name1: 'BUTACHLOR',
    formulation: '50% EC',
    category: 'herbicide',
    volume: '1 Litre',
  });

  // 9. 2,4-D Amine Salt 58% SL - Herbicide Bottle (1L)
  await generateBottle({
    slug: '2-4-d-amine-58-sl',
    name1: '2,4-D AMINE SALT',
    formulation: '58% SL',
    category: 'herbicide',
    volume: '1 Litre',
  });

  // 10. Imazethapyr 10% SL (Pursuit) - Herbicide Bottle (1L)
  await generateBottle({
    slug: 'imazethapyr-10-sl',
    name1: 'IMAZETHAPYR',
    formulation: '10% SL',
    category: 'herbicide',
    volume: '1 Litre',
  });

  // 11. Quizalofop-ethyl 5% EC (Targa Super) - Herbicide Bottle (500ml)
  await generateBottle({
    slug: 'quizalofop-5-ec',
    name1: 'QUIZALOFOP-ETHYL',
    formulation: '5% EC',
    category: 'herbicide',
    volume: '500 ml',
  });

  // 12. Tembotrione 34.4% SC (Laudis) - Herbicide Bottle (400ml)
  await generateBottle({
    slug: 'tembotrione-34-sc',
    name1: 'TEMBOTRIONE',
    formulation: '34.4% SC',
    category: 'herbicide',
    volume: '400 ml',
  });

  // 13. Topramezone 33.6% SC (Armezon) - Herbicide Bottle (75ml)
  await generateBottle({
    slug: 'topramezone-33-sc',
    name1: 'TOPRAMEZONE',
    formulation: '33.6% SC',
    category: 'herbicide',
    volume: '75 ml',
  });

  // 14. Pinoxaden 5.1% EC (Axial) - Herbicide Bottle (400ml)
  await generateBottle({
    slug: 'pinoxaden-5-ec',
    name1: 'PINOXADEN',
    formulation: '5.1% EC',
    category: 'herbicide',
    volume: '400 ml',
  });

  // 15. Spirotetramat 15.31% OD (Movento) - Insecticide Bottle (500ml)
  await generateBottle({
    slug: 'spirotetramat-15-od',
    name1: 'SPIROTETRAMAT',
    formulation: '15.31% OD',
    category: 'insecticide',
    volume: '500 ml',
  });

  // 16. Mandipropamid 23.4% SC (Revus) - Fungicide Bottle (500ml)
  await generateBottle({
    slug: 'mandipropamid-23-sc',
    name1: 'MANDIPROPAMID',
    formulation: '23.4% SC',
    category: 'fungicide',
    volume: '500 ml',
  });

  // 17. Paclobutrazol 23% SC (Cultar) - PGR Bottle (500ml)
  await generateBottle({
    slug: 'paclobutrazol-23-sc',
    name1: 'PACLOBUTRAZOL',
    formulation: '23% SC',
    category: 'pgr',
    volume: '500 ml',
  });

  // 18. Mepiquat Chloride 5% AS (Chamatkar) - PGR Bottle (500ml)
  await generateBottle({
    slug: 'mepiquat-chloride-5-as',
    name1: 'MEPIQUAT CHLORIDE',
    formulation: '5% AS',
    category: 'pgr',
    volume: '500 ml',
  });

  // 19. Spiropidion 150 SC - Insecticide Bottle (200ml)
  await generateBottle({
    slug: 'spiropidion-150-ec',
    name1: 'SPIROPIDION',
    formulation: '150 SC',
    category: 'insecticide',
    volume: '200 ml',
  });

  // 20. Penflufen 240 FS - Seed Treatment Fungicide (100ml)
  await generateBottle({
    slug: 'penflufen-240-fs',
    name1: 'PENFLUFEN',
    formulation: '240 FS',
    category: 'fungicide',
    volume: '100 ml',
  });

  // 21. Forchlorfenuron 0.1% L (CPPU) - PGR Bottle (250ml)
  await generateBottle({
    slug: 'forchlorfenuron-01-l',
    name1: 'FORCHLORFENURON',
    formulation: '0.1% L',
    category: 'pgr',
    volume: '250 ml',
  });

  // 22. Fenazaquin 10% EC - Acaricide/Insecticide (500ml)
  await generateBottle({
    slug: 'fenazaquin-10-ec',
    name1: 'FENAZAQUIN',
    formulation: '10% EC',
    category: 'insecticide',
    volume: '500 ml',
  });

  // 23. Fosetyl-Al 80% WP - Systemic Fungicide Pouch (250g)
  await generatePouch({
    slug: 'fosetyl-al-80-wp',
    name1: 'FOSETYL-AL',
    formulation: '80% WP',
    category: 'fungicide',
    netWeight: '250 g',
  });

  // 24. Oxyfluorfen 23.5% EC - Herbicide Bottle (500ml)
  await generateBottle({
    slug: 'oxyfluorfen-23-5-ec',
    name1: 'OXYFLUORFEN',
    formulation: '23.5% EC',
    category: 'herbicide',
    volume: '500 ml',
  });

  // 25. Penoxsulam 21.7% SC - Herbicide Bottle (100ml)
  await generateBottle({
    slug: 'penoxsulam-21-7-sc',
    name1: 'PENOXSULAM',
    formulation: '21.7% SC',
    category: 'herbicide',
    volume: '100 ml',
  });

  // 26. Cyhalofop-butyl 10% EC - Herbicide Bottle (500ml)
  await generateBottle({
    slug: 'cyhalofop-butyl-10-ec',
    name1: 'CYHALOFOP-BUTYL',
    formulation: '10% EC',
    category: 'herbicide',
    volume: '500 ml',
  });

  // 27. Pencycuron 22.9% SC - Fungicide Bottle (250ml)
  await generateBottle({
    slug: 'pencycuron-22-9-sc',
    name1: 'PENCYCURON',
    formulation: '22.9% SC',
    category: 'fungicide',
    volume: '250 ml',
  });

  // 28. Chlorimuron-ethyl 25% WP - Herbicide Pouch (15g)
  await generatePouch({
    slug: 'chlorimuron-ethyl-25-wp',
    name1: 'CHLORIMURON-ETHYL',
    formulation: '25% WP',
    category: 'herbicide',
    netWeight: '15 g',
  });

  // 29. Mesosulfuron + Iodosulfuron WG - Herbicide Pouch (160g)
  await generatePouch({
    slug: 'mesosulfuron-iodosulfuron-wg',
    name1: 'MESOSULFURON 3%',
    name2: '+ IODOSULFURON 0.6% WG',
    formulation: '3% + 0.6% WG',
    category: 'herbicide',
    netWeight: '160 g',
  });

  // 30. Pyrithiobac-sodium 10% EC - Herbicide Bottle (250ml)
  await generateBottle({
    slug: 'pyrithiobac-sodium-10-ec',
    name1: 'PYRITHIOBAC-SODIUM',
    formulation: '10% EC',
    category: 'herbicide',
    volume: '250 ml',
  });

  // 31. Diuron 80% WP - Herbicide Pouch (500g)
  await generatePouch({
    slug: 'diuron-80-wp',
    name1: 'DIURON',
    formulation: '80% WP',
    category: 'herbicide',
    netWeight: '500 g',
  });

  console.log('All 31 product images successfully generated!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
