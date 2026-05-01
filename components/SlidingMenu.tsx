import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { X, User, Settings, Bell, Search, FileText, Shield, MapPin, MessageCircle, TriangleAlert as AlertTriangle, Camera, QrCode, Mic, Car, Users, Calendar, ChartBar as BarChart3, Phone, Heart, Lock, Crown, LogOut, Brain, Target } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SlidingMenuProps {
  isVisible: boolean;
  onClose: () => void;
  userRole: 'citizen' | 'officer';
}

export default function SlidingMenu({ isVisible, onClose, userRole }: SlidingMenuProps) {
  const router = useRouter();
  const slideAnimation = useSharedValue(0);
  const overlayAnimation = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      slideAnimation.value = withSpring(1, { damping: 20, stiffness: 100 });
      overlayAnimation.value = withTiming(1, { duration: 300 });
    } else {
      slideAnimation.value = withTiming(0, { duration: 300 });
      overlayAnimation.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(slideAnimation.value, [0, 1], [-width * 0.8, 0]) }
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayAnimation.value,
  }));

  const citizenMenuItems = [
    { title: 'Home', icon: User, route: '/(citizen)', color: '#667eea' },
    { title: 'Search', icon: Search, route: '/(citizen)/search', color: '#4ECDC4' },
    { title: 'File FIR', icon: FileText, route: '/(citizen)/fir', color: '#FF6B9D' },
    { title: 'Emergency SOS', icon: AlertTriangle, route: '/(citizen)/sos', color: '#EF4444' },
    { title: 'Crime Map', icon: MapPin, route: '/(citizen)/map', color: '#96CEB4' },
    { title: 'Legal AI', icon: MessageCircle, route: '/(citizen)/chat', color: '#A8EDEA' },
    { title: 'Missing Persons', icon: Users, route: '/(citizen)/missing-person', color: '#FFD93D' },
    { title: 'Stolen Items', icon: Shield, route: '/(citizen)/stolen-items', color: '#FF8A80' },
    { title: 'Lost & Found', icon: Search, route: '/(citizen)/lost-found', color: '#81C784' },
    { title: 'Towed Vehicles', icon: Car, route: '/(citizen)/towed-vehicle', color: '#64B5F6' },
    { title: 'Notifications', icon: Bell, route: '/(citizen)/notifications', color: '#FFB74D' },
  ];

  const officerMenuItems = [
    { title: 'Dashboard', icon: User, route: '/(officer)', color: '#DC2626' },
    { title: 'Search', icon: Search, route: '/(officer)/search', color: '#4ECDC4' },
    { title: 'Case Management', icon: FileText, route: '/(officer)/cases', color: '#667eea' },
    { title: 'Asset Tracking', icon: Shield, route: '/(officer)/assets', color: '#059669' },
    { title: 'Analytics', icon: BarChart3, route: '/officer-analytics', color: '#7C3AED' },
    { title: 'Schedule', icon: Calendar, route: '/(officer)/schedule', color: '#DC2626' },
    { title: 'Voice Commands', icon: Mic, route: '/(officer)/voice-command', color: '#F59E0B' },
    { title: 'QR Scanner', icon: QrCode, route: '/officer-qr', color: '#10B981' },
    { title: 'Missing Persons', icon: Users, route: '/officer-missing-person', color: '#EF4444' },
    { title: 'AI Case Manager', icon: Brain, route: '/(officer)/ai-case-manager', color: '#8B5CF6' },
    { title: 'Notifications', icon: Bell, route: '/officer-notification', color: '#F97316' },
  ];

  const shoMenuItems = [
    { title: 'SHO Dashboard', icon: Crown, route: '/(sho)', color: '#7C3AED' },
    { title: 'FIR Inbox', icon: FileText, route: '/(sho)/fir-inbox', color: '#DC2626' },
    { title: 'Assign Cases', icon: Target, route: '/(sho)/assign-cases', color: '#10B981' },
    { title: 'Officer Workload', icon: Users, route: '/(sho)/officer-workload', color: '#3B82F6' },
    { title: 'Analytics', icon: BarChart3, route: '/(sho)/analytics', color: '#F59E0B' },
    { title: 'Notifications', icon: Bell, route: '/(sho)/notifications', color: '#EF4444' },
  ];

  const menuItems = userRole === 'citizen' ? citizenMenuItems : 
                   userRole === 'officer' ? officerMenuItems : shoMenuItems;

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1} />
      </Animated.View>
      
      <Animated.View style={[styles.menu, slideStyle]}>
        <LinearGradient
          colors={userRole === 'citizen' ? ['#667eea', '#764ba2'] : ['#DC2626', '#EF4444']}
          style={styles.menuHeader}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {userRole === 'citizen' ? 'RS' : 'IK'}
                </Text>
                <View style={styles.premiumBadge}>
                  <Crown size={12} color="#FFD700" />
                </View>
              </LinearGradient>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {userRole === 'citizen' ? 'Rahul Sharma' : 'Inspector Kumar'}
                </Text>
                <Text style={styles.userRole}>
                  {userRole === 'citizen' ? 'Citizen' : 'Police Officer'}
                </Text>
                <View style={styles.statusContainer}>
                  <View style={styles.onlineIndicator} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Main Features</Text>
            <View style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleNavigation(item.route)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                    <item.icon size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
                <View style={[styles.menuIcon, { backgroundColor: '#f0f7ff' }]}>
                  <Settings size={20} color="#667eea" />
                </View>
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef2f2' }]}>
                  <LogOut size={20} color="#ef4444" />
                </View>
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.menuFooter}>
          <Text style={styles.footerText}>janaraksh v2.0</Text>
          <Text style={styles.footerSubtext}>Empowering Citizens, Supporting Officers</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#667eea',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  userRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.7)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  menuSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 16,
    marginTop: 16,
  },
  menuItems: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
  },
  menuFooter: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
});