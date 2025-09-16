#!/bin/bash

echo "🧹 Clearing React Native test data..."

# Clear Metro cache
echo "Clearing Metro cache..."
npx react-native start --reset-cache &
METRO_PID=$!

# Wait a bit for Metro to start
sleep 3

# Kill Metro
kill $METRO_PID 2>/dev/null

echo "✅ Metro cache cleared"

# Clear iOS simulator data (if running)
echo "Clearing iOS simulator data..."
xcrun simctl erase all 2>/dev/null || echo "No iOS simulator running"

echo "✅ iOS simulator data cleared"

# Clear Android data (if running)
echo "Clearing Android data..."
adb shell pm clear com.somethingnew 2>/dev/null || echo "Android not connected or app not installed"

echo "✅ Android data cleared"

echo "🎉 All test data cleared!"
echo "💡 Restart your app to see the changes"
