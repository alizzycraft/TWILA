# TWILA Debugging Checklist

## ✅ Build Verification
- [x] TWILA JAR built successfully (5.6KB)
- [x] Tapestry JAR built successfully (377KB)
- [x] Both JARs copied to mods directory
- [x] TypeScript code compiled and included in JAR
- [x] Java extension class compiled and included

## 🔍 Potential Issues to Check

### 1. Minecraft Launch Issues
- Check if Fabric Loader is properly installed
- Verify Java 21 is being used
- Look for any error messages during startup

### 2. Mod Loading Issues
- Check if Tapestry is loading first
- Verify TWILA extension is being registered
- Look for any dependency conflicts

### 3. Runtime Issues
- Check console for "TWILA loading..." message
- Look for "TWILA enabled" message
- Verify overlay registration

### 4. API Issues
- Check if tapestry.client.players.raycastBlock exists
- Verify tapestry.client.overlay.register exists
- Check if tapestry.scheduler.nextTick works

## 📋 Debug Steps

### Step 1: Check Minecraft Logs
1. Launch Minecraft with Fabric Loader
2. Check the game log for:
   - "TWILA loading..." (should appear during TS_READY)
   - "TWILA enabled" (should appear during RUNTIME)
   - Any error messages related to TWILA or Tapestry

### Step 2: Check Console Output
1. Press F3 + T to reload resources (may trigger mod messages)
2. Look for any red error messages in chat
3. Check if overlay appears when looking at blocks

### Step 3: Verify Dependencies
1. Ensure Tapestry JAR is loaded before TWILA
2. Check fabric.mod.json dependencies are correct
3. Verify mod.json entry point is correct

### Step 4: Test API Functions
If mod loads but overlay doesn't show:
- Check if raycast is returning results
- Verify overlay registration succeeded
- Test with different block types

## 🐛 Common Issues

### Issue: No console messages
**Cause**: Mod not loading at all
**Fix**: Check Fabric Loader installation and Java version

### Issue: "TWILA loading..." but no "TWILA enabled"
**Cause**: Error during RUNTIME phase
**Fix**: Check for API availability issues

### Issue: "TWILA enabled" but no overlay
**Cause**: Raycast not working or overlay not visible
**Fix**: Check API function calls and overlay positioning

### Issue: Overlay shows but no block names
**Cause**: Raycast returning empty results
**Fix**: Check raycast parameters and block detection

## 🔧 Quick Fixes

1. **Rebuild both mods**:
   ```bash
   cd tapestry && ./gradlew clean build
   cd ../twila && ./gradlew clean build
   ```

2. **Check Fabric Loader**:
   - Ensure using latest Fabric Loader
   - Verify Java 21 is default

3. **Test with simple overlay**:
   - Temporarily remove raycast logic
   - Show overlay with static text

4. **Check API contracts**:
   - Verify Tapestry API hasn't changed
   - Check function signatures match
