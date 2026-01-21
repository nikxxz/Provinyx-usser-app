import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile, changePassword } from '../services/userService';

const ProfileScreen = ({ navigation }) => {
  const { currentUser, logout, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile fields
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const updates = {
        username: username.trim(),
        phone: phone.trim(),
      };

      const response = await updateUserProfile(currentUser.email, updates);

      if (response.success) {
        // Update local user data
        const updatedUser = {
          ...currentUser,
          ...updates,
        };
        await login(updatedUser);

        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(
        currentUser.email,
        oldPassword,
        newPassword,
      );

      if (response.success) {
        Alert.alert('Success', 'Password changed successfully');
        setIsChangingPassword(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', response.message || 'Failed to change password');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        },
      },
    ]);
  };

  const cancelEdit = () => {
    setUsername(currentUser.username || '');
    setPhone(currentUser.phone || '');
    setIsEditing(false);
  };

  const cancelPasswordChange = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPassword(false);
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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerButton} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Icon name="account-circle" size={100} color={colors.primary} />
            </View>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* Profile Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Profile Information</Text>
              {!isEditing && !isChangingPassword && (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Icon name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="account" size={20} color={colors.gray600} />
                <Text style={styles.infoLabel}>Username</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  editable={!loading}
                />
              ) : (
                <Text style={styles.infoValue}>{username || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color={colors.gray600} />
                <Text style={styles.infoLabel}>Phone</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              ) : (
                <Text style={styles.infoValue}>{phone || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="email" size={20} color={colors.gray600} />
                <Text style={styles.infoLabel}>Email</Text>
              </View>
              <Text style={styles.infoValue}>{email}</Text>
              <Text style={styles.infoHint}>Email cannot be changed</Text>
            </View>

            {isEditing && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={cancelEdit}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Password Section */}
          {!isEditing && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Security</Text>
                {!isChangingPassword && (
                  <TouchableOpacity onPress={() => setIsChangingPassword(true)}>
                    <Icon name="lock-reset" size={20} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              {isChangingPassword ? (
                <>
                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Icon name="lock" size={20} color={colors.gray600} />
                      <Text style={styles.infoLabel}>Current Password</Text>
                    </View>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder="Enter current password"
                        secureTextEntry={!showOldPassword}
                        editable={!loading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowOldPassword(!showOldPassword)}
                      >
                        <Icon
                          name={showOldPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color={colors.gray600}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Icon name="lock-plus" size={20} color={colors.gray600} />
                      <Text style={styles.infoLabel}>New Password</Text>
                    </View>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        secureTextEntry={!showNewPassword}
                        editable={!loading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Icon
                          name={showNewPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color={colors.gray600}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Icon
                        name="lock-check"
                        size={20}
                        color={colors.gray600}
                      />
                      <Text style={styles.infoLabel}>Confirm Password</Text>
                    </View>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm new password"
                        secureTextEntry={!showConfirmPassword}
                        editable={!loading}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Icon
                          name={showConfirmPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color={colors.gray600}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={cancelPasswordChange}
                      disabled={loading}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.saveButton]}
                      onPress={handleChangePassword}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.saveButtonText}>
                          Change Password
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Icon name="lock" size={20} color={colors.gray600} />
                    <Text style={styles.infoLabel}>Password</Text>
                  </View>
                  <Text style={styles.infoValue}>••••••••</Text>
                  <Text style={styles.infoHint}>
                    Tap the lock icon to change password
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Logout Section */}
          {!isEditing && !isChangingPassword && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Icon name="logout" size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomColor: '#f0f0f0',
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
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  emailText: {
    fontSize: 16,
    color: colors.gray600,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray600,
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    marginTop: 4,
  },
  infoHint: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 8,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray700,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProfileScreen;
