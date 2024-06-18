#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define the directory where the .ipa file is expected to be generated
OUTPUT_DIR="./ios" # Adjust this path according to your setup

# Step 0: create folder
mkdir -p "$OUTPUT_DIR"

# Step 1: Build the iOS app locally and non-interactively
echo "Starting local build for iOS..."
eas build -p ios --local --non-interactive --output="$OUTPUT_DIR/TuneTidy.ipa"

# Check if the .ipa file exists
IPA_PATH="$OUTPUT_DIR/TuneTidy.ipa"

if [ ! -f "$IPA_PATH" ]; then
  echo "Error: .ipa file not found at $IPA_PATH"
  exit 1
fi

# Step 2: Submit the build to the App Store
echo "Submitting the build to the App Store..."
eas submit -p ios --path="$IPA_PATH"

echo "Build and submission process completed successfully!"