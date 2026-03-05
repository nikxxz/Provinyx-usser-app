# DEVELOPER_ERROR Troubleshooting - Step by Step

## Your Current Setup

- **Package**: `com.unveilix`
- **SHA-1**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- **Web Client ID**: `998554587608-bf7td2slo768kopvdr30rs9tu7l3gbem.apps.googleusercontent.com`

---

## Critical Checks (Do These IN ORDER)

### ✅ Step 1: Verify Google Cloud Console Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. You should see **TWO** OAuth 2.0 Client IDs:
   - One type: **Web application**
   - One type: **Android**

#### Check Web Client:

- Click on the **Web application** credential
- Copy the Client ID
- **Does it match?** `998554587608-bf7td2slo768kopvdr30rs9tu7l3gbem.apps.googleusercontent.com`
- If NO → Copy the correct one and update OnboardingScreen.js

#### Check Android Client:

- Click on the **Android** credential
- Verify these EXACT values:
  ```
  Package name: com.unveilix
  SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
  ```
- If they don't match EXACTLY → Delete and recreate the Android credential

### ✅ Step 2: Verify APIs are Enabled

1. Go to: https://console.cloud.google.com/apis/library
2. Search for each and verify "API enabled":
   - ✅ **Google+ API** (or People API)
   - ✅ **Google Identity Toolkit API** (optional but recommended)

### ✅ Step 3: Check OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Verify:
   - Status: Testing or Published
   - If "Testing" → Add your test Google account email to "Test users"

### ✅ Step 4: Double-Check Package Name in Android

Run this to verify package name:

```bash
cd android
grep -r "applicationId" app/build.gradle
```

Should show: `applicationId "com.unveilix"`

### ✅ Step 5: Verify SHA-1 Again

Run this to get current SHA-1:

```bash
cd android
./gradlew signingReport
```

Look for `SHA1:` under `Variant: debug`
**Must match**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

### ✅ Step 6: Wait for Google Propagation

Google Cloud changes can take **5-10 minutes** to propagate.

- If you just created/updated credentials → Wait 10 minutes
- Then try again

### ✅ Step 7: Clean Build

```bash
# Stop metro bundler (Ctrl+C)
cd android
./gradlew clean
cd ..

# Clear React Native cache
npx react-native start --reset-cache
```

In another terminal:

```bash
npm run android
```

---

## Alternative: Try These Specific Fixes

### Fix A: Recreate Android Credential

If nothing works, recreate the Android credential:

1. Go to Google Cloud Console → Credentials
2. **Delete** the existing Android OAuth client
3. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
4. Select **Android**
5. Fill EXACTLY:
   ```
   Name: Unveilix Android Debug
   Package name: com.unveilix
   SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
   ```
6. Click CREATE
7. Wait 10 minutes
8. Rebuild app

### Fix B: Verify Google Play Services

Check if Google Play Services is updated on your device/emulator:

- Open Play Store
- Search "Google Play Services"
- Update if available

Or use a physical device instead of emulator.

### Fix C: Add Both SHA-1 Types

Sometimes you need BOTH debug and release SHA-1. Create TWO Android clients:

**Client 1: Debug**

```
Package: com.unveilix
SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

**Client 2: Release** (if you have a release keystore)

```
Package: com.unveilix
SHA-1: [Your release SHA-1]
```

---

## Quick Test Commands

### Test 1: Verify Package Name

```bash
cd android
grep "namespace\|applicationId" app/build.gradle
```

Expected output:

```
namespace "com.unveilix"
applicationId "com.unveilix"
```

### Test 2: Verify SHA-1

```bash
cd android
./gradlew signingReport | grep -A 5 "Variant: debug"
```

Expected to see:

```
SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

### Test 3: Check if Google package is installed

```bash
npm list @react-native-google-signin/google-signin
```

Expected:

```
@react-native-google-signin/google-signin@[version]
```

---

## Most Common Causes (Based on Your Setup)

Since you've already set everything up, these are the most likely issues:

1. **⏱️ Timing Issue**: Google Cloud changes not propagated yet
   - **Solution**: Wait 10 minutes after creating credentials
2. **🔐 Wrong Client Type**: Using Android Client ID instead of Web Client ID
   - **Solution**: In Google Cloud Console, verify you're copying from "Web application" not "Android"
3. **📱 Multiple Google Accounts**: Testing with wrong Google account
   - **Solution**: Add your test account to OAuth consent screen → Test users
4. **🧹 Cache Issue**: Old configuration cached
   - **Solution**: Full clean + rebuild (see Step 7)

---

## Screenshot Checklist for Google Cloud Console

Your credentials page should look like this:

```
OAuth 2.0 Client IDs
┌─────────────────────────────────────────┐
│ Name: Unveilix Web Client               │
│ Type: Web application                   │
│ Client ID: 998554587608-bf7...          │ ← Use this in code
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Name: Unveilix Android Debug            │
│ Type: Android                           │
│ Package: com.unveilix                   │
│ SHA-1: 5E:8F:16:06:2E:A3...             │
└─────────────────────────────────────────┘
```

---

## Still Not Working?

### Debug Mode: Add Logging

Add this to your handleGoogleLogin function (line 45):

```javascript
const handleGoogleLogin = async () => {
  try {
    setIsGoogleLoading(true);

    // ADD THIS DEBUG BLOCK
    console.log('🔍 DEBUG INFO:');
    console.log('Package:', 'com.unveilix');
    console.log('WebClientId:', '998554587608-bf7td2slo768kopvdr30rs9tu7l3gbem.apps.googleusercontent.com');

    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    });
    console.log('✅ Has Play Services:', hasPlayServices);

    // Continue with rest of code...
```

Run the app and send me the console output.

---

## Nuclear Option: Start Fresh

If NOTHING works:

1. Delete all credentials in Google Cloud Console
2. Wait 5 minutes
3. Create NEW Web Client → Get new Client ID
4. Create NEW Android Client with package + SHA-1
5. Update OnboardingScreen.js with new Web Client ID
6. Wait 10 minutes
7. Full clean rebuild

```bash
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache

# In another terminal
npm run android
```
