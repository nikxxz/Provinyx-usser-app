import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { useStore } from '../store';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const HomeScreen = ({ navigation }) => {
  const { validateUser, logout } = useContext(AuthContext);
  const { state } = useStore();
  const recentScans = state.scanHistory || [];

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

  const renderRecentScanCard = (product, index) => {
    const { details } = product;

    return (
      <View key={index} style={styles.recentCard}>
        <View style={styles.cardImageContainer}>
          <Image source={details.image} style={styles.cardImage} />
          <View style={styles.verifiedBadge}>
            <Image
              source={require('../../assets/Check.png')}
              style={styles.checkIcon}
            />
          </View>
        </View>

        <Text style={styles.cardProductName} numberOfLines={1}>
          {details.productName}
        </Text>

        <View style={styles.cardBadgesRow}>
          <View style={styles.smallBadge}>
            <Image
              source={require('../../assets/Env.png')}
              style={styles.badgeIcon}
            />
            <View style={styles.badgeTextContainer}>
              <Text style={styles.smallBadgeText}>Env Impact</Text>
              <Text style={styles.smallBadgePercentage}>
                {details.approved}%
              </Text>
            </View>
          </View>
          <View style={styles.smallBadge}>
            <Image
              source={require('../../assets/recycle.png')}
              style={styles.badgeIcon}
            />
            <View style={styles.badgeTextContainer}>
              <Text style={styles.smallBadgeText}>Recyclability</Text>
              <Text style={styles.smallBadgePercentage}>
                {details.renewability}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardBadgesRow}>
          <View style={styles.smallBadge}>
            <Image
              source={require('../../assets/owner.png')}
              style={styles.badgeIcon}
            />
            <View style={styles.badgeTextContainer}>
              <Text style={styles.smallBadgeText}>Ownership</Text>
              <Text style={styles.smallBadgePercentage}>
                {details.ownership}%
              </Text>
            </View>
          </View>
          <View style={styles.smallBadge}>
            <Image
              source={require('../../assets/warranty.png')}
              style={styles.badgeIcon}
            />
            <View style={styles.badgeTextContainer}>
              <Text style={styles.smallBadgeText}>Warranty</Text>
              <Text style={styles.smallBadgePercentage}>
                {details.warrantyScore}%
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewPassportBtn}
          onPress={() => navigation.navigate('DigitalPassport', { product })}
        >
          <Text style={styles.viewPassportBtnText}>View Passport</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="bell-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon
                name="account-circle-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>"One Scan. Zero Secrets."</Text>
          <Text style={styles.heroSubtitle}>
            Scan now to Reveal complete product details
          </Text>

          {/* QR Code Icon */}
          <View style={styles.qrContainer}>
            <Image
              source={require('../../assets/QR.png')}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.instructionText}>
            Align your camera with the QR code to{'\n'}scan and verify your
            product
          </Text>

          {/* Scan Now Button */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Text style={styles.scanButtonText}>Scan Now</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Scans Section */}
        <View style={styles.recentsSection}>
          <View style={styles.recentsSectionHeader}>
            <Text style={styles.recentsSectionTitle}>Recent Scans</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Recents')}>
              <Text style={styles.viewAllText}>
                View all{' '}
                <Icon name="chevron-right" size={16} color={colors.primary} />
              </Text>
            </TouchableOpacity>
          </View>

          {recentScans.length === 0 ? (
            <View style={styles.recentsEmptyContainer}>
              <Text style={styles.recentsEmptyTitle}>No scans yet</Text>
              <Text style={styles.recentsEmptyText}>
                Your last scanned products will appear here.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentsScrollContent}
            >
              {recentScans
                .slice(0, 5)
                .map((product, index) => renderRecentScanCard(product, index))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Floating Scan Button */}
      <TouchableOpacity
        style={styles.floatingScanButton}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Icon name="qrcode-scan" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 32,
  },
  qrContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  instructionText: {
    fontSize: 13,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentsSection: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  recentsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recentsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  recentsScrollContent: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 12,
  },
  recentsEmptyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentsEmptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  recentsEmptyText: {
    fontSize: 13,
    color: colors.gray600,
  },
  recentCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: colors.gray100,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 16,
    padding: 3,
  },
  checkIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  cardProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  cardBadgesRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 6,
  },
  smallBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  badgeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  smallBadgeText: {
    fontSize: 11,
    color: colors.gray600,
  },
  smallBadgePercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  viewPassportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
    marginTop: 6,
  },
  viewPassportBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  floatingScanButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomeScreen;
