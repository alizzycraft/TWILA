import { TapestryObject, ModDefinition } from "tapestry";

/**
 * Simple test to verify TWILA is loading
 */
const testMod: ModDefinition = {
  id: "twila",
  onLoad(tapestry: TapestryObject) {
    console.log("=== TWILA TEST: onLoad phase ===");
    console.log("Tapestry object:", typeof tapestry);
    console.log("Tapestry client:", typeof tapestry?.client);
    console.log("Tapestry scheduler:", typeof tapestry?.scheduler);
  },
  onEnable(tapestry: TapestryObject) {
    console.log("=== TWILA TEST: onEnable phase ===");
    
    // Test simple overlay with UINode structure
    try {
      if (tapestry?.client?.overlay) {
        const testOverlay = {
          id: "test-overlay",
          anchor: "TOP_CENTER" as const,
          render: function() {
            // Return proper UINode structure
            return {
              type: "box",
              padding: 10,
              children: [
                {
                  type: "text",
                  content: "TWILA TEST WORKING!",
                  fontSize: 14
                }
              ]
            };
          }
        };
        
        tapestry.client.overlay.register(testOverlay);
        tapestry.client.overlay.setVisible("twila", "test-overlay", true);
        console.log("=== TWILA TEST: Overlay registered and shown ===");
      } else {
        console.error("=== TWILA TEST: tapestry.client.overlay not available ===");
      }
    } catch (error) {
      console.error("=== TWILA TEST: Overlay error ===", error);
    }
  }
};

console.log("=== TWILA TEST: Mod definition loaded ===");
tapestry.mod.define(testMod);
