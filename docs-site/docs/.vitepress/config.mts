import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TWILA",
  description: "That's What I'm Looking At - A client-side block and entity identification overlay mod for Tapestry",
  base: '/TWILA/',

  // Ignore dead links for now - will be fixed in link validation task
  ignoreDeadLinks: true,

  // Build output configuration
  outDir: '.vitepress/dist',
  cacheDir: '.vitepress/cache',

  // Asset optimization
  vite: {
    build: {
      // Optimize assets for production
      assetsInlineLimit: 4096, // Inline assets smaller than 4KB
      chunkSizeWarningLimit: 1000, // Warn on chunks larger than 1MB
    },
    // Optimize asset handling
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  },

  // Favicon configuration
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/TWILA/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/TWILA/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/TWILA/favicon-16x16.png' }],
    ['link', { rel: 'shortcut icon', href: '/TWILA/favicon.ico' }],
    // Prevent bfcache by disabling caching
    ['meta', { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' }],
    ['meta', { 'http-equiv': 'Pragma', content: 'no-cache' }],
    ['meta', { 'http-equiv': 'Expires', content: '0' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',

    nav: [
      { text: 'Download the latest version', link: 'https://github.com/alizzycraft/twila/releases/latest' },
      { text: '', link: '' },
      { text: 'Tapestry', link: 'https://alizzycraft.github.io/tapestry/' }
    ],

    sidebar: undefined,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alizzycraft/twila' },
      { icon: 'patreon', link: 'https://www.patreon.com/cw/lizzyrosa' }
    ],

    editLink: {
      pattern: 'https://github.com/alizzycraft/twila/docs-site/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
