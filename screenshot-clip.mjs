import { createRequire } from 'module';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Owner/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotDir = join(__dirname, 'temporary screenshots');
if (!existsSync(screenshotDir)) mkdirSync(screenshotDir, { recursive: true });

const existing = readdirSync(screenshotDir).filter(f => f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Owner/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

// Screenshot 1: Top of page (nav + progress bar)
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: join(screenshotDir, `screenshot-${next}-nav.png`) });
console.log(`Saved: screenshot-${next}-nav.png`);

// Screenshot 2: Scroll halfway to show progress bar at ~50%
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: join(screenshotDir, `screenshot-${next+1}-progress50.png`) });
console.log(`Saved: screenshot-${next+1}-progress50.png`);

// Screenshot 3: CTA / Ready to Shine section
await page.evaluate(() => {
  const el = document.querySelector('.cta-banner');
  if (el) el.scrollIntoView({ block: 'center' });
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: join(screenshotDir, `screenshot-${next+2}-cta.png`) });
console.log(`Saved: screenshot-${next+2}-cta.png`);

// Screenshot 4: Instagram grid
await page.evaluate(() => {
  const el = document.querySelector('.ig-grid');
  if (el) el.scrollIntoView({ block: 'center' });
});
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: join(screenshotDir, `screenshot-${next+3}-instagram.png`) });
console.log(`Saved: screenshot-${next+3}-instagram.png`);

await browser.close();