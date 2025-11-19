#!/bin/bash

echo "🎉 Welcome to Wellness Tracker Setup!"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 No .env file found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file (optional - only needed for cloud sync)"
    echo ""
fi

# Build the project to verify everything works
echo "🔨 Building project to verify setup..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🚀 Setup complete! You can now:"
echo ""
echo "   1. Start development server:"
echo "      npm run dev"
echo ""
echo "   2. Build for production:"
echo "      npm run build"
echo ""
echo "   3. Preview production build:"
echo "      npm run preview"
echo ""
echo "📖 Read USER_GUIDE.md for usage instructions"
echo "🚀 Read DEPLOYMENT.md for deployment options"
echo ""
echo "Happy tracking! ✨"
