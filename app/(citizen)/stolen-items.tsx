// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Search, Plus, MapPin, Clock, User, Camera, Filter, Phone, TriangleAlert as AlertTriangle, Car, Smartphone, Laptop } from 'lucide-react-native';

// export default function StolenItemsScreen() {
//   const [activeTab, setActiveTab] = useState<'stolen' | 'found' | 'report'>('stolen');
//   const [searchQuery, setSearchQuery] = useState('');

//   const stolenItems = [
//     {
//       id: 1,
//       title: 'iPhone 14 Pro Max',
//       category: 'Electronics',
//       description: 'Space Black, 256GB, with purple case',
//       location: 'MG Road Metro Station',
//       date: '2024-01-15',
//       time: '18:30',
//       image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
//       reportedBy: 'Rahul Sharma',
//       caseId: 'ST/2024/001234',
//       value: '₹1,20,000',
//       status: 'Active',
//       icon: Smartphone
//     },
//     {
//       id: 2,
//       title: 'Honda City',
//       category: 'Vehicle',
//       description: 'White Honda City, KA 01 AB 1234',
//       location: 'Brigade Road',
//       date: '2024-01-14',
//       time: '22:15',
//       image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
//       reportedBy: 'Priya Patel',
//       caseId: 'ST/2024/001233',
//       value: '₹8,50,000',
//       status: 'Investigating',
//       icon: Car
//     },
//     {
//       id: 3,
//       title: 'MacBook Pro',
//       category: 'Electronics',
//       description: '13-inch MacBook Pro, Silver, with stickers',
//       location: 'Koramangala Cafe',
//       date: '2024-01-13',
//       time: '16:45',
//       image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
//       reportedBy: 'Amit Kumar',
//       caseId: 'ST/2024/001232',
//       value: '₹1,80,000',
//       status: 'Found',
//       icon: Laptop
//     }
//   ];

//   const foundItems = [
//     {
//       id: 1,
//       title: 'Samsung Galaxy S23',
//       description: 'Black Samsung phone found at bus stop',
//       location: 'Whitefield Bus Stop',
//       date: '2024-01-15',
//       image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
//       foundBy: 'Police Patrol',
//       status: 'Unclaimed'
//     }
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Found': return '#10b981';
//       case 'Active': return '#f59e0b';
//       case 'Investigating': return '#3b82f6';
//       default: return '#ef4444';
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#667eea', '#764ba2']}
//         style={styles.header}
//       >
//         <Text style={styles.title}>Stolen & Lost Items</Text>
//         <Text style={styles.subtitle}>Report and track stolen or lost belongings</Text>
//       </LinearGradient>

//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'stolen' && styles.activeTab]}
//           onPress={() => setActiveTab('stolen')}
//           activeOpacity={0.8}
//         >
//           <AlertTriangle size={18} color={activeTab === 'stolen' ? '#667eea' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'stolen' && styles.activeTabText]}>
//             Stolen
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'found' && styles.activeTab]}
//           onPress={() => setActiveTab('found')}
//           activeOpacity={0.8}
//         >
//           <Search size={18} color={activeTab === 'found' ? '#667eea' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'found' && styles.activeTabText]}>
//             Found
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'report' && styles.activeTab]}
//           onPress={() => setActiveTab('report')}
//           activeOpacity={0.8}
//         >
//           <Plus size={18} color={activeTab === 'report' ? '#667eea' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'report' && styles.activeTabText]}>
//             Report
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {activeTab === 'stolen' && (
//           <View>
//             <View style={styles.searchSection}>
//               <View style={styles.searchContainer}>
//                 <Search size={20} color="#94a3b8" />
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Search stolen items..."
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                   placeholderTextColor="#94a3b8"
//                 />
//                 <TouchableOpacity style={styles.filterButton}>
//                   <Filter size={20} color="#667eea" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={styles.itemsList}>
//               {stolenItems.map((item) => (
//                 <TouchableOpacity key={item.id} style={styles.itemCard} activeOpacity={0.8}>
//                   <LinearGradient
//                     colors={['#ffffff', '#f8fafc']}
//                     style={styles.itemGradient}
//                   >
//                     <View style={styles.itemHeader}>
//                       <Image source={{ uri: item.image }} style={styles.itemImage} />
//                       <View style={styles.itemInfo}>
//                         <Text style={styles.itemTitle}>{item.title}</Text>
//                         <Text style={styles.itemCategory}>{item.category}</Text>
//                         <Text style={styles.itemValue}>{item.value}</Text>
//                         <View style={[
//                           styles.statusBadge,
//                           { backgroundColor: getStatusColor(item.status) }
//                         ]}>
//                           <Text style={styles.statusText}>{item.status}</Text>
//                         </View>
//                       </View>
//                       <View style={styles.itemIcon}>
//                         <item.icon size={24} color="#667eea" />
//                       </View>
//                     </View>

//                     <Text style={styles.itemDescription}>{item.description}</Text>

//                     <View style={styles.itemDetails}>
//                       <View style={styles.detailRow}>
//                         <MapPin size={16} color="#64748b" />
//                         <Text style={styles.detailText}>Stolen from: {item.location}</Text>
//                       </View>
//                       <View style={styles.detailRow}>
//                         <Clock size={16} color="#64748b" />
//                         <Text style={styles.detailText}>{item.date} at {item.time}</Text>
//                       </View>
//                       <View style={styles.detailRow}>
//                         <User size={16} color="#64748b" />
//                         <Text style={styles.detailText}>Reported by: {item.reportedBy}</Text>
//                       </View>
//                     </View>

//                     <View style={styles.actionButtons}>
//                       <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
//                         <Phone size={16} color="#667eea" />
//                         <Text style={styles.contactButtonText}>Contact Reporter</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.reportSightingButton} activeOpacity={0.8}>
//                         <AlertTriangle size={16} color="#ffffff" />
//                         <Text style={styles.reportSightingText}>Report Sighting</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         )}

//         {activeTab === 'found' && (
//           <View style={styles.foundList}>
//             {foundItems.map((item) => (
//               <TouchableOpacity key={item.id} style={styles.foundCard} activeOpacity={0.8}>
//                 <LinearGradient
//                   colors={['#ffffff', '#f0fdf4']}
//                   style={styles.foundGradient}
//                 >
//                   <View style={styles.foundHeader}>
//                     <Image source={{ uri: item.image }} style={styles.foundImage} />
//                     <View style={styles.foundInfo}>
//                       <Text style={styles.foundTitle}>{item.title}</Text>
//                       <Text style={styles.foundDescription}>{item.description}</Text>
//                       <View style={styles.foundMeta}>
//                         <MapPin size={14} color="#64748b" />
//                         <Text style={styles.foundLocation}>{item.location}</Text>
//                       </View>
//                     </View>
//                   </View>
//                   <TouchableOpacity style={styles.claimButton} activeOpacity={0.8}>
//                     <Text style={styles.claimButtonText}>Claim Item</Text>
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {activeTab === 'report' && (
//           <View style={styles.reportSection}>
//             <View style={styles.reportCard}>
//               <LinearGradient
//                 colors={['#ffffff', '#f8fafc']}
//                 style={styles.reportGradient}
//               >
//                 <Text style={styles.reportTitle}>Report Stolen Item</Text>
                
//                 <TouchableOpacity style={styles.photoUpload} activeOpacity={0.8}>
//                   <Camera size={32} color="#667eea" />
//                   <Text style={styles.photoUploadText}>Upload Item Photo</Text>
//                   <Text style={styles.photoUploadSubtext}>Clear photo helps in identification</Text>
//                 </TouchableOpacity>

//                 <View style={styles.formSection}>
//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Item Name *</Text>
//                     <TextInput style={styles.input} placeholder="What was stolen?" />
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Category *</Text>
//                     <View style={styles.categoryGrid}>
//                       {['Electronics', 'Vehicle', 'Jewelry', 'Documents', 'Other'].map((cat) => (
//                         <TouchableOpacity key={cat} style={styles.categoryChip} activeOpacity={0.8}>
//                           <Text style={styles.categoryText}>{cat}</Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Detailed Description *</Text>
//                     <TextInput 
//                       style={styles.textArea} 
//                       placeholder="Brand, model, color, serial number, distinguishing features..."
//                       multiline
//                       numberOfLines={4}
//                     />
//                   </View>

//                   <View style={styles.inputRow}>
//                     <View style={styles.inputColumn}>
//                       <Text style={styles.inputLabel}>Date Stolen *</Text>
//                       <TextInput style={styles.input} placeholder="DD/MM/YYYY" />
//                     </View>
//                     <View style={styles.inputColumn}>
//                       <Text style={styles.inputLabel}>Time *</Text>
//                       <TextInput style={styles.input} placeholder="HH:MM" />
//                     </View>
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Location *</Text>
//                     <TextInput style={styles.input} placeholder="Where was it stolen from?" />
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Estimated Value *</Text>
//                     <TextInput 
//                       style={styles.input} 
//                       placeholder="₹ Approximate value"
//                       keyboardType="numeric"
//                     />
//                   </View>
//                 </View>

//                 <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
//                   <LinearGradient
//                     colors={['#667eea', '#764ba2']}
//                     style={styles.submitGradient}
//                   >
//                     <Text style={styles.submitButtonText}>Submit Theft Report</Text>
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
//     paddingVertical: 10,
//     borderRadius: 12,
//     gap: 6,
//   },
//   activeTab: {
//     backgroundColor: '#f0f7ff',
//   },
//   tabText: {
//     fontSize: 13,
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
//   itemsList: {
//     gap: 16,
//   },
//   itemCard: {
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   itemGradient: {
//     padding: 20,
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   itemImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 16,
//     marginRight: 16,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemTitle: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1e293b',
//   },
//   itemCategory: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#667eea',
//     marginTop: 4,
//   },
//   itemValue: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: '#059669',
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
//   itemIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#f0f7ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemDescription: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#374151',
//     lineHeight: 24,
//     marginBottom: 16,
//   },
//   itemDetails: {
//     gap: 8,
//     marginBottom: 16,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   detailText: {
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
//   reportSightingButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#ef4444',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//   },
//   reportSightingText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//   },
//   foundList: {
//     gap: 16,
//   },
//   foundCard: {
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   foundGradient: {
//     padding: 20,
//   },
//   foundHeader: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   foundImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 16,
//     marginRight: 16,
//   },
//   foundInfo: {
//     flex: 1,
//   },
//   foundTitle: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1e293b',
//   },
//   foundDescription: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     marginTop: 4,
//   },
//   foundMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginTop: 8,
//   },
//   foundLocation: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//   },
//   claimButton: {
//     backgroundColor: '#10b981',
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   claimButtonText: {
//     fontSize: 16,
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
//     marginBottom: 24,
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
//   categoryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   categoryChip: {
//     backgroundColor: '#f0f7ff',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   categoryText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#667eea',
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