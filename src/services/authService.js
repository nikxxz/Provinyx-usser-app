import apiService from './apiService';
import { API_ENDPOINTS, AUTH_ERROR_MESSAGES } from '../constants';

class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
  }

  async loginWithUsername(username, password) {
    try {
      console.log('Login called with username:', username);

      const response = await apiService.post(
        API_ENDPOINTS.AUTH.LOGIN_USERNAME,
        {
          username,
          password,
        },
      );

      if (response.success) {
        this.user = response.data;
        this.isAuthenticated = true;

        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      } else {
        throw new Error(
          response.message || AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        );
      }
    } catch (error) {
      console.error('Login error:', error);

      // Map specific error codes to user-friendly messages
      let errorMessage = AUTH_ERROR_MESSAGES.SERVER_ERROR;

      if (error.errorCode === 'INVALID_CREDENTIALS') {
        errorMessage = AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
      } else if (error.errorCode === 'TIMEOUT') {
        errorMessage = AUTH_ERROR_MESSAGES.NETWORK_ERROR;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: error.errorCode || 'UNKNOWN_ERROR',
      };
    }
  }

  async register(userData) {
    try {
      console.log('Register called with:', userData);

      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, {
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      });

      if (response.success) {
        this.user = response.data;
        this.isAuthenticated = true;

        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      } else {
        throw new Error(
          response.message || AUTH_ERROR_MESSAGES.VALIDATION_ERROR,
        );
      }
    } catch (error) {
      console.error('Register error:', error);

      // Map specific error codes to user-friendly messages
      let errorMessage = AUTH_ERROR_MESSAGES.SERVER_ERROR;

      if (error.errorCode === 'EMAIL_ALREADY_EXISTS') {
        errorMessage = AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
      } else if (error.errorCode === 'USERNAME_ALREADY_EXISTS') {
        errorMessage = AUTH_ERROR_MESSAGES.USERNAME_ALREADY_EXISTS;
      } else if (error.errorCode === 'TIMEOUT') {
        errorMessage = AUTH_ERROR_MESSAGES.NETWORK_ERROR;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: error.errorCode || 'UNKNOWN_ERROR',
      };
    }
  }

  async logout() {
    try {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      console.log('Token refreshed');
      return { success: true };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }
}

export default new AuthService();
