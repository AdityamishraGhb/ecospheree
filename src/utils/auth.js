import { users } from './mockData';

// In a real application, these functions would interact with a backend API
// For now, we're using localStorage and mock data for demonstration purposes

/**
 * Authenticate a user with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} - Authentication result with user data or error message
 */
export const authenticateUser = (email, password) => {
  // In a real app, this would make an API call to authenticate
  // For this demo, we'll check against our mock users
  
  try {
    // Find user with matching email (case insensitive)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return {
        success: false,
        message: 'No account found with this email'
      };
    }
    
    // Check password
    if (user.password !== password) {
      return {
        success: false,
        message: 'Incorrect password'
      };
    }
    
    // Return user without sensitive data
    const { password: _, ...userWithoutPassword } = user;
    
    // Track last login time
    const userWithLoginTime = {
      ...userWithoutPassword,
      lastLogin: new Date().toISOString()
    };
    
    return {
      success: true,
      user: userWithLoginTime
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: 'An error occurred during authentication'
    };
  }
};

/**
 * Register a new user
 * 
 * @param {object} userData - User data including email, password, name
 * @returns {object} - Registration result with user data or error message
 */
export const registerUser = (userData) => {
  // In a real app, this would make an API call to register the user
  // For this demo, we'll simulate a registration process
  
  try {
    const { email, password, name } = userData;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists'
      };
    }
    
    // Create new user
    const newUser = {
      id: `user${users.length + 1}`,
      name,
      email,
      password,
      avatar: null,
      ecoPoints: 0,
      streak: 0,
      completedChallenges: [],
      registeredEvents: [],
      redeemedRewards: [],
      joinDate: new Date().toISOString(),
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        reminderFrequency: 'daily'
      }
    };
    
    // In a real app, this would be saved to a database
    // For the demo, we just return the user
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An error occurred during registration'
    };
  }
};

/**
 * Get current user from localStorage (for client-side)
 * 
 * @returns {object|null} - Current user or null if not authenticated
 */
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    try {
      const userJson = localStorage.getItem('ecoSphereUser');
      if (userJson) {
        return JSON.parse(userJson);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      // If there's an error parsing the user, remove the corrupted data
      localStorage.removeItem('ecoSphereUser');
    }
  }
  return null;
};

/**
 * Save user to localStorage
 * 
 * @param {object} user - User object to save
 */
export const saveUserToStorage = (user) => {
  if (typeof window !== 'undefined' && user) {
    try {
      localStorage.setItem('ecoSphereUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }
};

/**
 * Remove user from localStorage (logout)
 */
export const removeUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('ecoSphereUser');
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  }
};

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

/**
 * Get user role
 * 
 * @returns {string|null} - User role or null if not authenticated
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role || 'user' : null;
};

/**
 * Update user profile information and save to localStorage
 * 
 * @param {object} updatedUser - User object with updated information
 * @returns {object} - Updated user object
 */
export const updateUserProfile = (updatedUser) => {
  if (!updatedUser || !updatedUser.id) {
    throw new Error('Invalid user data');
  }
  
  // In a real app, this would make an API request to update the user in the database
  // For this demo, we'll just update the user in localStorage
  
  // Save the updated user to localStorage
  saveUserToStorage(updatedUser);
  
  return updatedUser;
};

/**
 * Update user eco points
 * 
 * @param {number} points - Points to add (positive) or subtract (negative)
 * @returns {object} - Updated user object or null if user not found
 */
export const updateUserPoints = (points) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return null;
  }
  
  // Update points
  const updatedUser = {
    ...currentUser,
    ecoPoints: Math.max(0, currentUser.ecoPoints + points)
  };
  
  // Save updated user
  saveUserToStorage(updatedUser);
  
  return updatedUser;
};

/**
 * Update user streak
 * 
 * @param {number} increment - Amount to increment streak by (usually 1)
 * @returns {object} - Updated user object or null if user not found
 */
export const updateUserStreak = (increment = 1) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return null;
  }
  
  // Update streak
  const updatedUser = {
    ...currentUser,
    streak: (currentUser.streak || 0) + increment
  };
  
  // Save updated user
  saveUserToStorage(updatedUser);
  
  return updatedUser;
};

/**
 * Reset user streak to zero
 * 
 * @returns {object} - Updated user object or null if user not found
 */
export const resetUserStreak = () => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return null;
  }
  
  // Reset streak
  const updatedUser = {
    ...currentUser,
    streak: 0
  };
  
  // Save updated user
  saveUserToStorage(updatedUser);
  
  return updatedUser;
};

/**
 * Add a completed challenge to the user's profile
 * 
 * @param {string} challengeId - ID of the completed challenge
 * @returns {object} - Updated user object or null if user not found
 */
export const addCompletedChallenge = (challengeId) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser || !challengeId) {
    return null;
  }
  
  // Check if challenge is already completed
  if (currentUser.completedChallenges && currentUser.completedChallenges.includes(challengeId)) {
    return currentUser;
  }
  
  // Add challenge to completed list
  const updatedUser = {
    ...currentUser,
    completedChallenges: [...(currentUser.completedChallenges || []), challengeId]
  };
  
  // Save updated user
  saveUserToStorage(updatedUser);
  
  return updatedUser;
}; 