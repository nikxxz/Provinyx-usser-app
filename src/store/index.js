import { createContext, useState, useContext, useEffect } from 'react';
import { NativeModules } from 'react-native';

let AsyncStorage = null;
try {
  const native =
    NativeModules.RNCAsyncStorage || NativeModules.RNC_AsyncStorage;
  if (native) {
    // Only require AsyncStorage if the native module is available
    // to avoid runtime crashes when it is not linked.
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  }
} catch (e) {
  AsyncStorage = null;
}

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState({ scanHistory: [] });

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
      } catch (e) {
        // Ignore storage errors to avoid breaking the app
      }
    };

    loadState();
  }, []);

  const addScanToHistory = product => {
    setState(prevState => ({
      ...prevState,
      scanHistory: [product, ...(prevState.scanHistory || [])],
    }));
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
    addScanToHistory,
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
