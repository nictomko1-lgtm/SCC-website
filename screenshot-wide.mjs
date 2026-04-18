import { createRequire } from 'module';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Owner/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');
const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotDir = join(__dirname, 'temporary screenshots');
if (!existsSync(screenshotDir)) mkdirSync(screenshotDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Owner/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({width: 1440, height: 820});
await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
await page.screenshot({path: join(screenshotDir, 'hero-wide.png'), clip: {x:0, y:0, width:1440, height:820}});
await browser.close();
console.log('Saved hero-wide.png');
