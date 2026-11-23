import { gsap } from 'gsap';
import { company } from '../data/company.js';
import { arrowIcon, drawings, infoIcon, phoneIcon } from './icons.js';

const TOTAL = company.quiz.steps.length;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Направление перехода: 1 вперёд, -1 назад. */
let direction = 1;

const state = {
  step: 0,
  product: null,
  width: '',
  height: '',
  noSizes: false,
  works: new Set(),
  region: '',
  city: '',
  name: '',
  phone: '',
  submitted: false,
};

const els = {};

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[char];
  });

const digitsOf = (value) => String(value).replace(/\D/g, '');

export function formatPhone(value) {
  let digits = digitsOf(value);
  if (digits.startsWith('375')) digits = digits.slice(3);
  else if (digits.startsWith('80')) digits = digits.slice(2);
  digits = digits.slice(0, 9);

  let out = '+375';
  if (digits.length) out += ` (${digits.slice(0, 2)}`;
  if (digits.length >= 2) out += ')';
  if (digits.length > 2) out += ` ${digits.slice(2, 5)}`;
  if (digits.length > 5) out += `-${digits.slice(5, 7)}`;
  if (digits.length > 7) out += `-${digits.slice(7, 9)}`;
  return out;
}

const normalizeDigits = (value) => {
  let digits = digitsOf(value);
  if (digits.startsWith('375')) digits = digits.slice(3);
  else if (digits.startsWith('80')) digits = digits.slice(2);
  return digits.slice(0, 9);
};

const nav = ({ back = true, nextDisabled = false, nextLabel = 'Далее', leftNote = '' }) => `
  <div class="quiz-nav">
    ${
      back
        ? '<button type="button" class="btn btn-ghost" data-prev>Назад</button>'
        : `<span class="max-w-[24ch] text-[13px] leading-[1.4] text-ink-muted">${esc(leftNote)}</span>`
    }
    <button type="button" class="btn btn-primary" data-next ${nextDisabled ? 'disabled' : ''}>
      ${esc(nextLabel)} ${arrowIcon(15)}
    </button>
  </div>`;

const renderProductStep = () => {
  const step = company.quiz.steps[0];
  return `
  <h3 class="quiz-question" tabindex="-1">${esc(step.title)}</h3>
  <p class="quiz-hint">${esc(step.hint)}</p>
  <div class="tiles" role="group" aria-label="Тип изделия">
    ${company.quiz.products
      .map(
        (product) => `
      <button type="button" class="tile" data-product="${product.id}" aria-pressed="${state.product === product.id}">
        <span class="tile-check" aria-hidden="true"></span>
        ${drawings[product.drawing] || ''}
        <span>
          <span class="tile-name">${esc(product.label)}</span>
          <span class="tile-meta">${esc(product.meta)}</span>
        </span>
      </button>`,
      )
      .join('')}
  </div>
  ${nav({ back: false, nextDisabled: !state.product, leftNote: 'Цена по факту замера и комплектации' })}
  `;
};

const renderSizeStep = () => {
  const step = company.quiz.steps[1];
  return `
  <h3 class="quiz-question" tabindex="-1">${esc(step.title)}</h3>
  <p class="quiz-hint">${esc(step.hint)} Если размеров нет, отметьте пункт ниже, мастер снимет их на месте.</p>
  <div class="size-grid">
    <label>
      <span class="field-label">Ширина</span>
      <span class="field-wrap" data-wrap="width">
        <input class="field" id="quiz-width" data-field="width" type="text" inputmode="numeric"
               autocomplete="off" maxlength="4" placeholder="1300" value="${esc(state.width)}" ${state.noSizes ? 'disabled' : ''} />
        <span class="field-unit">мм</span>
      </span>
      <span class="field-error" data-error="width"></span>
    </label>
    <label>
      <span class="field-label">Высота</span>
      <span class="field-wrap" data-wrap="height">
        <input class="field" id="quiz-height" data-field="height" type="text" inputmode="numeric"
               autocomplete="off" maxlength="4" placeholder="1400" value="${esc(state.height)}" ${state.noSizes ? 'disabled' : ''} />
        <span class="field-unit">мм</span>
      </span>
      <span class="field-error" data-error="height"></span>
    </label>
  </div>
  <button type="button" class="size-toggle" data-nosizes aria-pressed="${state.noSizes}">
    <span class="chip-box" aria-hidden="true"></span>
    ${esc(company.quiz.sizesUnknownLabel)}
  </button>
  ${nav({})}
  `;
};

const renderOptionsStep = () => {
  const step = company.quiz.steps[2];
  return `
  <h3 class="quiz-question" tabindex="-1">${esc(step.title)}</h3>
  <p class="quiz-hint">${esc(step.hint)}</p>
  <div class="chips" role="group" aria-label="Комплектация и работы">
    ${company.quiz.works
      .map(
        (work) => `
      <button type="button" class="chip" data-work="${work.id}" aria-pressed="${state.works.has(work.id)}">
        <span class="chip-box" aria-hidden="true"></span>
        ${esc(work.label)}
      </button>`,
      )
      .join('')}
  </div>
  ${nav({})}
  `;
};

const renderContactsStep = () => {
  const step = company.quiz.steps[3];
  return `
  <h3 class="quiz-question" tabindex="-1">${esc(step.title)}</h3>
  <p class="quiz-hint">${esc(step.hint)}</p>

  <div class="mt-5">
    <span class="field-label">Область</span>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Область">
      ${company.quiz.regions
        .map(
          (region) => `
        <button type="button" class="chip justify-center !px-2" data-region="${esc(region)}" aria-pressed="${state.region === region}">
          ${esc(region)}
        </button>`,
        )
        .join('')}
    </div>
    <p class="field-error" data-error="region"></p>
  </div>

  <div class="size-grid">
    <label>
      <span class="field-label">Город или район</span>
      <span class="field-wrap" data-wrap="city">
        <input class="field" data-field="city" type="text" autocomplete="address-level2"
               placeholder="Молодечно" value="${esc(state.city)}" />
      </span>
      <span class="field-error" data-error="city"></span>
    </label>
    <label>
      <span class="field-label">Имя</span>
      <span class="field-wrap" data-wrap="name">
        <input class="field" data-field="name" type="text" autocomplete="name"
               placeholder="Как к вам обращаться" value="${esc(state.name)}" />
      </span>
      <span class="field-error" data-error="name"></span>
    </label>
  </div>

  <label class="mt-3 block">
    <span class="field-label">Телефон</span>
    <span class="field-wrap" data-wrap="phone">
      <input class="field" data-field="phone" id="quiz-phone" type="tel" inputmode="tel"
             autocomplete="tel" placeholder="+375 (29) 000-00-00" value="${state.phone ? formatPhone(state.phone) : '+375'}" />
    </span>
    <span class="field-error" data-error="phone"></span>
  </label>

  ${nav({ nextLabel: 'Отправить заявку' })}
  `;
};

const renderFinal = () => {
  const product = company.quiz.products.find((item) => item.id === state.product);
  const works = company.quiz.works.filter((item) => state.works.has(item.id)).map((item) => item.label);
  const sizeText = state.noSizes
    ? company.quiz.sizesUnknownLabel
    : `${state.width} × ${state.height} мм`;

  return `
  <h3 class="quiz-question" tabindex="-1">Параметры собраны</h3>
  <p class="quiz-hint">Проверьте данные. Если что-то не так, сбросьте заявку и заполните заново.</p>

  <dl class="quiz-summary">
    <div><dt>Изделие</dt><dd>${esc(product ? product.label : 'Не выбрано')}</dd></div>
    <div><dt>Размеры</dt><dd>${esc(sizeText)}</dd></div>
    <div><dt>Комплектация и работы</dt><dd>${esc(works.length ? works.join(', ') : 'Без дополнительных работ')}</dd></div>
    <div><dt>Область и город</dt><dd>${esc(`${state.region} область, ${state.city.trim()}`)}</dd></div>
    <div><dt>Контакт</dt><dd>${esc(state.name.trim())}, ${esc(formatPhone(state.phone))}</dd></div>
  </dl>

  <div class="quiz-note">
    ${infoIcon(18)}
    <p>${esc(company.quiz.successNote)}</p>
  </div>

  <div class="quiz-nav">
    <button type="button" class="btn btn-ghost" data-reset>${esc(company.cta.reset)}</button>
    <a class="btn btn-primary" href="tel:${company.primaryPhoneTel}">${phoneIcon(17)} ${esc(company.cta.call)}</a>
  </div>
  `;
};

const updateChrome = () => {
  const segments = els.progress ? Array.from(els.progress.children) : [];
  if (state.submitted) {
    if (els.counter) els.counter.textContent = 'Заявка сформирована';
    segments.forEach((segment) => segment.classList.add('is-done'));
    return;
  }
  if (els.counter) {
    els.counter.innerHTML = `Шаг <b>${state.step + 1}</b> из ${TOTAL}`;
  }
  segments.forEach((segment, index) => {
    segment.classList.toggle('is-done', index <= state.step);
  });
};

const setError = (name, message) => {
  const errorNode = els.panel.querySelector(`[data-error="${name}"]`);
  if (errorNode) errorNode.textContent = message || '';
  const wrap = els.panel.querySelector(`[data-wrap="${name}"]`);
  if (wrap) wrap.classList.toggle('has-error', Boolean(message));
};

const focusFirstError = () => {
  const errorNode = els.panel.querySelector('.field-error:not(:empty)');
  if (!errorNode) return;
  const field = errorNode.closest('label')?.querySelector('input, button');
  if (field) field.focus();
};

const validateSizes = () => {
  if (state.noSizes) {
    setError('width', '');
    setError('height', '');
    return true;
  }
  let valid = true;
  const width = Number(state.width);
  const height = Number(state.height);

  if (!(width > 0)) {
    setError('width', 'Укажите ширину в мм');
    valid = false;
  } else {
    setError('width', '');
  }

  if (!(height > 0)) {
    setError('height', 'Укажите высоту в мм');
    valid = false;
  } else {
    setError('height', '');
  }

  if (!valid) focusFirstError();
  return valid;
};

const validateContacts = () => {
  let valid = true;

  if (!state.region) {
    setError('region', 'Выберите область');
    valid = false;
  } else {
    setError('region', '');
  }

  if (state.city.trim().length < 2) {
    setError('city', 'Укажите город или район');
    valid = false;
  } else {
    setError('city', '');
  }

  if (state.name.trim().length < 2) {
    setError('name', 'Укажите имя');
    valid = false;
  } else {
    setError('name', '');
  }

  if (normalizeDigits(state.phone).length !== 9) {
    setError('phone', 'Введите номер полностью: +375 (XX) XXX-XX-XX');
    valid = false;
  } else {
    setError('phone', '');
  }

  if (!valid) focusFirstError();
  return valid;
};

const goNext = () => {
  const step = company.quiz.steps[state.step];
  if (step.id === 'size' && !validateSizes()) return;
  direction = 1;
  if (step.id === 'contacts') {
    if (!validateContacts()) return;
    state.submitted = true;
    render(true);
    return;
  }
  state.step = Math.min(state.step + 1, TOTAL - 1);
  render(true);
};

const goPrev = () => {
  direction = -1;
  state.step = Math.max(state.step - 1, 0);
  render(true);
};

const bindStep = (stepId) => {
  const panel = els.panel;

  panel.querySelector('[data-prev]')?.addEventListener('click', goPrev);
  panel.querySelector('[data-next]')?.addEventListener('click', goNext);

  if (stepId === 'product') {
    panel.querySelectorAll('[data-product]').forEach((tile) => {
      tile.addEventListener('click', () => {
        state.product = tile.dataset.product;
        panel.querySelectorAll('[data-product]').forEach((other) => {
          other.setAttribute('aria-pressed', String(other === tile));
        });
        const next = panel.querySelector('[data-next]');
        if (next) next.disabled = false;
      });
    });
  }

  if (stepId === 'size') {
    panel.querySelectorAll('[data-field]').forEach((input) => {
      input.addEventListener('input', () => {
        const value = digitsOf(input.value).slice(0, 4);
        input.value = value;
        state[input.dataset.field] = value;
        setError(input.dataset.field, '');
      });
    });

    const toggle = panel.querySelector('[data-nosizes]');
    toggle?.addEventListener('click', () => {
      state.noSizes = !state.noSizes;
      toggle.setAttribute('aria-pressed', String(state.noSizes));
      panel.querySelectorAll('[data-field]').forEach((input) => {
        input.disabled = state.noSizes;
      });
      if (state.noSizes) {
        setError('width', '');
        setError('height', '');
      }
    });
  }

  if (stepId === 'options') {
    panel.querySelectorAll('[data-work]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.work;
        if (state.works.has(id)) state.works.delete(id);
        else state.works.add(id);
        chip.setAttribute('aria-pressed', String(state.works.has(id)));
      });
    });
  }

  if (stepId === 'contacts') {
    panel.querySelectorAll('[data-region]').forEach((chip) => {
      chip.addEventListener('click', () => {
        state.region = chip.dataset.region;
        panel.querySelectorAll('[data-region]').forEach((other) => {
          other.setAttribute('aria-pressed', String(other === chip));
        });
        setError('region', '');
      });
    });

    panel.querySelectorAll('[data-field]').forEach((input) => {
      const field = input.dataset.field;
      if (field === 'phone') {
        input.addEventListener('input', () => {
          state.phone = normalizeDigits(input.value);
          input.value = formatPhone(state.phone);
          setError('phone', '');
        });
        input.addEventListener('keydown', (event) => {
          if (event.key !== 'Backspace') return;
          event.preventDefault();
          state.phone = state.phone.slice(0, -1);
          input.value = formatPhone(state.phone);
          setError('phone', '');
        });
        input.addEventListener('focus', () => {
          if (!state.phone) {
            input.value = '+375';
          }
        });
      } else {
        input.addEventListener('input', () => {
          state[field] = input.value;
          setError(field, '');
        });
      }
    });
  }
};

const resetQuiz = () => {
  state.step = 0;
  state.product = null;
  state.width = '';
  state.height = '';
  state.noSizes = false;
  state.works = new Set();
  state.region = '';
  state.city = '';
  state.name = '';
  state.phone = '';
  state.submitted = false;
  direction = 1;
  render(true);
};

/** Плавная смена шагов: slide + fade, отключается при prefers-reduced-motion. */
const animatePanel = () => {
  if (!els.panel || reduceMotion()) return;
  gsap.fromTo(
    els.panel,
    { opacity: 0, x: direction * 18 },
    {
      opacity: 1,
      x: 0,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: true,
      clearProps: 'transform,opacity',
    },
  );
};

const render = (focusHeading = false) => {
  if (!els.panel) return;

  if (state.submitted) {
    els.panel.innerHTML = renderFinal();
    updateChrome();
    const reset = els.panel.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', resetQuiz);
  } else {
    const step = company.quiz.steps[state.step];
    const views = {
      product: renderProductStep,
      size: renderSizeStep,
      options: renderOptionsStep,
      contacts: renderContactsStep,
    };
    els.panel.innerHTML = (views[step.id] || renderProductStep)();
    updateChrome();
    bindStep(step.id);
  }

  animatePanel();

  if (focusHeading) {
    const heading = els.panel.querySelector('.quiz-question');
    if (heading) heading.focus({ preventScroll: true });
  }
};

export function initQuiz() {
  els.panel = document.getElementById('quiz-panel');
  els.counter = document.getElementById('quiz-counter');
  els.progress = document.getElementById('quiz-progress');
  if (!els.panel) return;
  render(false);
}
