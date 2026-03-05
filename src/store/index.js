import { createContext, useState, useContext, useEffect } from 'react';
import { NativeModules } from 'react-native';
import { getUserHistory } from '../services/historyService';
import { getProductByGtin } from '../services/productService';

let AsyncStorage = null;
try {
  const native =
    NativeModules.RNCAsyncStorage || NativeModules.RNC_AsyncStorage;
  if (native) {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  }
} catch (e) {
  AsyncStorage = null;
}

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState({
    scanHistory: [],
    productCache: {},
    isLoadingHistory: false,
    historyLastFetched: null,
    historyError: null,
  });

  // Load persisted store state on mount
  useEffect(() => {
    const loadState = async () => {
      if (!AsyncStorage) {
        return;
      }

      try {
        const stored = await AsyncStorage.getItem('unveilix_store');
        if (stored) {
          const parsed = JSON.parse(stored);
          setState(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {}
    };

    loadState();
  }, []);

  const fetchUserHistory = async (emailOrId, forceRefresh = false) => {
    if (!emailOrId) {
      console.warn('⚠️ No email/ID provided for fetching history');
      return;
    }

    // Additional validation
    const isEmail = typeof emailOrId === 'string' && emailOrId.includes('@');
    if (!isEmail) {
      const id =
        typeof emailOrId === 'string' ? parseInt(emailOrId, 10) : emailOrId;
      if (!Number.isInteger(id) || id <= 0) {
        console.error(
          '❌ Invalid user ID:',
          emailOrId,
          '- skipping history fetch',
        );
        return;
      }
    }

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    if (
      !forceRefresh &&
      state.historyLastFetched &&
      now - state.historyLastFetched < fiveMinutes
    ) {
      console.log('📋 Using cached history (fetched recently)');
      return;
    }

    // Prevent concurrent requests
    if (state.isLoadingHistory && !forceRefresh) {
      console.log('⏳ History fetch already in progress');
      return;
    }

    setState(prev => ({ ...prev, isLoadingHistory: true, historyError: null }));

    try {
      const response = await getUserHistory(emailOrId);

      if (response.success && response.data?.history) {
        // History contains array of product IDs/barcodes
        const historyIds = response.data.history || [];

        setState(prev => ({
          ...prev,
          scanHistory: historyIds,
          isLoadingHistory: false,
          historyLastFetched: now,
          historyError: null,
        }));

        console.log('✅ History updated from API:', historyIds.length, 'items');
      } else if (response.success && response.data?.historyCount === 0) {
        // User has no history yet
        setState(prev => ({
          ...prev,
          scanHistory: [],
          isLoadingHistory: false,
          historyLastFetched: now,
          historyError: null,
        }));
        console.log('✅ New user - no history yet');
      } else {
        throw new Error(response.message || 'Invalid response from server');
      }
    } catch (err) {
      console.error('❌ Failed to fetch history:', err);
      const errorMessage = err?.message || 'Failed to fetch history';
      setState(prev => ({
        ...prev,
        isLoadingHistory: false,
        historyError: errorMessage,
        historyLastFetched: now,
      }));
    }
  };

  const getProductDetails = async productIdOrDppId => {
    // Check cache first (productId could be dppId or GTIN)
    if (state.productCache[productIdOrDppId]) {
      console.log('📦 Using cached product data for:', productIdOrDppId);
      return state.productCache[productIdOrDppId];
    }

    // Fetch from API
    try {
      console.log('🔍 Fetching product details for:', productIdOrDppId);
      const response = await getProductByGtin(productIdOrDppId);

      if (response.success && response.data) {
        // Extract dppId from new response structure
        const dppId = response.data.dppId || productIdOrDppId;

        // Cache the product data using dppId as key
        setState(prev => ({
          ...prev,
          productCache: {
            ...prev.productCache,
            [dppId]: response.data,
            // Also cache by the search key if different
            ...(dppId !== productIdOrDppId
              ? { [productIdOrDppId]: response.data }
              : {}),
          },
        }));

        return response.data;
      }
    } catch (error) {
      console.error('❌ Failed to fetch product details:', error);
      return null;
    }
  };

  const cacheProductData = (productIdOrDppId, productData) => {
    // Extract dppId from new response structure if available
    const dppId = productData?.dppId || productIdOrDppId;

    setState(prev => ({
      ...prev,
      productCache: {
        ...prev.productCache,
        [dppId]: productData,
        // Also cache by the provided key if different
        ...(dppId !== productIdOrDppId
          ? { [productIdOrDppId]: productData }
          : {}),
      },
    }));
  };

  const addToLocalHistory = dppIdOrProductId => {
    setState(prev => {
      const existingHistory = prev.scanHistory || [];
      const filtered = existingHistory.filter(id => id !== dppIdOrProductId);
      return {
        ...prev,
        scanHistory: [dppIdOrProductId, ...filtered],
      };
    });
  };

  const addScanToHistory = product => {
    // Extract dppId from new structure, fallback to legacy fields
    const dppId =
      product.dppId ||
      product.productData?.dppId ||
      product.barcode ||
      product.productId;
    if (dppId) {
      addToLocalHistory(dppId);

      if (product.productData) {
        cacheProductData(dppId, product.productData);
      }
    }
  };

  const clearProductCache = () => {
    setState(prev => ({
      ...prev,
      productCache: {},
    }));
  };

  const clearStore = async () => {
    setState({
      scanHistory: [],
      productCache: {},
      isLoadingHistory: false,
      historyLastFetched: null,
      historyError: null,
    });
    if (AsyncStorage) {
      try {
        await AsyncStorage.removeItem('unveilix_store');
      } catch (e) {}
    }
  };

  // Persist store state when it changes
  useEffect(() => {
    const saveState = async () => {
      if (!AsyncStorage) {
        return;
      }

      try {
        await AsyncStorage.setItem('unveilix_store', JSON.stringify(state));
      } catch (e) {
        // Ignore storage errors
      }
    };

    saveState();
  }, [state]);

  const value = {
    state,
    setState,
    addScanToHistory, // Legacy
    fetchUserHistory,
    getProductDetails,
    cacheProductData,
    addToLocalHistory,
    clearProductCache,
    clearStore,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};

export default StoreProvider;
