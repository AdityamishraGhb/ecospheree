'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCurrentUser, isAuthenticated } from '../../utils/auth';
import { trafficData, challenges, aiSuggestions } from '../../utils/mockData';
import StatsCard from '../../components/StatsCard';
import MapView from '../../components/MapView';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import ChallengeCard from '../../components/ChallengeCard';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [emergencyRoute, setEmergencyRoute] = useState(null);
  const [vehicleType, setVehicleType] = useState('ambulance');
  const [showNotification, setShowNotification] = useState(false);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    
    // Get current user
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Get random subset of AI suggestions
    const randomSuggestions = aiSuggestions
      ? [...aiSuggestions].sort(() => 0.5 - Math.random()).slice(0, 3)
      : [];
    
    setUserSuggestions(randomSuggestions);
    setLoading(false);
  }, [router]);
  
  // Function to calculate emergency route
  const calculateEmergencyRoute = () => {
    setCalculatingRoute(true);
    setEmergencyRoute(null);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Get nearest incident to simulate starting point (hospital or station)
      const startPoint = { lat: 40.7128, lng: -74.0060 }; // Default NYC
      
      // Find nearest critical incident based on vehicle type
      const incidents = trafficData.incidents || [];
      const criticalIncidents = incidents.filter(inc => 
        (vehicleType === 'ambulance' && inc.type === 'accident') || 
        (vehicleType === 'fire' && inc.type === 'fire')
      );
      
      // If no matching incidents, use any incident
      const targetIncident = criticalIncidents.length > 0 
        ? criticalIncidents[0] 
        : incidents.length > 0 ? incidents[0] : null;
      
      if (targetIncident) {
        // Generate a sample route with some waypoints
        const route = {
          path: [
            startPoint,
            { lat: startPoint.lat + 0.01, lng: startPoint.lng + 0.01 },
            { lat: startPoint.lat + 0.02, lng: startPoint.lng - 0.01 },
            { lat: startPoint.lat + 0.01, lng: targetIncident.location.lng - 0.01 },
            targetIncident.location
          ],
          color: vehicleType === 'ambulance' ? '#e53e3e' : '#ed8936', // Red for ambulance, orange for fire
          width: 5,
          dashArray: '10, 10' // Create a dashed line for visibility
        };
        
        setEmergencyRoute(route);
        setShowNotification(true);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
      
      setCalculatingRoute(false);
    }, 1500); // 1.5 seconds to simulate calculation
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-140px)]">
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Here's your eco-friendly mobility dashboard for today.
            </p>
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <StatsCard
            title="Eco Points"
            value={user.ecoPoints}
            description="Your current eco-friendly points balance"
            icon={
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            change={7}
            delay={0}
          />
          
          <StatsCard
            title="Current Streak"
            value={`${user.streak} days`}
            description="Your eco-friendly commuting streak"
            icon={
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            change={15}
            delay={1}
          />
          
          <StatsCard
            title="CO2 Saved"
            value="32.4 kg"
            description="CO2 emissions saved this month"
            icon={
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            change={22}
            delay={2}
          />
          
          <StatsCard
            title="Leaderboard Rank"
            value={`#${user.id + 4}`}
            description="Your position on the eco leaderboard"
            icon={
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            change={-1}
            delay={3}
          />
        </motion.div>
        
        {/* Map and Traffic Section */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Live Traffic Map</CardTitle>
              <div className="flex items-center space-x-2">
                <select 
                  className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="ambulance">Ambulance</option>
                  <option value="fire">Fire Brigade</option>
                </select>
                <button
                  className={`px-3 py-1 text-sm font-medium rounded-md shadow-sm ${
                    calculatingRoute
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : vehicleType === 'ambulance'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                  onClick={calculateEmergencyRoute}
                  disabled={calculatingRoute}
                >
                  {calculatingRoute ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </span>
                  ) : (
                    <>Emergency Route</>
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <MapView 
                height="400px" 
                showHeatmap={true}
                markers={trafficData.incidents || []}
                showRoutes={emergencyRoute ? [emergencyRoute] : []}
              />
              
              {/* Notification */}
              {showNotification && (
                <motion.div 
                  className={`absolute top-4 right-4 px-4 py-2 rounded-md shadow-lg ${
                    vehicleType === 'ambulance' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-orange-500 text-white'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm font-medium">
                    Optimized route loaded for {vehicleType === 'ambulance' ? 'Ambulance' : 'Fire Brigade'}
                  </p>
                </motion.div>
              )}
              
              {/* Route Legend */}
              {emergencyRoute && (
                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 p-3 rounded-md shadow-md z-10">
                  <h3 className="font-semibold text-sm mb-2">Emergency Route</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-1 rounded ${vehicleType === 'ambulance' ? 'bg-red-600' : 'bg-orange-500'}`}></div>
                    <span className="text-xs">{vehicleType === 'ambulance' ? 'Ambulance' : 'Fire Brigade'} Path</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Traffic Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</h3>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-semibold">{trafficData.status || 'Unknown'}</span>
                    <span className="text-sm text-gray-500">
                      Updated {new Date(trafficData.lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Public Transport</h3>
                  <div className="mt-2 space-y-3">
                    {trafficData.publicTransport?.buses?.slice?.(0, 1)?.map?.((bus, index) => (
                      <div key={`bus-${index}`} className="border-l-2 border-blue-500 pl-3">
                        <p className="text-sm font-medium flex justify-between">
                          <span>Bus {bus.line}</span>
                          <span className="text-gray-500">{bus.status}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Next at Central Station: {new Date(bus.nextArrivals?.[0]?.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )) || (
                      <div className="border-l-2 border-blue-500 pl-3">
                        <p className="text-sm font-medium">Bus Service</p>
                        <p className="text-xs text-gray-500">Data unavailable</p>
                      </div>
                    )}
                    
                    {trafficData.publicTransport?.trains?.slice?.(0, 1)?.map?.((train, index) => (
                      <div key={`train-${index}`} className="border-l-2 border-green-500 pl-3">
                        <p className="text-sm font-medium flex justify-between">
                          <span>{train.line}</span>
                          <span className={train.status === 'Delayed' ? 'text-red-500' : 'text-gray-500'}>{train.status}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Next at Central Station: {new Date(train.nextArrivals?.[0]?.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )) || (
                      <div className="border-l-2 border-green-500 pl-3">
                        <p className="text-sm font-medium">Train Service</p>
                        <p className="text-xs text-gray-500">Data unavailable</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Incidents</h3>
                  <div className="mt-2 space-y-2">
                    {trafficData.incidents?.filter?.(inc => inc.type === 'accident' || inc.type === 'roadwork')?.slice?.(0, 2)?.map?.((incident, index) => (
                      <div key={`incident-${index}`} className="text-xs text-gray-700 dark:text-gray-300 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <p className="font-medium capitalize">{incident.type}</p>
                        <p>{incident.description}</p>
                      </div>
                    )) || (
                      <div className="text-xs text-gray-700 dark:text-gray-300 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <p>No incidents reported</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* AI Suggestions Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Eco Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                        <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {suggestion.category === 'transport' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          )}
                          {suggestion.category === 'challenge' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          )}
                          {suggestion.category === 'event' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          )}
                          {(suggestion.category === 'energy' || !suggestion.category) && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{suggestion.id || 'Eco Suggestion'}</h3>
                        <p className="text-xs text-green-600 dark:text-green-400">+{suggestion.potentialPoints} potential points</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion.text || suggestion.description || 'Try this eco-friendly suggestion!'}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Active Challenges Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Active Eco Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.slice(0, 3).map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onComplete={(result) => {
                  // In a real app, we would update the user's points here
                  setUser({
                    ...user,
                    ecoPoints: user.ecoPoints + result.pointsGained,
                    streak: user.streak + 1
                  });
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 