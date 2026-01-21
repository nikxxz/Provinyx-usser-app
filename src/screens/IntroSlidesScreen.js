import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/splash1.png'),
    title: "Products With Stories\nYou Can't See",
    description:
      'Every product has a hidden journey - from materials and manufacturing to usage, ownership, and recycling. Without visibility, brands lose trust, consumers lose clarity, and sustainability loses momentum.',
    highlight: 'Provinyx',
    highlightText: " reveals what today's supply chains keep unseen.",
  },
  {
    id: '2',
    image: require('../../assets/splash2.png'),
    title: 'The Digital Passport\nfor Every Product',
    description:
      'Provinyx assigns a secure Digital Product Passport to each item, storing verified data about origin, materials, certifications, repairs, recycling, and ownership updates. Scan a QR and instantly access proof you can trust, transparent, tamper-proof, and circular by design.',
  },
  {
    id: '3',
    image: require('../../assets/splash3.png'),
    title: 'Transparency That Builds\nTrust & Circular Value',
    description:
      'With Provinyx, brands unlock regulatory compliance, circular reuse, and end-of-life efficiency. Consumers gain confidence, traceability, and environmental clarity. Together, we accelerate sustainability by turning product data into proven impact.',
  },
];

const PaginationDot = ({ index, scrollX, currentIndex }) => {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1.3, 0.8],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.dot, index === currentIndex && styles.activeDot, dotStyle]}
    />
  );
};

const Pagination = ({ scrollX, currentIndex }) => {
  return (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          scrollX={scrollX}
          currentIndex={currentIndex}
        />
      ))}
    </View>
  );
};

const IntroSlidesScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      navigation.replace('Onboarding');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.slideImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.slideDescription}>{item.description}</Text>
            {item.highlight && (
              <Text style={styles.slideDescription}>
                <Text style={styles.highlightText}>{item.highlight}</Text>
                {item.highlightText}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4169E1" />

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={event => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        decelerationRate="fast"
      />

      <View style={styles.bottomContainer}>
        <Pagination scrollX={scrollX} currentIndex={currentIndex} />

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handleBack}
            disabled={currentIndex === 0}
          >
            <Icon
              name="arrow-left"
              size={20}
              color={currentIndex === 0 ? 'rgba(255,255,255,0.3)' : '#fff'}
            />
            <Text
              style={[
                styles.navButtonText,
                currentIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4169E1',
  },
  slide: {
    width: width,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  slideImage: {
    width: width * 0.8,
    height: height * 0.35,
  },
  textContainer: {
    flex: 0.5,
    paddingTop: 20,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    lineHeight: 36,
    textAlign: 'left',
  },
  descriptionContainer: {
    gap: 12,
  },
  slideDescription: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
    opacity: 0.9,
    textAlign: 'left',
  },
  highlightText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
});

export default IntroSlidesScreen;
