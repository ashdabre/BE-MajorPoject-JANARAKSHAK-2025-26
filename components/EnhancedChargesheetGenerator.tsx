import React, { useState, useEffect, JSX } from 'react';
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
  Linking,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  Sparkles,
  Shield,
  Gavel,
  Plus,
  ArrowLeft,
  Database,
  Bookmark,
  Star,
  ExternalLink,
  Share2,
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate 
} from 'react-native-reanimated';
import { legalAIService, IPCSections } from './LegalAIService';

const { width } = Dimensions.get('window');

interface EnhancedChargesheetGeneratorProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (chargesheet: any) => void;
  initialCaseData?: any;
}

interface AISuggestedSection {
  sectionCode: string;
  relevanceScore: number;
  confidence: number;
  description: string;
  punishment: string;
  reasoning: string;
  isApplied: boolean;
  category: string;
  context?: string;
  sectionType?: string;
  bailable?: string;
  cognizable?: string;
}

interface AIVerificationResult {
  isVerified: boolean;
  confidence: number;
  missingSections: string[];
  irrelevantSections: string[];
  suggestedAdditions: AISuggestedSection[];
  warnings: string[];
  recommendations: string[];
  strategicAdvice: string[];
}

interface CaseSearchResult {
  caseId: string;
  title: string;
  incidentDescription: string;
  status: string;
  priority: string;
  policeStation: string;
  complainant: string;
}

interface GeneratedChargesheet {
  id: string;
  caseId: string;
  title: string;
  content: string;
  status: string;
  generatedAt: string;
  confidence: number;
  appliedSections: string[];
  aiVerified: boolean;
  aiConfidence: number;
  legalDomains: string[];
  strategicAdvice: string[];
  pdfUrl?: string;
  shareableUrl?: string;
}

export default function EnhancedChargesheetGenerator({ 
  visible, 
  onClose, 
  onGenerate, 
  initialCaseData 
}: EnhancedChargesheetGeneratorProps): JSX.Element {
  const [step, setStep] = useState<'search' | 'details' | 'review' | 'generating' | 'preview'>('search');
  const [caseData, setCaseData] = useState({
    caseId: '',
    firNumber: '',
    policeStation: '',
    incidentDate: '',
    incidentLocation: '',
    complainant: '',
    accused: '',
    incidentDescription: '',
    investigationSummary: '',
    evidenceCollected: '',
    witnesses: '',
    status: 'Under Investigation',
    priority: 'Medium'
  });
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [aiSuggestedSections, setAiSuggestedSections] = useState<AISuggestedSection[]>([]);
  const [aiVerificationResult, setAiVerificationResult] = useState<AIVerificationResult | null>(null);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [caseSearchResults, setCaseSearchResults] = useState<CaseSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualCaseId, setManualCaseId] = useState('');
  const [databaseStats, setDatabaseStats] = useState<any>(null);
  const [generatedChargesheet, setGeneratedChargesheet] = useState<GeneratedChargesheet | null>(null);
  const [isUsingBackend, setIsUsingBackend] = useState<boolean | null>(null);
  const [manualSectionInput, setManualSectionInput] = useState('');

  // Mock case database for search
  const caseDatabase: CaseSearchResult[] = [
    {
      caseId: 'FIR/2024/001234',
      title: 'Theft Investigation',
      incidentDescription: 'Theft of laptop and mobile phone from office premises during night. CCTV shows unknown suspect breaking in through window. Estimated loss: ₹85,000.',
      status: 'Active',
      priority: 'High',
      policeStation: 'Sector 5 Police Station',
      complainant: 'Priya Sharma'
    },
    {
      caseId: 'FIR/2024/001235',
      title: 'Fraud Case',
      incidentDescription: 'Online job fraud where victims were cheated of registration fees. Accused promised high-paying jobs but disappeared after collecting fees.',
      status: 'Investigation',
      priority: 'Medium',
      policeStation: 'Sector 5 Police Station',
      complainant: 'Rahul Verma'
    },
    {
      caseId: 'FIR/2024/001236',
      title: 'Assault Case',
      incidentDescription: 'Physical assault resulting in grievous hurt. Attack occurred during public altercation. Weapon used: iron rod.',
      status: 'Active',
      priority: 'High',
      policeStation: 'Sector 5 Police Station',
      complainant: 'Sanjay Kumar'
    },
    {
      caseId: 'FIR/2024/001237',
      title: 'Cyber Crime',
      incidentDescription: 'Online banking fraud through phishing emails. Multiple victims lost money through unauthorized transactions.',
      status: 'Investigation',
      priority: 'High',
      policeStation: 'Cyber Crime Cell',
      complainant: 'Multiple Victims'
    }
  ];

  useEffect(() => {
    if (initialCaseData) {
      setCaseData({
        caseId: initialCaseData.caseId || '',
        firNumber: initialCaseData.firNumber || `FIR-${initialCaseData.caseId?.split('/').pop()}`,
        policeStation: initialCaseData.policeStation || 'Sector 5 Police Station',
        incidentDate: initialCaseData.incidentDate || '2024-01-15',
        incidentLocation: initialCaseData.incidentLocation || '',
        complainant: initialCaseData.complainant || '',
        accused: initialCaseData.accused || '',
        incidentDescription: initialCaseData.incidentDescription || '',
        investigationSummary: initialCaseData.investigationSummary || '',
        evidenceCollected: initialCaseData.evidenceCollected || '',
        witnesses: initialCaseData.witnessesList || '',
        status: initialCaseData.status || 'Under Investigation',
        priority: initialCaseData.priority || 'Medium'
      });
      setStep('details');
    }
    loadDatabaseStats();
  }, [initialCaseData]);

  const loadDatabaseStats = async () => {
    try {
      const stats = legalAIService.getDatabaseStatistics();
      setDatabaseStats(stats);
    } catch (error) {
      console.error('Error loading database stats:', error);
      setDatabaseStats({
        totalSections: 150,
        categoriesCovered: 12,
        lawsCovered: ['IPC', 'CrPC', 'Evidence Act'],
        coverage: 'Comprehensive IPC Database'
      });
    }
  };

  const handleCaseSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Search Required', 'Please enter Case ID or title to search');
      return;
    }

    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = caseDatabase.filter(caseItem => 
        caseItem.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.incidentDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setCaseSearchResults(results);
      
      if (results.length === 0) {
        Alert.alert('No Cases Found', 'No matching cases found. You can create a new case manually.');
      }
    } catch (error) {
      Alert.alert('Search Failed', 'Could not search cases. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCaseSelect = (caseItem: CaseSearchResult) => {
    setCaseData({
      caseId: caseItem.caseId,
      firNumber: `FIR-${caseItem.caseId.split('/').pop()}`,
      policeStation: caseItem.policeStation,
      incidentDate: '2024-01-15',
      incidentLocation: 'To be specified',
      complainant: caseItem.complainant,
      accused: 'Unknown',
      incidentDescription: caseItem.incidentDescription,
      investigationSummary: 'Investigation in progress...',
      evidenceCollected: 'Evidence collection ongoing...',
      witnesses: 'Witness statements being recorded...',
      status: caseItem.status,
      priority: caseItem.priority
    });
    setStep('details');
    setCaseSearchResults([]);
    setSearchQuery('');
  };

  const handleCreateNewCase = () => {
    if (!manualCaseId.trim()) {
      Alert.alert('Case ID Required', 'Please enter a Case ID for the new case');
      return;
    }

    setCaseData({
      caseId: manualCaseId,
      firNumber: `FIR-${manualCaseId.split('/').pop()}`,
      policeStation: 'Sector 5 Police Station',
      incidentDate: new Date().toISOString().split('T')[0],
      incidentLocation: '',
      complainant: '',
      accused: '',
      incidentDescription: '',
      investigationSummary: '',
      evidenceCollected: '',
      witnesses: '',
      status: 'Under Investigation',
      priority: 'Medium'
    });
    setStep('details');
    setManualCaseId('');
  };

  const handleAddManualSection = () => {
    if (!manualSectionInput.trim()) {
      Alert.alert('Input Required', 'Please enter an IPC section');
      return;
    }

    // Validate section format (e.g., "IPC 420" or "420")
    const sectionMatch = manualSectionInput.match(/(IPC\s*)?(\d+[A-Z]*)/i);
    if (!sectionMatch) {
      Alert.alert('Invalid Format', 'Please enter section in format: "IPC 420" or "420"');
      return;
    }

    const sectionNumber = sectionMatch[2];
    const fullSectionCode = `IPC ${sectionNumber}`;

    // Check if section exists in database
    const sectionExists = IPCSections[sectionNumber];
    
    if (!sectionExists) {
      Alert.alert(
        'Section Not Found', 
        `IPC ${sectionNumber} not found in database. Would you like to add it anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add Anyway', 
            onPress: () => {
              if (!selectedSections.includes(fullSectionCode)) {
                setSelectedSections(prev => [...prev, fullSectionCode]);
                setManualSectionInput('');
                Alert.alert('Success', `Added ${fullSectionCode} manually`);
              }
            }
          }
        ]
      );
      return;
    }

    if (!selectedSections.includes(fullSectionCode)) {
      setSelectedSections(prev => [...prev, fullSectionCode]);
      setManualSectionInput('');
      Alert.alert('Success', `Added ${fullSectionCode}`);
    } else {
      Alert.alert('Already Added', `${fullSectionCode} is already selected`);
    }
  };

  // Enhanced AI Legal Agent Analysis with Backend First Approach
  const handleAISuggestion = async () => {
    if (!caseData.incidentDescription) {
      Alert.alert('Input Required', 'Please provide incident description for AI analysis');
      return;
    }

    setIsAIAnalyzing(true);
    setIsUsingBackend(null);
    
    try {
      // Try backend first
      console.log('🔄 Trying backend AI analysis...');
      const backendResult = await legalAIService.analyzeCaseWithBackend(caseData.incidentDescription);
      
      if (backendResult && backendResult.sections && backendResult.sections.length > 0) {
        console.log('✅ Backend analysis successful');
        setIsUsingBackend(true);
        
        const enhancedSuggestions: AISuggestedSection[] = backendResult.sections.map((section: any) => ({
          sectionCode: section.code,
          relevanceScore: section.relevance,
          confidence: section.confidence,
          description: section.description,
          punishment: section.punishment,
          reasoning: section.reasoning || _generateSectionReasoning(section.code, caseData.incidentDescription),
          isApplied: false,
          category: section.category,
          context: section.context,
          sectionType: section.sectionType,
          bailable: section.bailable,
          cognizable: section.cognizable
        }));

        setAiSuggestedSections(enhancedSuggestions);
        
        Alert.alert(
          '🤖 AI Analysis Complete', 
          `Backend Legal AI found ${enhancedSuggestions.length} relevant IPC sections with ${Math.round(backendResult.confidence * 100)}% confidence`
        );
      } else {
        throw new Error('Backend returned empty result');
      }
    } catch (backendError) {
      console.log('⚠️ Backend failed, using local analysis:', backendError);
      setIsUsingBackend(false);
      
      // Fallback to local analysis
      try {
        const localSuggestions = await legalAIService.analyzeCase(caseData.incidentDescription);
        
        const enhancedSuggestions: AISuggestedSection[] = localSuggestions.sections.map(section => ({
          sectionCode: section.code,
          relevanceScore: section.relevance,
          confidence: section.confidence,
          description: section.description,
          punishment: section.punishment,
          reasoning: _generateSectionReasoning(section.code, caseData.incidentDescription),
          isApplied: false,
          category: section.category,
          context: section.context,
          sectionType: section.sectionType,
          bailable: section.bailable,
          cognizable: section.cognizable
        }));

        setAiSuggestedSections(enhancedSuggestions);
        
        Alert.alert(
          '🤖 AI Analysis Complete (Local)', 
          `Local Legal AI found ${enhancedSuggestions.length} relevant IPC sections with ${Math.round(localSuggestions.confidence * 100)}% confidence`
        );
      } catch (localError) {
        console.error('Both backend and local analysis failed:', localError);
        Alert.alert('Analysis Failed', 'AI analysis could not be completed. Please try again.');
      }
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  // Enhanced AI Verification with Backend First Approach
  const handleAIVerification = async () => {
    if (selectedSections.length === 0) {
      Alert.alert('No Sections Selected', 'Please select IPC sections for verification');
      return;
    }

    setIsAIAnalyzing(true);
    
    try {
      // Use only user-selected sections for verification
      const verificationResult = await legalAIService.verifySections(
        caseData.incidentDescription, 
        selectedSections // Only the sections user actually selected
      );
      
      // Process verification result...
      const enhancedVerification: AIVerificationResult = {
        isVerified: verificationResult.isAppropriate,
        confidence: verificationResult.confidence,
        missingSections: verificationResult.missingSections,
        irrelevantSections: verificationResult.irrelevantSections,
        suggestedAdditions: verificationResult.suggestions.map(suggestion => {
          const sectionCode = suggestion.split(' ')[1];
          const section = IPCSections[sectionCode];
          return {
            sectionCode: suggestion,
            relevanceScore: 0.8,
            confidence: 0.75,
            description: section?.description || 'Important legal provision',
            punishment: section?.punishment || 'Refer to IPC',
            reasoning: 'AI suggests this section based on comprehensive case analysis',
            isApplied: selectedSections.includes(suggestion), // Check if already selected
            category: section?.category || 'General'
          };
        }),
        warnings: verificationResult.warnings,
        recommendations: verificationResult.recommendations,
        strategicAdvice: verificationResult.strategicAdvice
      };

      setAiVerificationResult(enhancedVerification);
      
      // Show appropriate alert
      if (enhancedVerification.isVerified) {
        Alert.alert('✅ AI Verification Passed', `Selected ${selectedSections.length} sections are appropriate for this case`);
      } else {
        Alert.alert('⚠️ Review Required', 'AI suggests reviewing some applied sections');
      }
    } catch (error) {
      Alert.alert('Verification Failed', 'AI verification could not be completed');
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  const _generateSectionReasoning = (sectionCode: string, incidentDescription: string): string => {
    const reasoningMap: { [key: string]: string } = {
      'IPC 379': 'Case involves unlawful taking of movable property without consent',
      'IPC 380': 'Theft occurred in a building used for custody of property',
      'IPC 381': 'Theft by person in position of trust or employment',
      'IPC 382': 'Theft with preparation for causing death/hurt',
      'IPC 383': 'Extortion by putting person in fear of injury',
      'IPC 384': 'Punishment for extortion',
      'IPC 420': 'Involves deception and dishonest inducement for unlawful gain',
      'IPC 406': 'Criminal breach of trust involving entrusted property',
      'IPC 407': 'Criminal breach of trust by carrier etc.',
      'IPC 408': 'Criminal breach of trust by clerk or servant',
      'IPC 409': 'Criminal breach of trust by public servant',
      'IPC 323': 'Evidence of voluntary causing hurt causing bodily injury',
      'IPC 324': 'Voluntarily causing hurt by dangerous weapons or means',
      'IPC 325': 'Voluntarily causing grievous hurt with dangerous means',
      'IPC 326': 'Voluntarily causing grievous hurt by dangerous weapons',
      'IPC 34': 'Multiple accused acting with common intention in commission of crime',
      'IPC 120B': 'Evidence of criminal conspiracy and prior agreement',
      'IPC 354': 'Assault or criminal force with intent to outrage modesty',
      'IPC 354A': 'Sexual harassment and unwelcome physical contact',
      'IPC 354B': 'Assault with intent to disrobe',
      'IPC 354C': 'Voyeurism - capturing images of private acts',
      'IPC 354D': 'Stalking and following against will',
      'IPC 376': 'Sexual intercourse without consent constituting rape',
      'IPC 506': 'Criminal intimidation with threat to cause alarm',
    };
    
    return reasoningMap[sectionCode] || 'Relevant based on incident description analysis';
  };

  const handleApplyAISuggestion = (sectionCode: string) => {
    // Only add if not already selected
    if (!selectedSections.includes(sectionCode)) {
      setSelectedSections(prev => [...prev, sectionCode]);
      setAiSuggestedSections(prev => 
        prev.map(section => 
          section.sectionCode === sectionCode 
            ? { ...section, isApplied: true }
            : section
        )
      );
    } else {
      // If already selected, remove it
      handleRemoveSection(sectionCode);
    }
  };

  // FIX: Only apply sections that are not already selected
  const handleApplyAllAISuggestions = () => {
    const sectionsToApply = aiSuggestedSections
      .filter(section => 
        section.relevanceScore > 0.6 && 
        !selectedSections.includes(section.sectionCode)
      )
      .map(section => section.sectionCode);
    
    if (sectionsToApply.length === 0) {
      Alert.alert('Info', 'All high-relevance sections are already applied or none meet the threshold.');
      return;
    }
    
    setSelectedSections(prev => [...prev, ...sectionsToApply]);
    
    // Update AI suggestions to mark as applied
    setAiSuggestedSections(prev => 
      prev.map(section => ({
        ...section, 
        isApplied: sectionsToApply.includes(section.sectionCode) ? true : section.isApplied
      }))
    );
    
    Alert.alert(
      'Sections Applied', 
      `Applied ${sectionsToApply.length} high-relevance sections`
    );
  };

  const handleRemoveSection = (sectionCode: string) => {
    setSelectedSections(prev => prev.filter(s => s !== sectionCode));
    setAiSuggestedSections(prev => 
      prev.map(section => 
        section.sectionCode === sectionCode 
          ? { ...section, isApplied: false }
          : section
      )
    );
  };

  const handleGenerateChargesheet = async () => {
    if (selectedSections.length === 0) {
      Alert.alert('No Sections Selected', 'Please select at least one IPC section');
      return;
    }

    setStep('generating');
    
    try {
      // Generate chargesheet with ONLY selected sections
      const chargesheetData = {
        caseData,
        selectedSections, // Only user-selected sections
        aiVerificationResult,
        aiSuggestedSections: aiSuggestedSections.filter(s => selectedSections.includes(s.sectionCode))
      };

      const generatedChargesheet = await legalAIService.generateChargesheet(chargesheetData);
      
      const completeChargesheet: GeneratedChargesheet = {
        id: `chargesheet_${Date.now()}`,
        caseId: caseData.caseId,
        title: `AI Chargesheet - ${caseData.caseId}`,
        content: generatedChargesheet.content,
        status: 'draft',
        generatedAt: new Date().toLocaleString(),
        confidence: generatedChargesheet.confidence,
        appliedSections: selectedSections, // Use only selected sections
        aiVerified: generatedChargesheet.aiVerified,
        aiConfidence: generatedChargesheet.aiConfidence,
        legalDomains: generatedChargesheet.legalDomains,
        strategicAdvice: generatedChargesheet.strategicAdvice,
        pdfUrl: generatedChargesheet.pdfUrl,
        shareableUrl: generatedChargesheet.shareableUrl
      };
      
      setGeneratedChargesheet(completeChargesheet);
      setStep('preview');
      
      // Pass to parent component for storage
      onGenerate(completeChargesheet);
      
    } catch (error) {
      Alert.alert('Generation Failed', 'Could not generate chargesheet');
      setStep('review');
    }
  };

  const generateChargesheetContent = (data: any, sections: string[]) => {
    return `
IN THE COURT OF JUDICIAL MAGISTRATE, BANGALORE
CHARGE SHEET

Case No: ${data.caseId}
FIR No: ${data.firNumber}
Police Station: ${data.policeStation}
Date of Incident: ${data.incidentDate}
U/s: ${sections.join(', ')}

COMPLAINANT:
Name: ${data.complainant}
Address: [Address to be filled]

ACCUSED:
${data.accused}
Address: [Address to be filled]

INCIDENT DESCRIPTION:
${data.incidentDescription}

INVESTIGATION SUMMARY:
${data.investigationSummary}

EVIDENCE COLLECTED:
${data.evidenceCollected}

WITNESSES:
${data.witnesses}

APPLIED IPC SECTIONS:
${sections.map(section => {
  const sectionData = IPCSections[section.split(' ')[1]];
  return `- ${section}: ${sectionData?.description || 'Legal provision'}`;
}).join('\n')}

AI VERIFICATION: ${aiVerificationResult?.isVerified ? 'PASSED' : 'REVIEW REQUIRED'}
AI CONFIDENCE LEVEL: ${aiVerificationResult ? (aiVerificationResult.confidence * 100).toFixed(1) + '%' : 'Not verified'}
STRATEGIC ADVICE:
${aiVerificationResult?.strategicAdvice?.map(advice => `• ${advice}`).join('\n') || 'No specific advice'}

INVESTIGATING OFFICER:
[Officer Name and Rank]
Station House Officer
${data.policeStation}

DATE OF FILING: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

NOTE: This chargesheet has been generated using AI-powered legal assistant with comprehensive IPC database search. Please verify all details before submission.
    `.trim();
  };

  // Enhanced Document Actions
  const handleViewChargesheet = () => {
    if (generatedChargesheet?.pdfUrl) {
      Linking.openURL(generatedChargesheet.pdfUrl).catch(err => 
        Alert.alert('Error', 'Could not open PDF: ' + err.message)
      );
    } else {
      Alert.alert(
        'Chargesheet Content', 
        generatedChargesheet?.content || 'No content available',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDownloadChargesheet = async () => {
    try {
      const success = await legalAIService.downloadChargesheetPDF(generatedChargesheet);
      if (success) {
        Alert.alert('Success', 'Chargesheet downloaded successfully');
      } else {
        Alert.alert('Info', 'Chargesheet saved locally');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Download failed: ' + error.message);
    }
  };

  const handleShareChargesheet = async () => {
    try {
      const shareResult = await Share.share({
        title: `Chargesheet - ${generatedChargesheet?.caseId}`,
        message: `Check out this chargesheet for case ${generatedChargesheet?.caseId}`,
        url: generatedChargesheet?.shareableUrl
      });
      
      if (shareResult.action === Share.sharedAction) {
        console.log('Chargesheet shared successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Share failed: ' + error.message);
    }
  };

  const handleOpenInBrowser = () => {
    if (generatedChargesheet?.shareableUrl) {
      Linking.openURL(generatedChargesheet.shareableUrl).catch(err =>
        Alert.alert('Error', 'Could not open in browser: ' + err.message)
      );
    } else {
      Alert.alert('Info', 'No shareable URL available for this chargesheet');
    }
  };

  // Render Methods
  const renderSearchStep = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Search or Create Case</Text>
      <Text style={styles.stepDescription}>
        Search existing cases or create a new case for chargesheet generation
      </Text>

      {/* Backend Status Indicator */}
      <View style={styles.backendStatus}>
        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot,
            isUsingBackend === true ? styles.statusOnline : 
            isUsingBackend === false ? styles.statusOffline : styles.statusUnknown
          ]} />
          <Text style={styles.statusText}>
            {isUsingBackend === true ? 'Backend Connected' : 
             isUsingBackend === false ? 'Using Local AI' : 'Checking Connection...'}
          </Text>
        </View>
      </View>

      {/* Database Statistics */}
      {databaseStats && (
        <View style={styles.databaseStats}>
          <View style={styles.statsHeader}>
            <Database size={20} color="#7C3AED" />
            <Text style={styles.statsTitle}>Legal Database Status</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{databaseStats.totalSections}</Text>
              <Text style={styles.statLabel}>IPC Sections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{databaseStats.categoriesCovered}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{databaseStats.lawsCovered?.length || 3}</Text>
              <Text style={styles.statLabel}>Laws Covered</Text>
            </View>
          </View>
          <Text style={styles.statsSubtitle}>{databaseStats.coverage || 'Comprehensive IPC Database'}</Text>
        </View>
      )}

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Search Existing Cases</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Case ID, title or description..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleCaseSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Search size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>

        {caseSearchResults.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.resultsTitle}>Found {caseSearchResults.length} cases:</Text>
            {caseSearchResults.map((caseItem) => (
              <TouchableOpacity
                key={caseItem.caseId}
                style={styles.caseResultCard}
                onPress={() => handleCaseSelect(caseItem)}
              >
                <View style={styles.caseResultHeader}>
                  <Text style={styles.caseResultId}>{caseItem.caseId}</Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: caseItem.priority === 'High' ? '#ef4444' : '#f59e0b' }
                  ]}>
                    <Text style={styles.priorityText}>{caseItem.priority}</Text>
                  </View>
                </View>
                <Text style={styles.caseResultTitle}>{caseItem.title}</Text>
                <Text style={styles.caseResultDescription} numberOfLines={2}>
                  {caseItem.incidentDescription}
                </Text>
                <View style={styles.caseResultFooter}>
                  <Text style={styles.caseResultStation}>{caseItem.policeStation}</Text>
                  <Text style={styles.caseResultStatus}>{caseItem.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Create New Case Section */}
      <View style={styles.createSection}>
        <Text style={styles.sectionTitle}>Create New Case</Text>
        <Text style={styles.createDescription}>
          Enter a new Case ID to create a chargesheet for a fresh case
        </Text>
        <TextInput
          style={styles.manualInput}
          placeholder="Enter Case ID (e.g., FIR/2024/001238)"
          value={manualCaseId}
          onChangeText={setManualCaseId}
        />
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateNewCase}
          disabled={!manualCaseId.trim()}
        >
          <LinearGradient colors={['#10B981', '#059669']} style={styles.createGradient}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.createButtonText}>Create New Case</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick Access Cases */}
      <View style={styles.quickAccessSection}>
        <Text style={styles.sectionTitle}>Quick Access Cases</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickCaseList}>
          {caseDatabase.slice(0, 3).map((caseItem) => (
            <TouchableOpacity
              key={caseItem.caseId}
              style={styles.quickCaseCard}
              onPress={() => handleCaseSelect(caseItem)}
            >
              <LinearGradient colors={['#f0f7ff', '#e0e7ff']} style={styles.quickCaseGradient}>
                <Text style={styles.quickCaseId}>{caseItem.caseId}</Text>
                <Text style={styles.quickCaseTitle}>{caseItem.title}</Text>
                <Text style={styles.quickCaseDescription} numberOfLines={2}>
                  {caseItem.incidentDescription}
                </Text>
                <View style={styles.quickCaseStatus}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: caseItem.priority === 'High' ? '#ef4444' : '#f59e0b' }
                  ]} />
                  <Text style={styles.quickCaseStatusText}>{caseItem.status}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  const renderDetailsStep = () => (
    <ScrollView style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep('search')}
        >
          <ArrowLeft size={20} color="#64748b" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepTitle}>Case Details</Text>
      </View>

      <Text style={styles.stepDescription}>
        Review and edit case details. The AI will analyze the incident description to suggest relevant IPC sections.
      </Text>

      {/* Case Summary */}
      <View style={styles.caseSummary}>
        <View style={styles.caseHeader}>
          <Text style={styles.caseSummaryTitle}>{caseData.caseId || 'Case Details'}</Text>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: caseData.priority === 'High' ? '#ef4444' : '#f59e0b' }
          ]}>
            <Text style={styles.priorityText}>{caseData.priority}</Text>
          </View>
        </View>
        <Text style={styles.caseDetail}><Text style={{fontWeight: 'bold'}}>Case ID:</Text> {caseData.caseId}</Text>
        <Text style={styles.caseDetail}><Text style={{fontWeight: 'bold'}}>FIR No:</Text> {caseData.firNumber}</Text>
        <Text style={styles.caseDetail}><Text style={{fontWeight: 'bold'}}>Police Station:</Text> {caseData.policeStation}</Text>
        <Text style={styles.caseDetail}><Text style={{fontWeight: 'bold'}}>Complainant:</Text> {caseData.complainant}</Text>
      </View>

      {/* Incident Details Form */}
      <Text style={styles.sectionTitle}>Incident Description *</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Provide detailed description of the incident, including date, time, location, involved parties, and what happened..."
        value={caseData.incidentDescription}
        onChangeText={(text) => setCaseData(prev => ({ ...prev, incidentDescription: text }))}
        multiline
        numberOfLines={6}
      />

      <Text style={styles.sectionTitle}>Investigation Summary</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Summary of investigation findings, evidence collected, and current status..."
        value={caseData.investigationSummary}
        onChangeText={(text) => setCaseData(prev => ({ ...prev, investigationSummary: text }))}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.sectionTitle}>Evidence Collected</Text>
      <TextInput
        style={styles.textArea}
        placeholder="List all evidence collected (CCTV, documents, weapons, digital evidence, etc.)..."
        value={caseData.evidenceCollected}
        onChangeText={(text) => setCaseData(prev => ({ ...prev, evidenceCollected: text }))}
        multiline
        numberOfLines={4}
      />

      {/* AI Analysis Button */}
      <TouchableOpacity 
        style={[styles.aiAnalyzeButton, !caseData.incidentDescription && styles.disabledButton]}
        onPress={handleAISuggestion}
        disabled={!caseData.incidentDescription || isAIAnalyzing}
      >
        <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.aiAnalyzeGradient}>
          {isAIAnalyzing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Brain size={20} color="#ffffff" />
          )}
          <Text style={styles.aiAnalyzeText}>
            {isAIAnalyzing ? 'AI Analyzing...' : 'Analyze with Legal AI'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity 
        style={[styles.continueButton, (!caseData.incidentDescription || aiSuggestedSections.length === 0) && styles.disabledButton]}
        onPress={() => setStep('review')}
        disabled={!caseData.incidentDescription || aiSuggestedSections.length === 0}
      >
        <LinearGradient colors={['#10B981', '#059669']} style={styles.continueGradient}>
          <Text style={styles.continueButtonText}>Continue to Review</Text>
          <ChevronRight size={20} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderReviewStep = () => (
    <ScrollView style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep('details')}
        >
          <ArrowLeft size={20} color="#64748b" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepTitle}>Review & Verify</Text>
      </View>

      <Text style={styles.stepDescription}>
        Review AI-suggested IPC sections and verify their applicability to your case.
      </Text>

      {/* Case Summary */}
      <View style={styles.reviewSummary}>
        <Text style={styles.reviewSummaryTitle}>Case Summary</Text>
        <Text style={styles.reviewText}><Text style={{fontWeight: 'bold'}}>Case:</Text> {caseData.caseId}</Text>
        <Text style={styles.reviewText}><Text style={{fontWeight: 'bold'}}>Incident:</Text> {caseData.incidentDescription.substring(0, 100)}...</Text>
        <Text style={styles.reviewText}><Text style={{fontWeight: 'bold'}}>Status:</Text> {caseData.status}</Text>
      </View>

      {/* AI Suggested Sections */}
      {aiSuggestedSections.length > 0 && (
        <View style={styles.aiSuggestionsContainer}>
          <View style={styles.suggestionsHeader}>
            <Text style={styles.suggestionsTitle}>AI-Suggested IPC Sections</Text>
            <Text style={styles.suggestionsSubtitle}>
              Based on analysis of incident description with {Math.max(...aiSuggestedSections.map(s => s.confidence))}% confidence
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.applyAllButton}
            onPress={handleApplyAllAISuggestions}
          >
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.applyAllText}>Apply All Suggestions</Text>
          </TouchableOpacity>

          {/* Group by category */}
          {Array.from(new Set(aiSuggestedSections.map(s => s.category))).map(category => (
            <View key={category} style={styles.categoryGroup}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {aiSuggestedSections
                .filter(section => section.category === category)
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .map((section, index) => (
                  <View key={section.sectionCode} style={styles.suggestionCard}>
                    <View style={styles.suggestionHeader}>
                      <View style={styles.sectionCodeContainer}>
                        <Text style={styles.sectionCode}>{section.sectionCode}</Text>
                        <View style={styles.confidenceBadge}>
                          <Text style={styles.confidenceText}>{Math.round(section.confidence * 100)}%</Text>
                        </View>
                      </View>
                      <View style={styles.relevanceScore}>
                        <Text style={styles.relevanceText}>Relevance: {Math.round(section.relevanceScore * 100)}%</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.sectionDescription}>{section.description}</Text>
                    <Text style={styles.punishmentText}>Punishment: {section.punishment}</Text>
                    <Text style={styles.reasoningText}>AI Reasoning: {section.reasoning}</Text>
                    
                    <TouchableOpacity 
                      style={[styles.applyButton, section.isApplied && styles.appliedButton]}
                      onPress={() => section.isApplied ? handleRemoveSection(section.sectionCode) : handleApplyAISuggestion(section.sectionCode)}
                    >
                      {section.isApplied ? (
                        <CheckCircle size={14} color="#10B981" />
                      ) : (
                        <Plus size={14} color="#7C3AED" />
                      )}
                      <Text style={[styles.applyButtonText, section.isApplied && styles.appliedButtonText]}>
                        {section.isApplied ? 'Applied' : 'Apply Section'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          ))}
        </View>
      )}

      {/* Selected Sections */}
      <Text style={styles.sectionTitle}>Selected IPC Sections</Text>
      <View style={styles.selectedSectionsContainer}>
        {selectedSections.length > 0 ? (
          selectedSections.map(section => (
            <TouchableOpacity
              key={section}
              style={styles.selectedSectionChip}
              onPress={() => handleRemoveSection(section)}
            >
              <Text style={styles.selectedSectionText}>{section}</Text>
              <X size={12} color="#64748b" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noSectionsText}>No sections selected yet. Apply AI suggestions above.</Text>
        )}
      </View>

      {/* Manual Add Section */}
      <View style={styles.manualAddContainer}>
        <TextInput
          style={[styles.manualInput, {flex: 1}]}
          placeholder="Add custom IPC section (e.g., IPC 420 or 420)"
          value={manualSectionInput}
          onChangeText={setManualSectionInput}
          onSubmitEditing={handleAddManualSection}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddManualSection}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* AI Verification */}
      <TouchableOpacity 
        style={[styles.verifyButton, selectedSections.length === 0 && styles.disabledButton]}
        onPress={handleAIVerification}
        disabled={selectedSections.length === 0 || isAIAnalyzing}
      >
        <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.verifyGradient}>
          {isAIAnalyzing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Shield size={20} color="#ffffff" />
          )}
          <Text style={styles.verifyButtonText}>
            {isAIAnalyzing ? 'Verifying...' : 'Verify with AI Legal Agent'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Verification Result */}
      {aiVerificationResult && (
        <View style={[
          styles.verificationResult,
          aiVerificationResult.isVerified ? styles.verificationPassed : styles.verificationWarning
        ]}>
          <View style={styles.verificationHeader}>
            {aiVerificationResult.isVerified ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <AlertCircle size={20} color="#D97706" />
            )}
            <Text style={styles.verificationTitle}>
              {aiVerificationResult.isVerified ? 'AI Verification Passed' : 'Review Required'}
            </Text>
          </View>
          <Text style={styles.verificationConfidence}>
            Confidence Level: {Math.round(aiVerificationResult.confidence * 100)}%
          </Text>

          {aiVerificationResult.missingSections.length > 0 && (
            <View style={styles.verificationSection}>
              <Text style={styles.verificationSectionTitle}>Missing Sections:</Text>
              {aiVerificationResult.missingSections.map((section, index) => (
                <Text key={index} style={styles.missingSectionText}>• {section}</Text>
              ))}
            </View>
          )}

          {aiVerificationResult.suggestedAdditions.length > 0 && (
            <View style={styles.verificationSection}>
              <Text style={styles.verificationSectionTitle}>Suggested Additions:</Text>
              {aiVerificationResult.suggestedAdditions.map((suggestion, index) => (
                <View key={index} style={styles.suggestedAddition}>
                  <View style={styles.suggestedSectionInfo}>
                    <Text style={styles.suggestedSectionCode}>{suggestion.sectionCode}</Text>
                    <Text style={styles.suggestedReasoning}>{suggestion.reasoning}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.addSuggestionButton}
                    onPress={() => handleApplyAISuggestion(suggestion.sectionCode)}
                  >
                    <Plus size={12} color="#7C3AED" />
                    <Text style={styles.addSuggestionText}>Add</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {aiVerificationResult.warnings.length > 0 && (
            <View style={styles.verificationSection}>
              <Text style={styles.verificationSectionTitle}>Warnings:</Text>
              {aiVerificationResult.warnings.map((warning, index) => (
                <Text key={index} style={styles.warningText}>⚠️ {warning}</Text>
              ))}
            </View>
          )}

          {aiVerificationResult.recommendations.length > 0 && (
            <View style={styles.verificationSection}>
              <Text style={styles.verificationSectionTitle}>Recommendations:</Text>
              {aiVerificationResult.recommendations.map((recommendation, index) => (
                <Text key={index} style={styles.recommendationText}>✅ {recommendation}</Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Generate Button */}
      <View style={styles.reviewActions}>
        <TouchableOpacity 
          style={[styles.generateButton, selectedSections.length === 0 && styles.disabledButton]}
          onPress={handleGenerateChargesheet}
          disabled={selectedSections.length === 0}
        >
          <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.generateGradient}>
            <FileText size={20} color="#ffffff" />
            <Text style={styles.generateButtonText}>Generate Chargesheet</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderGeneratingStep = () => (
    <View style={styles.generatingContainer}>
      <ActivityIndicator size="large" color="#7C3AED" />
      <Text style={styles.generatingTitle}>Generating Chargesheet...</Text>
      <Text style={styles.generatingSubtitle}>
        {isUsingBackend === true ? 'Using Backend AI Service' : 
         isUsingBackend === false ? 'Using Local AI Processing' : 'Initializing AI Service'}
      </Text>
      
      <View style={styles.generatingProgress}>
        <View style={styles.progressStep}>
          <CheckCircle size={20} color="#10B981" />
          <Text style={styles.progressStepText}>Case Analysis Complete</Text>
        </View>
        <View style={styles.progressStep}>
          <CheckCircle size={20} color="#10B981" />
          <Text style={styles.progressStepText}>IPC Sections Applied</Text>
        </View>
        <View style={styles.progressStep}>
          <ActivityIndicator size={20} color="#7C3AED" />
          <Text style={styles.progressStepText}>Generating Document</Text>
        </View>
        <View style={styles.progressStep}>
          <Clock size={20} color="#64748B" />
          <Text style={styles.progressStepText}>Final Review</Text>
        </View>
      </View>
    </View>
  );

  const renderPreviewStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Chargesheet Generated Successfully! 🎉</Text>
      <Text style={styles.previewSubtitle}>
        {isUsingBackend ? 'Backend AI Generated' : 'Local AI Generated'} • {generatedChargesheet?.aiConfidence}% Confidence
      </Text>
      
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewCaseId}>{generatedChargesheet?.caseId}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: generatedChargesheet?.aiVerified ? '#10B981' : '#F59E0B' }
          ]}>
            <Text style={styles.statusBadgeText}>
              {generatedChargesheet?.aiVerified ? 'AI Verified' : 'Review Required'}
            </Text>
          </View>
        </View>
        <Text style={styles.previewTitle}>{generatedChargesheet?.title}</Text>
        <Text style={styles.previewMeta}>
          {generatedChargesheet?.appliedSections.length} Sections • Generated {generatedChargesheet?.generatedAt}
        </Text>
      </View>

      <View style={styles.previewActions}>
        <TouchableOpacity style={styles.previewActionButton} onPress={handleViewChargesheet}>
          <Eye size={20} color="#667eea" />
          <Text style={styles.previewActionText}>View Full</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.previewActionButton} onPress={handleDownloadChargesheet}>
          <Download size={20} color="#10b981" />
          <Text style={styles.previewActionText}>Download PDF</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.previewActionButton} onPress={handleShareChargesheet}>
          <Share2 size={20} color="#8b5cf6" />
          <Text style={styles.previewActionText}>Share</Text>
        </TouchableOpacity>
        
        {generatedChargesheet?.shareableUrl && (
          <TouchableOpacity style={styles.previewActionButton} onPress={handleOpenInBrowser}>
            <ExternalLink size={20} color="#f59e0b" />
            <Text style={styles.previewActionText}>Open Online</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.strategicAdvice}>
        <Text style={styles.adviceTitle}>Strategic Advice</Text>
        {generatedChargesheet?.strategicAdvice.map((advice, index) => (
          <View key={index} style={styles.adviceItem}>
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.adviceText}>{advice}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.finalizeButton}
        onPress={onClose}
      >
        <LinearGradient colors={['#10B981', '#059669']} style={styles.finalizeGradient}>
          <CheckCircle size={20} color="#ffffff" />
          <Text style={styles.finalizeButtonText}>Complete & Return to Case Manager</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>AI-Powered Chargesheet Generator</Text>
              <Text style={styles.subtitle}>
                {isUsingBackend === true ? 'Enhanced Backend AI' : 
                 isUsingBackend === false ? 'Local AI Analysis' : 'AI Legal Assistant'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.aiStatus}>
            <View style={styles.aiAgent}>
              <Brain size={14} color="#10B981" />
              <Text style={styles.aiAgentText}>
                {isUsingBackend === true ? 'Backend AI: Online' : 
                 isUsingBackend === false ? 'Local AI: Active' : 'AI: Initializing'}
              </Text>
            </View>
            <View style={styles.aiAgent}>
              <Shield size={14} color="#10B981" />
              <Text style={styles.aiAgentText}>Verification: Active</Text>
            </View>
            <View style={styles.aiAgent}>
              <Sparkles size={14} color="#10B981" />
              <Text style={styles.aiAgentText}>Database: Comprehensive</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {['search', 'details', 'review', 'generating', 'preview'].map((stepName, index) => (
            <View key={stepName} style={styles.progressStep}>
              <View style={[
                styles.stepDot,
                step === stepName && styles.activeStepDot,
                ['details', 'review', 'generating', 'preview'].includes(step) && index < ['search', 'details', 'review', 'generating', 'preview'].indexOf(step) && styles.completedStepDot
              ]}>
                <Text style={styles.stepNumber}>
                  {['details', 'review', 'generating', 'preview'].includes(step) && index < ['search', 'details', 'review', 'generating', 'preview'].indexOf(step) ? (
                    <CheckCircle size={12} color="#ffffff" />
                  ) : (
                    index + 1
                  )}
                </Text>
              </View>
              <Text style={[
                styles.stepLabel,
                step === stepName && styles.activeStepLabel
              ]}>
                {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView style={styles.content}>
          {step === 'search' && renderSearchStep()}
          {step === 'details' && renderDetailsStep()}
          {step === 'review' && renderReviewStep()}
          {step === 'generating' && renderGeneratingStep()}
          {step === 'preview' && renderPreviewStep()}
        </ScrollView>

        {isAIAnalyzing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>
              {isUsingBackend === null ? 'Connecting to AI Service...' :
               isUsingBackend === true ? 'Backend AI Processing...' : 'Local AI Processing...'}
            </Text>
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
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 24,
  },
  backendStatus: {
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: '#10B981',
  },
  statusOffline: {
    backgroundColor: '#F59E0B',
  },
  statusUnknown: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  databaseStats: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3730A3',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#7C3AED',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 4,
  },
  statsSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  searchSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  searchButton: {
    backgroundColor: '#7C3AED',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResults: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    marginBottom: 12,
  },
  caseResultCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  caseResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  caseResultId: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#667eea',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  caseResultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  caseResultDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 16,
  },
  caseResultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseResultStation: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  caseResultStatus: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#f59e0b',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginHorizontal: 16,
  },
  createSection: {
    marginBottom: 24,
  },
  createDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  manualInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginBottom: 16,
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  createGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  quickAccessSection: {
    marginBottom: 24,
  },
  quickCaseList: {
    flexDirection: 'row',
  },
  quickCaseCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickCaseGradient: {
    padding: 16,
    minHeight: 140,
  },
  quickCaseId: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#667eea',
    marginBottom: 4,
  },
  quickCaseTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  quickCaseStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  quickCaseStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  quickCaseDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    lineHeight: 14,
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  caseSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  caseDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
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
    marginBottom: 16,
  },
  aiAnalyzeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  aiAnalyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  aiAnalyzeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  reviewSummary: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  reviewSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  aiSuggestionsContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  suggestionsHeader: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#065F46',
    marginBottom: 4,
  },
  suggestionsSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#047857',
  },
  applyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 16,
  },
  applyAllText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  categoryGroup: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#065F46',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
  },
  suggestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sectionCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionCode: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  confidenceBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#065F46',
  },
  relevanceScore: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  relevanceText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#92400E',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  punishmentText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 12,
    fontFamily: 'Inter-Italic',
    color: '#6B7280',
    marginBottom: 8,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 6,
  },
  appliedButton: {
    backgroundColor: '#D1FAE5',
  },
  applyButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
  },
  appliedButtonText: {
    color: '#10B981',
  },
  selectedSectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  selectedSectionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedSectionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3730A3',
  },
  noSectionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  manualAddContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  verifyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  verificationResult: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  verificationPassed: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  verificationWarning: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  verificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  verificationConfidence: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 12,
  },
  verificationSection: {
    marginBottom: 12,
  },
  verificationSectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  missingSectionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    marginBottom: 2,
  },
  irrelevantSectionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#D97706',
    marginBottom: 2,
  },
  suggestedAddition: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    gap: 8,
  },
  suggestedSectionInfo: {
    flex: 1,
  },
  suggestedSectionCode: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#7C3AED',
  },
  suggestedReasoning: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  addSuggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  addSuggestionText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#065F46',
    marginBottom: 2,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  generateButton: {
    flex: 2,
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
  generatingProgress: {
    marginTop: 32,
    gap: 16,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressStepText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  previewSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 24,
  },
  previewCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewCaseId: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#667eea',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  previewMeta: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  previewActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  previewActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  strategicAdvice: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  adviceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#065F46',
    marginBottom: 8,
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  adviceText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
  finalizeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  finalizeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  finalizeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
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