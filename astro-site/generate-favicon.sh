#!/bin/bash

# Temporary script to generate favicon from logo
# This script converts logo.png to various favicon sizes

echo "Generating favicon from logo..."

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Using ImageMagick..."
    # Generate different sizes
    convert public/images/logo.png -resize 16x16 public/favicon-16x16.png
    convert public/images/logo.png -resize 32x32 public/favicon-32x32.png
    convert public/images/logo.png -resize 180x180 public/apple-touch-icon.png
    convert public/images/logo.png -resize 192x192 public/favicon-192x192.png
    convert public/images/logo.png -resize 512x512 public/favicon-512x512.png
    
    # Generate .ico file (multi-resolution)
    convert public/images/logo.png -resize 16x16 -resize 32x32 -resize 48x48 public/favicon.ico
    
    echo "✅ Favicons generated using ImageMagick!"
elif command -v sips &> /dev/null; then
    echo "Using sips (macOS)..."
    # Generate different sizes using sips
    sips -z 16 16 public/images/logo.png --out public/favicon-16x16.png
    sips -z 32 32 public/images/logo.png --out public/favicon-32x32.png
    sips -z 180 180 public/images/logo.png --out public/apple-touch-icon.png
    sips -z 192 192 public/images/logo.png --out public/favicon-192x192.png
    sips -z 512 512 public/images/logo.png --out public/favicon-512x512.png
    
    # For .ico, just copy the 32x32 version
    cp public/favicon-32x32.png public/favicon.ico
    
    echo "✅ Favicons generated using sips!"
    echo "⚠️  Note: favicon.ico is actually a PNG. For true .ico format, install ImageMagick."
else
    echo "❌ Neither ImageMagick (convert) nor sips found."
    echo "Please install ImageMagick: brew install imagemagick"
    exit 1
fi

echo ""
echo "Generated files:"
ls -lh public/favicon* public/apple-touch-icon.png 2>/dev/null || true

echo ""
echo "You can now delete this script: rm generate-favicon.sh"
