'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCurrentUser, isAuthenticated, getUserRole } from '../../utils/auth';
import MapView from '../../components/MapView';

const EmergencyDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [hospitalLocations, setHospitalLocations] = useState([]);
  const [startLocation, setStartLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [routeStats, setRouteStats] = useState(null);
  
  useEffect(() => {
    // Check if user is authenticated and has emergency role
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    
    const currentUser = getCurrentUser();
    const userRole = getUserRole();
    
    if (userRole !== 'emergency' && userRole !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    setUser(currentUser);
    
    // Load mock incidents (in a real app, these would come from an API)
    const mockIncidents = [
      {
        id: 'incident1',
        type: 'accident',
        severity: 'major',
        location: { lat: 40.7282, lng: -73.9942 },
        address: '123 East Village St, New York, NY',
        description: 'Multi-vehicle collision, 3 injured',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
        status: 'active',
        verified: true,
        emergencyResponseNeeded: true
      },
      {
        id: 'incident2',
        type: 'accident',
        severity: 'critical',
        location: { lat: 40.7589, lng: -73.9851 },
        address: '456 Midtown Ave, New York, NY',
        description: 'Pedestrian struck by vehicle, critical condition',
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 mins ago
        status: 'active',
        verified: true,
        emergencyResponseNeeded: true
      },
      {
        id: 'incident3',
        type: 'congestion',
        severity: 'moderate',
        location: { lat: 40.7831, lng: -73.9712 },
        address: '789 Upper East Side Blvd, New York, NY',
        description: 'Heavy traffic due to construction',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        status: 'active',
        verified: true,
        emergencyResponseNeeded: false
      },
      {
        id: 'incident4',
        type: 'accident',
        severity: 'minor',
        location: { lat: 40.7105, lng: -74.0080 },
        address: '101 Financial District Rd, New York, NY',
        description: 'Fender bender, no injuries',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        status: 'resolved',
        verified: true,
        emergencyResponseNeeded: false
      }
    ];
    
    // Load mock hospital locations
    const mockHospitals = [
      {
        id: 'hospital1',
        name: 'Central Hospital',
        location: { lat: 40.7358, lng: -73.9911 },
        address: '100 Medical Center Blvd, New York, NY',
        capacity: 'High',
        specialties: ['Trauma', 'Emergency', 'Cardiac']
      },
      {
        id: 'hospital2',
        name: 'North Medical Center',
        location: { lat: 40.7889, lng: -73.9699 },
        address: '250 Healthcare Ave, New York, NY',
        capacity: 'Medium',
        specialties: ['Emergency', 'Burn Unit']
      },
      {
        id: 'hospital3',
        name: 'East Side Emergency',
        location: { lat: 40.7651, lng: -73.9599 },
        address: '350 Emergency Lane, New York, NY',
        capacity: 'Low',
        specialties: ['Emergency']
      }
    ];
    
    setIncidents(mockIncidents);
    setHospitalLocations(mockHospitals);
    setLoading(false);
  }, [router]);
  
  const calculateOptimizedRoute = (incident, destination) => {
    setCalculatingRoute(true);
    setOptimizedRoute(null);
    setRouteStats(null);
    
    // In a real app, this would make an API call to a route optimization service
    // Here we'll simulate an AI optimization with mock data
    
    setTimeout(() => {
      // Simulate different routes with varying traffic conditions
      // These points would come from a real routing API like Google Maps API or similar
      const mockRoutes = [
        // Direct route (might have traffic)
        {
          path: [
            incident.location,
            { lat: incident.location.lat - 0.01, lng: incident.location.lng + 0.01 },
            { lat: incident.location.lat - 0.02, lng: incident.location.lng + 0.015 },
            { lat: destination.location.lat + 0.01, lng: destination.location.lng - 0.01 },
            destination.location
          ],
          estimatedTime: 12, // minutes
          distance: 3.2, // miles
          trafficLevel: 'heavy',
          avoidedIncidents: 0
        },
        // Alternate route 1 (longer but less traffic)
        {
          path: [
            incident.location,
            { lat: incident.location.lat + 0.01, lng: incident.location.lng - 0.01 },
            { lat: incident.location.lat + 0.015, lng: incident.location.lng - 0.02 },
            { lat: incident.location.lat + 0.02, lng: destination.location.lng - 0.015 },
            { lat: destination.location.lat - 0.01, lng: destination.location.lng - 0.005 },
            destination.location
          ],
          estimatedTime: 14, // minutes
          distance: 3.8, // miles
          trafficLevel: 'light',
          avoidedIncidents: 1
        },
        // Alternate route 2 (emergency lanes available)
        {
          path: [
            incident.location,
            { lat: incident.location.lat - 0.005, lng: incident.location.lng + 0.02 },
            { lat: incident.location.lat + 0.01, lng: incident.location.lng + 0.025 },
            { lat: destination.location.lat + 0.015, lng: destination.location.lng + 0.01 },
            destination.location
          ],
          estimatedTime: 9, // minutes
          distance: 3.5, // miles
          trafficLevel: 'moderate',
          avoidedIncidents: 2,
          hasEmergencyLanes: true
        }
      ];
      
      // AI optimized selection (in a real app, this would be based on real-time data and predictions)
      // Choose the route with the lowest estimated time, preferring routes with emergency lanes
      const optimizedRoute = mockRoutes.sort((a, b) => {
        if (a.hasEmergencyLanes && !b.hasEmergencyLanes) return -1;
        if (!a.hasEmergencyLanes && b.hasEmergencyLanes) return 1;
        return a.estimatedTime - b.estimatedTime;
      })[0];
      
      setOptimizedRoute(optimizedRoute);
      setRouteStats({
        estimatedArrival: new Date(Date.now() + optimizedRoute.estimatedTime * 60000).toLocaleTimeString(),
        estimatedTime: optimizedRoute.estimatedTime,
        distance: optimizedRoute.distance,
        trafficLevel: optimizedRoute.trafficLevel,
        avoidedIncidents: optimizedRoute.avoidedIncidents
      });
      
      setCalculatingRoute(false);
    }, 2000); // Simulate calculation time
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-600';
      case 'major':
        return 'bg-red-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'minor':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getTrafficLevelColor = (level) => {
    switch (level) {
      case 'heavy':
        return 'text-red-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'light':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
    setOptimizedRoute(null);
    setRouteStats(null);
  };
  
  const handleGenerateRoute = (hospital) => {
    if (selectedIncident) {
      calculateOptimizedRoute(selectedIncident, hospital);
    }
  };
  
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-140px)]">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Prepare map markers for incidents
  const incidentMarkers = incidents.map(incident => ({
    id: incident.id,
    location: incident.location,
    type: incident.type,
    description: incident.description,
    level: incident.severity
  }));
  
  // Prepare hospital markers
  const hospitalMarkers = hospitalLocations.map(hospital => ({
    id: hospital.id,
    location: hospital.location,
    type: 'hospital',
    description: hospital.name
  }));
  
  // Combine all markers
  const allMarkers = [...incidentMarkers, ...hospitalMarkers];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Emergency Response Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          AI-powered route optimization for emergency vehicles
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Map Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="h-[500px] relative">
            <MapView 
              height="500px" 
              markers={allMarkers}
              showRoutes={optimizedRoute ? [
                {
                  path: optimizedRoute.path,
                  color: '#E53E3E', // Red color for emergency route
                  width: 5
                }
              ] : []}
            />
            
            {/* Route legend if route is shown */}
            {optimizedRoute && (
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 p-3 rounded-md shadow-md z-10">
                <h3 className="font-semibold text-sm mb-2">Emergency Route</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-1 bg-red-600 rounded"></div>
                  <span className="text-xs">Optimized Path</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Controls and Info Section */}
        <div>
          {/* Emergency Incidents */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Active Incidents</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {incidents
                .filter(incident => incident.status === 'active' && incident.emergencyResponseNeeded)
                .map(incident => (
                  <div 
                    key={incident.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedIncident?.id === incident.id 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800'
                    }`}
                    onClick={() => handleIncidentSelect(incident)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getSeverityColor(incident.severity)}`}></span>
                        <span className="font-medium capitalize">{incident.type} - {incident.severity}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimestamp(incident.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{incident.address}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{incident.description}</p>
                  </div>
                ))}
              
              {incidents.filter(incident => incident.status === 'active' && incident.emergencyResponseNeeded).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No active emergency incidents</p>
              )}
            </div>
          </div>
          
          {/* Hospital Selection */}
          {selectedIncident && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Select Destination</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Choose a hospital to generate an optimized route
              </p>
              
              <div className="space-y-2">
                {hospitalLocations.map(hospital => (
                  <button
                    key={hospital.id}
                    className="w-full p-3 text-left border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleGenerateRoute(hospital)}
                    disabled={calculatingRoute}
                  >
                    <div className="font-medium">{hospital.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{hospital.address}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Capacity: <span className={hospital.capacity === 'High' ? 'text-green-500' : hospital.capacity === 'Medium' ? 'text-yellow-500' : 'text-red-500'}>{hospital.capacity}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Route Information */}
          {calculatingRoute && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 animate-pulse">
              <div className="flex justify-center items-center py-4">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                <p className="text-gray-700 dark:text-gray-300">AI calculating optimal route...</p>
              </div>
            </div>
          )}
          
          {routeStats && (
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Optimized Route
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Estimated arrival:</span>
                  <span className="text-sm font-medium">{routeStats.estimatedArrival}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Travel time:</span>
                  <span className="text-sm font-medium">{routeStats.estimatedTime} minutes</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Distance:</span>
                  <span className="text-sm font-medium">{routeStats.distance} miles</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Traffic:</span>
                  <span className={`text-sm font-medium ${getTrafficLevelColor(routeStats.trafficLevel)} capitalize`}>
                    {routeStats.trafficLevel}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Incidents avoided:</span>
                  <span className="text-sm font-medium">{routeStats.avoidedIncidents}</span>
                </div>
                
                {optimizedRoute?.hasEmergencyLanes && (
                  <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs text-blue-600 dark:text-blue-300">
                    This route includes dedicated emergency lanes
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">AI Route Analysis</div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    This route was optimized based on real-time traffic data, incident reports, and historical emergency response patterns.
                    {routeStats.avoidedIncidents > 0 && ` ${routeStats.avoidedIncidents} traffic incidents were automatically avoided.`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Emergency Stats and Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Response Status</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold text-red-600">4m 12s</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 ml-2 mb-1">avg. response time</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Target: 5m 00s</span>
              <span>85% of target achieved</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Active Units</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold text-blue-600">8/12</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 ml-2 mb-1">ambulances deployed</div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-md ${i < 8 ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-700'} 
                  flex items-center justify-center text-xs`}
              >
                {i < 8 ? (
                  <span className="font-medium">{`A${i + 1}`}</span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">{`A${i + 1}`}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Incident Breakdown</div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Accidents</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Medical</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Fire</span>
                <span className="font-medium">12%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">About AI Route Optimization</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            The emergency route optimization system uses AI to analyze real-time traffic data, incident reports, and historical patterns to generate the fastest and safest routes for emergency vehicles.
          </p>
          <h3>Key Features:</h3>
          <ul>
            <li><strong>Real-time Traffic Integration:</strong> Uses live traffic data to avoid congestion.</li>
            <li><strong>Incident Avoidance:</strong> Automatically routes around accidents and roadblocks.</li>
            <li><strong>Emergency Lane Detection:</strong> Identifies routes with dedicated emergency vehicle lanes.</li>
            <li><strong>Hospital Capacity Awareness:</strong> Considers hospital capacity in routing decisions.</li>
            <li><strong>Predictive Analysis:</strong> Uses historical data to predict traffic patterns.</li>
          </ul>
          <p>
            The system continuously learns from each emergency response to improve future routing decisions, adapting to changing traffic conditions and infrastructure changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard; 