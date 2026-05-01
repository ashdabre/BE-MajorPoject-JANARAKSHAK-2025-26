import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Crown, 
  Users, 
  Sparkles,
  X,
  ChevronRight,
  Brain,
  Shield,
  Activity,
  Zap,
  Check
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

type Officer = {
  id: string;
  name: string;
  rank: string;
  currentCases: number;
  successRate: number;
  specialization: string[];
  availability: 'available' | 'busy' | 'unavailable';
  avgResolutionTime: string;
};

export default function SHOAnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ];

  const performanceData = [
    { 
      metric: 'FIRs Registered', 
      value: 156, 
      trend: 'up', 
      percentage: 12, 
      target: 140,
      color: ['#8B5CF6', '#A78BFA'],
      icon: FileText
    },
    { 
      metric: 'Avg Assignment', 
      value: '2.3h', 
      trend: 'down', 
      percentage: 8, 
      target: '3h',
      color: ['#10B981', '#34D399'],
      icon: Clock
    },
    { 
      metric: 'Clearance Rate', 
      value: '89%', 
      trend: 'up', 
      percentage: 5, 
      target: '85%',
      color: ['#F59E0B', '#FBBF24'],
      icon: CheckCircle
    },
    { 
      metric: 'Officer Utilization', 
      value: '92%', 
      trend: 'up', 
      percentage: 3, 
      target: '90%',
      color: ['#3B82F6', '#60A5FA'],
      icon: Users
    }
  ];

  const availableOfficers: Officer[] = [
    {
      id: '1',
      name: 'Inspector Kumar',
      rank: 'Inspector',
      currentCases: 8,
      successRate: 95,
      specialization: ['Theft', 'Burglary'],
      availability: 'available',
      avgResolutionTime: '4.2 days'
    },
    {
      id: '2',
      name: 'SI Sharma',
      rank: 'Sub Inspector',
      currentCases: 12,
      successRate: 89,
      specialization: ['Assault', 'Domestic'],
      availability: 'busy',
      avgResolutionTime: '5.1 days'
    },
    {
      id: '3',
      name: 'Inspector Patel',
      rank: 'Inspector',
      currentCases: 6,
      successRate: 92,
      specialization: ['Theft', 'Fraud'],
      availability: 'available',
      avgResolutionTime: '3.8 days'
    },
    {
      id: '4',
      name: 'Inspector Gupta',
      rank: 'Inspector',
      currentCases: 10,
      successRate: 87,
      specialization: ['Cyber Crime', 'Fraud'],
      availability: 'busy',
      avgResolutionTime: '6.2 days'
    }
  ];

  const escalationAlerts = [
    {
      id: 1,
      caseId: 'FIR/2024/001250',
      type: 'Unassigned Case',
      duration: '6 hours',
      priority: 'Critical',
      description: 'High priority theft case pending assignment',
      caseType: 'Theft',
      aiSuggestion: 'Inspector Kumar (95% match)',
      suggestedOfficer: availableOfficers[0],
      color: '#DC2626'
    },
    {
      id: 2,
      caseId: 'FIR/2024/001248',
      type: 'Inactive Investigation',
      duration: '3 days',
      priority: 'High',
      description: 'No progress updates in 72 hours',
      caseType: 'Assault',
      aiSuggestion: 'Requires immediate attention',
      color: '#EA580C'
    },
    {
      id: 3,
      caseId: 'FIR/2024/001245',
      type: 'Court Deadline',
      duration: '2 days left',
      priority: 'Medium',
      description: 'Chargesheet submission deadline approaching',
      caseType: 'Fraud',
      aiSuggestion: 'Consider CO escalation',
      color: '#F59E0B'
    }
  ];

  const monthlyReport = {
    totalFIRs: 156,
    resolved: 139,
    pending: 17,
    clearanceRate: 89,
    officerPerformance: [
      { name: 'Inspector Kumar', cases: 24, rate: 95, trend: 'up' },
      { name: 'SI Sharma', cases: 18, rate: 89, trend: 'stable' },
      { name: 'Inspector Patel', cases: 16, rate: 92, trend: 'up' }
    ]
  };

  const handleAssignOfficer = (officer: Officer) => {
    setShowOfficerModal(false);
    Alert.alert(
      'Officer Assigned Successfully',
      `${officer.name} has been assigned to case ${selectedAlert?.caseId}.\n\nThe officer will be notified immediately and case tracking has begun.`,
      [
        {
          text: 'View Case Details',
          onPress: () => console.log('View details')
        },
        {
          text: 'OK',
          style: 'default'
        }
      ]
    );
  };

  const handleConfirmEscalation = () => {
    setShowEscalateModal(false);
    Alert.alert(
      'Case Escalated to CO',
      `Case ${selectedAlert?.caseId} has been successfully escalated to the Commanding Officer.\n\nPriority: ${selectedAlert?.priority}\nReason: ${selectedAlert?.type}\n\nThe CO will review and provide further instructions.`,
      [
        {
          text: 'Track Escalation',
          onPress: () => console.log('Track escalation')
        },
        {
          text: 'OK',
          style: 'default'
        }
      ]
    );
  };

  const OfficerSelectionModal = () => (
    <Modal
      visible={showOfficerModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowOfficerModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Assign Officer</Text>
              <Text style={styles.modalSubtitle}>{selectedAlert?.caseId}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowOfficerModal(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          {selectedAlert?.aiSuggestion && (
            <View style={styles.aiSuggestionBox}>
              <View style={styles.aiHeader}>
                <Brain size={18} color="#8B5CF6" />
                <Text style={styles.aiTitle}>AI Recommendation</Text>
              </View>
              <Text style={styles.aiText}>{selectedAlert.aiSuggestion}</Text>
              {selectedAlert.suggestedOfficer && (
                <Text style={styles.aiReason}>
                  Based on case type, officer specialization, and current workload
                </Text>
              )}
            </View>
          )}

          <ScrollView style={styles.officersList}>
            {availableOfficers.map((officer) => {
              const isRecommended = officer.id === selectedAlert?.suggestedOfficer?.id;
              return (
                <View
                  key={officer.id}
                  style={[styles.officerCard, isRecommended && styles.recommendedOfficer]}
                >
                  {isRecommended && (
                    <View style={styles.recommendedBadge}>
                      <Sparkles size={12} color="#ffffff" />
                      <Text style={styles.recommendedText}>AI Recommended</Text>
                    </View>
                  )}
                  
                  <View style={styles.officerHeader}>
                    <View style={styles.officerInfo}>
                      <Text style={styles.officerName}>{officer.name}</Text>
                      <Text style={styles.officerRank}>{officer.rank}</Text>
                    </View>
                    <View style={[
                      styles.availabilityBadge,
                      { backgroundColor: officer.availability === 'available' ? '#10B981' : '#F59E0B' }
                    ]}>
                      <Text style={styles.availabilityText}>
                        {officer.availability === 'available' ? 'Available' : 'Busy'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.officerStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{officer.currentCases}</Text>
                      <Text style={styles.statLabel}>Active Cases</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{officer.successRate}%</Text>
                      <Text style={styles.statLabel}>Success Rate</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{officer.avgResolutionTime}</Text>
                      <Text style={styles.statLabel}>Avg Time</Text>
                    </View>
                  </View>

                  <View style={styles.specializationRow}>
                    {officer.specialization.map((spec, idx) => (
                      <View key={idx} style={styles.specBadge}>
                        <Text style={styles.specText}>{spec}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity 
                    style={styles.assignButton}
                    onPress={() => handleAssignOfficer(officer)}
                  >
                    <Text style={styles.assignButtonText}>Assign Case</Text>
                    <ChevronRight size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const EscalateModal = () => (
    <Modal
      visible={showEscalateModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEscalateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.escalateModalContainer}>
          <View style={styles.escalateHeader}>
            <Shield size={32} color="#DC2626" />
            <Text style={styles.escalateTitle}>Escalate to CO</Text>
            <Text style={styles.escalateSubtitle}>
              Forward case to Commanding Officer
            </Text>
          </View>

          <View style={styles.escalateDetails}>
            <View style={styles.escalateRow}>
              <Text style={styles.escalateLabel}>Case ID:</Text>
              <Text style={styles.escalateValue}>{selectedAlert?.caseId}</Text>
            </View>
            <View style={styles.escalateRow}>
              <Text style={styles.escalateLabel}>Priority:</Text>
              <Text style={[styles.escalateValue, { color: selectedAlert?.color }]}>
                {selectedAlert?.priority}
              </Text>
            </View>
            <View style={styles.escalateRow}>
              <Text style={styles.escalateLabel}>Pending Duration:</Text>
              <Text style={styles.escalateValue}>{selectedAlert?.duration}</Text>
            </View>
            <View style={styles.escalateRow}>
              <Text style={styles.escalateLabel}>Type:</Text>
              <Text style={styles.escalateValue}>{selectedAlert?.type}</Text>
            </View>
          </View>

          <View style={styles.aiWarning}>
            <Brain size={18} color="#F59E0B" />
            <Text style={styles.aiWarningText}>
              AI suggests CO escalation due to case complexity and time sensitivity
            </Text>
          </View>

          <View style={styles.escalateActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEscalateModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmEscalateButton}
              onPress={handleConfirmEscalation}
            >
              <Check size={18} color="#ffffff" />
              <Text style={styles.confirmEscalateText}>Confirm Escalation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Performance Analytics</Text>
            <Text style={styles.subtitle}>Real-time insights & AI recommendations</Text>
          </View>
          <View style={styles.headerIconGlow}>
            <BarChart3 size={24} color="#ffffff" />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.periodSelector}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.selectedPeriod
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.id && styles.selectedPeriodText
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Metrics with Gradient Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.metricsGrid}>
            {performanceData.map((metric, index) => {
              const MetricIcon = metric.icon;
              return (
                <View key={index} style={styles.metricCardContainer}>
                  <LinearGradient
                    colors={metric.color}
                    style={styles.metricCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.metricIconContainer}>
                      <MetricIcon size={20} color="#ffffff" />
                    </View>
                    
                    <View style={styles.metricValueContainer}>
                      <Text style={styles.metricValue}>{metric.value}</Text>
                      <View style={styles.trendContainer}>
                        {metric.trend === 'up' ? (
                          <TrendingUp size={16} color="#ffffff" />
                        ) : (
                          <TrendingDown size={16} color="#ffffff" />
                        )}
                        <Text style={styles.trendText}>{metric.percentage}%</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.metricLabel}>{metric.metric}</Text>
                    <Text style={styles.targetLabel}>Target: {metric.target}</Text>
                  </LinearGradient>
                </View>
              );
            })}
          </View>
        </View>

        {/* Enhanced Escalation Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Escalation Alerts</Text>
            <View style={styles.alertsBadge}>
              <Activity size={14} color="#ffffff" />
              <Text style={styles.alertsCount}>{escalationAlerts.length}</Text>
            </View>
          </View>
          
          <View style={styles.alertsList}>
            {escalationAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertCardHeader}>
                  <View style={styles.alertLeft}>
                    <Text style={styles.alertCaseId}>{alert.caseId}</Text>
                    <View style={styles.alertTypeBadge}>
                      <AlertTriangle size={12} color={alert.color} />
                      <Text style={[styles.alertType, { color: alert.color }]}>
                        {alert.type}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: alert.color }]}>
                    <Text style={styles.priorityText}>{alert.priority}</Text>
                  </View>
                </View>

                <Text style={styles.alertDescription}>{alert.description}</Text>
                
                <View style={styles.alertMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color="#64748B" />
                    <Text style={styles.metaText}>{alert.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <FileText size={12} color="#64748B" />
                    <Text style={styles.metaText}>{alert.caseType}</Text>
                  </View>
                </View>

                {alert.aiSuggestion && (
                  <View style={styles.aiSuggestionInline}>
                    <Sparkles size={14} color="#8B5CF6" />
                    <Text style={styles.aiSuggestionText}>{alert.aiSuggestion}</Text>
                  </View>
                )}

                <View style={styles.alertActions}>
                  <TouchableOpacity 
                    style={styles.alertActionButton}
                    onPress={() => {
                      setSelectedAlert(alert);
                      setShowOfficerModal(true);
                    }}
                  >
                    <Users size={16} color="#8B5CF6" />
                    <Text style={styles.alertActionText}>Assign Officer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.escalateButton}
                    onPress={() => {
                      setSelectedAlert(alert);
                      setShowEscalateModal(true);
                    }}
                  >
                    <Zap size={16} color="#ffffff" />
                    <Text style={styles.escalateText}>Escalate to CO</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Enhanced Monthly Report */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Performance</Text>
          
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
            style={styles.reportCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.reportHeader}>
              <View>
                <Text style={styles.reportTitle}>January 2024</Text>
                <Text style={styles.reportSubtitle}>Station-wide analytics</Text>
              </View>
              <View style={styles.reportIconContainer}>
                <Crown size={24} color="#FFD700" />
              </View>
            </View>
            
            <View style={styles.reportMetrics}>
              <View style={styles.reportMetric}>
                <Text style={styles.reportMetricValue}>{monthlyReport.totalFIRs}</Text>
                <Text style={styles.reportMetricLabel}>Total FIRs</Text>
              </View>
              <View style={styles.reportDivider} />
              <View style={styles.reportMetric}>
                <Text style={styles.reportMetricValue}>{monthlyReport.resolved}</Text>
                <Text style={styles.reportMetricLabel}>Resolved</Text>
              </View>
              <View style={styles.reportDivider} />
              <View style={styles.reportMetric}>
                <Text style={styles.reportMetricValue}>{monthlyReport.clearanceRate}%</Text>
                <Text style={styles.reportMetricLabel}>Clearance</Text>
              </View>
            </View>
            
            <View style={styles.topPerformers}>
              <View style={styles.topPerformersHeader}>
                <Text style={styles.topPerformersTitle}>🏆 Top Performers</Text>
              </View>
              {monthlyReport.officerPerformance.map((officer, index) => (
                <View key={index} style={styles.performerRow}>
                  <View style={styles.performerRank}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.performerInfo}>
                    <Text style={styles.performerName}>{officer.name}</Text>
                    <Text style={styles.performerStats}>
                      {officer.cases} cases • {officer.rate}% success
                    </Text>
                  </View>
                  {officer.trend === 'up' && (
                    <TrendingUp size={16} color="#10B981" />
                  )}
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <OfficerSelectionModal />
      <EscalateModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  headerIconGlow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedPeriod: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedPeriodText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  alertsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  alertsCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCardContainer: {
    width: (width - 56) / 2,
  },
  metricCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  targetLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  alertsList: {
    gap: 12,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertLeft: {
    flex: 1,
  },
  alertCaseId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  alertTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertType: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  alertDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  alertMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  aiSuggestionInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F0FF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  aiSuggestionText: {
    fontSize: 12,
    color: '#7C3AED',
    flex: 1,
    fontWeight: '500',
  },
  alertActions: {
    flexDirection: 'row',
    gap: 10,
  },
  alertActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F0FF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  alertActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  escalateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  escalateText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reportCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reportSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  reportDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  reportMetric: {
    alignItems: 'center',
  },
  reportMetricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reportMetricLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  topPerformers: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  topPerformersHeader: {
    marginBottom: 12,
  },
  topPerformersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  performerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  performerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  performerStats: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  aiSuggestionBox: {
    margin: 20,
    backgroundColor: '#F3F0FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  aiText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  aiReason: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  officersList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  officerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recommendedOfficer: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
    backgroundColor: '#F3F0FF',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  officerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  officerInfo: {
    flex: 1,
  },
  officerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  officerRank: {
    fontSize: 12,
    color: '#64748B',
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  officerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  specializationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  specBadge: {
    backgroundColor: '#DDD6FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  specText: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  assignButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  escalateModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    margin: 20,
    padding: 24,
  },
  escalateHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  escalateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  escalateSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  escalateDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  escalateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  escalateLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  escalateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  aiWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  aiWarningText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  escalateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmEscalateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  confirmEscalateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 40,
  },
});