@echo off
echo Building TWILA Mod...
npx tsc --project ./tsconfig.json
if errorlevel 1 (
    echo TypeScript build failed!
    pause
    exit /b 1
)

gradlew.bat build
if errorlevel 1 (
    echo TWILA build failed!
    pause
    exit /b 1
)

echo TWILA built successfully!
