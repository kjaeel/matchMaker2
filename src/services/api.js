import axios from 'axios';

// API Configuration
const baseURL = 'https://my-java-backend-pifd.onrender.com';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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

// User API Services
export const userAPI = {
  // Login user
  login: async (identifier, password) => {
    try {
      const response = await apiClient.post('/users/login', {
        identifier,
        password,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to login';
      return { success: false, error: errorMessage };
    }
  },

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

  // Update user by ID
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/api/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update user';
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

  // Swipe right (like) - dummy API call
  swipeRight: async (userId) => {
    try {
      // Dummy API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`[DUMMY API] Swipe right (like) for user: ${userId}`);
      return { success: true, data: { userId, action: 'like', matched: false } };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to like user';
      return { success: false, error: errorMessage };
    }
  },

  // Swipe left (pass) - dummy API call
  swipeLeft: async (userId) => {
    try {
      // Dummy API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`[DUMMY API] Swipe left (pass) for user: ${userId}`);
      return { success: true, data: { userId, action: 'pass' } };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to pass user';
      return { success: false, error: errorMessage };
    }
  },
};

// Chat API Services (Placeholder for Java SpringBoot backend)
export const chatAPI = {
  // Create chat room (placeholder - will be handled by backend)
  createChatRoom: async (userId1, userId2) => {
    try {
      // TODO: Call Java SpringBoot backend
      // const response = await apiClient.post('/api/chat/rooms', {
      //   userId1,
      //   userId2,
      // });
      // return { success: true, data: response.data };
      
      // Placeholder response
      console.log('[Chat API] Create chat room (placeholder):', userId1, userId2);
      return { success: true, data: { roomId: `room_${userId1}_${userId2}` } };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create chat room';
      return { success: false, error: errorMessage };
    }
  },

  // Get chat rooms for user (placeholder)
  getChatRooms: async (userId) => {
    try {
      // TODO: Call Java SpringBoot backend
      // const response = await apiClient.get(`/api/chat/rooms/${userId}`);
      // return { success: true, data: response.data };
      
      // Placeholder response
      console.log('[Chat API] Get chat rooms (placeholder):', userId);
      return { success: true, data: [] };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get chat rooms';
      return { success: false, error: errorMessage };
    }
  },
};

// Payment API Services
export const paymentAPI = {
  // Create Cashfree order on backend to get order token
  createOrder: async (payload) => {
    try {
      const response = await apiClient.post('/api/payments/create-order', payload);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create order';
      return { success: false, error: errorMessage };
    }
  },
};

export { baseURL };