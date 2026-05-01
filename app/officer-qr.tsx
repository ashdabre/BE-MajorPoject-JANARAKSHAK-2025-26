import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { QrCode, MapPin, Clock, User, Shield, Flashlight, RotateCcw } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanHistory, setScanHistory] = useState([
    {
      id: 1,
      location: 'MG Road Checkpoint',
      time: '2024-01-15 14:30',
      officer: 'Inspector Kumar',
      status: 'verified'
    },
    {
      id: 2,
      location: 'Brigade Road Patrol Point',
      time: '2024-01-15 12:15',
      officer: 'Inspector Kumar',
      status: 'verified'
    }
  ]);

  const scanAnimation = useSharedValue(0);

  useEffect(() => {
    scanAnimation.value = withSequence(
      withTiming(1, { duration: 2000 }),
      withTiming(0, { duration: 2000 })
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanAnimation.value * 200 }],
  }));

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <QrCode size={64} color="#667eea" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan QR codes for location verification
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.permissionGradient}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!scanned) {
      setScanned(true);
      
      // Process QR code data
      const newScan = {
        id: Date.now(),
        location: 'Scanned Location',
        time: new Date().toLocaleString(),
        officer: 'Inspector Kumar',
        status: 'verified'
      };
      
      setScanHistory(prev => [newScan, ...prev]);
      
      Alert.alert(
        'QR Code Scanned Successfully',
        `Location verified: ${data}\nOfficer presence logged in system`,
        [
          { text: 'Scan Another', onPress: () => setScanned(false) },
          { text: 'Done', onPress: () => {} }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>QR Scanner</Text>
        <Text style={styles.subtitle}>Scan location QR codes for attendance</Text>
      </LinearGradient>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={styles.corner} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              <Animated.View style={[styles.scanLine, scanLineStyle]} />
            </View>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setFlashOn(!flashOn)}
              >
                <Flashlight size={24} color={flashOn ? "#fbbf24" : "#ffffff"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setScanned(false)}
              >
                <RotateCcw size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Scan History</Text>
        <View style={styles.historyList}>
          {scanHistory.map((scan) => (
            <View key={scan.id} style={styles.historyCard}>
              <View style={styles.historyIcon}>
                <QrCode size={20} color="#667eea" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyLocation}>{scan.location}</Text>
                <Text style={styles.historyTime}>{scan.time}</Text>
                <Text style={styles.historyOfficer}>Officer: {scan.officer}</Text>
              </View>
              <View style={styles.historyStatus}>
                <CheckCircle size={16} color="#10b981" />
              </View>
            </View>
          ))}
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
  cameraContainer: {
    height: 300,
    margin: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#ffffff',
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  infoTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyLocation: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  historyTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  historyOfficer: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginTop: 2,
  },
  historyStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  permissionGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});