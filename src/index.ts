import { TapestryObject, ModDefinition } from "tapestry";

/**
 * TWILA - That's What I'm Looking At
 * 
 * Client-side block identification overlay mod for Tapestry
 */
const twilaMod: ModDefinition = {
  id: "twila",
  onLoad(tapestry: TapestryObject) {
    // Initialize mod during TS_READY phase
    console.log("TWILA loading...");
    
    // Store mod reference for later use
    (globalThis as any).twilaMod = {
      tapestry,
      currentTarget: null,
      overlayId: "twila-overlay",
      tickHandle: null,
      isVisible: false
    };
  },
  onEnable(tapestry: TapestryObject) {
    // Start mod during RUNTIME phase
    console.log("TWILA enabled");
    
    const mod = (globalThis as any).twilaMod;
    
    // Register overlay
    registerOverlay(mod);
    
    // Start raycasting loop
    startRaycasting(mod);
  }
};

/**
 * Registers the TWILA overlay with Tapestry
 */
function registerOverlay(mod: any) {
  const { tapestry } = mod;
  
  const overlayDefinition = {
    id: mod.overlayId,
    anchor: "TOP_CENTER" as const,
    zIndex: 100,
    visible: false,
    render: function() {
      const currentTarget = mod.currentTarget;
      
      if (!currentTarget) {
        return [];
      }
      
      // Use Mikel template for UI
      const template = `
        <div class="twila-overlay" style="
          background: rgba(0, 0, 0, 0.7);
          border-radius: 6px;
          padding: 6px 12px;
          margin-top: 20px;
        ">
          <span style="
            color: white;
            font-family: monospace;
            font-size: 14px;
          ">${currentTarget.blockName}</span>
        </div>
      `;
      
      return tapestry.client.overlay.template(template, {
        blockName: currentTarget.blockName
      });
    }
  };
  
  tapestry.client.overlay.register(overlayDefinition);
  console.log("TWILA overlay registered");
}

/**
 * Starts the raycasting loop using game ticks
 */
function startRaycasting(mod: any) {
  const { tapestry } = mod;
  
  const raycastLoop = function(context: any) {
    try {
      // Perform client-side raycast
      const result = tapestry.client.players.raycastBlock({
        maxDistance: 32,
        includeFluids: false
      });
      
      let newTarget = null;
      
      if (result.hit) {
        // Extract block name using the defined contract
        const blockName = result.blockName || result.blockId || "Unknown Block";
        
        newTarget = {
          blockId: result.blockId,
          blockName: blockName,
          blockPos: result.blockPos,
          side: result.side
        };
      }
      
      // Check if target changed
      const targetChanged = !mod.currentTarget || 
        !newTarget || 
        mod.currentTarget.blockId !== newTarget.blockId;
      
      if (targetChanged) {
        mod.currentTarget = newTarget;
        updateOverlayVisibility(mod);
      }
      
    } catch (error) {
      console.error("TWILA raycast error:", error);
    }
    
    // Schedule next tick
    mod.tickHandle = tapestry.scheduler.nextTick(raycastLoop);
  };
  
  // Start the loop
  mod.tickHandle = tapestry.scheduler.nextTick(raycastLoop);
  console.log("TWILA raycasting started");
}

/**
 * Updates overlay visibility based on current target
 */
function updateOverlayVisibility(mod: any) {
  const { tapestry } = mod;
  const hasTarget = mod.currentTarget !== null;
  
  if (hasTarget && !mod.isVisible) {
    // Show overlay
    tapestry.client.overlay.setVisible("twila", mod.overlayId, true);
    mod.isVisible = true;
    console.log("TWILA overlay shown:", mod.currentTarget?.blockName);
  } else if (!hasTarget && mod.isVisible) {
    // Hide overlay
    tapestry.client.overlay.setVisible("twila", mod.overlayId, false);
    mod.isVisible = false;
    console.log("TWILA overlay hidden");
  }
}

// Register mod with Tapestry
console.log("TWILA mod definition loaded");
tapestry.mod.define(twilaMod);
