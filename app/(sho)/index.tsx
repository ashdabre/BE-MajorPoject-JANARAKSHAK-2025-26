import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crown, FileText, Users, BarChart3, Bell, Target, AlertTriangle, CheckCircle, Clock, Star, Award, Menu } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay, interpolate } from 'react-native-reanimated';
import SlidingMenu from '@/components/SlidingMenu';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 24;

export default function SHODashboard() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const headerOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    cardsOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
  }, []);

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
              <Text style={styles.avatarText}>SHO</Text>
              <View style={styles.crownBadge}>
                <Crown size={12} color="#7C3AED" />
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>SHO Rajesh Kumar</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Station Commander • On Duty</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Bell size={22} color="#1F2937" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>8</Text>
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

        <View style={styles.stationCard}>
          <Text style={styles.stationName}>Sector 5 Police Station</Text>
          <Text style={styles.stationDetails}>Managing 45 Officers • 156 Active Cases</Text>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.mainContent, cardsAnimatedStyle]}>
          
          {/* Performance Overview */}
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <View>
                <Text style={styles.performanceTitle}>Station Performance</Text>
                <Text style={styles.performanceSubtitle}>Overall efficiency rating</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreNumber}>92</Text>
                <Text style={styles.scoreLabel}>%</Text>
                <Crown size={16} color="#F59E0B" style={styles.crownIcon} />
              </View>
            </View>
            
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <View style={[styles.metricBox, { backgroundColor: '#FEF2F2' }]}>
                  <Text style={[styles.metricValue, { color: '#EF4444' }]}>156</Text>
                </View>
                <Text style={styles.metricLabel}>Active</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={[styles.metricBox, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.metricValue, { color: '#10B981' }]}>89</Text>
                </View>
                <Text style={styles.metricLabel}>Resolved</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={[styles.metricBox, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.metricValue, { color: '#F59E0B' }]}>23</Text>
                </View>
                <Text style={styles.metricLabel}>Pending</Text>
              </View>
            </View>
          </View>

          {/* Command Center */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Command Center</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionsGrid}>
              {[
                { icon: FileText, title: 'FIR Inbox', subtitle: 'Pending assignments', color: '#EF4444', bg: '#FEF2F2', badge: '12', route: '/(sho)/fir-inbox' },
                { icon: Target, title: 'Assign Cases', subtitle: 'Officer allocation', color: '#10B981', bg: '#ECFDF5', route: '/(sho)/assign-cases' },
                { icon: Users, title: 'Officer Workload', subtitle: 'Team management', color: '#3B82F6', bg: '#EFF6FF', route: '/(sho)/officer-workload' },
                { icon: BarChart3, title: 'Analytics', subtitle: 'Performance insights', color: '#F59E0B', bg: '#FEF3C7', route: '/(sho)/analytics' },
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.actionCard} 
                    activeOpacity={0.7}
                    onPress={() => router.push(action.route)}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                      <Icon size={26} color={action.color} strokeWidth={2} />
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </View>
                    {action.badge ? (
                      <View style={[styles.actionBadge, { backgroundColor: action.color }]}>
                        <Text style={styles.actionBadgeText}>{action.badge}</Text>
                      </View>
                    ) : (
                      <View style={styles.actionArrow}>
                        <Text style={styles.arrowText}>›</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Station Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Station Overview</Text>
            <View style={styles.overviewGrid}>
              <View style={[styles.overviewCard, { backgroundColor: '#F3F0FF' }]}>
                <View style={styles.overviewHeader}>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#FFFFFF' }]}>
                    <FileText size={24} color="#7C3AED" />
                  </View>
                  <Text style={styles.overviewNumber}>156</Text>
                </View>
                <Text style={styles.overviewTitle}>Total Cases</Text>
                <Text style={styles.overviewSubtitle}>This month</Text>
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '78%', backgroundColor: '#7C3AED' }]} />
                  </View>
                  <Text style={styles.progressLabel}>78% resolved</Text>
                </View>
              </View>

              <View style={[styles.overviewCard, { backgroundColor: '#FEF2F2' }]}>
                <View style={styles.overviewHeader}>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#FFFFFF' }]}>
                    <AlertTriangle size={24} color="#EF4444" />
                  </View>
                  <Text style={styles.overviewNumber}>12</Text>
                </View>
                <Text style={styles.overviewTitle}>Urgent Cases</Text>
                <Text style={styles.overviewSubtitle}>Needs attention</Text>
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '25%', backgroundColor: '#EF4444' }]} />
                  </View>
                  <Text style={styles.progressLabel}>25% assigned</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Top Performers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            <View style={styles.performersList}>
              {[
                { name: 'Inspector Kumar', stats: '24 cases • 95% success rate', score: '95', badge: 'Top Performer', color: '#F59E0B', bg: '#FEF3C7', icon: Crown },
                { name: 'SI Sharma', stats: '18 cases • 89% success rate', score: '89', badge: 'Excellent', color: '#10B981', bg: '#ECFDF5', icon: Star },
                { name: 'Inspector Patel', stats: '16 cases • 87% success rate', score: '87', badge: 'Good', color: '#3B82F6', bg: '#EFF6FF', icon: Award },
              ].map((performer, idx) => {
                const Icon = performer.icon;
                return (
                  <TouchableOpacity key={idx} style={styles.performerCard} activeOpacity={0.7}>
                    <View style={[styles.performerIcon, { backgroundColor: performer.bg }]}>
                      <Icon size={22} color={performer.color} />
                    </View>
                    <View style={styles.performerContent}>
                      <Text style={styles.performerName}>{performer.name}</Text>
                      <Text style={styles.performerStats}>{performer.stats}</Text>
                      <Text style={[styles.performerBadge, { color: performer.color }]}>{performer.badge}</Text>
                    </View>
                    <View style={[styles.performerScore, { backgroundColor: performer.bg }]}>
                      <Text style={[styles.scoreValue, { color: performer.color }]}>{performer.score}</Text>
                      <Text style={[styles.scorePercent, { color: performer.color }]}>%</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Recent Alerts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <View style={styles.alertsList}>
              {[
                { icon: AlertTriangle, title: 'Unassigned FIR', subtitle: 'FIR/2024/001245 pending for 2 hours', time: '2 hours ago', color: '#EF4444', bg: '#FEF2F2', badge: 'Urgent' },
                { icon: Clock, title: 'Case Deadline', subtitle: 'Chargesheet due in 2 days', time: '1 hour ago', color: '#F59E0B', bg: '#FEF3C7' },
                { icon: CheckCircle, title: 'Case Resolved', subtitle: 'FIR/2024/001243 successfully closed', time: '3 hours ago', color: '#10B981', bg: '#ECFDF5', check: true },
              ].map((alert, idx) => {
                const Icon = alert.icon;
                return (
                  <TouchableOpacity key={idx} style={styles.alertCard} activeOpacity={0.7}>
                    <View style={[styles.alertIcon, { backgroundColor: alert.bg }]}>
                      <Icon size={22} color={alert.color} />
                    </View>
                    <View style={styles.alertContent}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={styles.alertSubtitle}>{alert.subtitle}</Text>
                      <Text style={styles.alertTime}>{alert.time}</Text>
                    </View>
                    {alert.badge && (
                      <View style={[styles.alertBadge, { backgroundColor: alert.color }]}>
                        <Text style={styles.alertBadgeText}>{alert.badge}</Text>
                      </View>
                    )}
                    {alert.check && (
                      <View style={styles.alertCheck}>
                        <CheckCircle size={16} color={alert.color} />
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
        userRole="sho"
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
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  crownBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
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
  stationCard: {
    backgroundColor: '#F3F0FF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  stationName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#7C3AED',
  },
  stationDetails: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#9333EA',
    marginTop: 4,
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
    color: '#7C3AED',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F0FF',
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
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
  actionBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  actionBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  overviewTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  overviewSubtitle: {
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
  performersList: {
    gap: 12,
  },
  performerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  performerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  performerContent: {
    flex: 1,
  },
  performerName: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  performerStats: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  performerBadge: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
  },
  performerScore: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  scorePercent: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  alertsList: {
    gap: 12,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  alertSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  alertTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  alertBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  alertBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  alertCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});