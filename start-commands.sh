#!/bin/bash

echo "🚀 Starting KCS Attendance App Setup..."

# Clear npm cache and remove node_modules
npm cache clean --force
rm -rf node_modules package-lock.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Add expo-font explicitly
echo "🔤 Installing expo-font..."
npx expo install expo-font

# Fix any compatibility issues
echo "🔧 Fixing compatibility issues..."
npx expo install --fix

# Install Expo CLI globally if not installed
if ! command -v expo &> /dev/null; then
    echo "📱 Installing Expo CLI..."
    npm install -g @expo/cli
fi

# Run expo doctor to check for issues
echo "🩺 Running Expo Doctor..."
npx expo-doctor

echo "✅ Setup complete!"
echo ""
echo "🎯 Available commands:"
echo "  npm start          - Start development server"
echo "  npm run android    - Run on Android device/emulator"
echo "  npm run ios        - Run on iOS device/simulator"
echo "  npm run web        - Run in web browser"
echo ""
echo "🔧 If you encounter issues, try:"
echo "  npx expo install --fix"
echo "  npx expo-doctor --verbose"
echo ""

# Start the development server
echo "🚀 Starting Expo development server..."
npm start
