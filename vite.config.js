import { defineConfig } from 'vite';

// base: './' - сборка открывается и на GitHub Pages в подпапке /steklopak-demo/,
// и локально из dist/ без сервера (все пути относительные).
export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
    assetsInlineLimit: 0,
    cssCodeSplit: false,
  },
  server: { port: 5173, open: false },
});
