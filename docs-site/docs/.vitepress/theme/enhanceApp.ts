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
        
        // Remove target="_blank" from Tapestry links
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
    
    // Also run on mount
    setTimeout(() => {
      removeTapestryTargetBlank()
    }, 500)
  }
}

function removeTapestryTargetBlank() {
  // Find all links to Tapestry docs
  const tapestryLinks = document.querySelectorAll('a[href*="https://alizzycraft.github.io/tapestry/"]')
  tapestryLinks.forEach(link => {
    link.removeAttribute('target')
    link.removeAttribute('rel')
  })
}
