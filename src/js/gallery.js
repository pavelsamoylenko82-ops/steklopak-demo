import { company } from '../data/company.js';

/** Лайтбокс галереи: крестик, фон, Esc. Фокус возвращается на плитку. */
export function initGallery() {
  const grid = document.getElementById('works-grid');
  const lightbox = document.getElementById('lightbox');
  if (!grid || !lightbox) return;

  const image = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const items = Array.from(grid.querySelectorAll('.work'));
  let lastFocused = null;

  const open = (index, trigger) => {
    const work = company.works[index];
    if (!work) return;
    lastFocused = trigger || document.activeElement;

    image.src = work.src;
    image.alt = work.alt;
    image.width = work.width;
    image.height = work.height;
    caption.textContent = `${work.caption} · ${work.tag}`;

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };

  items.forEach((item, index) => {
    item.addEventListener('click', () => open(index, item));
  });

  closeBtn.addEventListener('click', close);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
    if (event.key === 'Tab') {
      // Единственный интерактивный элемент внутри - кнопка закрытия.
      event.preventDefault();
      closeBtn.focus();
    }
  });
}
