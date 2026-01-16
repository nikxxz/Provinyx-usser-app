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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

const DigitalPassportScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { details } = product;
  const { validateUser, logout } = useContext(AuthContext);

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
    metadata: false,
    composition: false,
    environmental: false,
  });

  // Animation values
  const imageScale = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const card1Slide = useRef(new Animated.Value(50)).current;
  const card2Slide = useRef(new Animated.Value(50)).current;
  const card3Slide = useRef(new Animated.Value(50)).current;
  const card4Slide = useRef(new Animated.Value(50)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSection = section => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const renderMetadataRow = (label, value) => (
    <View key={label} style={styles.metadataRow}>
      <Text style={styles.metadataLabel}>{label}</Text>
      <Text style={styles.metadataValue}>{value}</Text>
    </View>
  );

  const renderInfoCard = (
    icon,
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
      <View style={[styles.infoIconContainer, { backgroundColor: bgColor }]}>
        <Icon name={icon} size={20} color="#fff" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {value}
        </Text>
        <View style={styles.trendContainer}>
          <Icon
            name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
            size={12}
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
      </View>
    </Animated.View>
  );

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
          <Image source={details.image} style={styles.productImage} />
        </Animated.View>

        {/* Product ID */}
        <Text style={styles.productId}>ID : {product.barcode}</Text>

        {/* Info Cards Grid */}
        <View style={styles.infoCardsGrid}>
          <View style={styles.infoCardsRow}>
            {renderInfoCard(
              'package-variant',
              'Product Name',
              details.productName,
              details.trends.productName.direction,
              details.trends.productName.text,
              colors.success,
              card1Slide,
            )}
            {renderInfoCard(
              'factory',
              'Manufacturer',
              details.manufacturer,
              details.trends.manufacturer.direction,
              details.trends.manufacturer.text,
              colors.warning,
              card2Slide,
            )}
          </View>
          <View style={styles.infoCardsRow}>
            {renderInfoCard(
              'identifier',
              'Product ID',
              details.productId,
              details.trends.productId.direction,
              details.trends.productId.text,
              colors.error,
              card3Slide,
            )}
            {renderInfoCard(
              'chart-line',
              'Warranty',
              details.warranty,
              details.trends.warranty.direction,
              details.trends.warranty.text,
              '#f97316',
              card4Slide,
            )}
          </View>
        </View>

        {/* Expandable Sections */}

        {/* Identification & Metadata */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('metadata')}
        >
          <Text style={styles.sectionTitle}>Identification & Metadata</Text>
          <Icon
            name={expandedSections.metadata ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        {expandedSections.metadata && (
          <View style={styles.sectionContent}>
            {Object.entries(details.metadata).map(([key, value]) =>
              renderMetadataRow(key, value),
            )}
          </View>
        )}

        {/* Material Composition */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('composition')}
        >
          <Text style={styles.sectionTitle}>Material Composition</Text>
          <Icon
            name={expandedSections.composition ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        {expandedSections.composition && (
          <View style={styles.sectionContent}>
            {Object.entries(details.composition).map(([key, value]) =>
              renderMetadataRow(key, value),
            )}
          </View>
        )}

        {/* Environmental Data */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('environmental')}
        >
          <Text style={styles.sectionTitle}>Environmental Data</Text>
          <Icon
            name={
              expandedSections.environmental ? 'chevron-up' : 'chevron-down'
            }
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        {expandedSections.environmental && (
          <View style={styles.sectionContent}>
            {Object.entries(details.environmental).map(([key, value]) =>
              renderMetadataRow(key, value),
            )}
          </View>
        )}

        {/* Additional Info Fields */}
        <View style={styles.additionalInfo}>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>DPP ID</Text>
            <Text style={styles.additionalInfoValue}>{details.gtin}</Text>
          </View>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>Product ID</Text>
            <Text style={styles.additionalInfoValue}>{details.lotNumber}</Text>
          </View>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>Batch ID</Text>
            <Text style={styles.additionalInfoValue}>
              {details.serialDisplay}
            </Text>
          </View>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>Manufacturer</Text>
            <Text style={styles.additionalInfoValue}>
              {details.productNameDisplay}
            </Text>
          </View>
          <View style={styles.additionalInfoItem}>
            <Text style={styles.additionalInfoLabel}>Expiry Date</Text>
            <Text style={styles.additionalInfoValue}>{details.expiryDate}</Text>
          </View>
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
    backgroundColor: '#fff',
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
  imageContainer: {
    backgroundColor: colors.white,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
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
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  infoCardsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: '#000',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.gray600,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 10,
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
