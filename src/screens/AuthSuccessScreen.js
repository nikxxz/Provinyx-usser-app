import React, { useEffect, useRef, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const AuthSuccessScreen = ({ route, navigation }) => {
  const { authType, userData, credentials } = route.params;
  const { register, login, isAuthenticated } = useContext(AuthContext);

  // State management
  const [apiState, setApiState] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Animation references
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('🚀 AuthSuccessScreen mounted');
    console.log('🚀 authType:', authType);
    console.log('🚀 userData:', userData);
    console.log('🚀 credentials:', credentials);

    // Animate icon immediately
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Handle different auth types
    if (authType === 'Sign Up' && credentials) {
      console.log('📝 Handling Sign Up with API');
      // For sign up, make API call and then auto-login
      handleSignUp();
    } else if (authType === 'Sign Up' && userData) {
      console.log('📝 Handling Sign Up with existing userData (legacy)');
      // Legacy path - if userData is already provided
      register(userData);
      setApiState('success');
      setMessage('Account created successfully!');

      setTimeout(() => {
        navigation.replace('Home');
      }, 2000);
    } else if (authType === 'Sign In' && credentials) {
      console.log('🔐 Handling Sign In');
      // For sign in, make API call in background
      handleLogin();
    } else {
      console.log('❓ Unknown auth type or missing data');
      console.log('❓ authType:', authType);
      console.log('❓ credentials:', credentials);
      console.log('❓ userData:', userData);
    }
  }, [scaleAnim, opacityAnim, authType, userData, credentials]);

  const handleSignUp = async () => {
    try {
      console.log('🔄 Starting registration with credentials:', credentials);

      if (
        !credentials ||
        !credentials.username ||
        !credentials.email ||
        !credentials.phone ||
        !credentials.password
      ) {
        throw new Error('Missing registration credentials');
      }

      const result = await authService.register(credentials);

      console.log('✅ Registration result received:', result);

      if (result.success) {
        console.log('✅ Registration successful, logging in user');
        // Store user data and show success
        await login(result.data);
        setApiState('success');
        setMessage(result.message || 'Account created successfully!');

        // Navigate to home after showing success
        setTimeout(() => {
          console.log('✅ Navigating to Home');
          navigation.replace('Home');
        }, 2000);
      } else {
        console.log('❌ Registration failed:', result.message);
        // Show error state
        setApiState('error');
        setErrorMessage(
          result.message || 'Registration failed. Please try again.',
        );

        // Navigate back to sign up after 3 seconds
        setTimeout(() => {
          console.log('❌ Navigating back to SignUp');
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignUp' }],
          });
        }, 3000);
      }
    } catch (error) {
      console.error('💥 Registration error caught:', error);
      setApiState('error');
      setErrorMessage('An unexpected error occurred. Please try again.');

      // Navigate back to sign up after 3 seconds
      setTimeout(() => {
        console.log('💥 Navigating back to SignUp after error');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignUp' }],
        });
      }, 3000);
    }
  };
  const handleLogin = async () => {
    try {
      console.log('🔄 Starting login with credentials:', credentials);
      console.log('🔄 Username:', credentials?.username);
      console.log('🔄 Password length:', credentials?.password?.length);

      if (!credentials || !credentials.username || !credentials.password) {
        throw new Error('Missing credentials');
      }

      const result = await authService.loginWithUsername(
        credentials.username,
        credentials.password,
      );

      console.log('✅ Login result received:', result);

      if (result.success) {
        console.log('✅ Login successful, updating state');
        // Store user data and show success
        await login(result.data);
        setApiState('success');
        setMessage(result.message || 'Login successful!');

        // Navigate to home after showing success
        setTimeout(() => {
          console.log('✅ Navigating to Home');
          navigation.replace('Home');
        }, 2000);
      } else {
        console.log('❌ Login failed:', result.message);
        // Show error state
        setApiState('error');
        setErrorMessage(result.message || 'Login failed. Please try again.');

        // Navigate back to login after 3 seconds
        setTimeout(() => {
          console.log('❌ Navigating back to SignIn');
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        }, 3000);
      }
    } catch (error) {
      console.error('💥 Login error caught:', error);
      setApiState('error');
      setErrorMessage('An unexpected error occurred. Please try again.');

      // Navigate back to login after 3 seconds
      setTimeout(() => {
        console.log('💥 Navigating back to SignIn after error');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }, 3000);
    }
  };

  const handleRetryLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  const renderIcon = () => {
    if (apiState === 'loading') {
      return <ActivityIndicator size={60} color={colors.primary} />;
    } else if (apiState === 'success') {
      return (
        <Icon
          name="check-circle"
          size={80}
          color={colors.success || '#34C759'}
        />
      );
    } else {
      return (
        <Icon
          name="close-circle"
          size={80}
          color={colors.danger || '#FF3B30'}
        />
      );
    }
  };

  const getTitle = () => {
    if (apiState === 'loading') {
      if (authType === 'Sign In') {
        return 'Signing In...';
      } else if (authType === 'Sign Up') {
        return 'Creating Account...';
      } else {
        return 'Processing...';
      }
    } else if (apiState === 'success') {
      return `${authType} Successful`;
    } else {
      return `${authType} Failed`;
    }
  };

  const getSubtitle = () => {
    if (apiState === 'loading') {
      return 'Please wait while we process your request...';
    } else if (apiState === 'success') {
      return message || 'You will be redirected to the homepage soon';
    } else {
      return errorMessage || 'Something went wrong. Please try again.';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {renderIcon()}
        </Animated.View>

        <Text
          style={[
            styles.title,
            apiState === 'success'
              ? styles.successTitle
              : apiState === 'error'
              ? styles.errorTitle
              : styles.loadingTitle,
          ]}
        >
          {getTitle()}
        </Text>

        <Text style={styles.subtitle}>{getSubtitle()}</Text>

        {apiState === 'loading' ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : apiState === 'error' ? (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetryLogin}
          >
            <Text style={styles.retryButtonText}>Back to Login</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconWrapper: {
    marginBottom: 32,
  },
  icon: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  successTitle: {
    color: colors.success || '#34C759',
  },
  errorTitle: {
    color: colors.danger || '#FF3B30',
  },
  loadingTitle: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  loaderWrapper: {
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: colors.danger || '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AuthSuccessScreen;
