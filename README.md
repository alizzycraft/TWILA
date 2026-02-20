# TWILA - That's What I'm Looking At

A client-side block identification overlay mod for the Tapestry platform.

## Overview

TWILA provides real-time identification of blocks under your reticle using client-side raycasting. Built entirely on Tapestry TypeScript-first modding framework, which provides explicit lifecycle management and safe API boundaries.

## Features

- **Real-time Block Identification**: Shows block names instantly as you look at them
- **Client-side Only**: Zero server dependency, works in single-player and multiplayer
- **Performance Optimized**: Game tick-based raycasting with automatic throttling
- **Clean UI**: Minimal overlay with monospace font and smooth fade transitions
- **Tapestry Integration**: Built on Tapestry's explicit lifecycle and type-safe APIs

## Architecture

### Built on Tapestry Platform

TWILA leverages Tapestry's core capabilities:

- **Explicit Lifecycle**: Uses `TS_READY` for initialization and `RUNTIME` for operation
- **Type Safety**: Full TypeScript definitions for all Tapestry APIs
- **Client APIs**: Uses `tapestry.client.players.raycastBlock()` and `tapestry.client.overlay`
- **Scheduler**: Game tick integration via `tapestry.scheduler.nextTick()`
- **UI System**: Mikel templating with UINode structure

### Phase-Based Operation

Tapestry's enforced phases ensure TWILA operates safely:

1. **TS_READY**: Mod registration and overlay setup
2. **RUNTIME**: Active raycasting and UI updates
3. No access to game state before proper initialization

## Installation

### Prerequisites

1. **Java 21**: Required for Tapestry and TWILA
2. **Fabric Loader**: Minecraft mod loading system
3. **Tapestry Platform**: Core framework dependency

### Quick Install

1. **Build Both Projects**: See [BUILD.md](BUILD.md) for detailed build instructions
2. **Copy JARs**: Place both `tapestry-*.jar` and `twila-*.jar` in `mods/`
3. **Launch**: Start Minecraft with Fabric Loader

### Manual Install

```bash
# Copy built JARs to Minecraft mods folder
cp twila/build/libs/twila-*.jar ~/.minecraft/mods/
```

**Note**: This only installs TWILA. You'll also need to build and install the Tapestry platform separately.

## Development

### Project Structure

```
twila/
├── mod.json              # Tapestry metadata
├── fabric.mod.json        # Fabric integration
├── src/
│   ├── index.ts          # Main TypeScript entry
│   └── main/
│       └── java/
│           └── com/
│               └── twila/
│                   └── TwilaExtension.java
├── dist/                 # Compiled TypeScript output
├── build.gradle          # Java/TypeScript build configuration
├── package.json          # Node.js dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

### Building TWILA

#### Prerequisites
- Node.js 18+ for TypeScript compilation (global installation preferred)
- Gradle 8.0+ for Java build
- Global TypeScript compiler (`tsc`) for npm-free builds

#### Build Commands

```bash
# Install dependencies (if using local npm)
npm install

# Build TypeScript (using global tsc)
tsc --project ./tsconfig.json

# Build JAR (includes TypeScript output)
./gradlew build

# One-command build (Windows)
./build-twila.bat

# One-command build (Linux/Mac)
chmod +x ./build-twila.sh && ./build-twila.sh
```

### Tapestry Platform Building

TWILA depends on the Tapestry platform JAR:

```bash
cd tapestry
./gradlew downloadMikel build
```

This downloads the Mikel templating library and builds the core platform.

## API Usage

### Client-Side Raycasting

```ts
const result = tapestry.client.players.raycastBlock({
  maxDistance: 32,
  includeFluids: false
});

if (result.hit) {
  console.log(`Found: ${result.blockName} (${result.blockId})`);
}
```

### Overlay System

```ts
const overlay = {
  id: "twila-overlay",
  anchor: "TOP_CENTER",
  render: () => {
    const template = `<div class="twila-overlay">{{blockName}}</div>`;
    return tapestry.client.overlay.template(template, { blockName });
  }
};

tapestry.client.overlay.register(overlay);
```

### Game Tick Integration

```ts
const raycastLoop = (context) => {
  // Perform raycast
  const result = tapestry.client.players.raycastBlock(options);
  
  // Update overlay
  updateOverlay(result);
  
  // Schedule next tick
  tapestry.scheduler.nextTick(raycastLoop);
};

tapestry.scheduler.nextTick(raycastLoop);
```

## Configuration

TWILA currently uses hardcoded values from the technical specification:

- **Update Rate**: Every game tick (20Hz)
- **Max Distance**: 32 blocks
- **UI Anchor**: Top-center with 20px offset
- **Fade Duration**: 250ms

Future versions may include configuration options.

## Performance

### Optimizations

- **Game Tick Scheduling**: Respects Minecraft's natural timing
- **Conditional Updates**: UI only updates when target changes
- **Memory Efficient**: No persistent object references
- **Client-Side Only**: No network overhead

### Benchmarks

- **Raycast Cost**: < 5ms per tick
- **Memory Usage**: Minimal (stores only current target)
- **UI Updates**: Only when block ID changes

## Troubleshooting

### Common Issues

1. **Mod Not Loading**
   - Verify Tapestry JAR is in mods folder
   - Check Java 21 is being used
   - Ensure Fabric Loader is up to date

2. **No Overlay Displayed**
   - Check console for registration messages
   - Verify client-side raycast is working
   - Check overlay anchor and visibility

3. **Build Failures**
   - Install TypeScript globally: `npm install -g typescript`
   - Clean with `./gradlew clean build`
   - Verify TypeScript compiler is available: `tsc --version`

### Debug Information

TWILA logs to console:
- `"TWILA loading..."` - Mod initialization
- `"TWILA enabled"` - Runtime start
- `"TWILA overlay shown: [block]"` - Target detection
- `"TWILA overlay hidden"` - Target lost

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the technical specification in `docs/tech_spec.md`
4. Test with both single-player and multiplayer
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Credits

- **Tapestry Platform**: Core TypeScript-first modding framework
- **Mikel**: Template processing library
- **Fabric Loader**: Minecraft mod loading system
