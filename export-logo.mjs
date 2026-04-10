import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Owner/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 3 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

const logo = await page.$('.nav-home');
await logo.screenshot({ path: 'logo-export.png', omitBackground: true });

await browser.close();
console.log('Saved: logo-export.png');