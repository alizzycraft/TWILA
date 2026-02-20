#!/bin/bash

echo "Building TWILA Mod..."
cd twila
npm install
if [ $? -ne 0 ]; then
    echo "npm install failed!"
    exit 1
fi

npm run build
if [ $? -ne 0 ]; then
    echo "TypeScript build failed!"
    exit 1
fi

./gradlew build
if [ $? -ne 0 ]; then
    echo "TWILA build failed!"
    exit 1
fi

echo "TWILA built successfully!"
cd ..
