// File-based test to see if TWILA loads
console.log("🔥 TWILA FILE TEST: Starting...");

// Try to write to a file in the mods directory
try {
  const fs = require('fs');
  const path = require('path');
  
  const logFile = path.join('./twila-test.log');
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] TWILA FILE TEST: Mod loaded successfully!\n`;
  
  fs.writeFileSync(logFile, message);
  console.log("🔥 TWILA FILE TEST: Log file written!");
} catch (error) {
  console.error("❌ TWILA FILE TEST: Error writing file:", error);
}

console.log("🔥 TWILA FILE TEST: Completed");
