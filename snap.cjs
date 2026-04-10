const puppeteer = require('C:/Users/Owner/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Owner/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: 'temporary screenshots/hero-zoom.png', clip: { x:0, y:0, width:1440, height:900 } });
  await page.screenshot({ path: 'temporary screenshots/gallery-zoom.png', clip: { x:950, y:300, width:490, height:600 } });
  await page.screenshot({ path: 'temporary screenshots/nav-zoom.png', clip: { x:0, y:0, width:1440, height:80 } });
  await browser.close();
  console.log('done');
})();
