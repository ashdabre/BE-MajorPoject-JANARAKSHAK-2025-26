// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { Users, Shield, ArrowRight, CircleCheck as CheckCircle, Star, Award, Activity } from 'lucide-react-native';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring } from 'react-native-reanimated';

// const { width } = Dimensions.get('window');

// export default function RoleSelectionScreen() {
//   const router = useRouter();
  
//   const headerOpacity = useSharedValue(0);
//   const headerTranslateY = useSharedValue(-30);
//   const citizenCardOpacity = useSharedValue(0);
//   const citizenCardTranslateX = useSharedValue(-50);
//   const officerCardOpacity = useSharedValue(0);
//   const officerCardTranslateX = useSharedValue(50);

//   useEffect(() => {
//     headerOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
//     headerTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
    
//     citizenCardOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
//     citizenCardTranslateX.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 100 }));
    
//     officerCardOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
//     officerCardTranslateX.value = withDelay(800, withSpring(0, { damping: 15, stiffness: 100 }));
//   }, []);

//   const headerAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: headerOpacity.value,
//     transform: [{ translateY: headerTranslateY.value }],
//   }));

//   const citizenAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: citizenCardOpacity.value,
//     transform: [{ translateX: citizenCardTranslateX.value }],
//   }));

//   const officerAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: officerCardOpacity.value,
//     transform: [{ translateX: officerCardTranslateX.value }],
//   }));

//   const handleRoleSelect = (role: 'citizen' | 'officer') => {
//     router.replace(`/(${role})`);
//   };

//   return (
//     <LinearGradient
//       colors={['#667eea', '#764ba2']}
//       style={styles.container}
//     >
//       <View style={styles.content}>
//         <Animated.View style={[styles.header, headerAnimatedStyle]}>
//           <Text style={styles.title}>Choose Your Role</Text>
//           <Text style={styles.subtitle}>Select how you want to use janaraksh</Text>
//         </Animated.View>

//         <View style={styles.rolesContainer}>
//           <Animated.View style={citizenAnimatedStyle}>
//             <TouchableOpacity
//               style={styles.roleCard}
//               onPress={() => handleRoleSelect('citizen')}
//               activeOpacity={0.95}
//             >
//               <LinearGradient
//                 colors={['#ffffff', '#f8fafc']}
//                 style={styles.cardGradient}
//               >
//                 <LinearGradient
//                   colors={['#3B82F6', '#1D4ED8']}
//                   style={styles.roleIcon}
//                 >
//                   <Users size={32} color="#ffffff" strokeWidth={2} />
//                 </LinearGradient>
                
//                 <Text style={styles.roleTitle}>Citizen</Text>
//                 <Text style={styles.roleDescription}>
//                   Access citizen services, file complaints, and stay informed about safety
//                 </Text>
                
//                 <View style={styles.features}>
//                   <View style={styles.feature}>
//                     <CheckCircle size={16} color="#10B981" />
//                     <Text style={styles.featureText}>File & Track FIRs</Text>
//                   </View>
//                   <View style={styles.feature}>
//                     <CheckCircle size={16} color="#10B981" />
//                     <Text style={styles.featureText}>Emergency SOS</Text>
//                   </View>
//                   <View style={styles.feature}>
//                     <CheckCircle size={16} color="#10B981" />
//                     <Text style={styles.featureText}>Legal Assistance</Text>
//                   </View>
//                   <View style={styles.feature}>
//                     <CheckCircle size={16} color="#10B981" />
//                     <Text style={styles.featureText}>Safety Reports</Text>
//                   </View>
//                 </View>
                
//                 <LinearGradient
//                   colors={['#3B82F6', '#1D4ED8']}
//                   style={styles.selectButton}
//                 >
//                   <Text style={styles.selectButtonText}>Continue as Citizen</Text>
//                   <ArrowRight size={18} color="#ffffff" />
//                 </LinearGradient>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View style={officerAnimatedStyle}>
//             <TouchableOpacity
//               style={styles.roleCard}
//               onPress={() => handleRoleSelect('officer')}
//               activeOpacity={0.95}
//             >
//               <LinearGradient
//                 colors={['#ffffff', '#f8fafc']}
//                 style={styles.cardGradient}
//               >
//                 <LinearGradient
//                   colors={['#EF4444', '#DC2626']}
//                   style={styles.roleIcon}
//                 >
//                   <Shield size={32} color="#ffffff" strokeWidth={2} />
//                 </LinearGradient>
                
//                 <Text style={styles.roleTitle}>Officer</Text>
//                 <Text style={styles.roleDescription}>
//                   Manage cases, track assets, monitor duties, and access professional tools
//                 </Text>
                
//                 <View style={styles.features}>
//                   <View style={styles.feature}>
//                     <Star size={16} color="#F59E0B" />
//                     <Text style={styles.featureText}>Case Management</Text>
//                   </View>
//                   <View style={styles.feature}>
//                     <Award size={16} color="#F59E0B" />
//                     <Text style={styles.featureText}>Asset Tracking</Text>
//                   </View>
//                   <View style={styles.feature}>
//                     <Activity size={16} color="#F59E0B" />
//                     <Text style={styles.featureText}>Duty Scheduler</Text>
//                   </View>
//                   <View style={styles.feature}>
//                     <CheckCircle size={16} color="#10B981" />
//                     <Text style={styles.featureText}>Analytics Dashboard</Text>
//                   </View>
//                 </View>
                
//                 <LinearGradient
//                   colors={['#EF4444', '#DC2626']}
//                   style={styles.selectButton}
//                 >
//                   <Text style={styles.selectButtonText}>Continue as Officer</Text>
//                   <ArrowRight size={18} color="#ffffff" />
//                 </LinearGradient>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 48,
//   },
//   title: {
//     fontSize: 36,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//     marginBottom: 12,
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontFamily: 'Inter-Regular',
//     color: 'rgba(255,255,255,0.8)',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   rolesContainer: {
//     gap: 24,
//   },
//   roleCard: {
//     borderRadius: 24,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 20 },
//     shadowOpacity: 0.15,
//     shadowRadius: 30,
//     elevation: 15,
//   },
//   cardGradient: {
//     padding: 28,
//     alignItems: 'center',
//   },
//   roleIcon: {
//     width: 80,
//     height: 80,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.2,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   roleTitle: {
//     fontSize: 28,
//     fontFamily: 'Inter-Bold',
//     color: '#1E293B',
//     marginBottom: 12,
//   },
//   roleDescription: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#64748B',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 24,
//   },
//   features: {
//     width: '100%',
//     gap: 16,
//     marginBottom: 32,
//   },
//   feature: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   featureText: {
//     fontSize: 15,
//     fontFamily: 'Inter-Medium',
//     color: '#475569',
//   },
//   selectButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 18,
//     paddingHorizontal: 32,
//     borderRadius: 16,
//     gap: 8,
//     width: '100%',
//   },
//   selectButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//   },
// });
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Users, Shield, ArrowRight, CircleCheck as CheckCircle, Star, Award, Activity } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const router = useRouter();
  
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const citizenCardOpacity = useSharedValue(0);
  const citizenCardTranslateX = useSharedValue(-50);
  const officerCardOpacity = useSharedValue(0);
  const officerCardTranslateX = useSharedValue(50);

  useEffect(() => {
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    headerTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
    
    citizenCardOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    citizenCardTranslateX.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 100 }));
    
    officerCardOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    officerCardTranslateX.value = withDelay(800, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const citizenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: citizenCardOpacity.value,
    transform: [{ translateX: citizenCardTranslateX.value }],
  }));

  const officerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: officerCardOpacity.value,
    transform: [{ translateX: officerCardTranslateX.value }],
  }));

  const handleRoleSelect = (role: 'citizen' | 'officer') => {
    router.replace(`/(${role})`);
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>Select how you want to use janaraksh</Text>
        </Animated.View>

        <View style={styles.rolesContainer}>
          <Animated.View style={citizenAnimatedStyle}>
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleRoleSelect('citizen')}
              activeOpacity={0.95}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.cardGradient}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.roleIcon}
                >
                  <Users size={32} color="#ffffff" strokeWidth={2} />
                </LinearGradient>
                
                <Text style={styles.roleTitle}>Citizen</Text>
                <Text style={styles.roleDescription}>
                  Access citizen services, file complaints, and stay informed about safety
                </Text>
                
                <View style={styles.features}>
                  <View style={styles.feature}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.featureText}>File & Track FIRs</Text>
                  </View>
                  <View style={styles.feature}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.featureText}>Emergency SOS</Text>
                  </View>
                  <View style={styles.feature}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.featureText}>Legal Assistance</Text>
                  </View>
                  <View style={styles.feature}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.featureText}>Safety Reports</Text>
                  </View>
                </View>
                
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.selectButton}
                >
                  <Text style={styles.selectButtonText}>Continue as Citizen</Text>
                  <ArrowRight size={18} color="#ffffff" />
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={officerAnimatedStyle}>
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleRoleSelect('officer')}
              activeOpacity={0.95}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.cardGradient}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.roleIcon}
                >
                  <Shield size={32} color="#ffffff" strokeWidth={2} />
                </LinearGradient>
                
                <Text style={styles.roleTitle}>Officer</Text>
                <Text style={styles.roleDescription}>
                  Manage cases, track assets, monitor duties, and access professional tools
                </Text>
                
                <View style={styles.features}>
                  <View style={styles.feature}>
                    <Star size={16} color="#F59E0B" />
                    <Text style={styles.featureText}>Case Management</Text>
                  </View>
                  <View style={styles.feature}>
                    <Award size={16} color="#F59E0B" />
                    <Text style={styles.featureText}>Asset Tracking</Text>
                  </View>
                  <View style={styles.feature}>
                    <Activity size={16} color="#F59E0B" />
                    <Text style={styles.featureText}>Duty Scheduler</Text>
                  </View>
                  <View style={styles.feature}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.featureText}>Analytics Dashboard</Text>
                  </View>
                </View>
                
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.selectButton}
                >
                  <Text style={styles.selectButtonText}>Continue as Officer</Text>
                  <ArrowRight size={18} color="#ffffff" />
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  rolesContainer: {
    gap: 24,
  },
  roleCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  cardGradient: {
    padding: 28,
    alignItems: 'center',
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  roleTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  roleDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  features: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#475569',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    width: '100%',
  },
  selectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});