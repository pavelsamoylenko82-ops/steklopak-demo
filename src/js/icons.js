/**
 * Тонкие контурные SVG: чертёжные схемы конструкций и служебные иконки.
 * Толщина линий 1.5, цвет наследуется от currentColor.
 */

export const logoMark = (size = 28) => `
<svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true" class="brand-mark">
  <rect x="4" y="4" width="20" height="20" />
  <line x1="14" y1="4" x2="14" y2="24" />
  <line x1="4" y1="14" x2="24" y2="14" />
  <line x1="4" y1="1" x2="4" y2="3" />
  <line x1="24" y1="1" x2="24" y2="3" />
  <line x1="4" y1="25" x2="4" y2="27" />
  <line x1="24" y1="25" x2="24" y2="27" />
</svg>`;

export const drawings = {
  window: `
  <svg viewBox="0 0 120 76" width="112" height="70" fill="none" stroke="currentColor"
       stroke-width="1.5" aria-hidden="true">
    <rect x="8" y="5" width="104" height="66" />
    <line x1="60" y1="5" x2="60" y2="71" />
    <line x1="8" y1="48" x2="112" y2="48" />
    <line x1="60" y1="48" x2="60" y2="71" />
    <line x1="4" y1="71" x2="116" y2="71" />
  </svg>`,
  balconyBlock: `
  <svg viewBox="0 0 120 76" width="112" height="70" fill="none" stroke="currentColor"
       stroke-width="1.5" aria-hidden="true">
    <rect x="8" y="4" width="38" height="67" />
    <rect x="14" y="14" width="26" height="36" />
    <line x1="41" y1="42" x2="41" y2="48" />
    <rect x="52" y="20" width="60" height="51" />
    <line x1="82" y1="20" x2="82" y2="71" />
    <line x1="52" y1="44" x2="112" y2="44" />
    <line x1="4" y1="71" x2="116" y2="71" />
  </svg>`,
  balcony: `
  <svg viewBox="0 0 120 76" width="112" height="70" fill="none" stroke="currentColor"
       stroke-width="1.5" aria-hidden="true">
    <rect x="4" y="12" width="112" height="59" />
    <line x1="31" y1="12" x2="31" y2="71" />
    <line x1="60" y1="12" x2="60" y2="71" />
    <line x1="89" y1="12" x2="89" y2="71" />
    <line x1="4" y1="33" x2="116" y2="33" />
    <line x1="9" y1="20" x2="19" y2="20" />
  </svg>`,
  door: `
  <svg viewBox="0 0 120 76" width="112" height="70" fill="none" stroke="currentColor"
       stroke-width="1.5" aria-hidden="true">
    <rect x="34" y="3" width="52" height="68" />
    <rect x="42" y="13" width="36" height="40" />
    <line x1="72" y1="48" x2="76" y2="48" />
    <line x1="30" y1="71" x2="90" y2="71" />
  </svg>`,
  several: `
  <svg viewBox="0 0 120 76" width="112" height="70" fill="none" stroke="currentColor"
       stroke-width="1.5" aria-hidden="true">
    <rect x="6" y="8" width="58" height="50" />
    <line x1="35" y1="8" x2="35" y2="58" />
    <rect x="42" y="24" width="60" height="48" />
    <line x1="72" y1="24" x2="72" y2="72" />
    <line x1="42" y1="50" x2="102" y2="50" />
  </svg>`,
};

export const phoneIcon = (size = 18) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true">
  <path d="M3.2 2.5h3l1.4 3.6-2 1.4a10.5 10.5 0 0 0 6.9 6.9l1.4-2 3.6 1.4v3A1.7 1.7 0 0 1 15.8 18C8.7 17.6 2.4 11.3 2 4.2A1.7 1.7 0 0 1 3.2 2.5Z" />
</svg>`;

export const mapIcon = (size = 18) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true">
  <path d="M10 18s6-5.2 6-10A6 6 0 0 0 4 8c0 4.8 6 10 6 10Z" />
  <circle cx="10" cy="8" r="2.4" />
</svg>`;

export const calcIcon = (size = 18) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true">
  <rect x="3" y="2.5" width="14" height="15" />
  <line x1="6" y1="6" x2="14" y2="6" />
  <line x1="7" y1="10" x2="7" y2="14" />
  <line x1="10" y1="10" x2="10" y2="14" />
  <line x1="13" y1="10" x2="13" y2="14" />
</svg>`;

export const closeIcon = (size = 20) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true">
  <line x1="4" y1="4" x2="16" y2="16" />
  <line x1="16" y1="4" x2="4" y2="16" />
</svg>`;

export const arrowIcon = (size = 16) => `
<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true">
  <line x1="2" y1="8" x2="13" y2="8" />
  <polyline points="9,4 13,8 9,12" />
</svg>`;

export const burgerIcon = (size = 20) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true">
  <line x1="3" y1="6" x2="17" y2="6" />
  <line x1="3" y1="10" x2="17" y2="10" />
  <line x1="3" y1="14" x2="17" y2="14" />
</svg>`;

export const infoIcon = (size = 18) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true">
  <circle cx="10" cy="10" r="7.5" />
  <line x1="10" y1="9" x2="10" y2="14" />
  <line x1="10" y1="6.2" x2="10" y2="6.4" />
</svg>`;

export const starIcon = (size = 13) => `
<svg width="${size}" height="${size}" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
  <path d="M7 1l1.7 3.9 4.3.4-3.2 2.8.9 4.2L7 10.3 3.3 12.3l.9-4.2L1 5.3l4.3-.4L7 1Z" />
</svg>`;

export const quoteIcon = (size = 26) => `
<svg width="${size}" height="${size}" viewBox="0 0 26 26" fill="none" stroke="currentColor"
     stroke-width="1.5" aria-hidden="true">
  <path d="M10 5H5v7h5v4c0 2-1 3-3 3" />
  <path d="M21 5h-5v7h5v4c0 2-1 3-3 3" />
</svg>`;
