import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Served from https://andzhik.github.io/keychain-maker/ on GitHub Pages.
// `base` must match the repo name so asset URLs resolve under the subpath.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/keychain-maker/' : '/',
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
