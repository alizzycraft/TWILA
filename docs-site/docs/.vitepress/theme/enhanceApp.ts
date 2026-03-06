import { EnhanceAppContext } from 'vitepress'

export function enhanceApp({ app, router }: EnhanceAppContext) {
  // Add aria-current="page" to active navigation links
  if (typeof window !== 'undefined') {
    // Detect if we're showing a 404 when we shouldn't be (bfcache issue)
    // This happens when router state is stale after back navigation
    const checkFor404Mismatch = () => {
      const is404Page = document.querySelector('.NotFound') !== null
      const currentPath = window.location.pathname
      const expectedPath = '/TWILA/'
      
      // If we're on the home page URL but seeing 404, force reload
      if (is404Page && currentPath === expectedPath) {
        console.log('Detected 404 on home page - forcing reload to fix bfcache issue')
        window.location.reload()
      }
    }
    
    router.onAfterRouteChanged = (to) => {
      // Wait for DOM to update
      setTimeout(() => {
        // Check for 404 mismatch
        checkFor404Mismatch()
        
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
        // Check for 404 mismatch on initial load
        checkFor404Mismatch()
        
        const activeLinks = document.querySelectorAll('.VPNavBarMenuLink.active, .VPSidebarItem.is-active a')
        activeLinks.forEach(link => {
          link.setAttribute('aria-current', 'page')
        })
        
        // Remove target="_blank" from Tapestry links
        removeTapestryTargetBlank()
      }, 100)
      
      // Check again after a longer delay to catch late-rendering 404s
      setTimeout(() => {
        checkFor404Mismatch()
      }, 500)
    }
    
    // Set up MutationObserver to catch dynamically added links and 404 pages
    const observer = new MutationObserver(() => {
      removeTapestryTargetBlank()
      checkFor404Mismatch()
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
    // Simply remove target and rel - let the browser handle it as a normal link
    anchor.removeAttribute('target')
    anchor.removeAttribute('rel')
  })
}
