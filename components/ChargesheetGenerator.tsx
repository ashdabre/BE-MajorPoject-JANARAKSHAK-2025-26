import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  X,
  FileText,
  Search,
  User,
  Camera,
  Clock,
  MapPin,
  Scale,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Edit3,
  Brain,
  Zap,
  Target,
  BookOpen,
  ChevronRight,
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ChargesheetGeneratorProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (chargesheet: any) => void;
  initialCaseData?: any; // Pre-filled case data from AI Case Manager
}

interface CaseData {
  caseId: string;
  firNumber: string;
  policeStation: string;
  incidentDate: string;
  incidentLocation: string;
  complainant: string;
  accused: string;
  ipcSections: string[];
  evidence: string[];
  witnesses: string[];
  investigationSummary: string;
  status: string;
  priority: string;
}

interface ChargesheetData {
  caseId: string;
  title: string;
  content: string;
  status: 'draft' | 'review' | 'approved';
  generatedAt: string;
  confidence: number;
  missingFields: string[];
  aiInsights: string[];
  suggestedActions: string[];
}

// Enhanced IPC Database with more sections
const IPC_SECTIONS = [
  { code: 'IPC 379', title: 'Theft', punishment: 'Imprisonment up to 3 years, or fine, or both.', category: 'Property' },
  { code: 'IPC 380', title: 'Theft in dwelling house', punishment: 'Imprisonment up to 7 years and fine.', category: 'Property' },
  { code: 'IPC 381', title: 'Theft by clerk or servant', punishment: 'Imprisonment up to 7 years and fine.', category: 'Property' },
  { code: 'IPC 382', title: 'Theft with preparation for death/hurt', punishment: 'Imprisonment up to 10 years and fine.', category: 'Property' },
  { code: 'IPC 420', title: 'Cheating and dishonestly inducing delivery of property', punishment: 'Imprisonment up to 7 years and fine.', category: 'Fraud' },
  { code: 'IPC 406', title: 'Criminal breach of trust', punishment: 'Imprisonment up to 3 years, or fine, or both.', category: 'Property' },
  { code: 'IPC 323', title: 'Voluntarily causing hurt', punishment: 'Imprisonment up to 1 year, or fine up to ₹1000, or both.', category: 'Violence' },
  { code: 'IPC 324', title: 'Voluntarily causing hurt by dangerous weapons', punishment: 'Imprisonment up to 3 years, or fine, or both.', category: 'Violence' },
  { code: 'IPC 325', title: 'Voluntarily causing grievous hurt', punishment: 'Imprisonment up to 7 years and fine.', category: 'Violence' },
  { code: 'IPC 354', title: 'Assault or criminal force to woman with intent to outrage modesty', punishment: 'Imprisonment from 1 to 5 years, and fine.', category: 'Women Safety' },
  { code: 'IPC 376', title: 'Rape', punishment: 'Imprisonment from 10 years to life, and fine.', category: 'Women Safety' },
  { code: 'IPC 302', title: 'Murder', punishment: 'Death penalty or life imprisonment, and fine.', category: 'Violence' },
  { code: 'IPC 304', title: 'Culpable homicide not amounting to murder', punishment: 'Imprisonment up to 10 years, or fine, or both.', category: 'Violence' },
  { code: 'IPC 498A', title: 'Cruelty by husband or relatives', punishment: 'Imprisonment up to 3 years and fine.', category: 'Women Safety' },
  { code: 'IPC 506', title: 'Criminal intimidation', punishment: 'Imprisonment up to 2 years, or fine, or both.', category: 'Miscellaneous' },
  { code: 'IPC 34', title: 'Acts done by several persons in furtherance of common intention', punishment: 'Punishment same as offence committed.', category: 'Miscellaneous' },
{ code: 'IPC 120B', title: 'Criminal conspiracy', punishment: 'Punishment depends on offence conspired.', category: 'Miscellaneous' },
{ code: 'IPC 153A', title: 'Promoting enmity between groups', punishment: 'Imprisonment up to 3 years and fine.', category: 'Public Order' },
{ code: 'IPC 174', title: 'Non-attendance in obedience to order from public servant', punishment: 'Simple imprisonment up to 1 month or fine.', category: 'Public Servant' },
{ code: 'IPC 182', title: 'False information to public servant', punishment: 'Imprisonment up to 6 months or fine.', category: 'Public Servant' },
{ code: 'IPC 188', title: 'Disobedience to order promulgated by public servant', punishment: 'Imprisonment up to 6 months or fine.', category: 'Public Order' },
{ code: 'IPC 224', title: 'Resistance to lawful apprehension', punishment: 'Imprisonment up to 2 years or fine.', category: 'Public Order' },
{ code: 'IPC 283', title: 'Danger or obstruction in public way', punishment: 'Fine up to ₹200.', category: 'Public Order' },
{ code: 'IPC 291', title: 'Continuance of nuisance after injunction', punishment: 'Imprisonment up to 6 months or fine.', category: 'Public Order' },
{ code: 'IPC 312', title: 'Causing miscarriage', punishment: 'Imprisonment up to 3 years or fine.', category: 'Violence' },
{ code: 'IPC 319', title: 'Hurt', punishment: 'Punishment as per relevant section.', category: 'Violence' },
{ code: 'IPC 341', title: 'Wrongful restraint', punishment: 'Simple imprisonment up to 1 month or fine.', category: 'Violence' },
{ code: 'IPC 342', title: 'Wrongful confinement', punishment: 'Imprisonment up to 1 year or fine.', category: 'Violence' },
{ code: 'IPC 352', title: 'Assault or criminal force otherwise than on grave provocation', punishment: 'Imprisonment up to 3 months or fine.', category: 'Violence' },
{ code: 'IPC 403', title: 'Dishonest misappropriation of property', punishment: 'Imprisonment up to 2 years or fine.', category: 'Property' },
{ code: 'IPC 411', title: 'Dishonestly receiving stolen property', punishment: 'Imprisonment up to 3 years or fine.', category: 'Property' },
{ code: 'IPC 425', title: 'Mischief', punishment: 'Punishment varies based on damage.', category: 'Property' },
{ code: 'IPC 426', title: 'Punishment for mischief', punishment: 'Imprisonment up to 3 months or fine.', category: 'Property' },
{ code: 'IPC 504', title: 'Intentional insult with intent to provoke breach of peace', punishment: 'Imprisonment up to 2 years or fine.', category: 'Miscellaneous' },
{ code: 'IPC 510', title: 'Misconduct in public by drunken person', punishment: 'Simple imprisonment up to 24 hours or fine.', category: 'Public Order' },

];

export default function ChargesheetGenerator({ visible, onClose, onGenerate, initialCaseData }: ChargesheetGeneratorProps) {
  const router = useRouter();
  const [step, setStep] = useState<'search' | 'details' | 'review' | 'generating' | 'preview'>('search');
  const [caseData, setCaseData] = useState<CaseData>({
    caseId: '',
    firNumber: '',
    policeStation: 'Sector 5 Police Station',
    incidentDate: '',
    incidentLocation: '',
    complainant: '',
    accused: '',
    ipcSections: [],
    evidence: [],
    witnesses: [],
    investigationSummary: '',
    status: 'Under Investigation',
    priority: 'Medium'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chargesheet, setChargesheet] = useState<ChargesheetData | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const slideAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      slideAnim.value = withSpring(1, { damping: 20 });
      fadeAnim.value = withTiming(1, { duration: 500 });
      
      // Pre-fill data if passed from AI Case Manager
      if (initialCaseData) {
        setCaseData(initialCaseData);
        setSelectedSections(initialCaseData.ipcSections || []);
        setStep('details');
      }
    } else {
      slideAnim.value = 0;
      fadeAnim.value = 0;
    }
  }, [visible, initialCaseData]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(slideAnim.value, [0, 1], [50, 0]) }],
    opacity: fadeAnim.value,
  }));

  // Mock case database - Enhanced with more cases
  const caseDatabase = [
    {
      caseId: 'FIR/2024/001234',
      firNumber: 'FIR-1234/2024',
      policeStation: 'Sector 5 Police Station',
      incidentDate: '2024-01-10',
      incidentLocation: 'MG Road Metro Station Parking',
      complainant: 'Rahul Sharma',
      accused: 'Unknown (CCTV footage available)',
      status: 'Under Investigation',
      priority: 'High',
      ipcSections: ['IPC 379 - Theft']
    },
    {
      caseId: 'FIR/2024/001235',
      firNumber: 'FIR-1235/2024',
      policeStation: 'Sector 5 Police Station',
      incidentDate: '2024-01-12',
      incidentLocation: 'Brigade Road Shopping Complex',
      complainant: 'Priya Patel',
      accused: 'Raj Kumar (Arrested)',
      status: 'Chargesheet Pending',
      priority: 'Medium',
      ipcSections: ['IPC 420 - Cheating']
    },
    {
      caseId: 'FIR/2024/001236',
      firNumber: 'FIR-1236/2024',
      policeStation: 'Sector 5 Police Station',
      incidentDate: '2024-01-15',
      incidentLocation: 'Residential Area, Sector 5',
      complainant: 'Anita Desai',
      accused: 'Neighbor (Identified)',
      status: 'Evidence Collection',
      priority: 'High',
      ipcSections: ['IPC 354 - Assault to woman']
    }
  ];

  const categories = ['All', 'Property', 'Violence', 'Fraud', 'Women Safety', 'Miscellaneous'];

  const filteredSections = activeCategory === 'All' 
    ? IPC_SECTIONS 
    : IPC_SECTIONS.filter(section => section.category === activeCategory);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const foundCase = caseDatabase.find(
        (c) => c.caseId === searchQuery || c.firNumber === searchQuery
      );
      if (foundCase) {
        setCaseData({ ...caseData, ...foundCase });
        setStep('details');
      } else {
        Alert.alert('Case Not Found', 'Please check the Case ID or FIR number and try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const simulateAIAgents = async (): Promise<ChargesheetData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Enhanced AI Agent Simulation
        const collectedData = {
          ...caseData,
          ipcSections: selectedSections,
          evidence: caseData.evidence.length > 0 ? caseData.evidence : ['CCTV footage', 'Witness statements', 'Recovered items'],
          witnesses: caseData.witnesses.length > 0 ? caseData.witnesses : ['Witness 1: Security Guard', 'Witness 2: Shop Owner'],
        };

        const chargesheetContent = generateChargesheetContent(collectedData);
        const missingFields = validateChargesheet(collectedData);
        const confidence = calculateConfidence(missingFields);
        const aiInsights = generateAIInsights(collectedData);
        const suggestedActions = generateSuggestedActions(collectedData);

        resolve({
          caseId: caseData.caseId,
          title: `Chargesheet - ${caseData.caseId}`,
          content: chargesheetContent,
          status: 'draft',
          generatedAt: new Date().toLocaleString(),
          confidence,
          missingFields,
          aiInsights,
          suggestedActions,
        });
      }, 2500);
    });
  };

  const generateChargesheetContent = (data: CaseData): string => {
    return `
IN THE COURT OF JUDICIAL MAGISTRATE, BANGALORE
CHARGE SHEET

Case No: ${data.caseId}
FIR No: ${data.firNumber}
Police Station: ${data.policeStation}
Date of Incident: ${data.incidentDate}
U/s: ${data.ipcSections.join(', ')}

COMPLAINANT:
Name: ${data.complainant}
Address: [To be filled]

ACCUSED:
${data.accused}
Address: [To be filled]

OFFENCES:
${data.ipcSections.map(section => `- ${section}`).join('\n')}

BRIEF FACTS OF THE CASE:
${data.investigationSummary || 'Investigation summary to be provided...'}

EVIDENCE COLLECTED:
${data.evidence.map((evidence, index) => `${index + 1}. ${evidence}`).join('\n')}

WITNESSES:
${data.witnesses.map((witness, index) => `${index + 1}. ${witness}`).join('\n')}

INVESTIGATION DETAILS:
- Date of FIR: ${data.incidentDate}
- Investigation Officer: SHO Rajesh Kumar
- Station: ${data.policeStation}
- Status: ${data.status}

INVESTIGATING OFFICER:
Rajesh Kumar
Station House Officer
${data.policeStation}
Contact: [Official Contact]

DATE OF FILING: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

NOTE: This chargesheet has been generated using AI-powered legal assistant. Please verify all details before submission.
    `.trim();
  };

  const validateChargesheet = (data: CaseData): string[] => {
    const missing: string[] = [];
    if (!data.accused || data.accused.includes('Unknown')) missing.push('Accused identification');
    if (!data.investigationSummary) missing.push('Detailed investigation summary');
    if (data.ipcSections.length === 0) missing.push('IPC sections application');
    if (data.evidence.length === 0) missing.push('Physical evidence documentation');
    if (data.witnesses.length < 2) missing.push('Adequate witness statements');
    return missing;
  };

  const calculateConfidence = (missingFields: string[]): number => {
    const baseConfidence = 85;
    const penalty = missingFields.length * 8;
    return Math.max(baseConfidence - penalty, 50);
  };

  const generateAIInsights = (data: CaseData): string[] => {
    const insights = [];
    
    if (data.ipcSections.some(s => s.includes('376'))) {
      insights.push('Case involves serious offence - recommend fast track court');
    }
    
    if (data.evidence.length >= 3) {
      insights.push('Strong evidence collection increases conviction probability');
    }
    
    if (data.witnesses.length < 2) {
      insights.push('Consider collecting more witness statements for stronger case');
    }

    insights.push('Recommended to file chargesheet within 60 days for better judicial consideration');
    
    return insights;
  };

  const generateSuggestedActions = (data: CaseData): string[] => {
    const actions = [];
    
    if (data.accused.includes('Unknown')) {
      actions.push('Initiate identification parade if suspect is unknown');
    }
    
    if (data.ipcSections.some(s => s.includes('420'))) {
      actions.push('Obtain bank transaction records for financial investigation');
    }
    
    actions.push('Schedule witness statements recording');
    actions.push('Prepare evidence custody documentation');
    
    return actions;
  };

  const handleGenerate = async () => {
    setStep('generating');
    try {
      const generatedChargesheet = await simulateAIAgents();
      setChargesheet(generatedChargesheet);
      setStep('preview');
    } catch (error) {
      Alert.alert('Generation Failed', 'Please try again or check your connection.');
      setStep('review');
    }
  };

  const handleApprove = () => {
    if (chargesheet) {
      onGenerate(chargesheet);
      Alert.alert('Success', 'Chargesheet approved and saved to case files!');
      onClose();
    }
  };

  const handleExport = (format: 'pdf' | 'docx') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Export Complete', `Chargesheet has been exported as ${format.toUpperCase()} successfully!`);
    }, 1500);
  };

  const reset = () => {
    setStep('search');
    setCaseData({
      caseId: '',
      firNumber: '',
      policeStation: 'Sector 5 Police Station',
      incidentDate: '',
      incidentLocation: '',
      complainant: '',
      accused: '',
      ipcSections: [],
      evidence: [],
      witnesses: [],
      investigationSummary: '',
      status: 'Under Investigation',
      priority: 'Medium'
    });
    setSearchQuery('');
    setSelectedSections([]);
    setChargesheet(null);
  };

  const openLegalDatabase = () => {
    onClose();
    setTimeout(() => {
      router.push('./components/LegalDatabaseScreen');
    }, 300);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Enhanced Header */}
        <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>AI Chargesheet Generator</Text>
              <Text style={styles.subtitle}>Multi-agent AI workflow for legal document generation</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          {/* AI Agent Status */}
          <View style={styles.aiStatus}>
            <View style={styles.aiAgent}>
              <Brain size={14} color="#10B981" />
              <Text style={styles.aiAgentText}>Data Collector: Ready</Text>
            </View>
            <View style={styles.aiAgent}>
              <Zap size={14} color="#10B981" />
              <Text style={styles.aiAgentText}>Legal AI: Online</Text>
            </View>
            <View style={styles.aiAgent}>
              <Target size={14} color="#10B981" />
              <Text style={styles.aiAgentText}>Validator: Active</Text>
            </View>
          </View>
        </LinearGradient>

        <Animated.View style={[styles.progressContainer, animatedStyle]}>
          {['search', 'details', 'review', 'generating', 'preview'].map((s, index) => (
            <View key={s} style={styles.progressStep}>
              <View
                style={[
                  styles.stepDot,
                  step === s && styles.activeStepDot,
                  ['generating', 'preview'].includes(step) && index <= 3 && styles.completedStepDot,
                ]}
              >
                {['generating', 'preview'].includes(step) && index <= 3 ? (
                  <CheckCircle size={12} color="#ffffff" />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, step === s && styles.activeStepLabel]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </View>
          ))}
        </Animated.View>

        <ScrollView style={styles.content}>
          {/* Step 1: Case Search */}
          {step === 'search' && (
            <Animated.View style={[styles.stepContent, animatedStyle]}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Find Case</Text>
                <TouchableOpacity style={styles.legalDbButton} onPress={openLegalDatabase}>
                  <BookOpen size={16} color="#7C3AED" />
                  <Text style={styles.legalDbText}>Legal Database</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.stepDescription}>
                Enter Case ID or FIR number to load case details
              </Text>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Enter Case ID (e.g., FIR/2024/001234) or FIR Number"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity 
                  style={[styles.searchButton, (!searchQuery || isLoading) && styles.searchButtonDisabled]} 
                  onPress={handleSearch}
                  disabled={isLoading || !searchQuery}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Search size={20} color="#ffffff" />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Recent Cases</Text>
              {caseDatabase.map((caseItem) => (
                <TouchableOpacity
                  key={caseItem.caseId}
                  style={styles.caseItem}
                  onPress={() => {
                    setSearchQuery(caseItem.caseId);
                    handleSearch();
                  }}
                >
                  <FileText size={16} color="#7C3AED" />
                  <View style={styles.caseInfo}>
                    <Text style={styles.caseId}>{caseItem.caseId}</Text>
                    <Text style={styles.caseDetails}>{caseItem.incidentLocation}</Text>
                    <Text style={styles.caseStatus}>{caseItem.status}</Text>
                  </View>
                  <ChevronRight size={16} color="#64748b" />
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          {/* Step 2: Case Details - Enhanced with categories */}
          {step === 'details' && (
            <Animated.View style={[styles.stepContent, animatedStyle]}>
              <Text style={styles.stepTitle}>Case Details & IPC Sections</Text>
              
              <View style={styles.caseSummary}>
                <View style={styles.caseHeader}>
                  <Text style={styles.caseSummaryTitle}>Case: {caseData.caseId}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: caseData.priority === 'High' ? '#EF4444' : '#F59E0B' }]}>
                    <Text style={styles.priorityText}>{caseData.priority} Priority</Text>
                  </View>
                </View>
                <View style={styles.caseDetail}>
                  <MapPin size={16} color="#64748b" />
                  <Text style={styles.caseDetailText}>{caseData.incidentLocation}</Text>
                </View>
                <View style={styles.caseDetail}>
                  <Clock size={16} color="#64748b" />
                  <Text style={styles.caseDetailText}>{caseData.incidentDate}</Text>
                </View>
                <View style={styles.caseDetail}>
                  <User size={16} color="#64748b" />
                  <Text style={styles.caseDetailText}>Complainant: {caseData.complainant}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Select IPC Sections</Text>
              
              {/* Category Filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      activeCategory === category && styles.activeCategoryChip,
                    ]}
                    onPress={() => setActiveCategory(category)}
                  >
                    <Text style={[
                      styles.categoryText,
                      activeCategory === category && styles.activeCategoryText,
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={styles.sectionsGrid} showsVerticalScrollIndicator={false}>
                {filteredSections.map((section) => (
                  <TouchableOpacity
                    key={section.code}
                    style={[
                      styles.sectionCard,
                      selectedSections.includes(section.code) && styles.selectedSectionCard,
                    ]}
                    onPress={() => handleSectionToggle(section.code)}
                  >
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionCode}>{section.code}</Text>
                      {selectedSections.includes(section.code) && (
                        <CheckCircle size={16} color="#10B981" />
                      )}
                    </View>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionPunishment}>{section.punishment}</Text>
                    <View style={styles.sectionCategory}>
                      <Text style={styles.sectionCategoryText}>{section.category}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.sectionTitle}>Investigation Summary</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter detailed investigation summary, evidence collected, witness statements, legal basis, etc."
                multiline
                numberOfLines={6}
                value={caseData.investigationSummary}
                onChangeText={(text) => setCaseData({ ...caseData, investigationSummary: text })}
                placeholderTextColor="#94a3b8"
              />

              <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => setStep('review')}
                disabled={selectedSections.length === 0}
              >
                <LinearGradient 
                  colors={selectedSections.length === 0 ? ['#9CA3AF', '#6B7280'] : ['#7C3AED', '#5B21B6']} 
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueButtonText}>
                    {selectedSections.length > 0 ? 
                      `Review ${selectedSections.length} Sections` : 
                      'Select IPC Sections'
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Step 3: Review - Enhanced with AI insights */}
          {step === 'review' && (
            <Animated.View style={[styles.stepContent, animatedStyle]}>
              <Text style={styles.stepTitle}>Review Case Details</Text>
              
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>Case Information</Text>
                <View style={styles.reviewGrid}>
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewLabel}>Case ID:</Text>
                    <Text style={styles.reviewValue}>{caseData.caseId}</Text>
                  </View>
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewLabel}>FIR Number:</Text>
                    <Text style={styles.reviewValue}>{caseData.firNumber}</Text>
                  </View>
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewLabel}>Police Station:</Text>
                    <Text style={styles.reviewValue}>{caseData.policeStation}</Text>
                  </View>
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewLabel}>Incident Date:</Text>
                    <Text style={styles.reviewValue}>{caseData.incidentDate}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>Selected IPC Sections ({selectedSections.length})</Text>
                {selectedSections.map((section, index) => {
                  const sectionData = IPC_SECTIONS.find(s => s.code === section);
                  return (
                    <View key={index} style={styles.sectionItem}>
                      <Scale size={16} color="#7C3AED" />
                      <View style={styles.sectionInfo}>
                        <Text style={styles.sectionText}>{section}</Text>
                        {sectionData && <Text style={styles.sectionSubtext}>{sectionData.title}</Text>}
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.aiAgentCard}>
                <View style={styles.aiAgentHeader}>
                  <Brain size={20} color="#7C3AED" />
                  <Text style={styles.aiAgentTitle}>AI Legal Assistant Ready</Text>
                </View>
                <Text style={styles.aiAgentDescription}>
                  The following specialized AI agents will process your case:
                </Text>
                <View style={styles.agentList}>
                  <View style={styles.agentItem}>
                    <View style={styles.agentIcon}>
                      <Search size={14} color="#ffffff" />
                    </View>
                    <Text style={styles.agentText}>Data Collector: Case details extraction</Text>
                  </View>
                  <View style={styles.agentItem}>
                    <View style={styles.agentIcon}>
                      <BookOpen size={14} color="#ffffff" />
                    </View>
                    <Text style={styles.agentText}>Legal Retriever: IPC section matching</Text>
                  </View>
                  <View style={styles.agentItem}>
                    <View style={styles.agentIcon}>
                      <FileText size={14} color="#ffffff" />
                    </View>
                    <Text style={styles.agentText}>Drafting Agent: Chargesheet generation</Text>
                  </View>
                  <View style={styles.agentItem}>
                    <View style={styles.agentIcon}>
                      <CheckCircle size={14} color="#ffffff" />
                    </View>
                    <Text style={styles.agentText}>Validator Agent: Completeness check</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
                <LinearGradient colors={['#10B981', '#059669']} style={styles.generateGradient}>
                  <Zap size={20} color="#ffffff" />
                  <Text style={styles.generateButtonText}>Generate Chargesheet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Step 4: Generating - Enhanced animation */}
          {step === 'generating' && (
            <View style={styles.stepContent}>
              <View style={styles.generatingContainer}>
                <ActivityIndicator size="large" color="#7C3AED" />
                <Text style={styles.generatingTitle}>AI Agents Processing...</Text>
                <Text style={styles.generatingSubtitle}>Analyzing case details and legal provisions</Text>
                
                <View style={styles.agentProgress}>
                  <View style={styles.agentStep}>
                    <CheckCircle size={20} color="#10B981" />
                    <Text style={styles.agentStepText}>Data Collection Complete</Text>
                  </View>
                  <View style={styles.agentStep}>
                    <CheckCircle size={20} color="#10B981" />
                    <Text style={styles.agentStepText}>Legal Research Done</Text>
                  </View>
                  <View style={styles.agentStep}>
                    <ActivityIndicator size="small" color="#7C3AED" />
                    <Text style={styles.agentStepText}>Drafting Chargesheet</Text>
                  </View>
                  <View style={styles.agentStep}>
                    <Clock size={20} color="#94a3b8" />
                    <Text style={styles.agentStepText}>Final Validation</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Step 5: Preview - Enhanced with AI insights */}
          {step === 'preview' && chargesheet && (
            <Animated.View style={[styles.stepContent, animatedStyle]}>
              <View style={styles.previewHeader}>
                <View>
                  <Text style={styles.previewTitle}>Chargesheet Preview</Text>
                  <Text style={styles.previewSubtitle}>Generated by AI Legal Assistant</Text>
                </View>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{chargesheet.confidence}% Confidence</Text>
                </View>
              </View>

              {chargesheet.missingFields.length > 0 && (
                <View style={styles.warningCard}>
                  <AlertCircle size={20} color="#F59E0B" />
                  <View style={styles.warningContent}>
                    <Text style={styles.warningTitle}>Review Required</Text>
                    <Text style={styles.warningText}>
                      The following information needs attention: {chargesheet.missingFields.join(', ')}
                    </Text>
                  </View>
                </View>
              )}

              {chargesheet.aiInsights.length > 0 && (
                <View style={styles.insightsCard}>
                  <View style={styles.insightsHeader}>
                    <Brain size={16} color="#7C3AED" />
                    <Text style={styles.insightsTitle}>AI Legal Insights</Text>
                  </View>
                  {chargesheet.aiInsights.map((insight, index) => (
                    <Text key={index} style={styles.insightText}>• {insight}</Text>
                  ))}
                </View>
              )}

              <ScrollView style={styles.previewContent}>
                <Text style={styles.chargesheetText}>{chargesheet.content}</Text>
              </ScrollView>

              <View style={styles.previewActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => setStep('details')}>
                  <Edit3 size={16} color="#7C3AED" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.exportButton} onPress={() => handleExport('pdf')}>
                  <Download size={16} color="#ffffff" />
                  <Text style={styles.exportButtonText}>PDF</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.exportButton} onPress={() => handleExport('docx')}>
                  <Download size={16} color="#ffffff" />
                  <Text style={styles.exportButtonText}>DOCX</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
                  <CheckCircle size={16} color="#ffffff" />
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  aiStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  aiAgent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiAgentText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepDot: {
    backgroundColor: '#7C3AED',
  },
  completedStepDot: {
    backgroundColor: '#10B981',
  },
  stepNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  stepLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  activeStepLabel: {
    color: '#7C3AED',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  legalDbButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  legalDbText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  caseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  caseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  caseId: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  caseDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  caseStatus: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginTop: 2,
  },
  caseSummary: {
    backgroundColor: '#F3F0FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caseSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  caseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  caseDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCategoryChip: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  sectionsGrid: {
    maxHeight: 200,
    marginBottom: 24,
  },
  sectionCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedSectionCard: {
    backgroundColor: '#F3F0FF',
    borderColor: '#7C3AED',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionCode: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  sectionPunishment: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 8,
  },
  sectionCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionCategoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#3730A3',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  reviewGrid: {
    gap: 8,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  reviewValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  sectionSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  aiAgentCard: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  aiAgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  aiAgentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  aiAgentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#047857',
    marginBottom: 12,
  },
  agentList: {
    gap: 8,
  },
  agentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#065F46',
    flex: 1,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  generatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  generatingTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 16,
  },
  generatingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  agentProgress: {
    marginTop: 32,
    gap: 16,
  },
  agentStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentStepText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  previewSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  confidenceBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#92400E',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
  },
  insightsCard: {
    backgroundColor: '#F3F0FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  insightsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#7C3AED',
  },
  insightText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#5B21B6',
    marginBottom: 4,
    lineHeight: 16,
  },
  previewContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    maxHeight: 300,
  },
  chargesheetText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 18,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F0FF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  exportButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  approveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 12,
  },
});