# Firebase Installation & Setup Guide

## ✅ Completed Steps

1. ✅ Firebase configuration added to `src/config/firebase.js`
2. ✅ Firebase packages added to `package.json`
3. ✅ Google Services plugin added to Android build files
4. ✅ Firebase chat service implemented with React Native Firebase
5. ✅ `google-services.json` file present in `android/app/`

## 📦 Installation Steps

### 1. Install Dependencies

Run the following command to install Firebase packages:

```bash
npm install
```

For iOS, also run:
```bash
cd ios && pod install && cd ..
```

### 2. Android Configuration

The Android setup is already configured:
- ✅ `google-services.json` is in `android/app/`
- ✅ Google Services plugin added to `android/build.gradle`
- ✅ Plugin applied in `android/app/build.gradle`

### 3. iOS Configuration (if needed)

If you're building for iOS:

1. Download `GoogleService-Info.plist` from Firebase Console
2. Place it in the `ios/` directory
3. Add it to your Xcode project (drag and drop into Xcode)

### 4. Firestore Security Rules

Set up Firestore security rules in Firebase Console:

1. Go to Firebase Console > Firestore Database > Rules
2. Add the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chat messages
    match /chats/{chatRoomId}/messages/{messageId} {
      // Users can read messages if they are sender or receiver
      allow read: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
      
      // Users can write messages if they are the sender
      allow create: if request.auth != null && 
        request.resource.data.senderId == request.auth.uid;
      
      // Users can update messages if they are the receiver (for read status)
      allow update: if request.auth != null && 
        resource.data.receiverId == request.auth.uid;
    }
    
    // Chat rooms metadata
    match /chats/{chatRoomId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

### 5. Test the Setup

1. Build and run the app:
   ```bash
   npm run android
   # or
   npm run ios
   ```

2. Test chat functionality:
   - Navigate to a user profile
   - Click "Message" button
   - Send a test message
   - Verify it appears in real-time

## 🔧 Backend Integration (Java SpringBoot)

The Firebase chat service includes a placeholder method `notifyBackend()` that you can update to call your Java SpringBoot API.

Update `src/services/firebaseChat.js`:

```javascript
async notifyBackend(message) {
  try {
    await fetch('https://your-backend.com/api/chat/notify', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // if needed
      },
      body: JSON.stringify({
        messageId: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        text: message.text,
        timestamp: message.timestamp,
      }),
    });
  } catch (error) {
    console.error('[Firebase Chat] Backend notification error:', error);
  }
}
```

## 📱 Firestore Data Structure

The chat system uses the following Firestore structure:

```
chats/
  {chatRoomId}/
    participants: [userId1, userId2]
    lastMessage: "message text"
    lastMessageTime: timestamp
    updatedAt: timestamp
    messages/
      {messageId}/
        senderId: "userId"
        receiverId: "userId"
        text: "message text"
        timestamp: timestamp
        read: false
```

## 🐛 Troubleshooting

### Android Build Errors

If you get build errors:
1. Clean the project: `cd android && ./gradlew clean && cd ..`
2. Rebuild: `npm run android`

### Firebase Not Initializing

1. Verify `google-services.json` is in `android/app/`
2. Check that package name matches in Firebase Console
3. Ensure Google Services plugin is applied in build.gradle

### Messages Not Appearing

1. Check Firestore security rules
2. Verify user IDs are being passed correctly
3. Check console logs for Firebase errors

## ✅ Current Status

- ✅ Firebase packages installed
- ✅ Android configuration complete
- ✅ Firebase chat service implemented
- ✅ Real-time messaging ready
- ⚠️ Firestore security rules need to be set up
- ⚠️ Backend integration needs to be configured (optional)



