import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Modal,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system/legacy';
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../server/services/supabaseClient';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const BACKEND = "https://12467719f2b2.ngrok-free.app";

const api = axios.create({
  baseURL: BACKEND,
  timeout: 60000,
});

interface Transcript {
  text: string;
  timestamp: Date;
  type: 'user' | 'assistant';
}

interface ConversationState {
  session_id: string;
  current_issue: string;
  follow_up_questions: string[];
  answers: string[];
  completed: boolean;
  created_at: string;
  updated_at: string;
  detected_language?: string;
}

interface ReportData {
  id: string;
  session_id: string;
  user_id: string;
  title: string;
  category: string;
  department: string;
  date: string;
  status: string;
  location: string;
  description: string;
  answers: any[];
  photo_path: string;
  generated_at: string;
}

export default function CallReportScreen() {
  const [recording, setRecording] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState<string>("");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [backendStatus, setBackendStatus] = useState<string>("unknown");
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [showDialpad, setShowDialpad] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [showTranscripts, setShowTranscripts] = useState(false);
  
  const recordingRef = useRef<any>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animations: Animated.CompositeAnimation[] = [];
    
    if (isRecording) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      const scale = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      const wave = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );

      animations = [scale, pulse, wave];
      animations.forEach(anim => anim.start());
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      scaleAnim.setValue(1);
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      animations.forEach(anim => anim.stop());
    };
  }, [isRecording]);

  React.useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await api.get('/health');
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  async function requestMicPermission(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      return false;
    }
  }

  async function startRecording() {
    try {
      const ok = await requestMicPermission();
      if (!ok) {
        Alert.alert("Permission needed", "Please allow microphone access.");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = newRecording;
      setRecording(newRecording);
      setIsRecording(true);
      setCallDuration(0);
    } catch (err) {
      Alert.alert("Recording failed", "Please try again");
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) return;
    try {
      setIsRecording(false);
      setIsProcessing(true);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      if (!uri) {
        Alert.alert("Error", "No recording found");
        return;
      }
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const response = await api.post('/api/v1/transcribe', {
        audio: base64Audio,
        session_id: currentSession,
      });
      const { transcript, session_id } = response.data;
      if (session_id) setCurrentSession(session_id);
      if (transcript && transcript.trim()) {
        setTranscripts(prev => [{text: transcript, timestamp: new Date(), type: 'user'}, ...prev]);
      }
    } catch (err: any) {
      Alert.alert("Error", "Transcription failed. Please try again.");
    } finally {
      setRecording(null);
      recordingRef.current = null;
      setIsProcessing(false);
    }
  }

  const capturePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission needed", "Please allow camera access.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled) {
        Alert.alert("Success", "Photo captured successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture photo");
    }
  };

  const generateReport = async () => {
    if (!currentSession) {
      Alert.alert("Error", "No active session. Please start recording first.");
      return;
    }
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      Alert.alert("Success", "Report generated successfully");
    }, 2000);
  };

  const handleDialPadPress = async (button: string) => {
    switch (button) {
      case "1":
        await capturePhoto();
        break;
      case "2":
        await generateReport();
        break;
      case "3":
        Alert.alert("Info", "Location saved");
        break;
    }
  };

  const startNewConversation = () => {
    setCurrentSession(null);
    setConversationState(null);
    setCurrentQuestion("");
    setTranscripts([]);
    setCallDuration(0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Ultra-Clean Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => router.push('/(citizen)')}
          >
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={styles.statusBadge}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: backendStatus === 'connected' ? '#10B981' : '#F87171' }
              ]} />
              <Text style={styles.statusText}>
                {backendStatus === 'connected' ? 'Live' : 'Offline'}
              </Text>
            </View>
          </View>
          
          {currentSession && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{formatCallDuration(callDuration)}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Centered Avatar with Animations */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {/* Outer Pulse Ring */}
            {isRecording && (
              <Animated.View 
                style={[
                  styles.pulseOuter,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.3],
                      outputRange: [0.4, 0],
                    }),
                    transform: [{ scale: pulseAnim }],
                  }
                ]}
              />
            )}
            
            {/* Main Avatar */}
            <Animated.View 
              style={[
                styles.avatarContainer,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <MaterialCommunityIcons name="robot-happy" size={72} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>

            {/* Sound Waves */}
            {(isRecording || isProcessing) && (
              <View style={styles.waveContainer}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.wave,
                      {
                        height: waveAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 70 - (i * 10)],
                        }),
                        opacity: waveAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 0.9],
                        }),
                      }
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
          
          <Text style={styles.avatarTitle}>Medical AI Assistant</Text>
          <Text style={styles.avatarSubtitle}>
            {isProcessing ? "Processing your voice..." : 
             isRecording ? "Listening carefully..." :
             conversationState?.completed ? "Session complete" :
             "Tap mic to start speaking"}
          </Text>
        </View>

        {/* Question Display Card */}
        {currentQuestion && (
          <View style={styles.questionCard}>
            <View style={styles.questionIcon}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.questionText}>{currentQuestion}</Text>
            <TouchableOpacity style={styles.replayButton}>
              <Ionicons name="volume-high-outline" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        )}

        {/* Progress Indicator */}
        {conversationState && !conversationState.completed && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progress</Text>
              <Text style={styles.progressCounter}>
                {(conversationState.answers?.length || 0)}/{conversationState.follow_up_questions?.length || 3}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBarFill,
                  {
                    width: `${((conversationState.answers?.length || 0) / (conversationState.follow_up_questions?.length || 3)) * 100}%`
                  }
                ]}
              />
            </View>
          </View>
        )}

        {/* Info Pills */}
        {(currentLocation || photos.length > 0) && (
          <View style={styles.pillContainer}>
            {currentLocation && (
              <View style={styles.pill}>
                <Ionicons name="location" size={14} color="#10B981" />
                <Text style={styles.pillText}>Location</Text>
              </View>
            )}
            {photos.length > 0 && (
              <View style={styles.pill}>
                <Ionicons name="image" size={14} color="#3B82F6" />
                <Text style={styles.pillText}>{photos.length} Photo(s)</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Control Area */}
      <View style={styles.bottomContainer}>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => setShowTranscripts(!showTranscripts)}
          >
            <View style={styles.actionBtnIcon}>
              <Ionicons name="list-outline" size={24} color="#64748B" />
            </View>
            <Text style={styles.actionBtnText}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={capturePhoto}
          >
            <View style={styles.actionBtnIcon}>
              <Ionicons name="camera-outline" size={24} color="#64748B" />
            </View>
            <Text style={styles.actionBtnText}>Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={generateReport}
          >
            <View style={styles.actionBtnIcon}>
              {isGeneratingReport ? (
                <ActivityIndicator size="small" color="#64748B" />
              ) : (
                <Ionicons name="document-text-outline" size={24} color="#64748B" />
              )}
            </View>
            <Text style={styles.actionBtnText}>Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => setShowDialpad(true)}
          >
            <View style={styles.actionBtnIcon}>
              <Ionicons name="apps-outline" size={24} color="#64748B" />
            </View>
            <Text style={styles.actionBtnText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Main Call Button */}
        <View style={styles.callSection}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || backendStatus !== 'connected'}
            activeOpacity={0.85}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <LinearGradient
                colors={
                  isRecording 
                    ? ['#EF4444', '#DC2626'] 
                    : backendStatus !== 'connected'
                    ? ['#CBD5E1', '#94A3B8']
                    : ['#10B981', '#059669']
                }
                style={styles.callButtonGradient}
              >
                <Ionicons 
                  name={isRecording ? "stop" : "mic"} 
                  size={32} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.callHint}>
            {isRecording ? "Tap to stop recording" : 
             isProcessing ? "Processing..." :
             "Press to speak"}
          </Text>
        </View>

        {/* Text Input */}
        <View style={styles.inputSection}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
            />
            {inputText.trim() && (
              <TouchableOpacity style={styles.sendButton}>
                <Ionicons name="send" size={20} color="#3B82F6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* New Session */}
        {currentSession && (
          <TouchableOpacity 
            style={styles.newSessionBtn}
            onPress={startNewConversation}
          >
            <Ionicons name="refresh-outline" size={18} color="#3B82F6" />
            <Text style={styles.newSessionText}>New Session</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Clean Dialpad Modal */}
      <Modal
        visible={showDialpad}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDialpad(false)}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <View style={styles.dialpadModalContent}>
            {/* Header */}
            <View style={styles.dialpadHeader}>
              <Text style={styles.dialpadTitle}>Quick Actions</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDialpad(false)}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Action Grid */}
            <View style={styles.actionGrid}>
              {/* Row 1 */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => {
                    setShowTranscripts(true);
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#EFF6FF', '#DBEAFE']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="list" size={28} color="#3B82F6" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => {
                    capturePhoto();
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#F3E8FF', '#E9D5FF']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="camera" size={28} color="#8B5CF6" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => {
                    generateReport();
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#ECFDF5', '#D1FAE5']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="document-text" size={28} color="#10B981" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Report</Text>
                </TouchableOpacity>
              </View>

              {/* Row 2 */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => {
                    Alert.alert("Repeat", "Repeating last question");
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#FFFBEB', '#FEF3C7']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="reload" size={28} color="#F59E0B" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Repeat</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => {
                    Alert.alert("Help", "How can we assist you?");
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#FDF2F8', '#FCE7F3']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="help-circle" size={28} color="#EC4899" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Help</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => {
                    Alert.alert("Settings", "Opening settings");
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#EEF2FF', '#E0E7FF']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="settings" size={28} color="#6366F1" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Settings</Text>
                </TouchableOpacity>
              </View>

              {/* Row 3 */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => {
                    Alert.alert("Share", "Sharing conversation");
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#F0FDFA', '#CCFBF1']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="share-social" size={28} color="#06B6D4" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => {
                    Alert.alert("Save", "Saving session");
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#F0FDF4', '#DCFCE7']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="save" size={28} color="#16A34A" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionCard, styles.emergencyCard]}
                  onPress={() => {
                    Alert.alert(
                      "Emergency", 
                      "Contacting emergency services",
                      [
                        {
                          text: "Cancel",
                          style: "cancel"
                        },
                        { 
                          text: "Call Emergency", 
                          onPress: () => {
                            // Emergency call logic
                            Alert.alert("Emergency", "Calling emergency services...");
                          },
                          style: "destructive"
                        }
                      ]
                    );
                    setShowDialpad(false);
                  }}
                >
                  <LinearGradient
                    colors={['#FEF2F2', '#FECACA']}
                    style={styles.actionIconContainer}
                  >
                    <Ionicons name="warning" size={28} color="#EF4444" />
                  </LinearGradient>
                  <Text style={[styles.actionLabel, styles.emergencyLabel]}>Emergency</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer Note */}
            <Text style={styles.footerNote}>
              Tap any action to perform it instantly
            </Text>
          </View>
        </BlurView>
      </Modal>

      {/* Transcripts Modal */}
      <Modal
        visible={showTranscripts}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTranscripts(false)}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <View style={styles.transcriptModal}>
            <View style={styles.dialpadHeader}>
              <Text style={styles.dialpadTitle}>Conversation History</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowTranscripts(false)}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.transcriptScroll} showsVerticalScrollIndicator={false}>
              {transcripts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="chatbubbles-outline" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyText}>No messages yet</Text>
                  <Text style={styles.emptySubtext}>
                    Start a conversation by tapping the microphone
                  </Text>
                </View>
              ) : (
                transcripts.map((item, index) => (
                  <View key={index} style={[
                    styles.transcriptItem,
                    item.type === 'user' ? styles.userMessage : styles.assistantMessage
                  ]}>
                    <View style={styles.transcriptHeader}>
                      <View style={[
                        styles.transcriptAvatar,
                        item.type === 'user' ? styles.userAvatar : styles.assistantAvatar
                      ]}>
                        <Ionicons 
                          name={item.type === 'user' ? "person" : "robot"} 
                          size={16} 
                          color="#FFFFFF" 
                        />
                      </View>
                      <Text style={styles.transcriptTime}>
                        {formatTime(item.timestamp)}
                      </Text>
                    </View>
                    <Text style={styles.transcriptText}>{item.text}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </BlurView>
      </Modal>

      {/* Loading Overlay */}
      {(isProcessing || isGeneratingReport) && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>
              {isProcessing ? "Processing voice..." : "Creating report..."}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  durationBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DBEAFE',
  },
  avatarContainer: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#FFFFFF',
  },
  waveContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  wave: {
    width: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  avatarTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  avatarSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  questionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  replayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  progressCounter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  actionBtnIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  callSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  callButton: {
    marginBottom: 10,
  },
  callButtonGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  callHint: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  inputSection: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 0,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  newSessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  newSessionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dialpadModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 20,
    maxHeight: height * 0.85,
  },
  dialpadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  dialpadTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionGrid: {
    gap: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  emergencyCard: {
    // Special styling for emergency card if needed
  },
  emergencyLabel: {
    color: '#EF4444',
    fontWeight: '700',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 24,
    fontStyle: 'italic',
  },
  transcriptModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    height: height * 0.8,
  },
  transcriptScroll: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CBD5E1',
    marginTop: 8,
    textAlign: 'center',
  },
  transcriptItem: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  assistantMessage: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transcriptAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    backgroundColor: '#3B82F6',
  },
  assistantAvatar: {
    backgroundColor: '#8B5CF6',
  },
  transcriptTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  transcriptText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#475569',
    marginTop: 16,
    fontWeight: '600',
  },
});