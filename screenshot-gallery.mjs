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
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

// Get the slider card's bounding rect from the page top
const rect = await page.evaluate(() => {
  const el = document.getElementById('bnaSlider');
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top + window.scrollY, width: r.width, height: r.height };
});

// Scroll so the slider is visible in viewport, then screenshot
await page.evaluate((y) => window.scrollTo(0, y - 200), rect.y);
await new Promise(r => setTimeout(r, 400));

const outPath = join(screenshotDir, `screenshot-${next}-slider-close.png`);
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();
console.log(`Saved: screenshot-${next}-slider-close.png | slider at x:${rect.x} y:${rect.y} ${rect.width}x${rect.height}`);
