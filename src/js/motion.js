/**
 * Слой анимаций: GSAP + ScrollTrigger + Lenis (только десктоп).
 * Двигаем лишь transform / opacity / clip-path, кадры не крутим в 3D.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const REVEAL_START = 'top 86%';

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Плавный скролл только там, где есть колесо и широкий экран: тач оставляем нативным. */
function smoothScrollAllowed() {
  if (prefersReducedMotion()) return false;
  return window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
}

/**
 * Lenis: инерция колеса на десктопе, синхронизация с тикером GSAP и ScrollTrigger.
 * Возвращает экземпляр или null, если плавный скролл выключен.
 */
function initSmoothScroll() {
  if (!smoothScrollAllowed()) return null;

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.4,
    wheelMultiplier: 0.9,
    autoRaf: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Якоря шапки и кнопки «Рассчитать»: плавно, с отступом под липкую шапку.
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    // Отступ под липкую шапку Lenis берёт из CSS scroll-padding-top на html.
    lenis.scrollTo(target, { duration: 1.05 });
    window.history.replaceState(null, '', hash);

    if (link.classList.contains('skip-link')) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  // Лайтбокс вешает body.no-scroll: пока он открыт, инерция стоит.
  const syncLock = () => {
    if (document.body.classList.contains('no-scroll')) lenis.stop();
    else lenis.start();
  };
  new MutationObserver(syncLock).observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
  });
  syncLock();

  return lenis;
}

/**
 * Первый экран: левый столбец появляется со stagger, фото раскрывается маской
 * clip-path внутри ровной рамки rounded-3xl, картинка мягко доезжает.
 */
function initHero() {
  const media = document.querySelector('[data-hero-media]');
  const photo = document.querySelector('[data-hero-photo]');
  const photoWrap = document.querySelector('[data-hero-photo-wrap]');
  const caption = document.querySelector('[data-hero-caption]');
  const items = gsap.utils.toArray('[data-hero-fade]');

  if (items.length) {
    gsap.set(items, { y: 22, opacity: 0 });
  }
  if (media) {
    gsap.set(media, { clipPath: 'inset(0 0 100% 0 round 24px)' });
  }

  if (photo) {
    gsap.set(photo, { scale: 1.12 });
  }
  if (caption) {
    gsap.set(caption, { opacity: 0, y: 10 });
  }

  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });

  if (items.length) {
    intro.to(
      items,
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.07, clearProps: 'transform,opacity' },
      0,
    );
  }

  if (media) {
    intro.to(
      media,
      {
        clipPath: 'inset(0 0 0% 0 round 24px)',
        duration: 0.8,
        clearProps: 'clipPath',
      },
      0,
    );
  }

  if (photo) {
    intro.to(photo, { scale: 1.02, duration: 1, ease: 'expo.out' }, 0);
  }

  if (caption) {
    intro.to(
      caption,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      },
      0.3,
    );
  }

  // Маску раскрываем, когда кадр уже готов, но ждём не дольше 400 мс.
  const startIntro = () => intro.play();
  if (photo && !photo.complete) {
    const timer = window.setTimeout(startIntro, 400);
    const run = () => {
      window.clearTimeout(timer);
      startIntro();
    };
    photo.addEventListener('load', run, { once: true });
    photo.addEventListener('error', run, { once: true });
  } else {
    startIntro();
  }

  // Скролл: окно не поворачивается, кадр едет внутри своей рамки.
  if (media && photoWrap) {
    gsap.fromTo(
      photoWrap,
      { yPercent: -4, scale: 1.02 },
      {
        yPercent: 6,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: media, start: 'top top', end: 'bottom top', scrub: 0.6 },
      },
    );
  }
}

/** Тёмный блок производства: параллакс кадра линии и поочерёдные bento-карточки. */
function initProduction() {
  const media = document.querySelector('[data-production-media]');
  if (media) {
    gsap.fromTo(
      media,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      },
    );
  }

  const cards = gsap.utils.toArray('[data-bento]');
  const grid = cards.length ? cards[0].parentElement : null;
  if (!cards.length || !grid) return;

  gsap.fromTo(
    cards,
    { y: 24, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: grid, start: REVEAL_START, once: true },
    },
  );
}

/** Появление секций и карточек на входе в экран: один раз, короткий stagger. */
function initScrollReveal() {
  const items = gsap.utils.toArray('[data-reveal]');
  if (!items.length) return null;

  gsap.set(items, { y: 24, opacity: 0 });

  const show = (batch) => {
    batch.forEach((element) => {
      element.dataset.revealed = '1';
    });
    gsap.to(batch, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      overwrite: true,
      clearProps: 'transform,opacity',
    });
  };

  ScrollTrigger.batch(items, {
    start: REVEAL_START,
    once: true,
    interval: 0.08,
    onEnter: show,
  });

  /**
   * Страховка: якорь или резкий рывок колеса может перескочить старт триггера.
   * Такие элементы показываем сразу, чтобы они не остались прозрачными.
   */
  const sweep = () => {
    const limit = window.innerHeight * 0.6;
    const missed = items.filter(
      (element) => !element.dataset.revealed && element.getBoundingClientRect().top < limit,
    );
    if (!missed.length) return;
    missed.forEach((element) => {
      element.dataset.revealed = '1';
    });
    gsap.set(missed, { y: 0, opacity: 1, clearProps: 'transform,opacity' });
  };

  let timer = 0;
  window.addEventListener(
    'scroll',
    () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(sweep, 160);
    },
    { passive: true },
  );

  return { sweep };
}

export function initMotion() {
  if (prefersReducedMotion()) {
    document.documentElement.classList.remove('js-motion');
    return;
  }

  initSmoothScroll();
  const reveal = initScrollReveal();
  initHero();
  initProduction();

  ScrollTrigger.refresh();

  const refresh = () => {
    ScrollTrigger.refresh();
    if (reveal) reveal.sweep();
  };

  window.addEventListener('load', refresh, { once: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}
