import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Shield, Sparkles } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    // Logo animation
    logoScale.value = withDelay(300, withSpring(1, { damping: 15, stiffness: 100 }));
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    
    // Title animation
    titleOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(800, withSpring(0, { damping: 12, stiffness: 100 }));
    
    // Subtitle animation
    subtitleOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(1200, withSpring(0, { damping: 12, stiffness: 100 }));
    
    // Sparkle rotation
    sparkleRotation.value = withDelay(1000, withSequence(
      withTiming(360, { duration: 1000 }),
      withTiming(0, { duration: 0 })
    ));
    
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
            style={styles.logoBackground}
          >
            <Shield size={60} color="#ffffff" strokeWidth={1.5} />
          </LinearGradient>
          <Animated.View style={[styles.sparkle, sparkleAnimatedStyle]}>
            <Sparkles size={24} color="#FFD700" />
          </Animated.View>
        </Animated.View>
        
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          janaraksh
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
          Empowering Citizens, Supporting Officers
        </Animated.Text>
        
        <Animated.View style={[styles.tagline, subtitleAnimatedStyle]}>
          <Text style={styles.taglineText}>Your Safety, Our Priority</Text>
        </Animated.View>
      </View>
      
      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  sparkle: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  tagline: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  taglineText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 100,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 150,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 200,
    right: 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});