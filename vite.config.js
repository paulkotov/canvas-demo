import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    open: '/index.html',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        fractal: 'fractal.html',
        pixelDraw: 'pixel-draw.html',
      },
    },
  },
  test: {
    // testFiles: 'src/**/*.test.js',
    // package: {
    //   exports: 'auto',
    // },
  },
});