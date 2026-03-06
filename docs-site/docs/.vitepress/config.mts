import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TWILA",
  description: "That's What I'm Looking At - A client-side block and entity identification overlay mod for Tapestry",
  base: '/twila/',

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
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/twila/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/twila/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/twila/favicon-16x16.png' }],
    ['link', { rel: 'shortcut icon', href: '/twila/favicon.ico' }]
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
