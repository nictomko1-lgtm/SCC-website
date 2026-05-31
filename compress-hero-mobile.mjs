import sharp from 'sharp';

const src = 'brand_assets/DSC01254 BLURRED.jpg';
const out = 'brand_assets/DSC01254-BLURRED-mobile.webp';

const info = await sharp(src)
  .resize({ width: 480, withoutEnlargement: true })
  .webp({ quality: 75 })
  .toFile(out);

const { size: inSize } = await import('fs').then(m => m.promises.stat(src));
console.log(`${src} → ${out}`);
console.log(`${(inSize/1024/1024).toFixed(1)}MB → ${(info.size/1024).toFixed(0)}KB`);
