import { CardStyleInterpolators } from '@react-navigation/stack';


export const slideHorizontalAnimation = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  animationEnabled: true,
};

export const slideVerticalAnimation = {
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
  animationEnabled: true,
};

export const fadeAnimation = {
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
  animationEnabled: true,
};

export const noHeaderOptions = {
  headerShown: false,
};


export const defaultScreenOptions = {
  ...noHeaderOptions,
  ...slideHorizontalAnimation,
  gestureEnabled: true,
};
