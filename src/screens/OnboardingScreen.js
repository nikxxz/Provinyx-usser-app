import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import ProvinyxLogo from '../../assets/ProvinyxLogo.svg';

const OnboardingScreen = ({ navigation }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login } = useContext(AuthContext);

  // Configure Google Sign-In
  useEffect(() => {
    const configureGoogleSignIn = async () => {
      try {
        GoogleSignin.configure({
          webClientId:
            '998554587608-d7733d2pisen380hup2hhbrt2ujgophv.apps.googleusercontent.com',
          offlineAccess: true,
          forceCodeForRefreshToken: true,
          scopes: ['profile', 'email'], // Add explicit scopes
        });
        console.log('✅ Google Sign-In configured successfully');
        console.log('📱 Package: com.unveilix');
        console.log(
          '🔑 SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25',
        );
      } catch (error) {
        console.error('❌ Google Sign-In configuration error:', error);
      }
    };
    configureGoogleSignIn();
  }, []);

  const handleLogin = () => {
    navigation.navigate('SignIn');
  };

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);

      // Check if device supports Google Play services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();

      console.log('✅ Google user info:', JSON.stringify(userInfo, null, 2));

      // Extract user data - check both old and new response structures
      const user = userInfo.data?.user || userInfo.user || userInfo;

      if (!user || !user.email) {
        throw new Error('Failed to get user email from Google Sign-In');
      }

      const googleUserData = {
        username: user.name || user.givenName || user.email.split('@')[0],
        email: user.email,
        phone: '', // Google doesn't always provide phone number
      };

      console.log('📤 Sending to API:', googleUserData);

      // Call your API to authenticate/create Google user
      const result = await authService.googleSignIn(googleUserData);

      console.log('Google Sign-In result:', result);

      if (result.success) {
        // Store user data in context
        await login(result.data);

        // Don't navigate manually - let NavigationContainer handle it
        // The navigation will automatically switch to authenticated stack

        // Show welcome message for new users
        if (result.isNewUser) {
          Alert.alert(
            'Welcome!',
            'Your account has been created successfully.',
          );
        }
        // Navigation will happen automatically via auth state change
      } else {
        // Show error message
        Alert.alert('Sign-In Failed', result.message);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
        console.log('User cancelled Google Sign-In');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation (e.g., sign in) is in progress already
        Alert.alert('Please wait', 'Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        Alert.alert(
          'Google Play Services Required',
          'Please install or update Google Play Services to use Google Sign-In',
        );
      } else {
        // Other errors
        Alert.alert(
          'Sign-In Error',
          error.message || 'An error occurred during Google Sign-In',
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
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
          <ProvinyxLogo width={200} height={200} />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>PROVINYX</Text>
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
          style={[
            styles.googleButton,
            isGoogleLoading && styles.googleButtonDisabled,
          ]}
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Image
                source={require('../../assets/google_logo.png')}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Login with Google</Text>
            </>
          )}
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
  googleButtonDisabled: {
    opacity: 0.6,
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
