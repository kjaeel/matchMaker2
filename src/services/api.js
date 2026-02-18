import axios from 'axios';

// API Configuration
const baseURL = 'https://my-java-backend-pifd.onrender.com';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Handle CORS
  withCredentials: false,
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    if (config.data) {
      console.log('📤 Request body:', JSON.stringify(config.data, null, 2));
    }
    if (config.params) {
      console.log('📤 Request params:', JSON.stringify(config.params, null, 2));
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 Response from ${response.config.method?.toUpperCase()} ${response.config.url}:`);
    console.log('  - Status:', response.status);
    if (response.config.url?.includes('/messages/')) {
      console.log('  - Messages Data:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('  - Data:', JSON.stringify(response.data, null, 2));
    }
    return response;
  },
  (error) => {
    console.error(`❌ API Error for ${error.config?.method?.toUpperCase()} ${error.config?.url}:`);
    console.error('  - Status:', error.response?.status);
    console.error('  - Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('  - Message:', error.message);
    return Promise.reject(error);
  }
);

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await apiClient.request({
      url: endpoint,
      ...options,
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'API call failed';
    return { success: false, error: errorMessage };
  }
};

// Auth API Services
export const authAPI = {
  // Login user
  login: async (identifier, password) => {
    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      const loginData = isEmail 
        ? { email: identifier.trim(), password: password }
        : { phone: identifier.trim(), password: password };
      
      console.log('🔐 Login attempt:');
      console.log('  - Identifier:', identifier);
      console.log('  - Is Email:', isEmail);
      console.log('  - Request body:', JSON.stringify(loginData, null, 2));
      console.log('  - Base URL:', baseURL);
      
      // Use the correct endpoint: /api/users/login
      const endpoint = '/api/users/login';
      console.log(`  - Using endpoint: ${endpoint}`);
      console.log(`  - Full URL: ${baseURL}${endpoint}`);
      
      const response = await apiClient.post(endpoint, loginData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      console.log('✅ Login successful:', response.status);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Login error:');
      console.error('  - Status:', error.response?.status);
      console.error('  - Status Text:', error.response?.statusText);
      console.error('  - Response Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('  - Error Message:', error.message);
      console.error('  - Request Config:', JSON.stringify({
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers,
      }, null, 2));
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.response?.statusText 
        || error.message 
        || 'Login failed';
      
      return { success: false, error: errorMessage, status: error.response?.status };
    }
  },
};

// User API Services
export const userAPI = {
  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/api/users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create user';
      return { success: false, error: errorMessage };
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/api/users');
      console.log(response)
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users';
      return { success: false, error: errorMessage };
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user';
      return { success: false, error: errorMessage };
    }
  },

  // Search users by age range
  searchByAgeRange: async (minAge, maxAge) => {
    try {
      const response = await apiClient.get('/api/users/search/age', {
        params: {
          min: minAge,
          max: maxAge,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to search by age';
      return { success: false, error: errorMessage };
    }
  },

  // Search users by city
  searchByCity: async (city) => {
    try {
      const response = await apiClient.get('/api/users/search/city', {
        params: {
          city: city,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to search by city';
      return { success: false, error: errorMessage };
    }
  },
};

// Conversation API Services
export const conversationAPI = {
  // Create or get conversation between two users
  createOrGetConversation: async (userA, userB) => {
    try {
      console.log('📡 conversationAPI.createOrGetConversation called with:');
      console.log('  - userA:', userA);
      console.log('  - userB:', userB);
      
      const requestBody = {
        userA: String(userA),
        userB: String(userB),
      };
      console.log('📤 POST request to: /conversations');
      console.log('📤 Request body:', requestBody);
      
      const response = await apiClient.post('/conversations', requestBody);
      
      console.log('📥 Conversation API Response status:', response.status);
      console.log('📥 Conversation API Response data:', JSON.stringify(response.data, null, 2));
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ conversationAPI.createOrGetConversation error:');
      console.error('  - Status:', error.response?.status);
      console.error('  - Data:', error.response?.data);
      console.error('  - Message:', error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create/get conversation';
      return { success: false, error: errorMessage };
    }
  },
};

// Message API Services
export const messageAPI = {
  // Get message history for a conversation
  getMessages: async (conversationId) => {
    try {
      console.log('📡 messageAPI.getMessages called with conversationId:', conversationId);
      
      if (!conversationId) {
        console.error('❌ conversationId is undefined!');
        return { success: false, error: 'Conversation ID is required' };
      }
      
      const url = `/messages/${conversationId}`;
      console.log('📡 GET request to:', url);
      
      const response = await apiClient.get(url);
      
      console.log('📥 getMessages Response status:', response.status);
      console.log('📥 getMessages Response data:', JSON.stringify(response.data, null, 2));
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ messageAPI.getMessages error:');
      console.error('  - Status:', error.response?.status);
      console.error('  - Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('  - Message:', error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch messages';
      return { success: false, error: errorMessage };
    }
  },

  // Send a message
  sendMessage: async (conversationId, senderId, text) => {
    try {
      console.log('📡 messageAPI.sendMessage called with:');
      console.log('  - conversationId:', conversationId);
      console.log('  - senderId:', senderId);
      console.log('  - text:', text);
      
      if (!conversationId) {
        console.error('❌ conversationId is undefined!');
        return { success: false, error: 'Conversation ID is required' };
      }
      
      const url = `/messages/${conversationId}`;
      console.log('📡 POST request to:', url);
      console.log('📤 Request body:', { senderId: String(senderId), text });
      
      const response = await apiClient.post(url, {
        senderId: String(senderId),
        text: text,
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response data:', JSON.stringify(response.data, null, 2));
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ messageAPI.sendMessage error:');
      console.error('  - Status:', error.response?.status);
      console.error('  - Data:', error.response?.data);
      console.error('  - Message:', error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      return { success: false, error: errorMessage };
    }
  },
};

export { baseURL };