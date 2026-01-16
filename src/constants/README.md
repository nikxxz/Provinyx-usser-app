# Constants Configuration

This directory contains all the configuration constants used throughout the Unveilix app.

## File Structure

### `envConfig.js`

Contains environment-specific configurations:

- API base URLs for different environments (dev, staging, production)
- API timeout and retry configurations
- Security settings like token expiry and lockout durations

### `apiConfig.js`

Contains all API endpoint definitions and helpers:

- Authentication endpoints (login, register, etc.)
- User management endpoints
- Product/master data endpoints
- Helper functions to build complete URLs
- HTTP methods, status codes, and headers

### `authConfig.js`

Contains authentication-related configurations:

- Authentication types and states
- Storage keys for secure data
- User roles and permissions
- Validation patterns and password requirements
- Session configuration and error messages

### `index.js`

Central export file that re-exports all configurations for easy importing.

## Usage Examples

### Basic API URL Building

```javascript
import { buildApiUrl, API_ENDPOINTS } from '@/constants';

// Build a login URL
const loginUrl = buildApiUrl(API_ENDPOINTS.AUTH.LOGIN_EMAIL);

// Build URL with query parameters
const updateUserUrl = buildApiUrl(API_ENDPOINTS.USER.UPDATE_BY_EMAIL, {
  email: 'user@example.com',
});
```

### Using Helper Functions

```javascript
import { API_HELPERS } from '@/constants';

// Get specific URLs using helper functions
const loginUrl = API_HELPERS.getUserLoginUrl();
const productUrl = API_HELPERS.getProductByIdUrl('1234567890123');
const updateUserUrl = API_HELPERS.getUpdateUserByEmailUrl('user@example.com');
```

### Authentication Usage

```javascript
import {
  AUTH_STORAGE_KEYS,
  VALIDATION_PATTERNS,
  AUTH_ERROR_MESSAGES,
} from '@/constants';

// Validate email
const isValidEmail = VALIDATION_PATTERNS.EMAIL.test(email);

// Store auth token
await AsyncStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);

// Display error message
Alert.alert('Error', AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
```

### Environment Configuration

```javascript
import { getApiBaseUrl, CURRENT_ENV, ENV_TYPES } from '@/constants';

// Get current API base URL
const baseUrl = getApiBaseUrl();

// Check current environment
if (CURRENT_ENV === ENV_TYPES.DEVELOPMENT) {
  // Enable debug features
}
```

## Security Considerations

1. **Environment Switching**: Change `CURRENT_ENV` in `envConfig.js` based on your build configuration
2. **API URLs**: Update the base URLs in `API_BASE_URLS` to match your actual backend
3. **Storage Keys**: The storage keys use the `@unveilix_` prefix to avoid conflicts
4. **Validation**: Use the provided validation patterns for consistent input validation

## API Endpoints Reference

### Authentication

- `POST /api/login/username` - Login with username
- `POST /api/login/email` - Login with email
- `POST /api/users` - Register new user

### User Management

- `PUT /api/users/by-email?email=abc@xyz.com` - Update user info
- `PUT /api/users/update-password` - Change password

### Products

- `GET /api/master-data/GTIN-1234567890123` - Get product by ID

## Customization

To add new endpoints:

1. Add them to the appropriate section in `API_ENDPOINTS`
2. Create helper functions in `API_HELPERS` if needed
3. Update this README with the new endpoints

To add new authentication features:

1. Update `authConfig.js` with new constants
2. Add any new validation patterns
3. Update error messages as needed
