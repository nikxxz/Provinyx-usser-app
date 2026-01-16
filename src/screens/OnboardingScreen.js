import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';

const OnboardingScreen = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('SignIn');
  };

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      'Google Login',
      'Google login functionality will be implemented',
    );
  };

  return (
    <Animated.View
      style={[styles.container, { entering: FadeIn.duration(500) }]}
      as={SafeAreaView}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        translucent={false}
      />

      {/* Centered Content */}
      <View style={styles.contentWrapper}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/App_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>UNVEILIX</Text>
          <Text style={styles.subtitle}>ACESPIRE'S DIGITAL PASSPORT</Text>
        </View>
      </View>

      {/* Button Section - Fixed at Bottom */}
      <View style={styles.buttonSection}>
        {/* Login and Signup Buttons - Horizontal */}
        <View style={styles.horizontalButtonContainer}>
          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, styles.halfWidthButton]}
            onPress={handleLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.signupButton, styles.halfWidthButton]}
            onPress={handleSignup}
            activeOpacity={0.7}
          >
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../assets/google_logo.png')}
            style={styles.googleLogo}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 140,
    height: 140,
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
  buttonSection: {
    gap: 12,
    marginTop: 16,
    paddingBottom: 20,
  },
  horizontalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  halfWidthButton: {
    flex: 1,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  signupButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: colors.gray300,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
