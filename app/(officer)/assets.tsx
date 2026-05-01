import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Shield, 
  Car, 
  Radio, 
  Camera, 
  Plus, 
  CreditCard as Edit, 
  TriangleAlert as AlertTriangle, 
  QrCode, 
  User, 
  Wrench, 
  ArrowLeftRight, 
  X, 
  Check,
  Calendar,
  MapPin,
  UserCheck,
  ClipboardList
} from 'lucide-react-native';

// Define types for better TypeScript support
type Asset = {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: string;
  location: string;
  lastService: string;
  nextService: string;
  assignedTo: string;
  condition: string;
  icon: any;
  color: string;
  purchaseDate: string;
  warranty: string;
};

type MaintenanceAsset = {
  id: string;
  name: string;
  lastMaintenance: string;
  nextDue: string;
  status: string;
  isOverdue: boolean;
  maintenanceType: string;
  assignedTechnician?: string;
  estimatedCost?: string;
  notes?: string;
};

export default function AssetsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedMaintenanceAsset, setSelectedMaintenanceAsset] = useState<MaintenanceAsset | null>(null);
  const [selectedAssetForAction, setSelectedAssetForAction] = useState<Asset | null>(null);
  
  const [assignForm, setAssignForm] = useState({
    assetId: '',
    officer: '',
    purpose: '',
    duration: ''
  });
  
  const [returnForm, setReturnForm] = useState({
    assetId: '',
    condition: 'Excellent',
    notes: ''
  });
  
  const [newAssetForm, setNewAssetForm] = useState({
    name: '',
    type: 'Vehicle',
    model: '',
    serialNumber: '',
    location: '',
    assignedTo: 'Unassigned',
    condition: 'Excellent',
    purchaseDate: '',
    warranty: ''
  });
  
  const [scheduleForm, setScheduleForm] = useState({
    maintenanceDate: '',
    maintenanceType: 'Routine',
    notes: '',
    estimatedCost: '',
    assignedTechnician: ''
  });
  
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'VEH-001',
      name: 'Patrol Vehicle',
      type: 'Vehicle',
      model: 'Mahindra Bolero',
      serialNumber: 'SNV001234',
      status: 'Active',
      location: 'Station A',
      lastService: '2024-01-10',
      nextService: '2024-02-10',
      assignedTo: 'Inspector Kumar',
      condition: 'Good',
      icon: Car,
      color: '#10b981',
      purchaseDate: '2023-05-15',
      warranty: '3 years'
    },
    {
      id: 'WEP-045',
      name: 'Service Pistol',
      type: 'Weapon',
      model: 'Glock 19',
      serialNumber: 'SNW045678',
      status: 'Assigned',
      location: 'Armory',
      lastService: '2024-01-08',
      nextService: '2024-04-08',
      assignedTo: 'SI Sharma',
      condition: 'Excellent',
      icon: Shield,
      color: '#ef4444',
      purchaseDate: '2023-08-20',
      warranty: '5 years'
    },
    {
      id: 'EQP-089',
      name: 'Radio Comm',
      type: 'Equipment',
      model: 'Motorola DP4801',
      serialNumber: 'SNE089012',
      status: 'Active',
      location: 'Station B',
      lastService: '2024-01-05',
      nextService: '2024-07-05',
      assignedTo: 'Constable Patel',
      condition: 'Good',
      icon: Radio,
      color: '#3b82f6',
      purchaseDate: '2023-11-10',
      warranty: '2 years'
    },
    {
      id: 'ELC-023',
      name: 'Body Camera',
      type: 'Electronics',
      model: 'Axon Body 3',
      serialNumber: 'SNE023456',
      status: 'Maintenance',
      location: 'Repair Shop',
      lastService: '2024-01-15',
      nextService: '2024-01-20',
      assignedTo: 'Unassigned',
      condition: 'Fair',
      icon: Camera,
      color: '#f59e0b',
      purchaseDate: '2023-12-01',
      warranty: '1 year'
    },
  ]);

  const [maintenanceAssets, setMaintenanceAssets] = useState<MaintenanceAsset[]>([
    {
      id: 'VEH-001',
      name: 'Police Vehicle - Mahindra Bolero',
      lastMaintenance: '2024-01-10',
      nextDue: '2024-02-10',
      status: 'Scheduled',
      isOverdue: true,
      maintenanceType: 'Oil Change',
      assignedTechnician: 'Tech Raj',
      estimatedCost: '₹2,500',
      notes: 'Regular maintenance'
    },
    {
      id: 'WEP-001',
      name: 'Service Pistol - Glock 17',
      lastMaintenance: '2024-01-05',
      nextDue: '2024-02-05',
      status: 'Overdue',
      isOverdue: true,
      maintenanceType: 'Cleaning & Inspection',
      assignedTechnician: 'Armorer Singh',
      estimatedCost: '₹1,200',
      notes: 'Thorough cleaning required'
    },
    {
      id: 'EQP-089',
      name: 'Radio Comm - Motorola',
      lastMaintenance: '2024-01-15',
      nextDue: '2024-04-15',
      status: 'Completed',
      isOverdue: false,
      maintenanceType: 'Battery Replacement',
      assignedTechnician: 'Tech Kumar',
      estimatedCost: '₹800',
      notes: 'Battery replaced successfully'
    },
  ]);

  // Helper functions
  const getIconForType = (type: string) => {
    switch (type) {
      case 'Vehicle': return Car;
      case 'Weapon': return Shield;
      case 'Equipment': return Radio;
      case 'Electronics': return Camera;
      default: return Shield;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'Vehicle': return '#10b981';
      case 'Weapon': return '#ef4444';
      case 'Equipment': return '#3b82f6';
      case 'Electronics': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const generateAssetId = (type: string) => {
    const prefix = type.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${randomNum}`;
  };

  const handleAddAsset = () => {
    if (!newAssetForm.name || !newAssetForm.model || !newAssetForm.location) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Model, Location)');
      return;
    }

    const newAsset: Asset = {
      id: generateAssetId(newAssetForm.type),
      name: newAssetForm.name,
      type: newAssetForm.type,
      model: newAssetForm.model,
      serialNumber: newAssetForm.serialNumber || 'N/A',
      status: 'Active',
      location: newAssetForm.location,
      lastService: new Date().toISOString().split('T')[0],
      nextService: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: newAssetForm.assignedTo || 'Unassigned',
      condition: newAssetForm.condition,
      icon: getIconForType(newAssetForm.type),
      color: getColorForType(newAssetForm.type),
      purchaseDate: newAssetForm.purchaseDate || new Date().toISOString().split('T')[0],
      warranty: newAssetForm.warranty || 'N/A'
    };
    
    // Update assets state
    setAssets(prevAssets => [...prevAssets, newAsset]);
    
    // Reset form and close modal
    setNewAssetForm({
      name: '',
      type: 'Vehicle',
      model: '',
      serialNumber: '',
      location: '',
      assignedTo: 'Unassigned',
      condition: 'Excellent',
      purchaseDate: '',
      warranty: ''
    });
    
    setShowAddAssetModal(false);
    Alert.alert('Success', `Asset ${newAsset.id} added successfully!`);
  };

  const handleScheduleMaintenance = () => {
    if (!scheduleForm.maintenanceDate || !scheduleForm.maintenanceType) {
      Alert.alert('Error', 'Please fill in maintenance date and type');
      return;
    }

    if (!selectedMaintenanceAsset) {
      Alert.alert('Error', 'No asset selected for maintenance');
      return;
    }

    const newMaintenanceRecord: MaintenanceAsset = {
      id: selectedMaintenanceAsset.id,
      name: selectedMaintenanceAsset.name,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextDue: scheduleForm.maintenanceDate,
      status: 'Scheduled',
      isOverdue: false,
      maintenanceType: scheduleForm.maintenanceType,
      assignedTechnician: scheduleForm.assignedTechnician,
      estimatedCost: scheduleForm.estimatedCost,
      notes: scheduleForm.notes
    };

    // Update maintenance assets
    setMaintenanceAssets(prev => {
      const filtered = prev.filter(asset => asset.id !== selectedMaintenanceAsset.id);
      return [newMaintenanceRecord, ...filtered];
    });

    // Update the original asset's service dates
    setAssets(prev => 
      prev.map(asset => 
        asset.id === selectedMaintenanceAsset.id 
          ? { 
              ...asset, 
              lastService: new Date().toISOString().split('T')[0],
              nextService: scheduleForm.maintenanceDate,
              status: asset.status === 'Maintenance' ? 'Active' : asset.status
            }
          : asset
      )
    );

    setShowScheduleModal(false);
    setScheduleForm({ 
      maintenanceDate: '', 
      maintenanceType: 'Routine', 
      notes: '', 
      estimatedCost: '',
      assignedTechnician: ''
    });
    setSelectedMaintenanceAsset(null);
    Alert.alert('Success', 'Maintenance scheduled successfully!');
  };

  const handleRescheduleMaintenance = (asset: MaintenanceAsset) => {
    setSelectedMaintenanceAsset(asset);
    setScheduleForm({
      maintenanceDate: asset.nextDue,
      maintenanceType: asset.maintenanceType,
      notes: asset.notes || '',
      estimatedCost: asset.estimatedCost || '',
      assignedTechnician: asset.assignedTechnician || ''
    });
    setShowScheduleModal(true);
  };

  const handleMarkMaintenanceComplete = (assetId: string) => {
    const nextDueDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setMaintenanceAssets(prev => 
      prev.map(asset => 
        asset.id === assetId 
          ? { 
              ...asset, 
              lastMaintenance: new Date().toISOString().split('T')[0],
              nextDue: nextDueDate,
              isOverdue: false,
              status: 'Completed'
            }
          : asset
      )
    );

    // Update the original asset
    setAssets(prev => 
      prev.map(asset => 
        asset.id === assetId 
          ? { 
              ...asset, 
              lastService: new Date().toISOString().split('T')[0],
              nextService: nextDueDate,
              status: 'Active',
              condition: asset.condition === 'Poor' ? 'Fair' : asset.condition
            }
          : asset
      )
    );

    Alert.alert('Success', 'Maintenance marked as complete!');
  };

  const handleAssignAsset = () => {
    if (!assignForm.assetId || !assignForm.officer) {
      Alert.alert('Error', 'Please fill in Asset ID and Officer name');
      return;
    }

    const assetId = assignForm.assetId.toUpperCase();
    const assetExists = assets.find(asset => asset.id === assetId);

    if (!assetExists) {
      Alert.alert('Error', `Asset with ID ${assetId} not found`);
      return;
    }

    if (assetExists.status === 'Assigned') {
      Alert.alert('Error', `Asset ${assetId} is already assigned to ${assetExists.assignedTo}`);
      return;
    }

    setAssets(prev => 
      prev.map(asset => 
        asset.id === assetId
          ? { ...asset, status: 'Assigned', assignedTo: assignForm.officer }
          : asset
      )
    );

    setShowAssignModal(false);
    setAssignForm({ assetId: '', officer: '', purpose: '', duration: '' });
    setSelectedAssetForAction(null);
    Alert.alert('Success', `Asset ${assetId} assigned to ${assignForm.officer}!`);
  };

  const handleReturnAsset = () => {
    if (!returnForm.assetId || !returnForm.condition) {
      Alert.alert('Error', 'Please fill in Asset ID and Condition');
      return;
    }

    const assetId = returnForm.assetId.toUpperCase();
    const assetExists = assets.find(asset => asset.id === assetId);

    if (!assetExists) {
      Alert.alert('Error', `Asset with ID ${assetId} not found`);
      return;
    }

    if (assetExists.status !== 'Assigned') {
      Alert.alert('Error', `Asset ${assetId} is not currently assigned`);
      return;
    }

    setAssets(prev => 
      prev.map(asset => 
        asset.id === assetId
          ? { ...asset, status: 'Active', assignedTo: 'Unassigned', condition: returnForm.condition }
          : asset
      )
    );

    setShowReturnModal(false);
    setReturnForm({ assetId: '', condition: 'Excellent', notes: '' });
    setSelectedAssetForAction(null);
    Alert.alert('Success', `Asset ${assetId} returned successfully!`);
  };

  const handleQuickAssign = (asset: Asset) => {
    setSelectedAssetForAction(asset);
    setAssignForm(prev => ({
      ...prev, 
      assetId: asset.id,
      officer: asset.assignedTo !== 'Unassigned' ? asset.assignedTo : ''
    }));
    setShowAssignModal(true);
  };

  const handleQuickReturn = (asset: Asset) => {
    setSelectedAssetForAction(asset);
    setReturnForm(prev => ({
      ...prev, 
      assetId: asset.id,
      condition: asset.condition
    }));
    setShowReturnModal(true);
  };

  const handleQuickMaintenance = (asset: Asset) => {
    const maintenanceAsset: MaintenanceAsset = {
      id: asset.id,
      name: `${asset.name} - ${asset.model}`,
      lastMaintenance: asset.lastService,
      nextDue: asset.nextService,
      status: asset.status === 'Maintenance' ? 'Overdue' : 'Scheduled',
      isOverdue: new Date(asset.nextService) < new Date(),
      maintenanceType: 'Routine'
    };
    setSelectedMaintenanceAsset(maintenanceAsset);
    setScheduleForm({
      maintenanceDate: asset.nextService,
      maintenanceType: 'Routine',
      notes: '',
      estimatedCost: '',
      assignedTechnician: ''
    });
    setShowScheduleModal(true);
  };

  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: ClipboardList },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'assign', label: 'Assign/Return', icon: ArrowLeftRight },
    { id: 'qrscan', label: 'QR Scan', icon: QrCode },
  ];

  const categories = [
    { id: 'all', label: 'All Assets', count: assets.length },
    { id: 'vehicles', label: 'Vehicles', count: assets.filter(a => a.type === 'Vehicle').length },
    { id: 'equipment', label: 'Equipment', count: assets.filter(a => a.type === 'Equipment').length },
    { id: 'weapons', label: 'Weapons', count: assets.filter(a => a.type === 'Weapon').length },
    { id: 'electronics', label: 'Electronics', count: assets.filter(a => a.type === 'Electronics').length },
  ];

  const maintenanceTypes = ['Routine', 'Repair', 'Inspection', 'Calibration', 'Replacement'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Assigned': return '#3b82f6';
      case 'Maintenance': return '#f59e0b';
      case 'Inactive': return '#ef4444';
      case 'Scheduled': return '#8b5cf6';
      case 'Overdue': return '#dc2626';
      case 'Completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return '#10b981';
      case 'Good': return '#3b82f6';
      case 'Fair': return '#f59e0b';
      case 'Poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Filter assets based on search and category
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || 
                           (activeCategory === 'vehicles' && asset.type === 'Vehicle') ||
                           (activeCategory === 'equipment' && asset.type === 'Equipment') ||
                           (activeCategory === 'weapons' && asset.type === 'Weapon') ||
                           (activeCategory === 'electronics' && asset.type === 'Electronics');
    
    return matchesSearch && matchesCategory;
  });

  // Filter maintenance assets based on search
  const filteredMaintenanceAssets = maintenanceAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderInventoryTab = () => (
    <View style={styles.inventoryContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              activeCategory === category.id && styles.activeCategoryChip
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === category.id && styles.activeCategoryText
            ]}>
              {category.label}
            </Text>
            <Text style={[
              styles.categoryCount,
              activeCategory === category.id && styles.activeCategoryCount
            ]}>
              {category.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.assetsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredAssets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No assets found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first asset using the + button'}
            </Text>
          </View>
        ) : (
          filteredAssets.map((asset) => (
            <View key={asset.id} style={styles.assetCard}>
              <View style={styles.assetHeader}>
                <View style={styles.assetIconContainer}>
                  <View style={[styles.assetIcon, { backgroundColor: `${asset.color}20` }]}>
                    <asset.icon size={20} color={asset.color} />
                  </View>
                </View>
                <View style={styles.assetInfo}>
                  <Text style={styles.assetName}>{asset.name}</Text>
                  <Text style={styles.assetId}>{asset.id}</Text>
                </View>
                <View style={styles.assetActions}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(asset.status) }
                  ]}>
                    <Text style={styles.statusText}>{asset.status}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.assetDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Model:</Text>
                  <Text style={styles.detailValue}>{asset.model}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Serial No:</Text>
                  <Text style={styles.detailValue}>{asset.serialNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <View style={styles.detailWithIcon}>
                    <MapPin size={12} color="#6b7280" />
                    <Text style={styles.detailValue}>{asset.location}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Assigned:</Text>
                  <View style={styles.detailWithIcon}>
                    <UserCheck size={12} color="#6b7280" />
                    <Text style={styles.detailValue}>{asset.assignedTo}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Condition:</Text>
                  <View style={[
                    styles.conditionBadge,
                    { backgroundColor: getConditionColor(asset.condition) }
                  ]}>
                    <Text style={styles.conditionText}>{asset.condition}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>Service Information</Text>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Last Service:</Text>
                  <Text style={styles.serviceValue}>{asset.lastService}</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Next Service:</Text>
                  <Text style={styles.serviceValue}>{asset.nextService}</Text>
                </View>
              </View>

              <View style={styles.assetActionsRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.assignButton]}
                  onPress={() => handleQuickAssign(asset)}
                >
                  <User size={14} color="#3b82f6" />
                  <Text style={[styles.actionButtonText, { color: '#3b82f6' }]}>
                    {asset.status === 'Assigned' ? 'Reassign' : 'Assign'}
                  </Text>
                </TouchableOpacity>
                
                {asset.status === 'Assigned' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.returnButton]}
                    onPress={() => handleQuickReturn(asset)}
                  >
                    <ArrowLeftRight size={14} color="#10b981" />
                    <Text style={[styles.actionButtonText, { color: '#10b981' }]}>Return</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.maintenanceButton]}
                  onPress={() => handleQuickMaintenance(asset)}
                >
                  <Wrench size={14} color="#f59e0b" />
                  <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>Maintain</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderMaintenanceTab = () => (
    <View style={styles.maintenanceContainer}>
      <View style={styles.maintenanceHeader}>
        <Text style={styles.maintenanceTitle}>Maintenance Schedule</Text>
        <Text style={styles.maintenanceSubtitle}>Track and manage asset maintenance</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredMaintenanceAssets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No maintenance records found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Schedule maintenance from inventory tab'}
            </Text>
          </View>
        ) : (
          filteredMaintenanceAssets.map((asset) => (
            <View key={`${asset.id}-${asset.lastMaintenance}`} style={[styles.maintenanceCard, asset.isOverdue && styles.overdueCard]}>
              {asset.isOverdue && (
                <View style={styles.overdueLabel}>
                  <AlertTriangle size={12} color="#ffffff" />
                  <Text style={styles.overdueText}>Overdue</Text>
                </View>
              )}
              
              <View style={styles.maintenanceCardHeader}>
                <Text style={styles.maintenanceAssetName}>{asset.name}</Text>
                <View style={[
                  styles.maintenanceStatusBadge,
                  { backgroundColor: getStatusColor(asset.status) }
                ]}>
                  <Text style={styles.maintenanceStatusText}>{asset.status}</Text>
                </View>
              </View>
              
              <Text style={styles.maintenanceAssetId}>ID: {asset.id}</Text>
              
              <View style={styles.maintenanceDetails}>
                <View style={styles.maintenanceRow}>
                  <Text style={styles.maintenanceLabel}>Last Maintenance:</Text>
                  <Text style={styles.maintenanceValue}>{asset.lastMaintenance}</Text>
                </View>
                <View style={styles.maintenanceRow}>
                  <Text style={styles.maintenanceLabel}>Next Due:</Text>
                  <Text style={styles.maintenanceValue}>{asset.nextDue}</Text>
                </View>
                <View style={styles.maintenanceRow}>
                  <Text style={styles.maintenanceLabel}>Type:</Text>
                  <Text style={styles.maintenanceValue}>{asset.maintenanceType}</Text>
                </View>
                {asset.assignedTechnician && (
                  <View style={styles.maintenanceRow}>
                    <Text style={styles.maintenanceLabel}>Technician:</Text>
                    <Text style={styles.maintenanceValue}>{asset.assignedTechnician}</Text>
                  </View>
                )}
                {asset.estimatedCost && (
                  <View style={styles.maintenanceRow}>
                    <Text style={styles.maintenanceLabel}>Est. Cost:</Text>
                    <Text style={styles.maintenanceValue}>{asset.estimatedCost}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.maintenanceActions}>
                <TouchableOpacity 
                  style={styles.scheduleButton} 
                  onPress={() => handleRescheduleMaintenance(asset)}
                >
                  <Calendar size={14} color="#ffffff" />
                  <Text style={styles.scheduleButtonText}>
                    {asset.status === 'Completed' ? 'Reschedule' : 'Modify'}
                  </Text>
                </TouchableOpacity>
                
                {asset.status !== 'Completed' && (
                  <TouchableOpacity 
                    style={styles.completeButton} 
                    onPress={() => handleMarkMaintenanceComplete(asset.id)}
                  >
                    <Check size={14} color="#10b981" />
                    <Text style={styles.completeButtonText}>Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderAssignReturnTab = () => (
    <ScrollView style={styles.assignContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.assignReturnContainer}>
        {/* Assign Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <UserCheck size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Assign Asset</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Asset ID</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.formInput}
                placeholder="Enter Asset ID"
                value={assignForm.assetId}
                onChangeText={(text) => setAssignForm({...assignForm, assetId: text})}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.scanIcon}>
                <QrCode size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Assign To Officer *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter officer name"
              value={assignForm.officer}
              onChangeText={(text) => setAssignForm({...assignForm, officer: text})}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Purpose</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Enter assignment purpose"
              multiline
              numberOfLines={3}
              value={assignForm.purpose}
              onChangeText={(text) => setAssignForm({...assignForm, purpose: text})}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Duration</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., 7 days"
              value={assignForm.duration}
              onChangeText={(text) => setAssignForm({...assignForm, duration: text})}
            />
          </View>
          
          <TouchableOpacity style={styles.assignActionButton} onPress={handleAssignAsset}>
            <UserCheck size={18} color="#ffffff" />
            <Text style={styles.assignActionButtonText}>Assign Asset</Text>
          </TouchableOpacity>
        </View>

        {/* Return Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ArrowLeftRight size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>Return Asset</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Asset ID</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.formInput}
                placeholder="Enter Asset ID"
                value={returnForm.assetId}
                onChangeText={(text) => setReturnForm({...returnForm, assetId: text})}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.scanIcon}>
                <QrCode size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Condition on Return *</Text>
            <View style={styles.conditionSelector}>
              {conditions.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.conditionChip,
                    returnForm.condition === condition && styles.conditionChipActive
                  ]}
                  onPress={() => setReturnForm({...returnForm, condition})}
                >
                  <Text style={[
                    styles.conditionChipText,
                    returnForm.condition === condition && styles.conditionChipTextActive
                  ]}>
                    {condition}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Notes</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Any issues or observations"
              multiline
              numberOfLines={3}
              value={returnForm.notes}
              onChangeText={(text) => setReturnForm({...returnForm, notes: text})}
            />
          </View>
          
          <TouchableOpacity style={styles.returnActionButton} onPress={handleReturnAsset}>
            <ArrowLeftRight size={18} color="#ffffff" />
            <Text style={styles.returnActionButtonText}>Return Asset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderQRScanTab = () => (
    <View style={styles.qrScanContainer}>
      <View style={styles.qrHeader}>
        <QrCode size={64} color="#1e3a8a" />
        <Text style={styles.qrTitle}>QR Code Scanner</Text>
        <Text style={styles.qrSubtitle}>Scan asset QR codes for quick access and updates</Text>
      </View>
      
      <View style={styles.scanFrame}>
        <View style={styles.scanArea}>
          <View style={styles.scanAreaBorder}>
            <QrCode size={80} color="#9ca3af" />
          </View>
        </View>
        <Text style={styles.scanInstruction}>Position QR code within the frame</Text>
        <Text style={styles.scanDescription}>The scanner will automatically detect and process the code</Text>
      </View>
      
      <TouchableOpacity style={styles.startScanButton}>
        <QrCode size={20} color="#ffffff" />
        <Text style={styles.startScanText}>Start Scanner</Text>
      </TouchableOpacity>
      
      <View style={styles.qrFeatures}>
        <View style={styles.featureItem}>
          <Shield size={24} color="#3b82f6" />
          <Text style={styles.featureTitle}>Quick Info</Text>
          <Text style={styles.featureDescription}>View asset details instantly</Text>
        </View>
        <View style={styles.featureItem}>
          <UserCheck size={24} color="#10b981" />
          <Text style={styles.featureTitle}>Assign/Return</Text>
          <Text style={styles.featureDescription}>Quick asset transactions</Text>
        </View>
        <View style={styles.featureItem}>
          <Wrench size={24} color="#f59e0b" />
          <Text style={styles.featureTitle}>Maintenance</Text>
          <Text style={styles.featureDescription}>Record maintenance activities</Text>
        </View>
      </View>
    </View>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case 'inventory': return renderInventoryTab();
      case 'maintenance': return renderMaintenanceTab();
      case 'assign': return renderAssignReturnTab();
      case 'qrscan': return renderQRScanTab();
      default: return renderInventoryTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Asset Management</Text>
        <Text style={styles.subtitle}>Track and manage department assets</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <IconComponent 
                size={18} 
                color={activeTab === tab.id ? '#1e3a8a' : '#6b7280'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Bar - Show for inventory and maintenance tabs */}
      {(activeTab === 'inventory' || activeTab === 'maintenance') && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${activeTab === 'inventory' ? 'assets' : 'maintenance records'}...`}
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {activeTab === 'inventory' && (
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => setShowAddAssetModal(true)}
            >
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {getTabContent()}
      </View>

      {/* Add Asset Modal */}
      <Modal
        visible={showAddAssetModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddAssetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Asset</Text>
              <TouchableOpacity onPress={() => setShowAddAssetModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Asset Name *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Patrol Vehicle"
                  value={newAssetForm.name}
                  onChangeText={(text) => setNewAssetForm({...newAssetForm, name: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Type *</Text>
                <View style={styles.typeSelector}>
                  {['Vehicle', 'Weapon', 'Equipment', 'Electronics'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        newAssetForm.type === type && styles.typeButtonActive
                      ]}
                      onPress={() => setNewAssetForm({...newAssetForm, type})}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        newAssetForm.type === type && styles.typeButtonTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Model *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Mahindra Bolero"
                  value={newAssetForm.model}
                  onChangeText={(text) => setNewAssetForm({...newAssetForm, model: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Serial Number</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter serial number"
                  value={newAssetForm.serialNumber}
                  onChangeText={(text) => setNewAssetForm({...newAssetForm, serialNumber: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Location *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Station A"
                  value={newAssetForm.location}
                  onChangeText={(text) => setNewAssetForm({...newAssetForm, location: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Assigned To</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Inspector Kumar"
                  value={newAssetForm.assignedTo}
                  onChangeText={(text) => setNewAssetForm({...newAssetForm, assignedTo: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Condition</Text>
                <View style={styles.conditionSelector}>
                  {conditions.map((condition) => (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.conditionChip,
                        newAssetForm.condition === condition && styles.conditionChipActive
                      ]}
                      onPress={() => setNewAssetForm({...newAssetForm, condition})}
                    >
                      <Text style={[
                        styles.conditionChipText,
                        newAssetForm.condition === condition && styles.conditionChipTextActive
                      ]}>
                        {condition}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Purchase Date</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="YYYY-MM-DD"
                  value={newAssetForm.purchaseDate}
                  onChangeText={(text) => setNewAssetForm({...newAssetForm, purchaseDate: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Warranty</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., 2 years"
                  value={newAssetForm.warranty}
                  onChangeText={(text) => setNewAssetForm({...newAssetForm, warranty: text})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowAddAssetModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitButton} 
                onPress={handleAddAsset}
              >
                <Plus size={18} color="#ffffff" />
                <Text style={styles.modalSubmitText}>Add Asset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Schedule Maintenance Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedMaintenanceAsset?.status === 'Completed' ? 'Reschedule Maintenance' : 'Schedule Maintenance'}
              </Text>
              <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedMaintenanceAsset && (
                <View style={styles.assetInfoBox}>
                  <Text style={styles.assetInfoTitle}>{selectedMaintenanceAsset.name}</Text>
                  <Text style={styles.assetInfoSubtitle}>ID: {selectedMaintenanceAsset.id}</Text>
                </View>
              )}

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Maintenance Date *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="YYYY-MM-DD"
                  value={scheduleForm.maintenanceDate}
                  onChangeText={(text) => setScheduleForm({...scheduleForm, maintenanceDate: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Maintenance Type *</Text>
                <View style={styles.typeSelector}>
                  {maintenanceTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        scheduleForm.maintenanceType === type && styles.typeButtonActive
                      ]}
                      onPress={() => setScheduleForm({...scheduleForm, maintenanceType: type})}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        scheduleForm.maintenanceType === type && styles.typeButtonTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Assigned Technician</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter technician name"
                  value={scheduleForm.assignedTechnician}
                  onChangeText={(text) => setScheduleForm({...scheduleForm, assignedTechnician: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Estimated Cost</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter estimated cost"
                  value={scheduleForm.estimatedCost}
                  onChangeText={(text) => setScheduleForm({...scheduleForm, estimatedCost: text})}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="Additional notes..."
                  multiline
                  numberOfLines={4}
                  value={scheduleForm.notes}
                  onChangeText={(text) => setScheduleForm({...scheduleForm, notes: text})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowScheduleModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitButton} 
                onPress={handleScheduleMaintenance}
              >
                <Calendar size={18} color="#ffffff" />
                <Text style={styles.modalSubmitText}>
                  {selectedMaintenanceAsset?.status === 'Completed' ? 'Reschedule' : 'Schedule'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign Asset Modal */}
      <Modal
        visible={showAssignModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Asset</Text>
              <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedAssetForAction && (
                <View style={styles.assetInfoBox}>
                  <Text style={styles.assetInfoTitle}>{selectedAssetForAction.name}</Text>
                  <Text style={styles.assetInfoSubtitle}>ID: {selectedAssetForAction.id}</Text>
                  <Text style={styles.assetInfoSubtitle}>Current Status: {selectedAssetForAction.status}</Text>
                </View>
              )}

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Assign To Officer *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter officer name"
                  value={assignForm.officer}
                  onChangeText={(text) => setAssignForm({...assignForm, officer: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Purpose</Text>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="Enter assignment purpose"
                  multiline
                  numberOfLines={3}
                  value={assignForm.purpose}
                  onChangeText={(text) => setAssignForm({...assignForm, purpose: text})}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Duration</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., 7 days"
                  value={assignForm.duration}
                  onChangeText={(text) => setAssignForm({...assignForm, duration: text})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowAssignModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalSubmitButton, { backgroundColor: '#3b82f6' }]} 
                onPress={handleAssignAsset}
              >
                <UserCheck size={18} color="#ffffff" />
                <Text style={styles.modalSubmitText}>
                  {selectedAssetForAction?.status === 'Assigned' ? 'Reassign' : 'Assign'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Return Asset Modal */}
      <Modal
        visible={showReturnModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReturnModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Return Asset</Text>
              <TouchableOpacity onPress={() => setShowReturnModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedAssetForAction && (
                <View style={styles.assetInfoBox}>
                  <Text style={styles.assetInfoTitle}>{selectedAssetForAction.name}</Text>
                  <Text style={styles.assetInfoSubtitle}>ID: {selectedAssetForAction.id}</Text>
                  <Text style={styles.assetInfoSubtitle}>Currently assigned to: {selectedAssetForAction.assignedTo}</Text>
                </View>
              )}

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Condition on Return *</Text>
                <View style={styles.conditionSelector}>
                  {conditions.map((condition) => (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.conditionChip,
                        returnForm.condition === condition && styles.conditionChipActive
                      ]}
                      onPress={() => setReturnForm({...returnForm, condition})}
                    >
                      <Text style={[
                        styles.conditionChipText,
                        returnForm.condition === condition && styles.conditionChipTextActive
                      ]}>
                        {condition}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalLabel}>Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="Any issues or observations"
                  multiline
                  numberOfLines={4}
                  value={returnForm.notes}
                  onChangeText={(text) => setReturnForm({...returnForm, notes: text})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowReturnModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalSubmitButton, { backgroundColor: '#10b981' }]} 
                onPress={handleReturnAsset}
              >
                <ArrowLeftRight size={18} color="#ffffff" />
                <Text style={styles.modalSubmitText}>Return</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#f0f4ff',
  },
  tabText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContent: {
    flex: 1,
  },
  // Inventory Tab Styles
  inventoryContainer: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexGrow: 0,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 6,
    backgroundColor: '#f9fafb',
    gap: 3,
    height: 28,
  },
  activeCategoryChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4b5563',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  categoryCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeCategoryCount: {
    color: '#ffffff',
  },
  assetsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  assetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetIconContainer: {
    marginRight: 12,
  },
  assetIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  assetId: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  assetActions: {
    alignItems: 'flex-end',
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
  assetDetails: {
    gap: 6,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    width: 70,
  },
  detailValue: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  detailWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  serviceInfo: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    gap: 6,
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  serviceValue: {
    fontSize: 12,
    color: '#6b7280',
  },
  assetActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
  },
  assignButton: {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f4ff',
  },
  returnButton: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  maintenanceButton: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  // Maintenance Tab Styles
  maintenanceContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  maintenanceHeader: {
    marginBottom: 16,
  },
  maintenanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  maintenanceSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  maintenanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  overdueCard: {
    borderColor: '#fbbf24',
  },
  overdueLabel: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overdueText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  maintenanceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  maintenanceAssetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  maintenanceStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  maintenanceStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  maintenanceAssetId: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
  },
  maintenanceDetails: {
    gap: 8,
    marginBottom: 16,
  },
  maintenanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  maintenanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  maintenanceValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  maintenanceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scheduleButton: {
    flex: 1,
    backgroundColor: '#d97706',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  scheduleButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  completeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
  },
  completeButtonText: {
    color: '#10b981',
    fontWeight: '500',
  },
  // Assign/Return Tab Styles
  assignContainer: {
    flex: 1,
    padding: 20,
  },
  assignReturnContainer: {
    gap: 24,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  scanIcon: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  conditionSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  conditionChipActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  conditionChipText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  conditionChipTextActive: {
    color: '#ffffff',
  },
  assignActionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  assignActionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  returnActionButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  returnActionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // QR Scan Tab Styles
  qrScanContainer: {
    flex: 1,
    padding: 20,
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  scanFrame: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scanArea: {
    width: 250,
    height: 250,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  scanAreaBorder: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanInstruction: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  scanDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  startScanButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
    flexDirection: 'row',
    gap: 8,
  },
  startScanText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  qrFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: 500,
  },
  modalFormGroup: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  typeButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalSubmitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  assetInfoBox: {
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  assetInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  assetInfoSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
});