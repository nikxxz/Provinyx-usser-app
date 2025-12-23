import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { useStore } from '../store';

const RecentsScreen = ({ navigation }) => {
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

  const renderProductCard = ({ item }) => {
    const { details } = item;

    return (
      <View style={styles.productCard}>
        <View style={styles.productImageContainer}>
          <Image source={details.image} style={styles.productImage} />
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
            navigation.navigate('DigitalPassport', { product: item })
          }
        >
          <Text style={styles.viewPassportText}>View Passport</Text>
          <Icon name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

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
      {recentScans.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No recent scans yet</Text>
          <Text style={styles.emptyStateText}>
            Scan a product QR code to see it appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={recentScans}
          renderItem={renderProductCard}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: '#000',
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
