import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, FileText, Clock, MapPin, User, AlertTriangle, Target, Users, Crown, Star, ChevronRight, X, Brain, Sparkles, Check, Zap, Shield, RefreshCw, Phone } from 'lucide-react-native';

// Clean old FIRs (older than 2 hours)
const cleanOldFIRs = async () => {
  try {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    
    const shoFIRs = await AsyncStorage.getItem('sho_fir_inbox');
    if (shoFIRs) {
      const parsedFIRs = JSON.parse(shoFIRs);
      const filteredFIRs = parsedFIRs.filter((fir: any) => 
        new Date(fir.submittedAt) > twoHoursAgo
      );
      await AsyncStorage.setItem('sho_fir_inbox', JSON.stringify(filteredFIRs));
    }
  } catch (error) {
    console.error('Error cleaning old FIRs:', error);
  }
};

type Officer = {
  id: string;
  name: string;
  rank: string;
  currentCases: number;
  successRate: number;
  specialization: string[];
  avgResolutionTime: string;
  availability: 'Available' | 'Busy' | 'On Leave';
};

type FIR = {
  id: string;
  complainant: string;
  phone: string;
  crimeType: string;
  location: string;
  urgency: string;
  timeAgo: string;
  description: string;
  suggestedOfficer: string;
  evidenceCount: number;
  witnessCount: number;
  status: 'Unassigned' | 'Pending Assignment' | 'Assigned' | 'Escalated';
  assignedTo?: string;
  assignedOfficerId?: string;
  escalatedTo?: string;
  submittedAt: string;
  formData?: any;
  // Additional case details for officer
  caseDetails?: {
    description: string;
    location: string;
    date: string;
    time: string;
    priority: string;
    updates?: Array<{
      date: string;
      time: string;
      action: string;
      by: string;
    }>;
    evidence?: Array<any>;
    witnesses?: Array<any>;
  };
};

// Dummy FIR data
const dummyFIRs: FIR[] = [
  {
    id: 'FIR/2024/01012567',
    complainant: 'Rahul Sharma',
    phone: '+91 9876543210',
    crimeType: 'Theft/Burglary',
    location: 'Sector 15, Noida',
    urgency: 'High',
    timeAgo: '2 hours ago',
    description: 'Jewelry worth ₹5 lakhs stolen from house while family was away for wedding.',
    suggestedOfficer: 'Inspector Kumar',
    evidenceCount: 3,
    witnessCount: 2,
    status: 'Unassigned',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    caseDetails: {
      description: 'Jewelry worth ₹5 lakhs stolen from house while family was away for wedding. Main gate lock was broken, bedrooms ransacked.',
      location: 'Sector 15, Noida',
      date: '2024-01-15',
      time: '14:30',
      priority: 'High',
      updates: [
        { date: '2024-01-15', time: '14:30', action: 'FIR registered', by: 'SI Sharma' }
      ],
      evidence: [],
      witnesses: []
    }
  },
  {
    id: 'FIR/2024/01012568',
    complainant: 'Priya Patel',
    phone: '+91 9876543211',
    crimeType: 'Fraud/Cheating',
    location: 'Connaught Place, Delhi',
    urgency: 'Medium',
    timeAgo: '4 hours ago',
    description: 'Online investment fraud of ₹3.5 lakhs through fake trading platform.',
    suggestedOfficer: 'SI Sharma',
    evidenceCount: 5,
    witnessCount: 1,
    status: 'Assigned',
    assignedTo: 'Inspector Gupta',
    assignedOfficerId: '4',
    submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    caseDetails: {
      description: 'Online investment fraud of ₹3.5 lakhs through fake trading platform. Victim transferred money via UPI.',
      location: 'Connaught Place, Delhi',
      date: '2024-01-14',
      time: '10:00',
      priority: 'Medium',
      updates: [
        { date: '2024-01-14', time: '10:00', action: 'Case registered', by: 'SI Sharma' },
        { date: '2024-01-14', time: '14:30', action: 'Assigned to Inspector Gupta', by: 'SHO' }
      ],
      evidence: [],
      witnesses: []
    }
  },
  {
    id: 'FIR/2024/01012569',
    complainant: 'Amit Verma',
    phone: '+91 9876543212',
    crimeType: 'Assault',
    location: 'MG Road, Gurgaon',
    urgency: 'Critical',
    timeAgo: '1 hour ago',
    description: 'Physical assault during road rage incident, victim hospitalized with injuries.',
    suggestedOfficer: 'Inspector Patel',
    evidenceCount: 2,
    witnessCount: 3,
    status: 'Escalated',
    escalatedTo: 'CO',
    submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    caseDetails: {
      description: 'Physical assault during road rage incident. Victim suffered head injuries and is hospitalized.',
      location: 'MG Road, Gurgaon',
      date: '2024-01-15',
      time: '16:45',
      priority: 'Critical',
      updates: [
        { date: '2024-01-15', time: '16:45', action: 'Case registered', by: 'SI Sharma' },
        { date: '2024-01-15', time: '17:00', action: 'Escalated to CO', by: 'SHO' }
      ],
      evidence: [],
      witnesses: []
    }
  },
  {
    id: 'FIR/2024/01012570',
    complainant: 'Sunita Devi',
    phone: '+91 9876543213',
    crimeType: 'Domestic Violence',
    location: 'Dwarka, Delhi',
    urgency: 'High',
    timeAgo: '3 hours ago',
    description: 'Domestic violence complaint with evidence of physical abuse.',
    suggestedOfficer: 'Inspector Gupta',
    evidenceCount: 4,
    witnessCount: 0,
    status: 'Unassigned',
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    caseDetails: {
      description: 'Domestic violence complaint. Visible injuries documented. Urgent intervention required.',
      location: 'Dwarka, Delhi',
      date: '2024-01-14',
      time: '19:30',
      priority: 'High',
      updates: [
        { date: '2024-01-14', time: '19:30', action: 'FIR registered', by: 'SI Sharma' }
      ],
      evidence: [],
      witnesses: []
    }
  }
];

export default function FIRInboxScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [selectedFIR, setSelectedFIR] = useState<FIR | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [firList, setFirList] = useState<FIR[]>([]);
  const [availableOfficers, setAvailableOfficers] = useState<Officer[]>([
    {
      id: '1',
      name: 'Inspector Kumar',
      rank: 'Inspector',
      currentCases: 8,
      successRate: 95,
      specialization: ['Theft', 'Burglary', 'Property Crimes'],
      avgResolutionTime: '4.2 days',
      availability: 'Available'
    },
    {
      id: '2',
      name: 'SI Sharma',
      rank: 'Sub Inspector',
      currentCases: 12,
      successRate: 89,
      specialization: ['Assault', 'Fraud', 'Cyber Crime'],
      avgResolutionTime: '5.1 days',
      availability: 'Busy'
    },
    {
      id: '3',
      name: 'Inspector Patel',
      rank: 'Inspector',
      currentCases: 6,
      successRate: 92,
      specialization: ['Theft', 'Fraud', 'Financial Crimes'],
      avgResolutionTime: '3.8 days',
      availability: 'Available'
    },
    {
      id: '4',
      name: 'Inspector Gupta',
      rank: 'Inspector',
      currentCases: 10,
      successRate: 87,
      specialization: ['Domestic Violence', 'Assault', 'Harassment'],
      avgResolutionTime: '6.2 days',
      availability: 'Available'
    }
  ]);

  const filters = [
    { id: 'all', label: 'All FIRs', count: 0 },
    { id: 'unassigned', label: 'Unassigned', count: 0 },
    { id: 'assigned', label: 'Assigned', count: 0 },
    { id: 'escalated', label: 'Escalated', count: 0 },
  ];

  // Load FIRs on component mount
  useEffect(() => {
    loadFIRs();
  }, []);

  // Update filter counts when FIR list changes
  useEffect(() => {
    updateFilterCounts();
  }, [firList]);

  const loadFIRs = async () => {
    setIsLoading(true);
    try {
      await cleanOldFIRs();
      
      // Load from AsyncStorage
      const storedFIRs = await AsyncStorage.getItem('sho_fir_inbox');
      let loadedFIRs: FIR[] = [];
      
      if (storedFIRs) {
        const parsedFIRs = JSON.parse(storedFIRs);
        loadedFIRs = [...parsedFIRs];
      }
      
      // Add dummy FIRs if we don't have enough real ones
      if (loadedFIRs.length < 4) {
        // Filter out dummy FIRs that might already be in storage
        const dummyFIRsToAdd = dummyFIRs.filter(dummy => 
          !loadedFIRs.some(fir => fir.id === dummy.id)
        );
        loadedFIRs = [...dummyFIRsToAdd, ...loadedFIRs];
        
        // Save to storage for persistence
        await AsyncStorage.setItem('sho_fir_inbox', JSON.stringify(loadedFIRs));
      }
      
      // Sort by submission time (newest first)
      const sortedFIRs = loadedFIRs.sort((a: FIR, b: FIR) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      
      setFirList(sortedFIRs);
    } catch (error) {
      console.error('Error loading FIRs:', error);
      Alert.alert('Error', 'Failed to load FIRs');
      // Fallback to dummy data
      setFirList(dummyFIRs);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const updateFilterCounts = () => {
    filters[0].count = firList.length;
    filters[1].count = firList.filter(f => f.status === 'Unassigned' || f.status === 'Pending Assignment').length;
    filters[2].count = firList.filter(f => f.status === 'Assigned').length;
    filters[3].count = firList.filter(f => f.status === 'Escalated').length;
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFIRs();
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return ['#DC2626', '#EF4444'];
      case 'High': return ['#EA580C', '#F97316'];
      case 'Medium': return ['#D97706', '#F59E0B'];
      default: return ['#059669', '#10B981'];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned': return '#10B981';
      case 'Escalated': return '#8B5CF6';
      case 'Pending Assignment': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  const getTimeAgo = (submittedAt: string) => {
    const submittedDate = new Date(submittedAt);
    const now = new Date();
    const diffMs = now.getTime() - submittedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return submittedDate.toLocaleDateString();
  };

  // Function to send case to officer
  const sendCaseToOfficer = async (fir: FIR, officer: Officer) => {
    try {
      // Get existing officer cases
      const officerCasesKey = `officer_cases_${officer.id}`;
      const existingOfficerCases = await AsyncStorage.getItem(officerCasesKey);
      let officerCases = existingOfficerCases ? JSON.parse(existingOfficerCases) : [];
      
      // Create case object for officer
      const officerCase = {
        id: fir.id,
        type: fir.crimeType,
        priority: fir.urgency === 'Critical' ? 'High' : fir.urgency === 'High' ? 'High' : 'Medium',
        status: 'Investigating',
        assignedTo: officer.name,
        date: fir.caseDetails?.date || new Date().toISOString().split('T')[0],
        location: fir.location,
        description: fir.description,
        complainant: fir.complainant,
        phone: fir.phone,
        updates: [
          ...(fir.caseDetails?.updates || []),
          {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: `Case assigned to ${officer.name}`,
            by: 'SHO'
          }
        ],
        evidence: fir.caseDetails?.evidence || [],
        witnesses: fir.caseDetails?.witnesses || [],
        submittedAt: fir.submittedAt,
        assignedDate: new Date().toISOString()
      };
      
      // Add to officer's cases (prepend to show newest first)
      officerCases.unshift(officerCase);
      await AsyncStorage.setItem(officerCasesKey, JSON.stringify(officerCases));
      
      // Also add to general officer cases list (for officer login)
      const allOfficerCasesKey = 'all_officer_cases';
      const allOfficerCases = await AsyncStorage.getItem(allOfficerCasesKey);
      let allCases = allOfficerCases ? JSON.parse(allOfficerCases) : [];
      
      // Remove if already exists (to avoid duplicates)
      allCases = allCases.filter((c: any) => c.id !== fir.id);
      allCases.unshift(officerCase);
      await AsyncStorage.setItem(allOfficerCasesKey, JSON.stringify(allCases));
      
      console.log(`Case ${fir.id} sent to officer ${officer.name}`);
      return true;
    } catch (error) {
      console.error('Error sending case to officer:', error);
      return false;
    }
  };

  const handleAssignOfficer = async (officer: Officer) => {
    if (!selectedFIR) return;

    setIsLoading(true);
    try {
      // Update FIR list status
      const updatedFirList = firList.map(fir => 
        fir.id === selectedFIR.id 
          ? { 
              ...fir, 
              assignedTo: officer.name,
              assignedOfficerId: officer.id,
              status: 'Assigned',
              timeAgo: 'Just assigned'
            }
          : fir
      );

      setFirList(updatedFirList);
      await AsyncStorage.setItem('sho_fir_inbox', JSON.stringify(updatedFirList));
      setShowOfficerModal(false);
      
      // Send case to officer
      const sentToOfficer = await sendCaseToOfficer(selectedFIR, officer);
      
      if (!sentToOfficer) {
        Alert.alert('Warning', 'Case assigned but there was an issue sending it to the officer');
      }
      
      // Update citizen's FIR status
      await updateCitizenFIRStatus(selectedFIR.id, officer);
      
      Alert.alert(
        'Case Assigned Successfully',
        `${selectedFIR.id} has been assigned to ${officer.name}.\n\nCase has been sent to officer's dashboard and investigation has begun.`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error assigning officer:', error);
      Alert.alert('Error', 'Failed to assign officer');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCitizenFIRStatus = async (firId: string, officer: Officer) => {
    try {
      const storedFIRs = await AsyncStorage.getItem('my_firs');
      if (storedFIRs) {
        const citizenFIRs = JSON.parse(storedFIRs);
        const updatedFIRs = citizenFIRs.map((fir: any) => {
          if (fir.id === firId) {
            return {
              ...fir,
              status: 'Under Investigation',
              officer: officer.name,
              officerContact: '+91 98765 43210',
              officerAltContact: '+91 98765 43211',
              assignedDate: new Date().toISOString().split('T')[0],
              updates: [
                ...fir.updates,
                {
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  action: `Case assigned to ${officer.name}`,
                  by: 'SHO'
                }
              ]
            };
          }
          return fir;
        });
        await AsyncStorage.setItem('my_firs', JSON.stringify(updatedFIRs));
        console.log('Updated citizen FIR:', firId);
      }
    } catch (error) {
      console.error('Error updating citizen FIR:', error);
    }
  };

  const handleReassign = (fir: FIR) => {
    setSelectedFIR(fir);
    setShowOfficerModal(true);
  };

  const handleEscalate = (fir: FIR) => {
    setSelectedFIR(fir);
    setShowEscalateModal(true);
  };

  const confirmEscalation = async (target: 'CO' | 'Senior Officer') => {
    if (!selectedFIR) return;

    try {
      const updatedFirList = firList.map(fir => 
        fir.id === selectedFIR.id 
          ? { 
              ...fir, 
              status: 'Escalated',
              escalatedTo: target,
              timeAgo: 'Escalated'
            }
          : fir
      );

      setFirList(updatedFirList);
      await AsyncStorage.setItem('sho_fir_inbox', JSON.stringify(updatedFirList));
      setShowEscalateModal(false);
      
      // Update citizen's FIR status
      await updateCitizenFIREscalation(selectedFIR.id, target);
      
      Alert.alert(
        'Case Escalated',
        `${selectedFIR.id} has been escalated to ${target}.\n\nPriority: ${selectedFIR.urgency}\nReason: Requires immediate attention`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error escalating case:', error);
      Alert.alert('Error', 'Failed to escalate case');
    }
  };

  const updateCitizenFIREscalation = async (firId: string, target: string) => {
    try {
      const storedFIRs = await AsyncStorage.getItem('my_firs');
      if (storedFIRs) {
        const citizenFIRs = JSON.parse(storedFIRs);
        const updatedFIRs = citizenFIRs.map((fir: any) => {
          if (fir.id === firId) {
            return {
              ...fir,
              status: 'Escalated',
              updates: [
                ...fir.updates,
                {
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  action: `Case escalated to ${target}`,
                  by: 'SHO'
                }
              ]
            };
          }
          return fir;
        });
        await AsyncStorage.setItem('my_firs', JSON.stringify(updatedFIRs));
        console.log('Updated citizen FIR escalation:', firId);
      }
    } catch (error) {
      console.error('Error updating citizen FIR:', error);
    }
  };

  const filteredFIRs = firList.filter(fir => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unassigned') return fir.status === 'Unassigned' || fir.status === 'Pending Assignment';
    if (activeFilter === 'assigned') return fir.status === 'Assigned';
    if (activeFilter === 'escalated') return fir.status === 'Escalated';
    return true;
  }).filter(fir => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      fir.id.toLowerCase().includes(query) ||
      fir.complainant.toLowerCase().includes(query) ||
      fir.crimeType.toLowerCase().includes(query) ||
      fir.location.toLowerCase().includes(query)
    );
  });

  const OfficerSelectionModal = () => {
    const getSuggestedOfficer = () => {
      return availableOfficers.find(o => o.name === selectedFIR?.suggestedOfficer);
    };

    return (
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
                <Text style={styles.modalTitle}>
                  {selectedFIR?.assignedTo ? 'Reassign Officer' : 'Assign Officer'}
                </Text>
                <Text style={styles.modalSubtitle}>{selectedFIR?.id}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowOfficerModal(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedFIR?.assignedTo && (
              <View style={styles.currentAssignmentBox}>
                <Text style={styles.currentAssignmentLabel}>Currently Assigned To:</Text>
                <Text style={styles.currentAssignmentName}>{selectedFIR.assignedTo}</Text>
              </View>
            )}

            <View style={styles.aiSuggestionBox}>
              <View style={styles.aiHeader}>
                <Brain size={18} color="#8B5CF6" />
                <Text style={styles.aiTitle}>AI Recommendation</Text>
              </View>
              <Text style={styles.aiText}>
                {selectedFIR?.suggestedOfficer} ({getSuggestedOfficer()?.successRate}% success rate)
              </Text>
              <Text style={styles.aiReason}>
                Based on case type "{selectedFIR?.crimeType}" and officer specialization
              </Text>
            </View>

            <ScrollView style={styles.officersList} showsVerticalScrollIndicator={false}>
              {availableOfficers.map((officer) => {
                const isRecommended = officer.name === selectedFIR?.suggestedOfficer;
                const isAssigned = officer.id === selectedFIR?.assignedOfficerId;
                
                return (
                  <View
                    key={officer.id}
                    style={[
                      styles.officerCard,
                      isRecommended && styles.recommendedOfficer,
                      isAssigned && styles.currentlyAssignedOfficer
                    ]}
                  >
                    {isRecommended && (
                      <View style={styles.recommendedBadge}>
                        <Sparkles size={12} color="#ffffff" />
                        <Text style={styles.recommendedText}>AI Recommended</Text>
                      </View>
                    )}
                    
                    {isAssigned && (
                      <View style={styles.currentlyAssignedBadge}>
                        <Check size={12} color="#ffffff" />
                        <Text style={styles.currentlyAssignedText}>Currently Assigned</Text>
                      </View>
                    )}
                    
                    <View style={styles.officerHeader}>
                      <View style={styles.officerInfo}>
                        <Text style={styles.officerName}>{officer.name}</Text>
                        <Text style={styles.officerRank}>{officer.rank}</Text>
                      </View>
                      <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: officer.availability === 'Available' ? '#10B981' : 
                                         officer.availability === 'Busy' ? '#F59E0B' : '#EF4444' }
                      ]}>
                        <Text style={styles.availabilityText}>
                          {officer.availability}
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
                      style={[
                        styles.assignOfficerButton,
                        isAssigned && styles.reassignOfficerButton
                      ]}
                      onPress={() => handleAssignOfficer(officer)}
                    >
                      <Text style={styles.assignOfficerButtonText}>
                        {isAssigned ? 'Keep Assigned' : 
                         selectedFIR?.assignedTo ? 'Reassign to this Officer' : 'Assign Case'}
                      </Text>
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
  };

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
            <Text style={styles.escalateTitle}>Escalate Case</Text>
            <Text style={styles.escalateSubtitle}>
              Forward case to higher authority
            </Text>
          </View>

          <View style={styles.escalateDetails}>
            <View style={styles.escalateRow}>
              <Text style={styles.escalateLabel}>Case ID:</Text>
              <Text style={styles.escalateValue}>{selectedFIR?.id}</Text>
            </View>
            <View style={styles.escalateRow}>
              <Text style={styles.escalateLabel}>Priority:</Text>
              <Text style={[styles.escalateValue, { color: getUrgencyColor(selectedFIR?.urgency || 'Medium')[0] }]}>
                {selectedFIR?.urgency}
              </Text>
            </View>
            <View style={styles.escalateRow}>
              <Text style={styles.escalateLabel}>Crime Type:</Text>
              <Text style={styles.escalateValue}>{selectedFIR?.crimeType}</Text>
            </View>
          </View>

          <View style={styles.aiWarning}>
            <Brain size={18} color="#F59E0B" />
            <Text style={styles.aiWarningText}>
              AI suggests escalation due to case complexity and urgency level
            </Text>
          </View>

          <Text style={styles.escalateToLabel}>Escalate To:</Text>
          
          <TouchableOpacity 
            style={styles.escalateOptionButton}
            onPress={() => confirmEscalation('CO')}
          >
            <Shield size={20} color="#DC2626" />
            <View style={styles.escalateOptionContent}>
              <Text style={styles.escalateOptionTitle}>Commanding Officer (CO)</Text>
              <Text style={styles.escalateOptionSubtitle}>For critical cases requiring immediate attention</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.escalateOptionButton}
            onPress={() => confirmEscalation('Senior Officer')}
          >
            <Zap size={20} color="#F59E0B" />
            <View style={styles.escalateOptionContent}>
              <Text style={styles.escalateOptionTitle}>Senior Officer</Text>
              <Text style={styles.escalateOptionSubtitle}>For cases needing specialized handling</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelEscalateButton}
            onPress={() => setShowEscalateModal(false)}
          >
            <Text style={styles.cancelEscalateButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>FIR Inbox</Text>
            <Text style={styles.subtitle}>New FIRs from citizens</Text>
          </View>
          <View style={styles.headerIcon}>
            <Crown size={24} color="#ffffff" />
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItemHeader}>
            <Text style={styles.statNumber}>{firList.length}</Text>
            <Text style={styles.statLabelHeader}>Total</Text>
          </View>
          <View style={styles.statItemHeader}>
            <Text style={styles.statNumber}>{filters[1].count}</Text>
            <Text style={styles.statLabelHeader}>Unassigned</Text>
          </View>
          <View style={styles.statItemHeader}>
            <Text style={styles.statNumber}>{filters[3].count}</Text>
            <Text style={styles.statLabelHeader}>Escalated</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#7C3AED" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FIRs by ID, complainant, or crime type..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <RefreshCw size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterPill,
                activeFilter === filter.id && styles.activeFilterPill
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

      {isLoading && firList.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading FIRs...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.firList} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#7C3AED']}
              tintColor="#7C3AED"
            />
          }
        >
          {filteredFIRs.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={48} color="#CBD5E1" />
              <Text style={styles.emptyStateTitle}>
                {activeFilter === 'all' ? 'No FIRs Available' : 'No FIRs Found'}
              </Text>
              <Text style={styles.emptyStateText}>
                {activeFilter === 'all' 
                  ? 'No FIRs have been filed yet. New FIRs from citizens will appear here automatically.'
                  : `No ${activeFilter} FIRs found. Try a different filter.`
                }
              </Text>
            </View>
          ) : (
            filteredFIRs.map((fir) => (
              <TouchableOpacity 
                key={fir.id} 
                style={styles.firCard} 
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedFIR(fir);
                  // Show FIR details in alert
                  Alert.alert(
                    'FIR Details',
                    `ID: ${fir.id}\nComplainant: ${fir.complainant}\nType: ${fir.crimeType}\nLocation: ${fir.location}\nStatus: ${fir.status}\nSubmitted: ${getTimeAgo(fir.submittedAt)}`,
                    [{ text: 'OK' }]
                  );
                }}
              >
                <LinearGradient
                  colors={['#ffffff', '#fefbff']}
                  style={styles.firGradient}
                >
                  <View style={styles.firHeader}>
                    <View style={styles.firInfo}>
                      <Text style={styles.firId}>{fir.id}</Text>
                      <Text style={styles.crimeType}>{fir.crimeType}</Text>
                      <LinearGradient
                        colors={getUrgencyColor(fir.urgency)}
                        style={styles.urgencyBadge}
                      >
                        <Text style={styles.urgencyText}>{fir.urgency}</Text>
                      </LinearGradient>
                    </View>
                    <View style={styles.firMeta}>
                      <Text style={styles.timeAgo}>{getTimeAgo(fir.submittedAt)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(fir.status) }]}>
                        <Text style={styles.statusBadgeText}>{fir.status}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.firDescription}>{fir.description.substring(0, 100)}...</Text>

                  <View style={styles.complainantInfo}>
                    <View style={styles.complainantRow}>
                      <User size={16} color="#64748B" />
                      <Text style={styles.complainantText}>{fir.complainant}</Text>
                    </View>
                    <View style={styles.complainantRow}>
                      <MapPin size={16} color="#64748B" />
                      <Text style={styles.complainantText}>{fir.location}</Text>
                    </View>
                    <View style={styles.complainantRow}>
                      <Phone size={16} color="#64748B" />
                      <Text style={styles.complainantText}>{fir.phone}</Text>
                    </View>
                  </View>

                  <View style={styles.evidenceInfo}>
                    <View style={styles.evidenceItem}>
                      <FileText size={14} color="#7C3AED" />
                      <Text style={styles.evidenceText}>{fir.evidenceCount} Evidence</Text>
                    </View>
                    <View style={styles.evidenceItem}>
                      <Users size={14} color="#10B981" />
                      <Text style={styles.evidenceText}>{fir.witnessCount} Witnesses</Text>
                    </View>
                  </View>

                  {fir.assignedTo ? (
                    <View style={styles.assignedCard}>
                      <View style={styles.assignedHeader}>
                        <Check size={16} color="#10B981" />
                        <Text style={styles.assignedTitle}>Assigned to</Text>
                      </View>
                      <Text style={styles.assignedOfficer}>{fir.assignedTo}</Text>
                      <Text style={styles.assignedStatus}>Case sent to officer</Text>
                    </View>
                  ) : (
                    <View style={styles.suggestionCard}>
                      <View style={styles.suggestionHeader}>
                        <Star size={16} color="#7C3AED" />
                        <Text style={styles.suggestionTitle}>AI Recommendation</Text>
                      </View>
                      <Text style={styles.suggestedOfficer}>Suggested: {fir.suggestedOfficer}</Text>
                    </View>
                  )}

                  <View style={styles.actionButtons}>
                    {fir.assignedTo ? (
                      <>
                        <TouchableOpacity 
                          style={styles.reassignButton} 
                          activeOpacity={0.8}
                          onPress={() => handleReassign(fir)}
                        >
                          <Users size={16} color="#7C3AED" />
                          <Text style={styles.reassignText}>Reassign</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.escalateButton} 
                          onPress={() => handleEscalate(fir)}
                          activeOpacity={0.8}
                        >
                          <AlertTriangle size={16} color="#EF4444" />
                          <Text style={styles.escalateText}>Escalate</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity 
                          style={styles.assignButton} 
                          onPress={() => {
                            setSelectedFIR(fir);
                            setShowOfficerModal(true);
                          }}
                          activeOpacity={0.8}
                        >
                          <LinearGradient colors={['#10B981', '#059669']} style={styles.assignGradient}>
                            <Target size={16} color="#ffffff" />
                            <Text style={styles.assignText}>Assign</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.chooseButton} 
                          activeOpacity={0.8}
                          onPress={() => {
                            setSelectedFIR(fir);
                            setShowOfficerModal(true);
                          }}
                        >
                          <Users size={16} color="#7C3AED" />
                          <Text style={styles.chooseText}>Choose Officer</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.escalateButton} 
                          onPress={() => handleEscalate(fir)}
                          activeOpacity={0.8}
                        >
                          <AlertTriangle size={16} color="#EF4444" />
                          <Text style={styles.escalateText}>Escalate</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

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
  statItemHeader: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabelHeader: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  refreshButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  filtersContainer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    marginTop: -4,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 6,
    minHeight: 32,
  },
  activeFilterPill: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  filterBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  filterCount: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748B',
  },
  activeFilterCount: {
    color: '#3B82F6',
  },
  firList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  firCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  firGradient: {
    padding: 24,
  },
  firHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  firInfo: {
    flex: 1,
  },
  firId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  crimeType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
    marginTop: 4,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  firMeta: {
    alignItems: 'flex-end',
  },
  timeAgo: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  firDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  complainantInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  complainantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  complainantText: {
    fontSize: 14,
    color: '#64748B',
  },
  evidenceInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  evidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  suggestionCard: {
    backgroundColor: '#F3F0FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  suggestionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  suggestedOfficer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B21B6',
  },
  assignedCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  assignedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  assignedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  assignedOfficer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  assignedStatus: {
    fontSize: 12,
    color: '#10B981',
    fontStyle: 'italic',
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
  chooseButton: {
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
  chooseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  reassignButton: {
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
  reassignText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  escalateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  escalateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
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
  currentAssignmentBox: {
    margin: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  currentAssignmentLabel: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  currentAssignmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#78350F',
  },
  aiSuggestionBox: {
    margin: 20,
    marginTop: 0,
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
  currentlyAssignedOfficer: {
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
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
  currentlyAssignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  currentlyAssignedText: {
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
  assignOfficerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  reassignOfficerButton: {
    backgroundColor: '#10B981',
  },
  assignOfficerButtonText: {
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
  escalateToLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  escalateOptionButton: {
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
  escalateOptionContent: {
    flex: 1,
  },
  escalateOptionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  escalateOptionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  cancelEscalateButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelEscalateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});