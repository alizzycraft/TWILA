// Minimal test - should always execute
print("SCRIPT START");

// Define mod immediately
if (typeof tapestry !== 'undefined' && tapestry.mod && tapestry.mod.define) {
    tapestry.mod.define({
        id: "twila",
        version: "1.0.0",
        onLoad: function() {
            print("TWILA MOD LOADED!");
        }
    });
    print("MOD DEFINED");
} else {
    print("TAPESTRY NOT AVAILABLE");
}

print("SCRIPT END");
