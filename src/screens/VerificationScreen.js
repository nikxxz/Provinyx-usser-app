import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { findUserByUsername } from '../constants/users';
import CustomTextInput from '../components/CustomTextInput';

const { width, height } = Dimensions.get('window');

const VERIFICATION_CODE = '1234';
const RESEND_TIMER = 60;

const VerificationScreen = ({ route, navigation }) => {
  const { email, username } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return RESEND_TIMER;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleVerify = () => {
    setError('');

    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (code.length !== 4) {
      setError('Code must be 4 digits');
      return;
    }

    if (code !== VERIFICATION_CODE) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    setLoading(true);

    // Simulate verification delay and get user data
    setTimeout(() => {
      setLoading(false);
      setCode('');

      // Get the user data from users array
      const userData = findUserByUsername(username);

      navigation.replace('AuthSuccess', {
        authType: 'Sign Up',
        userData: userData,
      });
    }, 500);
  };

  const handleResendCode = () => {
    if (isResendDisabled) {
      return;
    }

    // Reset timer
    setTimer(RESEND_TIMER);
    setIsResendDisabled(true);
    setCode('');
    setError('');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Title Section */}
          <Text style={styles.headerTitle}>Verify Account</Text>

          {/* Description */}
          <Text style={styles.description}>
            Code has been sent to {email}.{'\n'}Enter the code to verify your
            account.
          </Text>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Code Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter Code</Text>
              <CustomTextInput
                placeholder="4 Digit Code"
                value={code}
                onChangeText={text => {
                  if (text.length <= 4 && /^\d*$/.test(text)) {
                    setCode(text);
                    setError('');
                  }
                }}
                keyboardType="numeric"
                maxLength={4}
                editable={!loading}
                error={!!error}
              />
              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </View>

            {/* Resend Code Section */}
            <View style={styles.resendSection}>
              <Text style={styles.resendLabel}>Didn't Receive Code?</Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResendDisabled}
              >
                <Text
                  style={[
                    styles.resendLink,
                    isResendDisabled && styles.resendLinkDisabled,
                  ]}
                >
                  Resend Code
                </Text>
              </TouchableOpacity>
              {isResendDisabled && (
                <Text style={styles.timerText}>
                  Resend code in {formatTime(timer)}
                </Text>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.verifyButton,
                loading && styles.verifyButtonDisabled,
              ]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify Account</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an Account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                disabled={loading}
              >
                <Text style={styles.signinLink}>Sign in here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    letterSpacing: 1,
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
  resendSection: {
    marginBottom: 32,
    paddingVertical: 16,
    marginTop: height * 0.1,
  },
  resendLabel: {
    fontSize: 13,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  resendLinkDisabled: {
    color: colors.gray400,
  },
  timerText: {
    fontSize: 12,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: 8,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    marginTop: height * 0.3,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signinText: {
    fontSize: 14,
    color: colors.gray600,
  },
  signinLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default VerificationScreen;
