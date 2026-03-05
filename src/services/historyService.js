/**
 * History Service
 * Handles user scan history API calls
 */

import apiService from './apiService';
import { getApiBaseUrl } from '../constants';

/**
 * Add a history entry for a user
 * @param {string} email - User's email
 * @param {string} entry - History entry (product ID/barcode)
 * @returns {Promise<Object>} API response
 */
export const addHistoryEntry = async (email, entry) => {
  try {
    console.log('📝 Adding history entry:', { email, entry });

    const endpoint = '/api/users/history';
    const response = await apiService.post(endpoint, { email, entry });

    console.log('✅ History entry added successfully');
    return response;
  } catch (error) {
    console.error('❌ Add History Error:', error);
    // Don't throw - we don't want to block user flow if history save fails
    return { success: false, error: error.message };
  }
};

/**
 * Get user history
 * @param {string|number} emailOrId - User's email or ID
 * @returns {Promise<Object>} User data with history
 */
export const getUserHistory = async emailOrId => {
  try {
    console.log('📖 Fetching user history for:', emailOrId);

    // Determine if it's an email or ID
    const isEmail = typeof emailOrId === 'string' && emailOrId.includes('@');

    let queryParam;
    if (isEmail) {
      queryParam = `email=${encodeURIComponent(emailOrId)}`;
    } else {
      // Convert to number and validate
      const id =
        typeof emailOrId === 'string' ? parseInt(emailOrId, 10) : emailOrId;
      if (!Number.isInteger(id) || id <= 0) {
        console.error('❌ Invalid user ID:', emailOrId);
        throw new Error('Invalid user ID. Must be a positive integer.');
      }
      queryParam = `id=${id}`;
    }

    const endpoint = `/api/users/history?${queryParam}`;
    const url = `${getApiBaseUrl()}${endpoint}`;

    console.log('🌐 Fetching from URL:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    console.log('📥 API Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, data.message);
      throw new Error(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    if (!data.success) {
      console.error('❌ API returned success=false:', data.message);
      throw new Error(data.message || 'Failed to fetch user history');
    }

    // Handle empty history gracefully
    if (
      data.data &&
      Array.isArray(data.data.history) &&
      data.data.history.length === 0
    ) {
      console.log('✅ User has empty history');
      return data;
    }

    console.log(
      '✅ User history retrieved:',
      data.data?.history?.length || data.data?.historyCount || 0,
      'entries',
    );
    return data;
  } catch (error) {
    console.error('❌ Get History Error:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }

    throw error;
  }
};

/**
 * Add scan to history (background operation)
 * This function doesn't throw errors to avoid blocking the UI
 * @param {string} email - User's email
 * @param {string} productId - Product ID/barcode
 */
export const addScanToHistoryBackground = async (email, productId) => {
  try {
    await addHistoryEntry(email, productId);
  } catch (error) {
    // Silently log error - don't interrupt user flow
    console.warn(
      '⚠️ Background history save failed (non-critical):',
      error.message,
    );
  }
};

export default {
  addHistoryEntry,
  getUserHistory,
  addScanToHistoryBackground,
};
