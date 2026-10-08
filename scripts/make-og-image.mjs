// Generates public/og-image.png (1200×630). Run with `npm run og` and commit the result.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
const palette = ['#7a9e7e', '#e3a83b', '#c7643f', '#e8dcc4', '#4f6d7a'];

const size = 96;
const gap = 14;
const cols = 4;
const rows = 4;
const originX = 1200 - 80 - cols * size - (cols - 1) * gap;
const originY = (630 - rows * size - (rows - 1) * gap) / 2;

let squares = '';
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const fill = palette[(r * 2 + c * 3) % palette.length];
    squares += `<rect x="${originX + c * (size + gap)}" y="${originY + r * (size + gap)}" width="${size}" height="${size}" rx="14" fill="${fill}"/>`;
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fbf7ef"/>
  ${squares}
  <text x="80" y="290" font-family="Bricolage Grotesque, Segoe UI, Helvetica, Arial, sans-serif" font-size="76" font-weight="800" fill="#23302a" letter-spacing="-2">worklight</text>
  <text x="80" y="370" font-family="Bricolage Grotesque, Segoe UI, Helvetica, Arial, sans-serif" font-size="76" font-weight="800" fill="#23302a" letter-spacing="-2">commons</text>
  <text x="80" y="440" font-family="Bricolage Grotesque, Segoe UI, Helvetica, Arial, sans-serif" font-size="30" fill="#4b5a52">Apps and systems, built together.</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`wrote ${out}`);
