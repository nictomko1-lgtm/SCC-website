import sharp from 'sharp';
import { existsSync } from 'fs';
import { join } from 'path';

const dir = 'brand_assets';

const images = [
  // Hero LCP — resize to 2400px wide (portrait crop used at ~70% viewport width on desktop)
  { in: 'DSC01254 BLURRED.jpg',  out: 'DSC01254-BLURRED.webp',  width: 2400, quality: 82 },
  // Gallery images — displayed at max ~600px wide in 3-up carousel
  { in: 'DSC_6008.JPEG',         out: 'DSC_6008.webp',          width: 1600, quality: 80 },
  { in: 'DSC_6083.JPEG',         out: 'DSC_6083.webp',          width: 1600, quality: 80 },
  { in: 'DSC01280.JPEG',         out: 'DSC01280.webp',          width: 1600, quality: 80 },
  { in: 'DSC01327 (1).jpg',      out: 'DSC01327.webp',          width: 1600, quality: 80 },
  { in: 'DSC01191 (1).jpg',      out: 'DSC01191.webp',          width: 1600, quality: 80 },
  { in: 'IMG_9688.JPEG',         out: 'IMG_9688.webp',          width: 1200, quality: 80 },
  { in: '8.PNG',                 out: '8.webp',                 width: 1600, quality: 80 },
  // Why Us section — displayed at full container width ~1440px
  { in: 'LBWRX7-88.jpg',        out: 'LBWRX7-88.webp',        width: 1800, quality: 80 },
  // Contact form image — displayed at ~500px wide
  { in: 'IMG_6197.jpg',          out: 'IMG_6197.webp',          width: 900,  quality: 80 },
  // Review card before/after thumbnails — displayed at ~130px wide in mobile carousel
  { in: 'dirtyreview.png',       out: 'dirtyreview.webp',       width: 300,  quality: 78 },
  { in: 'cleanreview.png',       out: 'cleanreview.webp',       width: 300,  quality: 78 },
  // Pet hair removal before/after slider — displayed at max ~600px wide in 3-up carousel
  { in: 'doghairbefore.png',     out: 'doghairbefore.webp',     width: 1600, quality: 80 },
  { in: 'doghairafter (2).png',  out: 'doghairafter.webp',      width: 1600, quality: 80 },
  // Headlight restoration before/after slider — displayed at max ~600px wide in 3-up carousel
  { in: 'headlightrestobefore.png', out: 'headlightrestobefore.webp', width: 1600, quality: 80 },
  { in: 'headlightrestoafter.png',  out: 'headlightrestoafter.webp',  width: 1600, quality: 80 },
];

let totalSaved = 0;

for (const img of images) {
  const inPath  = join(dir, img.in);
  const outPath = join(dir, img.out);
  if (!existsSync(inPath)) { console.log(`SKIP (missing): ${img.in}`); continue; }

  const meta = await sharp(inPath).metadata();
  const resizeWidth = Math.min(img.width, meta.width);

  const info = await sharp(inPath)
    .resize({ width: resizeWidth, withoutEnlargement: true })
    .webp({ quality: img.quality })
    .toFile(outPath);

  const { size: inSize } = await import('fs').then(m => m.promises.stat(inPath));
  const saved = inSize - info.size;
  totalSaved += saved;
  const pct = ((saved / inSize) * 100).toFixed(0);
  console.log(`${img.in.padEnd(28)} → ${img.out.padEnd(24)} ${(inSize/1024/1024).toFixed(1)}MB → ${(info.size/1024/1024).toFixed(2)}MB  (-${pct}%)`);
}

console.log(`\nTotal saved: ${(totalSaved/1024/1024).toFixed(1)} MB`);
