import {
  getApiBaseUrl,
  API_CONFIG,
  CONTENT_TYPES,
  REQUEST_HEADERS,
} from '../constants';

class ApiService {
  constructor() {
    this.timeout = API_CONFIG.TIMEOUT;
  }

  getBaseUrl() {
    return getApiBaseUrl();
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post(endpoint, data) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  getHeaders(includeAuth = false) {
    const headers = {
      [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
      [REQUEST_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
    };

    if (includeAuth) {
      // TODO: Add token when implementing token storage
      // headers[REQUEST_HEADERS.AUTHORIZATION] = `Bearer ${getToken()}`;
    }

    return headers;
  }

  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok || !data.success) {
      const error = new Error(data.message || `HTTP Error: ${response.status}`);
      error.statusCode = data.statusCode || response.status;
      error.errorCode = data.error || 'UNKNOWN_ERROR';
      error.data = data;
      throw error;
    }

    return data;
  }

  handleError(error) {
    console.error('API Error:', error);

    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timeout');
      timeoutError.statusCode = 408;
      timeoutError.errorCode = 'TIMEOUT';
      throw timeoutError;
    }

    throw error;
  }
}

export default new ApiService();
