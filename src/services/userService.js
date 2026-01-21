/**
 * User Service
 * Handles user profile and account management API calls
 */

import apiService from './apiService';
import { API_ENDPOINTS, buildApiUrl, getApiBaseUrl } from '../constants';

/**
 * Update user profile information
 * @param {string} email - User's email
 * @param {Object} updates - Fields to update (username, phone)
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (email, updates) => {
  try {
    console.log('🔄 Updating user profile for:', email);
    console.log('📝 Updates:', updates);

    const url = `${getApiBaseUrl()}${
      API_ENDPOINTS.USER.UPDATE_BY_EMAIL
    }?email=${encodeURIComponent(email)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(updates),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('✅ Profile update response:', data.success);

    if (!response.ok || !data.success) {
      console.error('❌ API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('💥 User Service Error (update profile):', error);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }

    throw error;
  }
};

/**
 * Change user password
 * @param {string} email - User's email
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success response
 */
export const changePassword = async (email, oldPassword, newPassword) => {
  try {
    console.log('🔒 Changing password for:', email);

    const url = `${getApiBaseUrl()}${API_ENDPOINTS.USER.CHANGE_PASSWORD}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        oldPassword,
        newPassword,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('✅ Password change response:', data.success);

    if (!response.ok || !data.success) {
      console.error('❌ API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to change password');
    }

    return data;
  } catch (error) {
    console.error('💥 User Service Error (change password):', error);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }

    throw error;
  }
};

export default {
  updateUserProfile,
  changePassword,
};
