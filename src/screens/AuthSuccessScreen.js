import React, { useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

const AuthSuccessScreen = ({ route, navigation }) => {
  const { authType, userData } = route.params; // 'Sign In' or 'Sign Up'
  const { register } = useContext(AuthContext);

  // Animation references
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // If this is sign up, register the user in auth context
    if (authType === 'Sign Up' && userData) {
      register(userData);
    }

    // Animate success icon
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

    // Navigate to home after 1 second
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim, authType, userData, register]);

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
          <Image
            source={require('../../assets/login_success.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.title}>{authType} Successful</Text>
        <Text style={styles.subtitle}>
          Please wait...{'\n'}You will be directed to the homepage soon
        </Text>

        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
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
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
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
});

export default AuthSuccessScreen;
