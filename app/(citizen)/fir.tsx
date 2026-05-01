import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Linking, 
  ActivityIndicator,
  RefreshControl // Added this import
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, FileText, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Plus, Upload, MapPin, Calendar, User, Phone, Mail, ChevronRight, PhoneCall, MessageSquare, ExternalLink, Shield, Eye, RefreshCw } from 'lucide-react-native';

// Generate unique FIR ID
const generateFIRId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000000 + Math.random() * 9000000); // 7-digit random
  return `FIR/${year}/${month}${day}${random}`;
};

// Clean old FIRs (older than 2 hours)
const cleanOldFIRs = async () => {
  try {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    
    // Clean citizen FIRs
    const citizenFIRs = await AsyncStorage.getItem('my_firs');
    if (citizenFIRs) {
      const parsedFIRs = JSON.parse(citizenFIRs);
      const filteredFIRs = parsedFIRs.filter((fir: any) => 
        new Date(fir.submittedAt) > twoHoursAgo
      );
      await AsyncStorage.setItem('my_firs', JSON.stringify(filteredFIRs));
    }
    
    // Clean SHO FIRs
    const shoFIRs = await AsyncStorage.getItem('sho_fir_inbox');
    if (shoFIRs) {
      const parsedSHOFIRs = JSON.parse(shoFIRs);
      const filteredSHOFIRs = parsedSHOFIRs.filter((fir: any) => 
        new Date(fir.submittedAt) > twoHoursAgo
      );
      await AsyncStorage.setItem('sho_fir_inbox', JSON.stringify(filteredSHOFIRs));
    }
  } catch (error) {
    console.error('Error cleaning old FIRs:', error);
  }
};

export default function FIRScreen() {
  const [activeTab, setActiveTab] = useState<'file' | 'track'>('file');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFIR, setSelectedFIR] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [myFIRs, setMyFIRs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    // Personal Details
    complainantName: '',
    fatherName: '',
    age: '',
    gender: '',
    occupation: '',
    nationality: 'Indian',
    religion: '',
    caste: '',
    
    // Contact Information
    mobileNumber: '',
    alternateNumber: '',
    email: '',
    
    // Address Details
    presentAddress: '',
    permanentAddress: '',
    policeStation: '',
    district: '',
    state: '',
    pincode: '',
    
    // Incident Details
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    detailedDescription: '',
    
    // Additional Information
    suspectDetails: '',
    witnessDetails: '',
    propertyDetails: '',
    estimatedLoss: '',
    previousComplaint: 'No',
  });

  const incidentTypes = [
    'Theft/Burglary', 'Fraud/Cheating', 'Cybercrime', 'Harassment', 
    'Assault', 'Accident', 'Missing Person', 'Property Dispute',
    'Domestic Violence', 'Dowry Related', 'Kidnapping', 'Murder',
    'Rape/Sexual Assault', 'Extortion', 'Drug Related', 'Other'
  ];

  const genderOptions = ['Male', 'Female', 'Transgender', 'Other'];
  const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];

  const steps = [
    { number: 1, title: 'Personal Details', icon: User },
    { number: 2, title: 'Contact Info', icon: Phone },
    { number: 3, title: 'Address Details', icon: MapPin },
    { number: 4, title: 'Incident Details', icon: AlertCircle },
    { number: 5, title: 'Additional Info', icon: FileText },
  ];

  // Load FIRs on component mount and when tab changes
  useEffect(() => {
    cleanOldFIRs();
    if (activeTab === 'track') {
      loadMyFIRs();
    }
  }, [activeTab]);

  const loadMyFIRs = async () => {
    setIsRefreshing(true);
    try {
      const storedFIRs = await AsyncStorage.getItem('my_firs');
      if (storedFIRs) {
        const parsedFIRs = JSON.parse(storedFIRs);
        // Sort by submission time (newest first)
        const sortedFIRs = parsedFIRs.sort((a: any, b: any) => 
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setMyFIRs(sortedFIRs);
      } else {
        setMyFIRs([]);
      }
    } catch (error) {
      console.error('Error loading FIRs:', error);
      Alert.alert('Error', 'Failed to load FIRs');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    if (!formData.complainantName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length !== 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!formData.incidentType) {
      Alert.alert('Validation Error', 'Please select the type of incident');
      return false;
    }
    if (!formData.incidentLocation.trim()) {
      Alert.alert('Validation Error', 'Please provide the incident location');
      return false;
    }
    if (!formData.detailedDescription.trim()) {
      Alert.alert('Validation Error', 'Please provide a detailed description of the incident');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique FIR ID
      const firId = generateFIRId();
      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const submittedAt = new Date().toISOString();
      
      // Create FIR object for citizen
      const newFIR = {
        id: firId,
        type: formData.incidentType,
        status: 'Pending',
        date: currentDate,
        time: currentTime,
        officer: 'Not Assigned',
        officerContact: '+91 XXXXX XXXXX',
        officerAltContact: '+91 XXXXX XXXXX',
        station: formData.policeStation || 'Local Police Station',
        assignedDate: 'Pending',
        updates: [
          { 
            date: currentDate, 
            time: currentTime,
            action: 'FIR registered successfully', 
            by: 'System' 
          }
        ],
        evidenceCollected: 0,
        witnessesRecorded: 0,
        nextHearingDate: 'To be scheduled',
        complainantName: formData.complainantName,
        incidentType: formData.incidentType,
        incidentLocation: formData.incidentLocation,
        detailedDescription: formData.detailedDescription,
        mobileNumber: formData.mobileNumber,
        submittedAt: submittedAt,
        // Additional form data
        fatherName: formData.fatherName,
        age: formData.age,
        gender: formData.gender,
        presentAddress: formData.presentAddress,
        suspectDetails: formData.suspectDetails,
        witnessDetails: formData.witnessDetails,
        propertyDetails: formData.propertyDetails,
        estimatedLoss: formData.estimatedLoss
      };

      // Save to citizen's FIRs
      const existingFIRs = await AsyncStorage.getItem('my_firs');
      const firsArray = existingFIRs ? JSON.parse(existingFIRs) : [];
      firsArray.unshift(newFIR);
      await AsyncStorage.setItem('my_firs', JSON.stringify(firsArray));

      // Save to SHO inbox
      await saveToSHOInbox(newFIR, submittedAt);

      // Reset form
      setFormData({
        complainantName: '',
        fatherName: '',
        age: '',
        gender: '',
        occupation: '',
        nationality: 'Indian',
        religion: '',
        caste: '',
        mobileNumber: '',
        alternateNumber: '',
        email: '',
        presentAddress: '',
        permanentAddress: '',
        policeStation: '',
        district: '',
        state: '',
        pincode: '',
        incidentType: '',
        incidentDate: '',
        incidentTime: '',
        incidentLocation: '',
        detailedDescription: '',
        suspectDetails: '',
        witnessDetails: '',
        propertyDetails: '',
        estimatedLoss: '',
        previousComplaint: 'No',
      });
      setCurrentStep(1);

      // Immediately show in Track FIR tab
      setMyFIRs([newFIR, ...myFIRs]);

      Alert.alert(
        'FIR Submitted Successfully!',
        `Your FIR has been registered and is now visible in Track FIR.\n\nFIR Number: ${firId}\nStatus: Pending Assignment\n\nPlease visit the police station within 24 hours with original documents.`,
        [
          { 
            text: 'View in Track FIR', 
            onPress: () => {
              setActiveTab('track');
              setSelectedFIR(newFIR);
            } 
          },
          { text: 'OK', style: 'default' }
        ]
      );
    } catch (error) {
      console.error('Error submitting FIR:', error);
      Alert.alert('Error', 'Failed to submit FIR. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToSHOInbox = async (fir: any, submittedAt: string) => {
    try {
      const shoInbox = await AsyncStorage.getItem('sho_fir_inbox');
      const inboxArray = shoInbox ? JSON.parse(shoInbox) : [];
      
      const urgency = getUrgencyBasedOnType(fir.incidentType);
      
      const shoFIR = {
        id: fir.id,
        complainant: fir.complainantName,
        phone: fir.mobileNumber,
        crimeType: fir.incidentType,
        location: fir.incidentLocation,
        urgency: urgency,
        timeAgo: 'Just now',
        description: fir.detailedDescription,
        suggestedOfficer: 'Inspector Kumar',
        evidenceCount: 0,
        witnessCount: 0,
        status: 'Unassigned',
        submittedAt: submittedAt,
        formData: {
          complainantName: fir.complainantName,
          fatherName: fir.fatherName,
          age: fir.age,
          gender: fir.gender,
          mobileNumber: fir.mobileNumber,
          incidentType: fir.incidentType,
          incidentLocation: fir.incidentLocation,
          detailedDescription: fir.detailedDescription,
          suspectDetails: fir.suspectDetails,
          witnessDetails: fir.witnessDetails,
          propertyDetails: fir.propertyDetails,
          estimatedLoss: fir.estimatedLoss
        }
      };
      
      inboxArray.unshift(shoFIR);
      await AsyncStorage.setItem('sho_fir_inbox', JSON.stringify(inboxArray));
      
      console.log('FIR saved to SHO inbox:', fir.id);
    } catch (error) {
      console.error('Error saving to SHO inbox:', error);
    }
  };

  const getUrgencyBasedOnType = (type: string) => {
    const urgentTypes = ['Murder', 'Kidnapping', 'Rape/Sexual Assault', 'Assault'];
    const highTypes = ['Theft/Burglary', 'Fraud/Cheating', 'Cybercrime', 'Domestic Violence'];
    
    if (urgentTypes.includes(type)) return 'Critical';
    if (highTypes.includes(type)) return 'High';
    return 'Medium';
  };

  const handleCallOfficer = (phoneNumber: string) => {
    if (phoneNumber.includes('XXXXX')) {
      Alert.alert('Info', 'Officer contact details will be available once the FIR is assigned.');
      return;
    }
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Could not make phone call');
    });
  };

  const handleMessageOfficer = (phoneNumber: string) => {
    if (phoneNumber.includes('XXXXX')) {
      Alert.alert('Info', 'Officer contact details will be available once the FIR is assigned.');
      return;
    }
    Linking.openURL(`sms:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Could not open messaging app');
    });
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
    return `${diffDays} days ago`;
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step) => (
        <View key={step.number} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            currentStep >= step.number && styles.stepCircleActive,
            currentStep > step.number && styles.stepCircleCompleted
          ]}>
            {currentStep > step.number ? (
              <CheckCircle size={16} color="#ffffff" />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep >= step.number && styles.stepNumberActive
              ]}>
                {step.number}
              </Text>
            )}
          </View>
          <Text style={[
            styles.stepTitle,
            currentStep >= step.number && styles.stepTitleActive
          ]}>
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderPersonalDetails = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={formData.complainantName}
          onChangeText={(text) => setFormData({ ...formData, complainantName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Father's/Husband's Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter father's or husband's name"
          value={formData.fatherName}
          onChangeText={(text) => setFormData({ ...formData, fatherName: text })}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
          />
        </View>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>Gender *</Text>
          <View style={styles.pickerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {genderOptions.map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.optionChip,
                    formData.gender === gender && styles.selectedChip
                  ]}
                  onPress={() => setFormData({ ...formData, gender })}
                >
                  <Text style={[
                    styles.optionText,
                    formData.gender === gender && styles.selectedOptionText
                  ]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Occupation</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your occupation"
          value={formData.occupation}
          onChangeText={(text) => setFormData({ ...formData, occupation: text })}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>Nationality</Text>
          <TextInput
            style={styles.input}
            placeholder="Nationality"
            value={formData.nationality}
            onChangeText={(text) => setFormData({ ...formData, nationality: text })}
          />
        </View>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>Religion</Text>
          <View style={styles.pickerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {religionOptions.map((religion) => (
                <TouchableOpacity
                  key={religion}
                  style={[
                    styles.optionChip,
                    formData.religion === religion && styles.selectedChip
                  ]}
                  onPress={() => setFormData({ ...formData, religion })}
                >
                  <Text style={[
                    styles.optionText,
                    formData.religion === religion && styles.selectedOptionText
                  ]}>
                    {religion}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );

  const renderContactInfo = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 10-digit mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          value={formData.mobileNumber}
          onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Alternate Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter alternate mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          value={formData.alternateNumber}
          onChangeText={(text) => setFormData({ ...formData, alternateNumber: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
      </View>
    </View>
  );

  const renderAddressDetails = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Address Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Present Address *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter your current address"
          multiline
          numberOfLines={3}
          value={formData.presentAddress}
          onChangeText={(text) => setFormData({ ...formData, presentAddress: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Permanent Address</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter your permanent address"
          multiline
          numberOfLines={3}
          value={formData.permanentAddress}
          onChangeText={(text) => setFormData({ ...formData, permanentAddress: text })}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>Police Station *</Text>
          <TextInput
            style={styles.input}
            placeholder="Police Station"
            value={formData.policeStation}
            onChangeText={(text) => setFormData({ ...formData, policeStation: text })}
          />
        </View>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>District *</Text>
          <TextInput
            style={styles.input}
            placeholder="District"
            value={formData.district}
            onChangeText={(text) => setFormData({ ...formData, district: text })}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>State *</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={formData.state}
            onChangeText={(text) => setFormData({ ...formData, state: text })}
          />
        </View>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>PIN Code *</Text>
          <TextInput
            style={styles.input}
            placeholder="PIN Code"
            keyboardType="numeric"
            maxLength={6}
            value={formData.pincode}
            onChangeText={(text) => setFormData({ ...formData, pincode: text })}
          />
        </View>
      </View>
    </View>
  );

  const renderIncidentDetails = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Incident Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Type of Incident *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.incidentTypes}>
          {incidentTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.incidentType,
                formData.incidentType === type && styles.selectedIncidentType
              ]}
              onPress={() => setFormData({ ...formData, incidentType: type })}
            >
              <Text style={[
                styles.incidentTypeText,
                formData.incidentType === type && styles.selectedIncidentTypeText
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>Date of Incident *</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            value={formData.incidentDate}
            onChangeText={(text) => setFormData({ ...formData, incidentDate: text })}
          />
        </View>
        <View style={styles.inputColumn}>
          <Text style={styles.inputLabel}>Time of Incident *</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            value={formData.incidentTime}
            onChangeText={(text) => setFormData({ ...formData, incidentTime: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Place of Incident *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Provide detailed location where the incident occurred"
          multiline
          numberOfLines={3}
          value={formData.incidentLocation}
          onChangeText={(text) => setFormData({ ...formData, incidentLocation: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Detailed Description of Incident *</Text>
        <TextInput
          style={[styles.textArea, { height: 120 }]}
          placeholder="Provide a detailed description of what happened. Include sequence of events, people involved, and any other relevant information."
          multiline
          numberOfLines={6}
          value={formData.detailedDescription}
          onChangeText={(text) => setFormData({ ...formData, detailedDescription: text })}
        />
      </View>
    </View>
  );

  const renderAdditionalInfo = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Additional Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Suspect Details (if known)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Provide details about suspect(s) - name, appearance, address, etc."
          multiline
          numberOfLines={4}
          value={formData.suspectDetails}
          onChangeText={(text) => setFormData({ ...formData, suspectDetails: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Witness Details</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Provide witness information - names, contact details, what they saw"
          multiline
          numberOfLines={4}
          value={formData.witnessDetails}
          onChangeText={(text) => setFormData({ ...formData, witnessDetails: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Property/Items Involved</Text>
        <TextInput
          style={styles.textArea}
          placeholder="List stolen/damaged property with descriptions and serial numbers"
          multiline
          numberOfLines={4}
          value={formData.propertyDetails}
          onChangeText={(text) => setFormData({ ...formData, propertyDetails: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Estimated Loss/Damage (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter estimated monetary loss"
          keyboardType="numeric"
          value={formData.estimatedLoss}
          onChangeText={(text) => setFormData({ ...formData, estimatedLoss: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Previous Complaint Filed?</Text>
        <View style={styles.radioGroup}>
          {['Yes', 'No'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.radioOption,
                formData.previousComplaint === option && styles.selectedRadio
              ]}
              onPress={() => setFormData({ ...formData, previousComplaint: option })}
            >
              <Text style={[
                styles.radioText,
                formData.previousComplaint === option && styles.selectedRadioText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderFormStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalDetails();
      case 2: return renderContactInfo();
      case 3: return renderAddressDetails();
      case 4: return renderIncidentDetails();
      case 5: return renderAdditionalInfo();
      default: return renderPersonalDetails();
    }
  };

  const renderFIRDetailsModal = () => {
    if (!selectedFIR) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>FIR Details</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedFIR(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Case Overview</Text>
              <View style={styles.caseInfoCard}>
                <View style={styles.caseInfoRow}>
                  <Text style={styles.caseInfoLabel}>FIR Number:</Text>
                  <Text style={styles.caseInfoValue}>{selectedFIR.id}</Text>
                </View>
                <View style={styles.caseInfoRow}>
                  <Text style={styles.caseInfoLabel}>Type:</Text>
                  <Text style={styles.caseInfoValue}>{selectedFIR.type}</Text>
                </View>
                <View style={styles.caseInfoRow}>
                  <Text style={styles.caseInfoLabel}>Status:</Text>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: selectedFIR.status === 'Resolved' ? '#10B981' :
                                   selectedFIR.status === 'Under Investigation' ? '#6366F1' : 
                                   selectedFIR.status === 'Escalated' ? '#8B5CF6' : '#F59E0B'
                  }]}>
                    <Text style={styles.statusText}>{selectedFIR.status}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Incident Details</Text>
              <View style={styles.detailsCard}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Date & Time:</Text>
                  <Text style={styles.detailValue}>{selectedFIR.date} at {selectedFIR.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{selectedFIR.incidentLocation}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Description:</Text>
                  <Text style={styles.detailValue}>{selectedFIR.detailedDescription}</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Case Timeline</Text>
              <View style={styles.timeline}>
                {selectedFIR.updates.map((update: any, index: number) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineAction}>{update.action}</Text>
                      <Text style={styles.timelineBy}>By: {update.by}</Text>
                      <Text style={styles.timelineDate}>{update.date} {update.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {selectedFIR.officer !== 'Not Assigned' && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Investigating Officer</Text>
                <View style={styles.officerCard}>
                  <View style={styles.officerInfo}>
                    <View style={styles.officerBadge}>
                      <Shield size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.officerDetails}>
                      <Text style={styles.officerName}>{selectedFIR.officer}</Text>
                      <Text style={styles.officerStation}>{selectedFIR.station}</Text>
                    </View>
                  </View>

                  <Text style={styles.contactTitle}>Contact Numbers</Text>
                  <View style={styles.contactButtons}>
                    <TouchableOpacity 
                      style={styles.contactButton}
                      onPress={() => handleCallOfficer(selectedFIR.officerContact)}
                    >
                      <PhoneCall size={16} color="#6366F1" />
                      <Text style={styles.contactButtonText}>Primary: {selectedFIR.officerContact}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.contactButton}
                      onPress={() => handleCallOfficer(selectedFIR.officerAltContact)}
                    >
                      <PhoneCall size={16} color="#F59E0B" />
                      <Text style={styles.contactButtonText}>Alternate: {selectedFIR.officerAltContact}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.messageButtons}>
                    <TouchableOpacity 
                      style={styles.messageButton}
                      onPress={() => handleMessageOfficer(selectedFIR.officerContact)}
                    >
                      <MessageSquare size={16} color="#6366F1" />
                      <Text style={styles.messageButtonText}>Send SMS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.messageButton, { backgroundColor: '#EEF2FF' }]}
                      onPress={() => handleMessageOfficer(selectedFIR.officerAltContact)}
                    >
                      <MessageSquare size={16} color="#F59E0B" />
                      <Text style={styles.messageButtonText}>Alt SMS</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Next Hearing</Text>
              <View style={styles.hearingCard}>
                <Calendar size={20} color="#6366F1" />
                <View style={styles.hearingDetails}>
                  <Text style={styles.hearingDate}>{selectedFIR.nextHearingDate}</Text>
                  <Text style={styles.hearingInfo}>
                    {selectedFIR.nextHearingDate === 'To be scheduled' 
                      ? 'Will be scheduled by investigating officer' 
                      : 'Please be present at the police station'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FIR Management</Text>
        <Text style={styles.subtitle}>File and track your First Information Reports</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'file' && styles.activeTab]}
          onPress={() => setActiveTab('file')}
        >
          <Plus size={20} color={activeTab === 'file' ? '#6366F1' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'file' && styles.activeTabText]}>
            File FIR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'track' && styles.activeTab]}
          onPress={() => setActiveTab('track')}
        >
          <Eye size={20} color={activeTab === 'track' ? '#6366F1' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'track' && styles.activeTabText]}>
            Track FIR
          </Text>
          {myFIRs.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{myFIRs.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          activeTab === 'track' ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={loadMyFIRs}
              colors={['#6366F1']}
              tintColor="#6366F1"
            />
          ) : undefined
        }
      >
        {activeTab === 'file' ? (
          <View style={styles.formContainer}>
            {renderStepIndicator()}
            {renderFormStep()}
            
            <View style={styles.navigationButtons}>
              {currentStep > 1 && (
                <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                  <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              {currentStep < 5 ? (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit FIR</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.trackContainer}>
            <View style={styles.trackHeader}>
              <Text style={styles.trackTitle}>Your FIR History</Text>
              <TouchableOpacity onPress={loadMyFIRs} style={styles.refreshButton}>
                <RefreshCw size={20} color="#6366F1" />
              </TouchableOpacity>
            </View>
            
            {isRefreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Loading FIRs...</Text>
              </View>
            ) : myFIRs.length === 0 ? (
              <View style={styles.emptyState}>
                <FileText size={48} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>No FIRs Filed</Text>
                <Text style={styles.emptyStateText}>
                  You haven't filed any FIRs yet. Click on "File FIR" tab to register a new complaint.
                </Text>
              </View>
            ) : (
              myFIRs.map((fir) => (
                <TouchableOpacity 
                  key={fir.id} 
                  style={styles.firCard}
                  onPress={() => setSelectedFIR(fir)}
                  activeOpacity={0.7}
                >
                  <View style={styles.firHeader}>
                    <View style={styles.firInfo}>
                      <Text style={styles.firId}>{fir.id}</Text>
                      <Text style={styles.firType}>{fir.type}</Text>
                      <Text style={styles.firTime}>{getTimeAgo(fir.submittedAt)}</Text>
                    </View>
                    <View style={styles.firStatus}>
                      <View style={[
                        styles.statusBadge,
                        {
                          backgroundColor: fir.status === 'Resolved' ? '#10B981' :
                                         fir.status === 'Under Investigation' ? '#6366F1' :
                                         fir.status === 'Escalated' ? '#8B5CF6' : '#F59E0B'
                        }
                      ]}>
                        <Text style={styles.statusText}>{fir.status}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.firDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={14} color="#64748B" />
                      <Text style={styles.detailText}>Filed: {fir.date} at {fir.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <User size={14} color="#64748B" />
                      <Text style={styles.detailText}>Officer: {fir.officer}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Shield size={14} color="#64748B" />
                      <Text style={styles.detailText}>Station: {fir.station}</Text>
                    </View>
                  </View>

                  <View style={styles.firFooter}>
                    <View style={styles.updatesInfo}>
                      <Clock size={12} color="#64748B" />
                      <Text style={styles.updatesText}>{fir.updates.length} updates</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.viewDetailsButton}
                      onPress={() => setSelectedFIR(fir)}
                    >
                      <Text style={styles.viewDetailsText}>View Details</Text>
                      <ChevronRight size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {selectedFIR && renderFIRDetailsModal()}
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    position: 'relative',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    gap: 8,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#6366F1',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 10,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingVertical: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#6366F1',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  stepTitleActive: {
    color: '#6366F1',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    height: 80,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  inputColumn: {
    flex: 1,
  },
  pickerContainer: {
    marginTop: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedChip: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedOptionText: {
    color: '#6366F1',
  },
  incidentTypes: {
    flexDirection: 'row',
    marginTop: 8,
  },
  incidentType: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedIncidentType: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  incidentTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedIncidentTypeText: {
    color: '#6366F1',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  selectedRadio: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  radioText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedRadioText: {
    color: '#6366F1',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  previousButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  previousButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Track FIR Styles
  trackContainer: {
    paddingVertical: 20,
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  firHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  firInfo: {
    flex: 1,
  },
  firId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  firType: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  firTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  firStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  firDetails: {
    marginBottom: 16,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
  },
  firFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updatesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  updatesText: {
    fontSize: 12,
    color: '#64748B',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#64748B',
  },
  modalContent: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  caseInfoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  caseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  caseInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  detailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    flex: 2,
    textAlign: 'right',
  },
  // Timeline Styles
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  timelineAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  timelineBy: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  // Officer Card Styles
  officerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  officerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  officerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  officerDetails: {
    flex: 1,
  },
  officerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  officerStation: {
    fontSize: 14,
    color: '#64748B',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 4,
  },
  contactButtons: {
    gap: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  contactButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  messageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  messageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Hearing Card
  hearingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  hearingDetails: {
    flex: 1,
  },
  hearingDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B21B6',
    marginBottom: 4,
  },
  hearingInfo: {
    fontSize: 12,
    color: '#7C3AED',
  },
});