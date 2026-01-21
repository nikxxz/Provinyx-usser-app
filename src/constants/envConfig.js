
// Environment types
export const ENV_TYPES = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
};

export const CURRENT_ENV = ENV_TYPES.DEVELOPMENT;

// Environment-specific API base URLs
export const API_BASE_URLS = {
  [ENV_TYPES.DEVELOPMENT]: 'https://dpp-api.acespireconsulting.com',
  [ENV_TYPES.STAGING]: 'https://dpp-api.acespireconsulting.com',
  [ENV_TYPES.PRODUCTION]: 'https://dpp-api.acespireconsulting.com',
};

// Get current base URL
export const getApiBaseUrl = () => API_BASE_URLS[CURRENT_ENV];

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 15000, // 15 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Security Configuration
export const SECURITY_CONFIG = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  REFRESH_TOKEN_THRESHOLD: 5 * 60 * 1000, // Refresh when 5 minutes left
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes lockout
};
