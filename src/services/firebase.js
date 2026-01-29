import { getApp } from '@react-native-firebase/app';
import { getFirestore, FieldValue } from '@react-native-firebase/firestore';
import { getMessaging } from '@react-native-firebase/messaging';
import { getAnalytics } from '@react-native-firebase/analytics';
import { getAuth } from '@react-native-firebase/auth';
import { conversationAPI, messageAPI, findOrCreateConversation } from './messagingAPI';

// Lazy initialization - Firebase auto-initializes from native config files
// Using modular API (v22+)
let dbInstance = null;
let messagingInstance = null;
let analyticsInstance = null;
let authInstance = null;
let appInstance = null;

// Get Firebase app instance
const getFirebaseApp = () => {
  if (!appInstance) {
    try {
      appInstance = getApp();
    } catch (error) {
      console.error('Firebase App not initialized. Make sure google-services.json (Android) or GoogleService-Info.plist (iOS) is in place.', error);
      throw error;
    }
  }
  return appInstance;
};

// Get Firebase services with error handling (using new modular API)
const getDb = () => {
  if (!dbInstance) {
    try {
      const app = getFirebaseApp();
      dbInstance = getFirestore(app);
    } catch (error) {
      console.error('Firebase Firestore not initialized. Make sure google-services.json (Android) or GoogleService-Info.plist (iOS) is in place.', error);
      throw error;
    }
  }
  return dbInstance;
};

const getMessagingService = () => {
  if (!messagingInstance) {
    try {
      const app = getFirebaseApp();
      messagingInstance = getMessaging(app);
    } catch (error) {
      console.error('Firebase Messaging not initialized. Make sure google-services.json (Android) or GoogleService-Info.plist (iOS) is in place.', error);
      throw error;
    }
  }
  return messagingInstance;
};

const getAnalyticsService = () => {
  if (!analyticsInstance) {
    try {
      const app = getFirebaseApp();
      analyticsInstance = getAnalytics(app);
    } catch (error) {
      console.error('Firebase Analytics not initialized. Make sure google-services.json (Android) or GoogleService-Info.plist (iOS) is in place.', error);
      throw error;
    }
  }
  return analyticsInstance;
};

const getAuthService = () => {
  if (!authInstance) {
    try {
      const app = getFirebaseApp();
      authInstance = getAuth(app);
    } catch (error) {
      console.error('Firebase Auth not initialized. Make sure google-services.json (Android) or GoogleService-Info.plist (iOS) is in place.', error);
      throw error;
    }
  }
  return authInstance;
};

// Export getter functions
export { getDb as getDbService };
export { getDb };
export { getMessagingService as getMessagingServiceInstance };
export { getAnalyticsService as getAnalyticsServiceInstance };
export { getAuthService as getAuthServiceInstance };

// Export FieldValue directly
export { FieldValue };

// Chat-related functions using REST APIs
export const createChat = async (userId1, userId2) => {
  try {
    const result = await conversationAPI.createConversation(userId1, userId2);
    
    if (result.success) {
      // Log analytics
      await logEvent('conversation_created', { userId1, userId2, conversationId: result.data.conversationId });
      return result.data.conversationId;
    } else {
      throw new Error(result.error || 'Failed to create conversation');
    }
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const sendMessage = async (chatId, senderId, text) => {
  try {
    const result = await messageAPI.sendMessage(chatId, senderId, text);
    
    if (result.success) {
      // Log analytics
      await logEvent('message_sent', { chatId, senderId, messageId: result.data.messageId });
      return result.data.messageId;
    } else {
      throw new Error(result.error || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Polling interval for chat list (in milliseconds)
const CHAT_LIST_POLL_INTERVAL = 5000; // 5 seconds

export const subscribeToChats = (userId, callback) => {
  let pollingInterval = null;
  let isActive = true;
  
  const pollChats = async () => {
    if (!isActive) return;
    
    try {
      const result = await conversationAPI.getUserInbox(userId);
      
      if (result.success && result.data) {
        // Enhance conversations with last message info
        const enhancedChats = await Promise.all(
          result.data.map(async (chat) => {
            try {
              // Get last message for each conversation
              const historyResult = await messageAPI.getChatHistory(chat.conversationId);
              if (historyResult.success && historyResult.data && historyResult.data.length > 0) {
                const lastMessage = historyResult.data[historyResult.data.length - 1];
                chat.lastMessage = lastMessage.text;
                chat.lastMessageTime = lastMessage.timestamp;
                // Calculate unread count (messages not from current user)
                chat.unreadCount = historyResult.data.filter(
                  msg => msg.senderId !== userId && !msg.read
                ).length;
              } else {
                chat.lastMessage = null;
                chat.lastMessageTime = null;
                chat.unreadCount = 0;
              }
            } catch (error) {
              console.error('Error fetching last message:', error);
              chat.lastMessage = null;
              chat.lastMessageTime = null;
              chat.unreadCount = 0;
            }
            return chat;
          })
        );
        
        // Sort by lastMessageTime (most recent first)
        enhancedChats.sort((a, b) => {
          const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
          const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
          return bTime - aTime;
        });
        
        callback(enhancedChats);
      } else {
        callback([]);
      }
    } catch (error) {
      console.error('Error polling chats:', error);
      callback([]);
    }
  };
  
  // Initial fetch
  pollChats();
  
  // Set up polling interval
  pollingInterval = setInterval(pollChats, CHAT_LIST_POLL_INTERVAL);
  
  // Return unsubscribe function
  return () => {
    isActive = false;
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

// Polling interval for messages (in milliseconds)
const MESSAGE_POLL_INTERVAL = 2000; // 2 seconds

export const subscribeToMessages = (chatId, callback) => {
  let pollingInterval = null;
  let isActive = true;
  let lastMessageCount = 0;
  
  const pollMessages = async () => {
    if (!isActive) return;
    
    try {
      const result = await messageAPI.getChatHistory(chatId);
      
      if (result.success && result.data) {
        // Sort messages by timestamp (oldest first)
        const sortedMessages = result.data.sort((a, b) => {
          const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return aTime - bTime;
        });
        
        // Only callback if messages changed
        if (sortedMessages.length !== lastMessageCount) {
          lastMessageCount = sortedMessages.length;
          callback(sortedMessages);
        }
      } else {
        callback([]);
      }
    } catch (error) {
      console.error('Error polling messages:', error);
      callback([]);
    }
  };
  
  // Initial fetch
  pollMessages();
  
  // Set up polling interval
  pollingInterval = setInterval(pollMessages, MESSAGE_POLL_INTERVAL);
  
  // Return unsubscribe function
  return () => {
    isActive = false;
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

// Note: API doesn't support marking messages as read
// This is handled client-side by tracking read status locally
export const markMessagesAsRead = async (chatId, userId) => {
  // Since the API doesn't support read status, we'll track it client-side
  // This function is kept for compatibility but doesn't make an API call
  try {
    // Log analytics
    await logEvent('messages_marked_read', { chatId, userId });
    // In a real implementation, you might want to store read status locally
    // or add a PATCH endpoint to the API for updating read status
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

// Export findOrCreateConversation for use in UserProfileScreen
export { findOrCreateConversation };

// Log analytics event with error handling
export const logEvent = async (eventName, params = {}) => {
  try {
    const analyticsInstance = getAnalyticsService();
    // Call method directly without storing reference
    await analyticsInstance.logEvent(eventName, params);
  } catch (error) {
    console.error('Error logging analytics event (Firebase may not be configured):', error);
    // Don't throw - analytics failures shouldn't break the app
  }
};
