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
        
        // Handle Tapestry links
        handleTapestryLinks()
      }, 100)
    }
    
    // Run on initial load
    if (router.route.path) {
      setTimeout(() => {
        const activeLinks = document.querySelectorAll('.VPNavBarMenuLink.active, .VPSidebarItem.is-active a')
        activeLinks.forEach(link => {
          link.setAttribute('aria-current', 'page')
        })
        
        // Handle Tapestry links
        handleTapestryLinks()
      }, 100)
    }
    
    // Set up MutationObserver to catch dynamically added links
    const observer = new MutationObserver(() => {
      handleTapestryLinks()
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
    
    // Also run on mount with multiple delays to catch all scenarios
    setTimeout(() => handleTapestryLinks(), 100)
    setTimeout(() => handleTapestryLinks(), 500)
    setTimeout(() => handleTapestryLinks(), 1000)
    setTimeout(() => handleTapestryLinks(), 2000)
  }
}

function handleTapestryLinks() {
  // Find all links to Tapestry docs
  const tapestryLinks = document.querySelectorAll('a[href*="alizzycraft.github.io/tapestry"]')
  tapestryLinks.forEach((link: Element) => {
    const anchor = link as HTMLAnchorElement
    
    // Remove target and rel attributes
    anchor.removeAttribute('target')
    anchor.removeAttribute('rel')
    
    // Add click handler to force full page navigation
    if (!anchor.dataset.tapestryHandled) {
      anchor.dataset.tapestryHandled = 'true'
      anchor.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        window.location.href = anchor.href
      })
    }
  })
}
