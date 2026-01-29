# Firebase Initialization Fix

## Problem
The app was crashing with:
```
Error: No Firebase App '[DEFAULT]' has been created - call firebase.initializeApp()
```

## Solution
Updated Firebase service to handle missing configuration files gracefully:

1. **Lazy Initialization**: Firebase services are now initialized only when first accessed, not when the module loads
2. **Error Handling**: All Firebase service calls are wrapped in try-catch blocks
3. **Graceful Degradation**: If Firebase config files are missing, the app will still start but show warnings

## What Changed

### `src/services/firebase.js`
- Services are now lazy-loaded using getter functions
- Added error handling for missing Firebase configuration
- Services return no-op functions if Firebase isn't configured (prevents crashes)

### `index.js`
- Background message handler registration is now wrapped in try-catch
- App will start even if Firebase Messaging isn't configured

### `src/services/notifications.js`
- All notification functions now handle Firebase errors gracefully
- Functions return empty handlers if Firebase isn't available

## Next Steps

To fully enable Firebase features:

1. **Add Firebase Config Files**:
   - Android: Add `google-services.json` to `android/app/`
   - iOS: Add `GoogleService-Info.plist` to `ios/MatchmakingApp/`

2. **Rebuild the App**:
   ```bash
   # For Android
   npx react-native run-android
   
   # For iOS
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

3. **Verify Firebase is Working**:
   - Check console logs for Firebase initialization messages
   - Try sending a message in the chat
   - Check Firebase Console for analytics events

## Current Behavior

- ✅ App starts successfully even without Firebase config
- ✅ Chat UI is visible (but won't work without Firebase)
- ⚠️ Console warnings will appear if Firebase isn't configured
- ❌ Real-time chat features require Firebase to be set up

See `FIREBASE_SETUP.md` for detailed setup instructions.




