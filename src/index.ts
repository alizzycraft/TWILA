declare var tapestry: any;

/**
 * TWILA - That's What I'm Looking At
 * 
 * Client-side block identification overlay mod for Tapestry
 */

// ======================================================
// 1. STATE & CONFIGURATION
// ======================================================

enum TwilaState {
  INITIALIZING = "INITIALIZING",
  RUNNING = "RUNNING", 
  DISABLED = "DISABLED"
}

let twilaState: TwilaState = TwilaState.INITIALIZING;

// Feature flags for subsystem isolation
const DEBUG_DISABLE_RAYCAST = false;
const DEBUG_DISABLE_OVERLAY = false;

// Current target data
interface TargetData {
  blockName: string;
  blockId: string;
  position: {x: number, y: number, z: number};
}

let currentTarget: TargetData | null = null;

// ======================================================
// 2. LIFECYCLE HOOKS
// ======================================================

function runStartupDiagnostics() {
  console.log("=== TWILA ENVIRONMENT ===");
  console.log("scheduler:", !!tapestry.scheduler);
  console.log("players API:", !!tapestry.client?.players);
  console.log("overlay API:", !!tapestry.client?.overlay);
  console.log("events API:", !!tapestry.events);
  console.log("=========================");
}

function hookLifecycleEvents() {
  // Neither scheduler nor events available during TS_ACTIVATE
  // Expose global function for Tapestry to call when APIs are ready
  console.log("[TWILA] Exposing global registration function for Tapestry");
  
  // Expose function globally for Tapestry to call when APIs are available
  (globalThis as any).twilaRegisterEvents = function() {
    console.log("[TWILA] Global registration function called - APIs should be available");
    
    // Check both possible event API locations
    console.log("[TWILA] Available APIs:", {
      "tapestry.events": !!tapestry.events,
      "tapestry.mod.on": !!tapestry.mod?.on,
      "tapestry.events.on": !!(tapestry.events && tapestry.events.on),
      "tapestry.mod.events.on": !!(tapestry.mod?.events && tapestry.mod.events.on)
    });
    
    // Try different API paths for event registration
    let eventRegistered = false;
    
    // Try tapestry.mod.on first (likely correct)
    if (tapestry.mod && tapestry.mod.on) {
      try {
        console.log("[TWILA] Attempting registration via tapestry.mod.on");
        console.log("[TWILA] tapestry.mod.on type:", typeof tapestry.mod.on);
        console.log("[TWILA] tapestry.mod.on function signature test:");
        
        // Test function with different approaches
        try {
          // Test 1: Try simple event registration
          console.log("[TWILA] Test 1: Simple registration");
          tapestry.mod.on("engine:runtimeStart", () => {
            console.log("[TWILA] Runtime started - initializing systems");
            initializeTwilaSystems();
          });
          console.log("[TWILA] Test 1: Simple registration succeeded");
          eventRegistered = true;
        } catch (e1) {
          console.log("[TWILA] Test 1 failed:", e1.message);
          console.log("[TWILA] Test 1 error stack:", e1.stack);
        }
        
      } catch (e) {
        console.log("[TWILA] tapestry.mod.on failed:", e.message);
        console.log("[TWILA] tapestry.mod.on error stack:", e.stack);
      }
    }
    
    // Fallback: try tapestry.events.on
    if (!eventRegistered && tapestry.events && tapestry.events.on) {
      try {
        tapestry.events.on("platform", "engine:runtimeStart", () => {
          console.log("[TWILA] Runtime started - initializing systems");
          initializeTwilaSystems();
        });
        console.log("[TWILA] Successfully registered for engine:runtimeStart event via tapestry.events.on");
        eventRegistered = true;
      } catch (e) {
        console.log("[TWILA] tapestry.events.on failed:", e.message);
      }
    }
    
    if (!eventRegistered) {
      console.error("[TWILA] Failed to register for engine:runtimeStart event - no working event API found");
    }
  };
  
  console.log("[TWILA] Global function twilaRegisterEvents exposed");
}

function fatal(reason: string, err?: any) {
  console.error("[TWILA:FATAL]", reason, err);
  twilaState = TwilaState.DISABLED;
  // Cleanup resources
  stopScheduler();
  hideOverlay();
}
const twilaMod = {
  id: "twila",
  version: "1.0.0",
  activate: function(tapestry: any) {
    console.log("[TWILA] Starting activation...");
    
    try {
      // Store tapestry reference
      (globalThis as any).twilaMod = {
        tapestry,
        state: TwilaState.INITIALIZING,
        overlayId: "twila-overlay"
      };
      
      // Run diagnostics
      runStartupDiagnostics();
      
      // Hook into lifecycle
      hookLifecycleEvents();
      
      console.log("[TWILA] Activation complete");
      
    } catch (error) {
      fatal("Activation failed", error);
    }
  },
  
  deactivate: function(tapestry: any) {
    console.log("[TWILA] Deactivating...");
    twilaState = TwilaState.DISABLED;
    stopScheduler();
    hideOverlay();
    console.log("[TWILA] Deactivation complete");
  },
};

// ======================================================
// 3. RUNTIME ADAPTERS (API WRAPPERS)
// ======================================================

// Player API Adapter
function getPlayerPosition(): {x: number, y: number, z: number} | null {
  if (twilaState === TwilaState.DISABLED) return null;
  
  try {
    return tapestry.client.players.getPosition();
  } catch (e) {
    fatal("Failed to get player position", e);
    return null;
  }
}

function getPlayerLook(): {pitch: number, yaw: number} | null {
  if (twilaState === TwilaState.DISABLED) return null;
  
  try {
    return tapestry.client.players.getLook();
  } catch (e) {
    fatal("Failed to get player look direction", e);
    return null;
  }
}

// Raycasting Adapter  
function performRaycast(options: {maxDistance: number, includeFluids: boolean}) {
  if (twilaState === TwilaState.DISABLED) return null;
  
  try {
    return tapestry.client.players.raycastBlock(options);
  } catch (e) {
    fatal("Raycasting failed", e);
    return null;
  }
}

// Overlay Adapter
function registerOverlay(definition: any) {
  if (twilaState === TwilaState.DISABLED) return;
  
  try {
    tapestry.client.overlay.register(definition);
  } catch (e) {
    fatal("Overlay registration failed", e);
  }
}

function setOverlayVisibility(modId: string, overlayId: string, visible: boolean) {
  if (twilaState === TwilaState.DISABLED) return;
  
  try {
    tapestry.client.overlay.setVisible(modId, overlayId, visible);
  } catch (e) {
    fatal("Failed to set overlay visibility", e);
  }
}

// Scheduler Adapter
function scheduleNextTick(fn: () => void) {
  if (twilaState === TwilaState.DISABLED) return;
  
  try {
    tapestry.scheduler.nextTick(fn);
  } catch (e) {
    fatal("Scheduler failed", e);
  }
}

// ======================================================
// 4. SYSTEMS (raycast, overlay)
// ======================================================

let schedulerTaskActive = false;

function stopScheduler() {
  schedulerTaskActive = false;
  console.log("[TWILA] Scheduler stopped");
}

function hideOverlay() {
  if ((globalThis as any).twilaMod) {
    setOverlayVisibility("twila", "twila-overlay", false);
  }
}

function initializeTwilaSystems() {
  console.log("[TWILA] Initializing systems...");
  
  try {
    // Initialize overlay first
    if (!DEBUG_DISABLE_OVERLAY) {
      initializeOverlaySystem();
    }
    
    // Then raycasting
    if (!DEBUG_DISABLE_RAYCAST) {
      initializeRaycastSystem();
    }
    
    twilaState = TwilaState.RUNNING;
    console.log("[TWILA] All systems initialized successfully");
    
  } catch (e) {
    fatal("System initialization failed", e);
  }
}

function initializeOverlaySystem() {
  console.log("[TWILA] Initializing overlay system");
  const definition = createOverlayDefinition();
  registerOverlay(definition);
}

function initializeRaycastSystem() {
  console.log("[TWILA] Starting raycasting system");
  schedulerTaskActive = true;
  scheduleNextTick(raycastLoop);
}

function createOverlayDefinition() {
  return {
    id: "twila-overlay",
    anchor: "TOP_CENTER",
    zIndex: 10,
    visible: true,
    render: function(ctx: any) {
      if (twilaState === TwilaState.DISABLED) return;
      
      try {
        const targetData = getCurrentTargetData();
        if (targetData) {
          ctx.text(targetData.blockName, 0, 0);
        }
      } catch (e) {
        console.error("[TWILA] Overlay render failed", e);
      }
    }
  };
}

// ======================================================
// 5. DOMAIN LOGIC
// ======================================================

function processRaycastResult(result: any) {
  if (!result.hit) {
    currentTarget = null;
    return;
  }
  
  currentTarget = {
    blockName: result.blockName,
    blockId: result.blockId,
    position: result.blockPos
  };
  
  console.log("[TWILA] Target:", result.blockName);
}

function getCurrentTargetData(): TargetData | null {
  return currentTarget;
}

function raycastLoop() {
  if (twilaState === TwilaState.DISABLED || !schedulerTaskActive) return;
  
  try {
    const result = performRaycast({
      maxDistance: 32.0,
      includeFluids: false
    });
    
    if (result) {
      processRaycastResult(result);
    }
    
    // Schedule next tick
    scheduleNextTick(raycastLoop);
    
  } catch (e) {
    fatal("Raycast loop failed", e);
  }
}

// ======================================================
// 6. BOOTSTRAP
// ======================================================

// Register mod with Tapestry
tapestry.mod.define(twilaMod);
