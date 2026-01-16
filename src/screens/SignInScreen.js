import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import CustomTextInput from '../components/CustomTextInput';

const { width, height } = Dimensions.get('window');

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
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

    // Immediately navigate to AuthSuccessScreen with credentials
    // API call will happen in the background there
    setUsername('');
    setPassword('');
    setUsernameError('');
    setPasswordError('');

    navigation.replace('AuthSuccess', {
      authType: 'Sign In',
      credentials: { username, password },
    });
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be implemented',
    );
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const closeErrorModal = () => {
    setErrorModal({ visible: false, message: '' });
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
          {/* Back Button 
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity> */}

          {/* Title Section */}
          <Text style={styles.headerTitle}>Sign In Here</Text>
          <Text style={styles.subtitle}>Kindly Sign in to scan</Text>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>User Name</Text>
              <CustomTextInput
                placeholder="Enter your user name"
                value={username}
                onChangeText={text => {
                  setUsername(text);
                  setUsernameError('');
                }}
                autoCapitalize="none"
                error={!!usernameError}
              />
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
              <CustomTextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setPasswordError('');
                }}
                secureTextEntry={!showPassword}
                error={!!passwordError}
                icon={
                  <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={colors.gray400}
                  />
                }
                onIconPress={() => setShowPassword(!showPassword)}
              />
              {passwordError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#dc2626" />
                  <Text style={styles.errorText}>{passwordError}</Text>
                </View>
              ) : null}
              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                (!username.trim() || !password.trim()) &&
                  styles.signInButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!username.trim() || !password.trim()}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signupLink}>Sign Up Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Error Modal */}
      <Modal
        transparent={true}
        visible={errorModal.visible}
        animationType="fade"
        onRequestClose={closeErrorModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name="alert-circle"
              size={48}
              color={colors.danger || '#FF3B30'}
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Login Failed</Text>
            <Text style={styles.modalMessage}>{errorModal.message}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeErrorModal}
            >
              <Text style={styles.modalButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 32,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: height * 0.1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
    marginBottom: 48,
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 28,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  forgotPassword: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.3,
    marginBottom: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: '80%',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SignInScreen;
