import { TapestryObject, ModDefinition } from "tapestry";

/**
 * TWILA - Debug Version with Enhanced Console Logging
 * 
 * Enhanced logging to debug mod loading issues
 */
const debugMod: ModDefinition = {
  id: "twila",
  onLoad(tapestry: TapestryObject) {
    // Initialize debug logging
    const debugLog = (message: string) => {
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] ${message}`;
      
      // Log to console with distinctive prefix
      console.log(`🔍 TWILA-DEBUG: ${logEntry}`);
    };
    
    debugLog("=== TWILA DEBUG: onLoad phase ===");
    debugLog(`Tapestry object type: ${typeof tapestry}`);
    debugLog(`Tapestry client type: ${typeof tapestry?.client}`);
    debugLog(`Tapestry scheduler type: ${typeof tapestry?.scheduler}`);
    
    // Test individual API components
    if (tapestry?.client) {
      debugLog("✅ tapestry.client is available");
      debugLog(`  - overlay type: ${typeof tapestry.client.overlay}`);
      debugLog(`  - players type: ${typeof tapestry.client.players}`);
    } else {
      debugLog("❌ tapestry.client is NOT available");
    }
    
    if (tapestry?.scheduler) {
      debugLog("✅ tapestry.scheduler is available");
    } else {
      debugLog("❌ tapestry.scheduler is NOT available");
    }
    
    // Store mod reference for later use
    (globalThis as any).twilaMod = {
      tapestry,
      currentTarget: null,
      overlayId: "twila-overlay",
      tickHandle: null,
      isVisible: false,
      debugLog
    };
  },
  onEnable(tapestry: TapestryObject) {
    const mod = (globalThis as any).twilaMod;
    mod.debugLog("=== TWILA DEBUG: onEnable phase ===");
    
    try {
      // Test overlay registration
      if (tapestry?.client?.overlay) {
        mod.debugLog("✅ Attempting to register overlay...");
        
        const testOverlay = {
          id: "debug-overlay",
          anchor: "TOP_CENTER" as const,
          zIndex: 1000, // Very high z-index to be visible
          visible: true, // Start visible
          render: function() {
            mod.debugLog("🎨 Overlay render function called");
            return {
              type: "box",
              padding: 10,
              children: [
                {
                  type: "text",
                  content: "TWILA DEBUG MODE ACTIVE",
                  fontSize: 16
                },
                {
                  type: "text", 
                  content: `Target: ${mod.currentTarget?.blockName || 'None'}`,
                  fontSize: 12
                }
              ]
            };
          }
        };
        
        tapestry.client.overlay.register(testOverlay);
        mod.debugLog("✅ Overlay registered successfully");
        
        // Test visibility
        tapestry.client.overlay.setVisible("twila", "debug-overlay", true);
        mod.debugLog("✅ Overlay visibility set to true");
        
        // Test raycasting
        if (tapestry?.client?.players) {
          mod.debugLog("✅ Testing raycast...");
          try {
            const result = tapestry.client.players.raycastBlock({
              maxDistance: 10,
              includeFluids: false
            });
            mod.debugLog(`🎯 Raycast result: ${JSON.stringify(result)}`);
          } catch (error) {
            mod.debugLog(`❌ Raycast error: ${error}`);
          }
        } else {
          mod.debugLog("❌ tapestry.client.players not available");
        }
        
      } else {
        mod.debugLog("❌ tapestry.client.overlay not available");
      }
      
    } catch (error) {
      mod.debugLog(`❌ onEnable error: ${error}`);
    }
    
    mod.debugLog("=== TWILA DEBUG: onEnable completed ===");
  }
};

console.log("🔍 TWILA DEBUG: Mod definition loaded");
tapestry.mod.define(debugMod);
