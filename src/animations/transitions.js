import {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Easing,
} from 'react-native-reanimated';

export const slideInAnimation = {
  entering: SlideInRight.withDuration(300),
  exiting: SlideOutLeft.withDuration(300),
};

export const fadeAnimation = {
  entering: FadeIn.duration(300),
  exiting: FadeOut.duration(300),
};

export const defaultLayoutAnimation = Easing.duration(300);
