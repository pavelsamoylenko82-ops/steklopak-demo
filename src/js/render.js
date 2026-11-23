import { company } from '../data/company.js';
import {
  arrowIcon,
  burgerIcon,
  closeIcon,
  infoIcon,
  logoMark,
  mapIcon,
  phoneIcon,
  quoteIcon,
  starIcon,
} from './icons.js';

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[char];
  });

export const header = () => `
<header class="site-header" id="site-header">
  <div class="container">
    <div class="flex h-16 items-center justify-between gap-3">
      <a href="#top" class="brand-link" aria-label="${esc(company.brand)}: к началу страницы">
        ${logoMark(26)}
        <span class="flex flex-col leading-none">
          <span class="brand-name" translate="no">${esc(company.brand)}</span>
          <span class="brand-tagline hidden min-[360px]:block">${esc(company.tagline)}</span>
        </span>
      </a>

      <nav class="hidden items-center gap-7 lg:flex" aria-label="Основная навигация">
        ${company.nav
          .map((item) => `<a class="nav-link" href="${item.href}">${esc(item.label)}</a>`)
          .join('')}
      </nav>

      <div class="flex items-center gap-2">
        <a class="header-phone hidden xl:inline-flex" href="tel:${company.primaryPhoneTel}">${esc(company.primaryPhone)}</a>
        <a class="btn btn-primary btn-header hidden sm:inline-flex" href="#quiz">${esc(company.cta.calculate)}</a>
        <button class="burger lg:hidden" id="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Открыть меню">
          <span class="burger-icon-open">${burgerIcon(20)}</span>
          <span class="burger-icon-close">${closeIcon(20)}</span>
        </button>
      </div>
    </div>
  </div>

  <div class="mobile-menu lg:hidden" id="mobile-menu">
    <nav aria-label="Мобильная навигация">
      ${company.nav.map((item) => `<a href="${item.href}">${esc(item.label)}</a>`).join('')}
    </nav>
    <div class="mt-3 flex flex-col gap-2">
      <a class="btn btn-primary w-full" href="#quiz">${esc(company.cta.primary)}</a>
      <a class="btn btn-ghost w-full" href="tel:${company.primaryPhoneTel}">${phoneIcon(17)} ${esc(company.primaryPhone)}</a>
    </div>
  </div>
</header>`;

export const hero = () => `
<section id="top" class="hero">
  <span class="hero-glow" aria-hidden="true"></span>
  <div class="container relative">
    <div class="grid items-center gap-9 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14">
      <div class="hero-copy">
        <p class="eyebrow-badge" data-hero-fade>
          <span class="eyebrow-dot" aria-hidden="true"></span>
          <span class="eyebrow-badge-text">
            <span>${esc(company.hero.eyebrow)}</span>
            <span class="badge-sep" aria-hidden="true">·</span>
            <span>${esc(company.hero.eyebrowTail)}</span>
          </span>
        </p>
        <h1 class="hero-title mt-5" data-hero-fade>${esc(company.hero.title)}</h1>
        <div class="mt-5 max-w-[54ch] space-y-2.5 text-[16.5px] leading-[1.6] text-ink-muted sm:text-[17px]" data-hero-fade>
          ${company.hero.lines.map((line) => `<p>${esc(line)}</p>`).join('')}
        </div>
        <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-3" data-hero-fade>
          <a class="btn btn-primary" href="#quiz">${esc(company.cta.primary)}</a>
          <a class="btn btn-ghost" href="tel:${company.primaryPhoneTel}">${phoneIcon(17)} ${esc(company.cta.call)}</a>
        </div>
      </div>

      <figure class="hero-media">
        <div class="window" data-hero-media>
          <div class="window-glass">
            <div class="window-photo-wrap" data-hero-photo-wrap>
              <img
                src="${company.hero.image.src}"
                width="${company.hero.image.width}"
                height="${company.hero.image.height}"
                alt="${esc(company.hero.image.alt)}"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                class="window-photo"
                data-hero-photo
              />
            </div>
          </div>
        </div>
        <figcaption class="window-caption" data-hero-caption>
          <span>${esc(company.hero.image.caption)}</span>
        </figcaption>
      </figure>
    </div>

    <div class="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4">
      ${company.hero.facts
        .map(
          (fact) => `
        <div class="hero-fact" data-hero-fade>
          <div class="hero-fact-value">${esc(fact.value)}</div>
          <div class="hero-fact-label">${esc(fact.label)}</div>
        </div>`,
        )
        .join('')}
    </div>
  </div>
</section>`;

const bentoSpans = ['bento-4', 'bento-2', 'bento-2', 'bento-2', 'bento-2', 'bento-wide'];

export const production = () => `
<section id="production" class="on-dark production">
  <span class="production-glow" aria-hidden="true"></span>
  <span class="production-glow production-glow-2" aria-hidden="true"></span>
  <div class="container relative py-16 lg:py-24">
    <div class="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <div class="reveal" data-reveal>
        <p class="eyebrow">Производство</p>
        <h2 class="section-title mt-4 text-white">${esc(company.production.title)}</h2>
        <p class="production-lead mt-4">${esc(company.production.lead)}</p>

        <figure class="mt-7">
          <div class="production-figure">
            <div class="production-media" data-production-media>
              <img
                src="${company.production.image.src}"
                width="${company.production.image.width}"
                height="${company.production.image.height}"
                alt="${esc(company.production.image.alt)}"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <figcaption class="production-caption">
            <span>${esc(company.production.image.caption)}</span>
            <span>Фото производства</span>
          </figcaption>
        </figure>

        <p class="production-footnote mt-5">На рынке Беларуси с ${company.since} года. ${esc(company.production.footnote)}</p>
      </div>

      <div>
        <div class="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
          <h3 class="spec-heading">${esc(company.production.specsTitle)}</h3>
          <span class="spec-note">Своя линия</span>
        </div>

        <div class="bento-grid mt-5">
          ${company.production.specs
            .map(
              (spec, index) => `
            <article class="bento-card ${bentoSpans[index] || 'bento-2'}" data-bento>
              <p class="bento-label">${esc(spec.label)}</p>
              <p class="${index === 3 || index === 4 ? 'bento-value-lg' : 'bento-value'}">${esc(spec.value)}</p>
            </article>`,
            )
            .join('')}
        </div>

        <p class="mt-5 max-w-[46ch] text-[14px] leading-[1.55] text-white/50">
          Замер и точный расчёт делает мастер производства, поэтому в смете нет наценки посредника и лишних позиций.
        </p>
      </div>
    </div>
  </div>
</section>`;

export const quizShell = () => `
<section id="quiz" class="py-16 lg:py-24">
  <div class="container">
    <div class="reveal max-w-[720px]" data-reveal>
      <p class="eyebrow">Расчёт</p>
      <h2 class="section-title mt-4">${esc(company.quiz.title)}</h2>
      <p class="lead mt-4">${esc(company.quiz.lead)}</p>
    </div>

    <div class="quiz-shell reveal mt-9 lg:mt-11" data-reveal data-delay="80">
      <div class="p-5 sm:p-8 lg:p-10">
        <div class="quiz-topline">
          <span class="step-counter" id="quiz-counter">Шаг <b>1</b> из ${company.quiz.steps.length}</span>
          <span class="hidden text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink-muted sm:block">Расчёт по факту замера</span>
        </div>
        <div class="progress" id="quiz-progress" aria-hidden="true">
          ${company.quiz.steps.map((_, index) => `<span class="${index === 0 ? 'is-done' : ''}"></span>`).join('')}
        </div>
        <div id="quiz-panel" class="quiz-panel"></div>
      </div>
    </div>
  </div>
</section>`;

export const works = () => `
<section id="works" class="py-16 lg:py-24">
  <div class="container">
    <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div class="reveal" data-reveal>
        <p class="eyebrow">Работы</p>
        <h2 class="section-title mt-4">Выполненные работы</h2>
      </div>
      <p class="reveal max-w-[40ch] text-[14.5px] leading-[1.55] text-ink-muted" data-reveal>
        Объекты из раздела «Наши работы»: окна, балконы, двери и монтаж. Нажмите на кадр, чтобы открыть его целиком.
      </p>
    </div>

    <div class="works-grid mt-8" id="works-grid">
      ${company.works
        .map(
          (work, index) => `
        <button class="work reveal" type="button" data-area="${work.area}" data-index="${index}"
                data-reveal data-delay="${index * 60}"
                aria-label="Открыть фото: ${esc(work.caption)}">
          <img src="${work.src}" width="${work.width}" height="${work.height}" alt="${esc(work.alt)}"
               loading="lazy" decoding="async" />
          <span class="work-tag">${esc(work.tag)}</span>
          <span class="work-zoom" aria-hidden="true">${arrowIcon(15)}</span>
          <span class="work-cap"><span>${esc(work.caption)}</span></span>
        </button>`,
        )
        .join('')}
    </div>
  </div>
</section>`;

export const extras = () => `
<section id="extra" class="pb-16 lg:pb-24">
  <div class="container">
    <div class="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
      <div class="reveal" data-reveal>
        <p class="eyebrow">Дополнительно</p>
        <h2 class="mt-4 text-[24px] font-extrabold leading-[1.12] tracking-[-0.028em] sm:text-[28px]">${esc(company.extras.title)}</h2>
        <p class="mt-3 max-w-[36ch] text-[15px] leading-[1.55] text-ink-muted">${esc(company.extras.lead)}</p>
        <a class="btn btn-ghost mt-6" href="tel:${company.primaryPhoneTel}">${phoneIcon(17)} ${esc(company.extras.cta)}</a>
      </div>

      <div class="reveal" data-reveal data-delay="80">
        <dl class="extra-list">
          ${company.extras.items
            .map(
              (item) => `
            <div class="extra-row">
              <dt>${esc(item.title)}</dt>
              <dd>${esc(item.note)}</dd>
            </div>`,
            )
            .join('')}
        </dl>
      </div>
    </div>
  </div>
</section>`;

export const process = () => `
<section id="process" class="py-16 lg:py-24">
  <div class="container">
    <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div class="reveal" data-reveal>
        <p class="eyebrow">Порядок работы</p>
        <h2 class="section-title mt-4">${esc(company.process.title)}</h2>
      </div>
      <p class="reveal max-w-[44ch] text-[16px] leading-[1.6] text-ink-muted" data-reveal>${esc(company.process.lead)}</p>
    </div>

    <div class="process-grid mt-9">
      ${company.process.steps
        .map(
          (step, index) => `
        <div class="process-step reveal" data-reveal data-delay="${index * 70}">
          <span class="process-dot" aria-hidden="true"></span>
          <h3 class="process-name">${esc(step.title)}</h3>
          <p class="process-text">${esc(step.text)}</p>
        </div>`,
        )
        .join('')}
    </div>
  </div>
</section>`;

const reviewCard = (review) => `
<article class="review reveal" data-reveal>
  <p class="review-text">${esc(review.text)}</p>
  <div class="review-meta">
    <span class="review-author">${esc(review.author)}</span>
    <span>${esc(review.date)}</span>
    <span class="review-stars" aria-label="Оценка ${review.rating} из 5">
      ${Array.from({ length: review.rating }, () => starIcon(12)).join('')}
    </span>
  </div>
</article>`;

export const reviews = () => {
  const featured = company.reviews.find((review) => review.featured) || company.reviews[0];
  const rest = company.reviews.filter((review) => review !== featured);
  return `
  <section id="reviews" class="py-16 lg:py-24">
    <div class="container">
      <div class="grid gap-9 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-14">
        <div>
          <div class="reveal" data-reveal>
            <p class="eyebrow">Отзывы</p>
            <h2 class="section-title mt-4">Отзывы клиентов с Яндекс Карт</h2>
            <div class="mt-6 flex items-end gap-4">
              <span class="rating-value">${esc(company.rating.valueLabel)}</span>
              <div class="pb-1">
                <div class="review-stars" aria-hidden="true">
                  ${Array.from({ length: 4 }, () => starIcon(13)).join('')}
                  <span class="opacity-30">${starIcon(13)}</span>
                </div>
                <p class="mt-1.5 text-[13.5px] text-ink-muted">${company.rating.marks} оценок · ${company.rating.reviews} отзывов</p>
              </div>
            </div>
            <a class="link-arrow mt-4" href="${company.map.reviewsUrl}" target="_blank" rel="noopener">
              Смотреть карточку на Яндекс Картах ${arrowIcon(15)}
            </a>
            <p class="mt-3 max-w-[40ch] text-[13px] leading-[1.5] text-ink-muted">
              Тексты приведены дословно, с датой и именем автора. Рейтинг и число оценок - по данным карточки организации.
            </p>
          </div>

          <div class="review-featured reveal mt-7" data-reveal data-delay="80">
            <span class="relative block text-accent">${quoteIcon(24)}</span>
            <p class="review-text mt-3">${esc(featured.text)}</p>
            <div class="review-meta">
              <span class="review-author">${esc(featured.author)}</span>
              <span>${esc(featured.date)}</span>
              <span>Яндекс Карты, ${featured.rating} из 5</span>
            </div>
          </div>
        </div>

        <div class="lg:pt-1">
          ${rest.map(reviewCard).join('')}
        </div>
      </div>
    </div>
  </section>`;
};

export const contacts = () => `
<footer id="contacts" class="on-dark contacts">
  <span class="contacts-glow" aria-hidden="true"></span>
  <div class="container relative py-16 lg:py-20">
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-14">
      <div class="reveal" data-reveal>
        <p class="eyebrow">Контакты</p>
        <h2 class="section-title mt-4 text-white">Молодечно, производство и офис</h2>
        <p class="lead mt-4 max-w-[46ch]">${esc(company.intro)}</p>

        <div class="mt-8 grid gap-3 sm:grid-cols-2">
          <div class="contact-card sm:col-span-2">
            <p class="contact-label">Адреса</p>
            <div class="mt-2 grid gap-4 sm:grid-cols-2">
              ${company.addresses
                .map(
                  (address) => `
                <div>
                  <p class="text-[11.5px] uppercase tracking-[0.1em] text-white/40">${esc(address.title)}</p>
                  <p class="contact-value">${esc(address.value)}</p>
                  <p class="contact-note">${esc(address.note)}</p>
                </div>`,
                )
                .join('')}
            </div>
          </div>

          <div class="contact-card">
            <p class="contact-label">Телефоны</p>
            <div class="mt-1 flex flex-col">
              ${company.phones
                .map(
                  (phone) =>
                    `<a class="contact-link" href="tel:${phone.tel}"><span class="contact-number">${esc(phone.label)}</span><span class="contact-note-label">${esc(phone.note)}</span></a>`,
                )
                .join('')}
            </div>
          </div>

          <div class="contact-card">
            <p class="contact-label">График</p>
            <p class="mt-2 font-display text-[19px] font-extrabold tracking-[-0.02em]">${esc(company.hours.days)} ${esc(company.hours.time)}</p>
            <p class="mt-1 text-[14px] text-white/50">${esc(company.hours.weekend)}</p>
            <p class="mt-2 max-w-[30ch] text-[12.5px] leading-[1.5] text-white/40">${esc(company.hours.note)}</p>
            <a class="footer-link mt-1" href="mailto:${esc(company.email)}">${esc(company.email)}</a>
          </div>
        </div>

        <div class="mt-7 flex flex-wrap gap-3">
          <a class="btn btn-primary" href="${company.map.url}" target="_blank" rel="noopener">${mapIcon(17)} ${esc(company.map.label)}</a>
          <a class="btn btn-outline-dark" href="tel:${company.primaryPhoneTel}">${phoneIcon(17)} ${esc(company.primaryPhone)}</a>
        </div>
      </div>

      <div class="reveal" data-reveal data-delay="80">
        <div class="footer-panel">
          <div class="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
            <h3 class="spec-heading">Реквизиты</h3>
            <span class="spec-note">ЧТУП</span>
          </div>
          <dl class="mt-1">
            ${company.requisites
              .map(
                (item) => `
              <div class="footer-spec">
                <dt>${esc(item.label)}</dt>
                <dd>${esc(item.value)}</dd>
              </div>`,
              )
              .join('')}
          </dl>

          <div class="mt-5">
            <p class="contact-label">Ссылки</p>
            <div class="mt-1 flex flex-wrap gap-x-6">
              ${company.socials
                .map(
                  (social) =>
                    `<a class="footer-link" href="${social.url}" target="_blank" rel="noopener">${esc(social.label)}</a>`,
                )
                .join('')}
            </div>
          </div>

          <p class="mt-5 max-w-[40ch] text-[12.5px] leading-[1.5] text-white/40">
            Условия, комплектация и сроки согласуются после замера. Информация на странице не является публичной офертой.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
      <p>
        <span translate="no">${esc(company.brand)}</span> · ${esc(company.legalName)} · УНП ${esc(company.requisites[1].value)}
      </p>
      <p>© 2026 ${esc(company.brand)}</p>
    </div>
  </div>
</footer>

<nav class="mobile-bar md:hidden" aria-label="Быстрые действия">
  <a class="is-primary" href="tel:${company.primaryPhoneTel}">Позвонить</a>
  <a href="${company.map.url}" target="_blank" rel="noopener">На карте</a>
  <a href="#quiz">Расчёт</a>
</nav>`;

export const lightbox = () => `
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фото" aria-hidden="true">
  <div class="lightbox-inner">
    <button class="lightbox-close" type="button" id="lightbox-close" aria-label="Закрыть просмотр">
      ${closeIcon(20)}
    </button>
    <img id="lightbox-img" alt="" width="1" height="1"
         src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
    <div class="lightbox-cap">
      <span id="lightbox-caption"></span>
      <span class="shrink-0 text-white/40" translate="no">СтеклоПак Торг</span>
    </div>
  </div>
</div>`;

export const skipLink = () => `<a class="skip-link" href="#quiz">Перейти к расчёту стоимости</a>`;
