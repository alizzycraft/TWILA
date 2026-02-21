@echo off
echo Building TWILA Basic Test...

echo Building TypeScript (basic test)...
npx tsc --project ./tsconfig.json
if errorlevel 1 (
    echo TypeScript build failed!
    pause
    exit /b 1
)

echo Copying basic test entry point...
copy /Y "dist\basic-test.js" "dist\index.js"
if errorlevel 1 (
    echo Failed to copy basic test entry point!
    pause
    exit /b 1
)

echo Building JAR...
gradlew.bat build
if errorlevel 1 (
    echo JAR build failed!
    pause
    exit /b 1
)

echo Renaming JAR with basic test suffix...
rename "build\libs\twila-1.0.0.jar" "twila-1.0.0-basic.jar"
if errorlevel 1 (
    echo Failed to rename JAR!
    pause
    exit /b 1
)

echo Copying to mods directory...
copy /Y "build\libs\twila-1.0.0-basic.jar" "%APPDATA%\.minecraft\mods\"
if errorlevel 1 (
    echo Failed to copy JAR to mods directory!
    pause
    exit /b 1
)

echo.
echo ✅ TWILA BASIC TEST build completed!
echo 🔥 Look for 🔥 TWILA BASIC TEST prefix in console
echo 📦 Basic test JAR: twila-1.0.0-basic.jar
echo.
pause
