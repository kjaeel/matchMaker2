// API Configuration and Service Functions
const baseURL = 'https://my-java-backend-pifd.onrender.com';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, error: error.message };
  }
};

// User API Services
export const userAPI = {
  // Create a new user
  createUser: async (userData) => {
    return await apiCall('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get all users
  getAllUsers: async () => {
    return await apiCall('/api/users');
  },

  // Get user by ID
  getUserById: async (userId) => {
    return await apiCall(`/api/users/${userId}`);
  },

  // Search users by age range
  searchByAgeRange: async (minAge, maxAge) => {
    const params = new URLSearchParams({
      min: minAge.toString(),
      max: maxAge.toString(),
    });
    return await apiCall(`/api/users/search/age?${params}`);
  },

  // Search users by city
  searchByCity: async (city) => {
    const params = new URLSearchParams({
      city: city,
    });
    return await apiCall(`/api/users/search/city?${params}`);
  },
};

export { baseURL };