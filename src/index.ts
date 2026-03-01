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
let schedulerTaskActive = false;
let twilaModId: string | null = null; // Store mod ID for later use

// ======================================================
// 2. LIFECYCLE HOOKS
// ======================================================

function runStartupDiagnostics() {
  console.log("=== TWILA ENVIRONMENT ===");
  console.log(`scheduler: ${!!tapestry.scheduler}`);
  console.log(`players API: ${!!tapestry.client?.players}`);
  console.log(`overlay API: ${!!tapestry.client?.overlay}`);
  console.log(`events API: ${!!tapestry.events}`);
  console.log(`mod API: ${!!tapestry.mod}`);
  console.log(`client API: ${!!tapestry.client}`);
  console.log("=========================");
  
  // Test individual API methods
  try {
    if (tapestry.client?.players) {
      console.log(`[TWILA] Players API methods available: ${JSON.stringify({
        "getLocal": typeof tapestry.client.players.getLocal,
        "getPosition": typeof tapestry.client.players.getPosition,
        "getLook": typeof tapestry.client.players.getLook,
        "raycastBlock": typeof tapestry.client.players.raycastBlock
      })}`);
    }
  } catch (e) {
    console.error("[TWILA] Error testing players API:", e);
  }
  
  try {
    if (tapestry.client?.overlay) {
      console.log(`[TWILA] Overlay API methods available: ${JSON.stringify({
        "register": typeof tapestry.client.overlay.register,
        "setVisible": typeof tapestry.client.overlay.setVisible
      })}`);
    }
  } catch (e) {
    console.error("[TWILA] Error testing overlay API:", e);
  }
}

function hookLifecycleEvents() {
  // APIs are not available during TS_ACTIVATE phase
  // The global registration function will be called by Tapestry when client APIs are ready
  console.log("[TWILA] Exposing global registration function for Tapestry");
  
  // Expose function globally for Tapestry to call when APIs are available
  (globalThis as any).twilaRegisterEvents = function() {
    console.log("[TWILA] Global registration function called - APIs should be available");
    
    // Initialize systems immediately - APIs are now ready
    console.log("[TWILA] Initializing systems directly (APIs available)");
    initializeTwilaSystems();
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
      // Store mod ID for later use
      twilaModId = "twila";
      
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
    console.log(`[TWILA] Attempting raycast with options: ${JSON.stringify(options)}`);
    const result = tapestry.client.players.raycastBlock(options);
    console.log(`[TWILA] Raycast result: ${JSON.stringify(result)}`);
    return result;
  } catch (e) {
    console.error("[TWILA] Raycasting failed:", e);
    fatal("Raycasting failed", e);
    return null;
  }
}

// Overlay Adapter
function registerOverlay(definition: any) {
  if (twilaState === TwilaState.DISABLED) return;
  
  try {
    console.log(`[TWILA] Registering overlay with definition: ${JSON.stringify(definition)}`);
    console.log(`[TWILA] tapestry.client.overlay exists: ${!!tapestry.client?.overlay}`);
    console.log(`[TWILA] tapestry.client.overlay.register type: ${typeof tapestry.client?.overlay?.register}`);
    
    if (!tapestry.client?.overlay) {
      throw new Error("tapestry.client.overlay is undefined");
    }
    
    if (!tapestry.client.overlay.register) {
      throw new Error("tapestry.client.overlay.register is not a function");
    }
    
    // Store current context and set mod context for registration
    console.log("[TWILA] Setting execution context for overlay registration");
    
    tapestry.client.overlay.register(definition);
    console.log("[TWILA] Overlay registration successful");
  } catch (e) {
    console.error("[TWILA] Overlay registration failed:", e);
    console.error("[TWILA] Error details:", {
      message: e.message,
      stack: e.stack,
      name: e.name
    });
    fatal("Overlay registration failed", e);
  }
}

function setOverlayVisibility(modId: string, overlayId: string, visible: boolean) {
  if (twilaState === TwilaState.DISABLED) return;
  
  try {
    console.log(`[TWILA] Setting overlay visibility: mod=${modId}, overlay=${overlayId}, visible=${visible}`);
    tapestry.client.overlay.setVisible(modId, overlayId, visible);
    console.log("[TWILA] Overlay visibility set successfully");
  } catch (e) {
    console.error("[TWILA] Failed to set overlay visibility:", e);
    fatal("Failed to set overlay visibility", e);
  }
}

// Scheduler Adapter
function scheduleNextTick(fn: () => void) {
  if (twilaState === TwilaState.DISABLED) return;
  
  try {
    console.log("[TWILA] About to call tapestry.scheduler.nextTick");
    tapestry.scheduler.nextTick(fn);
    console.log("[TWILA] Successfully called tapestry.scheduler.nextTick");
  } catch (e) {
    console.error("[TWILA] Scheduler failed:", e);
    fatal("Scheduler failed", e);
  }
}

// ======================================================
// 4. SYSTEMS (raycast, overlay)
// ======================================================

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
    // Test API availability first
    console.log("[TWILA] === API AVAILABILITY CHECK ===");
    console.log(`[TWILA] tapestry.client exists: ${!!tapestry.client}`);
    console.log(`[TWILA] tapestry.client.players exists: ${!!tapestry.client?.players}`);
    console.log(`[TWILA] tapestry.client.overlay exists: ${!!tapestry.client?.overlay}`);
    console.log(`[TWILA] tapestry.scheduler exists: ${!!tapestry.scheduler}`);
    
    if (tapestry.client?.players) {
      console.log(`[TWILA] Players API methods: ${JSON.stringify({
        "getLocal": typeof tapestry.client.players.getLocal,
        "getPosition": typeof tapestry.client.players.getPosition,
        "getLook": typeof tapestry.client.players.getLook,
        "raycastBlock": typeof tapestry.client.players.raycastBlock
      })}`);
    }
    
    if (tapestry.client?.overlay) {
      console.log(`[TWILA] Overlay API methods: ${JSON.stringify({
        "register": typeof tapestry.client.overlay.register,
        "setVisible": typeof tapestry.client.overlay.setVisible
      })}`);
    }
    
    console.log("[TWILA] === END API CHECK ===");
    
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
  console.log(`[TWILA] schedulerTaskActive set to: ${schedulerTaskActive}`);
  console.log("[TWILA] About to schedule first raycast loop");
  scheduleNextTick(raycastLoop);
  console.log("[TWILA] First raycast loop scheduled");
  
  // Test scheduler with a simple function
  console.log("[TWILA] Testing scheduler with simple test function");
  scheduleNextTick(() => {
    console.log("[TWILA] === SCHEDULER TEST FUNCTION CALLED ===");
  });
  console.log("[TWILA] Scheduler test function scheduled");
}

function createOverlayDefinition() {
  console.log("[TWILA] Creating overlay definition");
  return {
    id: "twila-overlay",
    anchor: "TOP_CENTER",
    zIndex: 10,
    visible: true,
    render: function(ctx: any) {
      console.log("[TWILA] === OVERLAY RENDER FUNCTION CALLED ===");
      console.log(`[TWILA] Overlay render function called, state: ${twilaState}`);
      
      if (twilaState === TwilaState.DISABLED) {
        console.log("[TWILA] Overlay render skipped - mod disabled");
        return;
      }
      
      try {
        const targetData = getCurrentTargetData();
        console.log(`[TWILA] Current target data: ${JSON.stringify(targetData)}`);
        
        if (targetData) {
          console.log(`[TWILA] Rendering overlay with text: ${targetData.blockName}`);
          ctx.text(targetData.blockName, 0, 0);
          console.log("[TWILA] Overlay text rendered successfully");
        } else {
          console.log("[TWILA] No target data to render");
        }
      } catch (e) {
        console.error("[TWILA] Overlay render failed:", e);
      }
    }
  };
}

// ======================================================
// 5. DOMAIN LOGIC
// ======================================================

function processRaycastResult(result: any) {
    console.log(`[TWILA] Processing raycast result: ${JSON.stringify(result)}`);
  
  if (!result.hit) {
    console.log("[TWILA] Raycast missed - clearing target");
    currentTarget = null;
    return;
  }
  
  currentTarget = {
    blockName: result.blockName || "Unknown Block",
    blockId: result.blockId || "unknown",
    position: result.blockPos || {x: 0, y: 0, z: 0}
  };
  
  console.log(`[TWILA] Target updated: ${JSON.stringify(currentTarget)}`);
}

function getCurrentTargetData(): TargetData | null {
  return currentTarget;
}

function raycastLoop() {
  console.log("[TWILA] === RAYCAST LOOP ENTRY ===");
  console.log(`[TWILA] schedulerTaskActive: ${schedulerTaskActive}, twilaState: ${twilaState}`);
  
  if (twilaState === TwilaState.DISABLED || !schedulerTaskActive) {
    console.log(`[TWILA] Raycast loop stopped - state: ${twilaState}, schedulerActive: ${schedulerTaskActive}`);
    return;
  }
  
  try {
    console.log("[TWILA] About to perform raycast");
    const result = performRaycast({
      maxDistance: 32.0,
      includeFluids: false
    });
    
    if (result) {
      processRaycastResult(result);
    } else {
      console.log("[TWILA] Raycast returned null result");
    }
    
    // Schedule next tick
    console.log("[TWILA] Scheduling next raycast tick");
    scheduleNextTick(raycastLoop);
    
  } catch (e) {
    console.error("[TWILA] Raycast loop failed:", e);
    fatal("Raycast loop failed", e);
  }
}

// ======================================================
// 6. BOOTSTRAP
// ======================================================

// Register mod with Tapestry
tapestry.mod.define(twilaMod);
