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
    console.error('API Error:', error);
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

export { baseURL };