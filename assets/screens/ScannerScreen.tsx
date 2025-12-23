import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// @ts-ignore
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, spacing } from '../styles/colors';
import AppHeader from '../components/AppHeader';

type ScannerScreenProps = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

const ScannerScreen = ({ navigation }: ScannerScreenProps) => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const simulateScan = () => {
    const { getRandomScannerProduct } = require('../data/scannerDummyData');
    const randomProduct = getRandomScannerProduct();

    setScannedCode(randomProduct.barcode);
    setIsScanning(true);

    // Simulate scan processing time
    scanTimeoutRef.current = setTimeout(() => {
      navigation.navigate('ScanResult', { barcode: randomProduct.barcode });
      setIsScanning(false);
    }, 1500);
  };

  // Simulate manual barcode input
  const handleManualInput = () => {
    Alert.prompt(
      'Enter Barcode/QR Code',
      'Manually enter the barcode or QR code data:',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Scan',
          onPress: (text: string | undefined) => {
            if (text && text.trim()) {
              navigation.navigate('ScanResult', { barcode: text.trim() });
            }
          },
        },
      ],
      'plain-text',
    );
  };

  const handleCancel = () => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    setIsScanning(false);
    setScannedCode(null);
    navigation.goBack();
  };

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Chainshield - Scanner"
        leftIconName="arrow-left"
        onLeftPress={handleCancel}
        rightIconName="account"
        onRightPress={handleManualInput}
      />

      <View style={styles.content}>
        <Text style={styles.title}>One Scan. Zero Secrets.</Text>
        <Text style={styles.description}>
          Scan now to reveal complete product details
        </Text>
        <Image
          source={require('../assets/QR.png')}
          style={styles.qrImage}
          resizeMode="contain"
        />
        <Text style={styles.caption}>
          Align your camera with the QR code to scan and verify your product
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          isScanning && styles.primaryButtonDisabled,
        ]}
        onPress={simulateScan}
        activeOpacity={0.85}
        disabled={isScanning}
      >
        {isScanning ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>Scan Now</Text>
        )}
      </TouchableOpacity>

      {(isScanning || scannedCode) && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isScanning ? 'Processing scan...' : 'Scan complete'}
          </Text>
          {scannedCode && !isScanning ? (
            <Text style={styles.statusSubtext}>Code: {scannedCode}</Text>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  qrImage: {
    width: 220,
    height: 220,
    marginBottom: spacing.lg,
  },
  caption: {
    fontSize: 13,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  statusText: {
    color: colors.primary,
    fontWeight: '600',
  },
  statusSubtext: {
    marginTop: 4,
    color: colors.gray500,
    fontSize: 12,
  },
});

export default ScannerScreen;
