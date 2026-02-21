// Basic test to see if TWILA loads at all
console.log("🔥 TWILA BASIC TEST: File loaded!");

// Try to import tapestry
try {
  const tapestry = (globalThis as any).tapestry;
  console.log("🔥 TWILA BASIC TEST: tapestry global:", typeof tapestry);
  
  if (tapestry) {
    console.log("🔥 TWILA BASIC TEST: tapestry.mod:", typeof tapestry.mod);
    console.log("🔥 TWILA BASIC TEST: tapestry.mod.define:", typeof tapestry.mod?.define);
    
    if (tapestry.mod && tapestry.mod.define) {
      console.log("🔥 TWILA BASIC TEST: Defining mod...");
      
      const basicMod = {
        id: "twila",
        onLoad: function() {
          console.log("🔥 TWILA BASIC TEST: onLoad called!");
        },
        onEnable: function() {
          console.log("🔥 TWILA BASIC TEST: onEnable called!");
        }
      };
      
      tapestry.mod.define(basicMod);
      console.log("🔥 TWILA BASIC TEST: Mod defined!");
    } else {
      console.log("❌ TWILA BASIC TEST: tapestry.mod.define not available");
    }
  } else {
    console.log("❌ TWILA BASIC TEST: tapestry global not found");
  }
} catch (error) {
  console.error("❌ TWILA BASIC TEST: Error:", error);
}

console.log("🔥 TWILA BASIC TEST: Script completed");
