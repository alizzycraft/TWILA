#!/bin/bash

echo "Building TWILA Mod..."
cd twila
tsc --project ./tsconfig.json
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
