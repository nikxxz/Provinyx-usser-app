import React, { useState } from 'react';
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
import { addUser, findUserByUsername } from '../constants/users';
import CustomTextInput from '../components/CustomTextInput';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    // Clear previous errors
    setErrors({
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });

    // Validate fields
    let hasError = false;
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Please enter a username';
      hasError = true;
    } else if (findUserByUsername(username)) {
      newErrors.username = 'Username already exists';
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter a password';
      hasError = true;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Add user to users array in constants
      const newUser = {
        username,
        email,
        phone,
        password,
      };
      addUser(newUser);

      // Clear form
      setUsername('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');

      // Navigate to verification screen with username and email
      navigation.replace('Verification', { email, username });
    } catch (error) {
      setErrors({
        ...errors,
        username: 'An error occurred during registration. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
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
          <Text style={styles.headerTitle}>Sign Up</Text>

          {/* Subtitle */}
          <Text style={styles.sectionSubtitle}>Create User Name</Text>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputGroup}>
              <CustomTextInput
                placeholder="Enter username"
                value={username}
                onChangeText={text => {
                  setUsername(text);
                  setErrors({ ...errors, username: '' });
                }}
                editable={!loading}
                error={!!errors.username}
              />
              {errors.username ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{errors.username}</Text>
                </View>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <CustomTextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setErrors({ ...errors, email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                error={!!errors.email}
              />
              {errors.email ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              ) : null}
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <CustomTextInput
                placeholder="+91"
                value={phone}
                onChangeText={text => {
                  setPhone(text);
                  setErrors({ ...errors, phone: '' });
                }}
                keyboardType="phone-pad"
                editable={!loading}
                error={!!errors.phone}
              />
              {errors.phone ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{errors.phone}</Text>
                </View>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <CustomTextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                secureTextEntry={!showPassword}
                editable={!loading}
                error={!!errors.password}
                icon={
                  <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={colors.gray400}
                  />
                }
                onIconPress={() => setShowPassword(!showPassword)}
              />
              <Text style={styles.helperText}>must contain 8 char.</Text>
              {errors.password ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{errors.password}</Text>
                </View>
              ) : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <CustomTextInput
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  setErrors({ ...errors, confirmPassword: '' });
                }}
                secureTextEntry={!showConfirmPassword}
                editable={!loading}
                error={!!errors.confirmPassword}
                icon={
                  <Icon
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={colors.gray400}
                  />
                }
                onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {errors.confirmPassword ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                </View>
              ) : null}
            </View>

            {/* Send Code Button */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                loading && styles.signUpButtonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Send Code</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an Account? </Text>
              <TouchableOpacity onPress={handleSignIn} disabled={loading}>
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
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 18,
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
  helperText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 8,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
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

export default SignUpScreen;
