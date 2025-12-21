import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'mpa-rewrite',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url || '';
          if (url.startsWith('/vendor') && !url.includes('.')) {
            req.url = '/vendor/index.html';
          } else if (url.startsWith('/admin') && !url.includes('.')) {
            req.url = '/admin/index.html';
          }
          next();
        })
      }
    },
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   injectRegister: null, 
    //   manifest: false, 
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
    //   }
    // })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        vendor: resolve(__dirname, 'vendor/index.html'),
      },
    },
  },
})
