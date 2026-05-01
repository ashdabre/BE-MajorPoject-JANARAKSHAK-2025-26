import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Search,
  BookOpen,
  Scale,
  FileText,
  Clock,
  ChevronRight,
  Copy,
  Share,
  Download,
  ArrowLeft,
  Brain,
  Zap,
  Target,
  Calendar,
  User,
  MapPin,
  Eye,
  Star,
  Bookmark,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Enhanced Legal Database - More comprehensive data
export const IPCDatabase = {
  sections: [
    {
      code: 'IPC 379',
      title: 'Theft',
      description: 'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.',
      punishment: 'Imprisonment up to 3 years, or fine, or both.',
      category: 'Property Crime',
      severity: 'Medium',
      bailable: 'Yes',
      cognizable: 'Yes',
      latestAmendment: '2018',
      relatedSections: ['IPC 380', 'IPC 381', 'IPC 382'],
      landmarkCases: [
        'K.N. Mehra vs State of Rajasthan (1957)',
        'Pyare Lal Bhargava vs State of Rajasthan (1963)'
      ],
      essentialElements: [
        'Dishonest intention to take property',
        'Property must be movable',
        'Taken without consent',
        'Out of possession of another person'
      ]
    },
    {
  code: 'IPC 392',
  title: 'Robbery',
  description: 'Whoever commits robbery shall be punished with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine.',
  punishment: 'Rigorous imprisonment up to 10 years and fine.',
  category: 'Property Crime',
  severity: 'High',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018',
  relatedSections: ['IPC 390', 'IPC 394']
},
{
  code: 'IPC 394',
  title: 'Voluntarily causing hurt in committing robbery',
  description: 'If any person causes hurt while committing robbery, he shall be punished with imprisonment for life or rigorous imprisonment up to ten years and fine.',
  punishment: 'Life imprisonment or rigorous imprisonment up to 10 years and fine.',
  category: 'Violent Crime',
  severity: 'Highest',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 395',
  title: 'Dacoity',
  description: 'When five or more persons conjointly commit or attempt to commit robbery, it is dacoity.',
  punishment: 'Imprisonment for life or rigorous imprisonment up to 10 years and fine.',
  category: 'Property Crime',
  severity: 'Highest',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 396',
  title: 'Dacoity with murder',
  description: 'If any one of the dacoits commits murder during dacoity, all are liable.',
  punishment: 'Death penalty or life imprisonment, and fine.',
  category: 'Violent Crime',
  severity: 'Highest',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 307',
  title: 'Attempt to murder',
  description: 'Whoever does any act with intention or knowledge that would cause death if it resulted in death.',
  punishment: 'Imprisonment up to 10 years or life imprisonment, and fine.',
  category: 'Violent Crime',
  severity: 'High',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 304A',
  title: 'Causing death by negligence',
  description: 'Whoever causes the death of any person by negligence.',
  punishment: 'Imprisonment up to 2 years, or fine, or both.',
  category: 'Violent Crime',
  severity: 'Medium',
  bailable: 'Yes',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 364A',
  title: 'Kidnapping for ransom',
  description: 'Kidnapping or abducting any person for ransom or coercion.',
  punishment: 'Death penalty or life imprisonment and fine.',
  category: 'Violent Crime',
  severity: 'Highest',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 363',
  title: 'Kidnapping',
  description: 'Whoever kidnaps any person from lawful guardianship.',
  punishment: 'Imprisonment up to 7 years and fine.',
  category: 'Violent Crime',
  severity: 'High',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 383',
  title: 'Extortion',
  description: 'Intentionally putting any person in fear to deliver property.',
  punishment: 'Imprisonment up to 3 years, or fine, or both.',
  category: 'Property Crime',
  severity: 'Medium',
  bailable: 'Yes',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 384',
  title: 'Punishment for extortion',
  description: 'Punishment for committing extortion.',
  punishment: 'Imprisonment up to 3 years, or fine, or both.',
  category: 'Property Crime',
  severity: 'Medium',
  bailable: 'Yes',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 406',
  title: 'Criminal breach of trust',
  description: 'Misappropriating or converting property entrusted to a person.',
  punishment: 'Imprisonment up to 3 years, or fine, or both.',
  category: 'Property Crime',
  severity: 'Medium',
  bailable: 'Yes',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 409',
  title: 'Criminal breach of trust by public servant',
  description: 'Criminal breach of trust by public servant or banker.',
  punishment: 'Life imprisonment or imprisonment up to 10 years and fine.',
  category: 'Public Servant Crime',
  severity: 'High',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 463',
  title: 'Forgery',
  description: 'Making false documents with intent to cause damage.',
  punishment: 'Imprisonment up to 2 years, or fine, or both.',
  category: 'Fraud',
  severity: 'Medium',
  bailable: 'Yes',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 468',
  title: 'Forgery for purpose of cheating',
  description: 'Forgery committed with intent to cheat.',
  punishment: 'Imprisonment up to 7 years and fine.',
  category: 'Fraud',
  severity: 'High',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 471',
  title: 'Using forged document as genuine',
  description: 'Fraudulently using forged documents.',
  punishment: 'Same punishment as forgery.',
  category: 'Fraud',
  severity: 'High',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 498A',
  title: 'Cruelty by husband or relatives',
  description: 'Cruelty towards a married woman by husband or relatives.',
  punishment: 'Imprisonment up to 3 years and fine.',
  category: 'Women Safety',
  severity: 'High',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 509',
  title: 'Insulting modesty of a woman',
  description: 'Word, gesture or act intended to insult the modesty of a woman.',
  punishment: 'Imprisonment up to 3 years and fine.',
  category: 'Women Safety',
  severity: 'Medium',
  bailable: 'Yes',
  cognizable: 'Yes',
  latestAmendment: '2013'
},
{
  code: 'IPC 120B',
  title: 'Criminal conspiracy',
  description: 'Agreement between two or more persons to commit an illegal act.',
  punishment: 'Punishment depends on the offence conspired.',
  category: 'Miscellaneous',
  severity: 'High',
  bailable: 'No',
  cognizable: 'Yes',
  latestAmendment: '2018'
},
{
  code: 'IPC 34',
  title: 'Acts done by several persons in furtherance of common intention',
  description: 'When a criminal act is done by several persons with common intention.',
  punishment: 'Punishment as per offence committed.',
  category: 'Miscellaneous',
  severity: 'High',
  bailable: 'Depends on offence',
  cognizable: 'Yes',
  latestAmendment: '2018'
}

  ],
  chargesheetTemplates: {
    basic: `IN THE COURT OF [COURT_NAME]
CHARGE SHEET

Case No: [CASE_ID]
FIR No: [FIR_NUMBER]
Police Station: [POLICE_STATION]
U/s: [IPC_SECTIONS]

[CONTENT]

INVESTIGATING OFFICER:
[OFFICER_DETAILS]

DATE: [DATE]`,

    theft: `IN THE COURT OF JUDICIAL MAGISTRATE
CHARGE SHEET FOR THEFT CASE

Case: [CASE_ID]
Complainant: [COMPLAINANT]
Accused: [ACCUSED]

OFFENCES:
[IPC_SECTIONS]

BRIEF FACTS:
The prosecution case in brief is that [INCIDENT_DETAILS]

EVIDENCE:
1. [EVIDENCE_1]
2. [EVIDENCE_2]

WITNESSES:
1. [WITNESS_1]
2. [WITNESS_2]

[OFFICER_SIGNATURE]`
  }
};

export const CrPCDatabase = {
  procedures: [
    {
      section: 'CrPC 154',
      title: 'Information in cognizable cases',
      description: 'Every information relating to the commission of a cognizable offence shall be reduced to writing by the officer in charge of a police station.',
      timeline: 'Immediate recording'
    },
    {
      section: 'CrPC 173',
      title: 'Report of police officer on completion of investigation',
      description: 'Every investigation shall be completed without unnecessary delay and the officer in charge shall forward a report to the Magistrate empowered to take cognizance.',
      timeline: 'Within 90 days for serious offences'
    },
    {
      section: 'CrPC 437',
      title: 'When bail may be taken in case of non-bailable offence',
      description: 'When any person accused of a non-bailable offence is arrested or detained without warrant, he may be released on bail.',
      timeline: 'At any stage of investigation'
    }
  ]
};

export default function LegalDatabaseScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ipc' | 'crpc' | 'templates' | 'precedents'>('ipc');
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(['IPC 379', 'IPC 420', 'CrPC 173']);

  const slideAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    slideAnim.value = withSpring(1, { damping: 20 });
    fadeAnim.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(slideAnim.value, [0, 1], [50, 0]) }],
    opacity: fadeAnim.value,
  }));

  const filteredSections = IPCDatabase.sections.filter(section =>
    section.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProcedures = CrPCDatabase.procedures.filter(procedure =>
    procedure.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
    procedure.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setRecentSearches(prev => {
        const newSearches = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        return newSearches;
      });
    }
  };

  const handleSectionSelect = (section: any) => {
    setSelectedSection(section);
  };

  const handleCopySection = (text: string) => {
    // In a real app, you would use Clipboard from react-native
    Alert.alert('Copied!', 'Section text copied to clipboard');
  };

  const handleShareSection = (section: any) => {
    Alert.alert(
      'Share Section',
      `Share ${section.code} - ${section.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => Linking.openURL(`mailto:?subject=${section.code}&body=${section.description}`) }
      ]
    );
  };

  const handleUseTemplate = (templateType: string) => {
    Alert.alert(
      'Use Template',
      `Apply ${templateType} chargesheet template?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use in Chargesheet', 
          onPress: () => router.push('./components/ChargesheetGenerator')
        }
      ]
    );
  };

  const renderIPCSections = () => (
    <View style={styles.sectionsGrid}>
      {filteredSections.map((section, index) => (
        <TouchableOpacity
          key={section.code}
          style={styles.sectionCard}
          onPress={() => handleSectionSelect(section)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getSeverityColor(section.severity)}
            style={styles.sectionGradient}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionCode}>{section.code}</Text>
              <View style={styles.severityBadge}>
                <Text style={styles.severityText}>{section.severity}</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionDescription} numberOfLines={2}>
              {section.description}
            </Text>
            <View style={styles.sectionFooter}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{section.category}</Text>
              </View>
              <Text style={styles.punishmentText}>{section.punishment}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCrPCProcedures = () => (
    <View style={styles.proceduresList}>
      {filteredProcedures.map((procedure, index) => (
        <TouchableOpacity
          key={procedure.section}
          style={styles.procedureCard}
          activeOpacity={0.8}
        >
          <View style={styles.procedureHeader}>
            <Scale size={20} color="#7C3AED" />
            <View style={styles.procedureInfo}>
              <Text style={styles.procedureSection}>{procedure.section}</Text>
              <Text style={styles.procedureTitle}>{procedure.title}</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </View>
          <Text style={styles.procedureDescription}>{procedure.description}</Text>
          <View style={styles.procedureTimeline}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.timelineText}>{procedure.timeline}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTemplates = () => (
    <View style={styles.templatesGrid}>
      <TouchableOpacity
        style={styles.templateCard}
        onPress={() => handleUseTemplate('Basic')}
        activeOpacity={0.8}
      >
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.templateGradient}>
          <FileText size={32} color="#ffffff" />
          <Text style={styles.templateTitle}>Basic Chargesheet</Text>
          <Text style={styles.templateDescription}>Standard template for all cases</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.templateCard}
        onPress={() => handleUseTemplate('Theft')}
        activeOpacity={0.8}
      >
        <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.templateGradient}>
          <Scale size={32} color="#ffffff" />
          <Text style={styles.templateTitle}>Theft Case Template</Text>
          <Text style={styles.templateDescription}>Specialized for property crimes</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderSectionDetail = () => {
    if (!selectedSection) return null;

    return (
      <View style={styles.detailModal}>
        <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelectedSection(null)} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.detailTitle}>
            <Text style={styles.detailCode}>{selectedSection.code}</Text>
            <Text style={styles.detailName}>{selectedSection.title}</Text>
          </View>
          <View style={styles.detailActions}>
            <TouchableOpacity onPress={() => handleCopySection(selectedSection.description)}>
              <Copy size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShareSection(selectedSection)}>
              <Share size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.detailContent}>
          <View style={styles.detailSection}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.sectionText}>{selectedSection.description}</Text>
          </View>

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Punishment</Text>
              <Text style={styles.detailValue}>{selectedSection.punishment}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{selectedSection.category}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bailable</Text>
              <Text style={styles.detailValue}>{selectedSection.bailable}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cognizable</Text>
              <Text style={styles.detailValue}>{selectedSection.cognizable}</Text>
            </View>
          </View>

          {selectedSection.landmarkCases && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionLabel}>Landmark Cases</Text>
              {selectedSection.landmarkCases.map((caseName: string, index: number) => (
                <Text key={index} style={styles.caseText}>• {caseName}</Text>
              ))}
            </View>
          )}

          {selectedSection.essentialElements && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionLabel}>Essential Elements</Text>
              {selectedSection.essentialElements.map((element: string, index: number) => (
                <Text key={index} style={styles.elementText}>• {element}</Text>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.useInChargesheetButton}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.useButtonGradient}>
              <FileText size={20} color="#ffffff" />
              <Text style={styles.useButtonText}>Use in Chargesheet</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>AI Legal Database</Text>
            <Text style={styles.subtitle}>Comprehensive legal reference & precedents</Text>
          </View>
          <View style={styles.aiIndicator}>
            <Brain size={24} color="#ffffff" />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search IPC sections, case laws, procedures..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSearches}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentChip}
                  onPress={() => setSearchQuery(search)}
                >
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { key: 'ipc', label: 'IPC Sections', count: IPCDatabase.sections.length },
          { key: 'crpc', label: 'CrPC Procedures', count: CrPCDatabase.procedures.length },
          { key: 'templates', label: 'Templates' },
          { key: 'precedents', label: 'Precedents' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
            {tab.count && (
              <View style={styles.tabCount}>
                <Text style={styles.tabCountText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={animatedStyle}>
          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <BookOpen size={24} color="#7C3AED" />
              <Text style={styles.statNumber}>{IPCDatabase.sections.length}+</Text>
              <Text style={styles.statLabel}>IPC Sections</Text>
            </View>
            <View style={styles.statCard}>
              <Scale size={24} color="#10B981" />
              <Text style={styles.statNumber}>{CrPCDatabase.procedures.length}+</Text>
              <Text style={styles.statLabel}>Procedures</Text>
            </View>
            <View style={styles.statCard}>
              <FileText size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Templates</Text>
            </View>
          </View>

          {/* Active Tab Content */}
          {activeTab === 'ipc' && renderIPCSections()}
          {activeTab === 'crpc' && renderCrPCProcedures()}
          {activeTab === 'templates' && renderTemplates()}
          {activeTab === 'precedents' && (
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Case Precedents - Coming Soon</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Section Detail Modal */}
      {selectedSection && renderSectionDetail()}
    </SafeAreaView>
  );
}

// Helper function for severity colors
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Highest': return ['#EF4444', '#DC2626'];
    case 'High': return ['#F59E0B', '#D97706'];
    case 'Medium': return ['#10B981', '#059669'];
    case 'Low': return ['#3B82F6', '#1D4ED8'];
    default: return ['#6B7280', '#4B5563'];
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  aiIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  recentSearches: {
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  recentChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  recentText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#F3F0FF',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeTabText: {
    color: '#7C3AED',
  },
  tabCount: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
  },
  tabCountText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 4,
  },
  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  sectionGradient: {
    padding: 16,
    minHeight: 180,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sectionCode: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    flex: 1,
  },
  severityBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
    marginBottom: 12,
  },
  sectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  punishmentText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  proceduresList: {
    gap: 12,
  },
  procedureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  procedureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  procedureInfo: {
    flex: 1,
    marginLeft: 12,
  },
  procedureSection: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  procedureTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  procedureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 8,
  },
  procedureTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timelineText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  templatesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  templateCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  templateGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 150,
    justifyContent: 'center',
  },
  templateTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: 12,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  comingSoon: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  detailModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    zIndex: 1000,
  },
  detailHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTitle: {
    flex: 1,
    marginLeft: 12,
  },
  detailCode: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  detailName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 16,
  },
  detailContent: {
    flex: 1,
    padding: 24,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 24,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  caseText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
    lineHeight: 20,
  },
  elementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
    lineHeight: 20,
  },
  useInChargesheetButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  useButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  useButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});