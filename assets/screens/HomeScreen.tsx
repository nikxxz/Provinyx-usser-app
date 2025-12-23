import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, spacing } from '../styles/colors';
import AppHeader from '../components/AppHeader';
import StatCard from '../components/StatCard';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const handleScanPress = () => {
    navigation.navigate('Scanner');
  };

  const handleHistoryPress = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <AppHeader title="CHAINSHIELD" rightIconName="account" />
      <ScrollView style={styles.scrollContainer}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtitle}>
            Scan products to verify authenticity and view detailed information
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleScanPress}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconContainer, styles.actionIconBgScan]}>
              <Icon name="qrcode-scan" size={32} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Scan Product</Text>
              <Text style={styles.actionDescription}>
                Scan QR codes to verify products
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleHistoryPress}
            activeOpacity={0.85}
          >
            <View
              style={[styles.actionIconContainer, styles.actionIconBgHistory]}
            >
              <Icon name="history" size={32} color={colors.secondary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Scan History</Text>
              <Text style={styles.actionDescription}>
                View your verification trail
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>

          <View style={styles.statsRow}>
            <StatCard
              icon="check-circle"
              iconColor={colors.success}
              value={0}
              label="Total Scans"
            />
            <StatCard
              icon="clock-outline"
              iconColor={colors.warning}
              value={0}
              label="This Week"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              icon="shield-check"
              iconColor={colors.primary}
              value={0}
              label="Verified"
            />
            <StatCard
              icon="star"
              iconColor={colors.warning}
              value={0}
              label="Favorites"
            />
          </View>
        </View>

        {/* Primary CTA Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleScanPress}
          activeOpacity={0.85}
        >
          <Icon name="camera" size={20} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Start Scanning Now</Text>
        </TouchableOpacity>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Icon name="information" size={20} color={colors.primary} />
          <Text style={styles.infoBannerText}>
            Scan products to unlock detailed authenticity information, supply
            chain data, and environmental impact metrics
          </Text>
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
  welcomeSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.gray500,
    lineHeight: 20,
  },
  quickActionsSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    elevation: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconBgScan: {
    backgroundColor: colors.blue50,
  },
  actionIconBgHistory: {
    backgroundColor: colors.purple50,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.gray500,
  },
  statsSection: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    elevation: 2,
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  infoBanner: {
    backgroundColor: colors.blue50,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
});

export default HomeScreen;
