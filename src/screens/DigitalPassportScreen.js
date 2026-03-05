import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { getProductByGtin } from '../services/productService';

const DigitalPassportScreen = ({ route, navigation }) => {
  const {
    productData: initialProductData,
    dppId,
    gtin,
    barcode,
  } = route.params;
  const { validateUser, logout } = useContext(AuthContext);

  const [productData, setProductData] = useState(initialProductData || null);
  const [isLoading, setIsLoading] = useState(!initialProductData);
  const [error, setError] = useState(null);

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
    }, [validateUser, logout, navigation]),
  );

  const [expandedSections, setExpandedSections] = useState({
    identification: false,
    productInfo: false,
    sustainability: false,
  });

  // Animation values
  const imageScale = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const card1Slide = useRef(new Animated.Value(50)).current;
  const card2Slide = useRef(new Animated.Value(50)).current;
  const card3Slide = useRef(new Animated.Value(50)).current;
  const card4Slide = useRef(new Animated.Value(50)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;

  // Fetch product data if not provided
  useEffect(() => {
    const fetchProductData = async () => {
      if (!initialProductData && (gtin || barcode)) {
        try {
          console.log('📡 Fetching product data from DigitalPassport screen');
          setIsLoading(true);
          const response = await getProductByGtin(gtin || barcode);

          if (response.success && response.data) {
            setProductData(response.data);
            setError(null);
          } else {
            setError('Product not found');
          }
        } catch (err) {
          console.error('❌ Error fetching product:', err);
          setError(err.message || 'Failed to load product data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProductData();
  }, [initialProductData, gtin, barcode]);

  // Start animations once data is loaded
  useEffect(() => {
    if (productData && !isLoading) {
      // Animate image first
      Animated.parallel([
        Animated.spring(imageScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Then animate cards sequentially
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(cardsOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.stagger(100, [
            Animated.spring(card1Slide, {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(card2Slide, {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(card3Slide, {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(card4Slide, {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, isLoading]);

  const toggleSection = section => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const renderMetadataRow = (label, value) => {
    if (!value || value === '' || value === 'null' || value === 'undefined') {
      return null;
    }

    return (
      <View key={label} style={styles.metadataRow}>
        <Text style={styles.metadataLabel}>{label}</Text>
        <Text style={styles.metadataValue}>{String(value)}</Text>
      </View>
    );
  };

  const renderInfoCard = (
    iconImage,
    label,
    value,
    trend,
    trendText,
    bgColor,
    slideAnim,
  ) => (
    <Animated.View
      style={[
        styles.infoCard,
        {
          opacity: cardsOpacity,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={2}>
          {value}
        </Text>
        {trend && trendText && (
          <View style={styles.trendContainer}>
            <Icon
              name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
              size={14}
              color={trend === 'up' ? colors.success : colors.error}
            />
            <Text
              style={[
                styles.trendText,
                { color: trend === 'up' ? colors.success : colors.error },
              ]}
            >
              {trendText}
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.infoIconContainer, { backgroundColor: bgColor }]}>
        <Image
          source={iconImage}
          style={styles.infoIcon}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DIGITAL PRODUCT PASSPORT</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="account-circle-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading product data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !productData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DIGITAL PRODUCT PASSPORT</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="account-circle-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={80} color={colors.error} />
          <Text style={styles.errorTitle}>Unable to Load Product</Text>
          <Text style={styles.errorText}>
            {error || 'Product data not available'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Extract from new nested masterData structure
  const masterData = productData?.masterData || productData;
  const { productSummary, categories } = masterData || {};
  const identification = categories?.identification || {};
  const productInfo = categories?.productInformation || {};
  const sustainability = categories?.sustainability || {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DIGITAL PRODUCT PASSPORT</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="account-circle-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          {productSummary?.image ? (
            <Image
              source={{ uri: productSummary.image }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="image-off" size={60} color={colors.gray400} />
            </View>
          )}
        </Animated.View>

        {/* DPP ID - Large at top */}
        <View style={styles.dppIdContainer}>
          <Text style={styles.dppIdLabel}>ID : </Text>
          <Text style={styles.dppIdValue}>
            {productData.dppId || dppId || 'N/A'}
          </Text>
        </View>

        {/* Info Cards Grid */}
        <View style={styles.infoCardsGrid}>
          <View style={styles.infoCardsRow}>
            {renderInfoCard(
              require('../../assets/ProductName.png'),
              'Product Name',
              productSummary?.productName || 'N/A',
              'up',
              '2.5% Up from past week',
              colors.white,
              card1Slide,
            )}
            {renderInfoCard(
              require('../../assets/Manufacturer.png'),
              'Manufacturer',
              productSummary?.manufacturer || 'N/A',
              'up',
              '1.8% Up from past week',
              colors.white,
              card2Slide,
            )}
          </View>
          <View style={styles.infoCardsRow}>
            {renderInfoCard(
              require('../../assets/ProductID.png'),
              'Product ID',
              productSummary?.modelNumber || 'N/A',
              'down',
              '4.5% Down from yesterday',
              colors.white,
              card3Slide,
            )}
            {renderInfoCard(
              require('../../assets/Warranty2.png'),
              'Warranty',
              productSummary?.warranty || 'N/A',
              'up',
              '1.8% Up from yesterday',
              colors.white,
              card4Slide,
            )}
          </View>
        </View>

        {/* Expandable Sections */}

        {/* Identification & Metadata */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('identification')}
        >
          <Text style={styles.sectionTitle}>Identification & Metadata</Text>
          <Icon
            name={
              expandedSections.identification ? 'chevron-up' : 'chevron-down'
            }
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        {expandedSections.identification && (
          <View style={styles.sectionContent}>
            {renderMetadataRow('Product Level', identification.productLevel)}
            {renderMetadataRow('Serial Number', identification.serialNumber)}
            {renderMetadataRow(
              'Production Date',
              identification.productionDate,
            )}
            {renderMetadataRow(
              'Product Category',
              identification.productCategory,
            )}
            {renderMetadataRow(
              'Manufacturer Name',
              identification.manufacturerName,
            )}
            {renderMetadataRow(
              'Manufacturer ID',
              identification.manufacturerIdentifier,
            )}
            {renderMetadataRow(
              'Manufacturing Facility',
              identification.manufacturingFacilityID,
            )}
            {renderMetadataRow(
              'Unique Product ID',
              identification.uniqueProductIdentifier,
            )}
          </View>
        )}

        {/* Product Information */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('productInfo')}
        >
          <Text style={styles.sectionTitle}>Material Composition</Text>
          <Icon
            name={expandedSections.productInfo ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        {expandedSections.productInfo && (
          <View style={styles.sectionContent}>
            {renderMetadataRow('Brand', productInfo.brand)}
            {renderMetadataRow('Model Number', productInfo.modelNumber)}
            {renderMetadataRow('Description', productInfo.productDescription)}
            {renderMetadataRow('Width', productInfo.physicalDimension?.width)}
            {renderMetadataRow('Height', productInfo.physicalDimension?.height)}
            {renderMetadataRow('Length', productInfo.physicalDimension?.length)}
            {renderMetadataRow(
              'Weight (g)',
              productInfo.physicalDimension?.weight,
            )}
            {renderMetadataRow(
              'Technical Specs',
              productInfo.technicalSpecifications,
            )}
            {renderMetadataRow(
              'Energy Efficiency',
              productInfo.energyEfficiencyClass,
            )}
            {renderMetadataRow('Intended Use', productInfo.intendedUse)}
          </View>
        )}

        {/* Sustainability Data */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('sustainability')}
        >
          <Text style={styles.sectionTitle}>Environmental Data</Text>
          <Icon
            name={
              expandedSections.sustainability ? 'chevron-up' : 'chevron-down'
            }
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        {expandedSections.sustainability && (
          <View style={styles.sectionContent}>
            {renderMetadataRow(
              'Material Composition',
              sustainability.materialComposition,
            )}
            {renderMetadataRow(
              'Recycled Content %',
              sustainability.recycledContentPercent,
            )}
            {renderMetadataRow(
              'Renewable Content %',
              sustainability.renewableContentPercent,
            )}
            {renderMetadataRow(
              'Substances of Concern',
              sustainability.substancesOfConcern,
            )}
            {renderMetadataRow(
              'Critical Raw Materials',
              sustainability.criticalRawMaterials,
            )}
            {renderMetadataRow(
              'Origin of Materials',
              sustainability.originOfMaterials,
            )}
            {renderMetadataRow(
              'Water Footprint',
              sustainability.waterFootprint,
            )}
            {renderMetadataRow(
              'Biodiversity Impact',
              sustainability.biodiversityImpact?.assessment,
            )}
          </View>
        )}

        {/* Additional Info Fields */}
        <View style={styles.additionalInfo}>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>DPP ID</Text>
            <Text style={styles.additionalInfoValue}>
              {productData.dppId ||
                dppId ||
                identification.uniqueProductIdentifier ||
                'N/A'}
            </Text>
          </View>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>Product ID</Text>
            <Text style={styles.additionalInfoValue}>
              {productData.gtin || gtin || masterData?.productId || 'N/A'}
            </Text>
          </View>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>Model Number</Text>
            <Text style={styles.additionalInfoValue}>
              {productInfo.modelNumber || productSummary?.modelNumber || 'N/A'}
            </Text>
          </View>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>Batch ID</Text>
            <Text style={styles.additionalInfoValue}>
              {identification.serialNumber || 'N/A'}
            </Text>
          </View>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>Manufacturer</Text>
            <Text style={styles.additionalInfoValue}>
              {productSummary?.manufacturer ||
                identification.manufacturerName ||
                'N/A'}
            </Text>
          </View>
          {identification.productionDate && (
            <View style={styles.additionalInfoItem}>
              <Text style={styles.additionalInfoLabel}>Production Date</Text>
              <Text style={styles.additionalInfoValue}>
                {identification.productionDate}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.downloadButton}>
            <Icon name="download" size={20} color="#fff" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share-variant" size={20} color={colors.primary} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray600,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    backgroundColor: colors.white,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 200,
    height: 200,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    backgroundColor: colors.gray100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dppIdContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dppIdLabel: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.text,
  },
  dppIdValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  productId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  infoCardsGrid: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  infoCardsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  infoCard: {
    backgroundColor: colors.white,
    flex: 1,
    borderRadius: 16,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 120,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  infoIcon: {
    width: 84,
    height: 84,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: colors.gray600,
    marginBottom: 6,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 2,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  metadataLabel: {
    fontSize: 13,
    color: colors.gray600,
    flex: 1,
  },
  metadataValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  additionalInfo: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  additionalInfoItem: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  additionalInfoLabel: {
    fontSize: 11,
    color: colors.gray600,
    marginBottom: 4,
    fontWeight: '500',
  },
  additionalInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 8,
  },
  shareButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default DigitalPassportScreen;
