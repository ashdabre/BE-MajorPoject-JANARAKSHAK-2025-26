// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Search, Plus, MapPin, Clock, User, Camera, Filter, Phone, Calendar, TriangleAlert as AlertTriangle } from 'lucide-react-native';

// export default function MissingPersonScreen() {
//   const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');
//   const [searchQuery, setSearchQuery] = useState('');

//   const missingPersons = [
//     {
//       id: 1,
//       name: 'Anita Sharma',
//       age: 28,
//       lastSeen: 'MG Road Metro Station',
//       date: '2024-01-15',
//       time: '18:30',
//       description: 'Wearing blue saree, carrying black handbag',
//       image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
//       contact: '+91 98765 43210',
//       caseId: 'MP/2024/001234',
//       status: 'Active',
//       reward: '₹50,000'
//     },
//     {
//       id: 2,
//       name: 'Rajesh Kumar',
//       age: 45,
//       lastSeen: 'Brigade Road',
//       date: '2024-01-14',
//       time: '20:15',
//       description: 'Wearing white shirt, blue jeans, has a scar on left hand',
//       image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
//       contact: '+91 87654 32109',
//       caseId: 'MP/2024/001233',
//       status: 'Found',
//       reward: '₹25,000'
//     },
//     {
//       id: 3,
//       name: 'Priya Patel',
//       age: 16,
//       lastSeen: 'Koramangala 5th Block',
//       date: '2024-01-13',
//       time: '16:45',
//       description: 'School uniform, carrying pink backpack',
//       image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
//       contact: '+91 76543 21098',
//       caseId: 'MP/2024/001232',
//       status: 'Active',
//       reward: '₹30,000'
//     }
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Found': return '#10b981';
//       case 'Active': return '#f59e0b';
//       default: return '#ef4444';
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#667eea', '#764ba2']}
//         style={styles.header}
//       >
//         <Text style={styles.title}>Missing Persons</Text>
//         <Text style={styles.subtitle}>Help find missing people in your community</Text>
//       </LinearGradient>

//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'search' && styles.activeTab]}
//           onPress={() => setActiveTab('search')}
//           activeOpacity={0.8}
//         >
//           <Search size={20} color={activeTab === 'search' ? '#667eea' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
//             Search Missing
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'report' && styles.activeTab]}
//           onPress={() => setActiveTab('report')}
//           activeOpacity={0.8}
//         >
//           <Plus size={20} color={activeTab === 'report' ? '#667eea' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'report' && styles.activeTabText]}>
//             Report Missing
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {activeTab === 'search' ? (
//           <View>
//             <View style={styles.searchSection}>
//               <View style={styles.searchContainer}>
//                 <Search size={20} color="#94a3b8" />
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Search by name, location, or case ID..."
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                   placeholderTextColor="#94a3b8"
//                 />
//                 <TouchableOpacity style={styles.filterButton}>
//                   <Filter size={20} color="#667eea" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={styles.emergencyAlert}>
//               <LinearGradient
//                 colors={['#fef3c7', '#fde68a']}
//                 style={styles.alertGradient}
//               >
//                 <AlertTriangle size={24} color="#d97706" />
//                 <View style={styles.alertContent}>
//                   <Text style={styles.alertTitle}>Emergency Alert</Text>
//                   <Text style={styles.alertText}>
//                     If you see any missing person, immediately contact police or family
//                   </Text>
//                 </View>
//               </LinearGradient>
//             </View>

//             <View style={styles.missingList}>
//               {missingPersons.map((person) => (
//                 <TouchableOpacity key={person.id} style={styles.personCard} activeOpacity={0.8}>
//                   <LinearGradient
//                     colors={['#ffffff', '#f8fafc']}
//                     style={styles.cardGradient}
//                   >
//                     <View style={styles.personHeader}>
//                       <Image source={{ uri: person.image }} style={styles.personImage} />
//                       <View style={styles.personInfo}>
//                         <Text style={styles.personName}>{person.name}</Text>
//                         <Text style={styles.personAge}>Age: {person.age}</Text>
//                         <Text style={styles.caseId}>{person.caseId}</Text>
//                         <View style={[
//                           styles.statusBadge,
//                           { backgroundColor: getStatusColor(person.status) }
//                         ]}>
//                           <Text style={styles.statusText}>{person.status}</Text>
//                         </View>
//                       </View>
//                       <View style={styles.rewardContainer}>
//                         <Text style={styles.rewardLabel}>Reward</Text>
//                         <Text style={styles.rewardAmount}>{person.reward}</Text>
//                       </View>
//                     </View>

//                     <Text style={styles.description}>{person.description}</Text>

//                     <View style={styles.locationInfo}>
//                       <View style={styles.locationRow}>
//                         <MapPin size={16} color="#64748b" />
//                         <Text style={styles.locationText}>Last seen: {person.lastSeen}</Text>
//                       </View>
//                       <View style={styles.locationRow}>
//                         <Clock size={16} color="#64748b" />
//                         <Text style={styles.locationText}>{person.date} at {person.time}</Text>
//                       </View>
//                     </View>

//                     <View style={styles.actionButtons}>
//                       <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
//                         <Phone size={16} color="#667eea" />
//                         <Text style={styles.contactButtonText}>Contact Family</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.reportButton} activeOpacity={0.8}>
//                         <AlertTriangle size={16} color="#ffffff" />
//                         <Text style={styles.reportButtonText}>Report Sighting</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ) : (
//           <View style={styles.reportSection}>
//             <View style={styles.reportCard}>
//               <LinearGradient
//                 colors={['#ffffff', '#f8fafc']}
//                 style={styles.reportGradient}
//               >
//                 <Text style={styles.reportTitle}>Report Missing Person</Text>
//                 <Text style={styles.reportSubtitle}>
//                   Provide detailed information to help locate the missing person
//                 </Text>

//                 <TouchableOpacity style={styles.photoUpload} activeOpacity={0.8}>
//                   <Camera size={32} color="#667eea" />
//                   <Text style={styles.photoUploadText}>Upload Photo</Text>
//                   <Text style={styles.photoUploadSubtext}>Recent clear photo required</Text>
//                 </TouchableOpacity>

//                 <View style={styles.formSection}>
//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Full Name *</Text>
//                     <TextInput style={styles.input} placeholder="Enter full name" />
//                   </View>

//                   <View style={styles.inputRow}>
//                     <View style={styles.inputColumn}>
//                       <Text style={styles.inputLabel}>Age *</Text>
//                       <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" />
//                     </View>
//                     <View style={styles.inputColumn}>
//                       <Text style={styles.inputLabel}>Gender *</Text>
//                       <TextInput style={styles.input} placeholder="Gender" />
//                     </View>
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Last Seen Location *</Text>
//                     <TextInput style={styles.input} placeholder="Exact location where last seen" />
//                   </View>

//                   <View style={styles.inputRow}>
//                     <View style={styles.inputColumn}>
//                       <Text style={styles.inputLabel}>Date *</Text>
//                       <TextInput style={styles.input} placeholder="DD/MM/YYYY" />
//                     </View>
//                     <View style={styles.inputColumn}>
//                       <Text style={styles.inputLabel}>Time *</Text>
//                       <TextInput style={styles.input} placeholder="HH:MM" />
//                     </View>
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Description *</Text>
//                     <TextInput 
//                       style={styles.textArea} 
//                       placeholder="Physical description, clothing, distinguishing features..."
//                       multiline
//                       numberOfLines={4}
//                     />
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Contact Number *</Text>
//                     <TextInput 
//                       style={styles.input} 
//                       placeholder="Primary contact number"
//                       keyboardType="phone-pad"
//                     />
//                   </View>
//                 </View>

//                 <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
//                   <LinearGradient
//                     colors={['#667eea', '#764ba2']}
//                     style={styles.submitGradient}
//                   >
//                     <Text style={styles.submitButtonText}>Submit Missing Person Report</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f1f5f9',
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingVertical: 32,
//     borderBottomLeftRadius: 32,
//     borderBottomRightRadius: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: 'rgba(255,255,255,0.8)',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffff',
//     marginHorizontal: 24,
//     marginTop: 16,
//     borderRadius: 16,
//     padding: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   tab: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//   },
//   activeTab: {
//     backgroundColor: '#f0f7ff',
//   },
//   tabText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#64748b',
//   },
//   activeTabText: {
//     color: '#667eea',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 16,
//   },
//   searchSection: {
//     marginBottom: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#1e293b',
//   },
//   filterButton: {
//     padding: 4,
//   },
//   emergencyAlert: {
//     marginBottom: 24,
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   alertGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 12,
//   },
//   alertContent: {
//     flex: 1,
//   },
//   alertTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: '#92400e',
//   },
//   alertText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#92400e',
//     marginTop: 4,
//   },
//   missingList: {
//     gap: 16,
//   },
//   personCard: {
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   cardGradient: {
//     padding: 20,
//   },
//   personHeader: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   personImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 16,
//     marginRight: 16,
//   },
//   personInfo: {
//     flex: 1,
//   },
//   personName: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: '#1e293b',
//   },
//   personAge: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     marginTop: 4,
//   },
//   caseId: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#667eea',
//     marginTop: 4,
//   },
//   statusBadge: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   statusText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
//   rewardContainer: {
//     alignItems: 'center',
//   },
//   rewardLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     color: '#64748b',
//   },
//   rewardAmount: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#059669',
//     marginTop: 4,
//   },
//   description: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#374151',
//     lineHeight: 24,
//     marginBottom: 16,
//   },
//   locationInfo: {
//     gap: 8,
//     marginBottom: 16,
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   locationText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   contactButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f0f7ff',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//   },
//   contactButtonText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#667eea',
//   },
//   reportButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#ef4444',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//   },
//   reportButtonText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//   },
//   reportSection: {
//     paddingBottom: 32,
//   },
//   reportCard: {
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   reportGradient: {
//     padding: 24,
//   },
//   reportTitle: {
//     fontSize: 24,
//     fontFamily: 'Inter-Bold',
//     color: '#1e293b',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   reportSubtitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   photoUpload: {
//     alignItems: 'center',
//     backgroundColor: '#f8fafc',
//     borderWidth: 2,
//     borderColor: '#e2e8f0',
//     borderStyle: 'dashed',
//     borderRadius: 16,
//     paddingVertical: 32,
//     marginBottom: 24,
//   },
//   photoUploadText: {
//     fontSize: 18,
//     fontFamily: 'Inter-SemiBold',
//     color: '#667eea',
//     marginTop: 12,
//   },
//   photoUploadSubtext: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#94a3b8',
//     marginTop: 4,
//   },
//   formSection: {
//     gap: 16,
//     marginBottom: 32,
//   },
//   inputGroup: {
//     gap: 8,
//   },
//   inputLabel: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#374151',
//   },
//   input: {
//     backgroundColor: '#f8fafc',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#1e293b',
//   },
//   inputRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   inputColumn: {
//     flex: 1,
//     gap: 8,
//   },
//   textArea: {
//     backgroundColor: '#f8fafc',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#1e293b',
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   submitButton: {
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   submitGradient: {
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
// });