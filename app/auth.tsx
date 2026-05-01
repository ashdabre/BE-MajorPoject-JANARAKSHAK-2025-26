import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Shield, Mail, Phone, Eye, EyeOff, ArrowRight, User, Lock, Crown, Star, Users, Building } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'citizen' | 'officer'>('citizen');
  const [officerType, setOfficerType] = useState<'officer' | 'sho'>('officer');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);

  useEffect(() => {
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    headerTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
    
    formOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    formTranslateY.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const handleAuth = () => {
    if (authMode === 'citizen') {
      router.replace('/(citizen)');
    } else {
      if (officerType === 'sho') {
        router.replace('/(sho)');
      } else {
        router.replace('/(officer)');
      }
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    handleAuth();
  };

  const handleOTPLogin = () => {
    // Handle OTP login
    handleAuth();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <View style={styles.logoContainer}>
              <Shield size={48} color="#2563EB" strokeWidth={2} />
            </View>
            <Text style={styles.title}>janaraksh</Text>
            <Text style={styles.subtitle}>Secure Police Management System</Text>
          </Animated.View>

          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            {/* User Type Toggle */}
            <View style={styles.userTypeToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, authMode === 'citizen' && styles.activeToggle]}
                onPress={() => setAuthMode('citizen')}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, authMode === 'citizen' && styles.activeToggleText]}>
                  Citizen Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, authMode === 'officer' && styles.activeToggle]}
                onPress={() => setAuthMode('officer')}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, authMode === 'officer' && styles.activeToggleText]}>
                  Admin Login
                </Text>
              </TouchableOpacity>
            </View>

            {/* Officer Type Selection - Only show when officer is selected */}
            {authMode === 'officer' && (
              <View style={styles.adminTypeContainer}>
                <Text style={styles.adminTypeLabel}>Select Admin Type</Text>
                
                <TouchableOpacity
                  style={[styles.adminOption, officerType === 'officer' && styles.activeAdminOption]}
                  onPress={() => setOfficerType('officer')}
                  activeOpacity={0.8}
                >
                  <View style={styles.adminOptionContent}>
                    <View style={styles.adminIconContainer}>
                      <Building size={20} color={officerType === 'officer' ? '#2563EB' : '#64748B'} />
                    </View>
                    <Text style={[styles.adminOptionText, officerType === 'officer' && styles.activeAdminOptionText]}>
                      Department Dashboard Login
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.adminOption, officerType === 'sho' && styles.activeAdminOption]}
                  onPress={() => setOfficerType('sho')}
                  activeOpacity={0.8}
                >
                  <View style={styles.adminOptionContent}>
                    <View style={styles.adminIconContainer}>
                      <Crown size={20} color={officerType === 'sho' ? '#2563EB' : '#64748B'} />
                    </View>
                    <Text style={[styles.adminOptionText, officerType === 'sho' && styles.activeAdminOptionText]}>
                      SHO Login
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Google Login Button */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} activeOpacity={0.8}>
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Phone Number Login Section */}
            <View style={styles.phoneLoginSection}>
              <Text style={styles.phoneLoginTitle}>Phone Number Login</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Phone size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter mobile number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  />
                </View>
              </View>

              {/* Send OTP Button */}
              <TouchableOpacity style={styles.otpButton} onPress={handleOTPLogin} activeOpacity={0.9}>
                <Phone size={20} color="#ffffff" />
                <Text style={styles.otpButtonText}>Send OTP</Text>
              </TouchableOpacity>
            </View>

            {/* Role Indicator */}
            <View style={styles.roleIndicator}>
              {authMode === 'citizen' ? (
                <>
                  <Users size={16} color="#2563EB" />
                  <Text style={styles.roleIndicatorText}>Citizen Services Access</Text>
                </>
              ) : officerType === 'sho' ? (
                <>
                  <Crown size={16} color="#7C3AED" />
                  <Text style={styles.roleIndicatorText}>SHO Management Portal</Text>
                </>
              ) : (
                <>
                  <Building size={16} color="#059669" />
                  <Text style={styles.roleIndicatorText}>Department Dashboard Access</Text>
                </>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  userTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeToggleText: {
    color: '#ffffff',
  },
  adminTypeContainer: {
    marginBottom: 24,
  },
  adminTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 16,
    textAlign: 'center',
  },
  adminOption: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  activeAdminOption: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFF',
  },
  adminOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    flex: 1,
  },
  activeAdminOptionText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    gap: 12,
    marginBottom: 24,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#64748B',
  },
  phoneLoginSection: {
    marginBottom: 24,
  },
  phoneLoginTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  otpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  otpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  roleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  roleIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
});