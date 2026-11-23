/** Секционные скриншоты для визуальной проверки: node tools/section-shot.mjs [url] */
import { chromium } from 'playwright';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173/';
const OUT = path.resolve('tools/shots/sections');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.8);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 300));
});

const ids = ['works', 'extra', 'process', 'reviews', 'contacts'];
for (const id of ids) {
  const locator = page.locator('#' + id);
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await locator.screenshot({ path: path.join(OUT, `sec-1440-${id}.png`) });
}
console.log('ok');
await browser.close();
