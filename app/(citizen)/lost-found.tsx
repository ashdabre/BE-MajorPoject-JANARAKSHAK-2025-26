// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Search, Plus, MapPin, Clock, User, Camera, Filter, Phone, TriangleAlert as AlertTriangle, Sparkles, Heart, Star } from 'lucide-react-native';

// export default function LostFoundScreen() {
//   const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
//   const [searchQuery, setSearchQuery] = useState('');

//   const lostItems = [
//     {
//       id: 1,
//       title: 'iPhone 14 Pro',
//       description: 'Space Black iPhone 14 Pro with blue MagSafe case',
//       location: 'MG Road Metro Station, Platform 2',
//       date: '2 hours ago',
//       reward: '₹5,000',
//       image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
//       contact: 'Rahul S.',
//       category: 'Electronics',
//       urgency: 'High',
//       verified: true
//     },
//     {
//       id: 2,
//       title: 'Gold Chain with Pendant',
//       description: 'Traditional 22k gold chain with Ganesha pendant',
//       location: 'Brigade Road Shopping Complex',
//       date: '5 hours ago',
//       reward: '₹15,000',
//       image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
//       contact: 'Priya M.',
//       category: 'Jewelry',
//       urgency: 'Critical',
//       verified: true
//     },
//     {
//       id: 3,
//       title: 'Leather Wallet',
//       description: 'Brown leather wallet with important documents',
//       location: 'Koramangala 5th Block Bus Stop',
//       date: '1 day ago',
//       reward: '₹2,000',
//       image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
//       contact: 'Amit K.',
//       category: 'Personal',
//       urgency: 'Medium',
//       verified: false
//     }
//   ];

//   const foundItems = [
//     {
//       id: 1,
//       title: 'Honda Car Keys',
//       description: 'Honda car keys with black remote and keychain',
//       location: 'Whitefield Tech Park',
//       date: '3 hours ago',
//       image: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400',
//       contact: 'Security Office',
//       category: 'Keys',
//       status: 'Available'
//     },
//     {
//       id: 2,
//       title: 'Black Laptop Bag',
//       description: 'Dell laptop bag with charger and documents',
//       location: 'Electronic City Metro Station',
//       date: '6 hours ago',
//       image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400',
//       contact: 'Metro Security',
//       category: 'Electronics',
//       status: 'Available'
//     }
//   ];

//   const getUrgencyColor = (urgency: string) => {
//     switch (urgency) {
//       case 'Critical': return ['#ef4444', '#dc2626'];
//       case 'High': return ['#f59e0b', '#d97706'];
//       case 'Medium': return ['#3b82f6', '#2563eb'];
//       default: return ['#10b981', '#059669'];
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#a78bfa', '#c084fc', '#e879f9']}
//         style={styles.header}
//       >
//         <View style={styles.headerContent}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.title}>Lost & Found</Text>
//             <Text style={styles.subtitle}>Community-powered item recovery</Text>
//           </View>
//           <View style={styles.headerIcon}>
//             <Sparkles size={24} color="#ffffff" />
//           </View>
//         </View>
//       </LinearGradient>

//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'lost' && styles.activeTab]}
//           onPress={() => setActiveTab('lost')}
//           activeOpacity={0.8}
//         >
//           <Search size={20} color={activeTab === 'lost' ? '#a78bfa' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'lost' && styles.activeTabText]}>
//             Lost Items
//           </Text>
//           <View style={styles.tabBadge}>
//             <Text style={styles.tabBadgeText}>{lostItems.length}</Text>
//           </View>
//         </TouchableOpacity>
        
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'found' && styles.activeTab]}
//           onPress={() => setActiveTab('found')}
//           activeOpacity={0.8}
//         >
//           <Heart size={20} color={activeTab === 'found' ? '#a78bfa' : '#64748b'} />
//           <Text style={[styles.tabText, activeTab === 'found' && styles.activeTabText]}>
//             Found Items
//           </Text>
//           <View style={styles.tabBadge}>
//             <Text style={styles.tabBadgeText}>{foundItems.length}</Text>
//           </View>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {activeTab === 'lost' ? (
//           <View>
//             <View style={styles.searchSection}>
//               <LinearGradient
//                 colors={['#ffffff', '#faf5ff']}
//                 style={styles.searchContainer}
//               >
//                 <Search size={20} color="#a78bfa" />
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Search lost items by name, location..."
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                   placeholderTextColor="#94a3b8"
//                 />
//                 <TouchableOpacity style={styles.filterButton}>
//                   <Filter size={20} color="#a78bfa" />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>

//             <View style={styles.itemsList}>
//               {lostItems.map((item) => (
//                 <TouchableOpacity key={item.id} style={styles.itemCard} activeOpacity={0.8}>
//                   <LinearGradient
//                     colors={['#ffffff', '#fefbff']}
//                     style={styles.itemGradient}
//                   >
//                     <View style={styles.itemHeader}>
//                       <Image source={{ uri: item.image }} style={styles.itemImage} />
//                       <View style={styles.itemInfo}>
//                         <View style={styles.itemTitleRow}>
//                           <Text style={styles.itemTitle}>{item.title}</Text>
//                           {item.verified && (
//                             <View style={styles.verifiedBadge}>
//                               <Star size={12} color="#fbbf24" />
//                             </View>
//                           )}
//                         </View>
//                         <Text style={styles.itemCategory}>{item.category}</Text>
//                         <LinearGradient
//                           colors={getUrgencyColor(item.urgency)}
//                           style={styles.urgencyBadge}
//                         >
//                           <Text style={styles.urgencyText}>{item.urgency}</Text>
//                         </LinearGradient>
//                       </View>
//                       <View style={styles.rewardContainer}>
//                         <Text style={styles.rewardLabel}>Reward</Text>
//                         <Text style={styles.rewardAmount}>{item.reward}</Text>
//                       </View>
//                     </View>

//                     <Text style={styles.itemDescription}>{item.description}</Text>

//                     <View style={styles.itemDetails}>
//                       <View style={styles.detailRow}>
//                         <MapPin size={16} color="#a78bfa" />
//                         <Text style={styles.detailText}>{item.location}</Text>
//                       </View>
//                       <View style={styles.detailRow}>
//                         <Clock size={16} color="#64748b" />
//                         <Text style={styles.detailText}>Lost {item.date}</Text>
//                       </View>
//                       <View style={styles.detailRow}>
//                         <User size={16} color="#64748b" />
//                         <Text style={styles.detailText}>Contact: {item.contact}</Text>
//                       </View>
//                     </View>

//                     <View style={styles.actionButtons}>
//                       <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
//                         <Phone size={16} color="#a78bfa" />
//                         <Text style={styles.contactButtonText}>Contact Owner</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.foundButton} activeOpacity={0.8}>
//                         <Heart size={16} color="#ffffff" />
//                         <Text style={styles.foundButtonText}>I Found This</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ) : (
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
//                         <MapPin size={14} color="#10b981" />
//                         <Text style={styles.foundLocation}>Found at: {item.location}</Text>
//                       </View>
//                       <View style={styles.foundMeta}>
//                         <Clock size={14} color="#64748b" />
//                         <Text style={styles.foundTime}>{item.date}</Text>
//                       </View>
//                     </View>
//                   </View>
                  
//                   <TouchableOpacity style={styles.claimButton} activeOpacity={0.8}>
//                     <LinearGradient
//                       colors={['#10b981', '#059669']}
//                       style={styles.claimGradient}
//                     >
//                       <Text style={styles.claimButtonText}>Claim This Item</Text>
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </ScrollView>

//       <TouchableOpacity style={styles.reportButton} activeOpacity={0.8}>
//         <LinearGradient
//           colors={['#a78bfa', '#c084fc']}
//           style={styles.reportGradient}
//         >
//           <Camera size={20} color="#ffffff" />
//           <Text style={styles.reportButtonText}>
//             {activeTab === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
//           </Text>
//         </LinearGradient>
//       </TouchableOpacity>
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
//     backgroundColor: '#faf5ff',
//   },
//   tabText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#64748b',
//   },
//   activeTabText: {
//     color: '#a78bfa',
//   },
//   tabBadge: {
//     backgroundColor: '#e0e7ff',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//   },
//   tabBadgeText: {
//     fontSize: 10,
//     fontFamily: 'Inter-Bold',
//     color: '#5b21b6',
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
//     shadowColor: '#a78bfa',
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
//   filterButton: {
//     padding: 4,
//   },
//   itemsList: {
//     gap: 20,
//   },
//   itemCard: {
//     borderRadius: 24,
//     overflow: 'hidden',
//     shadowColor: '#a78bfa',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   itemGradient: {
//     padding: 24,
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   itemImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 20,
//     marginRight: 16,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   itemTitle: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1e293b',
//     flex: 1,
//   },
//   verifiedBadge: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#fef3c7',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemCategory: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#a78bfa',
//     marginTop: 4,
//   },
//   urgencyBadge: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   urgencyText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
//   rewardContainer: {
//     alignItems: 'center',
//     backgroundColor: '#f0fdf4',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 16,
//   },
//   rewardLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     color: '#166534',
//   },
//   rewardAmount: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: '#059669',
//     marginTop: 2,
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
//     marginBottom: 20,
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
//     backgroundColor: '#faf5ff',
//     paddingVertical: 14,
//     borderRadius: 16,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: '#e0e7ff',
//   },
//   contactButtonText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#a78bfa',
//   },
//   foundButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#10b981',
//     paddingVertical: 14,
//     borderRadius: 16,
//     gap: 8,
//   },
//   foundButtonText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//   },
//   foundList: {
//     gap: 20,
//   },
//   foundCard: {
//     borderRadius: 24,
//     overflow: 'hidden',
//     shadowColor: '#10b981',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   foundGradient: {
//     padding: 24,
//   },
//   foundHeader: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   foundImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 20,
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
//     lineHeight: 20,
//   },
//   foundMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginTop: 8,
//   },
//   foundLocation: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#10b981',
//   },
//   foundTime: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//   },
//   claimButton: {
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   claimGradient: {
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   claimButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
//   reportButton: {
//     marginHorizontal: 24,
//     marginVertical: 20,
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: '#a78bfa',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.2,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   reportGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 18,
//     gap: 8,
//   },
//   reportButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
// });