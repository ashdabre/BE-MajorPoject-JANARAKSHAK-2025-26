import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FileText, Shield, Users, Clock, TriangleAlert as AlertTriangle, TrendingUp, Bell, Settings, Star, Activity, Zap, Award, ChevronRight, User, MapPin, Calendar, ChartBar as BarChart3, Search, Plus, Heart, Eye, Lock, MessageCircle, Phone, Crown, Sparkles, Target, Menu, Car } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming, withDelay, interpolate } from 'react-native-reanimated';
import SlidingMenu from '@/components/SlidingMenu';

const { width } = Dimensions.get('window');

export default function CitizenHome() {
  const router = useRouter();
  const [isOfficerMode, setIsOfficerMode] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const headerOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    cardsOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
  }, []);

  const handleRoleSwitch = (value: boolean) => {
    setIsOfficerMode(value);
    if (value) {
      setTimeout(() => {
        router.replace('/(officer)');
      }, 300);
    }
  };

  const handleNotifications = () => {
    router.push('/(citizen)/notifications');
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) }],
  }));

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: interpolate(cardsOpacity.value, [0, 1], [50, 0]) }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      {/* Clean Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerTop}>
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>RS</Text>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>Rahul Sharma</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleNotifications} activeOpacity={0.7}>
              <Bell size={22} color="#1E293B" strokeWidth={2} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => setIsMenuVisible(true)}
              activeOpacity={0.7}
            >
              <Menu size={22} color="#1E293B" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role Switch Card */}
        <View style={styles.roleSwitchCard}>
          <View style={styles.roleSwitchLeft}>
            <View style={styles.switchIconContainer}>
              <Shield size={20} color="#6366F1" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.roleSwitchLabel}>Officer Mode</Text>
              <Text style={styles.roleSwitchSubtext}>Switch to dashboard</Text>
            </View>
          </View>
          <Switch
            value={isOfficerMode}
            onValueChange={handleRoleSwitch}
            trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.mainContent, cardsAnimatedStyle]}>
          
          {/* Enhanced Safety Score Card */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View style={styles.scoreHeaderLeft}>
                <View style={styles.scoreBadge}>
                  <Shield size={16} color="#6366F1" strokeWidth={2.5} />
                </View>
                <View>
                  <Text style={styles.scoreTitle}>Safety Score</Text>
                  <Text style={styles.scoreSubtitle}>Your protection level</Text>
                </View>
              </View>
              <View style={styles.scoreCircleContainer}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreNumber}>95</Text>
                </View>
                <Text style={styles.scorePercentLabel}>Excellent</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.scoreMetrics}>
              <View style={styles.scoreMetric}>
                <View style={styles.metricTop}>
                  <View style={[styles.metricDot, { backgroundColor: '#6366F1' }]} />
                  <Text style={styles.metricNumber}>12</Text>
                </View>
                <Text style={styles.metricLabel}>Total Reports</Text>
              </View>
              
              <View style={styles.metricDivider} />
              
              <View style={styles.scoreMetric}>
                <View style={styles.metricTop}>
                  <View style={[styles.metricDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.metricNumber}>8</Text>
                </View>
                <Text style={styles.metricLabel}>Resolved</Text>
              </View>
              
              <View style={styles.metricDivider} />
              
              <View style={styles.scoreMetric}>
                <View style={styles.metricTop}>
                  <View style={[styles.metricDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.metricNumber}>2</Text>
                </View>
                <Text style={styles.metricLabel}>Pending</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions - Horizontal Glassmorphism Cards */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity 
                style={[styles.actionCardHorizontal, { backgroundColor: 'rgba(238, 242, 255, 0.5)' }]}
                onPress={() => router.push('/(citizen)/fir')}
                activeOpacity={0.8}
              >
                <View style={styles.actionCardLeft}>
                  <View style={[styles.actionIconGlass, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                    <FileText size={26} color="#6366F1" strokeWidth={2.5} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>File FIR</Text>
                    <Text style={styles.actionSubtitle}>Report incident quickly</Text>
                  </View>
                </View>
                <ChevronRight size={22} color="#6366F1" strokeWidth={2.5} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCardHorizontal, { backgroundColor: 'rgba(254, 242, 242, 0.5)' }]}
                onPress={() => router.push('/(citizen)/sos')}
                activeOpacity={0.8}
              >
                <View style={styles.actionCardLeft}>
                  <View style={[styles.actionIconGlass, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                    <AlertTriangle size={26} color="#EF4444" strokeWidth={2.5} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>SOS Emergency</Text>
                    <Text style={styles.actionSubtitle}>Get immediate help</Text>
                  </View>
                </View>
                <ChevronRight size={22} color="#EF4444" strokeWidth={2.5} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCardHorizontal, { backgroundColor: 'rgba(240, 253, 244, 0.5)' }]}
                onPress={() => router.push('/(citizen)/map')}
                activeOpacity={0.8}
              >
                <View style={styles.actionCardLeft}>
                  <View style={[styles.actionIconGlass, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <MapPin size={26} color="#10B981" strokeWidth={2.5} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Crime Map</Text>
                    <Text style={styles.actionSubtitle}>Area insights & safety zones</Text>
                  </View>
                </View>
                <ChevronRight size={22} color="#10B981" strokeWidth={2.5} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCardHorizontal, { backgroundColor: 'rgba(255, 247, 237, 0.5)' }]}
                onPress={() => router.push('/(citizen)/chat')}
                activeOpacity={0.8}
              >
                <View style={styles.actionCardLeft}>
                  <View style={[styles.actionIconGlass, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <MessageCircle size={26} color="#F59E0B" strokeWidth={2.5} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Legal AI Assistant</Text>
                    <Text style={styles.actionSubtitle}>Get instant legal advice</Text>
                  </View>
                </View>
                <ChevronRight size={22} color="#F59E0B" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Month</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: '#EEF2FF' }]}>
                    <FileText size={20} color="#6366F1" strokeWidth={2.5} />
                  </View>
                  <View style={styles.statTrend}>
                    <TrendingUp size={14} color="#10B981" strokeWidth={2.5} />
                    <Text style={styles.statTrendText}>+12%</Text>
                  </View>
                </View>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Total Reports</Text>
                <View style={styles.statProgress}>
                  <View style={[styles.statProgressBar, { width: '75%', backgroundColor: '#6366F1' }]} />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: '#F0FDF4' }]}>
                    <Shield size={20} color="#10B981" strokeWidth={2.5} />
                  </View>
                  <View style={styles.statTrend}>
                    <TrendingUp size={14} color="#10B981" strokeWidth={2.5} />
                    <Text style={styles.statTrendText}>+8%</Text>
                  </View>
                </View>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Resolved</Text>
                <View style={styles.statProgress}>
                  <View style={[styles.statProgressBar, { width: '90%', backgroundColor: '#10B981' }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            <View style={styles.activityList}>
              <TouchableOpacity style={styles.activityCard} activeOpacity={0.7}>
                <View style={[styles.activityIcon, { backgroundColor: '#EEF2FF' }]}>
                  <FileText size={20} color="#6366F1" strokeWidth={2.5} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>FIR Status Updated</Text>
                  <Text style={styles.activitySubtitle}>Case #FIR/2024/001234</Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
                <View style={styles.activityBadge}>
                  <View style={styles.badgeDot} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.activityCard} activeOpacity={0.7}>
                <View style={[styles.activityIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Shield size={20} color="#10B981" strokeWidth={2.5} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Safety Alert</Text>
                  <Text style={styles.activitySubtitle}>High activity in your area</Text>
                  <Text style={styles.activityTime}>5 hours ago</Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.activityCard} activeOpacity={0.7}>
                <View style={[styles.activityIcon, { backgroundColor: '#FFF7ED' }]}>
                  <MessageCircle size={20} color="#F59E0B" strokeWidth={2.5} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Legal Consultation</Text>
                  <Text style={styles.activitySubtitle}>Session completed</Text>
                  <Text style={styles.activityTime}>1 day ago</Text>
                </View>
                <View style={styles.checkIcon}>
                  <Target size={16} color="#10B981" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
      
      <SlidingMenu 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        userRole="citizen"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationCount: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  roleSwitchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  roleSwitchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  switchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleSwitchLabel: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  roleSwitchSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scoreCard: {
    backgroundColor: 'rgba(238, 242, 255, 0.6)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(199, 210, 254, 0.4)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  scoreSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 2,
  },
  scoreCircleContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6366F1',
  },
  scoreNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  scorePercentLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  scoreMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreMetric: {
    flex: 1,
    alignItems: 'center',
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricNumber: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F1F5F9',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  quickActionsContainer: {
    gap: 12,
  },
  actionCardHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  actionIconGlass: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statTrendText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 10,
  },
  statProgress: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
  },
  statProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  activityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  checkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
});