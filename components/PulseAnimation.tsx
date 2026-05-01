import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence
} from 'react-native-reanimated';

interface PulseAnimationProps {
  size?: number;
  color?: string;
  children?: React.ReactNode;
}

export default function PulseAnimation({ size = 60, color = '#3b82f6', children }: PulseAnimationProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View 
        style={[
          styles.pulse, 
          { 
            width: size, 
            height: size, 
            backgroundColor: color,
            borderRadius: size / 2
          },
          animatedStyle
        ]} 
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulse: {
    position: 'absolute',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});