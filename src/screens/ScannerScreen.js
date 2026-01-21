import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { getProductByGtin } from '../services/productService';
import { addScanToHistoryBackground } from '../services/historyService';
import { useStore } from '../store';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [scannedCodes, setScannedCodes] = useState(new Set());
  const { validateUser, logout, currentUser } = useContext(AuthContext);
  const { state, addToLocalHistory, cacheProductData } = useStore();
  const device = useCameraDevice('back');

  // Check auth status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        const isValid = validateUser();
        if (!isValid) {
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        }
      };

      checkAuth();
      setIsActive(true);

      return () => {
        setIsActive(false);
      };
    }, [validateUser, logout, navigation]),
  );

  // Request camera permission
  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();

      if (permission === 'denied') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings to scan QR codes.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => navigation.goBack(),
            },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }

      setHasPermission(permission === 'granted');
    };

    requestCameraPermission();
  }, [navigation]);

  // Handle QR code scan
  const handleScan = async barcode => {
    // Prevent duplicate scans
    if (scannedCodes.has(barcode)) {
      return;
    }

    setScannedCodes(prev => new Set(prev).add(barcode));
    setIsActive(false);

    try {
      console.log('🔍 Scanning barcode:', barcode);

      // Fetch product data from API
      const response = await getProductByGtin(barcode);

      if (response.success && response.data) {
        console.log('✅ Product found, navigating to Digital Passport');

        // Cache the product data locally
        cacheProductData(barcode, response.data);

        // Check if product already exists in history
        const existsInHistory = state.scanHistory?.includes(barcode);

        if (!existsInHistory) {
          // Add to local history (optimistic update)
          addToLocalHistory(barcode);

          // Save to API in background (non-blocking)
          if (currentUser?.email) {
            addScanToHistoryBackground(currentUser.email, barcode)
              .then(() => console.log('📝 Scan saved to API history'))
              .catch(err => console.warn('⚠️ Failed to save to API:', err));
          } else {
            console.warn('⚠️ No user email available for saving history');
          }
        } else {
          console.log(
            'ℹ️ Product already in history, skipping duplicate entry',
          );
        }

        // Navigate to Digital Passport with full API response
        navigation.reset({
          index: 1,
          routes: [
            { name: 'Home' },
            {
              name: 'DigitalPassport',
              params: { productData: response.data, barcode },
            },
          ],
        });
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('❌ Scanner Error:', error);

      // Show error alert
      Alert.alert(
        'Product Not Found',
        error.message ||
          `Unable to find product information for "${barcode}". Please try again.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setScannedCodes(new Set());
              setIsActive(true);
            },
          },
        ],
      );
    }
  };

  // Code scanner configuration
  const codeScanner = useCodeScanner({
    codeTypes: [
      'qr',
      'ean-13',
      'ean-8',
      'code-128',
      'code-39',
      'code-93',
      'upc-a',
      'upc-e',
    ],
    onCodeScanned: codes => {
      if (codes.length > 0 && isActive) {
        const code = codes[0];
        if (code.value) {
          handleScan(code.value);
        }
      }
    },
  });

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Camera Permission</Text>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.permissionContainer}>
          <Icon name="camera-off" size={80} color="#666" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Unveilix needs camera permission to scan QR codes for product
            verification.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.permissionButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsActive(!isActive)}
        >
          <Icon name={isActive ? 'pause' : 'play'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          enableZoomGesture
        />

        {/* Scan Frame Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <Text style={styles.instructionText}>
            Position the QR code within the frame
          </Text>

          {!isActive && (
            <View style={styles.pausedOverlay}>
              <Icon
                name="pause-circle"
                size={64}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.pausedText}>Scanning Paused</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instructionText: {
    marginTop: 32,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pausedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pausedText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
});

export default ScannerScreen;
