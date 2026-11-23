/**
 * Playwright-проверка собранного лендинга в режиме эмуляции устройств.
 * Запуск: node tools/check.mjs [baseUrl]
 */
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:4173/';
const OUT = path.resolve('tools/shots');
mkdirSync(OUT, { recursive: true });

const results = {
  base: BASE,
  consoleErrors: [],
  pageErrors: [],
  images: {},
  overflow: {},
  textChecks: {},
  quiz: {},
  lightbox: {},
  targets: {},
  screenshots: [],
};

const devicesList = [
  {
    name: '360',
    context: {
      viewport: { width: 360, height: 780 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (Linux; Android 11; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    },
  },
  {
    name: '390',
    context: { ...devices['iPhone 13'] },
  },
  {
    name: '1440',
    context: {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
  },
];

const shot = async (page, name, options = {}) => {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, ...options });
  results.screenshots.push(file);
};

const collectText = async (page) => page.evaluate(() => document.body.innerText);

const checkOverflow = async (page) =>
  page.evaluate(() => {
    const doc = document.documentElement;
    const offenders = [];
    document.querySelectorAll('body *').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (rect.right > doc.clientWidth + 1.5 || rect.left < -1.5) {
        const style = getComputedStyle(el);
        if (style.position === 'fixed' || style.visibility === 'hidden') return;
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className).slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        });
      }
    });
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      offenders: offenders.slice(0, 8),
    };
  });

const checkImages = async (page) =>
  page.evaluate(() =>
    Array.from(document.images).map((img) => ({
      src: img.currentSrc || img.getAttribute('src'),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      loading: img.loading,
      hasDims: Boolean(img.getAttribute('width') && img.getAttribute('height')),
      alt: img.alt,
    })),
  );

const checkTargets = async (page) =>
  page.evaluate(() => {
    const small = [];
    document.querySelectorAll('a, button, input, [role="button"]').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none' || rect.width === 0) return;
      if (rect.height < 43.5) {
        small.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
          h: Math.round(rect.height),
        });
      }
    });
    return { small: small.slice(0, 15), total: small.length };
  });

const checkFonts = async (page) =>
  page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const h1 = document.querySelector('h1');
    return {
      bodyFont: body.fontFamily,
      bodySize: body.fontSize,
      h1Font: h1 ? getComputedStyle(h1).fontFamily : null,
      h1Size: h1 ? getComputedStyle(h1).fontSize : null,
      fontsReady: document.fonts
        ? Array.from(document.fonts).map((f) => `${f.family}:${f.status}`).slice(0, 6)
        : [],
      manropeLoaded: document.fonts ? document.fonts.check('700 32px Manrope') : null,
      golosLoaded: document.fonts ? document.fonts.check('400 16px "Golos Text"') : null,
    };
  });

const browser = await chromium.launch();

try {
  for (const device of devicesList) {
    const context = await browser.newContext(device.context);
    const page = await context.newPage();
    const errors = [];
    const pageErrors = [];

    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(String(error)));

    await page.goto(BASE, { waitUntil: 'networkidle' });
    // Плавный скролл отключаем только в проверке: иначе шаги прогона не успевают
    // пройти страницу целиком и секции остаются нераскрытыми на скриншотах.
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
    await page.waitForTimeout(600);

    // Скролл по всей странице, чтобы подгрузились lazy-изображения и сработали появления.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.7);
      const height = document.body.scrollHeight;
      for (let y = 0; y <= height; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      window.scrollTo(0, height);
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 700));
    });
    await page.waitForLoadState('networkidle');

    results.consoleErrors.push(...errors);
    results.pageErrors.push(...pageErrors);
    results.images[device.name] = await checkImages(page);
    results.overflow[device.name] = await checkOverflow(page);
    results.targets[device.name] = await checkTargets(page);

    if (device.name === '360' || device.name === '390') {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await shot(page, `hero-${device.name}`, { fullPage: false });
    }

    if (device.name === '360') {
      await shot(page, 'full-360', { fullPage: true });
      results.textChecks['360'] = await collectText(page);
      for (const id of ['production', 'quiz', 'works', 'extra', 'process', 'reviews', 'contacts']) {
        const section = page.locator('#' + id);
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        await shot(page, 'sec-360-' + id, { fullPage: false });
      }
    }

    if (device.name === '1440') {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await shot(page, 'hero-1440', { fullPage: false });
      await shot(page, 'full-1440', { fullPage: true });
      await page.locator('#contacts').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await shot(page, 'contacts-1440', { fullPage: false });
      results.fonts = await checkFonts(page);
      results.textChecks['1440'] = await collectText(page);

      // --- Опросник: 4 шага до финального экрана ---
      const quiz = {};
      await page.locator('#quiz').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await shot(page, 'quiz-step1-1440', { fullPage: false });

      await page.locator('[data-product="window"]').click();
      quiz.step1Selected = await page
        .locator('[data-product="window"]')
        .getAttribute('aria-pressed');
      quiz.counter1 = await page.locator('#quiz-counter').innerText();
      await page.locator('[data-next]').click();
      await page.waitForTimeout(250);
      quiz.counter2 = await page.locator('#quiz-counter').innerText();

      await page.locator('#quiz-width').fill('1300');
      await page.locator('#quiz-height').fill('1400');
      await page.locator('[data-next]').click();
      await page.waitForTimeout(250);
      quiz.counter3 = await page.locator('#quiz-counter').innerText();

      await page.locator('[data-work="montage"]').click();
      await page.locator('[data-work="slopes"]').click();
      await page.locator('[data-next]').click();
      await page.waitForTimeout(250);
      quiz.counter4 = await page.locator('#quiz-counter').innerText();

      // Проверка валидации: пустая отправка не должна проходить.
      await page.locator('[data-next]').click();
      await page.waitForTimeout(200);
      quiz.emptySubmitBlocked = (await page.locator('[data-error="phone"]').innerText()).length > 0;

      await page.locator('[data-region="Минская"]').click();
      await page.locator('[data-field="city"]').fill('Молодечно');
      await page.locator('[data-field="name"]').fill('Павел');
      await page.locator('#quiz-phone').click();
      await page.keyboard.type('291234567', { delay: 25 });
      quiz.phoneValue = await page.locator('#quiz-phone').inputValue();
      await shot(page, 'quiz-step4-1440', { fullPage: false });
      await page.locator('[data-next]').click();
      await page.waitForTimeout(400);
      quiz.finalHeading = await page.locator('#quiz-panel .quiz-question').innerText();
      quiz.finalText = await page.locator('#quiz-panel').innerText();
      quiz.counterFinal = await page.locator('#quiz-counter').innerText();
      await page.locator('#quiz-panel').scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await shot(page, 'quiz-final-1440', { fullPage: false });

      // Сброс возвращает на шаг 1.
      await page.locator('[data-reset]').click();
      await page.waitForTimeout(250);
      quiz.afterReset = await page.locator('#quiz-counter').innerText();
      results.quiz = quiz;

      // --- Лайтбокс ---
      await page.locator('#works').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.locator('.work').first().click();
      await page.waitForTimeout(400);
      results.lightbox.open = await page.locator('#lightbox').getAttribute('aria-hidden');
      results.lightbox.image = await page.locator('#lightbox-img').evaluate((img) => ({
        src: img.getAttribute('src'),
        naturalWidth: img.naturalWidth,
      }));
      await shot(page, 'lightbox-1440', { fullPage: false });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(350);
      results.lightbox.closed = await page.locator('#lightbox').getAttribute('aria-hidden');
    }

    await context.close();
  }

  // --- Дополнительные ширины: проверяем только переполнение и размеры целей ---
  for (const width of [320, 768, 1024, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    results.overflow[String(width)] = await checkOverflow(page);
    results.targets[String(width)] = await checkTargets(page);
    await context.close();
  }

  // --- Текстовые проверки по собранной странице ---
  const text = `${results.textChecks['360'] || ''}\n${results.textChecks['1440'] || ''}`;
  const patterns = {
    longDash: /—/,
    lorem: /lorem/i,
    todo: /TODO/,
    stub: /заглушка/i,
    demo: /демо/i,
    priceWord: /руб|BYN|USD|EUR|€|\$|цена от/i,
    interFont: /\bInter\b/,
    emoji: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
  };
  const textChecks = {};
  for (const [key, regex] of Object.entries(patterns)) {
    const match = String(text).match(regex);
    textChecks[key] = match ? `НАЙДЕНО: ${String(match[0]).slice(0, 60)}` : 'нет';
  }
  textChecks.metaRobots = await (async () => {
    const page = await browser.newPage();
    await page.goto(BASE);
    const value = await page.locator('meta[name="robots"]').getAttribute('content');
    await page.close();
    return value;
  })();
  textChecks.quizFinalHasNote = /В боевой версии сайта/.test(results.quiz.finalText || '') ? 'да' : 'нет';
  results.text = textChecks;
} finally {
  await browser.close();
}

writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(results, null, 2), 'utf8');

console.log('=== CONSOLE ERRORS ===');
console.log(JSON.stringify(results.consoleErrors, null, 2));
console.log('=== PAGE ERRORS ===');
console.log(JSON.stringify(results.pageErrors, null, 2));
console.log('=== OVERFLOW ===');
console.log(JSON.stringify(results.overflow, null, 2));
console.log('=== IMAGES ===');
for (const [device, images] of Object.entries(results.images)) {
  const broken = images.filter((img) => !img.complete || img.naturalWidth === 0);
  const noDims = images.filter((img) => !img.hasDims);
  console.log(device, `всего ${images.length}, битых ${broken.length}, без width/height ${noDims.length}`);
  if (broken.length) console.log(JSON.stringify(broken, null, 2));
}
console.log('=== TARGETS ===');
console.log(JSON.stringify(results.targets, null, 2));
console.log('=== FONTS ===');
console.log(JSON.stringify(results.fonts || {}, null, 2));
console.log('=== TEXT ===');
console.log(JSON.stringify(results.text, null, 2));
console.log('=== QUIZ ===');
console.log(JSON.stringify(results.quiz, null, 2));
console.log('=== LIGHTBOX ===');
console.log(JSON.stringify(results.lightbox, null, 2));
console.log('=== SHOTS ===');
console.log(results.screenshots.join('\n'));
