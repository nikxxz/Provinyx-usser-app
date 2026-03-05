import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import ProvinyxSplashLogo from '../assets/Provinyx_Splash.svg';
import { useTheme } from '../context/ThemeContext';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

function SplashScreen({ onFinish, duration = 2000 }) {
  const { theme, colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeInDuration = 450;
    const fadeOutDuration = 450;
    const holdDuration = Math.max(
      duration - fadeInDuration - fadeOutDuration,
      0,
    );

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }),
      Animated.delay(holdDuration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: fadeOutDuration,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && typeof onFinish === 'function') {
        onFinish();
      }
    });
  }, [fadeAnim, onFinish, duration]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.center}>
          <ProvinyxSplashLogo width={WIDTH * 0.8} height={84} />
          <Text
            style={[
              styles.tagline,
              {
                color: colors.textSecondary,
                fontFamily: theme.fontFamily.medium,
              },
            ]}
          >
            ACESPIRE'S DIGITAL PASSPORT
          </Text>
        </View>

        <View style={styles.bottom}>
          <Text
            style={[
              styles.poweredBy,
              { color: colors.textMuted, fontFamily: theme.fontFamily.regular },
            ]}
          >
            Powered By
          </Text>
          <Image
            source={require('../assets/Acespire_logo.png')}
            style={styles.acespireLogo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
  },
  tagline: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.2,
  },
  bottom: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  poweredBy: {
    fontSize: 12,
  },
  acespireLogo: {
    width: WIDTH * 0.3,
    height: HEIGHT * 0.15,
  },
});

export default SplashScreen;
