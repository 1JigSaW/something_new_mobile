#!/bin/bash

# Start Frontend Mobile App
echo "🚀 Starting Frontend Mobile App..."

# Navigate to mobile directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start Metro bundler
npx react-native start

echo "✅ Frontend started. Run 'npx react-native run-ios' or 'npx react-native run-android' in another terminal"
