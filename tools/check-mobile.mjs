/**
 * Мобильные проверки: 320px без переполнения, бургер-меню открывается и закрывается,
 * переход по якорю прокручивает страницу. Запуск: node tools/check-mobile.mjs [url]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4173/';
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 320, height: 720 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: 'tools/shots/hero-320.png' });

const widths = await page.evaluate(() => [
  document.documentElement.scrollWidth,
  document.documentElement.clientWidth,
]);

await page.locator('#menu-toggle').click();
await page.waitForTimeout(400);
const menuOpen = await page.locator('#mobile-menu').evaluate((el) => el.classList.contains('is-open'));
const expanded = await page.locator('#menu-toggle').getAttribute('aria-expanded');
await page.screenshot({ path: 'tools/shots/menu-320.png' });

await page.locator('#mobile-menu a[href="#works"]').click();
await page.waitForTimeout(800);
const menuClosed = await page.locator('#mobile-menu').evaluate((el) => !el.classList.contains('is-open'));
const scrolled = await page.evaluate(() => Math.round(window.scrollY));

const result = { widths, menuOpen, expanded, menuClosed, scrolled, errors };
console.log(JSON.stringify(result, null, 2));

if (widths[0] !== widths[1] || !menuOpen || expanded !== 'true' || !menuClosed || scrolled < 1000 || errors.length) {
  process.exitCode = 1;
}

await browser.close();
