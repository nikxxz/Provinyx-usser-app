import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/RootNavigator';
import { commonStyles, colors, spacing } from '../styles/colors';
import { ItemDetails } from '../types';
import { dataService } from '../services/dataService';
import AppHeader from '../components/AppHeader';
import InfoCard from '../components/InfoCard';
import ExpandableSection from '../components/ExpandableSection';

type ScanResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ScanResult'
>;

const ScanResultScreen = ({ route, navigation }: ScanResultScreenProps) => {
  const { barcode } = route.params;
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState({
    meta: true,
    comp: false,
    env: false,
  });

  const fetchItemDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try scanner dummy data first
      const {
        getScannerProductByBarcode,
      } = require('../data/scannerDummyData');
      const scannerProduct = getScannerProductByBarcode(barcode);

      if (scannerProduct) {
        setItemDetails(scannerProduct);
        setLoading(false);
        return;
      }

      // Fall back to existing data service
      const details = await dataService.getItemDetails(barcode);

      if (details) {
        setItemDetails(details);
      } else {
        setError('Product not found in database');
      }
    } catch (err) {
      setError('Error fetching product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [barcode]);

  useEffect(() => {
    fetchItemDetails();
  }, [fetchItemDetails]);

  const handleShare = async () => {
    try {
      if (itemDetails) {
        await Share.share({
          message: `Product: ${itemDetails.productName}\nCategory: ${
            itemDetails.category
          }\nDescription: ${itemDetails.description}${
            itemDetails.price ? `\nPrice: $${itemDetails.price}` : ''
          }`,
          title: 'Share Product',
        });
      }

      await fetch('https://api.example.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barcode: barcode,
          productName: 'itemDetails.productName',
        }),
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleScanAgain = () => {
    navigation.navigate('Scanner');
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <AppHeader
          title="Scan Details"
          leftIconName="arrow-left"
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !itemDetails) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <AppHeader
          title="Scan Details"
          leftIconName="arrow-left"
          onLeftPress={() => navigation.goBack()}
        />
        <ScrollView>
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={64} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorBarcode}>Barcode: {barcode}</Text>

            <TouchableOpacity
              style={[commonStyles.button, commonStyles.primaryButton]}
              onPress={handleScanAgain}
            >
              <Text style={commonStyles.buttonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <AppHeader
        title="DIGITAL PRODUCT PASSPORT"
        leftIconName="arrow-left"
        onLeftPress={() => navigation.goBack()}
        rightIconName="account"
      />
      <ScrollView style={styles.scrollContainer}>
        {/* Product Image */}
        {itemDetails.image && (
          <View style={styles.productImageContainer}>
            <Image
              source={itemDetails.image}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Product ID and Price */}
        <View style={styles.productHeaderRow}>
          <View style={styles.productIdSection}>
            <Text style={styles.productIdLabel}>
              ID : {itemDetails.productId}
            </Text>
          </View>
          {itemDetails.price && (
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>
                ${itemDetails.price.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Product Description */}
        {itemDetails.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              {itemDetails.description}
            </Text>
          </View>
        )}

        {/* Product Name and Manufacturer Cards */}
        <View style={styles.infoCardsRow}>
          <InfoCard
            icon="package-variant"
            iconColor={colors.success}
            label="Product Name"
            value={itemDetails.productName}
            borderColor={colors.success}
          />
          <InfoCard
            icon="factory"
            iconColor={colors.warning}
            label="Manufacturer"
            value={itemDetails.manufacturer || 'N/A'}
            borderColor={colors.warning}
          />
        </View>

        {/* Product ID and Warranty Cards */}
        <View style={styles.infoCardsRow}>
          <InfoCard
            icon="alert-circle"
            iconColor={colors.error}
            label="Product ID"
            value={itemDetails.productId}
            borderColor={colors.error}
          />
          <InfoCard
            icon="shield-check"
            iconColor={colors.warning}
            label="Warranty"
            value={itemDetails.warranty || 'N/A'}
            borderColor={colors.warning}
          />
        </View>

        {/* Serial Number and Batch ID Cards */}
        {(itemDetails.serialNumber || itemDetails.batchId) && (
          <View style={styles.infoCardsRow}>
            {itemDetails.serialNumber && (
              <InfoCard
                icon="barcode"
                iconColor={colors.primary}
                label="Serial Number"
                value={itemDetails.serialNumber}
                borderColor={colors.primary}
              />
            )}
            {itemDetails.batchId && (
              <InfoCard
                icon="package-variant-closed"
                iconColor={colors.secondary}
                label="Batch ID"
                value={itemDetails.batchId}
                borderColor={colors.secondary}
              />
            )}
          </View>
        )}

        {/* Category and SKU Cards */}
        <View style={styles.infoCardsRow}>
          <InfoCard
            icon="tag"
            iconColor={colors.success}
            label="Category"
            value={itemDetails.category}
            borderColor={colors.success}
          />
          {itemDetails.sku && (
            <InfoCard
              icon="cube-outline"
              iconColor={colors.warning}
              label="SKU"
              value={itemDetails.sku}
              borderColor={colors.warning}
            />
          )}
          {itemDetails.manufactureDate && !itemDetails.sku && (
            <InfoCard
              icon="calendar"
              iconColor={colors.primary}
              label="Manufactured"
              value={itemDetails.manufactureDate.replace(/_/g, ' ')}
              borderColor={colors.primary}
            />
          )}
        </View>

        {/* Manufacture Date (if SKU exists) */}
        {itemDetails.manufactureDate && itemDetails.sku && (
          <View style={styles.manufactureDateBanner}>
            <Icon name="calendar-check" size={16} color={colors.primary} />
            <Text style={styles.manufactureDateText}>
              Manufactured: {itemDetails.manufactureDate.replace(/_/g, ' ')}
            </Text>
          </View>
        )}

        {/* Expandable Sections */}
        <ExpandableSection
          title="Identification & Metadata"
          isOpen={sectionsOpen.meta}
          onToggle={() => setSectionsOpen(s => ({ ...s, meta: !s.meta }))}
          data={itemDetails.metadata}
        />
        <ExpandableSection
          title="Material Composition"
          isOpen={sectionsOpen.comp}
          onToggle={() => setSectionsOpen(s => ({ ...s, comp: !s.comp }))}
          data={itemDetails.composition}
        />
        <ExpandableSection
          title="Environmental Data"
          isOpen={sectionsOpen.env}
          onToggle={() => setSectionsOpen(s => ({ ...s, env: !s.env }))}
          data={itemDetails.environmental}
        />

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.downloadButton} onPress={handleShare}>
            <Icon name="download" size={18} color="#ffffff" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share-variant" size={18} color="#ffffff" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
  },
  errorBarcode: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  productImageContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productHeaderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  productIdSection: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productIdLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  priceSection: {
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.white,
    opacity: 0.9,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginTop: 2,
  },
  descriptionSection: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 1,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  manufactureDateBanner: {
    backgroundColor: colors.blue50,
    borderRadius: 8,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  manufactureDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  infoCardsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  downloadButton: {
    ...commonStyles.actionButton,
    backgroundColor: colors.primary,
  },
  downloadButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    ...commonStyles.actionButton,
    backgroundColor: colors.secondary,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ScanResultScreen;
