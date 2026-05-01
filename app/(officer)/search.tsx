import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, TrendingUp, Clock, FileText, Users, Shield, Filter, X, ChevronRight, ChartBar as BarChart3, Calendar } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming, interpolate } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OfficerSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const searchAnimation = useSharedValue(0);
  const filterAnimation = useSharedValue(0);

  useEffect(() => {
    searchAnimation.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  useEffect(() => {
    filterAnimation.value = withTiming(showFilters ? 1 : 0, { duration: 300 });
  }, [showFilters]);

  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: searchAnimation.value,
      transform: [
        { translateY: interpolate(searchAnimation.value, [0, 1], [50, 0]) }
      ],
    };
  });

  const filterAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: filterAnimation.value,
      transform: [
        { translateY: interpolate(filterAnimation.value, [0, 1], [-20, 0]) }
      ],
    };
  });

  const trendingSearches = [
    'Case Status Check',
    'Asset Inventory',
    'Shift Schedule',
    'Crime Analytics',
    'Evidence Management',
    'Patrol Routes',
    'Officer Directory',
    'Performance Reports'
  ];

  const recentSearches = [
    { query: 'FIR/2024/001234', type: 'Case', time: '1 hour ago' },
    { query: 'Vehicle Asset VEH-001', type: 'Asset', time: '2 hours ago' },
    { query: 'Crime Statistics Report', type: 'Analytics', time: '1 day ago' },
    { query: 'Officer Schedule', type: 'Schedule', time: '2 days ago' },
  ];

  const quickActions = [
    { title: 'Search Cases', icon: FileText, color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8E8E'] },
    { title: 'Find Assets', icon: Shield, color: '#4ECDC4', gradient: ['#4ECDC4', '#44A08D'] },
    { title: 'View Analytics', icon: BarChart3, color: '#96CEB4', gradient: ['#96CEB4', '#A8D5C4'] },
    { title: 'Check Schedule', icon: Calendar, color: '#45B7D1', gradient: ['#45B7D1', '#6BC5E0'] },
  ];

  const filters = [
    { id: 'all', label: 'All', count: 234 },
    { id: 'cases', label: 'Cases', count: 89 },
    { id: 'assets', label: 'Assets', count: 67 },
    { id: 'officers', label: 'Officers', count: 45 },
    { id: 'reports', label: 'Reports', count: 33 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Officer Search</Text>
        <Text style={styles.subtitle}>Find cases, assets, and resources</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <Animated.View style={[styles.searchSection, searchAnimatedStyle]}>
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.searchContainer}
          >
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#718096" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search cases, assets, officers..."
                placeholderTextColor="#A0AEC0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={20} color="#718096" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Filters */}
          {showFilters && (
            <Animated.View style={[styles.filtersContainer, filterAnimatedStyle]}>
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
                    <Text style={[
                      styles.filterCount,
                      activeFilter === filter.id && styles.activeFilterCount
                    ]}>
                      {filter.count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard}>
                <LinearGradient
                  colors={action.gradient}
                  style={styles.quickActionGradient}
                >
                  <action.icon size={24} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <ChevronRight size={16} color="#C0C0C0" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Trending Searches</Text>
          </View>
          <View style={styles.trendingContainer}>
            {trendingSearches.map((search, index) => (
              <TouchableOpacity key={index} style={styles.trendingItem}>
                <Text style={styles.trendingText}>{search}</Text>
                <TrendingUp size={14} color="#FF6B6B" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#96CEB4" />
            <Text style={styles.sectionTitle}>Recent Searches</Text>
          </View>
          <View style={styles.recentList}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity key={index} style={styles.recentItem}>
                <View style={styles.recentIconContainer}>
                  <LinearGradient
                    colors={['#45B7D1', '#6BC5E0']}
                    style={styles.recentIcon}
                  >
                    <Search size={16} color="#ffffff" />
                  </LinearGradient>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentQuery}>{search.query}</Text>
                  <View style={styles.recentMeta}>
                    <Text style={styles.recentType}>{search.type}</Text>
                    <Text style={styles.recentTime}>{search.time}</Text>
                  </View>
                </View>
                <ChevronRight size={16} color="#C0C0C0" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Officer Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Officer Resources</Text>
          <View style={styles.categoriesGrid}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.categoryCard}
            >
              <FileText size={24} color="#ffffff" />
              <Text style={styles.categoryTitle}>Case Management</Text>
              <Text style={styles.categorySubtitle}>Search & Manage Cases</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.categoryCard}
            >
              <Shield size={24} color="#ffffff" />
              <Text style={styles.categoryTitle}>Asset Tracking</Text>
              <Text style={styles.categorySubtitle}>Equipment & Inventory</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.categoryCard}
            >
              <BarChart3 size={24} color="#ffffff" />
              <Text style={styles.categoryTitle}>Analytics</Text>
              <Text style={styles.categorySubtitle}>Crime Data & Reports</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.categoryCard}
            >
              <Users size={24} color="#ffffff" />
              <Text style={styles.categoryTitle}>Officer Directory</Text>
              <Text style={styles.categorySubtitle}>Contact & Schedules</Text>
            </LinearGradient>
          </View>
        </View>

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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2D3748',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersContainer: {
    marginTop: 16,
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
    gap: 6,
  },
  activeFilterChip: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#718096',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  filterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#A0AEC0',
  },
  activeFilterCount: {
    color: '#ffffff',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2D3748',
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  quickActionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2D3748',
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4A5568',
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentIconContainer: {
    marginRight: 12,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentInfo: {
    flex: 1,
  },
  recentQuery: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2D3748',
    marginBottom: 4,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF6B6B',
  },
  recentTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#A0AEC0',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 56) / 2,
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
  categorySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});