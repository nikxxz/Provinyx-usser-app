import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  useEffect(() => {
    // Simulate splash screen delay (2 seconds)
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#f0f4f8"
        translucent={false}
      />
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('../assets/App_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Footer with Acespire Logo */}
      <View style={styles.footer}>
        <View style={styles.poweredByContainer}>
          <View style={styles.divider} />
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/Acespire_logo.png')}
              style={styles.acespireLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.divider} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  poweredByContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 120,
    height: 50,
  },
});

export default SplashScreen;
