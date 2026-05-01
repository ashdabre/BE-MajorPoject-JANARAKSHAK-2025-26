import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, StatusBar, Alert } from 'react-native';
import { MessageCircle, Send, Bot, User, FileText, Scale, Sparkles, Clock, CircleCheck as CheckCircle, ChevronRight, AlertCircle, WifiOff } from 'lucide-react-native';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
  isTyping?: boolean;
  followUpOptions?: string[];
}

// Groq API Configuration - Replace with your API key

// const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hey there! I\'m your friendly legal assistant. I can help you understand Indian laws in simple, conversational terms.\n\nI can help with:\n• Understanding your legal rights\n• Navigating procedures\n• Property & consumer matters\n• Family law questions\n\nWhat would you like to know about?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [useFallback, setUseFallback] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const quickQuestions = [
    'How to file a consumer complaint?',
    'What are my rights as a tenant?',
    'How to register an FIR online?',
    'Property dispute resolution',
    'Domestic violence protection',
    'Cybercrime reporting',
    'How to get legal aid?',
    'Bail application process',
  ];

  const legalCategories = [
    { title: 'Criminal Law', icon: '⚖️', color: '#ef4444' },
    { title: 'Civil Law', icon: '🏛️', color: '#3b82f6' },
    { title: 'Family Law', icon: '👨‍👩‍👧‍👦', color: '#10b981' },
    { title: 'Property Law', icon: '🏠', color: '#f59e0b' },
    { title: 'Consumer Rights', icon: '🛡️', color: '#8b5cf6' },
    { title: 'Labour Law', icon: '👷', color: '#06b6d4' },
  ];

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  // Test API connection on component mount
  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      setApiStatus('checking');
      
      if (!GROQ_API_KEY || GROQ_API_KEY === '') {
        setApiStatus('offline');
        setUseFallback(true);
        console.log('⚠️ API key not configured');
        return false;
      }

      // Test the API with a simple request
      const testResponse = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5,
        }),
      });

      if (testResponse.ok) {
        setApiStatus('online');
        setUseFallback(false);
        console.log('✅ API connection successful');
        return true;
      } else {
        throw new Error(`API responded with status: ${testResponse.status}`);
      }
      
    } catch (error) {
      console.error('❌ API connection error:', error);
      setApiStatus('offline');
      setUseFallback(true);
      return false;
    }
  };

  const callGroqAPI = async (userMessage: string): Promise<any> => {
    try {
      console.log('Calling Groq API...');
      
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `You are a friendly Indian legal advisor. Provide accurate, helpful information about Indian laws in simple, conversational language.
              
              Guidelines:
              1. Explain Indian laws in easy-to-understand terms
              2. Focus on practical advice and procedures
              3. Mention relevant Indian Acts when appropriate
              4. Be conversational and friendly
              5. If unsure, suggest consulting a lawyer
              6. Format with clear paragraphs and occasional bullet points
              7. End with relevant follow-up questions`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          top_p: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        return {
          success: true,
          response: data.choices[0].message.content,
          followUpOptions: generateFollowUpOptions(userMessage),
        };
      }
      
      return {
        success: false,
        error: 'No response from AI'
      };
      
    } catch (error: any) {
      console.error('Groq API call failed:', error);
      return {
        success: false,
        error: error.message || 'API call failed',
        fallback: true
      };
    }
  };

  const generateFollowUpOptions = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('fir') || lowerQuery.includes('police') || lowerQuery.includes('crime')) {
      return [
        'What documents are needed for FIR?',
        'Can I file FIR online?',
        'What happens after FIR filing?',
        'How to track FIR status?'
      ];
    }
    
    if (lowerQuery.includes('consumer') || lowerQuery.includes('complaint') || lowerQuery.includes('refund')) {
      return [
        'How to file consumer complaint online?',
        'What compensation can I claim?',
        'Time limit for consumer cases',
        'Which forum should I approach?'
      ];
    }
    
    if (lowerQuery.includes('property') || lowerQuery.includes('land') || lowerQuery.includes('house')) {
      return [
        'Property registration process',
        'Required documents for registration',
        'Stamp duty and registration fees',
        'How to verify property documents?'
      ];
    }
    
    return [
      'Can you explain more simply?',
      'What documents are required?',
      'What are the legal costs?',
      'How long does this process take?'
    ];
  };

  const getSimulatedResponse = (userMessage: string): { response: string; followUpOptions: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('criminal') || lowerMessage.includes('crime') || lowerMessage.includes('fir')) {
      return {
        response: `Oh, criminal law questions! This is actually one of the most common things people ask about. Let me give you the key points.\n\nBasically, criminal law deals with actions that harm society as a whole. Think stuff like theft, assault, fraud.\n\nThe Quick Breakdown:\n• IPC - Defines crimes\n• CrPC - Procedures\n• Evidence Act - Proof rules\n\nIf You're Ever in That Situation:\n1. Know your basic rights\n2. Document everything\n3. Get professional help early\n\nFun Fact: In India, you're presumed innocent until proven guilty!`,
        followUpOptions: ['Tell me more about criminal law', 'What happens after FIR?', 'How much does a lawyer cost?']
      };
    }
    
    if (lowerMessage.includes('consumer') || lowerMessage.includes('complaint') || lowerMessage.includes('refund')) {
      return {
        response: `Consumer issues? Been there! Let me tell you, the consumer protection laws in India are pretty good these days.\n\nThe TL;DR Version:\nIf you bought something defective or got bad service, you have rights.\n\nWhere to Complain:\n• Small issues → District Forum\n• Bigger issues → State Commission\n• Major cases → National Commission\n\nWhat You'll Need:\n1. Your purchase bill\n2. What went wrong\n3. How you tried to resolve\n4. What you want\n\nPro Tip: Always communicate in writing first. Email creates a paper trail.`,
        followUpOptions: ['Tell me more about consumer complaints', 'How to file online?', 'What compensation can I get?']
      };
    }
    
    // Default response
    return {
      response: `Hmm, I see you're asking about "${userMessage}". That's actually a pretty common question!\n\nIn simple terms, for most legal matters in India:\n• Document everything - Keep records\n• Know your basic rights\n• Don't hesitate to seek help\n• Act timely - Most actions have time limits\n\nIf you're comfortable sharing, what specifically about this are you concerned about? I can give more tailored advice.`,
      followUpOptions: ['Tell me more about this', 'What documents do I need?', 'How much does it cost?']
    };
  };

  const handleSendMessage = async () => {
    if (inputText.trim() && !isProcessing) {
      const userMessage = inputText.trim();
      console.log('User message:', userMessage);
      
      const newMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsProcessing(true);
      setIsTyping(true);
      
      try {
        let botResponse: string;
        let followUpOptions: string[] = [];
        
        // Try Groq API if online
        if (apiStatus === 'online' && GROQ_API_KEY && GROQ_API_KEY !== '') {
          console.log('Attempting Groq API call...');
          const apiResult = await callGroqAPI(userMessage);
          
          if (apiResult.success) {
            console.log('✅ Using AI response');
            botResponse = apiResult.response;
            followUpOptions = apiResult.followUpOptions;
            setUseFallback(false);
          } else {
            console.log('⚠️ AI API failed, using simulated');
            setApiStatus('offline');
            setUseFallback(true);
            const simulated = getSimulatedResponse(userMessage);
            botResponse = simulated.response;
            followUpOptions = simulated.followUpOptions;
          }
        } else {
          // Use simulated response
          console.log('Using simulated response');
          await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
          const simulated = getSimulatedResponse(userMessage);
          botResponse = simulated.response;
          followUpOptions = simulated.followUpOptions;
        }
        
        const newBotMessage: Message = {
          id: Date.now() + 1,
          type: 'bot',
          content: botResponse,
          timestamp: new Date().toISOString(),
          followUpOptions,
        };
        
        setMessages(prev => [...prev, newBotMessage]);
        
      } catch (error) {
        console.error('Error getting response:', error);
        
        // Emergency fallback
        const emergencyResponse = `Hmm, I'm having a bit of a technical moment. Let me give you what I know about "${userMessage}" in simple terms.\n\nFor most legal matters:\n1. Keep good records\n2. Don't wait too long\n3. Consider local legal advice\n4. Explore multiple solutions\n\nSorry about that! What specifically were you wanting to know?`;
        
        const newBotMessage: Message = {
          id: Date.now() + 1,
          type: 'bot',
          content: emergencyResponse,
          timestamp: new Date().toISOString(),
          followUpOptions: ['Can you explain that differently?', 'What documents do I need?', 'How do I start?']
        };
        
        setMessages(prev => [...prev, newBotMessage]);
      } finally {
        setIsProcessing(false);
        setIsTyping(false);
      }
    }
  };

  const handleQuickQuestion = async (question: string) => {
    console.log('Quick question selected:', question);
    setInputText(question);
    
    // Auto-send after a short delay for better UX
    setTimeout(async () => {
      if (!isProcessing) {
        await handleSendMessage();
      }
    }, 300);
  };

  const handleFollowUpQuestion = async (question: string) => {
    console.log('Follow up question:', question);
    setInputText(question);
    
    // Auto-send immediately
    if (!isProcessing) {
      await handleSendMessage();
    }
  };

  const handleClearChat = () => {
    console.log('Clearing chat');
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hey there! I\'m your friendly legal assistant. I can help you understand Indian laws in simple, conversational terms.\n\nI can help with:\n• Understanding your legal rights\n• Navigating procedures\n• Property & consumer matters\n• Family law questions\n\nWhat would you like to know about?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const testConnection = async () => {
    Alert.alert(
      'Testing Connection',
      'This will test the connection to the AI service.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Test',
          onPress: async () => {
            setIsProcessing(true);
            try {
              const isConnected = await checkAPIStatus();
              Alert.alert(
                'Connection Status',
                isConnected 
                  ? '✅ AI service is connected! Using real AI responses.'
                  : '⚠️ AI service is offline. Using simulated responses.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to test connection.');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.typingDot,
                {
                  opacity: typingAnimation,
                  transform: [
                    {
                      translateY: typingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -3],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.typingText}>
          {apiStatus === 'online' ? 'Getting AI response...' : 'Thinking...'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.headerIcon} onPress={testConnection}>
            <Sparkles size={24} color="#1e3a8a" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Legal Guide Assistant</Text>
            <Text style={styles.subtitle}>
              {apiStatus === 'online' ? '✅ AI Powered' : '⚠️ Offline Mode'}
              {useFallback && ' • Using Fallback'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.testButton}
              onPress={testConnection}
              disabled={isProcessing}
            >
              <Text style={styles.testButtonText}>Test</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearChat}
              disabled={isProcessing}
            >
              <Text style={styles.clearButtonText}>New</Text>
            </TouchableOpacity>
            <View style={styles.statusIndicator}>
              <View style={[styles.onlineStatus, { 
                backgroundColor: apiStatus === 'online' ? '#10b981' : 
                               apiStatus === 'checking' ? '#f59e0b' : '#ef4444' 
              }]} />
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <View style={[
                styles.messageWrapper,
                message.type === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
              ]}>
                <View style={[
                  styles.message,
                  message.type === 'user' ? styles.userMessage : styles.botMessage
                ]}>
                  <View style={styles.messageHeader}>
                    {message.type === 'bot' ? (
                      <Bot size={16} color="#6b7280" />
                    ) : (
                      <User size={16} color="#ffffff" />
                    )}
                    <Text style={[
                      styles.messageType,
                      message.type === 'user' ? styles.userMessageType : styles.botMessageType
                    ]}>
                      {message.type === 'bot' ? 'Legal Guide' : 'You'}
                    </Text>
                    {message.type === 'bot' && apiStatus === 'online' && !useFallback && (
                      <Sparkles size={12} color="#8b5cf6" />
                    )}
                  </View>
                  <Text style={[
                    styles.messageContent,
                    message.type === 'user' ? styles.userMessageContent : styles.botMessageContent
                  ]}>
                    {message.content}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    message.type === 'user' ? styles.userMessageTime : styles.botMessageTime
                  ]}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
              
              {/* Follow-up questions for bot messages */}
              {message.type === 'bot' && message.followUpOptions && message.followUpOptions.length > 0 && (
                <View style={styles.followUpContainer}>
                  <Text style={styles.followUpTitle}>Quick follow-ups:</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.followUpScroll}
                  >
                    {message.followUpOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.followUpButton}
                        onPress={() => handleFollowUpQuestion(option)}
                        disabled={isProcessing}
                      >
                        <Text style={styles.followUpText}>{option}</Text>
                        <ChevronRight size={14} color="#1e3a8a" />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </React.Fragment>
          ))}
          
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {messages.length === 1 && (
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Common Legal Topics</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {legalCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.categoryCard, { borderLeftColor: category.color }]}
                  onPress={() => handleQuickQuestion(`Tell me about ${category.title} in simple terms`)}
                  disabled={isProcessing}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.quickQuestionsTitle}>Frequently Asked</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestions}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestion}
                  onPress={() => handleQuickQuestion(question)}
                  disabled={isProcessing}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainer}>
          {apiStatus === 'offline' && (
            <View style={styles.warningBanner}>
              <WifiOff size={14} color="#f59e0b" />
              <Text style={styles.warningText}>
                Using simulated responses. Check API connection.
              </Text>
            </View>
          )}
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything about Indian laws..."
              placeholderTextColor="#9ca3af"
              multiline
              maxHeight={100}
              editable={!isProcessing}
            />
            <TouchableOpacity
              style={[styles.sendButton, { 
                opacity: inputText.trim() && !isProcessing ? 1 : 0.5,
                backgroundColor: isProcessing ? '#6b7280' : 
                               apiStatus === 'online' ? '#7c3aed' : '#1e3a8a'
              }]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
            >
              {isProcessing ? (
                <View style={styles.spinner}>
                  {[0, 1, 2].map((i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.spinnerDot,
                        {
                          opacity: typingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1],
                          }),
                        }
                      ]}
                    />
                  ))}
                </View>
              ) : (
                <Send size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>
            {apiStatus === 'online' 
              ? 'AI-powered legal guidance • For official advice, consult a lawyer'
              : 'Simulated legal guidance • AI service temporarily unavailable'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  testButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  clearButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  statusIndicator: {
    alignItems: 'center',
  },
  onlineStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  warningBanner: {
    backgroundColor: '#fffbeb',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#92400e',
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
  },
  message: {
    maxWidth: '85%',
    borderRadius: 16,
    padding: 12,
  },
  userMessage: {
    backgroundColor: '#1e3a8a',
  },
  botMessage: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  messageType: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  userMessageType: {
    color: '#e5e7eb',
  },
  botMessageType: {
    color: '#6b7280',
  },
  messageContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  userMessageContent: {
    color: '#ffffff',
  },
  botMessageContent: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    opacity: 0.7,
  },
  userMessageTime: {
    color: '#cbd5e1',
  },
  botMessageTime: {
    color: '#9ca3af',
  },
  followUpContainer: {
    marginBottom: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  followUpTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  followUpScroll: {
    flexDirection: 'row',
  },
  followUpButton: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#dbeafe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  followUpText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1e3a8a',
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 2,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6b7280',
  },
  typingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  spinner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  spinnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    marginHorizontal: 1,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  quickActionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderLeftWidth: 3,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  quickQuestions: {
    flexDirection: 'row',
  },
  quickQuestion: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  quickQuestionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#f9fafb',
    maxHeight: 80,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disclaimer: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 14,
  },
});