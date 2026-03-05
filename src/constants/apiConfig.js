/**
 * API Configuration
 * This file contains all API endpoints and related configurations
 */

import { getApiBaseUrl } from './envConfig';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN_USERNAME: '/api/login/username',
    LOGIN_EMAIL: '/api/login/email',
    REGISTER: '/api/users',
    GOOGLE_AUTH: '/api/google-users',
    REFRESH_TOKEN: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  // User management endpoints
  USER: {
    PROFILE: '/api/users/profile',
    UPDATE_BY_EMAIL: '/api/users/by-email', // Use with query param ?email=
    CHANGE_PASSWORD: '/api/users/update-password',
    DELETE_ACCOUNT: '/api/users/delete',
  },

  // Product/Master Data endpoints
  PRODUCTS: {
    BY_ID: '/api/dpp', // Use with GTIN: /api/master-data/GTIN-1234567890123
    SEARCH: '/api/master-data/search',
    CATEGORIES: '/api/master-data/categories',
    BATCH_LOOKUP: '/api/master-data/batch',
  },

  // Additional endpoints for future use
  SCANNER: {
    VERIFY: '/api/scanner/verify',
    HISTORY: '/api/scanner/history',
  },

  NOTIFICATIONS: {
    GET_ALL: '/api/notifications',
    MARK_READ: '/api/notifications/read',
  },
};

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint, params = {}) => {
  const baseUrl = getApiBaseUrl();
  let url = `${baseUrl}${endpoint}`;

  // Add query parameters if provided
  if (Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    url += `?${queryString}`;
  }

  return url;
};

// Helper functions for specific endpoints
export const API_HELPERS = {
  // Auth helpers
  getUserLoginUrl: () => buildApiUrl(API_ENDPOINTS.AUTH.LOGIN_USERNAME),
  getEmailLoginUrl: () => buildApiUrl(API_ENDPOINTS.AUTH.LOGIN_EMAIL),
  getRegisterUrl: () => buildApiUrl(API_ENDPOINTS.AUTH.REGISTER),

  // User helpers
  getUpdateUserByEmailUrl: email =>
    buildApiUrl(API_ENDPOINTS.USER.UPDATE_BY_EMAIL, { email }),
  getChangePasswordUrl: () => buildApiUrl(API_ENDPOINTS.USER.CHANGE_PASSWORD),

  // Product helpers
  getProductByIdUrl: gtin =>
    `${getApiBaseUrl()}${API_ENDPOINTS.PRODUCTS.BY_ID}/GTIN-${gtin}`,
  getProductSearchUrl: query =>
    buildApiUrl(API_ENDPOINTS.PRODUCTS.SEARCH, { q: query }),
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Request Headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
};
