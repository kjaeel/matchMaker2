import axios from 'axios';
import { baseURL } from './api';

// Create axios instance for messaging APIs
const messagingClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
messagingClient.interceptors.request.use(
  (config) => {
    console.log(`[Messaging API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
messagingClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[Messaging API] Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Transform API message to app format
const transformMessage = (apiMessage, index) => {
  return {
    id: `msg_${index}_${Date.now()}`, // Generate client-side ID
    senderId: apiMessage.senderId,
    text: apiMessage.text,
    timestamp: apiMessage.timestamp ? new Date(apiMessage.timestamp) : new Date(),
    read: false, // API doesn't provide read status, default to false
  };
};

// Transform API conversation to app format
const transformConversation = (apiConversation, currentUserId) => {
  return {
    id: apiConversation.conversationId,
    conversationId: apiConversation.conversationId,
    otherUserId: apiConversation.otherUserId,
    participants: [currentUserId, apiConversation.otherUserId],
    lastMessage: null, // Will be fetched separately if needed
    lastMessageTime: null,
    updatedAt: new Date(), // Use current time as fallback
    unreadCount: 0, // Will be calculated client-side if needed
  };
};

// Conversation APIs
export const conversationAPI = {
  /**
   * Create a conversation between two users
   * @param {string} userA - First user ID
   * @param {string} userB - Second user ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  createConversation: async (userA, userB) => {
    try {
      const response = await messagingClient.post('/conversations', {
        userA,
        userB,
      });
      
      return {
        success: true,
        data: {
          conversationId: response.data.conversationId,
          participants: response.data.participants,
        },
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create conversation';
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Get user inbox (all conversations for a user)
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  getUserInbox: async (userId) => {
    try {
      const response = await messagingClient.get(`/conversations/user/${userId}`);
      
      // Transform API response to app format
      const transformedConversations = response.data.map(conv => 
        transformConversation(conv, userId)
      );
      
      return {
        success: true,
        data: transformedConversations,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch inbox';
      return {
        success: false,
        error: errorMessage,
        data: [], // Return empty array on error
      };
    }
  },
};

// Message APIs
export const messageAPI = {
  /**
   * Send a message in a conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} senderId - Sender user ID
   * @param {string} text - Message text
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  sendMessage: async (conversationId, senderId, text) => {
    try {
      const response = await messagingClient.post(`/messages/${conversationId}`, {
        senderId,
        text,
      });
      
      return {
        success: true,
        data: {
          messageId: response.data.messageId,
          status: response.data.status,
        },
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send message';
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Get chat history for a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  getChatHistory: async (conversationId) => {
    try {
      const response = await messagingClient.get(`/messages/${conversationId}`);
      
      // Transform API messages to app format
      const transformedMessages = response.data.map((msg, index) => 
        transformMessage(msg, index)
      );
      
      return {
        success: true,
        data: transformedMessages,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch chat history';
      return {
        success: false,
        error: errorMessage,
        data: [], // Return empty array on error
      };
    }
  },
};

// User Image Upload API
export const imageUploadAPI = {
  /**
   * Upload profile images for a user
   * @param {string} userId - User ID
   * @param {Array<File|Object>} files - Array of image files
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  uploadUserImages: async (userId, files) => {
    try {
      const formData = new FormData();
      
      // Add files to FormData
      files.forEach((file, index) => {
        const fileUri = file.uri || file;
        const fileName = file.fileName || `image_${index}.jpg`;
        const fileType = file.type || 'image/jpeg';
        
        formData.append('files', {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });
      });
      
      const response = await messagingClient.post(
        `/api/users/${userId}/upload-images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return {
        success: true,
        data: {
          message: response.data.message,
          count: response.data.count,
        },
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to upload images';
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};

// Helper function to find or create conversation
export const findOrCreateConversation = async (userA, userB) => {
  try {
    // First, try to get user inbox to check if conversation exists
    const inboxResult = await conversationAPI.getUserInbox(userA);
    
    if (inboxResult.success && inboxResult.data) {
      // Check if conversation with userB already exists
      const existingConversation = inboxResult.data.find(
        conv => conv.otherUserId === userB || conv.participants?.includes(userB)
      );
      
      if (existingConversation) {
        return {
          success: true,
          data: {
            conversationId: existingConversation.conversationId || existingConversation.id,
            isNew: false,
          },
        };
      }
    }
    
    // Conversation doesn't exist, create a new one
    const createResult = await conversationAPI.createConversation(userA, userB);
    
    if (createResult.success) {
      return {
        success: true,
        data: {
          conversationId: createResult.data.conversationId,
          isNew: true,
        },
      };
    }
    
    return createResult;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to find or create conversation',
    };
  }
};

export default {
  conversationAPI,
  messageAPI,
  imageUploadAPI,
  findOrCreateConversation,
};



