import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { useStore } from '../store';

const RecentsScreen = ({ navigation }) => {
  const { validateUser, logout, currentUser } = useContext(AuthContext);
  const { state, fetchUserHistory, getProductDetails } = useStore();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  // Fetch history from API when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadHistory = async () => {
        // Prefer ID, but validate it first
        if (currentUser?.id) {
          const userId =
            typeof currentUser.id === 'string'
              ? parseInt(currentUser.id, 10)
              : currentUser.id;

          if (Number.isInteger(userId) && userId > 0) {
            await fetchUserHistory(userId);
            return;
          }
        }

        // Fallback to email
        if (currentUser?.email) {
          await fetchUserHistory(currentUser.email);
        }
      };

      loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.id, currentUser?.email]),
  );

  // Load product details for all history items
  useEffect(() => {
    const loadRecentProducts = async () => {
      const historyIds = state.scanHistory || [];
      if (historyIds.length === 0) {
        setRecentProducts([]);
        setLoadingProducts(false);
        return;
      }

      setLoadingProducts(true);

      try {
        // Load all products
        const productsData = await Promise.all(
          historyIds.map(async productId => {
            const productData = await getProductDetails(productId);
            if (productData) {
              return {
                productId,
                productData,
                details: formatProductDetails(productData),
              };
            }
            return null;
          }),
        );

        // Filter out null values
        setRecentProducts(productsData.filter(p => p !== null));
      } catch (error) {
        console.error('❌ Error loading recent products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadRecentProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.scanHistory]);

  // Pull to refresh handler
  const onRefresh = async () => {
    if (!currentUser?.id && !currentUser?.email) return;

    setRefreshing(true);
    try {
      // Force refresh from API - prefer ID over email, validate ID
      let identifier = currentUser.email;

      if (currentUser.id) {
        const userId =
          typeof currentUser.id === 'string'
            ? parseInt(currentUser.id, 10)
            : currentUser.id;

        if (Number.isInteger(userId) && userId > 0) {
          identifier = userId;
        }
      }

      await fetchUserHistory(identifier, true);
    } catch (error) {
      console.error('❌ Error refreshing history:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Helper function to format product details
  const formatProductDetails = productData => {
    const { productSummary, categories } = productData || {};

    return {
      image: productSummary?.image ? { uri: productSummary.image } : null,
      productName: productSummary?.productName || 'Unknown Product',
      approved: categories?.environmentalFootprint?.pefCompliant ? 85 : 75,
      renewability: categories?.sustainability?.recycledContentPercent || 70,
      ownership: 90,
      warrantyScore: 80,
    };
  };

  const renderProductCard = ({ item }) => {
    const { details, productData, productId } = item;

    return (
      <View style={styles.productCard}>
        <View style={styles.productImageContainer}>
          {details.image ? (
            <Image source={details.image} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="image-off" size={60} color="#ccc" />
            </View>
          )}
          <View style={styles.verifiedBadge}>
            <Image
              source={require('../../assets/Check.png')}
              style={styles.checkIcon}
            />
          </View>
        </View>

        <Text style={styles.productName} numberOfLines={1}>
          {details.productName}
        </Text>

        <View style={styles.badgesContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Image
                source={require('../../assets/Env.png')}
                style={styles.badgeIcon}
              />
              <View style={styles.badgeTextContainer}>
                <Text style={styles.badgeText}>Env Impact</Text>
                <Text style={styles.badgePercentage}>{details.approved}%</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Image
                source={require('../../assets/recycle.png')}
                style={styles.badgeIcon}
              />
              <View style={styles.badgeTextContainer}>
                <Text style={styles.badgeText}>Recyclability</Text>
                <Text style={styles.badgePercentage}>
                  {details.renewability}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Image
                source={require('../../assets/owner.png')}
                style={styles.badgeIcon}
              />
              <View style={styles.badgeTextContainer}>
                <Text style={styles.badgeText}>Ownership</Text>
                <Text style={styles.badgePercentage}>{details.ownership}%</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Image
                source={require('../../assets/warranty.png')}
                style={styles.badgeIcon}
              />
              <View style={styles.badgeTextContainer}>
                <Text style={styles.badgeText}>Warranty</Text>
                <Text style={styles.badgePercentage}>
                  {details.warrantyScore}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewPassportButton}
          onPress={() =>
            navigation.navigate('DigitalPassport', {
              productData: productData,
              barcode: productId,
            })
          }
        >
          <Text style={styles.viewPassportText}>View Passport</Text>
          <Icon name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Icon name="qrcode-scan" size={80} color={colors.gray300} />
      <Text style={styles.emptyStateTitle}>No recent scans yet</Text>
      <Text style={styles.emptyStateText}>
        Scan a product QR code to see it appear here.
      </Text>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Icon name="qrcode-scan" size={20} color="#fff" />
        <Text style={styles.scanButtonText}>Scan Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading your scans...</Text>
    </View>
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
        <Text style={styles.headerTitle}>Recent Scans</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Products List */}
      {state.isLoadingHistory && recentProducts.length === 0 ? (
        renderLoadingState()
      ) : recentProducts.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={recentProducts}
          renderItem={renderProductCard}
          keyExtractor={(item, index) => `${item.productId}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListFooterComponent={
            loadingProducts && recentProducts.length > 0 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  listContent: {
    padding: 16,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray600,
    marginTop: 12,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 20,
    padding: 4,
  },
  checkIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  badgesContainer: {
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  badgeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: colors.gray600,
  },
  badgePercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  viewPassportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  viewPassportText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default RecentsScreen;
