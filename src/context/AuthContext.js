import React, { createContext, useState, useCallback } from 'react';
import { getUsers, findUserByUsername } from '../constants/users';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login user
  const login = useCallback((username, password) => {
    setIsLoading(true);
    try {
      const user = getUsers().find(
        u => u.username === username && u.password === password,
      );
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register user
  const register = useCallback(user => {
    setIsLoading(true);
    try {
      setCurrentUser(user);
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // Check if user still exists in database (app refresh)
  const validateUser = useCallback(() => {
    if (currentUser) {
      const userExists = findUserByUsername(currentUser.username);
      if (!userExists) {
        // User was deleted from database
        setCurrentUser(null);
        return false;
      }
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
