# Firebase Setup Guide

This app uses Firebase for chat functionality, push notifications, and analytics. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional but recommended)

## 2. Android Setup

1. In Firebase Console, click on the Android icon to add an Android app
2. Register your app with package name: `com.matchmakingapp`
3. Download `google-services.json`
4. Place `google-services.json` in `android/app/` directory
5. Make sure your `android/app/build.gradle` includes:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```
   And in `android/build.gradle`:
   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.4.0'
   }
   ```

## 3. iOS Setup

1. In Firebase Console, click on the iOS icon to add an iOS app
2. Register your app with bundle ID: `com.matchmakingapp.MatchmakingApp`
3. Download `GoogleService-Info.plist`
4. Place `GoogleService-Info.plist` in `ios/MatchmakingApp/` directory
5. Run `cd ios && pod install` to install dependencies

## 4. Enable Firebase Services

### Firestore Database
1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Start in **test mode** for development (or set up security rules for production)
4. Choose a location for your database

### Cloud Messaging (FCM)
1. Go to Firebase Console > Cloud Messaging
2. FCM is automatically enabled when you add your app

### Analytics
1. Go to Firebase Console > Analytics
2. Analytics is automatically enabled when you create a project with Google Analytics

## 5. Firestore Security Rules (Production)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chats collection
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      // Messages subcollection
      match /messages/{messageId} {
        allow read: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow create: if request.auth != null && 
          request.auth.uid == request.resource.data.senderId &&
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow update: if request.auth != null && 
          request.auth.uid == request.resource.data.senderId;
      }
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. Testing

After setup:
1. Run `npm install` to ensure all dependencies are installed
2. For Android: `npx react-native run-android`
3. For iOS: `cd ios && pod install && cd .. && npx react-native run-ios`

## 7. Features Implemented

- ✅ Real-time chat with Firestore
- ✅ Push notifications with FCM
- ✅ Analytics tracking for chat events
- ✅ WhatsApp-like chat list interface
- ✅ Individual chat screens
- ✅ Unread message counts
- ✅ Message read receipts

## 8. Analytics Events Tracked

The app tracks the following events:
- `chat_list_viewed` - When user opens chat list
- `chat_opened` - When user opens a chat
- `chat_screen_opened` - When individual chat screen is opened
- `message_sent` - When a message is sent
- `notification_permission_granted` - When notification permission is granted
- `notification_received_foreground` - When notification received in foreground
- `notification_received_background` - When notification received in background
- `notification_opened` - When user taps on notification
- `fcm_token_saved` - When FCM token is saved
- `fcm_token_deleted` - When FCM token is deleted

## Notes

- Make sure to configure Firebase Authentication if you plan to use it for user authentication
- For production, set up proper Firestore security rules
- Test push notifications on real devices (not emulators)
- Analytics data will appear in Firebase Console after events are logged




