@echo off
echo Building TWILA File Test...

echo Building TypeScript (file test)...
npx tsc --project ./tsconfig.json
if errorlevel 1 (
    echo TypeScript build failed!
    pause
    exit /b 1
)

echo Copying file test entry point...
copy /Y "dist\file-test.js" "dist\index.js"
if errorlevel 1 (
    echo Failed to copy file test entry point!
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

echo Renaming JAR with file test suffix...
rename "build\libs\twila-1.0.0.jar" "twila-1.0.0-file-test.jar"
if errorlevel 1 (
    echo Failed to rename JAR!
    pause
    exit /b 1
)

echo Copying to mods directory...
copy /Y "build\libs\twila-1.0.0-file-test.jar" "%APPDATA%\.minecraft\mods\"
if errorlevel 1 (
    echo Failed to copy JAR to mods directory!
    pause
    exit /b 1
)

echo.
echo ✅ TWILA FILE TEST build completed!
echo 📝 Check for twila-test.log in mods folder
echo 📦 File test JAR: twila-1.0.0-file-test.jar
echo.
pause
