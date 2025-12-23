import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../styles/colors';
import { authService } from '../services/authService';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [screen, setScreen] = useState<'options' | 'signin' | 'success'>(
    'options',
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Animation references
  const successScaleAnim = useRef(new Animated.Value(0)).current;
  const successOpacityAnim = useRef(new Animated.Value(0)).current;
  const backSwipeResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        screen === 'signin' &&
        gestureState.dx > 12 &&
        Math.abs(gestureState.dy) < 12,
      onPanResponderRelease: (_, gestureState) => {
        if (screen === 'signin' && gestureState.dx > 60) {
          handleBackPress();
        }
      },
    }),
  ).current;
  const gestureHandlers =
    screen === 'signin' ? backSwipeResponder.panHandlers : {};

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isLoggedIn()) {
      navigation.replace('Home');
    }
  }, [navigation]);

  const handleSignInPress = () => {
    setScreen('signin');
    setUsernameError('');
    setPasswordError('');
  };

  const handleBackPress = () => {
    setScreen('options');
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setUsernameError('');
    setPasswordError('');
  };

  const handleLogin = async () => {
    // Clear previous errors
    setUsernameError('');
    setPasswordError('');

    // Validate empty fields
    let hasError = false;
    if (!username.trim()) {
      setUsernameError('Please enter username');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('Please enter password');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    try {
      const success = await authService.login(username, password);

      if (success) {
        // Show success screen with animation
        setScreen('success');

        // Animate success icon
        Animated.parallel([
          Animated.spring(successScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(successOpacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Navigate to home after 2 seconds
        setTimeout(() => {
          // Clear form
          setUsername('');
          setPassword('');
          setUsernameError('');
          setPasswordError('');
          // Reset animations
          successScaleAnim.setValue(0);
          successOpacityAnim.setValue(0);
          // Navigate to home
          navigation.replace('Home');
        }, 2000);
      } else {
        const error = authService.getError();
        setPasswordError(
          error || 'Incorrect password. Please check your password.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    Alert.alert('Register', 'Register button pressed');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login button pressed');
  };

  if (screen === 'options') {
    return <LoginOptionsScreen onSignIn={handleSignInPress} />;
  }

  if (screen === 'success') {
    return (
      <SuccessScreen
        scaleAnim={successScaleAnim}
        opacityAnim={successOpacityAnim}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} {...gestureHandlers}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Section */}
          <Text style={styles.headerTitle}>Sign In Here</Text>
          <Text style={styles.subtitle}>Kindly login to scan</Text>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>User Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  usernameError && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your user name"
                  placeholderTextColor={colors.gray400}
                  value={username}
                  onChangeText={text => {
                    setUsername(text);
                    setUsernameError('');
                  }}
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
              {/* Error Message Below Username Field */}
              {usernameError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{usernameError}</Text>
                </View>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordError && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.gray400}
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={colors.gray400}
                  />
                </TouchableOpacity>
              </View>
              {/* Error Message Below Password Field */}
              {passwordError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{passwordError}</Text>
                </View>
              ) : null}
              {/* Forgot Password Link */}
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                loading && styles.signInButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={handleRegisterPress}
                disabled={loading}
              >
                <Text style={styles.signupLink}>Sign Up Now</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <Image
                source={require('../assets/google_logo.png')}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Login with Google</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Success Screen Component
const SuccessScreen = ({
  scaleAnim,
  opacityAnim,
}: {
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
}) => {
  return (
    <SafeAreaView style={styles.successContainer}>
      <View style={styles.successContent}>
        <Animated.View
          style={[
            styles.successIconWrapper,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Image
            source={require('../assets/login_success.png')}
            style={styles.successIcon}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.successTitle}>Sign In Successful</Text>
        <Text style={styles.successSubtitle}>
          Please wait...{'\n'}You will be directed to the homepage soon
        </Text>

        <View style={styles.loadingIndicatorWrapper}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Login Options Screen Component
const LoginOptionsScreen = ({ onSignIn }: { onSignIn: () => void }) => {
  const handleRegister = () => {
    Alert.alert('Register', 'Register button pressed');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login button pressed');
  };

  return (
    <View style={styles.optionsContainer}>
      {/* Centered Content */}
      <View style={styles.optionsContentWrapper}>
        {/* Logo Section */}
        <View style={styles.optionsLogoSection}>
          <Image
            source={require('../assets/App_logo.png')}
            style={styles.optionsLogo}
            resizeMode="contain"
          />
        </View>

        {/* Title Section */}
        <View style={styles.optionsTitleSection}>
          <Text style={styles.optionsTitle}>UNVEILIX</Text>
          <Text style={styles.optionsSubtitle}>
            ACESPIRE'S DIGITAL PASSPORT
          </Text>
        </View>
      </View>

      {/* Button Section - Fixed at Bottom */}
      <View style={styles.optionsButtonSection}>
        {/* Login and Signup Buttons - Horizontal */}
        <View style={styles.horizontalButtonContainer}>
          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginOptionButton, styles.halfWidthButton]}
            onPress={onSignIn}
            activeOpacity={0.7}
          >
            <Text style={styles.loginOptionButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.signupOptionButton, styles.halfWidthButton]}
            onPress={handleRegister}
            activeOpacity={0.7}
          >
            <Text style={styles.signupOptionButtonText}>Signup</Text>
          </TouchableOpacity>
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          style={styles.googleOptionButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/google_logo.png')}
            style={styles.googleLogo}
            resizeMode="contain"
          />
          <Text style={styles.googleOptionButtonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Options Screen Styles
  optionsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  optionsContentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsLogoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  optionsLogo: {
    width: 140,
    height: 140,
  },
  optionsTitleSection: {
    alignItems: 'center',
  },
  optionsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
    letterSpacing: 3,
  },
  optionsSubtitle: {
    fontSize: 11,
    color: colors.gray600,
    letterSpacing: 1.2,
    fontWeight: '500',
  },
  optionsContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  optionsDivider: {
    height: 1,
    backgroundColor: colors.gray300,
    width: '100%',
    marginVertical: 12,
  },
  optionsFooterText: {
    fontSize: 12,
    color: colors.gray500,
    marginVertical: 8,
  },
  optionsAcespireLogo: {
    width: 100,
    height: 40,
    marginVertical: 8,
  },
  optionsButtonSection: {
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
  loginOptionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginOptionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  signupOptionButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupOptionButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  googleOptionButton: {
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
  googleOptionButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  // Sign In Screen Styles
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
    marginBottom: 40,
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  forgotPassword: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
  },
  inputWrapperError: {
    borderColor: '#dc2626',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginLeft: 6,
    flex: 1,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: colors.gray600,
  },
  signupLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.gray500,
    fontSize: 12,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Success Screen Styles
  successContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIconWrapper: {
    marginBottom: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  loadingIndicatorWrapper: {
    marginTop: 16,
  },
});

export default LoginScreen;
