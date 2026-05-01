// import React from 'react';
// import { Tabs } from 'expo-router';
// import { View, StyleSheet, Platform } from 'react-native';
// import { BlurView } from 'expo-blur';
// import { Chrome as Home, FileText, Shield, ChartBar as BarChart3, Calendar, Search, Bell, Mic, QrCode, Users, Brain } from 'lucide-react-native';
// import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming, interpolate } from 'react-native-reanimated';

// function TabBarIcon({ focused, icon: Icon, color }: { focused: boolean; icon: any; color: string }) {
//   const scale = useSharedValue(focused ? 1 : 0.8);
//   const translateY = useSharedValue(focused ? 0 : 0);
//   const backgroundOpacity = useSharedValue(focused ? 1 : 0);

//   React.useEffect(() => {
//     scale.value = withSpring(focused ? 1.1 : 0.9, {
//       damping: 15,
//       stiffness: 200,
//     });
//     translateY.value = withSpring(focused ? -4 : 0, {
//       damping: 15,
//       stiffness: 200,
//     });
//     backgroundOpacity.value = withTiming(focused ? 1 : 0, { duration: 200 });
//   }, [focused]);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { scale: scale.value },
//         { translateY: translateY.value }
//       ],
//     };
//   });

//   const backgroundStyle = useAnimatedStyle(() => {
//     return {
//       opacity: backgroundOpacity.value,
//       transform: [{ scale: interpolate(backgroundOpacity.value, [0, 1], [0.8, 1]) }],
//     };
//   });

//   return (
//     <View style={styles.iconWrapper}>
//       <Animated.View style={[styles.iconBackground, backgroundStyle]}>
//         <View style={styles.iconBackgroundInner} />
//       </Animated.View>
//       <Animated.View style={[animatedStyle]}>
//         <Icon size={22} color={focused ? '#EF4444' : '#94A3B8'} strokeWidth={focused ? 2.5 : 2} />
//       </Animated.View>
//     </View>
//   );
// }

// export default function OfficerLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           position: 'absolute',
//           bottom: 20,
//           left: 20,
//           right: 20,
//           backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
//           borderRadius: 28,
//           height: 70,
//           paddingBottom: 8,
//           paddingTop: 8,
//           borderTopWidth: 0,
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 10 },
//           shadowOpacity: 0.15,
//           shadowRadius: 20,
//           elevation: 15,
//           borderWidth: Platform.OS === 'ios' ? 1 : 0,
//           borderColor: 'rgba(255, 255, 255, 0.2)',
//         },
//         tabBarBackground: () => (
//           Platform.OS === 'ios' ? (
//             <BlurView intensity={80} style={StyleSheet.absoluteFill} />
//           ) : null
//         ),
//         tabBarActiveTintColor: '#EF4444',
//         tabBarInactiveTintColor: '#94A3B8',
//         tabBarShowLabel: true,
//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontFamily: 'Inter-SemiBold',
//           marginTop: 4,
//         },
//         tabBarItemStyle: {
//           paddingVertical: 4,
//           borderRadius: 20,
//           marginHorizontal: 2,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Dashboard',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Home} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="search"
//         options={{
//           title: 'Search',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Search} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="cases"
//         options={{
//           title: 'Cases',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={FileText} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="notifications"
//         options={{
//           title: 'Alerts',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Bell} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="assets"
//         options={{
//           title: 'Assets',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Shield} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="analytics"
//         options={{
//           title: 'Analytics',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={BarChart3} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="schedule"
//         options={{
//           title: 'Schedule',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Calendar} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="voice-command"
//         options={{
//           title: 'Voice',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Mic} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="qr-scanner"
//         options={{
//           title: 'QR Scan',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={QrCode} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="missing-person"
//         options={{
//           title: 'Missing',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Users} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="ai-case-manager"
//         options={{
//           title: 'AI Cases',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Brain} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   iconWrapper: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   iconBackground: {
//     position: 'absolute',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//   },
//   iconBackgroundInner: {
//     flex: 1,
//     backgroundColor: '#FEF2F2',
//     borderRadius: 18,
//     shadowColor: '#EF4444',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
// });
import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Chrome as Home, FileText, Shield, Calendar, Search, Mic, Brain } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';

function TabBarIcon({ focused, icon: Icon, color }: { focused: boolean; icon: any; color: string }) {
  const scale = useSharedValue(focused ? 1 : 0.95);
  const opacity = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.95, {
      damping: 12,
      stiffness: 180,
    });
    opacity.value = withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.iconWrapper}>
      <Animated.View style={[styles.iconBackground, animatedBackgroundStyle]} />
      <Animated.View style={animatedIconStyle}>
        <Icon 
          size={24} 
          color={focused ? '#6366F1' : '#94A3B8'} 
          strokeWidth={focused ? 2.5 : 2} 
        />
      </Animated.View>
    </View>
  );
}

export default function OfficerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
          borderWidth: 1,
          borderColor: '#F1F5F9',
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
          ) : null
        ),
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter-SemiBold',
          marginTop: 4,
          letterSpacing: -0.2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: 16,
          marginHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} icon={Home} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} icon={Search} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: 'Cases',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} icon={FileText} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: 'Assets',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} icon={Shield} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} icon={Calendar} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="voice-command"
        options={{
          title: 'Voice',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} icon={Mic} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-case-manager"
        options={{
          title: 'AI Cases',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} icon={Brain} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
  },
});