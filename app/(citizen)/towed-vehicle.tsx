// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Search, Car, MapPin, Clock, Phone, CreditCard, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Navigation, Download, Star } from 'lucide-react-native';

// export default function TowedVehicleScreen() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeTab, setActiveTab] = useState<'search' | 'history'>('search');

//   const towedVehicles = [
//     {
//       id: 1,
//       vehicleNumber: 'KA 01 AB 1234',
//       vehicleType: 'Honda City',
//       model: '2022',
//       color: 'White',
//       towedDate: '2024-01-15',
//       towedTime: '14:30',
//       location: 'MG Road No Parking Zone',
//       impoundLocation: 'City Police Station Yard, Sector 5',
//       fine: '₹2,500',
//       additionalCharges: '₹500',
//       totalAmount: '₹3,000',
//       status: 'Impounded',
//       reason: 'Illegal Parking in No Parking Zone',
//       image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
//       daysImpounded: 1,
//       releaseTime: '9:00 AM - 6:00 PM'
//     },
//     {
//       id: 2,
//       vehicleNumber: 'KA 02 CD 5678',
//       vehicleType: 'Royal Enfield',
//       model: '2021',
//       color: 'Black',
//       towedDate: '2024-01-14',
//       towedTime: '16:45',
//       location: 'Brigade Road',
//       impoundLocation: 'Traffic Police Station',
//       fine: '₹1,000',
//       additionalCharges: '₹200',
//       totalAmount: '₹1,200',
//       status: 'Released',
//       reason: 'Parking in Fire Lane',
//       image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=400',
//       daysImpounded: 0,
//       releaseTime: 'Released on 2024-01-14'
//     }
//   ];

//   const userHistory = [
//     {
//       id: 1,
//       vehicleNumber: 'KA 01 AB 1234',
//       date: '2024-01-15',
//       fine: '₹3,000',
//       status: 'Paid',
//       receiptNumber: 'RCP/2024/001234',
//       paymentMethod: 'UPI'
//     },
//     {
//       id: 2,
//       vehicleNumber: 'KA 02 CD 5678',
//       date: '2024-01-14',
//       fine: '₹1,200',
//       status: 'Paid',
//       receiptNumber: 'RCP/2024/001233',
//       paymentMethod: 'Card'
//     }
//   ];

//   const releaseSteps = [
//     { 
//       step: 1, 
//       title: 'Pay Fine Online', 
//       description: 'Pay challan amount through app or website', 
//       completed: false,
//       icon: CreditCard,
//       color: '#ef4444'
//     },
//     { 
//       step: 2, 
//       title: 'Verify Documents', 
//       description: 'Bring original RC, DL, insurance, and PUC', 
//       completed: false,
//       icon: CheckCircle,
//       color: '#f59e0b'
//     },
//     { 
//       step: 3, 
//       title: 'Visit Impound Yard', 
//       description: 'Go to specified location during working hours', 
//       completed: false,
//       icon: Navigation,
//       color: '#3b82f6'
//     },
//     { 
//       step: 4, 
//       title: 'Collect Vehicle', 
//       description: 'Show payment receipt and collect your vehicle', 
//       completed: false,
//       icon: Car,
//       color: '#10b981'
//     }
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#06b6d4', '#0891b2', '#0e7490']}
//         style={styles.header}
//       >
//         <View style={styles.headerContent}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.title}>Towed Vehicles</Text>
//             <Text style={styles.subtitle}>Track and release your towed vehicle</Text>
//           </View>
//           <View style={styles.headerIcon}>
//             <Car size={24} color="#ffffff" />
//           </View>
//         </View>
//       </LinearGradient>

//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'search' && styles.activeTab]}
//           onPress={() => setActiveTab('search')}
//           activeOpacity={0.8}
//         >
//           <Search size={20} color={activeTab === 'search' ? '#06b6d4' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
//             Search Vehicle
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'history' && styles.activeTab]}
//           onPress={() => setActiveTab('history')}
//           activeOpacity={0.8}
//         >
//           <Clock size={20} color={activeTab === 'history' ? '#06b6d4' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
//             Payment History
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {activeTab === 'search' ? (
//           <View>
//             <View style={styles.searchSection}>
//               <LinearGradient
//                 colors={['#ffffff', '#f0fdfa']}
//                 style={styles.searchContainer}
//               >
//                 <Search size={20} color="#06b6d4" />
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Enter vehicle number (e.g., KA 01 AB 1234)"
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                   placeholderTextColor="#94a3b8"
//                 />
//               </LinearGradient>
//             </View>

//             <View style={styles.resultsSection}>
//               {towedVehicles.map((vehicle) => (
//                 <TouchableOpacity key={vehicle.id} style={styles.vehicleCard} activeOpacity={0.8}>
//                   <LinearGradient
//                     colors={['#ffffff', '#f0fdfa']}
//                     style={styles.vehicleGradient}
//                   >
//                     <View style={styles.vehicleHeader}>
//                       <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
//                       <View style={styles.vehicleInfo}>
//                         <View style={styles.vehicleTitleRow}>
//                           <Text style={styles.vehicleNumber}>{vehicle.vehicleNumber}</Text>
//                           {vehicle.status === 'Released' && (
//                             <View style={styles.releasedBadge}>
//                               <CheckCircle size={12} color="#10b981" />
//                             </View>
//                           )}
//                         </View>
//                         <Text style={styles.vehicleDetails}>{vehicle.color} {vehicle.vehicleType} ({vehicle.model})</Text>
//                         <LinearGradient
//                           colors={vehicle.status === 'Released' ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']}
//                           style={styles.statusBadge}
//                         >
//                           <Text style={styles.statusText}>{vehicle.status}</Text>
//                         </LinearGradient>
//                       </View>
//                     </View>

//                     <View style={styles.incidentCard}>
//                       <View style={styles.incidentHeader}>
//                         <AlertTriangle size={20} color="#f59e0b" />
//                         <Text style={styles.incidentTitle}>Violation Details</Text>
//                       </View>
//                       <Text style={styles.incidentReason}>{vehicle.reason}</Text>
//                       <View style={styles.incidentMeta}>
//                         <View style={styles.incidentDetail}>
//                           <Clock size={14} color="#64748b" />
//                           <Text style={styles.incidentText}>Towed: {vehicle.towedDate} at {vehicle.towedTime}</Text>
//                         </View>
//                         <View style={styles.incidentDetail}>
//                           <MapPin size={14} color="#64748b" />
//                           <Text style={styles.incidentText}>From: {vehicle.location}</Text>
//                         </View>
//                       </View>
//                     </View>

//                     <View style={styles.locationCard}>
//                       <View style={styles.locationHeader}>
//                         <Navigation size={20} color="#06b6d4" />
//                         <Text style={styles.locationTitle}>Impound Location</Text>
//                       </View>
//                       <Text style={styles.locationAddress}>{vehicle.impoundLocation}</Text>
//                       <Text style={styles.locationHours}>Release Hours: {vehicle.releaseTime}</Text>
//                     </View>

//                     <View style={styles.paymentCard}>
//                       <View style={styles.paymentHeader}>
//                         <CreditCard size={20} color="#ef4444" />
//                         <Text style={styles.paymentTitle}>Payment Details</Text>
//                       </View>
//                       <View style={styles.paymentBreakdown}>
//                         <View style={styles.paymentRow}>
//                           <Text style={styles.paymentLabel}>Traffic Fine:</Text>
//                           <Text style={styles.paymentAmount}>{vehicle.fine}</Text>
//                         </View>
//                         <View style={styles.paymentRow}>
//                           <Text style={styles.paymentLabel}>Storage Charges:</Text>
//                           <Text style={styles.paymentAmount}>{vehicle.additionalCharges}</Text>
//                         </View>
//                         <View style={[styles.paymentRow, styles.totalRow]}>
//                           <Text style={styles.totalLabel}>Total Amount:</Text>
//                           <Text style={styles.totalAmount}>{vehicle.totalAmount}</Text>
//                         </View>
//                       </View>
//                     </View>

//                     {vehicle.status === 'Impounded' && (
//                       <View style={styles.actionButtons}>
//                         <TouchableOpacity style={styles.payButton} activeOpacity={0.8}>
//                           <LinearGradient
//                             colors={['#ef4444', '#dc2626']}
//                             style={styles.payGradient}
//                           >
//                             <CreditCard size={16} color="#ffffff" />
//                             <Text style={styles.payButtonText}>Pay Fine</Text>
//                           </LinearGradient>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
//                           <Phone size={16} color="#06b6d4" />
//                           <Text style={styles.contactButtonText}>Contact Station</Text>
//                         </TouchableOpacity>
//                       </View>
//                     )}
//                   </LinearGradient>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.releaseSection}>
//               <Text style={styles.sectionTitle}>Vehicle Release Process</Text>
//               <View style={styles.stepsContainer}>
//                 {releaseSteps.map((step) => (
//                   <View key={step.step} style={styles.stepItem}>
//                     <LinearGradient
//                       colors={[step.color, `${step.color}80`]}
//                       style={styles.stepIcon}
//                     >
//                       <step.icon size={20} color="#ffffff" />
//                     </LinearGradient>
//                     <View style={styles.stepContent}>
//                       <Text style={styles.stepTitle}>{step.title}</Text>
//                       <Text style={styles.stepDescription}>{step.description}</Text>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.historySection}>
//             {userHistory.map((record) => (
//               <TouchableOpacity key={record.id} style={styles.historyCard} activeOpacity={0.8}>
//                 <LinearGradient
//                   colors={['#ffffff', '#f0fdf4']}
//                   style={styles.historyGradient}
//                 >
//                   <View style={styles.historyHeader}>
//                     <View style={styles.historyInfo}>
//                       <Text style={styles.historyVehicle}>{record.vehicleNumber}</Text>
//                       <Text style={styles.historyDate}>{record.date}</Text>
//                     </View>
//                     <View style={styles.historyStatus}>
//                       <CheckCircle size={16} color="#10b981" />
//                       <Text style={styles.historyStatusText}>{record.status}</Text>
//                     </View>
//                   </View>
                  
//                   <View style={styles.historyDetails}>
//                     <View style={styles.historyRow}>
//                       <Text style={styles.historyLabel}>Amount Paid:</Text>
//                       <Text style={styles.historyValue}>{record.fine}</Text>
//                     </View>
//                     <View style={styles.historyRow}>
//                       <Text style={styles.historyLabel}>Payment Method:</Text>
//                       <Text style={styles.historyValue}>{record.paymentMethod}</Text>
//                     </View>
//                     <View style={styles.historyRow}>
//                       <Text style={styles.historyLabel}>Receipt Number:</Text>
//                       <Text style={styles.historyValue}>{record.receiptNumber}</Text>
//                     </View>
//                   </View>
                  
//                   <TouchableOpacity style={styles.downloadButton} activeOpacity={0.8}>
//                     <Download size={16} color="#10b981" />
//                     <Text style={styles.downloadButtonText}>Download Receipt</Text>
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </TouchableOpacity>
//             ))}
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
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 28,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
//   subtitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 4,
//   },
//   headerIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
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
//     backgroundColor: '#f0fdfa',
//   },
//   tabText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#64748b',
//   },
//   activeTabText: {
//     color: '#06b6d4',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 16,
//   },
//   searchSection: {
//     marginBottom: 20,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     gap: 12,
//     shadowColor: '#06b6d4',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#1e293b',
//   },
//   resultsSection: {
//     gap: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: '#1e293b',
//     marginBottom: 16,
//   },
//   vehicleCard: {
//     borderRadius: 24,
//     overflow: 'hidden',
//     shadowColor: '#06b6d4',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   vehicleGradient: {
//     padding: 24,
//   },
//   vehicleHeader: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   vehicleImage: {
//     width: 80,
//     height: 60,
//     borderRadius: 16,
//     marginRight: 16,
//   },
//   vehicleInfo: {
//     flex: 1,
//   },
//   vehicleTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   vehicleNumber: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: '#1e293b',
//     flex: 1,
//   },
//   releasedBadge: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#f0fdf4',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   vehicleDetails: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#64748b',
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
//   incidentCard: {
//     backgroundColor: '#fef3c7',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//   },
//   incidentHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     gap: 8,
//   },
//   incidentTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#92400e',
//   },
//   incidentReason: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#92400e',
//     marginBottom: 12,
//   },
//   incidentMeta: {
//     gap: 6,
//   },
//   incidentDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   incidentText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#78716c',
//   },
//   locationCard: {
//     backgroundColor: '#f0fdfa',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//   },
//   locationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     gap: 8,
//   },
//   locationTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#0f766e',
//   },
//   locationAddress: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#0f766e',
//     marginBottom: 4,
//   },
//   locationHours: {
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     color: '#14b8a6',
//   },
//   paymentCard: {
//     backgroundColor: '#fef2f2',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//   },
//   paymentHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     gap: 8,
//   },
//   paymentTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#991b1b',
//   },
//   paymentBreakdown: {
//     gap: 8,
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   paymentLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#991b1b',
//   },
//   paymentAmount: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#991b1b',
//   },
//   totalRow: {
//     borderTopWidth: 1,
//     borderTopColor: '#fca5a5',
//     paddingTop: 8,
//     marginTop: 4,
//   },
//   totalLabel: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: '#7f1d1d',
//   },
//   totalAmount: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#7f1d1d',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   payButton: {
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   payGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     gap: 8,
//   },
//   payButtonText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
//   contactButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f0fdfa',
//     paddingVertical: 14,
//     borderRadius: 16,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: '#a7f3d0',
//   },
//   contactButtonText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#06b6d4',
//   },
//   releaseSection: {
//     marginTop: 24,
//     marginBottom: 32,
//   },
//   stepsContainer: {
//     gap: 16,
//   },
//   stepItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   stepIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   stepContent: {
//     flex: 1,
//   },
//   stepTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1e293b',
//   },
//   stepDescription: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     marginTop: 2,
//     lineHeight: 20,
//   },
//   historySection: {
//     gap: 16,
//   },
//   historyCard: {
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: '#10b981',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   historyGradient: {
//     padding: 20,
//   },
//   historyHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   historyInfo: {
//     flex: 1,
//   },
//   historyVehicle: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1e293b',
//   },
//   historyDate: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     marginTop: 2,
//   },
//   historyStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   historyStatusText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#10b981',
//   },
//   historyDetails: {
//     gap: 8,
//     marginBottom: 16,
//   },
//   historyRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   historyLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//   },
//   historyValue: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1e293b',
//   },
//   downloadButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f0fdf4',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: '#bbf7d0',
//   },
//   downloadButtonText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#10b981',
//   },
// });