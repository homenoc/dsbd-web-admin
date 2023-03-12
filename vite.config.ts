import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    open: true,
    host: true,
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      includeAssets: [
        'favicon.ico',
        'logo192.png',
        'logo512.png',
        'robots.txt',
      ],
      manifest: {
        name: "Home NOC Operators' Group Admin Page",
        short_name: 'Home NOC Admin Page',
        start_url: '.',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
      },
    }),
  ],
})
