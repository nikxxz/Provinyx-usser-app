# React Native Vector Icons Setup Guide

## Issue

Icons from `react-native-vector-icons` were not displaying in the app due to missing font linking in native projects.

## Solution Applied

### Android Configuration

1. Created `android/app/react.gradle` - This file handles font asset copying for both debug and release builds
2. Updated `android/app/build.gradle` - Added `apply from: "react.gradle"` to link the vector icons fonts

The configuration:

- Copies MaterialCommunityIcons font files from `node_modules/react-native-vector-icons/Fonts` to Android assets
- Works for both debug and release build variants
- Automatically includes fonts in the sourceSets configuration

### iOS Configuration

1. Updated `ios/Podfile` - Enhanced post-install configuration to properly link vector icons

The configuration:

- Sets minimum deployment target compatibility
- Ensures vector-icons pod is properly configured
- Automatically links all font files during pod installation

## Rebuild Instructions

### For Android Development:

```bash
# Clean build directories
cd android
./gradlew clean
cd ..

# Rebuild the app
npm run android
# or
react-native run-android
```

### For iOS Development:

```bash
# Update pods with new configuration
cd ios
pod install --repo-update
cd ..

# Rebuild the app
npm run ios
# or
react-native run-ios
```

### For Production Builds:

```bash
# Android release build
cd android
./gradlew clean
./gradlew assembleRelease
cd ..

# iOS release build (requires signing certificates)
cd ios
pod install --repo-update
cd ..
xcodebuild -workspace ios/Unveilix.xcworkspace -scheme Unveilix -configuration Release
```

## Verification

After rebuilding, you should see all icons properly displayed:

- ✓ MaterialCommunityIcons from `react-native-vector-icons/MaterialCommunityIcons`
- ✓ Icons like "alert-circle", "package-variant", "factory", etc. in ScanResultScreen

## Files Modified

- `android/app/react.gradle` (NEW)
- `android/app/build.gradle` (UPDATED)
- `ios/Podfile` (UPDATED)

## Font Files Included

The react-native-vector-icons package includes these icon sets:

- AntDesign
- Entypo
- EvilIcons
- Feather
- FontAwesome
- FontAwesome5
- Foundation
- Ionicons
- MaterialIcons
- MaterialCommunityIcons (used in your app)
- Octicons
- SimpleLineIcons
- Zocial
