# Messaging API Integration Plan

## Overview
Integrate REST APIs for conversations and messages while keeping Firebase for notifications and analytics.

## Current State
- Uses Firebase Firestore directly for conversations and messages
- Real-time updates via Firestore listeners
- Firebase Analytics for tracking
- Firebase Messaging for push notifications

## Target State
- Use REST APIs for conversations and messages
- Keep Firebase for notifications and analytics
- Implement polling/refresh mechanism for real-time feel
- Maintain existing UI/UX

## Implementation Plan

### Phase 1: Create Messaging API Service
**File: `src/services/messagingAPI.js`**

1. **Conversation APIs**
   - `createConversation(userA, userB)` → POST /conversations
   - `getUserInbox(userId)` → GET /conversations/user/{userId}
   - Transform response to match current data structure

2. **Message APIs**
   - `sendMessage(conversationId, senderId, text)` → POST /messages/{conversationId}
   - `getChatHistory(conversationId)` → GET /messages/{conversationId}
   - Transform timestamps and format messages

3. **Image Upload API**
   - `uploadUserImages(userId, files)` → POST /api/users/{userId}/upload-images
   - Handle multipart/form-data

### Phase 2: Update Firebase Service
**File: `src/services/firebase.js`**

1. **Refactor chat functions to use REST APIs**
   - Replace `createChat()` with API call
   - Replace `sendMessage()` with API call
   - Replace `subscribeToChats()` with polling mechanism
   - Replace `subscribeToMessages()` with polling mechanism
   - Keep `logEvent()` for analytics
   - Keep Firebase initialization for notifications

2. **Add polling mechanism**
   - `pollUserInbox(userId, callback, interval)` - Poll every 2-3 seconds
   - `pollChatHistory(conversationId, callback, interval)` - Poll every 1-2 seconds
   - Clean up intervals on unmount

### Phase 3: Update Chat Screens
**Files: `src/screens/ChatListScreen.js`, `src/screens/IndividualChatScreen.js`**

1. **ChatListScreen**
   - Update to use new API structure
   - Handle `conversationId` and `otherUserId` from API response
   - Maintain refresh functionality
   - Update empty states

2. **IndividualChatScreen**
   - Update to use new API structure
   - Handle message format from API
   - Update send message flow
   - Maintain auto-scroll functionality

### Phase 4: Data Transformation Layer
**Helper functions to transform API responses**

1. **Transform inbox response**
   ```javascript
   {
     conversationId: "abc123",
     otherUserId: "2"
   } 
   → 
   {
     id: "abc123",
     participants: [userId, "2"],
     otherUserId: "2",
     lastMessage: null,
     lastMessageTime: null
   }
   ```

2. **Transform message response**
   ```javascript
   {
     senderId: "1",
     text: "Hello",
     timestamp: "2026-01-20T10:00:00"
   }
   →
   {
     id: generated,
     senderId: "1",
     text: "Hello",
     timestamp: FirestoreTimestamp-like object,
     read: false
   }
   ```

### Phase 5: Error Handling
1. Network error handling
2. Retry logic for failed requests
3. Offline state handling
4. User-friendly error messages

### Phase 6: Optimization
1. Implement request caching
2. Debounce polling when app is in background
3. Optimize polling intervals
4. Add loading states

## File Structure
```
src/services/
  ├── api.js (existing - update baseURL if needed)
  ├── messagingAPI.js (NEW - REST API functions)
  ├── firebase.js (UPDATE - use REST APIs, keep analytics)
  └── notifications.js (KEEP - no changes)

src/screens/
  ├── ChatListScreen.js (UPDATE - use new API)
  └── IndividualChatScreen.js (UPDATE - use new API)
```

## API Endpoints Mapping

| Current Function | New API Endpoint | Method |
|-----------------|------------------|--------|
| `createChat()` | `/conversations` | POST |
| `subscribeToChats()` | `/conversations/user/{userId}` | GET (polling) |
| `sendMessage()` | `/messages/{conversationId}` | POST |
| `subscribeToMessages()` | `/messages/{conversationId}` | GET (polling) |
| `markMessagesAsRead()` | (Not in API - may need to add or handle client-side) | - |

## Key Considerations

1. **Real-time Updates**: Since REST APIs don't support real-time, implement polling:
   - Chat list: Poll every 3-5 seconds
   - Active chat: Poll every 1-2 seconds
   - Pause polling when screen is not focused

2. **Conversation ID**: API uses `conversationId`, current code uses `chatId` - need mapping

3. **Message IDs**: API doesn't return message IDs in response - may need to generate client-side

4. **Read Status**: API doesn't include read status - may need to track client-side or add to API

5. **Last Message**: API inbox doesn't include last message - may need to fetch separately or add to API

6. **Timestamps**: API returns ISO strings, need to convert to Date objects

7. **Unread Count**: Not in API response - may need to calculate client-side or add to API

## Testing Checklist
- [ ] Create conversation between two users
- [ ] Get user inbox displays correctly
- [ ] Send message works
- [ ] Get chat history displays correctly
- [ ] Polling updates chat list
- [ ] Polling updates messages in active chat
- [ ] Error handling works
- [ ] Loading states display correctly
- [ ] Refresh functionality works
- [ ] Image upload works (if needed)
- [ ] Initiate chat from UserProfileScreen works
- [ ] Navigate to existing chat if conversation exists
- [ ] Create new conversation if doesn't exist

## Additional Feature: Initiate Chat from Profile

### Update UserProfileScreen
**File: `src/screens/UserProfileScreen.js`**

1. **Update Message Button Handler**
   - Current: `navigation.navigate('Chat')` - just goes to chat tab
   - New: Create/find conversation and navigate to IndividualChat screen
   - Function: `handleStartChat()` that:
     - Checks if conversation exists (check inbox)
     - If exists: Navigate to IndividualChat with conversationId
     - If not: Create conversation, then navigate
     - Show loading state during creation
     - Handle errors gracefully

2. **Add Helper Function**
   ```javascript
   const handleStartChat = async () => {
     // 1. Get current user ID
     // 2. Get other user ID from profileData
     // 3. Check if conversation exists (get inbox and filter)
     // 4. If exists, navigate to IndividualChat
     // 5. If not, create conversation then navigate
   }
   ```

## Migration Strategy
1. Create new API service alongside existing Firebase code
2. Update Firebase service to use APIs but keep same function signatures
3. Test thoroughly
4. Remove old Firestore code once confirmed working

