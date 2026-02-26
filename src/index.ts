declare var tapestry: any;

/**
 * TWILA - That's What I'm Looking At
 * 
 * Client-side block identification overlay mod for Tapestry
 */
const twilaMod = {
  id: "twila",
  version: "1.0.0",
  activate: function(tapestry: any) {
    try {
      // Initialize mod during TS_ACTIVATE phase
      console.log("=== TWILA ACTIVATE START ===");
      console.log("TWILA loading...");
      
      // Store mod reference for later use
      (globalThis as any).twilaMod = {
        tapestry,
        currentTarget: null,
        overlayId: "twila-overlay",
        tickHandle: null,
        isVisible: false
      };
      
      console.log("TWILA: Mod reference stored");
      
      // Register event listener for client presentation ready
      tapestry.mod.on("platform", "engine:runtimeStart", () => {
        console.log("=== TWILA: engine:runtimeStart EVENT RECEIVED ===");
        console.log("TWILA: Client presentation ready - initializing overlay and raycasting");
        
        try {
          // Register overlay
          registerOverlay((globalThis as any).twilaMod);
          
          // Start raycasting loop
          startRaycasting((globalThis as any).twilaMod);
          
        } catch (error) {
          console.log(`TWILA: Client initialization error: ${error.toString()}`);
        }
      });
      
      console.log("TWILA activate function completed successfully");
      console.log("=== TWILA ACTIVATE END ===");
      
    } catch (error) {
      console.log("=== TWILA ACTIVATE ERROR ===");
      console.log(`TWILA: Activate function error: ${error.toString()}`);
      console.log(`TWILA: Error stack: ${error.stack || 'No stack available'}`);
      console.log("=== END TWILA ACTIVATE ERROR ===");
    }
  },
  
  deactivate: function(tapestry: any) {
    // Cleanup when mod is deactivated
    console.log("TWILA deactivating...");
    
    const mod = (globalThis as any).twilaMod;
    if (mod && mod.tickHandle) {
      // Stop raycasting loop
      mod.tickHandle = null;
    }
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
      if (mod.currentTarget) {
        return {
          type: "text",
          text: `Looking at: ${mod.currentTarget.blockName}`,
          color: 0xFFFFFF,
          x: 10,
          y: 10
        };
      }
      return null;
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
      // Get player position and look direction per spec
      const player = tapestry.client.players.getLocal();
      if (player && player.position && player.look) {
        const position = player.position;
        const look = player.look;
        
        // Raycast with options per spec
        const result = tapestry.client.players.raycastBlock({
          maxDistance: 32.0,
          includeFluids: false,
          includeEntities: false
        });
        
        if (result && result.hit) {
          // Extract block name using contract order per spec
          let blockName = "Unknown Block";
          
          if (result.blockName && typeof result.blockName === 'string') {
            blockName = result.blockName;
          } else if (result.blockId && typeof result.blockId === 'string') {
            blockName = result.blockId;
          }
          
          mod.currentTarget = { blockName };
          updateOverlayVisibility(mod);
          console.log(`TWILA: Looking at: ${blockName}`);
        } else {
          mod.currentTarget = null;
          updateOverlayVisibility(mod);
          console.log("TWILA: No block in sight");
        }
      } else {
        console.log("TWILA: ERROR - Could not get player position/look");
      }
      
    } catch (error) {
      console.log(`TWILA: Raycast error: ${error.toString()}`);
    }
    
    // Schedule next tick using scheduler per spec
    if (typeof tapestry.scheduler !== 'undefined' && tapestry.scheduler.nextTick) {
      tapestry.scheduler.nextTick(raycastLoop);
    } else {
      // Fallback to simple timeout
      console.log("TWILA: Scheduler not available - raycasting will stop");
    }
  };
  
  // Start loop
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
tapestry.mod.define(twilaMod);

