
import apiService from './apiService';
import { API_ENDPOINTS, buildApiUrl, getApiBaseUrl } from '../constants';


export const getProductByGtin = async gtin => {
  try {
    console.log('🔍 Fetching product data for GTIN:', gtin);

    // Build the URL: 
    const endpoint = `${API_ENDPOINTS.PRODUCTS.BY_ID}/${gtin}`;
    const url = `${getApiBaseUrl()}${endpoint}`;

    console.log('📡 API URL:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); 

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
    console.log('✅ Product data received:', data.success);

    if (!response.ok || !data.success) {
      console.error('❌ API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to fetch product data');
    }

    return data;
  } catch (error) {
    console.error('💥 Product Service Error:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }

    throw error;
  }
};


export const searchProducts = async query => {
  try {
    const endpoint = buildApiUrl(API_ENDPOINTS.PRODUCTS.SEARCH, { q: query });
    const response = await apiService.get(endpoint);
    return response;
  } catch (error) {
    console.error('Search Error:', error);
    throw error;
  }
};
