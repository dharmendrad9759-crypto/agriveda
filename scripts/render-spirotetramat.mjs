import sharp from 'sharp';

async function main() {
  const textOverlay = Buffer.from(`
    <svg width="896" height="1200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="labelBg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f6f8fb" />
          <stop offset="30%" stop-color="#eff3f8" />
          <stop offset="70%" stop-color="#e7ecf3" />
          <stop offset="100%" stop-color="#d9e0ea" />
        </linearGradient>

        <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0a2550" />
          <stop offset="50%" stop-color="#071d42" />
          <stop offset="100%" stop-color="#041432" />
        </linearGradient>
      </defs>

      <!-- 1. Title Box Interior: perfectly filling between X=306 and X=599, Y=541 to 621 -->
      <rect x="306" y="541" width="293" height="80" fill="url(#labelBg)" />

      <!-- Title: SPIROTETRAMAT -->
      <text x="453" y="577" text-anchor="middle" fill="#08234d" font-family="'Arial Narrow', 'Franklin Gothic Medium', 'Impact', sans-serif" font-size="34" font-weight="900" letter-spacing="1.2">SPIROTETRAMAT</text>

      <!-- Formulation: 15.31% OD INSECTICIDE -->
      <text x="453" y="611" text-anchor="middle" fill="#0f172a" font-family="'Arial Narrow', 'Franklin Gothic Medium', 'Impact', sans-serif" font-size="24" font-weight="900" letter-spacing="0.6">15.31% OD INSECTICIDE</text>

      <!-- 2. Dark Blue Banner Interior: filling between X=305 and X=600, Y=622 to 674 -->
      <rect x="305" y="622" width="295" height="52" fill="url(#bannerBg)" />

      <text x="453" y="643" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" letter-spacing="0.3">Active Ingredient:</text>
      <text x="453" y="661" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="0.1">Spirotetramat 15.31% w/v OD - Oil Dispersion</text>

      <!-- 3. Group 23 (IRAC Mode of Action Group for Spirotetramat) -->
      <rect x="420" y="824" width="40" height="23" fill="#000000" />
      <text x="440" y="842" text-anchor="middle" fill="#ffffff" font-family="'Arial Narrow', 'Franklin Gothic Medium', sans-serif" font-size="16" font-weight="900">23</text>
    </svg>
  `);

  await sharp('public/images/chem/real/cyantraniliprole-10-od.jpg')
    .composite([{ input: textOverlay, blend: 'over' }])
    .jpeg({ quality: 96 })
    .toFile('public/images/chem/real/spirotetramat-15-od.jpg');

  console.log('Successfully rendered perfect seamless spirotetramat-15-od.jpg with Group 23');
}

main();
