import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FileText, Shield, Users, Clock, AlertTriangle, Bell, Calendar, BarChart3, Search, Target, Briefcase, Crown, Badge, Menu, Mic, QrCode, MapPin, ChevronRight } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming, withDelay, interpolate } from 'react-native-reanimated';
import SlidingMenu from '@/components/SlidingMenu';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 24;

export default function OfficerDashboard() {
  const router = useRouter();
  const [isCitizenMode, setIsCitizenMode] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const headerOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    cardsOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
  }, []);

  const handleRoleSwitch = (value: boolean) => {
    setIsCitizenMode(value);
    if (value) {
      setTimeout(() => router.replace('/(citizen)'), 300);
    }
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerTop}>
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>IK</Text>
              <View style={styles.badgeIcon}>
                <Badge size={10} color="#F59E0B" />
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>Inspector Kumar</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Badge #4521 • On Duty</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => router.push('/(officer)/notifications')}
              activeOpacity={0.7}
            >
              <Bell size={22} color="#1F2937" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setIsMenuVisible(true)}
              activeOpacity={0.7}
            >
              <Menu size={22} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role Switch */}
        <View style={styles.switchCard}>
          <View style={styles.switchLeft}>
            <View style={styles.switchIcon}>
              <Users size={20} color="#6366F1" />
            </View>
            <View>
              <Text style={styles.switchTitle}>Citizen Mode</Text>
              <Text style={styles.switchSubtitle}>Switch to citizen services</Text>
            </View>
          </View>
          <Switch
            value={isCitizenMode}
            onValueChange={handleRoleSwitch}
            trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
            thumbColor="#ffffff"
          />
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.mainContent, cardsAnimatedStyle]}>
          
          {/* Performance Stats */}
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <View>
                <Text style={styles.performanceTitle}>Performance Overview</Text>
                <Text style={styles.performanceSubtitle}>Your efficiency rating</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreNumber}>89</Text>
                <Text style={styles.scoreLabel}>%</Text>
                <Crown size={16} color="#F59E0B" style={styles.crownIcon} />
              </View>
            </View>
            
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <View style={[styles.metricBox, { backgroundColor: '#EEF2FF' }]}>
                  <Text style={styles.metricValue}>24</Text>
                </View>
                <Text style={styles.metricLabel}>Active</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={[styles.metricBox, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={styles.metricValue}>8</Text>
                </View>
                <Text style={styles.metricLabel}>Today</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={[styles.metricBox, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.metricValue}>12</Text>
                </View>
                <Text style={styles.metricLabel}>Pending</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Officer Tools</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color="#6366F1" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionsGrid}>
              {[
                { icon: FileText, title: 'Case Management', subtitle: 'Track and manage cases', color: '#6366F1', bg: '#EEF2FF' },
                { icon: Shield, title: 'Asset Tracking', subtitle: 'Equipment management', color: '#10B981', bg: '#ECFDF5' },
                { icon: Calendar, title: 'Duty Schedule', subtitle: 'Shift management', color: '#3B82F6', bg: '#EFF6FF' },
                { icon: BarChart3, title: 'Analytics', subtitle: 'Crime data insights', color: '#EC4899', bg: '#FDF2F8' },
                { icon: Mic, title: 'Voice Commands', subtitle: 'AI voice assistant', color: '#F59E0B', bg: '#FEF3C7' },
                { icon: QrCode, title: 'QR Scanner', subtitle: 'Location verification', color: '#059669', bg: '#D1FAE5' },
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <TouchableOpacity key={idx} style={styles.actionCard} activeOpacity={0.7}>
                    <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                      <Icon size={26} color={action.color} strokeWidth={2} />
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Case Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Case Overview</Text>
            <View style={styles.caseGrid}>
              <View style={[styles.caseCard, { backgroundColor: '#EEF2FF' }]}>
                <View style={styles.caseHeader}>
                  <View style={styles.caseIconBox}>
                    <FileText size={24} color="#6366F1" />
                  </View>
                  <Text style={styles.caseNumber}>24</Text>
                </View>
                <Text style={styles.caseTitle}>Active Cases</Text>
                <Text style={styles.caseSubtitle}>Currently investigating</Text>
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '65%', backgroundColor: '#6366F1' }]} />
                  </View>
                  <Text style={styles.progressLabel}>65% progress</Text>
                </View>
              </View>

              <View style={[styles.caseCard, { backgroundColor: '#FEF2F2' }]}>
                <View style={styles.caseHeader}>
                  <View style={styles.caseIconBox}>
                    <Target size={24} color="#EF4444" />
                  </View>
                  <Text style={styles.caseNumber}>8</Text>
                </View>
                <Text style={styles.caseTitle}>Resolved Today</Text>
                <Text style={styles.caseSubtitle}>Daily achievement</Text>
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '100%', backgroundColor: '#10B981' }]} />
                  </View>
                  <Text style={styles.progressLabel}>Target achieved</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Professional Tools */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Tools</Text>
            <View style={styles.toolsGrid}>
              {[
                { icon: Search, title: 'Search', color: '#10B981', bg: '#ECFDF5' },
                { icon: Target, title: 'Patrol', color: '#F59E0B', bg: '#FEF3C7' },
                { icon: Briefcase, title: 'Evidence', color: '#3B82F6', bg: '#EFF6FF' },
                { icon: Users, title: 'Team', color: '#EC4899', bg: '#FDF2F8' },
              ].map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <TouchableOpacity key={idx} style={styles.toolCard} activeOpacity={0.7}>
                    <View style={[styles.toolIcon, { backgroundColor: tool.bg }]}>
                      <Icon size={24} color={tool.color} />
                    </View>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Today's Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleIcon}>
                <Clock size={28} color="#6366F1" />
              </View>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleTitle}>Day Shift</Text>
                <Text style={styles.scheduleTime}>08:00 AM - 08:00 PM</Text>
                <View style={styles.scheduleDetails}>
                  <View style={styles.scheduleRow}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.scheduleText}>Sector 5 Police Station</Text>
                  </View>
                  <View style={styles.scheduleRow}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.scheduleText}>Patrol Route: A-5 to B-7</Text>
                  </View>
                </View>
              </View>
              <View style={styles.scheduleStatus}>
                <View style={styles.activeDot} />
                <Text style={styles.activeLabel}>Active</Text>
              </View>
            </View>
          </View>

          {/* Recent Cases */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Cases</Text>
            <View style={styles.recentCases}>
              {[
                { icon: FileText, title: 'Theft Investigation', fir: 'FIR/2024/001234', location: 'MG Road • 2 hours ago', color: '#EF4444', bg: '#FEF2F2', priority: 'High' },
                { icon: Shield, title: 'Accident Report', fir: 'FIR/2024/001235', location: 'Brigade Road • 4 hours ago', color: '#10B981', bg: '#ECFDF5' },
                { icon: AlertTriangle, title: 'Fraud Investigation', fir: 'FIR/2024/001236', location: 'Koramangala • 6 hours ago', color: '#3B82F6', bg: '#EFF6FF' },
              ].map((caseItem, idx) => {
                const Icon = caseItem.icon;
                return (
                  <TouchableOpacity key={idx} style={styles.recentCaseCard} activeOpacity={0.7}>
                    <View style={[styles.recentCaseIcon, { backgroundColor: caseItem.bg }]}>
                      <Icon size={22} color={caseItem.color} />
                    </View>
                    <View style={styles.recentCaseContent}>
                      <Text style={styles.recentCaseTitle}>{caseItem.title}</Text>
                      <Text style={styles.recentCaseFir}>{caseItem.fir}</Text>
                      <Text style={styles.recentCaseLocation}>{caseItem.location}</Text>
                    </View>
                    {caseItem.priority && (
                      <View style={styles.priorityBadge}>
                        <Text style={styles.priorityText}>{caseItem.priority}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
      
      <SlidingMenu 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        userRole="officer"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  badgeIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  switchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  switchTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  switchSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  mainContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 20,
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  performanceTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  performanceSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  scoreContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  crownIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
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
    color: '#111827',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  actionSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  caseGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  caseCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caseNumber: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  caseTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  caseSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  progressSection: {
    gap: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  toolCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scheduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  scheduleTime: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 2,
  },
  scheduleDetails: {
    marginTop: 8,
    gap: 6,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  scheduleStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginBottom: 4,
  },
  activeLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  recentCases: {
    gap: 12,
  },
  recentCaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentCaseIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  recentCaseContent: {
    flex: 1,
  },
  recentCaseTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  recentCaseFir: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  recentCaseLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  priorityBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 100,
  },
});