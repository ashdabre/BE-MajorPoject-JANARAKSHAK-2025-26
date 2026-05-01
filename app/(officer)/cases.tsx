import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Modal, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, Filter, Clock, AlertCircle, CheckCircle, X, MapPin, User, Calendar, FileText, Upload, Camera, MessageSquare, Activity, ChevronRight, TrendingUp, Shield, Plus, Mic, Image as ImageIcon, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// Assume officer ID (in real app, this would come from auth)
const OFFICER_ID = '1'; // Inspector Kumar
const OFFICER_NAME = 'Inspector Kumar';

export default function CasesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [showAddWitnessModal, setShowAddWitnessModal] = useState(false);
  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');
  const [newWitness, setNewWitness] = useState({ name: '', contact: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState<any[]>([]);
  const [newCases, setNewCases] = useState<any[]>([]);

  const filters = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'pending', label: 'Pending', count: 0 },
    { id: 'investigating', label: 'Active', count: 0 },
    { id: 'resolved', label: 'Resolved', count: 0 },
  ];

  // Initial dummy cases (always visible)
  const initialDummyCases = [
    {
      id: 'FIR/2024/001234',
      type: 'Theft',
      priority: 'High',
      status: 'Investigating',
      assignedTo: 'Inspector Kumar',
      date: '2024-01-15',
      location: 'MG Road, Bangalore',
      description: 'Motorcycle theft reported by citizen. Vehicle registration KA-01-AB-1234.',
      complainant: 'Rahul Sharma',
      phone: '+91 9876543210',
      updates: [
        { date: '2024-01-15', time: '14:30', action: 'Case registered', by: 'SI Sharma' },
        { date: '2024-01-16', time: '10:15', action: 'Evidence collected from scene', by: 'Inspector Kumar' },
        { date: '2024-01-17', time: '16:45', action: 'CCTV footage reviewed', by: 'Inspector Kumar' },
      ],
      evidence: [
        { id: '1', type: 'Photo', name: 'Scene Photo 1', date: '2024-01-15', time: '15:00', uploadedBy: 'Inspector Kumar', uri: null },
        { id: '2', type: 'Document', name: 'FIR Copy', date: '2024-01-15', time: '14:35', uploadedBy: 'SI Sharma', uri: null },
        { id: '3', type: 'Video', name: 'CCTV Footage', date: '2024-01-16', time: '11:20', uploadedBy: 'Inspector Kumar', uri: null },
      ],
      witnesses: [
        { name: 'Rajesh Kumar', contact: '+91 98765 43210', statement: 'Submitted' },
        { name: 'Priya Singh', contact: '+91 98765 43211', statement: 'Pending' },
      ],
    },
    {
      id: 'FIR/2024/001235',
      type: 'Accident',
      priority: 'Medium',
      status: 'Evidence Collection',
      assignedTo: 'Inspector Kumar',
      date: '2024-01-14',
      location: 'Brigade Road, Bangalore',
      description: 'Road accident involving two vehicles at intersection.',
      complainant: 'Anjali Verma',
      phone: '+91 8765432109',
      updates: [
        { date: '2024-01-14', time: '11:30', action: 'Case registered', by: 'SI Sharma' },
        { date: '2024-01-14', time: '15:45', action: 'Medical reports requested', by: 'SI Sharma' },
      ],
      evidence: [
        { id: '4', type: 'Photo', name: 'Accident Scene', date: '2024-01-14', time: '12:15', uploadedBy: 'SI Sharma', uri: null },
      ],
      witnesses: [
        { name: 'Amit Patel', contact: '+91 98765 43212', statement: 'Submitted' },
      ],
    },
    {
      id: 'FIR/2024/001236',
      type: 'Fraud',
      priority: 'High',
      status: 'Pending',
      assignedTo: 'Inspector Kumar',
      date: '2024-01-13',
      location: 'Koramangala, Bangalore',
      description: 'Online fraud complaint filed. Amount: ₹50,000',
      complainant: 'Vikram Singh',
      phone: '+91 7654321098',
      updates: [
        { date: '2024-01-13', time: '09:15', action: 'Case registered', by: 'Inspector Kumar' },
      ],
      evidence: [],
      witnesses: [],
    },
    {
      id: 'FIR/2024/001237',
      type: 'Burglary',
      priority: 'Medium',
      status: 'Resolved',
      assignedTo: 'Inspector Kumar',
      date: '2024-01-12',
      location: 'Indiranagar, Bangalore',
      description: 'Residential burglary with stolen electronics recovered.',
      complainant: 'Suresh Reddy',
      phone: '+91 6543210987',
      updates: [
        { date: '2024-01-12', time: '16:20', action: 'Case registered', by: 'Inspector Patel' },
        { date: '2024-01-13', time: '10:45', action: 'Suspect identified', by: 'Inspector Patel' },
        { date: '2024-01-14', time: '14:30', action: 'Arrest made', by: 'Inspector Patel' },
        { date: '2024-01-15', time: '11:10', action: 'Case closed', by: 'Inspector Patel' },
      ],
      evidence: [
        { id: '5', type: 'Photo', name: 'Recovered Items', date: '2024-01-14', time: '15:45', uploadedBy: 'Inspector Patel', uri: null },
        { id: '6', type: 'Document', name: 'Arrest Report', date: '2024-01-14', time: '16:20', uploadedBy: 'Inspector Patel', uri: null },
      ],
      witnesses: [
        { name: 'Suresh Reddy', contact: '+91 98765 43213', statement: 'Submitted' },
      ],
    },
  ];

  // Load cases on component mount
  useEffect(() => {
    loadCases();
  }, []);

  // Update filter counts when cases change
  useEffect(() => {
    updateFilterCounts();
  }, [cases, newCases]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      // Always show dummy cases
      setCases(initialDummyCases);
      
      // Load new cases from storage
      const officerCasesKey = `officer_cases_${OFFICER_ID}`;
      const storedNewCases = await AsyncStorage.getItem(officerCasesKey);
      
      if (storedNewCases) {
        const parsedNewCases = JSON.parse(storedNewCases);
        // Filter out dummy cases from stored cases
        const filteredNewCases = parsedNewCases.filter((storedCase: any) => 
          !initialDummyCases.some(dummyCase => dummyCase.id === storedCase.id)
        );
        setNewCases(filteredNewCases);
      }
      
      // Also sync with general officer cases list
      await syncWithGeneralCases();
    } catch (error) {
      console.error('Error loading cases:', error);
      Alert.alert('Error', 'Failed to load cases');
      // Fallback to dummy cases
      setCases(initialDummyCases);
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithGeneralCases = async () => {
    try {
      const allOfficerCases = await AsyncStorage.getItem('all_officer_cases');
      if (allOfficerCases) {
        const parsedCases = JSON.parse(allOfficerCases);
        // Filter cases assigned to this officer and exclude dummy cases
        const officerNewCases = parsedCases.filter((case_: any) => 
          case_.assignedTo === OFFICER_NAME && 
          !initialDummyCases.some(dummyCase => dummyCase.id === case_.id)
        );
        
        if (officerNewCases.length > 0) {
          setNewCases(officerNewCases);
          
          // Save updated new cases list to officer-specific storage
          const officerCasesKey = `officer_cases_${OFFICER_ID}`;
          await AsyncStorage.setItem(officerCasesKey, JSON.stringify(officerNewCases));
        }
      }
    } catch (error) {
      console.error('Error syncing with general cases:', error);
    }
  };

  const updateFilterCounts = () => {
    const allCases = [...newCases, ...initialDummyCases];
    filters[0].count = allCases.length;
    filters[1].count = allCases.filter(c => c.status === 'Pending').length;
    filters[2].count = allCases.filter(c => c.status === 'Investigating' || c.status === 'Evidence Collection').length;
    filters[3].count = allCases.filter(c => c.status === 'Resolved').length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return '#10B981';
      case 'Investigating': return '#6366F1';
      case 'Evidence Collection': return '#F59E0B';
      case 'Pending': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Resolved': return '#F0FDF4';
      case 'Investigating': return '#EEF2FF';
      case 'Evidence Collection': return '#FFF7ED';
      case 'Pending': return '#FFF7ED';
      default: return '#FEF2F2';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const handleAddUpdate = async () => {
    if (!newUpdate.trim()) {
      Alert.alert('Error', 'Please enter update details');
      return;
    }

    if (!selectedCase || !selectedCase.id) {
      Alert.alert('Error', 'No case selected');
      return;
    }

    try {
      let updatedCases = [...initialDummyCases];
      let updatedNewCases = [...newCases];
      let isDummyCase = initialDummyCases.some(c => c.id === selectedCase.id);

      if (isDummyCase) {
        // Update dummy case
        updatedCases = initialDummyCases.map(case_ => {
          if (case_.id === selectedCase.id) {
            const updatedCase = {
              ...case_,
              updates: [
                ...case_.updates,
                {
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  action: newUpdate,
                  by: OFFICER_NAME
                }
              ]
            };
            // Update the selected case in real-time
            if (selectedCase.id === case_.id) {
              setTimeout(() => {
                setSelectedCase(updatedCase);
              }, 0);
            }
            return updatedCase;
          }
          return case_;
        });
        setCases(updatedCases);
      } else {
        // Update new case
        updatedNewCases = newCases.map(case_ => {
          if (case_.id === selectedCase.id) {
            const updatedCase = {
              ...case_,
              updates: [
                ...(case_.updates || []),
                {
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  action: newUpdate,
                  by: OFFICER_NAME
                }
              ]
            };
            // Update the selected case in real-time
            if (selectedCase.id === case_.id) {
              setTimeout(() => {
                setSelectedCase(updatedCase);
              }, 0);
            }
            return updatedCase;
          }
          return case_;
        });
        setNewCases(updatedNewCases);
        
        // Save to storage
        const officerCasesKey = `officer_cases_${OFFICER_ID}`;
        await AsyncStorage.setItem(officerCasesKey, JSON.stringify(updatedNewCases));
        
        // Also update in general cases list
        const allOfficerCases = await AsyncStorage.getItem('all_officer_cases');
        if (allOfficerCases) {
          const allCases = JSON.parse(allOfficerCases);
          const updatedAllCases = allCases.map((case_: any) => 
            case_.id === selectedCase.id 
              ? updatedNewCases.find((c: any) => c.id === selectedCase.id)
              : case_
          );
          await AsyncStorage.setItem('all_officer_cases', JSON.stringify(updatedAllCases));
        }
      }

      setNewUpdate('');
      setShowAddUpdateModal(false);
      Alert.alert('Success', 'Update added successfully');
    } catch (error) {
      console.error('Error adding update:', error);
      Alert.alert('Error', 'Failed to add update');
    }
  };

  const handleAddWitness = async () => {
    if (!newWitness.name.trim() || !newWitness.contact.trim()) {
      Alert.alert('Error', 'Please fill all witness details');
      return;
    }

    if (!selectedCase || !selectedCase.id) {
      Alert.alert('Error', 'No case selected');
      return;
    }

    try {
      let updatedCases = [...initialDummyCases];
      let updatedNewCases = [...newCases];
      let isDummyCase = initialDummyCases.some(c => c.id === selectedCase.id);

      if (isDummyCase) {
        // Update dummy case
        updatedCases = initialDummyCases.map(case_ => {
          if (case_.id === selectedCase.id) {
            const updatedCase = {
              ...case_,
              witnesses: [
                ...(case_.witnesses || []),
                {
                  ...newWitness,
                  statement: 'Pending'
                }
              ]
            };
            // Update the selected case in real-time
            if (selectedCase.id === case_.id) {
              setTimeout(() => {
                setSelectedCase(updatedCase);
              }, 0);
            }
            return updatedCase;
          }
          return case_;
        });
        setCases(updatedCases);
      } else {
        // Update new case
        updatedNewCases = newCases.map(case_ => {
          if (case_.id === selectedCase.id) {
            const updatedCase = {
              ...case_,
              witnesses: [
                ...(case_.witnesses || []),
                {
                  ...newWitness,
                  statement: 'Pending'
                }
              ]
            };
            // Update the selected case in real-time
            if (selectedCase.id === case_.id) {
              setTimeout(() => {
                setSelectedCase(updatedCase);
              }, 0);
            }
            return updatedCase;
          }
          return case_;
        });
        setNewCases(updatedNewCases);
        
        // Save to storage
        const officerCasesKey = `officer_cases_${OFFICER_ID}`;
        await AsyncStorage.setItem(officerCasesKey, JSON.stringify(updatedNewCases));
        
        // Also update in general cases list
        const allOfficerCases = await AsyncStorage.getItem('all_officer_cases');
        if (allOfficerCases) {
          const allCases = JSON.parse(allOfficerCases);
          const updatedAllCases = allCases.map((case_: any) => 
            case_.id === selectedCase.id 
              ? updatedNewCases.find((c: any) => c.id === selectedCase.id)
              : case_
          );
          await AsyncStorage.setItem('all_officer_cases', JSON.stringify(updatedAllCases));
        }
      }

      setNewWitness({ name: '', contact: '' });
      setShowAddWitnessModal(false);
      Alert.alert('Success', 'Witness added successfully');
    } catch (error) {
      console.error('Error adding witness:', error);
      Alert.alert('Error', 'Failed to add witness');
    }
  };

  const handleUploadEvidence = async () => {
    if (!selectedCase || !selectedCase.id) {
      Alert.alert('Error', 'No case selected');
      return;
    }

    try {
      // Request camera and gallery permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access photos');
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setUploadingImage(true);
        
        // Create new evidence object with the selected image
        const newEvidence = {
          id: Date.now().toString(),
          type: 'Photo',
          name: `Evidence_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          uri: result.assets[0].uri,
          uploadedBy: OFFICER_NAME
        };

        let updatedCases = [...initialDummyCases];
        let updatedNewCases = [...newCases];
        let isDummyCase = initialDummyCases.some(c => c.id === selectedCase.id);

        if (isDummyCase) {
          // Update dummy case
          updatedCases = initialDummyCases.map(case_ => {
            if (case_.id === selectedCase.id) {
              const updatedCase = {
                ...case_,
                evidence: [...(case_.evidence || []), newEvidence]
              };
              // Update the selected case in real-time
              if (selectedCase.id === case_.id) {
                setTimeout(() => {
                  setSelectedCase(updatedCase);
                }, 0);
              }
              return updatedCase;
            }
            return case_;
          });
          setCases(updatedCases);
        } else {
          // Update new case
          updatedNewCases = newCases.map(case_ => {
            if (case_.id === selectedCase.id) {
              const updatedCase = {
                ...case_,
                evidence: [...(case_.evidence || []), newEvidence]
              };
              // Update the selected case in real-time
              if (selectedCase.id === case_.id) {
                setTimeout(() => {
                  setSelectedCase(updatedCase);
                }, 0);
              }
              return updatedCase;
            }
            return case_;
          });
          setNewCases(updatedNewCases);
          
          // Save to storage
          const officerCasesKey = `officer_cases_${OFFICER_ID}`;
          await AsyncStorage.setItem(officerCasesKey, JSON.stringify(updatedNewCases));
          
          // Also update in general cases list
          const allOfficerCases = await AsyncStorage.getItem('all_officer_cases');
          if (allOfficerCases) {
            const allCases = JSON.parse(allOfficerCases);
            const updatedAllCases = allCases.map((case_: any) => 
              case_.id === selectedCase.id 
                ? updatedNewCases.find((c: any) => c.id === selectedCase.id)
                : case_
            );
            await AsyncStorage.setItem('all_officer_cases', JSON.stringify(updatedAllCases));
          }
        }

        setUploadingImage(false);
        setShowUploadEvidenceModal(false);
        Alert.alert('Success', 'Evidence uploaded successfully');
      }
    } catch (error) {
      setUploadingImage(false);
      Alert.alert('Error', 'Failed to upload evidence');
      console.error(error);
    }
  };

  const handleTakePhoto = async () => {
    if (!selectedCase || !selectedCase.id) {
      Alert.alert('Error', 'No case selected');
      return;
    }

    try {
      // Request camera permissions
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to use camera');
        return;
      }

      // Open camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setUploadingImage(true);
        
        // Create new evidence object with the captured photo
        const newEvidence = {
          id: Date.now().toString(),
          type: 'Photo',
          name: `Photo_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          uri: result.assets[0].uri,
          uploadedBy: OFFICER_NAME
        };

        let updatedCases = [...initialDummyCases];
        let updatedNewCases = [...newCases];
        let isDummyCase = initialDummyCases.some(c => c.id === selectedCase.id);

        if (isDummyCase) {
          // Update dummy case
          updatedCases = initialDummyCases.map(case_ => {
            if (case_.id === selectedCase.id) {
              const updatedCase = {
                ...case_,
                evidence: [...(case_.evidence || []), newEvidence]
              };
              // Update the selected case in real-time
              if (selectedCase.id === case_.id) {
                setTimeout(() => {
                  setSelectedCase(updatedCase);
                }, 0);
              }
              return updatedCase;
            }
            return case_;
          });
          setCases(updatedCases);
        } else {
          // Update new case
          updatedNewCases = newCases.map(case_ => {
            if (case_.id === selectedCase.id) {
              const updatedCase = {
                ...case_,
                evidence: [...(case_.evidence || []), newEvidence]
              };
              // Update the selected case in real-time
              if (selectedCase.id === case_.id) {
                setTimeout(() => {
                  setSelectedCase(updatedCase);
                }, 0);
              }
              return updatedCase;
            }
            return case_;
          });
          setNewCases(updatedNewCases);
          
          // Save to storage
          const officerCasesKey = `officer_cases_${OFFICER_ID}`;
          await AsyncStorage.setItem(officerCasesKey, JSON.stringify(updatedNewCases));
          
          // Also update in general cases list
          const allOfficerCases = await AsyncStorage.getItem('all_officer_cases');
          if (allOfficerCases) {
            const allCases = JSON.parse(allOfficerCases);
            const updatedAllCases = allCases.map((case_: any) => 
              case_.id === selectedCase.id 
                ? updatedNewCases.find((c: any) => c.id === selectedCase.id)
                : case_
            );
            await AsyncStorage.setItem('all_officer_cases', JSON.stringify(updatedAllCases));
          }
        }

        setUploadingImage(false);
        setShowUploadEvidenceModal(false);
        Alert.alert('Success', 'Photo added to evidence');
      }
    } catch (error) {
      setUploadingImage(false);
      Alert.alert('Error', 'Failed to take photo');
      console.error(error);
    }
  };

  const handleWitnessVoiceRecord = (witnessName: string) => {
    router.push('/voice-command');
  };

  const handleMarkAsResolved = async () => {
    if (!selectedCase || !selectedCase.id) {
      Alert.alert('Error', 'No case selected');
      return;
    }

    Alert.alert(
      'Mark as Resolved',
      'Are you sure you want to mark this case as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Resolved',
          style: 'destructive',
          onPress: async () => {
            try {
              let updatedCases = [...initialDummyCases];
              let updatedNewCases = [...newCases];
              let isDummyCase = initialDummyCases.some(c => c.id === selectedCase.id);

              if (isDummyCase) {
                // Update dummy case
                updatedCases = initialDummyCases.map(case_ => {
                  if (case_.id === selectedCase.id) {
                    const updatedCase = {
                      ...case_,
                      status: 'Resolved',
                      updates: [
                        ...case_.updates,
                        {
                          date: new Date().toISOString().split('T')[0],
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          action: 'Case marked as resolved',
                          by: OFFICER_NAME
                        }
                      ]
                    };
                    // Update the selected case in real-time
                    if (selectedCase.id === case_.id) {
                      setTimeout(() => {
                        setSelectedCase(updatedCase);
                      }, 0);
                    }
                    return updatedCase;
                  }
                  return case_;
                });
                setCases(updatedCases);
              } else {
                // Update new case
                updatedNewCases = newCases.map(case_ => {
                  if (case_.id === selectedCase.id) {
                    const updatedCase = {
                      ...case_,
                      status: 'Resolved',
                      updates: [
                        ...(case_.updates || []),
                        {
                          date: new Date().toISOString().split('T')[0],
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          action: 'Case marked as resolved',
                          by: OFFICER_NAME
                        }
                      ]
                    };
                    // Update the selected case in real-time
                    if (selectedCase.id === case_.id) {
                      setTimeout(() => {
                        setSelectedCase(updatedCase);
                      }, 0);
                    }
                    return updatedCase;
                  }
                  return case_;
                });
                setNewCases(updatedNewCases);
                
                // Save to storage
                const officerCasesKey = `officer_cases_${OFFICER_ID}`;
                await AsyncStorage.setItem(officerCasesKey, JSON.stringify(updatedNewCases));
                
                // Also update in general cases list
                const allOfficerCases = await AsyncStorage.getItem('all_officer_cases');
                if (allOfficerCases) {
                  const allCases = JSON.parse(allOfficerCases);
                  const updatedAllCases = allCases.map((case_: any) => 
                    case_.id === selectedCase.id 
                      ? updatedNewCases.find((c: any) => c.id === selectedCase.id)
                      : case_
                  );
                  await AsyncStorage.setItem('all_officer_cases', JSON.stringify(updatedAllCases));
                }
              }

              Alert.alert('Success', 'Case marked as resolved');
            } catch (error) {
              console.error('Error marking case as resolved:', error);
              Alert.alert('Error', 'Failed to mark case as resolved');
            }
          }
        }
      ]
    );
  };

  const openAddUpdateModal = () => {
    setNewUpdate('');
    setShowAddUpdateModal(true);
  };

  const openAddWitnessModal = () => {
    setNewWitness({ name: '', contact: '' });
    setShowAddWitnessModal(true);
  };

  const openUploadEvidenceModal = () => {
    setShowUploadEvidenceModal(true);
  };

  const filteredCases = [...newCases, ...initialDummyCases].filter(case_ => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return case_.status === 'Pending';
    if (activeFilter === 'investigating') return case_.status === 'Investigating' || case_.status === 'Evidence Collection';
    if (activeFilter === 'resolved') return case_.status === 'Resolved';
    return true;
  }).filter(case_ => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      case_.id.toLowerCase().includes(query) ||
      case_.type.toLowerCase().includes(query) ||
      case_.description.toLowerCase().includes(query) ||
      case_.location.toLowerCase().includes(query)
    );
  });

  const renderCaseCard = (case_: any, index: number) => (
    <TouchableOpacity 
      key={case_.id} 
      style={styles.caseCard}
      onPress={() => setSelectedCase(case_)}
      activeOpacity={0.7}
    >
      <View style={styles.caseHeader}>
        <View style={styles.caseInfo}>
          <Text style={styles.caseId}>{case_.id}</Text>
          <Text style={styles.caseType}>{case_.type}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(case_.priority) }]}>
          <Text style={styles.priorityText}>{case_.priority}</Text>
        </View>
      </View>

      <Text style={styles.caseDescription} numberOfLines={2}>{case_.description}</Text>

      <View style={styles.caseDetails}>
        <View style={styles.detailItem}>
          <MapPin size={14} color="#64748B" strokeWidth={2} />
          <Text style={styles.detailValue} numberOfLines={1}>{case_.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <User size={14} color="#64748B" strokeWidth={2} />
          <Text style={styles.detailValue}>{case_.assignedTo}</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBg(case_.status) }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(case_.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(case_.status) }]}>
            {case_.status}
          </Text>
        </View>
        <View style={styles.caseStats}>
          <Text style={styles.updateCount}>{case_.updates?.length || 0} updates</Text>
          <Text style={styles.evidenceCount}>{case_.evidence?.length || 0} evidence</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAddUpdateModal = () => (
    <Modal
      visible={showAddUpdateModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddUpdateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.smallModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Case Update</Text>
            <TouchableOpacity onPress={() => setShowAddUpdateModal(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter update details..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={newUpdate}
            onChangeText={setNewUpdate}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddUpdate}>
            <Text style={styles.primaryButtonText}>Add Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAddWitnessModal = () => (
    <Modal
      visible={showAddWitnessModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddWitnessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.smallModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Witness</Text>
            <TouchableOpacity onPress={() => setShowAddWitnessModal(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Witness Name"
            placeholderTextColor="#94A3B8"
            value={newWitness.name}
            onChangeText={(text) => setNewWitness({...newWitness, name: text})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Contact Number"
            placeholderTextColor="#94A3B8"
            value={newWitness.contact}
            onChangeText={(text) => setNewWitness({...newWitness, contact: text})}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddWitness}>
            <Text style={styles.primaryButtonText}>Add Witness</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderUploadEvidenceModal = () => (
    <Modal
      visible={showUploadEvidenceModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowUploadEvidenceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.smallModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Evidence</Text>
            <TouchableOpacity onPress={() => setShowUploadEvidenceModal(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.uploadOptions}>
            <TouchableOpacity 
              style={styles.uploadOption}
              onPress={handleTakePhoto}
              disabled={uploadingImage}
            >
              <Camera size={28} color="#6366F1" />
              <Text style={styles.uploadOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.uploadOption}
              onPress={handleUploadEvidence}
              disabled={uploadingImage}
            >
              <ImageIcon size={28} color="#6366F1" />
              <Text style={styles.uploadOptionText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          
          {uploadingImage && (
            <Text style={styles.uploadingText}>Uploading...</Text>
          )}
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { marginTop: 10 }]} 
            onPress={() => setShowUploadEvidenceModal(false)}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCaseDetailModal = () => {
    if (!selectedCase) return null;

    return (
      <Modal
        visible={!!selectedCase}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCase(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalTitle}>{selectedCase.id}</Text>
                <Text style={styles.modalSubtitle}>{selectedCase.type}</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedCase(null)}
                activeOpacity={0.7}
              >
                <X size={24} color="#64748B" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Status Bar */}
            <View style={styles.statusBar}>
              <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusBg(selectedCase.status) }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(selectedCase.status) }]} />
                <Text style={[styles.statusTextLarge, { color: getStatusColor(selectedCase.status) }]}>
                  {selectedCase.status}
                </Text>
              </View>
              <View style={[styles.priorityBadgeLarge, { backgroundColor: getPriorityColor(selectedCase.priority) }]}>
                <Text style={styles.priorityTextLarge}>{selectedCase.priority} Priority</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                onPress={() => setActiveTab('overview')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                  Overview
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'updates' && styles.activeTab]}
                onPress={() => setActiveTab('updates')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === 'updates' && styles.activeTabText]}>
                  Updates
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'evidence' && styles.activeTab]}
                onPress={() => setActiveTab('evidence')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === 'evidence' && styles.activeTabText]}>
                  Evidence
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'witnesses' && styles.activeTab]}
                onPress={() => setActiveTab('witnesses')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === 'witnesses' && styles.activeTabText]}>
                  Witnesses
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
              {activeTab === 'overview' && (
                <View style={styles.overviewContent}>
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Description</Text>
                    <Text style={styles.infoValue}>{selectedCase.description}</Text>
                  </View>

                  <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                      <MapPin size={20} color="#6366F1" strokeWidth={2} />
                      <Text style={styles.infoCardLabel}>Location</Text>
                      <Text style={styles.infoCardValue}>{selectedCase.location}</Text>
                    </View>
                    <View style={styles.infoCard}>
                      <Calendar size={20} color="#6366F1" strokeWidth={2} />
                      <Text style={styles.infoCardLabel}>Date Filed</Text>
                      <Text style={styles.infoCardValue}>{selectedCase.date}</Text>
                    </View>
                    <View style={styles.infoCard}>
                      <User size={20} color="#6366F1" strokeWidth={2} />
                      <Text style={styles.infoCardLabel}>Assigned To</Text>
                      <Text style={styles.infoCardValue}>{selectedCase.assignedTo}</Text>
                    </View>
                    <View style={styles.infoCard}>
                      <Activity size={20} color="#6366F1" strokeWidth={2} />
                      <Text style={styles.infoCardLabel}>Progress</Text>
                      <Text style={styles.infoCardValue}>{selectedCase.updates?.length || 0} updates</Text>
                    </View>
                  </View>

                  <View style={styles.progressCard}>
                    <View style={styles.progressCardHeader}>
                      <Text style={styles.progressCardTitle}>Investigation Status</Text>
                    </View>
                    <Text style={styles.progressCardSubtitle}>
                      {selectedCase.updates?.length || 0} updates • {selectedCase.evidence?.length || 0} evidence • {selectedCase.witnesses?.length || 0} witnesses
                    </Text>
                  </View>
                </View>
              )}

              {activeTab === 'updates' && (
                <View style={styles.updatesContent}>
                  <TouchableOpacity 
                    style={styles.addButton} 
                    activeOpacity={0.7}
                    onPress={openAddUpdateModal}
                  >
                    <Plus size={18} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.addButtonText}>Add Update</Text>
                  </TouchableOpacity>

                  <View style={styles.timeline}>
                    {selectedCase.updates?.map((update: any, index: number) => (
                      <View key={index} style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                          <Text style={styles.timelineAction}>{update.action}</Text>
                          <Text style={styles.timelineBy}>by {update.by}</Text>
                          <Text style={styles.timelineDate}>{update.date} {update.time}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {activeTab === 'evidence' && (
                <View style={styles.evidenceContent}>
                  <TouchableOpacity 
                    style={styles.uploadButton} 
                    activeOpacity={0.7}
                    onPress={openUploadEvidenceModal}
                  >
                    <Upload size={20} color="#6366F1" strokeWidth={2} />
                    <Text style={styles.uploadButtonText}>Upload Evidence</Text>
                  </TouchableOpacity>

                  {selectedCase.evidence?.length > 0 ? (
                    <View style={styles.evidenceList}>
                      {selectedCase.evidence.map((item: any, index: number) => (
                        <TouchableOpacity key={index} style={styles.evidenceItem} activeOpacity={0.7}>
                          {item.uri ? (
                            <Image source={{ uri: item.uri }} style={styles.evidenceImage} />
                          ) : (
                            <View style={styles.evidenceIcon}>
                              {item.type === 'Photo' && <Camera size={20} color="#6366F1" strokeWidth={2} />}
                              {item.type === 'Document' && <FileText size={20} color="#6366F1" strokeWidth={2} />}
                              {item.type === 'Video' && <Activity size={20} color="#6366F1" strokeWidth={2} />}
                            </View>
                          )}
                          <View style={styles.evidenceInfo}>
                            <Text style={styles.evidenceName}>{item.name}</Text>
                            <Text style={styles.evidenceType}>{item.type} • {item.date} {item.time}</Text>
                          </View>
                          <ChevronRight size={20} color="#94A3B8" strokeWidth={2} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptyState}>
                      <Shield size={48} color="#CBD5E1" strokeWidth={1.5} />
                      <Text style={styles.emptyStateText}>No evidence uploaded yet</Text>
                    </View>
                  )}
                </View>
              )}

              {activeTab === 'witnesses' && (
                <View style={styles.witnessesContent}>
                  <TouchableOpacity 
                    style={styles.addButton} 
                    activeOpacity={0.7}
                    onPress={openAddWitnessModal}
                  >
                    <Plus size={18} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.addButtonText}>Add Witness</Text>
                  </TouchableOpacity>

                  {selectedCase.witnesses?.length > 0 ? (
                    <View style={styles.witnessList}>
                      {selectedCase.witnesses.map((witness: any, index: number) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.witnessCard} 
                          activeOpacity={0.7}
                          onPress={() => handleWitnessVoiceRecord(witness.name)}
                        >
                          <View style={styles.witnessAvatar}>
                            <Text style={styles.witnessInitial}>{witness.name.charAt(0)}</Text>
                          </View>
                          <View style={styles.witnessInfo}>
                            <Text style={styles.witnessName}>{witness.name}</Text>
                            <Text style={styles.witnessContact}>{witness.contact}</Text>
                            <View style={[styles.witnessStatus, { 
                              backgroundColor: witness.statement === 'Submitted' ? '#F0FDF4' : '#FFF7ED' 
                            }]}>
                              <View style={styles.witnessStatusRow}>
                                <Text style={[styles.witnessStatusText, {
                                  color: witness.statement === 'Submitted' ? '#10B981' : '#F59E0B'
                                }]}>
                                  Statement: {witness.statement}
                                </Text>
                                {witness.statement === 'Pending' && (
                                  <TouchableOpacity 
                                    style={styles.recordButton}
                                    onPress={() => handleWitnessVoiceRecord(witness.name)}
                                  >
                                    <Mic size={14} color="#6366F1" />
                                    <Text style={styles.recordButtonText}>Record</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptyState}>
                      <User size={48} color="#CBD5E1" strokeWidth={1.5} />
                      <Text style={styles.emptyStateText}>No witnesses recorded yet</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Case Management</Text>
          <TouchableOpacity onPress={loadCases} style={styles.refreshButton}>
            <RefreshCw size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Assigned to: {OFFICER_NAME}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748B" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cases..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Filter size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterChip, activeFilter === filter.id && styles.activeFilterChip]}
            onPress={() => setActiveFilter(filter.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === filter.id && styles.activeFilterText]}>
              {filter.label}
            </Text>
            <View style={[styles.filterCount, activeFilter === filter.id && styles.activeFilterCount]}>
              <Text style={[styles.filterCountText, activeFilter === filter.id && styles.activeFilterCountText]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Activity size={48} color="#6366F1" />
          <Text style={styles.loadingText}>Loading cases...</Text>
        </View>
      ) : (
        <ScrollView style={styles.casesList} showsVerticalScrollIndicator={false}>
          {/* New cases section */}
          {newCases.length > 0 && (
            <>
              {/* <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Newly Assigned Cases</Text>
                <View style={styles.sectionCount}>
                  <Text style={styles.sectionCountText}>{newCases.length}</Text>
                </View>
              </View> */}
              {newCases.map((case_, index) => renderCaseCard(case_, index))}
            </>
          )}

          {/* Dummy cases section */}
          {initialDummyCases.length > 0 && (
            <>
              {/* <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Sample Cases</Text>
                <View style={styles.sectionCount}>
                  <Text style={styles.sectionCountText}>{initialDummyCases.length}</Text>
                </View>
              </View> */}
              {initialDummyCases.map((case_, index) => renderCaseCard(case_, index + newCases.length))}
            </>
          )}

          {filteredCases.length === 0 && (
            <View style={styles.emptyState}>
              <Shield size={64} color="#CBD5E1" strokeWidth={1.5} />
              <Text style={styles.emptyStateTitle}>No Cases Found</Text>
              <Text style={styles.emptyStateText}>
                No cases match your current filters. Try changing your search or filter criteria.
              </Text>
            </View>
          )}
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

      {renderCaseDetailModal()}
      {renderAddUpdateModal()}
      {renderAddWitnessModal()}
      {renderUploadEvidenceModal()}
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
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
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    marginLeft: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    paddingVertical: 8,
    maxHeight: 40,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 6,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
    height: 26,
  },
  activeFilterChip: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  filterCount: {
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    minWidth: 16,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  activeFilterCount: {
    backgroundColor: '#4F46E5',
  },
  filterCountText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  activeFilterCountText: {
    color: '#FFFFFF',
  },
  casesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  sectionCount: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sectionCountText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  caseInfo: {
    flex: 1,
  },
  caseId: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  caseType: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  priorityText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  caseDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    marginBottom: 10,
    lineHeight: 18,
  },
  caseDetails: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 5,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    gap: 3,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
  },
  caseStats: {
    flexDirection: 'row',
    gap: 10,
  },
  updateCount: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  evidenceCount: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  bottomSpacing: {
    height: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.85,
    paddingTop: 16,
  },
  smallModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    margin: 16,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  statusBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  statusTextLarge: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  priorityBadgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priorityTextLarge: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#6366F1',
  },
  tabContent: {
    flex: 1,
  },
  overviewContent: {
    padding: 18,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  infoCard: {
    width: (width - 56) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoCardLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 6,
    marginBottom: 3,
  },
  infoCardValue: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  progressCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 14,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressCardTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  progressCardSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  updatesContent: {
    padding: 18,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginBottom: 16,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  timeline: {
    gap: 14,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
    marginTop: 3,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  timelineAction: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 3,
  },
  timelineBy: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  evidenceContent: {
    padding: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    marginBottom: 16,
    gap: 6,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  evidenceList: {
    gap: 10,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  evidenceImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  evidenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  evidenceInfo: {
    flex: 1,
  },
  evidenceName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  evidenceType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  witnessesContent: {
    padding: 18,
  },
  witnessList: {
    gap: 10,
  },
  witnessCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  witnessAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  witnessInitial: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  witnessInfo: {
    flex: 1,
  },
  witnessName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  witnessContact: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 6,
  },
  witnessStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  witnessStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 180,
  },
  witnessStatusText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  recordButtonText: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  uploadOption: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    width: 120,
  },
  uploadOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  uploadingText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginVertical: 10,
  },
});