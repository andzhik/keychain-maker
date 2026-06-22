import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Served from https://andzhik.github.io/keychain-maker/ on GitHub Pages.
// `base` must match the path the site is served from so asset URLs resolve.
// CI sets VITE_BASE_PATH explicitly: '/keychain-maker/' for production and
// '/keychain-maker/preview/<branch>/' for branch previews.
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? (process.env.GITHUB_ACTIONS ? '/keychain-maker/' : '/'),
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
