---
layout: home

hero:
  name: "TWILA"
  text: "That's What I'm Looking At"
  tagline: "A client-side block and entity identification overlay mod for the Tapestry platform."
  image:
    src: /banner.jpg
    alt: TWILA Banner
  actions:
    - theme: brand
      text: View on GitHub
      link: https://github.com/alizzycraft/twila
    - theme: alt
      text: Download
      link: https://github.com/alizzycraft/twila/releases/latest
    - theme: alt
      text: Tapestry API
      link: https://alizzycraft.github.io/tapestry/

features:
  - title: Real-time Target Identification
    details: >
      Shows block and entity names instantly as you look at them. Built with client-side raycasting for zero server dependency.

  - title: Entity Support
    details: >
      Detects both blocks and entities with position tracking. Works seamlessly in single-player and multiplayer environments.

  - title: Performance Optimized
    details: >
      Game tick-based raycasting with smart miss tracking. Minimal overhead with efficient memory usage and conditional rendering.

  - title: Clean UI
    details: >
      Minimal text overlay at top-center of screen. Simple, unobtrusive design that doesn't interfere with gameplay.

  - title: Robust Error Handling
    details: >
      Comprehensive diagnostics and graceful degradation. Debug mode with enhanced logging for troubleshooting.

  - title: Built on Tapestry
    details: >
      Leverages Tapestry's TypeScript-first framework with safe API boundaries and explicit lifecycle management.
---

## Overview

TWILA provides real-time identification of blocks and entities under your reticle using client-side raycasting. Built entirely on Tapestry's TypeScript-first modding framework with safe API boundaries and explicit lifecycle management.

---

## Features

### Real-time Target Identification
Shows block and entity names instantly as you look at them

### Entity Support
Detects both blocks and entities with position tracking

### Client-side Only
Zero server dependency, works in single-player and multiplayer

### Performance Optimized
Game tick-based raycasting with smart miss tracking

### Clean UI
Minimal text overlay at top-center of screen

### Robust Error Handling
Comprehensive diagnostics and graceful degradation

### Debug Mode
Enhanced logging and test overlays for troubleshooting

---

## Architecture

### Built on Tapestry Platform

TWILA leverages Tapestry's core capabilities:

- **Lifecycle Management**: Uses `activate`/`deactivate` hooks with deferred initialization
- **Type Safety**: Full TypeScript definitions for all Tapestry APIs
- **Client APIs**: Uses `tapestry.client.players.raycastBlock()` and `tapestry.client.overlay`
- **Scheduler**: Game tick integration via `tapestry.scheduler.nextTick()`
- **State Management**: Internal state machine (INITIALIZING → RUNNING → DISABLED)

### Lifecycle Operation

TWILA uses a deferred initialization pattern:

1. **Mod Registration**: `tapestry.mod.define()` registers the mod with Tapestry
2. **Activation**: `activate()` function called by Tapestry, exposes global registration function
3. **API Ready**: Tapestry calls `twilaRegisterEvents()` when client APIs are available
4. **System Initialization**: Overlay and raycasting systems start
5. **Runtime**: Continuous raycasting loop with automatic target updates

This approach ensures all Tapestry APIs are fully available before TWILA attempts to use them.

---

## Installation

### Prerequisites

1. **Java 21**: Required for Tapestry and TWILA
2. **Fabric Loader**: Minecraft mod loading system
3. **Tapestry Platform**: Core framework dependency

### Quick Install

1. **Build Both Projects**: See BUILD.md for detailed build instructions
2. **Copy JARs**: Place both `tapestry-*.jar` and `twila-*.jar` in `mods/`
3. **Launch**: Start Minecraft with Fabric Loader

### Manual Install

```bash
# Copy built JARs to Minecraft mods folder
cp twila/build/libs/twila-*.jar ~/.minecraft/mods/
```

**Note**: This only installs TWILA. You'll also need to build and install the Tapestry platform separately.

---

## API Usage

### State Management

TWILA uses an internal state machine for robust lifecycle management:

```ts
enum TwilaState {
  INITIALIZING = "INITIALIZING",  // Mod loading, APIs not ready
  RUNNING = "RUNNING",              // Active raycasting and overlay
  DISABLED = "DISABLED"             // Fatal error or deactivated
}
```

### Client-Side Raycasting

```ts
const result = tapestry.client.players.raycastBlock({
  maxDistance: 32.0,
  includeFluids: true
});

if (result.hit) {
  // Block detection
  if (result.blockName) {
    console.log(`Block: ${result.blockName} (${result.blockId})`);
    console.log(`Position: ${JSON.stringify(result.blockPos)}`);
  }
  
  // Entity detection
  if (result.entityName) {
    console.log(`Entity: ${result.entityName} (${result.entityId})`);
    console.log(`Position: ${JSON.stringify(result.entityPos)}`);
  }
}
```

### Overlay System

TWILA uses a simple object-based overlay definition:

```ts
const overlay = {
  id: "twila-overlay",
  anchor: "TOP_CENTER",
  zIndex: 10,
  visible: true,
  render: function(ctx) {
    if (currentTarget) {
      return {
        type: "text",
        content: currentTarget.blockName,
        x: 0,
        y: 8,
        color: "#FFFFFF"
      };
    }
    return null;
  }
};

tapestry.client.overlay.register(overlay);
```

### Game Tick Integration

```ts
function raycastLoop() {
  if (twilaState !== TwilaState.RUNNING) return;
  
  // Perform raycast
  const result = tapestry.client.players.raycastBlock({
    maxDistance: 32.0,
    includeFluids: true
  });
  
  // Process result
  if (result.hit) {
    currentTarget = {
      blockName: result.blockName || result.entityName,
      blockId: result.blockId || result.entityId,
      targetType: result.entityId ? "entity" : "block",
      position: result.blockPos || result.entityPos
    };
  }
  
  // Schedule next tick
  tapestry.scheduler.nextTick(raycastLoop);
}
```

### Smart Miss Tracking

TWILA implements consecutive miss tracking to prevent flickering:

```ts
const MISS_CLEAR_THRESHOLD = 4;
let consecutiveMisses = 0;

if (!result.hit) {
  consecutiveMisses++;
  if (consecutiveMisses >= MISS_CLEAR_THRESHOLD) {
    currentTarget = null;  // Clear after 4 consecutive misses
  }
} else {
  consecutiveMisses = 0;  // Reset on hit
}
```

---

## Configuration

TWILA currently uses hardcoded configuration values:

- **Update Rate**: Every game tick (20Hz via scheduler)
- **Max Distance**: 32.0 blocks
- **Include Fluids**: true (water, lava detection enabled)
- **UI Anchor**: TOP_CENTER
- **UI Offset**: x: 0, y: 8 pixels
- **Text Color**: #FFFFFF (white)
- **Miss Threshold**: 4 consecutive misses before clearing target
- **Z-Index**: 10

### Debug Flags

For development, you can modify these flags in `src/index.ts`:

```ts
const DEBUG_DISABLE_RAYCAST = false;  // Disable raycasting system
const DEBUG_DISABLE_OVERLAY = false;  // Disable overlay system
```

Future versions may include runtime configuration options.

---

## Performance

### Optimizations

- **Game Tick Scheduling**: Respects Minecraft's natural timing via `scheduler.nextTick()`
- **Smart Miss Tracking**: Prevents flickering with 4-tick threshold
- **Conditional Rendering**: Overlay returns null when no target
- **Memory Efficient**: Single target object, no persistent collections
- **Client-Side Only**: No network overhead
- **Graceful Degradation**: Fatal errors disable systems cleanly

### Benchmarks

- **Raycast Cost**: < 5ms per tick (client-side only)
- **Memory Usage**: Minimal (single TargetData object)
- **UI Updates**: Automatic via overlay render function
- **State Transitions**: Instant with fail-fast error handling

---

## Troubleshooting

### Common Issues

1. **Mod Not Loading**
   - Verify Tapestry JAR is in mods folder
   - Check Java 21 is being used
   - Ensure Fabric Loader is up to date
   - Look for `[TWILA] Starting activation...` in console

2. **No Overlay Displayed**
   - Check for `[TWILA] Overlay registration successful` in logs
   - Verify `[TWILA] All systems initialized successfully`
   - Ensure raycasting is working (look for raycast result logs)
   - Check that `twilaState` is RUNNING

3. **APIs Not Available**
   - Look for `[TWILA] Global registration function called` in logs
   - Check API availability diagnostics at startup
   - Verify Tapestry version compatibility
   - Ensure `twilaRegisterEvents()` is being called

4. **Build Failures**
   - Install TypeScript globally: `npm install -g typescript`
   - Clean with `./gradlew clean build`
   - Verify TypeScript compiler: `tsc --version`
   - Check that `dist/` directory is created after tsc

### Debug Information

TWILA logs comprehensive diagnostics to console:

**Startup:**
- `[TWILA] Starting activation...` - Mod initialization begins
- `[TWILA] === TWILA ENVIRONMENT ===` - API availability check
- `[TWILA] Global registration function called` - APIs ready
- `[TWILA] All systems initialized successfully` - Ready to run

**Runtime:**
- `[TWILA] === RAYCAST LOOP ENTRY ===` - Each tick (if verbose logging enabled)
- `[TWILA] Raycast result: {...}` - Hit/miss detection
- `[TWILA] Target updated: {...}` - New target acquired

**Errors:**
- `[TWILA:FATAL]` - Critical error, mod disabled
- `[TWILA] Error details:` - Full error context with stack trace

### State Inspection

Check current state in logs:
- `twilaState: INITIALIZING` - Still loading
- `twilaState: RUNNING` - Operating normally
- `twilaState: DISABLED` - Fatal error occurred

---

## Build Instructions

### Prerequisites
- Node.js 18+ for TypeScript compilation
- Gradle 8.0+ for Java build
- Global TypeScript compiler (`tsc`) recommended

### Build Commands

```bash
# Install dependencies (if using local npm)
npm install

# Build TypeScript (using global tsc)
tsc --project ./tsconfig.json

# Build JAR (includes TypeScript output)
./gradlew build

# Quick build (Windows)
./build-twila.bat

# Quick build (Linux/Mac)
chmod +x ./build-twila.sh && ./build-twila.sh

# Debug build with enhanced logging (Windows)
./build-debug.bat

# Debug build with enhanced logging (Linux/Mac)
chmod +x ./build-debug.sh && ./build-debug.sh

# Basic build without extras (Windows)
./build-basic.bat
```

### Debug Mode

For troubleshooting mod loading and runtime issues, use debug builds which provide:

#### TWILA Debug Features
- **Enhanced console logging** with detailed execution traces
- **API availability checks** for all Tapestry components at startup
- **Detailed error reporting** with full stack traces
- **Raycast result logging** with JSON output for every hit/miss
- **State transition tracking** (INITIALIZING → RUNNING → DISABLED)

#### Tapestry Debug Features
- **Platform-level debugging** for core Tapestry functionality
- **Enhanced error reporting** for mod loading issues
- **Development logging** for API interactions

#### JAR Naming
- **Normal builds**: `twila-1.0.0.jar`
- **Debug builds**: `twila-1.0.0-debug.jar`

Debug logs appear in Minecraft console with `[TWILA]` prefix. Look for startup diagnostics showing API availability and system initialization status.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code structure and patterns
4. Add comprehensive logging for debugging
5. Test with both single-player and multiplayer
6. Ensure TypeScript compiles without errors
7. Submit a pull request

### Code Style

- Use TypeScript strict mode
- Add JSDoc comments for public functions
- Follow the state machine pattern for lifecycle
- Use adapter functions for all Tapestry API calls
- Implement fail-fast error handling with `fatal()`

---

## License

AGPL-3.0 License - see LICENSE file for details.

## Credits

- **Tapestry Platform**: Core TypeScript-first modding framework
- **Fabric Loader**: Minecraft mod loading system
