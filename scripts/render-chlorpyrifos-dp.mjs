import sharp from 'sharp';

async function main() {
  const textOverlay = Buffer.from(`
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Exact silver foil color sampled from the surrounding pouch surface -->
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#b6bac0" />
          <stop offset="35%" stop-color="#c5c9cf" />
          <stop offset="65%" stop-color="#d0d5dc" />
          <stop offset="100%" stop-color="#bcc1c7" />
        </linearGradient>
      </defs>

      <!-- 1. Clear interior of the main blue box -->
      <rect x="309" y="457" width="416" height="114" fill="url(#pouchBg)" />

      <!-- Chemical Name: CHLORPYRIFOS (bold condensed agro style) -->
      <text x="517" y="504" text-anchor="middle" fill="#061b3d" font-family="'Arial Narrow', 'Franklin Gothic Medium', 'Impact', sans-serif" font-size="45" font-weight="900" letter-spacing="1.2">CHLORPYRIFOS</text>

      <!-- Formulation: 1.5% DP -->
      <text x="517" y="553" text-anchor="middle" fill="#061b3d" font-family="'Arial Narrow', 'Franklin Gothic Medium', 'Impact', sans-serif" font-size="43" font-weight="900" letter-spacing="1">1.5% DP</text>

      <!-- 2. Subtitle Area below the box: cover down to Y=645 -->
      <rect x="290" y="574" width="454" height="72" fill="url(#pouchBg)" />

      <text x="517" y="604" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="900" letter-spacing="0.8">INSECTICIDE DUSTING POWDER (DP)</text>
      <text x="517" y="632" text-anchor="middle" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="800" letter-spacing="0.4">SOIL APPLICATION &amp; STEM BARRIER DUST</text>
    </svg>
  `);

  await sharp('public/images/chem/real/carbendazim-mancozeb-wp.jpg')
    .composite([{ input: textOverlay, blend: 'over' }])
    .jpeg({ quality: 96 })
    .toFile('public/images/chem/real/chlorpyrifos-1-5-dp.jpg');

  console.log('Successfully created authentic seamless chlorpyrifos-1-5-dp.jpg');
}

main();
