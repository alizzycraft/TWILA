import { EnhanceAppContext } from 'vitepress'

export function enhanceApp({ app, router }: EnhanceAppContext) {
  // Add aria-current="page" to active navigation links
  if (typeof window !== 'undefined') {
    router.onAfterRouteChanged = (to) => {
      // Wait for DOM to update
      setTimeout(() => {
        // Find all active navigation links
        const activeLinks = document.querySelectorAll('.VPNavBarMenuLink.active, .VPSidebarItem.is-active a')
        activeLinks.forEach(link => {
          link.setAttribute('aria-current', 'page')
        })
        
        // Remove aria-current from inactive links
        const inactiveLinks = document.querySelectorAll('.VPNavBarMenuLink:not(.active), .VPSidebarItem:not(.is-active) a')
        inactiveLinks.forEach(link => {
          link.removeAttribute('aria-current')
        })
        
        // Remove target="_blank" from Tapestry links (let browser handle navigation normally)
        removeTapestryTargetBlank()
      }, 100)
    }
    
    // Run on initial load
    if (router.route.path) {
      setTimeout(() => {
        const activeLinks = document.querySelectorAll('.VPNavBarMenuLink.active, .VPSidebarItem.is-active a')
        activeLinks.forEach(link => {
          link.setAttribute('aria-current', 'page')
        })
        
        // Remove target="_blank" from Tapestry links
        removeTapestryTargetBlank()
      }, 100)
    }
    
    // Set up MutationObserver to catch dynamically added links
    const observer = new MutationObserver(() => {
      removeTapestryTargetBlank()
    })
    
    // Start observing when DOM is ready
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      })
    }
    
    // Also run on mount with multiple delays
    setTimeout(() => removeTapestryTargetBlank(), 100)
    setTimeout(() => removeTapestryTargetBlank(), 500)
    setTimeout(() => removeTapestryTargetBlank(), 1000)
  }
}

function removeTapestryTargetBlank() {
  // Find all links to Tapestry docs
  const tapestryLinks = document.querySelectorAll('a[href*="alizzycraft.github.io/tapestry"]')
  tapestryLinks.forEach((link: Element) => {
    const anchor = link as HTMLAnchorElement
    // Remove target and rel - let the browser handle it as a normal link
    anchor.removeAttribute('target')
    anchor.removeAttribute('rel')
    
    // Add cache-busting hash to prevent bfcache issues
    // The hash is ignored by the server but forces browser to treat it as a new navigation
    const href = anchor.getAttribute('href')
    if (href && !href.includes('?')) {
      anchor.setAttribute('href', href + '?n=twila')
    }
  })
}
