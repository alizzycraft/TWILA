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
  // Log phase transitions if available
  if (tapestry.phase && tapestry.phase.onAny) {
    tapestry.phase.onAny((phase: string) => {
      console.log("[TWILA] Phase:", phase);
    });
  }
  
  // Hook into runtime start event
  if (tapestry.events && tapestry.events.on) {
    tapestry.events.on("platform", "engine:runtimeStart", () => {
      console.log("[TWILA] Runtime started - initializing systems");
      initializeTwilaSystems();
    });
  } else {
    console.log("[TWILA] Events not yet available - will retry");
  }
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
