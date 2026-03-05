import React, { createContext, useState, useCallback, useEffect } from 'react';
import { AUTH_STORAGE_KEYS } from '../constants';

// Fallback storage for when AsyncStorage is not available
class FallbackStorage {
  constructor() {
    this.storage = {};
  }

  async getItem(key) {
    return this.storage[key] || null;
  }

  async setItem(key, value) {
    this.storage[key] = value;
  }

  async removeItem(key) {
    delete this.storage[key];
  }

  async multiRemove(keys) {
    keys.forEach(key => delete this.storage[key]);
  }
}

let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn('AsyncStorage not available, using fallback storage');
  AsyncStorage = new FallbackStorage();
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check stored auth

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      if (!AsyncStorage) {
        setIsLoading(false);
        return;
      }

      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
      const accessToken = await AsyncStorage.getItem(
        AUTH_STORAGE_KEYS.ACCESS_TOKEN,
      );

      if (userData && accessToken) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeUserData = async (userData, token = null) => {
    try {
      if (!AsyncStorage) {
        console.warn('AsyncStorage not available, skipping data storage');
        return;
      }

      await AsyncStorage.setItem(
        AUTH_STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData),
      );
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEYS.LAST_LOGIN,
        new Date().toISOString(),
      );

      if (token) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const clearUserData = async () => {
    try {
      if (!AsyncStorage) {
        console.warn('AsyncStorage not available, skipping data clearing');
        return;
      }

      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEYS.USER_DATA,
        AUTH_STORAGE_KEYS.ACCESS_TOKEN,
        AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        AUTH_STORAGE_KEYS.LAST_LOGIN,
        AUTH_STORAGE_KEYS.LOGIN_TYPE,
        'unveilix_store',
      ]);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  // Login user with API response data
  const login = useCallback(async (userData, token = null) => {
    setIsLoading(true);
    try {
      await storeUserData(userData, token);
      setCurrentUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register user
  const register = useCallback(async user => {
    setIsLoading(true);
    try {
      await storeUserData(user);
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await clearUserData();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validate current user session
  const validateUser = useCallback(() => {
    if (currentUser) {
      // In a real app, you might want to validate token expiry here
      return true;
    }
    return false;
  }, [currentUser]);

  // Get current user
  const getCurrentUser = useCallback(() => {
    return currentUser;
  }, [currentUser]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return currentUser !== null;
  }, [currentUser]);

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    validateUser,
    getCurrentUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
