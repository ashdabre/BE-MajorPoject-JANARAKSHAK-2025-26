// import React from 'react';
// import { Tabs } from 'expo-router';
// import { View, StyleSheet, Platform } from 'react-native';
// import { BlurView } from 'expo-blur';
// import { Chrome as Home, FileText, TriangleAlert as AlertTriangle, MapPin, MessageCircle, Search, Bell, Users, Shield, Heart, Car } from 'lucide-react-native';
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
//         <Icon size={22} color={focused ? '#6366F1' : '#94A3B8'} strokeWidth={focused ? 2.5 : 2} />
//       </Animated.View>
//     </View>
//   );
// }

// export default function CitizenLayout() {
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
//         tabBarActiveTintColor: '#6366F1',
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
//           title: 'Home',
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
//         name="fir"
//         options={{
//           title: 'FIR',
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
//         name="sos"
//         options={{
//           title: 'SOS',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={AlertTriangle} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="map"
//         options={{
//           title: 'Map',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={MapPin} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: 'Legal',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={MessageCircle} color={color} />
//           ),
//         }}
//       />
//       {/* <Tabs.Screen
//         name="missing-person"
//         options={{
//           title: 'Missing',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Users} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="stolen-items"
//         options={{
//           title: 'Stolen',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Shield} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="lost-found"
//         options={{
//           title: 'Lost',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Heart} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="towed-vehicle"
//         options={{
//           title: 'Towed',
//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon focused={focused} icon={Car} color={color} />
//           ),
//         }}
//       /> */}
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
//     backgroundColor: '#F0F7FF',
//     borderRadius: 18,
//     shadowColor: '#6366F1',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
// });