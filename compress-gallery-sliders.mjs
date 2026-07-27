import sharp from 'sharp';
import { existsSync } from 'fs';
import { join } from 'path';

const dir = 'brand_assets';
const WIDTHS = [480, 831];
const DEFAULT_WIDTH = 1080;
const QUALITY = 78;

const jobs = [
  { in: 'beforeslider.png',         base: 'beforeslider' },
  { in: 'afterslider.png',          base: 'afterslider' },
  { in: 'doghairbefore.png',        base: 'doghairbefore' },
  { in: 'doghairafter (2).png',     base: 'doghairafter' },
  { in: 'seatstainbefore.png',      base: 'seatstainbefore' },
  { in: 'seatstainafter.png',       base: 'seatstainafter' },
  { in: 'headlightrestobefore.png', base: 'headlightrestobefore' },
  { in: 'headlightrestoafter.png',  base: 'headlightrestoafter' },
  { in: 'disasterbefore.png',       base: 'disasterbefore' },
  { in: 'disasterafter.png',        base: 'disasterafter' },
];

for (const job of jobs) {
  const inPath = join(dir, job.in);
  if (!existsSync(inPath)) { console.log(`SKIP (missing): ${job.in}`); continue; }
  const meta = await sharp(inPath).metadata();

  for (const w of [...WIDTHS, DEFAULT_WIDTH]) {
    const outName = w === DEFAULT_WIDTH ? `${job.base}.webp` : `${job.base}-${w}.webp`;
    const outPath = join(dir, outName);
    const resizeWidth = Math.min(w, meta.width);
    const info = await sharp(inPath)
      .resize({ width: resizeWidth, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);
    const outMeta = await sharp(outPath).metadata();
    console.log(`${job.in} -> ${outName}  ${outMeta.width}x${outMeta.height}  ${(info.size/1024).toFixed(0)}KB`);
  }
}
