
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.html'),
        add_card: path.resolve(__dirname, 'src/add-card.html'),
        support: path.resolve(__dirname, 'src/support.html'),
        contact: path.resolve(__dirname, 'src/contact.html'),
      }
    }
  },
  server: {
    open: false,
    port: 8000
  },
});

