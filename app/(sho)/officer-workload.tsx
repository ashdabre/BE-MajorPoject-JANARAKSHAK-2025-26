import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Linking, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, FileText, CheckCircle, Clock, TrendingUp, Star, Award, Crown, Target, AlertTriangle, Calendar, MapPin, ChevronRight, Eye, MessageCircle, X, Send, UserPlus, AlertCircle, Check, XCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type Officer = {
  id: string;
  name: string;
  rank: string;
  activeCases: number;
  closedCases: number;
  pendingTasks: number;
  successRate: number;
  workloadStatus: string;
  currentLocation: string;
  lastActive: string;
  specialization: string;
  performance: string;
  weeklyTarget: number;
  monthlyResolved: number;
  avgResponseTime: string;
  courtAppearances: number;
  ongoingInvestigations: string[];
  recentActivity: Array<{ action: string; case: string; time: string }>;
  availability: string;
  currentShift: string;
  nextCourtDate: string;
  phoneNumber: string;
};

type IncomingCase = {
  id: string;
  type: string;
  priority: string;
  location: string;
  description: string;
  reportedTime: string;
  assignedOfficer?: string;
};

export default function OfficerWorkloadScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAssignCaseModal, setShowAssignCaseModal] = useState(false);
  const [showCaseListModal, setShowCaseListModal] = useState(false);
  const [currentOfficer, setCurrentOfficer] = useState<Officer | null>(null);
  const [incomingCases, setIncomingCases] = useState<IncomingCase[]>([
    {
      id: 'FIR/2024/001244',
      type: 'Theft',
      priority: 'High',
      location: 'MG Road, Bangalore',
      description: 'Jewelry shop theft, CCTV footage available',
      reportedTime: 'Just now'
    },
    {
      id: 'FIR/2024/001245',
      type: 'Accident',
      priority: 'Medium',
      location: 'Brigade Road Junction',
      description: 'Two-car collision, minor injuries reported',
      reportedTime: '10 mins ago'
    },
    {
      id: 'FIR/2024/001246',
      type: 'Fraud',
      priority: 'High',
      location: 'Koramangala',
      description: 'Online investment fraud, amount: ₹2,00,000',
      reportedTime: '15 mins ago'
    },
    {
      id: 'FIR/2024/001247',
      type: 'Burglary',
      priority: 'Medium',
      location: 'Indiranagar',
      description: 'Residential burglary, forced entry detected',
      reportedTime: '30 mins ago'
    },
    {
      id: 'FIR/2024/001248',
      type: 'Assault',
      priority: 'High',
      location: 'Commercial Street',
      description: 'Public altercation leading to injuries',
      reportedTime: '45 mins ago'
    }
  ]);

  const getPerformanceColor = (performance: string) => {
    switch (performance.toLowerCase()) {
      case 'excellent':
        return ['#10B981', '#059669'];
      case 'good':
        return ['#3B82F6', '#1D4ED8'];
      case 'average':
        return ['#F59E0B', '#D97706'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const getWorkloadColor = (workload: string) => {
    switch (workload.toLowerCase()) {
      case 'low':
        return ['#10B981', '#059669'];
      case 'medium':
        return ['#F59E0B', '#D97706'];
      case 'high':
        return ['#EF4444', '#DC2626'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const getCaseStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#6366F1';
      case 'closed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'success':
        return '#8B5CF6';
      default:
        return '#64748B';
    }
  };

  const getCaseStatusBg = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#EEF2FF';
      case 'closed':
        return '#F0FDF4';
      case 'pending':
        return '#FFF7ED';
      case 'success':
        return '#FAF5FF';
      default:
        return '#F1F5F9';
    }
  };

  const PerformanceIcon = ({ performance, size, color }: { performance: string; size: number; color: string }) => {
    switch (performance.toLowerCase()) {
      case 'excellent':
        return <Crown size={size} color={color} />;
      case 'good':
        return <Star size={size} color={color} />;
      case 'average':
        return <Award size={size} color={color} />;
      default:
        return <Award size={size} color={color} />;
    }
  };

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Quarter' },
  ];

  const officers: Officer[] = [
    {
      id: 'IK001',
      name: 'Inspector Kumar',
      rank: 'Inspector',
      activeCases: 8,
      closedCases: 24,
      pendingTasks: 3,
      successRate: 95,
      workloadStatus: 'Medium',
      currentLocation: 'Station',
      lastActive: '2 min ago',
      specialization: 'Theft & Burglary',
      performance: 'Excellent',
      weeklyTarget: 12,
      monthlyResolved: 89,
      avgResponseTime: '12 min',
      courtAppearances: 2,
      ongoingInvestigations: ['FIR/2024/001234', 'FIR/2024/001238', 'FIR/2024/001241'],
      recentActivity: [
        { action: 'Evidence collected', case: 'FIR/2024/001234', time: '2 hours ago' },
        { action: 'Witness statement recorded', case: 'FIR/2024/001238', time: '4 hours ago' },
        { action: 'Case resolved', case: 'FIR/2024/001230', time: '1 day ago' }
      ],
      availability: 'Available',
      currentShift: 'Day Shift (8 AM - 8 PM)',
      nextCourtDate: '2024-01-18',
      phoneNumber: '+919876543210'
    },
    {
      id: 'SS002',
      name: 'SI Sharma',
      rank: 'Sub Inspector',
      activeCases: 12,
      closedCases: 18,
      pendingTasks: 5,
      successRate: 89,
      workloadStatus: 'High',
      currentLocation: 'MG Road Patrol',
      lastActive: '15 min ago',
      specialization: 'Cybercrime',
      performance: 'Good',
      weeklyTarget: 10,
      monthlyResolved: 67,
      avgResponseTime: '18 min',
      courtAppearances: 1,
      ongoingInvestigations: ['FIR/2024/001235', 'FIR/2024/001239', 'FIR/2024/001242'],
      recentActivity: [
        { action: 'Digital evidence analyzed', case: 'FIR/2024/001235', time: '1 hour ago' },
        { action: 'Suspect interrogated', case: 'FIR/2024/001239', time: '3 hours ago' },
        { action: 'FIR registered', case: 'FIR/2024/001242', time: '6 hours ago' }
      ],
      availability: 'On Duty',
      currentShift: 'Day Shift (8 AM - 8 PM)',
      nextCourtDate: '2024-01-20',
      phoneNumber: '+919876543211'
    },
    {
      id: 'IP003',
      name: 'Inspector Patel',
      rank: 'Inspector',
      activeCases: 6,
      closedCases: 32,
      pendingTasks: 2,
      successRate: 92,
      workloadStatus: 'Low',
      currentLocation: 'Court Duty',
      lastActive: '1 hour ago',
      specialization: 'Domestic Violence',
      performance: 'Excellent',
      weeklyTarget: 8,
      monthlyResolved: 78,
      avgResponseTime: '10 min',
      courtAppearances: 4,
      ongoingInvestigations: ['FIR/2024/001236', 'FIR/2024/001240'],
      recentActivity: [
        { action: 'Court hearing attended', case: 'FIR/2024/001236', time: '2 hours ago' },
        { action: 'Chargesheet filed', case: 'FIR/2024/001240', time: '1 day ago' },
        { action: 'Victim counseling', case: 'FIR/2024/001228', time: '2 days ago' }
      ],
      availability: 'Court Duty',
      currentShift: 'Day Shift (8 AM - 8 PM)',
      nextCourtDate: '2024-01-17',
      phoneNumber: '+919876543212'
    },
    {
      id: 'IG004',
      name: 'Inspector Gupta',
      rank: 'Inspector',
      activeCases: 10,
      closedCases: 21,
      pendingTasks: 4,
      successRate: 87,
      workloadStatus: 'Medium',
      currentLocation: 'Brigade Road',
      lastActive: '30 min ago',
      specialization: 'Traffic & Accidents',
      performance: 'Good',
      weeklyTarget: 10,
      monthlyResolved: 56,
      avgResponseTime: '15 min',
      courtAppearances: 3,
      ongoingInvestigations: ['FIR/2024/001237', 'FIR/2024/001243'],
      recentActivity: [
        { action: 'Accident investigation', case: 'FIR/2024/001237', time: '1 hour ago' },
        { action: 'Traffic violation processed', case: 'FIR/2024/001243', time: '3 hours ago' },
        { action: 'Site inspection completed', case: 'FIR/2024/001229', time: '1 day ago' }
      ],
      availability: 'On Patrol',
      currentShift: 'Day Shift (8 AM - 8 PM)',
      nextCourtDate: '2024-01-19',
      phoneNumber: '+919876543213'
    }
  ];

  const handleAssignCase = (officerId: string) => {
    const officer = officers.find(o => o.id === officerId);
    
    if (officer) {
      setCurrentOfficer(officer);
      
      // Check workload conditions
      if (officer.activeCases > 5 || officer.pendingTasks > 3) {
        Alert.alert(
          'High Workload Alert ⚠️',
          `${officer.name} currently has:\n\n• ${officer.activeCases} active cases\n• ${officer.pendingTasks} pending tasks\n\nOfficer workload may increase. Consider assigning to another officer with lower workload.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Proceed Anyway', 
              onPress: () => {
                setShowCaseListModal(true);
              }
            }
          ]
        );
      } else {
        setShowCaseListModal(true);
      }
    }
  };

  const handleAssignCaseToOfficer = (caseId: string) => {
    if (!currentOfficer) return;

    // Update incoming cases
    const updatedCases = incomingCases.map(case_ => 
      case_.id === caseId 
        ? { ...case_, assignedOfficer: currentOfficer.name }
        : case_
    );

    setIncomingCases(updatedCases.filter(c => c.id !== caseId));
    setShowCaseListModal(false);

    Alert.alert(
      '✅ Case Assigned Successfully',
      `Case ${caseId} has been assigned to ${currentOfficer.name}.\n\n• Officer notified\n• Case details shared\n• Investigation initiated`,
      [{ text: 'OK' }]
    );
  };

  const handleViewDetails = (officerId: string) => {
    setSelectedOfficer(selectedOfficer === officerId ? null : officerId);
  };

  const handleMessage = (officer: Officer) => {
    setCurrentOfficer(officer);
    setShowMessageModal(true);
  };

  const sendInAppMessage = () => {
    setShowMessageModal(false);
    Alert.alert(
      'Message Sent',
      `In-app message sent to ${currentOfficer?.name}.\n\nThe officer will receive a notification.`,
      [{ text: 'OK' }]
    );
  };

  const sendWhatsAppMessage = async () => {
    if (!currentOfficer) return;
    
    const phoneNumber = currentOfficer.phoneNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent('Hello, this is a message from the SHO regarding your assigned cases.');
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        setShowMessageModal(false);
        Alert.alert(
          'Opening WhatsApp',
          `Opening WhatsApp to message ${currentOfficer.name}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'WhatsApp Not Available',
          'WhatsApp is not installed on this device. Sending in-app message instead.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Send In-App', onPress: sendInAppMessage }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not open WhatsApp. Sending in-app message instead.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Send In-App', onPress: sendInAppMessage }
        ]
      );
    }
  };

  const MessageModal = () => (
    <Modal
      visible={showMessageModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMessageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.messageModalContainer}>
          <View style={styles.messageModalHeader}>
            <MessageCircle size={28} color="#F59E0B" />
            <Text style={styles.messageModalTitle}>Send Message</Text>
            <Text style={styles.messageModalSubtitle}>Contact {currentOfficer?.name}</Text>
          </View>

          <View style={styles.officerContactInfo}>
            <Text style={styles.contactInfoLabel}>Officer Details:</Text>
            <Text style={styles.contactInfoText}>{currentOfficer?.rank} - {currentOfficer?.specialization}</Text>
            <Text style={styles.contactInfoText}>Status: {currentOfficer?.availability}</Text>
            <Text style={styles.contactInfoText}>Phone: {currentOfficer?.phoneNumber}</Text>
          </View>

          <Text style={styles.chooseMethodLabel}>Choose messaging method:</Text>

          <TouchableOpacity 
            style={styles.messageOptionButton}
            onPress={sendInAppMessage}
          >
            <View style={styles.messageOptionIcon}>
              <Send size={20} color="#8B5CF6" />
            </View>
            <View style={styles.messageOptionContent}>
              <Text style={styles.messageOptionTitle}>In-App Message</Text>
              <Text style={styles.messageOptionSubtitle}>Send secure internal message</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.messageOptionButton}
            onPress={sendWhatsAppMessage}
          >
            <View style={[styles.messageOptionIcon, { backgroundColor: '#E0F2FE' }]}>
              <MessageCircle size={20} color="#10B981" />
            </View>
            <View style={styles.messageOptionContent}>
              <Text style={styles.messageOptionTitle}>WhatsApp Message</Text>
              <Text style={styles.messageOptionSubtitle}>Send via WhatsApp</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelMessageButton}
            onPress={() => setShowMessageModal(false)}
          >
            <Text style={styles.cancelMessageButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const CaseListModal = () => (
    <Modal
      visible={showCaseListModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCaseListModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.caseListModalContainer}>
          <View style={styles.caseModalHeader}>
            <View style={styles.caseModalHeaderLeft}>
              <UserPlus size={24} color="#6366F1" />
              <Text style={styles.caseModalTitle}>Assign New Case</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCaseListModal(false)}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.officerAssignmentInfo}>
            <Text style={styles.assignmentOfficerName}>
              Assigning to: {currentOfficer?.name}
            </Text>
            <View style={styles.officerWorkloadInfo}>
              <View style={styles.workloadItem}>
                <Text style={styles.workloadLabel}>Active Cases:</Text>
                <Text style={styles.workloadValue}>{currentOfficer?.activeCases}</Text>
              </View>
              <View style={styles.workloadItem}>
                <Text style={styles.workloadLabel}>Pending Tasks:</Text>
                <Text style={styles.workloadValue}>{currentOfficer?.pendingTasks}</Text>
              </View>
            </View>
          </View>

          {currentOfficer && (currentOfficer.activeCases > 5 || currentOfficer.pendingTasks > 3) && (
            <View style={styles.warningCard}>
              <AlertCircle size={20} color="#F59E0B" />
              <Text style={styles.warningText}>
                Officer workload may increase. Consider reassigning existing cases first.
              </Text>
            </View>
          )}

          <Text style={styles.availableCasesTitle}>Available Cases for Assignment</Text>

          {incomingCases.length > 0 ? (
            <FlatList
              data={incomingCases}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.caseListItem}
                  onPress={() => handleAssignCaseToOfficer(item.id)}
                >
                  <View style={styles.caseListItemHeader}>
                    <View style={styles.caseInfo}>
                      <Text style={styles.caseId}>{item.id}</Text>
                      <Text style={styles.caseType}>{item.type}</Text>
                    </View>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: item.priority === 'High' ? '#FEE2E2' : '#FEF3C7' }
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        { color: item.priority === 'High' ? '#DC2626' : '#D97706' }
                      ]}>
                        {item.priority}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.caseDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  
                  <View style={styles.caseLocationRow}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.caseLocation} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                  
                  <View style={styles.caseFooter}>
                    <Text style={styles.reportedTime}>
                      Reported: {item.reportedTime}
                    </Text>
                    <TouchableOpacity 
                      style={styles.assignCaseButton}
                      onPress={() => handleAssignCaseToOfficer(item.id)}
                    >
                      <Text style={styles.assignCaseButtonText}>Assign</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.caseList}
              contentContainerStyle={styles.caseListContent}
            />
          ) : (
            <View style={styles.noCasesContainer}>
              <Check size={48} color="#10B981" />
              <Text style={styles.noCasesText}>All cases assigned!</Text>
              <Text style={styles.noCasesSubtext}>
                All incoming cases have been assigned to officers.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowCaseListModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel Assignment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#4F46E5', '#4338CA']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Officer Workload</Text>
            <Text style={styles.subtitle}>Team performance & case distribution</Text>
          </View>
          <View style={styles.headerIcon}>
            <Users size={24} color="#ffffff" />
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Officers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>36</Text>
            <Text style={styles.statLabel}>Active Cases</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.periodSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        <View style={styles.officersList}>
          {officers.map((officer) => {
            const isExpanded = selectedOfficer === officer.id;

            return (
              <TouchableOpacity key={officer.id} style={styles.officerCard} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#ffffff', '#fefbff']}
                  style={styles.officerGradient}
                >
                  <View style={styles.officerHeader}>
                    <View style={styles.officerInfo}>
                      <View style={styles.officerTitleRow}>
                        <Text style={styles.officerName}>{officer.name}</Text>
                        <LinearGradient
                          colors={getPerformanceColor(officer.performance)}
                          style={styles.performanceBadge}
                        >
                          <PerformanceIcon performance={officer.performance} size={12} color="#ffffff" />
                        </LinearGradient>
                      </View>
                      <Text style={styles.officerRank}>{officer.rank} • {officer.specialization}</Text>
                      <View style={styles.locationRow}>
                        <MapPin size={12} color="#64748B" />
                        <Text style={styles.officerLocation}>{officer.currentLocation}</Text>
                        <Text style={styles.lastActive}>• {officer.lastActive}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Case Status Cards */}
                  <View style={styles.caseStatusGrid}>
                    <TouchableOpacity 
                      style={[styles.caseStatusCard, { backgroundColor: getCaseStatusBg('active') }]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.caseStatusHeader}>
                        <View style={[styles.statusDot, { backgroundColor: getCaseStatusColor('active') }]} />
                        <Text style={styles.caseStatusLabel}>Active</Text>
                      </View>
                      <Text style={styles.caseStatusValue}>{officer.activeCases}</Text>
                      <Text style={styles.caseStatusSubtext}>Ongoing</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.caseStatusCard, { backgroundColor: getCaseStatusBg('closed') }]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.caseStatusHeader}>
                        <View style={[styles.statusDot, { backgroundColor: getCaseStatusColor('closed') }]} />
                        <Text style={styles.caseStatusLabel}>Closed</Text>
                      </View>
                      <Text style={styles.caseStatusValue}>{officer.closedCases}</Text>
                      <Text style={styles.caseStatusSubtext}>Completed</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.caseStatusCard, { backgroundColor: getCaseStatusBg('pending') }]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.caseStatusHeader}>
                        <View style={[styles.statusDot, { backgroundColor: getCaseStatusColor('pending') }]} />
                        <Text style={styles.caseStatusLabel}>Pending</Text>
                      </View>
                      <Text style={styles.caseStatusValue}>{officer.pendingTasks}</Text>
                      <Text style={styles.caseStatusSubtext}>Awaiting</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.caseStatusCard, { backgroundColor: getCaseStatusBg('success') }]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.caseStatusHeader}>
                        <View style={[styles.statusDot, { backgroundColor: getCaseStatusColor('success') }]} />
                        <Text style={styles.caseStatusLabel}>Success</Text>
                      </View>
                      <Text style={styles.caseStatusValue}>{officer.successRate}%</Text>
                      <Text style={styles.caseStatusSubtext}>Rate</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.performanceSection}>
                    <View style={styles.performanceRow}>
                      <Text style={styles.performanceLabel}>Response Time:</Text>
                      <Text style={styles.performanceValue}>{officer.avgResponseTime}</Text>
                    </View>
                    <View style={styles.performanceRow}>
                      <Text style={styles.performanceLabel}>Monthly Target:</Text>
                      <Text style={styles.performanceValue}>{officer.weeklyTarget} cases</Text>
                    </View>
                    <View style={styles.performanceRow}>
                      <Text style={styles.performanceLabel}>Court Appearances:</Text>
                      <Text style={styles.performanceValue}>{officer.courtAppearances} this month</Text>
                    </View>
                  </View>

                  {isExpanded && (
                    <View style={styles.expandedSection}>
                      <View style={styles.ongoingCases}>
                        <Text style={styles.expandedTitle}>Ongoing Investigations</Text>
                        {officer.ongoingInvestigations.map((caseId, index) => (
                          <TouchableOpacity key={index} style={styles.caseChip} activeOpacity={0.8}>
                            <FileText size={12} color="#6366F1" />
                            <Text style={styles.caseChipText}>{caseId}</Text>
                            <ChevronRight size={12} color="#94A3B8" />
                          </TouchableOpacity>
                        ))}
                      </View>

                      <View style={styles.recentActivity}>
                        <Text style={styles.expandedTitle}>Recent Activity</Text>
                        {officer.recentActivity.map((activity, index) => (
                          <View key={index} style={styles.activityItem}>
                            <View style={styles.activityDot} />
                            <View style={styles.activityContent}>
                              <Text style={styles.activityAction}>{activity.action}</Text>
                              <Text style={styles.activityCase}>{activity.case}</Text>
                              <Text style={styles.activityTime}>{activity.time}</Text>
                            </View>
                          </View>
                        ))}
                      </View>

                      <View style={styles.shiftInfo}>
                        <Text style={styles.expandedTitle}>Current Shift</Text>
                        <View style={styles.shiftDetails}>
                          <View style={styles.shiftRow}>
                            <Calendar size={14} color="#64748B" />
                            <Text style={styles.shiftText}>{officer.currentShift}</Text>
                          </View>
                          <View style={styles.shiftRow}>
                            <Clock size={14} color="#64748B" />
                            <Text style={styles.shiftText}>Next Court: {officer.nextCourtDate}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.assignButton} 
                      onPress={() => handleAssignCase(officer.id)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.assignGradient}>
                        <Target size={16} color="#ffffff" />
                        <Text style={styles.assignText}>Assign Case</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.detailsButton} 
                      onPress={() => handleViewDetails(officer.id)}
                      activeOpacity={0.8}
                    >
                      <Eye size={16} color="#6366F1" />
                      <Text style={styles.detailsText}>{isExpanded ? 'Hide' : 'Details'}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.messageButton} 
                      activeOpacity={0.8}
                      onPress={() => handleMessage(officer)}
                    >
                      <MessageCircle size={16} color="#F59E0B" />
                      <Text style={styles.messageText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workload Distribution</Text>
          
          <View style={styles.distributionCard}>
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              style={styles.distributionGradient}
            >
              <View style={styles.distributionHeader}>
                <Text style={styles.distributionTitle}>Case Assignment Recommendations</Text>
                <View style={styles.aiIndicator}>
                  <Star size={16} color="#6366F1" />
                  <Text style={styles.aiText}>AI Powered</Text>
                </View>
              </View>
              
              <View style={styles.recommendationsList}>
                <View style={styles.recommendation}>
                  <View style={styles.recommendationIcon}>
                    <Target size={20} color="#10B981" />
                  </View>
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>Inspector Patel</Text>
                    <Text style={styles.recommendationSubtitle}>Best for new domestic violence cases</Text>
                    <Text style={styles.recommendationReason}>Low workload • High success rate • Specialization match</Text>
                  </View>
                  <View style={styles.recommendationScore}>
                    <Text style={styles.scoreText}>95%</Text>
                  </View>
                </View>

                <View style={styles.recommendation}>
                  <View style={styles.recommendationIcon}>
                    <AlertTriangle size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>SI Sharma</Text>
                    <Text style={styles.recommendationSubtitle}>High workload - consider redistribution</Text>
                    <Text style={styles.recommendationReason}>12 active cases • Above average workload</Text>
                  </View>
                  <View style={[styles.recommendationScore, { backgroundColor: '#F59E0B' }]}>
                    <Text style={styles.scoreText}>High</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <MessageModal />
      <CaseListModal />
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
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  periodSelector: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedPeriod: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedPeriodText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  officersList: {
    gap: 16,
    marginBottom: 24,
  },
  officerCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  officerGradient: {
    padding: 24,
  },
  officerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  officerInfo: {
    flex: 1,
  },
  officerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  officerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  performanceBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  officerRank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  officerLocation: {
    fontSize: 14,
    color: '#64748B',
  },
  lastActive: {
    fontSize: 12,
    color: '#94A3B8',
  },
  // Case Status Grid Styles
  caseStatusGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  caseStatusCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  caseStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  caseStatusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  caseStatusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  caseStatusSubtext: {
    fontSize: 11,
    color: '#64748B',
  },
  performanceSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  expandedSection: {
    backgroundColor: '#F3F0FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 16,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4338CA',
    marginBottom: 8,
  },
  ongoingCases: {
    gap: 8,
  },
  caseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  caseChipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  recentActivity: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  activityCase: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366F1',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  shiftInfo: {
    gap: 8,
  },
  shiftDetails: {
    gap: 6,
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shiftText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  assignButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  assignGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  assignText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F0FF',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  distributionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  distributionGradient: {
    padding: 20,
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  distributionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  aiText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  recommendationsList: {
    gap: 12,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  recommendationSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  recommendationReason: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  recommendationScore: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  messageModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  messageModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  messageModalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  officerContactInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactInfoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 8,
  },
  contactInfoText: {
    fontSize: 13,
    color: '#1E293B',
    marginBottom: 4,
  },
  chooseMethodLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  messageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageOptionContent: {
    flex: 1,
  },
  messageOptionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  messageOptionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  cancelMessageButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelMessageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  // Case List Modal Styles
  caseListModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  caseModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  caseModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  caseModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  officerAssignmentInfo: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  assignmentOfficerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4338CA',
    marginBottom: 8,
  },
  officerWorkloadInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  workloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workloadLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  workloadValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
  },
  availableCasesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  caseList: {
    maxHeight: 300,
  },
  caseListContent: {
    paddingBottom: 20,
  },
  caseListItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  caseListItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  caseInfo: {
    flex: 1,
  },
  caseId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  caseType: {
    fontSize: 14,
    color: '#64748B',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  caseDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 20,
  },
  caseLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  caseLocation: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportedTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  assignCaseButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignCaseButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  noCasesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noCasesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 12,
    marginBottom: 8,
  },
  noCasesSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  bottomSpacing: {
    height: 100,
  },
});