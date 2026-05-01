import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, FileText, Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Settings, Filter, MoveVertical as MoreVertical } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming, interpolate } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'fir_update',
      title: 'FIR Status Updated',
      message: 'Your FIR #FIR/2024/001234 has been updated. Investigation is in progress.',
      time: '2 minutes ago',
      read: false,
      priority: 'high',
      icon: FileText,
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FF8E8E']
    },
    {
      id: 2,
      type: 'safety_alert',
      title: 'Safety Alert',
      message: 'High crime activity reported in your area. Please stay alert.',
      time: '1 hour ago',
      read: false,
      priority: 'critical',
      icon: AlertTriangle,
      color: '#F56565',
      gradient: ['#F56565', '#FC8181']
    },
    {
      id: 3,
      type: 'legal_consultation',
      title: 'Legal Consultation Reminder',
      message: 'Your scheduled legal consultation is tomorrow at 2:00 PM.',
      time: '3 hours ago',
      read: true,
      priority: 'medium',
      icon: Shield,
      color: '#4ECDC4',
      gradient: ['#4ECDC4', '#44A08D']
    },
    {
      id: 4,
      type: 'case_resolved',
      title: 'Case Resolved',
      message: 'Your complaint #RPT/2024/005678 has been successfully resolved.',
      time: '1 day ago',
      read: true,
      priority: 'low',
      icon: CheckCircle,
      color: '#48BB78',
      gradient: ['#48BB78', '#68D391']
    },
    {
      id: 5,
      type: 'system',
      title: 'App Update Available',
      message: 'New features and security improvements are available. Update now.',
      time: '2 days ago',
      read: true,
      priority: 'low',
      icon: Settings,
      color: '#96CEB4',
      gradient: ['#96CEB4', '#A8D5C4']
    }
  ]);

  const fadeInAnimation = useSharedValue(0);

  useEffect(() => {
    fadeInAnimation.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInAnimation.value,
      transform: [
        { translateY: interpolate(fadeInAnimation.value, [0, 1], [30, 0]) }
      ],
    };
  });

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'fir', label: 'FIR Updates', count: notifications.filter(n => n.type === 'fir_update').length },
    { id: 'safety', label: 'Safety', count: notifications.filter(n => n.type === 'safety_alert').length },
  ];

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    if (activeFilter === 'fir') return notification.type === 'fir_update';
    if (activeFilter === 'safety') return notification.type === 'safety_alert';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#F56565';
      case 'high': return '#FF6B6B';
      case 'medium': return '#4ECDC4';
      default: return '#96CEB4';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>Stay updated with latest alerts</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={markAllAsRead}>
              <CheckCircle size={20} color="#4ECDC4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={20} color="#718096" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Card */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.statsCard}
        >
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{notifications.filter(n => !n.read).length}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length}</Text>
              <Text style={styles.statLabel}>Priority</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{notifications.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  activeFilter === filter.id && styles.activeFilterChip
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.activeFilterText
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterBadge,
                  activeFilter === filter.id && styles.activeFilterBadge
                ]}>
                  <Text style={[
                    styles.filterCount,
                    activeFilter === filter.id && styles.activeFilterCount
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notifications List */}
        <Animated.View style={[styles.notificationsList, animatedStyle]}>
          {filteredNotifications.map((notification, index) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard
              ]}
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.8}
            >
              <View style={styles.notificationContent}>
                <View style={styles.notificationLeft}>
                  <LinearGradient
                    colors={notification.gradient}
                    style={styles.notificationIcon}
                  >
                    <notification.icon size={20} color="#ffffff" />
                  </LinearGradient>
                  
                  <View style={styles.notificationInfo}>
                    <View style={styles.notificationHeader}>
                      <Text style={[
                        styles.notificationTitle,
                        !notification.read && styles.unreadTitle
                      ]}>
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View style={[
                          styles.priorityDot,
                          { backgroundColor: getPriorityColor(notification.priority) }
                        ]} />
                      )}
                    </View>
                    
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    
                    <View style={styles.notificationMeta}>
                      <Clock size={12} color="#A0AEC0" />
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: `${getPriorityColor(notification.priority)}20` }
                      ]}>
                        <Text style={[
                          styles.priorityText,
                          { color: getPriorityColor(notification.priority) }
                        ]}>
                          {notification.priority}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={16} color="#A0AEC0" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#E2E8F0', '#F7FAFC']}
              style={styles.emptyIcon}
            >
              <Bell size={48} color="#A0AEC0" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No notifications found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "No notifications match your current filter."}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    borderRadius: 20,
    padding: 16,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filtersContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  activeFilterChip: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#718096',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  filterBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterCount: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#718096',
  },
  activeFilterCount: {
    color: '#ffffff',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2D3748',
    flex: 1,
  },
  unreadTitle: {
    fontFamily: 'Inter-Bold',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#A0AEC0',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
  },
  moreButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});