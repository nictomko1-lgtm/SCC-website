// Re-compresses brand_assets images in-place for ~25% smaller file sizes.
// Targets: all .webp files + small review/logo PNGs actually served by the browser.
// Skips giant source PNGs (beforeslider.png, etc.) — they are webp fallbacks only.

import sharp from 'sharp';
import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';

const DIR = './brand_assets';

// PNGs that are actually served (avatars, logo). Skip giant source PNGs.
const SERVE_PNGS = new Set([
  'review1.png','review2.png','review3.png','review4.png','review5.png','review6.png',
  'review1-32.png','review1-64.png',
  'review2-32.png','review2-64.png',
  'review3-32.png','review3-64.png',
  'review4-32.png','review4-64.png',
  'review5-32.png','review5-64.png',
  'review6-32.png','review6-64.png',
  'SCClogo-transparent.png','logo-export.png',
]);

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath);
  const originalSize = (await stat(filePath)).size;

  try {
    const inputBuf = await readFile(filePath);
    const img = sharp(inputBuf);
    const meta = await img.metadata();

    let buf;
    if (ext === '.webp') {
      buf = await img.webp({ quality: 65, effort: 6 }).toBuffer();
    } else if (ext === '.png') {
      if (meta.width <= 128) {
        buf = await img.png({ compressionLevel: 9, palette: true, quality: 75 }).toBuffer();
      } else {
        buf = await img.png({ compressionLevel: 9 }).toBuffer();
      }
    }

    const newSize = buf.length;
    const pct = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    if (newSize < originalSize) {
      await writeFile(filePath, buf);
      return { name, before: originalSize, after: newSize, pct: parseFloat(pct) };
    } else {
      return { name, before: originalSize, after: originalSize, pct: 0, skipped: true };
    }
  } catch (err) {
    return { name, error: err.message };
  }
}

const all = await readdir(DIR);
const targets = all.filter(f => {
  const ext = extname(f).toLowerCase();
  if (ext === '.webp') return true;
  if (ext === '.png' && SERVE_PNGS.has(f)) return true;
  return false;
}).map(f => join(DIR, f));

console.log(`Compressing ${targets.length} files...\n`);

let totalBefore = 0, totalAfter = 0;
const results = [];

for (const t of targets) {
  const r = await compress(t);
  results.push(r);
  if (r.error) {
    console.log(`✗ ${r.name}: ${r.error}`);
  } else if (r.skipped) {
    console.log(`- ${r.name.padEnd(36)} already optimal`);
  } else {
    const bar = '█'.repeat(Math.round(r.pct / 5));
    console.log(`✓ ${r.name.padEnd(36)} ${(r.before/1024).toFixed(0).padStart(6)}KB → ${(r.after/1024).toFixed(0).padStart(6)}KB  -${r.pct}%  ${bar}`);
  }
  totalBefore += r.before || 0;
  totalAfter += r.after || 0;
}

const totalPct = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1);
console.log(`\n${'─'.repeat(70)}`);
console.log(`Total: ${(totalBefore/1024).toFixed(0)}KB → ${(totalAfter/1024).toFixed(0)}KB  (${totalPct}% reduction, saved ${((totalBefore-totalAfter)/1024).toFixed(0)}KB)`);
