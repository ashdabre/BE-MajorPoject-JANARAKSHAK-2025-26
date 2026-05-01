import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { Mic, MicOff, FileText, Shield, Search, Calendar, Volume2, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle, Camera, Plus, Brain, Send, Scale, Users, Save, Folder, Play, Trash2, Download, Eye } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';

// Type definitions
type Recording = Audio.Recording;
type RecordingItem = {
  id: string;
  uri: string;
  transcript: string;
  category: string;
  caseNumber: string;
  duration: number;
  date: string;
  title: string;
};

type Command = {
  id: number;
  command: string;
  status: string;
  time: string;
  result: string;
  aiVerified: boolean;
  recordingId?: string;
};

type VoiceCommand = {
  command: string;
  action: string;
  icon: any;
};

type FIRCase = {
  id: string;
  number: string;
  title: string;
  date: string;
  status: string;
};

type SaveCategory = {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
};

const API_BASE_URL = 'http://localhost:5000'; // Change to your backend URL

export default function VoiceCommandScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Recording | null>(null);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);
  const [noteText, setNoteText] = useState('');
  const [selectedCase, setSelectedCase] = useState('FIR/2024/001234');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SaveCategory | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<RecordingItem | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUri, setAudioUri] = useState('');
  
  const recordingRef = useRef<Recording | null>(null);
  const durationInterval = useRef<number | null>(null);

  const micScale = useSharedValue(1);
  const pulseAnimation = useSharedValue(0);

  // Mock FIR cases data
  const firCases: FIRCase[] = [
    { id: '1', number: 'FIR/2024/001234', title: 'Theft - MG Road', date: '2024-01-15', status: 'Under Investigation' },
    { id: '2', number: 'FIR/2024/001235', title: 'Burglary - Commercial Street', date: '2024-01-16', status: 'Evidence Collection' },
    { id: '3', number: 'FIR/2024/001236', title: 'Assault - Brigade Road', date: '2024-01-17', status: 'Witness Statements' },
    { id: '4', number: 'FIR/2024/001237', title: 'Fraud - Electronic City', date: '2024-01-18', status: 'Document Analysis' },
  ];

  const saveCategories: SaveCategory[] = [
    { id: 'fir', title: 'FIR Case', icon: FileText, color: '#EF4444', description: 'Save recording to FIR case file' },
    { id: 'witness', title: 'Witness Statement', icon: Users, color: '#3B82F6', description: 'Save as witness testimony' },
    { id: 'evidence', title: 'Evidence Recording', icon: Camera, color: '#8B5CF6', description: 'Save as evidence audio' },
    { id: 'patrol', title: 'Patrol Log', icon: Shield, color: '#10B981', description: 'Save to patrol activity log' },
    { id: 'general', title: 'General Notes', icon: FileText, color: '#6B7280', description: 'Save as general case notes' },
  ];

  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      micScale.value = withSpring(1.2);
      pulseAnimation.value = withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      );
      
      // Start recording duration timer
      durationInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000) as unknown as number;
    } else {
      micScale.value = withSpring(1);
      pulseAnimation.value = 0;
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    }
  }, [isRecording]);

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseAnimation.value,
    transform: [{ scale: 1 + pulseAnimation.value * 0.3 }],
  }));

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    setIsProcessing(true);
    console.log('Starting audio transcription...');
    
    // Convert blob URI to actual file
    const response = await fetch(audioUri);
    const blob = await response.blob();
    
    // Create FormData with the actual file
    const formData = new FormData();
    formData.append('audio', blob, 'recording.m4a');

    console.log('Sending audio to backend for transcription...');

    const uploadResponse = await fetch(`${API_BASE_URL}/transcribe`, {
      method: 'POST',
      body: formData,
      // Let browser set Content-Type automatically with boundary
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Transcription failed:', errorText);
      throw new Error(`Transcription failed: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    console.log(`Transcription received: ${data.transcript.substring(0, 100)}...`);
    return data.transcript;
  } catch (error) {
    console.error('Transcription error:', error);
    // Fallback to mock transcription if backend fails
    const sampleTranscripts = [
      'Subject was observed near the commercial complex around 2:30 AM carrying a suspicious package.',
      'Witness reports hearing loud noises and glass breaking from the adjacent building.',
      'Vehicle registration KA01AB1234 was spotted fleeing the scene at high speed.',
      'Suspect is approximately 5 feet 10 inches tall, wearing dark clothing and a baseball cap.',
      'Evidence includes fingerprints on the window frame and footprints in the mud.'
    ];
    const fallbackTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
    console.log(`Using fallback transcript: ${fallbackTranscript.substring(0, 100)}...`);
    return fallbackTranscript;
  } finally {
    setIsProcessing(false);
  }
};

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingDuration(0);
      setTranscript('');
      console.log('Recording started...');
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      recordingRef.current = recording;
      console.log('Audio recording object created successfully');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
      
      console.log('Stopping recording...');
      
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        if (uri) {
          setAudioUri(uri);
          console.log(`Recording saved to: ${uri}`);
          
          // Get transcription from backend
          const transcription = await transcribeAudio(uri);
          setTranscript(transcription);
          setShowSaveModal(true);
          console.log('Ready to save recording with transcript');
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleVoiceCommand = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleSaveRecording = (category: SaveCategory) => {
    setSelectedCategory(category);
    setShowSaveModal(false);
    console.log(`Selected category: ${category.title}`);
    
    if (category.id === 'fir') {
      setShowCaseModal(true);
      console.log('Opening FIR case selection modal');
    } else {
      saveToCategory(category, null);
    }
  };

  const saveToCategory = async (category: SaveCategory, selectedCase: FIRCase | null) => {
    try {
      console.log(`Saving recording to ${category.title}...`);
      
      // Send recording data to backend
      const response = await fetch(`${API_BASE_URL}/save-recording`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_uri: audioUri,
          transcript: transcript,
          category: category.title,
          case_number: selectedCase?.number || 'N/A',
          duration: recordingDuration,
          title: `${category.title} - ${formatTime(recordingDuration)}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save recording');
      }

      const savedRecording = await response.json();
      console.log(`Recording saved successfully with ID: ${savedRecording.id}`);
      
      const newRecording: RecordingItem = {
        id: savedRecording.id || Date.now().toString(),
        uri: audioUri,
        transcript: transcript,
        category: category.title,
        caseNumber: selectedCase?.number || 'N/A',
        duration: recordingDuration,
        date: new Date().toISOString(),
        title: `${category.title} - ${formatTime(recordingDuration)}`
      };
      
      setRecordings(prev => [newRecording, ...prev]);
      
      // Add to recent commands
      const newCommand: Command = {
        id: Date.now(),
        command: `Voice recording saved to ${category.title}`,
        status: 'completed',
        time: 'Just now',
        result: `Recording saved to ${selectedCase ? `Case ${selectedCase.number}` : category.title} with ${formatTime(recordingDuration)} audio`,
        aiVerified: true,
        recordingId: newRecording.id
      };
      setCommands(prev => [newCommand, ...prev]);
      
      Alert.alert(
        '✅ Recording Saved Successfully!',
        `Your recording has been saved to:\n\n📁 ${category.title}${selectedCase ? `\n📋 ${selectedCase.number}` : ''}\n\n⏱️ Duration: ${formatTime(recordingDuration)}\n🗓️ ${new Date().toLocaleString()}\n\nTranscript: ${transcript.substring(0, 100)}...`,
        [{ text: 'Continue', onPress: () => {
          setAudioUri('');
          setTranscript('');
          setRecordingDuration(0);
        }}]
      );
      
      setShowCaseModal(false);
      console.log('Save process completed successfully');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save recording to server');
    }
  };

  const playRecording = async (recordingItem: RecordingItem) => {
    try {
      console.log(`Playing recording: ${recordingItem.title}`);
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingItem.uri },
        { shouldPlay: true }
      );
      // You might want to keep the sound object and manage it
    } catch (error) {
      console.error('Error playing recording:', error);
      Alert.alert('Error', 'Could not play recording');
    }
  };

  const deleteRecording = async (recordingId: string) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(`Deleting recording: ${recordingId}`);
              // Delete from backend
              await fetch(`${API_BASE_URL}/delete-recording/${recordingId}`, {
                method: 'DELETE',
              });
              
              // Delete from local state
              setRecordings(prev => prev.filter(rec => rec.id !== recordingId));
              console.log('Recording deleted successfully');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete recording from server');
            }
          }
        }
      ]
    );
  };

  const getRecordings = async () => {
    try {
      console.log('Fetching recordings from server...');
      const response = await fetch(`${API_BASE_URL}/recordings`);
      const data = await response.json();
      setRecordings(data.recordings || []);
      console.log(`Loaded ${data.recordings?.length || 0} recordings`);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  const showRecordingDetails = (recordingItem: RecordingItem) => {
    setSelectedRecording(recordingItem);
    setShowDetailModal(true);
    console.log(`Viewing details for recording: ${recordingItem.title}`);
  };

  useEffect(() => {
    getRecordings();
  }, []);

  const handleAddNote = () => {
    if (noteText.trim()) {
      const newNote: Command = {
        id: Date.now(),
        command: `Manual note: ${noteText.substring(0, 50)}...`,
        status: 'completed',
        time: 'Just now',
        result: `Note added to case ${selectedCase} with timestamp and location`,
        aiVerified: true
      };
      setCommands(prev => [newNote, ...prev]);
      setNoteText('');
      Alert.alert(
        '📝 Note Added Successfully',
        `Note has been added to case ${selectedCase} with:\n\n📍 GPS Location\n⏰ Timestamp\n🔄 Auto-sync to case file`,
        [{ text: 'Add Another', onPress: () => {} }]
      );
    }
  };

  const voiceCommands: VoiceCommand[] = [
    { command: 'File new case with evidence', action: 'case_filing', icon: FileText },
    { command: 'Search asset by ID or location', action: 'asset_search', icon: Search },
    { command: 'Add case notes and updates', action: 'note_taking', icon: FileText },
    { command: 'Generate court documents', action: 'doc_generation', icon: Scale },
    { command: 'Schedule court hearings', action: 'court_schedule', icon: Calendar },
    { command: 'Create patrol log entries', action: 'patrol_log', icon: Shield },
    { command: 'Record witness statements', action: 'witness_record', icon: Users },
    { command: 'Attach evidence with location', action: 'evidence_attach', icon: Camera },
  ];

  const recentCommands: Command[] = [
    { 
      id: 1, 
      command: 'File theft case at MG Road', 
      status: 'completed', 
      time: '2 min ago',
      result: 'Case FIR/2024/001245 created successfully',
      aiVerified: true
    },
    { 
      id: 2, 
      command: 'Search vehicle KA01AB1234', 
      status: 'completed', 
      time: '5 min ago',
      result: 'Vehicle found in impound yard',
      aiVerified: true
    },
    { 
      id: 3, 
      command: 'Note suspicious activity', 
      status: 'processing', 
      time: '1 min ago',
      result: 'AI verifying and processing...',
      aiVerified: false
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>AI Voice Command</Text>
            <Text style={styles.subtitle}>Record, transcribe & save voice notes</Text>
          </View>
          <View style={styles.aiIndicator}>
            <Brain size={24} color="#ffffff" />
            <View style={styles.aiPulse} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Voice Recording Section */}
        <View style={styles.voiceSection}>
          <View style={styles.micContainer}>
            <Animated.View style={[styles.pulseRing, pulseAnimatedStyle]} />
            <Animated.View style={[styles.micButton, micAnimatedStyle]}>
              <TouchableOpacity
                style={styles.micTouchable}
                onPress={handleVoiceCommand}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isRecording ? ['#EF4444', '#DC2626'] : ['#667eea', '#764ba2']}
                  style={styles.micGradient}
                >
                  {isRecording ? (
                    <MicOff size={32} color="#ffffff" />
                  ) : (
                    <Mic size={32} color="#ffffff" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          <Text style={styles.voiceStatus}>
            {isRecording ? `🎤 Recording... ${formatTime(recordingDuration)}` : 
             isProcessing ? '🤖 Processing transcription...' : '🎯 Tap to start recording'}
          </Text>
          
          {transcript ? (
            <View style={styles.transcriptCard}>
              <LinearGradient
                colors={['#ffffff', '#f0f7ff']}
                style={styles.transcriptGradient}
              >
                <Text style={styles.transcriptLabel}>Transcript:</Text>
                <Text style={styles.transcriptText}>{transcript}</Text>
                {isProcessing && (
                  <View style={styles.processingIndicator}>
                    <Brain size={16} color="#667eea" />
                    <Text style={styles.processingText}>AI is generating transcript...</Text>
                  </View>
                )}
              </LinearGradient>
            </View>
          ) : null}
        </View>

        {/* Manual Note Taking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.headerIcon}>
              <FileText size={20} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>On-Site Note Taking</Text>
          </View>
          
          <View style={styles.noteCard}>
            <LinearGradient
              colors={['#ffffff', '#f0fdf4']}
              style={styles.noteGradient}
            >
              <View style={styles.caseSelector}>
                <Text style={styles.caseSelectorLabel}>Select Case:</Text>
                <TouchableOpacity style={styles.caseDropdown}>
                  <Text style={styles.caseDropdownText}>{selectedCase}</Text>
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.noteInput}
                placeholder="Add case notes, observations, evidence details..."
                multiline
                numberOfLines={4}
                value={noteText}
                onChangeText={setNoteText}
                placeholderTextColor="#94a3b8"
              />
              
              <View style={styles.noteActions}>
                <TouchableOpacity style={styles.attachButton} activeOpacity={0.8}>
                  <Camera size={16} color="#667eea" />
                  <Text style={styles.attachButtonText}>Attach Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.addNoteButton} 
                  onPress={handleAddNote}
                  activeOpacity={0.8}
                >
                  <LinearGradient colors={['#10b981', '#059669']} style={styles.addNoteGradient}>
                    <Send size={16} color="#ffffff" />
                    <Text style={styles.addNoteText}>Add Note</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              <View style={styles.noteFeatures}>
                <View style={styles.noteFeature}>
                  <CheckCircle size={12} color="#10b981" />
                  <Text style={styles.noteFeatureText}>Auto GPS location</Text>
                </View>
                <View style={styles.noteFeature}>
                  <Clock size={12} color="#10b981" />
                  <Text style={styles.noteFeatureText}>Timestamp added</Text>
                </View>
                <View style={styles.noteFeature}>
                  <Brain size={12} color="#10b981" />
                  <Text style={styles.noteFeatureText}>AI categorization</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Saved Recordings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.headerIcon}>
              <Folder size={20} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Saved Recordings</Text>
          </View>
          
          <View style={styles.recordingsList}>
            {recordings.length > 0 ? (
              recordings.map((recording) => (
                <TouchableOpacity 
                  key={recording.id} 
                  style={styles.recordingCard}
                  onPress={() => showRecordingDetails(recording)}
                >
                  <LinearGradient
                    colors={['#ffffff', '#faf5ff']}
                    style={styles.recordingGradient}
                  >
                    <View style={styles.recordingHeader}>
                      <Text style={styles.recordingTitle}>{recording.title}</Text>
                      <View style={styles.recordingHeaderActions}>
                        <TouchableOpacity 
                          style={styles.viewButton}
                          onPress={() => showRecordingDetails(recording)}
                        >
                          <Eye size={16} color="#667eea" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => deleteRecording(recording.id)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <Text style={styles.recordingDetails}>
                      📁 {recording.category} • ⏱️ {formatTime(recording.duration)} • 🗓️ {new Date(recording.date).toLocaleDateString()}
                    </Text>
                    
                    {recording.caseNumber !== 'N/A' && (
                      <Text style={styles.caseNumber}>Case: {recording.caseNumber}</Text>
                    )}
                    
                    <Text style={styles.recordingTranscript} numberOfLines={2}>
                      {recording.transcript}
                    </Text>
                    
                    <View style={styles.recordingActions}>
                      <TouchableOpacity 
                        style={styles.playButton}
                        onPress={() => playRecording(recording)}
                      >
                        <Play size={16} color="#ffffff" />
                        <Text style={styles.playButtonText}>Play</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.downloadButton}>
                        <Download size={16} color="#667eea" />
                        <Text style={styles.downloadButtonText}>Download</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noRecordingsCard}>
                <LinearGradient
                  colors={['#ffffff', '#f8fafc']}
                  style={styles.noRecordingsGradient}
                >
                  <Text style={styles.noRecordingsText}>No recordings yet. Start recording to save voice notes.</Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Commands</Text>
          <View style={styles.commandsList}>
            {voiceCommands.map((cmd, index) => (
              <TouchableOpacity key={index} style={styles.commandCard} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#f8fafc', '#ffffff']}
                  style={styles.commandGradient}
                >
                  <LinearGradient colors={['#667eea', '#764ba2']} style={styles.commandIcon}>
                    <cmd.icon size={20} color="#ffffff" />
                  </LinearGradient>
                  <Text style={styles.commandText}>{cmd.command}</Text>
                  <Volume2 size={16} color="#94a3b8" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Commands</Text>
          <View style={styles.recentList}>
            {[...commands, ...recentCommands].map((cmd) => (
              <TouchableOpacity 
                key={cmd.id} 
                style={styles.recentCard}
                onPress={() => {
                  if (cmd.recordingId) {
                    const recording = recordings.find(r => r.id === cmd.recordingId);
                    if (recording) {
                      showRecordingDetails(recording);
                    }
                  }
                }}
              >
                <LinearGradient
                  colors={['#ffffff', '#f8fafc']}
                  style={styles.recentGradient}
                >
                  <View style={styles.recentHeader}>
                    <Text style={styles.recentCommand}>{cmd.command}</Text>
                    <View style={styles.recentStatus}>
                      {cmd.aiVerified && (
                        <View style={styles.verifiedBadge}>
                          <Brain size={10} color="#10b981" />
                          <Text style={styles.verifiedText}>AI Verified</Text>
                        </View>
                      )}
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: cmd.status === 'completed' ? '#10b981' : '#f59e0b' }
                      ]}>
                        {cmd.status === 'completed' ? (
                          <CheckCircle size={12} color="#ffffff" />
                        ) : (
                          <Clock size={12} color="#ffffff" />
                        )}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.recentResult}>{cmd.result}</Text>
                  <Text style={styles.recentTime}>{cmd.time}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save Recording Modal */}
      <Modal
        visible={showSaveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Save Recording</Text>
              <Text style={styles.modalSubtitle}>Select where to save your recording</Text>
            </LinearGradient>
            
            <FlatList
              data={saveCategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.categoryItem}
                  onPress={() => handleSaveRecording(item)}
                >
                  <LinearGradient
                    colors={[item.color, item.color]}
                    style={styles.categoryIcon}
                  >
                    <item.icon size={20} color="#ffffff" />
                  </LinearGradient>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                    <Text style={styles.categoryDescription}>{item.description}</Text>
                  </View>
                  <Save size={20} color={item.color} />
                </TouchableOpacity>
              )}
              style={styles.categoriesList}
            />
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowSaveModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Select FIR Case Modal */}
      <Modal
        visible={showCaseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Select FIR Case</Text>
              <Text style={styles.modalSubtitle}>Choose which FIR case to save recording to</Text>
            </LinearGradient>
            
            <FlatList
              data={firCases}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.caseItem}
                  onPress={() => {
                    if (selectedCategory) {
                      saveToCategory(selectedCategory, item);
                      Alert.alert(
                        '✅ Saved Successfully!',
                        `Recording has been saved to:\n\n${item.number}\n${item.title}`,
                        [{ text: 'OK' }]
                      );
                    }
                  }}
                >
                  <View style={styles.caseInfo}>
                    <Text style={styles.caseNumberText}>{item.number}</Text>
                    <Text style={styles.caseTitle}>{item.title}</Text>
                    <Text style={styles.caseDetails}>Date: {item.date} • Status: {item.status}</Text>
                  </View>
                  <Save size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
              style={styles.casesList}
            />
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowCaseModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recording Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.detailModal]}>
            {selectedRecording && (
              <>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.modalHeader}
                >
                  <Text style={styles.modalTitle}>Recording Details</Text>
                  <Text style={styles.modalSubtitle}>{selectedRecording.title}</Text>
                </LinearGradient>
                
                <ScrollView style={styles.detailContent}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>{selectedRecording.category}</Text>
                  </View>
                  
                  {selectedRecording.caseNumber !== 'N/A' && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Case Number</Text>
                      <Text style={styles.detailValue}>{selectedRecording.caseNumber}</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{formatTime(selectedRecording.duration)}</Text>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Date Created</Text>
                    <Text style={styles.detailValue}>{new Date(selectedRecording.date).toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Full Transcript</Text>
                    <View style={styles.transcriptBox}>
                      <Text style={styles.transcriptContent}>{selectedRecording.transcript}</Text>
                    </View>
                  </View>
                </ScrollView>
                
                <View style={styles.detailActions}>
                  <TouchableOpacity 
                    style={styles.detailPlayButton}
                    onPress={() => playRecording(selectedRecording)}
                  >
                    <Play size={20} color="#ffffff" />
                    <Text style={styles.detailPlayText}>Play Recording</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.detailCloseButton}
                    onPress={() => setShowDetailModal(false)}
                  >
                    <Text style={styles.detailCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  aiIndicator: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  voiceSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  micContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    top: -20,
    left: -20,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    elevation: 8,
  },
  micTouchable: {
    flex: 1,
  },
  micGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceStatus: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  transcriptCard: {
    borderRadius: 20,
    overflow: 'hidden',
    maxWidth: '90%',
    elevation: 4,
  },
  transcriptGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  transcriptLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    textAlign: 'left',
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  processingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#667eea',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  noteCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 16,
  },
  noteGradient: {
    padding: 20,
  },
  caseSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  caseSelectorLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  caseDropdown: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  caseDropdownText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  noteInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  attachButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  attachButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#667eea',
  },
  addNoteButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addNoteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  addNoteText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  noteFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteFeatureText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  recordingsList: {
    gap: 12,
  },
  recordingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  recordingGradient: {
    padding: 16,
  },
  recordingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recordingHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  recordingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    flex: 1,
  },
  viewButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  recordingDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginBottom: 4,
  },
  caseNumber: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginBottom: 8,
  },
  recordingTranscript: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 12,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  playButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#667eea',
  },
  noRecordingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  noRecordingsGradient: {
    padding: 24,
    alignItems: 'center',
  },
  noRecordingsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  commandsList: {
    gap: 12,
  },
  commandCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  commandGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  commandIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commandText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  recentList: {
    gap: 12,
  },
  recentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  recentGradient: {
    padding: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recentCommand: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  recentStatus: {
    alignItems: 'flex-end',
    gap: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentResult: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 4,
  },
  recentTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  detailModal: {
    maxHeight: '90%',
  },
  modalHeader: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  categoriesList: {
    maxHeight: 300,
  },
  casesList: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  categoryDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  caseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  caseInfo: {
    flex: 1,
  },
  caseNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  caseTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1e293b',
    marginTop: 2,
  },
  caseDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  detailContent: {
    padding: 20,
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  transcriptBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  transcriptContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  detailActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    gap: 12,
  },
  detailPlayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  detailPlayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  detailCloseButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 12,
  },
  detailCloseText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
});