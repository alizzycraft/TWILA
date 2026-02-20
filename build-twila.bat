@echo off
echo Building TWILA Mod...
cd twila
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo npm install failed!
    pause
    exit /b 1
)

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo TypeScript build failed!
    pause
    exit /b 1
)

call gradlew.bat build
if %ERRORLEVEL% NEQ 0 (
    echo TWILA build failed!
    pause
    exit /b 1
)

echo TWILA built successfully!
cd ..
