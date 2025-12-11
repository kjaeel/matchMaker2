// Firebase Chat Service
// This service handles all chat-related Firebase operations using React Native Firebase
// Backend (Java SpringBoot) will be integrated later as a placeholder

import firestore from '@react-native-firebase/firestore';

class FirebaseChatService {
  constructor() {
    this.isInitialized = false;
    this.listeners = new Map();
    this.db = firestore();
  }

  // Initialize Firebase
  async initialize() {
    try {
      // React Native Firebase automatically initializes from google-services.json (Android)
      // and GoogleService-Info.plist (iOS), so we just need to check if it's ready
      this.isInitialized = true;
      console.log('[Firebase Chat] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[Firebase Chat] Initialization error:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Get or create a chat room ID between two users
  getChatRoomId(userId1, userId2) {
    // Sort IDs to ensure consistent room ID regardless of order
    const sortedIds = [userId1, userId2].sort();
    return `chat_${sortedIds[0]}_${sortedIds[1]}`;
  }

  // Send a message
  async sendMessage(senderId, receiverId, text) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const chatRoomId = this.getChatRoomId(senderId, receiverId);
    const message = {
      senderId,
      receiverId,
      text: text.trim(),
      timestamp: firestore.FieldValue.serverTimestamp(),
      read: false,
    };

    try {
      // Add message to Firestore
      const messagesRef = this.db.collection('chats').doc(chatRoomId).collection('messages');
      const docRef = await messagesRef.add(message);

      // Update chat room metadata
      const chatRoomRef = this.db.collection('chats').doc(chatRoomId);
      await chatRoomRef.set({
        participants: [senderId, receiverId].sort(),
        lastMessage: message.text,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      // Notify backend (Java SpringBoot) - placeholder
      await this.notifyBackend({
        id: docRef.id,
        ...message,
      });

      console.log('[Firebase Chat] Message sent:', docRef.id);
      return { 
        success: true, 
        message: {
          id: docRef.id,
          ...message,
          timestamp: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('[Firebase Chat] Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  // Listen to messages in a chat room
  subscribeToMessages(userId1, userId2, callback) {
    if (!this.isInitialized) {
      this.initialize();
    }

    const chatRoomId = this.getChatRoomId(userId1, userId2);
    const listenerId = `listener_${chatRoomId}_${Date.now()}`;

    try {
      const messagesRef = this.db
        .collection('chats')
        .doc(chatRoomId)
        .collection('messages')
        .orderBy('timestamp', 'asc');

      // Set up real-time listener
      const unsubscribe = messagesRef.onSnapshot(
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              senderId: data.senderId,
              receiverId: data.receiverId,
              text: data.text,
              read: data.read || false,
              timestamp: data.timestamp 
                ? data.timestamp.toDate().toISOString() 
                : new Date().toISOString(),
            };
          });
          callback(messages);
        },
        (error) => {
          console.error('[Firebase Chat] Error in message listener:', error);
          callback([]);
        }
      );

      // Store listener for cleanup
      this.listeners.set(listenerId, unsubscribe);

      console.log('[Firebase Chat] Subscribed to messages:', chatRoomId);
      return listenerId;
    } catch (error) {
      console.error('[Firebase Chat] Error subscribing to messages:', error);
      // Fallback: return empty array
      callback([]);
      return null;
    }
  }

  // Unsubscribe from messages
  unsubscribe(listenerId) {
    const unsubscribe = this.listeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(listenerId);
      console.log('[Firebase Chat] Unsubscribed:', listenerId);
    }
  }

  // Get all chat rooms for a user
  async getChatRooms(userId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Query chat rooms where user is a participant
      const chatsRef = this.db.collection('chats');
      const snapshot = await chatsRef
        .where('participants', 'array-contains', userId)
        .orderBy('lastMessageTime', 'desc')
        .get();

      const rooms = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        rooms.push({
          id: doc.id,
          participants: data.participants || [],
          lastMessage: data.lastMessage || '',
          lastMessageTime: data.lastMessageTime 
            ? data.lastMessageTime.toDate().toISOString() 
            : null,
          unreadCount: 0, // TODO: Calculate unread count
        });
      });

      return { success: true, data: rooms };
    } catch (error) {
      console.error('[Firebase Chat] Error getting chat rooms:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark messages as read
  async markAsRead(chatRoomId, userId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const messagesRef = this.db
        .collection('chats')
        .doc(chatRoomId)
        .collection('messages');

      // Get unread messages
      const snapshot = await messagesRef
        .where('receiverId', '==', userId)
        .where('read', '==', false)
        .get();

      if (snapshot.empty) {
        return { success: true };
      }

      // Batch update all unread messages
      const batch = this.db.batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();

      console.log('[Firebase Chat] Messages marked as read:', chatRoomId);
      return { success: true };
    } catch (error) {
      console.error('[Firebase Chat] Error marking as read:', error);
      return { success: false, error: error.message };
    }
  }

  // Placeholder: Notify backend (Java SpringBoot)
  async notifyBackend(message) {
    try {
      // TODO: Call your Java SpringBoot backend API
      // Example:
      // await fetch('https://your-backend.com/api/chat/notify', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}` // if needed
      //   },
      //   body: JSON.stringify({
      //     messageId: message.id,
      //     senderId: message.senderId,
      //     receiverId: message.receiverId,
      //     text: message.text,
      //     timestamp: message.timestamp,
      //   }),
      // });
      
      console.log('[Firebase Chat] Backend notification (placeholder):', message);
    } catch (error) {
      console.error('[Firebase Chat] Backend notification error:', error);
      // Don't throw - backend notification failure shouldn't break chat
    }
  }
}

// Export singleton instance
export const firebaseChatService = new FirebaseChatService();

// Initialize on import
firebaseChatService.initialize();
