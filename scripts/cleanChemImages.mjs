import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const REAL_DIR = 'public/images/chem/real';

async function cleanBifenthrin() {
  const file = path.join(REAL_DIR, 'bifenthrin-10-ec.jpg');
  console.log('Cleaning', file);

  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shoulderBlend" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#e3e4e6" stop-opacity="1.0"/>
          <stop offset="85%" stop-color="#e3e4e6" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#e3e4e6" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Hide shoulder FMC embossing -->
      <ellipse cx="506" cy="328" rx="95" ry="34" fill="url(#shoulderBlend)" />

      <!-- Clean label background covering red FMC logo and Talstar from left to right -->
      <rect x="366" y="370" width="272" height="118" fill="#ffffff" />

      <!-- High-end Category Banner in Insecticide Green -->
      <rect x="368" y="374" width="268" height="48" rx="8" fill="#15803d" />
      <text x="502" y="405" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="1.5">INSECTICIDE · कीटनाशक</text>

      <!-- Technical Grade badge -->
      <rect x="404" y="430" width="196" height="26" rx="13" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
      <text x="502" y="447" text-anchor="middle" fill="#334155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" letter-spacing="0.8">CIB&amp;RC TECHNICAL GRADE</text>

      <!-- Clean divider line above BIFENTHRIN -->
      <line x1="370" y1="468" x2="634" y2="468" stroke="#e2e8f0" stroke-width="1.5" />
    </svg>
  `;

  await sharp(file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(file + '.tmp');

  fs.renameSync(file + '.tmp', file);
  console.log('Done bifenthrin-10-ec.jpg');
}

async function cleanPyraclostrobin() {
  const file = path.join(REAL_DIR, 'pyraclostrobin-20-wg.jpg');
  console.log('Cleaning', file);

  // Dimensions: 896 x 1200
  // Top right orange box with BASF Headline is at x: 420 to 710, y: 242 to 306
  // Bottom line with BASF is x: 235 to 525, y: 918 to 948
  const svg = `
    <svg width="896" height="1200" xmlns="http://www.w3.org/2000/svg">
      <!-- Dark blue patch covering BASF Headline orange box, matching foil pouch dark blue -->
      <rect x="418" y="240" width="298" height="68" rx="8" fill="#1c3a6b" />

      <!-- High-tech WG formulation badge on top right -->
      <rect x="424" y="244" width="286" height="60" rx="8" fill="#1e40af" stroke="#60a5fa" stroke-width="1.5" />
      <text x="567" y="280" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" letter-spacing="1">WG FORMULATION · CIB&amp;RC</text>

      <!-- Clean bottom line over BASF -->
      <rect x="235" y="918" width="290" height="30" fill="#ffffff" />
      <text x="240" y="938" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700">Formulated for: CIB&amp;RC Approved Standard</text>
    </svg>
  `;

  await sharp(file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(file + '.tmp');

  fs.renameSync(file + '.tmp', file);
  console.log('Done pyraclostrobin-20-wg.jpg');
}

async function cleanPyroxasulfone() {
  const file = path.join(REAL_DIR, 'pyroxasulfone-85-wg.jpg');
  console.log('Cleaning', file);

  // Dimensions: 1024 x 1024
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <!-- Clean top-left logo area to pure white and add elegant category pill -->
      <rect x="306" y="260" width="125" height="60" fill="#ffffff" />
      <rect x="312" y="270" width="112" height="28" rx="14" fill="#ea580c" />
      <text x="368" y="289" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" letter-spacing="0.8">HERBICIDE</text>

      <!-- Replace red banner with clean technical description banner -->
      <rect x="306" y="418" width="414" height="38" fill="#991b1b" />
      <text x="513" y="443" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" letter-spacing="1.2">SELECTIVE PRE-EMERGENCE HERBICIDE</text>

      <!-- Clean bottom manufacturer strip -->
      <rect x="306" y="816" width="414" height="34" fill="#047857" />
      <text x="513" y="838" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" letter-spacing="0.8">100% GENUINE TECHNICAL GRADE · GOVT. CIB&amp;RC APPROVED</text>
    </svg>
  `;

  await sharp(file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(file + '.tmp');

  fs.renameSync(file + '.tmp', file);
  console.log('Done pyroxasulfone-85-wg.jpg');
}

async function cleanImidaclopridLambdaCombo() {
  const file = path.join(REAL_DIR, 'imidacloprid-lambda-combo.jpg');
  console.log('Cleaning', file);

  // Dimensions: 1024 x 1024
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <!-- Left Bottle: clean (CONFIDOR) without clipping IMIDACLOPRID above -->
      <rect x="210" y="450" width="205" height="36" fill="#ffffff" />
      <rect x="220" y="453" width="185" height="28" rx="14" fill="#f0fdf4" stroke="#86efac" stroke-width="1.2"/>
      <text x="312" y="471" text-anchor="middle" fill="#15803d" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" letter-spacing="0.8">SYSTEMIC INSECTICIDE</text>

      <!-- Right Bottle: clean (KARATE) without clipping LAMBDA-CYHALOTHRIN above -->
      <rect x="600" y="450" width="195" height="36" fill="#ffffff" />
      <rect x="610" y="453" width="175" height="28" rx="14" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.2"/>
      <text x="697" y="471" text-anchor="middle" fill="#1d4ed8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" letter-spacing="0.8">CONTACT INSECTICIDE</text>

      <!-- Clean bottom manufacturer lines on both bottles -->
      <rect x="180" y="745" width="185" height="45" fill="#ffffff" />
      <rect x="195" y="756" width="155" height="26" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="272" y="773" text-anchor="middle" fill="#334155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800">CIB&amp;RC REGISTERED</text>

      <rect x="565" y="755" width="185" height="45" fill="#ffffff" />
      <rect x="580" y="766" width="155" height="26" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="657" y="783" text-anchor="middle" fill="#334155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800">CIB&amp;RC REGISTERED</text>
    </svg>
  `;

  await sharp(file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(file + '.tmp');

  fs.renameSync(file + '.tmp', file);
  console.log('Done imidacloprid-lambda-combo.jpg');
}

async function cleanMineralOil() {
  const file = path.join(REAL_DIR, 'mineral-oil.jpg');
  console.log('Cleaning', file);

  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <!-- White patch over Banole -->
      <rect x="365" y="480" width="305" height="36" fill="#ffffff" />
      <text x="517" y="504" text-anchor="middle" fill="#1e3a8a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="800" letter-spacing="0.5">AGRICULTURAL SPRAY OIL / ADJUVANT</text>
    </svg>
  `;

  await sharp(file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(file + '.tmp');

  fs.renameSync(file + '.tmp', file);
  console.log('Done mineral-oil.jpg');
}

async function cleanProfenofosCypermethrin() {
  const file = path.join(REAL_DIR, 'profenofos-40-cypermethrin-4-ec.jpg');
  console.log('Cleaning', file);

  // Exact label color sampled: rgb(214, 215, 219) = #d6d7db
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <!-- Cover AGRICHEM logo and text with exact color-matched patch -->
      <rect x="390" y="360" width="230" height="51" fill="#d6d7db" />

      <!-- Seamlessly replace PROFECT SUPER blue box with elegant category banner -->
      <rect x="348" y="411" width="310" height="135" fill="#0f2942" />
      <rect x="354" y="416" width="298" height="38" rx="6" fill="#15803d" />
      <text x="503" y="442" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="900" letter-spacing="1.5">INSECTICIDE · कीटनाशक</text>

      <text x="503" y="484" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="0.8">TECHNICAL FORMULATION</text>
      <text x="503" y="516" text-anchor="middle" fill="#93c5fd" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="800" letter-spacing="1">ORGANOPHOSPHATE + PYRETHROID</text>

      <!-- Bottom manufacturer line with exact color matching -->
      <rect x="348" y="756" width="115" height="40" fill="#d6d7db" />
      <text x="362" y="776" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800">CIB&amp;RC Regd.</text>
    </svg>
  `;

  await sharp(file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(file + '.tmp');

  fs.renameSync(file + '.tmp', file);

  // Also copy to duplicate profenofos-cypermethrin-ec.jpg
  const duplicate = path.join(REAL_DIR, 'profenofos-cypermethrin-ec.jpg');
  fs.copyFileSync(file, duplicate);
  console.log('Done profenofos-40-cypermethrin-4-ec.jpg and duplicate');
}

async function convertMancozebToPouch() {
  const template = path.join(REAL_DIR, 'chlorothalonil-75-wp.jpg');
  const target = path.join(REAL_DIR, 'mancozeb-75-wp.jpg');
  console.log('Transforming Mancozeb 75% WP to authentic market foil pouch packet');

  // Label width: x from 288 to 734
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <!-- Seamless color-matched label panel (exact #fdfdfd matching chlorothalonil pouch) -->
      <rect x="288" y="278" width="446" height="142" fill="#fcfcfd" />

      <!-- Bold, authentic agro typography -->
      <text x="511" y="342" text-anchor="middle" fill="#0f2942" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="1.5">MANCOZEB</text>
      <text x="511" y="396" text-anchor="middle" fill="#0f2942" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" letter-spacing="2">75% WP</text>
    </svg>
  `;

  await sharp(template)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(target + '.tmp');

  fs.renameSync(target + '.tmp', target);
  console.log('Done transforming mancozeb-75-wp.jpg to foil pouch!');
}

async function main() {
  await cleanBifenthrin();
  await cleanPyraclostrobin();
  await cleanPyroxasulfone();
  await cleanImidaclopridLambdaCombo();
  await cleanMineralOil();
  await cleanProfenofosCypermethrin();
  await convertMancozebToPouch();
  console.log('ALL CHEMICAL IMAGES FULLY POLISHED & MARKET-AUTHENTIC!');
}

main().catch(console.error);
