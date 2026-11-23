import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:4180/steklopak-demo/';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
const failed = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('requestfailed', (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const info = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.innerText,
  stylesheet: Array.from(document.styleSheets).map((s) => s.href),
  images: Array.from(document.images).map((i) => [i.getAttribute('src'), i.naturalWidth]),
  fontFamily: getComputedStyle(document.body).fontFamily,
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));

console.log(JSON.stringify({ info, errors, failed }, null, 2));
await page.screenshot({ path: 'tools/shots/subpath-1440.png' });
await browser.close();
