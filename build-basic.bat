@echo off
echo Building TWILA Basic Test...

echo Building with Gradle (includes TypeScript compilation)...
gradlew.bat clean build
if errorlevel 1 (
    echo Gradle build failed!
    pause
    exit /b 1
)

echo Renaming JAR with basic test suffix...
move "build\libs\twila-1.0.0.jar" "build\libs\twila-1.0.0-basic.jar"
if errorlevel 1 (
    echo Failed to rename JAR!
    pause
    exit /b 1
)

echo Copying Twila JAR to mods directory...
powershell -Command "Copy-Item 'build\libs\twila-1.0.0-basic.jar' '$env:APPDATA\.minecraft\mods\' -Force"
if errorlevel 1 (
    echo Failed to copy Twila JAR to mods directory!
    pause
    exit /b 1
)

echo Copying Tapestry JAR to mods directory...
powershell -Command "Copy-Item '..\tapestry\build\libs\tapestry-0.2.3.jar' '$env:APPDATA\.minecraft\mods\' -Force"
if errorlevel 1 (
    echo Failed to copy Tapestry JAR to mods directory!
    pause
    exit /b 1
)

echo.
echo ✅ TWILA BASIC TEST build completed!
echo 🔥 Look for "Twila mod loaded successfully!" in console
echo 📦 Twila JAR: twila-1.0.0-basic.jar
echo 📦 Tapestry JAR: tapestry-0.2.3.jar
echo.
pause
