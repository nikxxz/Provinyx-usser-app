import React from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  BounceIn,
  BounceOut,
  ElasticIn,
} from 'react-native-reanimated';


const AnimatedView = ({
  children,
  duration = 300,
  animationType = 'fade',
  style,
}) => {
  const getAnimationConfig = () => {
    const configs = {
      fade: {
        entering: FadeIn.duration(duration),
        exiting: FadeOut.duration(duration),
      },
      zoom: {
        entering: ZoomIn.duration(duration),
        exiting: ZoomOut.duration(duration),
      },
      bounce: {
        entering: BounceIn.duration(duration),
        exiting: BounceOut.duration(duration),
      },
      elastic: {
        entering: ElasticIn.damping(1.2).duration(duration),
      },
    };

    return configs[animationType] || configs.fade;
  };

  const animationConfig = getAnimationConfig();

  return (
    <Animated.View {...animationConfig} style={style}>
      {children}
    </Animated.View>
  );
};

export default AnimatedView;
