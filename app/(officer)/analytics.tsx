// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ChartBar as BarChart3, TrendingUp, TrendingDown, Activity, MapPin, Calendar, TriangleAlert as AlertTriangle } from 'lucide-react-native';

// const { width } = Dimensions.get('window');

// export default function AnalyticsScreen() {
//   const [selectedPeriod, setSelectedPeriod] = useState('week');

//   const periods = [
//     { id: 'week', label: 'This Week' },
//     { id: 'month', label: 'This Month' },
//     { id: 'quarter', label: 'This Quarter' },
//     { id: 'year', label: 'This Year' },
//   ];

//   const crimeStats = [
//     { type: 'Theft', count: 45, trend: 'up', percentage: 12 },
//     { type: 'Accident', count: 23, trend: 'down', percentage: 8 },
//     { type: 'Fraud', count: 18, trend: 'up', percentage: 15 },
//     { type: 'Assault', count: 12, trend: 'down', percentage: 5 },
//   ];

//   const areaStats = [
//     { area: 'MG Road', cases: 28, risk: 'High', color: '#ef4444' },
//     { area: 'Brigade Road', cases: 19, risk: 'Medium', color: '#f59e0b' },
//     { area: 'Koramangala', cases: 15, risk: 'Medium', color: '#f59e0b' },
//     { area: 'Whitefield', cases: 8, risk: 'Low', color: '#10b981' },
//   ];

//   const performanceMetrics = [
//     { label: 'Cases Resolved', value: '89%', trend: 'up', color: '#10b981' },
//     { label: 'Response Time', value: '12 min', trend: 'down', color: '#3b82f6' },
//     { label: 'Satisfaction', value: '94%', trend: 'up', color: '#10b981' },
//     { label: 'Pending Cases', value: '23', trend: 'down', color: '#f59e0b' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Crime Analytics</Text>
//         <Text style={styles.subtitle}>Data-driven insights and trends</Text>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.periodSelector}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {periods.map((period) => (
//               <TouchableOpacity
//                 key={period.id}
//                 style={[
//                   styles.periodButton,
//                   selectedPeriod === period.id && styles.selectedPeriod
//                 ]}
//                 onPress={() => setSelectedPeriod(period.id)}
//               >
//                 <Text style={[
//                   styles.periodText,
//                   selectedPeriod === period.id && styles.selectedPeriodText
//                 ]}>
//                   {period.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Performance Overview</Text>
//           <View style={styles.metricsGrid}>
//             {performanceMetrics.map((metric, index) => (
//               <View key={index} style={styles.metricCard}>
//                 <View style={styles.metricHeader}>
//                   <Text style={styles.metricValue}>{metric.value}</Text>
//                   <View style={[styles.trendIcon, { backgroundColor: `${metric.color}20` }]}>
//                     {metric.trend === 'up' ? (
//                       <TrendingUp size={16} color={metric.color} />
//                     ) : (
//                       <TrendingDown size={16} color={metric.color} />
//                     )}
//                   </View>
//                 </View>
//                 <Text style={styles.metricLabel}>{metric.label}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Crime Statistics</Text>
//           <View style={styles.crimeChart}>
//             <View style={styles.chartPlaceholder}>
//               <BarChart3 size={48} color="#6b7280" />
//               <Text style={styles.chartPlaceholderText}>Crime Trends Chart</Text>
//             </View>
//           </View>
//           <View style={styles.crimeStatsList}>
//             {crimeStats.map((stat, index) => (
//               <View key={index} style={styles.crimeStatCard}>
//                 <View style={styles.crimeStatInfo}>
//                   <Text style={styles.crimeStatType}>{stat.type}</Text>
//                   <Text style={styles.crimeStatCount}>{stat.count} cases</Text>
//                 </View>
//                 <View style={styles.crimeStatTrend}>
//                   <View style={[
//                     styles.trendBadge,
//                     { backgroundColor: stat.trend === 'up' ? '#fee2e2' : '#dcfce7' }
//                   ]}>
//                     {stat.trend === 'up' ? (
//                       <TrendingUp size={12} color="#ef4444" />
//                     ) : (
//                       <TrendingDown size={12} color="#10b981" />
//                     )}
//                     <Text style={[
//                       styles.trendText,
//                       { color: stat.trend === 'up' ? '#ef4444' : '#10b981' }
//                     ]}>
//                       {stat.percentage}%
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Area-wise Crime Distribution</Text>
//           <View style={styles.areaStatsList}>
//             {areaStats.map((area, index) => (
//               <View key={index} style={styles.areaStatCard}>
//                 <View style={styles.areaStatHeader}>
//                   <View style={styles.areaStatInfo}>
//                     <Text style={styles.areaStatName}>{area.area}</Text>
//                     <Text style={styles.areaStatCases}>{area.cases} cases</Text>
//                   </View>
//                   <View style={[styles.riskBadge, { backgroundColor: area.color }]}>
//                     <Text style={styles.riskText}>{area.risk}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.areaProgressBar}>
//                   <View style={[
//                     styles.areaProgress,
//                     { width: `${(area.cases / 30) * 100}%`, backgroundColor: area.color }
//                   ]} />
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Heatmap Analysis</Text>
//           <View style={styles.heatmapContainer}>
//             <View style={styles.heatmapPlaceholder}>
//               <MapPin size={48} color="#6b7280" />
//               <Text style={styles.heatmapPlaceholderText}>Crime Heatmap</Text>
//               <Text style={styles.heatmapPlaceholderSubtext}>
//                 Interactive map showing crime density across different areas
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Alerts & Notifications</Text>
//           <View style={styles.alertsList}>
//             <View style={styles.alertCard}>
//               <View style={styles.alertIcon}>
//                 <AlertTriangle size={20} color="#ef4444" />
//               </View>
//               <View style={styles.alertContent}>
//                 <Text style={styles.alertTitle}>High Crime Area Alert</Text>
//                 <Text style={styles.alertDescription}>
//                   MG Road area showing 20% increase in theft cases this week
//                 </Text>
//                 <Text style={styles.alertTime}>2 hours ago</Text>
//               </View>
//             </View>
//             <View style={styles.alertCard}>
//               <View style={styles.alertIcon}>
//                 <Activity size={20} color="#f59e0b" />
//               </View>
//               <View style={styles.alertContent}>
//                 <Text style={styles.alertTitle}>Response Time Warning</Text>
//                 <Text style={styles.alertDescription}>
//                   Average response time increased by 3 minutes in Sector 5
//                 </Text>
//                 <Text style={styles.alertTime}>5 hours ago</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   title: {
//     fontSize: 24,
//     fontFamily: 'Inter-Bold',
//     color: '#1f2937',
//   },
//   subtitle: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#6b7280',
//     marginTop: 4,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   periodSelector: {
//     paddingVertical: 16,
//   },
//   periodButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   selectedPeriod: {
//     backgroundColor: '#1e3a8a',
//     borderColor: '#1e3a8a',
//   },
//   periodText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#6b7280',
//   },
//   selectedPeriodText: {
//     color: '#ffffff',
//   },
//   section: {
//     marginBottom: 32,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   metricsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   metricCard: {
//     width: (width - 56) / 2,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   metricHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   metricValue: {
//     fontSize: 24,
//     fontFamily: 'Inter-Bold',
//     color: '#1f2937',
//   },
//   trendIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   metricLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#6b7280',
//   },
//   crimeChart: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   chartPlaceholder: {
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9fafb',
//     borderRadius: 8,
//   },
//   chartPlaceholderText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#374151',
//     marginTop: 8,
//   },
//   crimeStatsList: {
//     gap: 12,
//   },
//   crimeStatCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   crimeStatInfo: {
//     flex: 1,
//   },
//   crimeStatType: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1f2937',
//   },
//   crimeStatCount: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#6b7280',
//   },
//   crimeStatTrend: {
//     alignItems: 'flex-end',
//   },
//   trendBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   trendText: {
//     fontSize: 12,
//     fontFamily: 'Inter-SemiBold',
//   },
//   areaStatsList: {
//     gap: 12,
//   },
//   areaStatCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   areaStatHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   areaStatInfo: {
//     flex: 1,
//   },
//   areaStatName: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1f2937',
//   },
//   areaStatCases: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#6b7280',
//   },
//   riskBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   riskText: {
//     fontSize: 10,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//   },
//   areaProgressBar: {
//     height: 6,
//     backgroundColor: '#e5e7eb',
//     borderRadius: 3,
//   },
//   areaProgress: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   heatmapContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   heatmapPlaceholder: {
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9fafb',
//     borderRadius: 8,
//   },
//   heatmapPlaceholderText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#374151',
//     marginTop: 8,
//   },
//   heatmapPlaceholderSubtext: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#6b7280',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   alertsList: {
//     gap: 12,
//   },
//   alertCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   alertIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#f3f4f6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   alertContent: {
//     flex: 1,
//   },
//   alertTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1f2937',
//   },
//   alertDescription: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#6b7280',
//     marginTop: 4,
//   },
//   alertTime: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#9ca3af',
//     marginTop: 4,
//   },
// });