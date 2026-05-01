import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Users, FileText, Clock, Star, Award, TrendingUp, CheckCircle, AlertTriangle, Crown, Shield } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AssignCasesScreen() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);

  const availableOfficers = [
    {
      id: 'IK001',
      name: 'Inspector Kumar',
      rank: 'Inspector',
      activeCases: 8,
      successRate: 95,
      specialization: 'Theft & Burglary',
      workload: 'Medium',
      availability: 'Available',
      experience: '12 years',
      currentLocation: 'Station',
      performance: 'Excellent',
      recentCases: ['Theft', 'Fraud', 'Assault']
    },
    {
      id: 'SS002',
      name: 'SI Sharma',
      rank: 'Sub Inspector',
      activeCases: 12,
      successRate: 89,
      specialization: 'Cybercrime',
      workload: 'High',
      availability: 'On Patrol',
      experience: '8 years',
      currentLocation: 'MG Road',
      performance: 'Good',
      recentCases: ['Fraud', 'Cybercrime', 'Cheating']
    },
    {
      id: 'IP003',
      name: 'Inspector Patel',
      rank: 'Inspector',
      activeCases: 6,
      successRate: 92,
      specialization: 'Domestic Violence',
      workload: 'Low',
      availability: 'Available',
      experience: '15 years',
      currentLocation: 'Station',
      performance: 'Excellent',
      recentCases: ['Domestic Violence', 'Harassment', 'Assault']
    },
    {
      id: 'IG004',
      name: 'Inspector Gupta',
      rank: 'Inspector',
      activeCases: 10,
      successRate: 87,
      specialization: 'Traffic & Accidents',
      workload: 'Medium',
      availability: 'Court Duty',
      experience: '10 years',
      currentLocation: 'District Court',
      performance: 'Good',
      recentCases: ['Accident', 'Traffic Violation', 'Hit & Run']
    }
  ];

  const pendingCases = [
    {
      id: 'FIR/2024/001245',
      type: 'Theft',
      urgency: 'High',
      complainant: 'Rahul Sharma',
      location: 'MG Road',
      timeAgo: '2 hours ago',
      aiRecommendation: 'Inspector Kumar',
      matchScore: 95,
      reason: 'Specializes in theft cases, low workload'
    },
    {
      id: 'FIR/2024/001246',
      type: 'Fraud',
      urgency: 'Critical',
      complainant: 'Priya Patel',
      location: 'Brigade Road',
      timeAgo: '30 minutes ago',
      aiRecommendation: 'SI Sharma',
      matchScore: 92,
      reason: 'Cybercrime specialist, high success rate'
    },
    {
      id: 'FIR/2024/001247',
      type: 'Domestic Violence',
      urgency: 'Critical',
      complainant: 'Sunita Reddy',
      location: 'Whitefield',
      timeAgo: '45 minutes ago',
      aiRecommendation: 'Inspector Patel',
      matchScore: 98,
      reason: 'Domestic violence specialist, available'
    }
  ];

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'High': return ['#EF4444', '#DC2626'];
      case 'Medium': return ['#F59E0B', '#D97706'];
      default: return ['#10B981', '#059669'];
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return '#10B981';
      case 'On Patrol': return '#F59E0B';
      case 'Court Duty': return '#3B82F6';
      default: return '#EF4444';
    }
  };

  const handleAssignCase = () => {
    if (selectedCase && selectedOfficer) {
      const officer = availableOfficers.find(o => o.id === selectedOfficer);
      Alert.alert(
        'Confirm Assignment',
        `Assign case ${selectedCase} to ${officer?.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Assign', 
            onPress: () => {
              Alert.alert('Success', `Case assigned successfully to ${officer?.name}`);
              setSelectedCase(null);
              setSelectedOfficer(null);
            }
          }
        ]
      );
    } else {
      Alert.alert('Selection Required', 'Please select both a case and an officer');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#5B21B6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Assign Cases</Text>
            <Text style={styles.subtitle}>Smart case allocation system</Text>
          </View>
          <View style={styles.headerIcon}>
            <Target size={24} color="#ffffff" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pending Cases Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Cases</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{pendingCases.length}</Text>
            </View>
          </View>
          
          <View style={styles.casesList}>
            {pendingCases.map((case_) => (
              <TouchableOpacity
                key={case_.id}
                style={[
                  styles.caseCard,
                  selectedCase === case_.id && styles.selectedCaseCard
                ]}
                onPress={() => setSelectedCase(case_.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={selectedCase === case_.id ? ['#F3F0FF', '#E0E7FF'] : ['#ffffff', '#fefbff']}
                  style={styles.caseGradient}
                >
                  <View style={styles.caseHeader}>
                    <View style={styles.caseInfo}>
                      <Text style={styles.caseId}>{case_.id}</Text>
                      <Text style={styles.caseType}>{case_.type}</Text>
                      <Text style={styles.caseLocation}>{case_.location}</Text>
                    </View>
                    <View style={styles.caseMeta}>
                      <LinearGradient
                        colors={case_.urgency === 'Critical' ? ['#DC2626', '#EF4444'] : ['#EA580C', '#F97316']}
                        style={styles.urgencyBadge}
                      >
                        <Text style={styles.urgencyText}>{case_.urgency}</Text>
                      </LinearGradient>
                      <Text style={styles.timeAgo}>{case_.timeAgo}</Text>
                    </View>
                  </View>

                  <View style={styles.aiRecommendationCard}>
                    <View style={styles.aiHeader}>
                      <Star size={16} color="#7C3AED" />
                      <Text style={styles.aiTitle}>AI Recommendation</Text>
                      <View style={styles.matchScore}>
                        <Text style={styles.matchText}>{case_.matchScore}%</Text>
                      </View>
                    </View>
                    <Text style={styles.recommendedOfficer}>{case_.aiRecommendation}</Text>
                    <Text style={styles.aiReason}>{case_.reason}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Available Officers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Officers</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{availableOfficers.length}</Text>
            </View>
          </View>
          
          <View style={styles.officersList}>
            {availableOfficers.map((officer) => (
              <TouchableOpacity
                key={officer.id}
                style={[
                  styles.officerCard,
                  selectedOfficer === officer.id && styles.selectedOfficerCard
                ]}
                onPress={() => setSelectedOfficer(officer.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={selectedOfficer === officer.id ? ['#F3F0FF', '#E0E7FF'] : ['#ffffff', '#fefbff']}
                  style={styles.officerGradient}
                >
                  <View style={styles.officerHeader}>
                    <View style={styles.officerInfo}>
                      <Text style={styles.officerName}>{officer.name}</Text>
                      <Text style={styles.officerRank}>{officer.rank} • {officer.experience}</Text>
                      <Text style={styles.officerSpecialization}>{officer.specialization}</Text>
                    </View>
                    <View style={styles.officerMeta}>
                      <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: getAvailabilityColor(officer.availability) }
                      ]}>
                        <Text style={styles.availabilityText}>{officer.availability}</Text>
                      </View>
                      <Text style={styles.officerLocation}>{officer.currentLocation}</Text>
                    </View>
                  </View>

                  <View style={styles.officerStats}>
                    <View style={styles.statCard}>
                      <LinearGradient colors={getWorkloadColor(officer.workload)} style={styles.statIcon}>
                        <FileText size={16} color="#ffffff" />
                      </LinearGradient>
                      <Text style={styles.statValue}>{officer.activeCases}</Text>
                      <Text style={styles.statLabel}>Active Cases</Text>
                    </View>
                    
                    <View style={styles.statCard}>
                      <LinearGradient colors={['#10B981', '#059669']} style={styles.statIcon}>
                        <TrendingUp size={16} color="#ffffff" />
                      </LinearGradient>
                      <Text style={styles.statValue}>{officer.successRate}%</Text>
                      <Text style={styles.statLabel}>Success Rate</Text>
                    </View>
                    
                    <View style={styles.statCard}>
                      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.statIcon}>
                        <Award size={16} color="#ffffff" />
                      </LinearGradient>
                      <Text style={styles.statValue}>{officer.performance}</Text>
                      <Text style={styles.statLabel}>Performance</Text>
                    </View>
                  </View>

                  <View style={styles.recentCasesSection}>
                    <Text style={styles.recentCasesTitle}>Recent Case Types</Text>
                    <View style={styles.recentCasesTags}>
                      {officer.recentCases.map((caseType, index) => (
                        <View key={index} style={styles.caseTag}>
                          <Text style={styles.caseTagText}>{caseType}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Assignment Action */}
        {selectedCase && selectedOfficer && (
          <View style={styles.assignmentSection}>
            <TouchableOpacity style={styles.assignmentButton} onPress={handleAssignCase} activeOpacity={0.8}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.assignmentGradient}
              >
                <Target size={20} color="#ffffff" />
                <Text style={styles.assignmentText}>
                  Assign {selectedCase} to {availableOfficers.find(o => o.id === selectedOfficer)?.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  sectionBadge: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  casesList: {
    gap: 16,
  },
  caseCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCaseCard: {
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
  },
  caseGradient: {
    padding: 20,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  caseInfo: {
    flex: 1,
  },
  caseId: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  caseType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
    marginTop: 4,
  },
  caseLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  caseMeta: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  aiRecommendationCard: {
    backgroundColor: '#F3F0FF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  aiTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#7C3AED',
  },
  matchScore: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  recommendedOfficer: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#5B21B6',
    marginBottom: 4,
  },
  aiReason: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7C3AED',
  },
  officersList: {
    gap: 16,
  },
  officerCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedOfficerCard: {
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
  },
  officerGradient: {
    padding: 20,
  },
  officerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  officerInfo: {
    flex: 1,
  },
  officerName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  officerRank: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
    marginTop: 4,
  },
  officerSpecialization: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  officerMeta: {
    alignItems: 'flex-end',
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  officerLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  officerStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  recentCasesSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  recentCasesTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  recentCasesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  caseTag: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  caseTagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#3730A3',
  },
  assignmentSection: {
    marginBottom: 32,
  },
  assignmentButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  assignmentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  assignmentText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});