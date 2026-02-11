const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, 'assets', 'icon.svg');
const assetsDir = path.join(__dirname, 'assets');

async function generateIcons() {
  const svg = fs.readFileSync(svgPath);

  // Generate PNG icons at various sizes
  const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];

  for (const size of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(assetsDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  // Main icon.png (256px - used by Electron)
  await sharp(svg)
    .resize(256, 256)
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('Generated icon.png (256px)');

  // Generate .ico for Windows installer
  try {
    const { default: pngToIco } = require('png-to-ico');
    const icoBuffer = await pngToIco([path.join(assetsDir, 'icon-256.png')]);
    fs.writeFileSync(path.join(assetsDir, 'icon.ico'), icoBuffer);
    console.log('Generated icon.ico');
  } catch (e) {
    console.warn('Skipping .ico generation (install png-to-ico):', e.message);
  }

  console.log('Done! Icons generated in assets/');
}

generateIcons().catch(console.error);
