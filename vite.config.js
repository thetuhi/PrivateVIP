import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the vendor layer out of the route chunks so a content edit does not
    // invalidate the framework cache for returning visitors.
    //
    // Vite 8 bundles with rolldown, which requires the function form here —
    // the object form is silently rejected at config time and then throws.
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Normalise: ids arrive with backslashes on Windows.
          const path = id.replace(/\\/g, '/')
          if (!path.includes('node_modules')) return undefined

          if (/\/node_modules\/(react|react-dom|scheduler|react-router)/.test(path)) return 'react'
          if (path.includes('/node_modules/framer-motion') || path.includes('/node_modules/motion-')) return 'motion'
          // GSAP, its plugins and Lenis form the scroll/animation layer. Kept
          // as one stable chunk: it is on the critical path for every page, and
          // isolating it means editing a tour description does not invalidate
          // 50 KB of animation code in every returning visitor's cache.
          if (path.includes('/node_modules/gsap') || path.includes('/node_modules/lenis')) return 'gsap'
          if (path.includes('i18next')) return 'i18n'
          return undefined
        },
      },
    },
  },
})
