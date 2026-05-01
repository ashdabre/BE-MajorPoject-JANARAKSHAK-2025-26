import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, FlatList } from 'react-native';
import { Calendar, Clock, MapPin, Users, RefreshCw, Plus, Bell, X, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day');
  const [showShiftDetails, setShowShiftDetails] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const [currentShift, setCurrentShift] = useState({
    type: 'Day Shift',
    time: '08:00 AM - 08:00 PM',
    status: 'Active',
    location: 'Sector 5 Police Station',
    patrol: 'Route A-5 to B-7',
    partner: 'Constable Patel',
  });

  const [upcomingShifts, setUpcomingShifts] = useState([
    { date: '2024-01-16', shift: 'Day Shift', time: '08:00 AM - 08:00 PM', location: 'Sector 5' },
    { date: '2024-01-17', shift: 'Night Shift', time: '08:00 PM - 08:00 AM', location: 'Sector 3' },
    { date: '2024-01-18', shift: 'Day Shift', time: '08:00 AM - 08:00 PM', location: 'Sector 5' },
    { date: '2024-01-19', shift: 'Rest Day', time: 'Off Duty', location: '-' },
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'Sick Leave', date: '2024-01-25', status: 'Pending', reason: 'Medical checkup' },
    { id: 2, type: 'Casual Leave', date: '2024-02-05', status: 'Approved', reason: 'Family function' },
  ]);

  const [swapRequests, setSwapRequests] = useState([
    { id: 1, with: 'Inspector Sharma', date: '2024-01-22', shift: 'Night Shift', status: 'Pending' },
    { id: 2, with: 'Inspector Gupta', date: '2024-01-28', shift: 'Day Shift', status: 'Approved' },
  ]);

  const [newLeave, setNewLeave] = useState({ type: '', date: '', reason: '' });
  const [newShift, setNewShift] = useState({ date: '', shift: '', time: '', location: '' });

  const availableOfficers = [
    { id: 1, name: 'Inspector Sharma', shift: 'Night Shift', date: '2024-01-22' },
    { id: 2, name: 'Inspector Gupta', shift: 'Day Shift', date: '2024-01-28' },
    { id: 3, name: 'Constable Kumar', shift: 'Day Shift', date: '2024-01-20' },
    { id: 4, name: 'Inspector Verma', shift: 'Night Shift', date: '2024-01-24' },
    { id: 5, name: 'Head Constable Singh', shift: 'Day Shift', date: '2024-01-26' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Approved': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleAddLeave = () => {
    if (newLeave.type && newLeave.date && newLeave.reason) {
      const leave = {
        id: leaveRequests.length + 1,
        type: newLeave.type,
        date: newLeave.date,
        status: 'Pending',
        reason: newLeave.reason,
      };
      setLeaveRequests([...leaveRequests, leave]);
      setNewLeave({ type: '', date: '', reason: '' });
      setShowLeaveModal(false);
    }
  };

  const handleAddShift = () => {
    if (newShift.date && newShift.shift && newShift.time && newShift.location) {
      setUpcomingShifts([...upcomingShifts, newShift]);
      setNewShift({ date: '', shift: '', time: '', location: '' });
      setShowUpcomingModal(false);
    }
  };

  const handleSwapRequest = (officer) => {
    const swap = {
      id: swapRequests.length + 1,
      with: officer.name,
      date: officer.date,
      shift: officer.shift,
      status: 'Pending',
    };
    setSwapRequests([...swapRequests, swap]);
    setShowSwapModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule & Shifts</Text>
        <Text style={styles.subtitle}>Manage your duty roster and leave requests</Text>
      </View>

      <View style={styles.viewToggle}>
        {['day', 'week', 'month'].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.toggleButton, viewMode === mode && styles.activeToggle]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[styles.toggleText, viewMode === mode && styles.activeToggleText]}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Shift</Text>
          <TouchableOpacity 
            style={styles.currentShiftCard}
            onPress={() => setShowShiftDetails(true)}
          >
            <View style={styles.shiftHeader}>
              <View style={styles.shiftIcon}>
                <Clock size={24} color="#3b82f6" />
              </View>
              <View style={styles.shiftInfo}>
                <Text style={styles.shiftType}>{currentShift.type}</Text>
                <Text style={styles.shiftTime}>{currentShift.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentShift.status) }]}>
                <Text style={styles.statusText}>{currentShift.status}</Text>
              </View>
            </View>
            <View style={styles.shiftDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.detailText}>{currentShift.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Users size={16} color="#6b7280" />
                <Text style={styles.detailText}>Partner: {currentShift.partner}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowUpcomingModal(true)}
            >
              <Plus size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <View style={styles.shiftsList}>
            {upcomingShifts.map((shift, index) => (
              <View key={index} style={styles.shiftCard}>
                <View style={styles.shiftDateContainer}>
                  <Text style={styles.shiftDate}>{shift.date}</Text>
                  <Text style={styles.shiftLocation}>{shift.location}</Text>
                </View>
                <View style={styles.shiftMainInfo}>
                  <Text style={styles.shiftName}>{shift.shift}</Text>
                  <Text style={styles.shiftDuration}>{shift.time}</Text>
                </View>
                <TouchableOpacity style={styles.swapButton}>
                  <RefreshCw size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leave Requests</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowLeaveModal(true)}
            >
              <Plus size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <View style={styles.leavesList}>
            {leaveRequests.map((leave) => (
              <View key={leave.id} style={styles.leaveCard}>
                <View style={styles.leaveInfo}>
                  <Text style={styles.leaveType}>{leave.type}</Text>
                  <Text style={styles.leaveDate}>{leave.date}</Text>
                  <Text style={styles.leaveReason}>{leave.reason}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(leave.status) }]}>
                  <Text style={styles.statusText}>{leave.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shift Swaps</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowSwapModal(true)}
            >
              <RefreshCw size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <View style={styles.swapsList}>
            {swapRequests.map((swap) => (
              <View key={swap.id} style={styles.swapCard}>
                <View style={styles.swapInfo}>
                  <Text style={styles.swapWith}>Swap with {swap.with}</Text>
                  <Text style={styles.swapDate}>{swap.date} - {swap.shift}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(swap.status) }]}>
                  <Text style={styles.statusText}>{swap.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Current Shift Details Modal */}
      <Modal
        visible={showShiftDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShiftDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Current Shift Details</Text>
              <TouchableOpacity onPress={() => setShowShiftDetails(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Shift Type</Text>
                <Text style={styles.detailValue}>{currentShift.type}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Timing</Text>
                <Text style={styles.detailValue}>{currentShift.time}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[styles.detailValue, { color: getStatusColor(currentShift.status) }]}>
                  {currentShift.status}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{currentShift.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Patrol Route</Text>
                <Text style={styles.detailValue}>{currentShift.patrol}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Partner</Text>
                <Text style={styles.detailValue}>{currentShift.partner}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Leave Modal */}
      <Modal
        visible={showLeaveModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLeaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Leave</Text>
              <TouchableOpacity onPress={() => setShowLeaveModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Leave Type</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Sick Leave"
                value={newLeave.type}
                onChangeText={(text) => setNewLeave({ ...newLeave, type: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={newLeave.date}
                onChangeText={(text) => setNewLeave({ ...newLeave, date: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Reason</Text>
              <TextInput
                style={styles.input}
                placeholder="Reason for leave"
                value={newLeave.reason}
                onChangeText={(text) => setNewLeave({ ...newLeave, reason: text })}
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddLeave}>
              <Check size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Upcoming Shift Modal */}
      <Modal
        visible={showUpcomingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUpcomingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Shift</Text>
              <TouchableOpacity onPress={() => setShowUpcomingModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={newShift.date}
                onChangeText={(text) => setNewShift({ ...newShift, date: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Shift Type</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Day Shift"
                value={newShift.shift}
                onChangeText={(text) => setNewShift({ ...newShift, shift: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 08:00 AM - 08:00 PM"
                value={newShift.time}
                onChangeText={(text) => setNewShift({ ...newShift, time: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Sector 5"
                value={newShift.location}
                onChangeText={(text) => setNewShift({ ...newShift, location: text })}
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddShift}>
              <Check size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Add Shift</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Swap Shift Modal */}
      <Modal
        visible={showSwapModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSwapModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Officer to Swap</Text>
              <TouchableOpacity onPress={() => setShowSwapModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableOfficers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.officerCard}
                  onPress={() => handleSwapRequest(item)}
                >
                  <View style={styles.officerInfo}>
                    <Text style={styles.officerName}>{item.name}</Text>
                    <Text style={styles.officerShift}>{item.shift} - {item.date}</Text>
                  </View>
                  <RefreshCw size={20} color="#3b82f6" />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#f0f7ff',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeToggleText: {
    color: '#1e3a8a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentShiftCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shiftIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shiftInfo: {
    flex: 1,
  },
  shiftType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  shiftTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  shiftDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  shiftsList: {
    gap: 12,
  },
  shiftCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shiftDateContainer: {
    marginRight: 12,
  },
  shiftDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  shiftLocation: {
    fontSize: 10,
    color: '#6b7280',
  },
  shiftMainInfo: {
    flex: 1,
  },
  shiftName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  shiftDuration: {
    fontSize: 12,
    color: '#6b7280',
  },
  swapButton: {
    padding: 8,
  },
  leavesList: {
    gap: 12,
  },
  leaveCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  leaveInfo: {
    flex: 1,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  leaveDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  leaveReason: {
    fontSize: 12,
    color: '#9ca3af',
  },
  swapsList: {
    gap: 12,
  },
  swapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  swapInfo: {
    flex: 1,
  },
  swapWith: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  swapDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  detailItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  officerCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  officerInfo: {
    flex: 1,
  },
  officerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  officerShift: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});