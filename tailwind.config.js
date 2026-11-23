/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,css}'],
  theme: {
    extend: {
      colors: {
        page: '#F4F6F8',
        card: '#FFFFFF',
        line: 'rgba(15, 23, 42, 0.08)',
        ink: { DEFAULT: '#0F172A', muted: '#5B6779' },
        graphite: '#0B1120',
        accent: { DEFAULT: '#EA580C', hover: '#C2410C' },
      },
      fontFamily: {
        display: ['Manrope', 'Golos Text', 'Segoe UI', 'sans-serif'],
        body: ['Golos Text', 'Manrope', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        tight2: '-0.03em',
      },
      maxWidth: {
        shell: '1240px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11, 17, 32, 0.05), 0 16px 32px -18px rgba(11, 17, 32, 0.2)',
        lift: '0 2px 6px rgba(11, 17, 32, 0.05), 0 30px 60px -30px rgba(11, 17, 32, 0.28)',
      },
    },
  },
  plugins: [],
};
