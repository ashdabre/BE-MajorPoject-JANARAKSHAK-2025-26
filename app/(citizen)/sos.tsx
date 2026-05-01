import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert as AlertTriangle, Phone, MapPin, Clock, Shield, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SOSScreen() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyType, setEmergencyType] = useState<string | null>(null);

  const emergencyTypes = [
    { id: 'medical', icon: AlertTriangle, label: 'Medical Emergency', color: '#ef4444' },
    { id: 'crime', icon: Shield, label: 'Crime in Progress', color: '#dc2626' },
    { id: 'fire', icon: AlertTriangle, label: 'Fire Emergency', color: '#ea580c' },
    { id: 'accident', icon: AlertTriangle, label: 'Road Accident', color: '#f59e0b' },
  ];

  const handleSOSActivation = (type: string) => {
    setEmergencyType(type);
    setIsSOSActive(true);
    // In a real app, this would trigger location sharing and emergency services
  };

  const handleSOSCancel = () => {
    setIsSOSActive(false);
    setEmergencyType(null);
  };

  if (isSOSActive) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.activeSOSContainer}>
          <View style={styles.emergencyIndicator}>
            <AlertTriangle size={60} color="#ffffff" />
          </View>
          <Text style={styles.emergencyTitle}>SOS ACTIVATED</Text>
          <Text style={styles.emergencySubtitle}>
            Emergency services have been notified
          </Text>
          <Text style={styles.emergencyMessage}>
            Your location is being shared with the nearest police station
          </Text>
          
          <View style={styles.emergencyInfo}>
            <View style={styles.infoRow}>
              <MapPin size={20} color="#ffffff" />
              <Text style={styles.infoText}>Location: Current GPS coordinates</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={20} color="#ffffff" />
              <Text style={styles.infoText}>Time: {new Date().toLocaleTimeString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Shield size={20} color="#ffffff" />
              <Text style={styles.infoText}>Type: {emergencyType}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={handleSOSCancel}>
            <Text style={styles.cancelButtonText}>Cancel SOS</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>Get immediate help in emergency situations</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.warningCard}>
          <AlertTriangle size={24} color="#f59e0b" />
          <Text style={styles.warningText}>
            Only use SOS in real emergencies. False alarms may result in penalties.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Emergency Type</Text>
        
        <View style={styles.emergencyGrid}>
          {emergencyTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.emergencyCard, { borderColor: type.color }]}
              onPress={() => handleSOSActivation(type.id)}
            >
              <View style={[styles.emergencyIcon, { backgroundColor: `${type.color}20` }]}>
                <type.icon size={32} color={type.color} />
              </View>
              <Text style={styles.emergencyLabel}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Phone size={24} color="#3b82f6" />
              <Text style={styles.quickActionText}>Call 100</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Phone size={24} color="#10b981" />
              <Text style={styles.quickActionText}>Call 108</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Phone size={24} color="#ef4444" />
              <Text style={styles.quickActionText}>Call 101</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.emergencyContacts}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.contactsList}>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Shield size={20} color="#1e3a8a" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>Police Control Room</Text>
                <Text style={styles.contactNumber}>100</Text>
              </View>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <AlertTriangle size={20} color="#ef4444" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>Medical Emergency</Text>
                <Text style={styles.contactNumber}>108</Text>
              </View>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <AlertTriangle size={20} color="#f59e0b" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>Fire Department</Text>
                <Text style={styles.contactNumber}>101</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#92400e',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  emergencyCard: {
    width: (width - 56) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginTop: 8,
  },
  emergencyContacts: {
    marginBottom: 32,
  },
  contactsList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  contactNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  activeSOSContainer: {
    flex: 1,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emergencyIndicator: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  emergencyTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emergencySubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 32,
    textAlign: 'center',
  },
  emergencyMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  emergencyInfo: {
    gap: 16,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
});