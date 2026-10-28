const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const REAL_DIR = 'public/images/chem/real';

const PALETTES = {
  herbicide: {
    bannerBg: '#0f5132',
    bannerText: 'HERBICIDE · खरपतवारनाशक',
    diamondColor: '#22c55e',
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
};

async function generatePouch({ slug, name1, name2, formulation, category, netWeight }) {
  const baseFile = path.join(REAL_DIR, 'chlorothalonil-75-wp.jpg');
  const targetFile = path.join(REAL_DIR, `${slug}.jpg`);
  const pal = PALETTES[category] || PALETTES.herbicide;

  const titleSvg = name2
    ? `<text x="512" y="340" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="900" letter-spacing="1">${name1}</text>
       <text x="512" y="380" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" letter-spacing="1">${name2}</text>`
    : `<text x="512" y="360" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="40" font-weight="900" letter-spacing="1.5">${name1}</text>`;

  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <rect x="270" y="240" width="484" height="480" rx="12" fill="#fafafa" stroke="#e2e8f0" stroke-width="2" />
      <path d="M 270 252 A 12 12 0 0 1 282 240 L 742 240 A 12 12 0 0 1 754 252 L 754 295 L 270 295 Z" fill="${pal.bannerBg}" />
      <text x="512" y="278" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" letter-spacing="1.5">${pal.bannerText}</text>
      ${titleSvg}
      <rect x="362" y="405" width="300" height="42" rx="21" fill="#0f172a" />
      <text x="512" y="433" text-anchor="middle" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" letter-spacing="2">${formulation}</text>
      <rect x="300" y="465" width="424" height="26" rx="13" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
      <text x="512" y="482" text-anchor="middle" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" letter-spacing="1">CIB&amp;RC GENERIC TECHNICAL FORMULATION</text>
      <g transform="translate(512, 565)">
        <polygon points="0,-45 45,0 0,45 -45,0" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
        <polygon points="0,0 45,0 0,45 -45,0" fill="${pal.diamondColor}" stroke="none"/>
        <text x="0" y="-12" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900">CAUTION</text>
        <text x="0" y="22" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900">सावधान</text>
      </g>
      <line x1="290" y1="650" x2="734" y2="650" stroke="#e2e8f0" stroke-width="1"/>
      <text x="310" y="682" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800">NET WEIGHT: ${netWeight}</text>
      <text x="714" y="682" text-anchor="end" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800">GENERIC GRADE</text>
    </svg>
  `;

  await sharp(baseFile)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(targetFile);

  console.log(`Generated Pouch: ${targetFile}`);
}

async function generateBottle({ slug, name1, name2, formulation, category, volume, baseName = 'isoprothiolane-40-ec.jpg' }) {
  const baseFile = path.join(REAL_DIR, baseName);
  const targetFile = path.join(REAL_DIR, `${slug}.jpg`);
  const pal = PALETTES[category] || PALETTES.herbicide;

  const titleSvg = name2
    ? `<text x="512" y="475" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" letter-spacing="1">${name1}</text>
       <text x="512" y="510" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" letter-spacing="1">${name2}</text>`
    : `<text x="512" y="490" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="900" letter-spacing="1.2">${name1}</text>`;

  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <rect x="330" y="380" width="364" height="430" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <path d="M 330 388 A 8 8 0 0 1 338 380 L 686 380 A 8 8 0 0 1 694 388 L 694 425 L 330 425 Z" fill="${pal.bannerBg}" />
      <text x="512" y="411" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" letter-spacing="1.5">${pal.bannerText}</text>
      ${titleSvg}
      <rect x="402" y="535" width="220" height="38" rx="19" fill="#0f172a" />
      <text x="512" y="561" text-anchor="middle" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="2">${formulation}</text>
      <rect x="355" y="590" width="314" height="24" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="512" y="606" text-anchor="middle" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" letter-spacing="0.8">CIB&amp;RC GENERIC TECHNICAL FORMULATION</text>
      <g transform="translate(512, 675)">
        <polygon points="0,-40 40,0 0,40 -40,0" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
        <polygon points="0,0 40,0 0,40 -40,0" fill="${pal.diamondColor}" stroke="none"/>
        <text x="0" y="-10" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="900">CAUTION</text>
        <text x="0" y="20" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="900">सावधान</text>
      </g>
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
  console.log('--- Generating final 7 missing photorealistic packages ---');

  // 1. Thiamethoxam 12.6% + Lambda Cyhalothrin 9.5% ZC
  await generateBottle({
    slug: 'thiamethoxam-12-6-lambda-9-5-zc',
    name1: 'THIAMETHOXAM 12.6% +',
    name2: 'LAMBDA-CYHALOTHRIN 9.5%',
    formulation: '12.6% + 9.5% ZC',
    category: 'insecticide',
    volume: '500 ml',
    baseName: 'bifenthrin-10-ec.jpg',
  });

  // 2. Picoxystrobin 7.05% + Propiconazole 11.71% SC
  await generateBottle({
    slug: 'picoxystrobin-7-propiconazole-12-sc',
    name1: 'PICOXYSTROBIN 7.05% +',
    name2: 'PROPICONAZOLE 11.71%',
    formulation: '7.05% + 11.71% SC',
    category: 'fungicide',
    volume: '400 ml',
    baseName: 'azoxystrobin-difenoconazole-sc.jpg',
  });

  // 3. Carbaryl 50% WP
  await generatePouch({
    slug: 'carbaryl-50-wp',
    name1: 'CARBARYL',
    name2: null,
    formulation: '50% WP',
    category: 'insecticide',
    netWeight: '500 g',
  });

  // 4. Myclobutanil 10% WP
  await generatePouch({
    slug: 'myclobutanil-10-wp',
    name1: 'MYCLOBUTANIL',
    name2: null,
    formulation: '10% WP',
    category: 'fungicide',
    netWeight: '250 g',
  });

  // 5. Triazophos 40% EC
  await generateBottle({
    slug: 'triazophos-40-ec',
    name1: 'TRIAZOPHOS',
    name2: null,
    formulation: '40% EC',
    category: 'insecticide',
    volume: '1 Litre',
    baseName: 'quinalphos-25-ec.jpg',
  });

  // 6. Diclosulam 84% WDG
  await generatePouch({
    slug: 'diclosulam-84-wdg',
    name1: 'DICLOSULAM',
    name2: null,
    formulation: '84% WDG',
    category: 'herbicide',
    netWeight: '12.4 g',
  });

  // 7. Fluchloralin 45% EC
  await generateBottle({
    slug: 'fluchloralin-45-ec',
    name1: 'FLUCHLORALIN',
    name2: null,
    formulation: '45% EC',
    category: 'herbicide',
    volume: '1 Litre',
    baseName: 'butachlor-50-ec.jpg',
  });

  console.log('All 7 images successfully generated!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
