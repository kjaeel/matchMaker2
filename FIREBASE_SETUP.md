# Firebase Setup Instructions

This app uses Firebase for real-time chat functionality. Follow these steps to set up Firebase:

## 1. Install Firebase Dependencies

```bash
npm install @react-native-firebase/app @react-native-firebase/firestore
```

For iOS, you'll also need to run:
```bash
cd ios && pod install
```

## 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## 3. Add Firebase to Your App

### Android Setup

1. In Firebase Console, click "Add app" > Android
2. Register your app with package name (found in `android/app/build.gradle`)
3. Download `google-services.json`
4. Place it in `android/app/` directory

### iOS Setup

1. In Firebase Console, click "Add app" > iOS
2. Register your app with bundle ID
3. Download `GoogleService-Info.plist`
4. Place it in `ios/` directory and add to Xcode project

## 4. Update Firebase Configuration

Edit `src/config/firebase.js` and replace the placeholder values with your actual Firebase config:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

You can find these values in:
- Firebase Console > Project Settings > General > Your apps

## 5. Update Firebase Chat Service

Once Firebase is configured, update `src/services/firebaseChat.js`:

1. Uncomment the Firebase imports at the top
2. Replace the mock implementation with actual Firebase Firestore code
3. The service is already structured to work with Firebase - just uncomment and adjust the code

## 6. Firestore Security Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatRoomId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.resource.data.senderId == request.auth.uid || 
         request.resource.data.receiverId == request.auth.uid);
    }
  }
}
```

## 7. Backend Integration (Java SpringBoot)

The chat service includes placeholder methods for backend integration:
- `notifyBackend()` - Called when messages are sent
- Update this method to call your Java SpringBoot API

Example:
```javascript
async notifyBackend(message) {
  await fetch('https://your-backend.com/api/chat/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
}
```

## Current Status

- ✅ Firebase configuration file created
- ✅ Firebase chat service structure created (with mock implementation)
- ✅ Chat screen integrated with Firebase service
- ⚠️ Firebase packages need to be installed
- ⚠️ Firebase config needs to be updated with actual values
- ⚠️ Mock implementation needs to be replaced with real Firebase code

## Testing

Until Firebase is fully configured, the app will run in "mock mode" which simulates Firebase behavior for development purposes.



