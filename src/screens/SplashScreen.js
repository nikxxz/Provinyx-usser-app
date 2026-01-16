import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { colors } from '../constants/colors';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <Animated.View
      style={[styles.container, { exiting: FadeOut.duration(500) }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('../../assets/App_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleSection}>
          <Text style={styles.title}>UNVEILIX</Text>
          <Text style={styles.subtitle}>ACESPIRE'S DIGITAL PASSPORT</Text>
        </View>
      </View>

      {/* Footer with Acespire Logo */}
      <View style={styles.footer}>
        <View style={styles.poweredByContainer}>
          <Text style={styles.poweredByText}>Powered By</Text>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Acespire_logo.png')}
              style={styles.acespireLogo}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 200,
    height: 200,
  },
  titleSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 11,
    color: colors.gray600,
    letterSpacing: 1.2,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  poweredByContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredByText: {
    fontSize: 14,
    color: colors.gray400,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    width: '100%',
    marginVertical: 12,
  },
  acespireLogo: {
    width: 200,
    height: 120,
  },
});

export default SplashScreen;
