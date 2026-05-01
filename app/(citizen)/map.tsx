import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, TriangleAlert as AlertTriangle, Shield, Navigation, Filter, Layers, Search, RefreshCw, Clock, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'heatmap' | 'incidents' | 'patrol'>('heatmap');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [showPoliceStations, setShowPoliceStations] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [routeSearchResult, setRouteSearchResult] = useState<any>(null);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filters = [
    { id: 'all', label: 'All Areas', color: '#6b7280', count: 156 },
    { id: 'high', label: 'High Risk', color: '#ef4444', count: 23 },
    { id: 'medium', label: 'Medium Risk', color: '#f59e0b', count: 67 },
    { id: 'low', label: 'Low Risk', color: '#10b981', count: 66 },
  ];

  const incidents = [
    { 
      id: 1, 
      type: 'Theft', 
      location: 'MG Road, Sector 14', 
      time: '2 hours ago', 
      severity: 'high',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      description: 'Mobile phone theft reported near metro station'
    },
    { 
      id: 2, 
      type: 'Accident', 
      location: 'Brigade Road Junction', 
      time: '4 hours ago', 
      severity: 'medium',
      coordinates: { lat: 28.4615, lng: 77.0285 },
      description: 'Minor vehicle collision, no injuries reported'
    },
    { 
      id: 3, 
      type: 'Harassment', 
      location: 'Koramangala 5th Block', 
      time: '6 hours ago', 
      severity: 'low',
      coordinates: { lat: 28.4635, lng: 77.0305 },
      description: 'Verbal harassment complaint filed'
    },
    { 
      id: 4, 
      type: 'Vandalism', 
      location: 'Whitefield Main Road', 
      time: '8 hours ago', 
      severity: 'medium',
      coordinates: { lat: 28.4655, lng: 77.0325 },
      description: 'Property damage to public infrastructure'
    },
  ];

  const safeRoutes = [
    { 
      id: 1, 
      from: 'Home', 
      to: 'Office', 
      time: '25 min', 
      safety: 'High',
      distance: '12.5 km',
      crimeIndex: 0.2
    },
    { 
      id: 2, 
      from: 'Home', 
      to: 'Shopping Mall', 
      time: '15 min', 
      safety: 'Medium',
      distance: '8.3 km',
      crimeIndex: 0.4
    },
    { 
      id: 3, 
      from: 'Office', 
      to: 'Restaurant', 
      time: '12 min', 
      safety: 'High',
      distance: '5.7 km',
      crimeIndex: 0.1
    },
  ];

  const patrolUnits = [
    { id: 'P001', location: 'Sector 5', status: 'Active', lastUpdate: '2 min ago' },
    { id: 'P002', location: 'MG Road', status: 'Responding', lastUpdate: '5 min ago' },
    { id: 'P003', location: 'Brigade Road', status: 'Patrol', lastUpdate: '1 min ago' },
  ];

  const policeStations = [
    { id: 'PS1', name: 'Central Police Station', lat: 28.4575, lng: 77.0246 },
    { id: 'PS2', name: 'MG Road Police Post', lat: 28.4625, lng: 77.0295 },
    { id: 'PS3', name: 'Brigade Road Station', lat: 28.4645, lng: 77.0315 },
    { id: 'PS4', name: 'Koramangala Police', lat: 28.4665, lng: 77.0335 },
  ];

  const crimeHotspots = [
    { area: 'MG Road', riskLevel: 'High', incidents: 28, trend: 'up' },
    { area: 'Brigade Road', riskLevel: 'Medium', incidents: 19, trend: 'down' },
    { area: 'Koramangala', riskLevel: 'Medium', incidents: 15, trend: 'stable' },
    { area: 'Whitefield', riskLevel: 'Low', incidents: 8, trend: 'down' },
  ];

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRouteSelect = (routeId: number) => {
    setSelectedRoute(routeId);
    setSelectedIncident(null);
    setShowPoliceStations(false);
  };

  const handleIncidentSelect = (incidentId: number) => {
    setSelectedIncident(incidentId);
    setSelectedRoute(null);
    setShowPoliceStations(false);
  };

  const handlePatrolView = () => {
    setShowPoliceStations(true);
    setSelectedRoute(null);
    setSelectedIncident(null);
  };

  const handleSearchRoute = () => {
    if (searchFrom && searchTo) {
      const safetyScore = Math.random();
      const isSafe = safetyScore > 0.6;
      setRouteSearchResult({
        from: searchFrom,
        to: searchTo,
        safe: isSafe,
        safetyScore: safetyScore,
        distance: `${(Math.random() * 15 + 3).toFixed(1)} km`,
        time: `${Math.floor(Math.random() * 30 + 10)} min`,
        crimeIndex: 1 - safetyScore,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>SafeRoute Navigator</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setSearchVisible(!searchVisible)}
            >
              <Search size={20} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <RefreshCw size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>AI-powered crime intelligence & safe route planning</Text>
      </View>

      {searchVisible && (
        <View style={styles.searchPanel}>
          <View style={styles.searchHeader}>
            <Text style={styles.searchTitle}>Route Safety Check</Text>
            <TouchableOpacity onPress={() => {
              setSearchVisible(false);
              setRouteSearchResult(null);
            }}>
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchInputs}>
            <View style={styles.inputContainer}>
              <MapPin size={16} color="#10b981" />
              <TextInput
                style={styles.searchInput}
                placeholder="Starting location"
                placeholderTextColor="#9ca3af"
                value={searchFrom}
                onChangeText={setSearchFrom}
              />
            </View>
            <View style={styles.inputContainer}>
              <MapPin size={16} color="#ef4444" />
              <TextInput
                style={styles.searchInput}
                placeholder="Destination"
                placeholderTextColor="#9ca3af"
                value={searchTo}
                onChangeText={setSearchTo}
              />
            </View>
          </View>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearchRoute}
          >
            <Text style={styles.searchButtonText}>Analyze Route Safety</Text>
          </TouchableOpacity>
          
          {routeSearchResult && (
            <View style={[
              styles.routeResult,
              { backgroundColor: routeSearchResult.safe ? '#f0fdf4' : '#fef2f2' }
            ]}>
              <View style={styles.routeResultHeader}>
                <Shield size={20} color={routeSearchResult.safe ? '#10b981' : '#ef4444'} />
                <Text style={[
                  styles.routeResultTitle,
                  { color: routeSearchResult.safe ? '#10b981' : '#ef4444' }
                ]}>
                  {routeSearchResult.safe ? 'Safe Route' : 'Caution Advised'}
                </Text>
              </View>
              <Text style={styles.routeResultInfo}>
                {routeSearchResult.distance} • {routeSearchResult.time}
              </Text>
              <View style={styles.safetyScoreContainer}>
                <Text style={styles.safetyScoreLabel}>Safety Score:</Text>
                <View style={styles.safetyScoreBar}>
                  <View style={[
                    styles.safetyScoreFill,
                    { 
                      width: `${routeSearchResult.safetyScore * 100}%`,
                      backgroundColor: routeSearchResult.safe ? '#10b981' : '#ef4444'
                    }
                  ]} />
                </View>
                <Text style={styles.safetyScoreValue}>
                  {(routeSearchResult.safetyScore * 100).toFixed(0)}%
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'heatmap' && styles.activeModeButton]}
          onPress={() => setViewMode('heatmap')}
        >
          <Layers size={18} color={viewMode === 'heatmap' ? '#3b82f6' : '#9ca3af'} />
          <Text style={[styles.modeText, viewMode === 'heatmap' && styles.activeModeText]}>
            Heatmap
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'incidents' && styles.activeModeButton]}
          onPress={() => setViewMode('incidents')}
        >
          <AlertTriangle size={18} color={viewMode === 'incidents' ? '#3b82f6' : '#9ca3af'} />
          <Text style={[styles.modeText, viewMode === 'incidents' && styles.activeModeText]}>
            Incidents
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'patrol' && styles.activeModeButton]}
          onPress={() => {
            setViewMode('patrol');
            handlePatrolView();
          }}
        >
          <Shield size={18} color={viewMode === 'patrol' ? '#3b82f6' : '#9ca3af'} />
          <Text style={[styles.modeText, viewMode === 'patrol' && styles.activeModeText]}>
            Patrol
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.selectedFilter,
              { borderColor: filter.color }
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <View style={[styles.filterDot, { backgroundColor: filter.color }]} />
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.selectedFilterText
            ]}>
              {filter.label}
            </Text>
            <Text style={[
              styles.filterCount,
              selectedFilter === filter.id && styles.selectedFilterCount
            ]}>
              {filter.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.mapContainer}>
        {!mapLoaded ? (
          <View style={styles.mapLoading}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Loading Crime Intelligence Map...</Text>
            <Text style={styles.loadingSubtext}>Fetching real-time data from NCRB database</Text>
          </View>
        ) : (
          <View style={styles.mapContent}>
            {/* Google Maps Style Background */}
            <Image 
              source={{ uri: 'https://storage.googleapis.com/support-forums-api/attachment/thread-314421957-14650804773928753513.png' }}
              style={[styles.mapBackground, { transform: [{ scale: zoomLevel }] }]}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <View style={styles.mapControls}>
                <TouchableOpacity 
                  style={styles.mapControl}
                  onPress={handleZoomIn}
                >
                  <Text style={styles.mapControlText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.mapControl}
                  onPress={handleZoomOut}
                >
                  <Text style={styles.mapControlText}>-</Text>
                </TouchableOpacity>
              </View>
              
              {/* Crime Danger Zones (Always visible in heatmap mode or when zoomed) */}
              {(viewMode === 'heatmap' || zoomLevel > 1.2) && (
                <>
                  <View style={[styles.dangerZone, styles.highDangerZone, { top: '25%', left: '35%' }]} />
                  <View style={[styles.dangerZone, styles.mediumDangerZone, { top: '55%', left: '65%' }]} />
                  <View style={[styles.dangerZone, styles.lowDangerZone, { top: '40%', left: '20%' }]} />
                </>
              )}
              
              {/* Crime Markers */}
              {(viewMode === 'incidents' || selectedIncident) && incidents.map((incident) => (
                <TouchableOpacity
                  key={incident.id}
                  style={[
                    styles.crimeMarker,
                    incident.severity === 'high' ? styles.highRiskMarker :
                    incident.severity === 'medium' ? styles.mediumRiskMarker : styles.lowRiskMarker,
                    { 
                      top: `${30 + incident.id * 10}%`, 
                      left: `${35 + incident.id * 12}%`,
                      opacity: selectedIncident === incident.id ? 1 : 0.8,
                      transform: selectedIncident === incident.id ? [{ scale: 1.3 }] : [{ scale: 1 }]
                    }
                  ]}
                  onPress={() => handleIncidentSelect(incident.id)}
                >
                  <AlertTriangle size={selectedIncident === incident.id ? 20 : 16} color="#ffffff" />
                </TouchableOpacity>
              ))}

              {/* Selected Route Path */}
              {selectedRoute && (
                <>
                  <View style={[styles.routePath, { top: '48%', left: '30%', width: '35%' }]} />
                  <View style={[styles.routePath, { top: '40%', left: '50%', width: '25%', transform: [{ rotate: '45deg' }] }]} />
                  <View style={[styles.routeMarker, styles.startMarker, { top: '50%', left: '30%' }]}>
                    <MapPin size={16} color="#ffffff" />
                  </View>
                  <View style={[styles.routeMarker, styles.endMarker, { top: '35%', left: '65%' }]}>
                    <MapPin size={16} color="#ffffff" />
                  </View>
                </>
              )}

              {/* Route Search Result on Map */}
              {routeSearchResult && (
                <>
                  <View style={[
                    styles.routePath, 
                    { 
                      top: '45%', 
                      left: '25%', 
                      width: '40%',
                      backgroundColor: routeSearchResult.safe ? '#10b981' : '#f59e0b'
                    }
                  ]} />
                  <View style={[styles.routeMarker, styles.startMarker, { top: '47%', left: '25%' }]}>
                    <MapPin size={16} color="#ffffff" />
                  </View>
                  <View style={[styles.routeMarker, styles.endMarker, { top: '42%', left: '62%' }]}>
                    <MapPin size={16} color="#ffffff" />
                  </View>
                </>
              )}

              {/* Police Stations */}
              {showPoliceStations && policeStations.map((station, index) => (
                <View
                  key={station.id}
                  style={[
                    styles.policeStation,
                    { 
                      top: `${28 + index * 15}%`, 
                      left: `${30 + index * 15}%`
                    }
                  ]}
                >
                  <Shield size={18} color="#3b82f6" />
                </View>
              ))}
              
              {/* User Location */}
              <View style={[styles.userLocation, { top: '50%', left: '50%' }]}>
                <View style={styles.userLocationPulse} />
                <View style={styles.userLocationDot} />
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {viewMode === 'heatmap' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Crime Hotspots Analysis</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.hotspotsList}>
              {crimeHotspots.map((hotspot, index) => (
                <View key={index} style={styles.hotspotCard}>
                  <View style={styles.hotspotHeader}>
                    <View style={styles.hotspotInfo}>
                      <Text style={styles.hotspotArea}>{hotspot.area}</Text>
                      <Text style={styles.hotspotIncidents}>{hotspot.incidents} incidents this month</Text>
                    </View>
                    <View style={styles.hotspotMeta}>
                      <View style={[
                        styles.riskBadge,
                        { backgroundColor: hotspot.riskLevel === 'High' ? '#ef4444' : hotspot.riskLevel === 'Medium' ? '#f59e0b' : '#10b981' }
                      ]}>
                        <Text style={styles.riskText}>{hotspot.riskLevel}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.trendContainer}>
                    <Text style={styles.trendLabel}>Trend: </Text>
                    <Text style={[
                      styles.trendValue,
                      { color: hotspot.trend === 'up' ? '#ef4444' : hotspot.trend === 'down' ? '#10b981' : '#6b7280' }
                    ]}>
                      {hotspot.trend === 'up' ? '↗ Increasing' : hotspot.trend === 'down' ? '↘ Decreasing' : '→ Stable'}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.safeRoutesSection}>
              <Text style={styles.sectionTitle}>Recommended Safe Routes</Text>
              <ScrollView style={styles.routesList}>
                {safeRoutes.map((route) => (
                  <TouchableOpacity
                    key={route.id}
                    onPress={() => handleRouteSelect(route.id)}
                  >
                    <View style={[
                      styles.routeCard,
                      selectedRoute === route.id && styles.selectedRouteCard
                    ]}>
                      <View style={styles.routeHeader}>
                        <View style={styles.routeInfo}>
                          <Text style={styles.routeTitle}>{route.from} → {route.to}</Text>
                          <Text style={styles.routeDetails}>{route.distance} • {route.time}</Text>
                        </View>
                        <View style={styles.routeActions}>
                          <View style={[
                            styles.safetyBadge,
                            { backgroundColor: route.safety === 'High' ? '#10b981' : '#f59e0b' }
                          ]}>
                            <Text style={styles.safetyText}>{route.safety}</Text>
                          </View>
                          <TouchableOpacity style={styles.navigateButton}>
                            <Navigation size={16} color="#3b82f6" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.crimeIndexContainer}>
                        <Text style={styles.crimeIndexLabel}>Crime Index: </Text>
                        <View style={styles.crimeIndexBar}>
                          <View style={[
                            styles.crimeIndexFill,
                            { 
                              width: `${route.crimeIndex * 100}%`,
                              backgroundColor: route.crimeIndex < 0.3 ? '#10b981' : route.crimeIndex < 0.6 ? '#f59e0b' : '#ef4444'
                            }
                          ]} />
                        </View>
                        <Text style={styles.crimeIndexValue}>{(route.crimeIndex * 100).toFixed(0)}%</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        ) : viewMode === 'incidents' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Crime Incidents</Text>
            <ScrollView style={styles.incidentsList}>
              {incidents.map((incident) => (
                <TouchableOpacity
                  key={incident.id}
                  onPress={() => handleIncidentSelect(incident.id)}
                >
                  <View style={[
                    styles.incidentCard,
                    selectedIncident === incident.id && styles.selectedIncidentCard
                  ]}>
                    <View style={styles.incidentHeader}>
                      <View style={styles.incidentInfo}>
                        <Text style={styles.incidentType}>{incident.type}</Text>
                        <Text style={styles.incidentLocation}>{incident.location}</Text>
                        <Text style={styles.incidentDescription}>{incident.description}</Text>
                      </View>
                      <View style={styles.incidentMeta}>
                        <View style={[
                          styles.severityBadge,
                          {
                            backgroundColor: incident.severity === 'high' ? '#ef4444' :
                                           incident.severity === 'medium' ? '#f59e0b' : '#10b981'
                          }
                        ]}>
                          <Text style={styles.severityText}>
                            {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                          </Text>
                        </View>
                        <Text style={styles.incidentTime}>{incident.time}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Patrol Units</Text>
            <ScrollView style={styles.patrolList}>
              {patrolUnits.map((unit) => (
                <View key={unit.id} style={styles.patrolCard}>
                  <View style={styles.patrolHeader}>
                    <View style={styles.patrolIcon}>
                      <Shield size={20} color="#3b82f6" />
                    </View>
                    <View style={styles.patrolInfo}>
                      <Text style={styles.patrolId}>Unit {unit.id}</Text>
                      <Text style={styles.patrolLocation}>{unit.location}</Text>
                    </View>
                    <View style={styles.patrolStatus}>
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: unit.status === 'Active' ? '#10b981' : unit.status === 'Responding' ? '#f59e0b' : '#3b82f6' }
                      ]} />
                      <Text style={styles.statusText}>{unit.status}</Text>
                    </View>
                  </View>
                  <View style={styles.patrolFooter}>
                    <Clock size={12} color="#9ca3af" />
                    <Text style={styles.lastUpdate}>Last update: {unit.lastUpdate}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  searchPanel: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
  },
  searchInputs: {
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#0f172a',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  routeResult: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  routeResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  routeResultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  routeResultInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 12,
  },
  safetyScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  safetyScoreLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  safetyScoreBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  safetyScoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  safetyScoreValue: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    gap: 6,
  },
  activeModeButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  modeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  activeModeText: {
    color: '#3b82f6',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 10,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  selectedFilter: {
    backgroundColor: '#eff6ff',
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  selectedFilterText: {
    color: '#3b82f6',
  },
  filterCount: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#94a3b8',
  },
  selectedFilterCount: {
    color: '#3b82f6',
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  mapLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#e2e8f0',
    borderTopColor: '#3b82f6',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  loadingSubtext: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  mapContent: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 10,
  },
  mapControl: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mapControlText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#3b82f6',
  },
  dangerZone: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
  },
  highDangerZone: {
    backgroundColor: '#ef4444',
  },
  mediumDangerZone: {
    backgroundColor: '#f59e0b',
  },
  lowDangerZone: {
    backgroundColor: '#10b981',
  },
  crimeMarker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  highRiskMarker: {
    backgroundColor: '#ef4444',
  },
  mediumRiskMarker: {
    backgroundColor: '#f59e0b',
  },
  lowRiskMarker: {
    backgroundColor: '#10b981',
  },
  routePath: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  routeMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  startMarker: {
    backgroundColor: '#10b981',
  },
  endMarker: {
    backgroundColor: '#ef4444',
  },
  policeStation: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userLocation: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    opacity: 0.3,
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
  },
  viewAllButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#3b82f6',
  },
  hotspotsList: {
    maxHeight: 200,
  },
  hotspotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hotspotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hotspotInfo: {
    flex: 1,
  },
  hotspotArea: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
  },
  hotspotIncidents: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  hotspotMeta: {
    alignItems: 'flex-end',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  trendValue: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  safeRoutesSection: {
    marginTop: 24,
  },
  routesList: {
    maxHeight: 200,
  },
  routeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedRouteCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
    backgroundColor: '#eff6ff',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
  },
  routeDetails: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  routeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  safetyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  safetyText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  navigateButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  crimeIndexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crimeIndexLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  crimeIndexBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  crimeIndexFill: {
    height: '100%',
    borderRadius: 3,
  },
  crimeIndexValue: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
  },
  incidentsList: {
    maxHeight: 300,
  },
  incidentCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedIncidentCard: {
    borderColor: '#ef4444',
    borderWidth: 2,
    backgroundColor: '#fef2f2',
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  incidentInfo: {
    flex: 1,
    marginRight: 12,
  },
  incidentType: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
  },
  incidentLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  incidentDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 18,
  },
  incidentMeta: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 6,
  },
  severityText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  incidentTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  patrolList: {
    maxHeight: 300,
  },
  patrolCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  patrolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  patrolIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  patrolInfo: {
    flex: 1,
  },
  patrolId: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
  },
  patrolLocation: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  patrolStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#0f172a',
  },
  patrolFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastUpdate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
});
//     fontSize: 13,
//     fontFamily: 'Inter-Medium',
//     color: '#64748b',
//   },
//   safetyScoreBar: {
//     flex: 1,
//     height: 6,
//     backgroundColor: '#e2e8f0',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   safetyScoreFill: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   safetyScoreValue: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#0f172a',
//   },
//   modeToggle: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modeButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     marginHorizontal: 4,
//     gap: 6,
//   },
//   activeModeButton: {
//     backgroundColor: '#eff6ff',
//     borderWidth: 1,
//     borderColor: '#bfdbfe',
//   },
//   modeText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#9ca3af',
//   },
//   activeModeText: {
//     color: '#3b82f6',
//   },
//   filterContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   filterChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     marginRight: 10,
//     backgroundColor: '#ffffff',
//     gap: 6,
//   },
//   selectedFilter: {
//     backgroundColor: '#eff6ff',
//   },
//   filterDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   filterText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Medium',
//     color: '#64748b',
//   },
//   selectedFilterText: {
//     color: '#3b82f6',
//   },
//   filterCount: {
//     fontSize: 11,
//     fontFamily: 'Inter-Bold',
//     color: '#94a3b8',
//   },
//   selectedFilterCount: {
//     color: '#3b82f6',
//   },
//   mapContainer: {
//     height: 300,
//     backgroundColor: '#f8fafc',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },
//   mapLoading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8fafc',
//   },
//   loadingSpinner: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 3,
//     borderColor: '#e2e8f0',
//     borderTopColor: '#3b82f6',
//     marginBottom: 16,
//   },
//   loadingText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#0f172a',
//     marginBottom: 4,
//   },
//   loadingSubtext: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//   },
//   mapContent: {
//     flex: 1,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   mapBackground: {
//     width: '100%',
//     height: '100%',
//   },
//   mapOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   mapControls: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     gap: 10,
//   },
//   mapControl: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   mapControlText: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: '#3b82f6',
//   },
//   dangerZone: {
//     position: 'absolute',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     opacity: 0.3,
//   },
//   highDangerZone: {
//     backgroundColor: '#ef4444',
//   },
//   mediumDangerZone: {
//     backgroundColor: '#f59e0b',
//   },
//   lowDangerZone: {
//     backgroundColor: '#10b981',
//   },
//   crimeMarker: {
//     position: 'absolute',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   highRiskMarker: {
//     backgroundColor: '#ef4444',
//   },
//   mediumRiskMarker: {
//     backgroundColor: '#f59e0b',
//   },
//   lowRiskMarker: {
//     backgroundColor: '#10b981',
//   },
//   routePath: {
//     position: 'absolute',
//     height: 4,
//     backgroundColor: '#3b82f6',
//     borderRadius: 2,
//   },
//   routeMarker: {
//     position: 'absolute',
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   startMarker: {
//     backgroundColor: '#10b981',
//   },
//   endMarker: {
//     backgroundColor: '#ef4444',
//   },
//   policeStation: {
//     position: 'absolute',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#3b82f6',
//     shadowColor: '#3b82f6',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   userLocation: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   userLocationPulse: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#3b82f6',
//     opacity: 0.3,
//   },
//   userLocationDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#3b82f6',
//     borderWidth: 2,
//     borderColor: '#ffffff',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   section: {
//     paddingVertical: 20,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: '#0f172a',
//   },
//   viewAllButton: {
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 12,
//     backgroundColor: '#eff6ff',
//     borderWidth: 1,
//     borderColor: '#bfdbfe',
//   },
//   viewAllText: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     color: '#3b82f6',
//   },
//   hotspotsList: {
//     maxHeight: 200,
//   },
//   hotspotCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 18,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   hotspotHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   hotspotInfo: {
//     flex: 1,
//   },
//   hotspotArea: {
//     fontSize: 17,
//     fontFamily: 'Inter-SemiBold',
//     color: '#0f172a',
//   },
//   hotspotIncidents: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     marginTop: 2,
//   },
//   hotspotMeta: {
//     alignItems: 'flex-end',
//   },
//   riskBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },
//   riskText: {
//     fontSize: 11,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//     letterSpacing: 0.5,
//   },
//   trendContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   trendLabel: {
//     fontSize: 13,
//     fontFamily: 'Inter-Medium',
//     color: '#64748b',
//   },
//   trendValue: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//   },
//   safeRoutesSection: {
//     marginTop: 24,
//   },
//   routesList: {
//     maxHeight: 200,
//   },
//   routeCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 18,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   selectedRouteCard: {
//     borderColor: '#3b82f6',
//     borderWidth: 2,
//     backgroundColor: '#eff6ff',
//   },
//   routeHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 14,
//   },
//   routeInfo: {
//     flex: 1,
//   },
//   routeTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#0f172a',
//   },
//   routeDetails: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     marginTop: 4,
//   },
//   routeActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   safetyBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },
//   safetyText: {
//     fontSize: 11,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//     letterSpacing: 0.5,
//   },
//   navigateButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#eff6ff',
//   },
//   crimeIndexContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   crimeIndexLabel: {
//     fontSize: 13,
//     fontFamily: 'Inter-Medium',
//     color: '#64748b',
//   },
//   crimeIndexBar: {
//     flex: 1,
//     height: 6,
//     backgroundColor: '#f1f5f9',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   crimeIndexFill: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   crimeIndexValue: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#0f172a',
//   },
//   incidentsList: {
//     maxHeight: 300,
//   },
//   incidentCard: {
//     backgroundColor: '#ffffff',
//     padding: 18,
//     borderRadius: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   selectedIncidentCard: {
//     borderColor: '#ef4444',
//     borderWidth: 2,
//     backgroundColor: '#fef2f2',
//   },
//   incidentHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   incidentInfo: {
//     flex: 1,
//     marginRight: 12,
//   },
//   incidentType: {
//     fontSize: 17,
//     fontFamily: 'Inter-SemiBold',
//     color: '#0f172a',
//   },
//   incidentLocation: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     marginTop: 4,
//   },
//   incidentDescription: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#94a3b8',
//     marginTop: 6,
//     lineHeight: 18,
//   },
//   incidentMeta: {
//     alignItems: 'flex-end',
//   },
//   severityBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//     marginBottom: 6,
//   },
//   severityText: {
//     fontSize: 11,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//     letterSpacing: 0.5,
//   },
//   incidentTime: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: '#94a3b8',
//   },
//   patrolList: {
//     maxHeight: 300,
//   },
//   patrolCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 18,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   patrolHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   patrolIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#eff6ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//     borderWidth: 1,
//     borderColor: '#bfdbfe',
//   },
//   patrolInfo: {
//     flex: 1,
//   },
//   patrolId: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#0f172a',
//   },
//   patrolLocation: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#64748b',
//     marginTop: 2,
//   },
//   patrolStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   statusIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   statusText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Medium',
//     color: '#0f172a',
//   },
//   patrolFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   lastUpdate: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: '#94a3b8',
//   },
// });