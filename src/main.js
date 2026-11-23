import './style.css';
import {
  contacts,
  extras,
  header,
  hero,
  lightbox,
  process,
  production,
  quizShell,
  reviews,
  skipLink,
  works,
} from './js/render.js';
import { initHeader } from './js/header.js';
import { initQuiz } from './js/quiz.js';
import { initGallery } from './js/gallery.js';
import { initMotion, prefersReducedMotion } from './js/motion.js';

const app = document.getElementById('app');

if (app) {
  // Начальное скрытие для анимаций включаем только если движение разрешено.
  if (!prefersReducedMotion()) {
    document.documentElement.classList.add('js-motion');
  }

  app.innerHTML = [
    skipLink(),
    header(),
    '<main id="main">',
    hero(),
    production(),
    quizShell(),
    works(),
    extras(),
    process(),
    reviews(),
    '</main>',
    contacts(),
    lightbox(),
  ].join('');

  initHeader();
  initQuiz();
  initGallery();

  try {
    initMotion();
  } catch (error) {
    document.documentElement.classList.remove('js-motion');
    document
      .querySelectorAll('[data-reveal], [data-hero-fade], [data-hero-media], [data-bento]')
      .forEach((element) => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.clipPath = 'none';
      });
  }
}
