
// Authentication types
export const AUTH_TYPES = {
  USERNAME: 'username',
  EMAIL: 'email',
  SOCIAL: 'social',
  BIOMETRIC: 'biometric',
};

// Token types
export const TOKEN_TYPES = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  RESET: 'reset_token',
};

// Storage keys for authentication data
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: '@unveilix_access_token',
  REFRESH_TOKEN: '@unveilix_refresh_token',
  USER_DATA: '@unveilix_user_data',
  LOGIN_TYPE: '@unveilix_login_type',
  BIOMETRIC_ENABLED: '@unveilix_biometric_enabled',
  REMEMBER_CREDENTIALS: '@unveilix_remember_credentials',
  LAST_LOGIN: '@unveilix_last_login',
  LOGIN_ATTEMPTS: '@unveilix_login_attempts',
  LOCKOUT_TIME: '@unveilix_lockout_time',
};

// User roles and permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PREMIUM: 'premium',
  GUEST: 'guest',
};

// Permission levels
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin',
};

// Authentication states
export const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  EXPIRED: 'expired',
  LOCKED: 'locked',
  ERROR: 'error',
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
};

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
  SPECIAL_CHARS: '@$!%*?&',
};

// Session configuration
export const SESSION_CONFIG = {
  IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutes of inactivity
  WARNING_THRESHOLD: 5 * 60 * 1000, // Warn user 5 minutes before timeout
  EXTEND_SESSION_INTERVAL: 5 * 60 * 1000, // Check every 5 minutes
};

// Error messages
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password',
  ACCOUNT_LOCKED:
    'Account is temporarily locked due to too many failed attempts',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  SERVER_ERROR: 'Server error. Please try again later',
  VALIDATION_ERROR: 'Please check your input and try again',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email address already exists',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  PASSWORD_TOO_WEAK: 'Password does not meet security requirements',
  ACCOUNT_NOT_VERIFIED: 'Please verify your email address to continue',
};
