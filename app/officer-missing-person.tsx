import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, MapPin, Clock, User, Camera, Filter, Phone, Calendar, TriangleAlert as AlertTriangle, CreditCard as Edit, Eye, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function OfficerMissingPersonScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'investigate'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCases = [
    {
      id: 1,
      name: 'Anita Sharma',
      age: 28,
      caseId: 'MP/2024/001234',
      lastSeen: 'MG Road Metro Station',
      date: '2024-01-15',
      time: '18:30',
      description: 'Wearing blue saree, carrying black handbag',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      reportedBy: 'Family Member',
      assignedTo: 'Inspector Kumar',
      priority: 'High',
      status: 'Investigating',
      leads: 3,
      witnesses: 2
    },
    {
      id: 2,
      name: 'Priya Patel',
      age: 16,
      caseId: 'MP/2024/001232',
      lastSeen: 'Koramangala 5th Block',
      date: '2024-01-13',
      time: '16:45',
      description: 'School uniform, carrying pink backpack',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      reportedBy: 'School Principal',
      assignedTo: 'SI Sharma',
      priority: 'Critical',
      status: 'Active Search',
      leads: 5,
      witnesses: 4
    }
  ];

  const resolvedCases = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      caseId: 'MP/2024/001233',
      foundLocation: 'Brigade Road',
      resolvedDate: '2024-01-14',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      resolvedBy: 'Inspector Kumar',
      status: 'Found Safe',
      duration: '2 days'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      default: return '#059669';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#dc2626', '#ea580c']}
        style={styles.header}
      >
        <Text style={styles.title}>Missing Persons</Text>
        <Text style={styles.subtitle}>Officer case management and investigation</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.8}
        >
          <AlertTriangle size={18} color={activeTab === 'active' ? '#dc2626' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Cases
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resolved' && styles.activeTab]}
          onPress={() => setActiveTab('resolved')}
          activeOpacity={0.8}
        >
          <CheckCircle size={18} color={activeTab === 'resolved' ? '#dc2626' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'resolved' && styles.activeTabText]}>
            Resolved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'investigate' && styles.activeTab]}
          onPress={() => setActiveTab('investigate')}
          activeOpacity={0.8}
        >
          <Search size={18} color={activeTab === 'investigate' ? '#dc2626' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'investigate' && styles.activeTabText]}>
            Investigate
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'active' && (
          <View>
            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Search size={20} color="#94a3b8" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search active cases..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.casesList}>
              {activeCases.map((person) => (
                <TouchableOpacity key={person.id} style={styles.caseCard} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#ffffff', '#fef7f7']}
                    style={styles.caseGradient}
                  >
                    <View style={styles.caseHeader}>
                      <Image source={{ uri: person.image }} style={styles.caseImage} />
                      <View style={styles.caseInfo}>
                        <Text style={styles.caseName}>{person.name}</Text>
                        <Text style={styles.caseId}>{person.caseId}</Text>
                        <View style={[
                          styles.priorityBadge,
                          { backgroundColor: getPriorityColor(person.priority) }
                        ]}>
                          <Text style={styles.priorityText}>{person.priority}</Text>
                        </View>
                      </View>
                      <View style={styles.caseActions}>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                          <Edit size={16} color="#64748b" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                          <Eye size={16} color="#64748b" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.caseDetails}>
                      <View style={styles.detailRow}>
                        <MapPin size={16} color="#64748b" />
                        <Text style={styles.detailText}>Last seen: {person.lastSeen}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Clock size={16} color="#64748b" />
                        <Text style={styles.detailText}>{person.date} at {person.time}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <User size={16} color="#64748b" />
                        <Text style={styles.detailText}>Assigned: {person.assignedTo}</Text>
                      </View>
                    </View>

                    <View style={styles.investigationStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{person.leads}</Text>
                        <Text style={styles.statLabel}>Leads</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{person.witnesses}</Text>
                        <Text style={styles.statLabel}>Witnesses</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>Active</Text>
                        <Text style={styles.statLabel}>Status</Text>
                      </View>
                    </View>

                    <View style={styles.caseActions}>
                      <TouchableOpacity style={styles.updateButton} activeOpacity={0.8}>
                        <Text style={styles.updateButtonText}>Update Case</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
                        <Phone size={16} color="#dc2626" />
                        <Text style={styles.contactButtonText}>Contact Family</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'resolved' && (
          <View style={styles.resolvedList}>
            {resolvedCases.map((person) => (
              <TouchableOpacity key={person.id} style={styles.resolvedCard} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#ffffff', '#f0fdf4']}
                  style={styles.resolvedGradient}
                >
                  <View style={styles.resolvedHeader}>
                    <Image source={{ uri: person.image }} style={styles.resolvedImage} />
                    <View style={styles.resolvedInfo}>
                      <Text style={styles.resolvedName}>{person.name}</Text>
                      <Text style={styles.resolvedCaseId}>{person.caseId}</Text>
                      <View style={styles.resolvedStatus}>
                        <CheckCircle size={16} color="#059669" />
                        <Text style={styles.resolvedStatusText}>{person.status}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.resolvedDetails}>
                    <Text style={styles.resolvedDetail}>Found at: {person.foundLocation}</Text>
                    <Text style={styles.resolvedDetail}>Resolved by: {person.resolvedBy}</Text>
                    <Text style={styles.resolvedDetail}>Duration: {person.duration}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'investigate' && (
          <View style={styles.investigateSection}>
            <View style={styles.investigateCard}>
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.investigateGradient}
              >
                <Text style={styles.investigateTitle}>Investigation Tools</Text>
                
                <View style={styles.toolsGrid}>
                  <TouchableOpacity style={styles.toolCard} activeOpacity={0.8}>
                    <Search size={24} color="#667eea" />
                    <Text style={styles.toolText}>Search Database</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolCard} activeOpacity={0.8}>
                    <Camera size={24} color="#059669" />
                    <Text style={styles.toolText}>Photo Analysis</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolCard} activeOpacity={0.8}>
                    <MapPin size={24} color="#dc2626" />
                    <Text style={styles.toolText}>Location Tracking</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolCard} activeOpacity={0.8}>
                    <Phone size={24} color="#7c3aed" />
                    <Text style={styles.toolText}>Contact Network</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#fef2f2',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  activeTabText: {
    color: '#dc2626',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  searchSection: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  casesList: {
    gap: 16,
  },
  caseCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  caseGradient: {
    padding: 20,
  },
  caseHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  caseImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  caseInfo: {
    flex: 1,
  },
  caseName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  caseId: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
    marginTop: 4,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  caseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caseDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  investigationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginTop: 4,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#fef2f2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  updateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
  },
  resolvedList: {
    gap: 16,
  },
  resolvedCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resolvedGradient: {
    padding: 20,
  },
  resolvedHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  resolvedImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  resolvedInfo: {
    flex: 1,
  },
  resolvedName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  resolvedCaseId: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginTop: 4,
  },
  resolvedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  resolvedStatusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  resolvedDetails: {
    gap: 4,
  },
  resolvedDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  investigateSection: {
    paddingBottom: 32,
  },
  investigateCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  investigateGradient: {
    padding: 24,
  },
  investigateTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  toolCard: {
    width: '47%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  toolText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
  },
});