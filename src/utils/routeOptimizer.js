import { trafficData } from './mockData';

// Simulated AI route optimizer
export const optimizeRoute = (startPoint, endPoint, mode = 'car', options = {}) => {
  // In a real app, this would use a real routing algorithm
  // and actual traffic data, but we'll simulate the responses
  
  const { prioritizeEco = false, isEmergency = false } = options;
  
  // Delay to simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      // Generate a fake route
      const route = {
        startPoint,
        endPoint,
        distance: Math.round(Math.random() * 15 + 2), // 2-17km
        estimatedTime: Math.round(Math.random() * 40 + 5), // 5-45 minutes
        ecoScore: prioritizeEco ? 
          Math.round(Math.random() * 30 + 70) : // 70-100 for eco routes
          Math.round(Math.random() * 60 + 20),  // 20-80 for normal routes
        carbonSaved: prioritizeEco ?
          Math.round(Math.random() * 5 + 2) : // 2-7kg for eco routes
          Math.round(Math.random() * 2),      // 0-2kg for normal routes
        trafficLevel: getRandomTrafficLevel(),
        route: generateFakeRoutePoints(),
        alternativeRoutes: generateAlternativeRoutes(mode, prioritizeEco, isEmergency)
      };
      
      resolve(route);
    }, 800); // Simulate API delay
  });
};

// Get emergency optimized route (simulated)
export const getEmergencyRoute = (startPoint, endPoint) => {
  return optimizeRoute(startPoint, endPoint, 'emergency', { isEmergency: true });
};

// Get eco-friendly route (simulated)
export const getEcoFriendlyRoute = (startPoint, endPoint, mode = 'car') => {
  return optimizeRoute(startPoint, endPoint, mode, { prioritizeEco: true });
};

// Helper functions to generate fake data

function getRandomTrafficLevel() {
  const levels = ['Low', 'Medium', 'High'];
  return levels[Math.floor(Math.random() * levels.length)];
}

function generateFakeRoutePoints() {
  // Generate 4-8 random route points
  const numPoints = Math.floor(Math.random() * 5) + 4;
  const points = [];
  
  // Base coordinates (London area by default)
  const baseLat = 51.5074;
  const baseLng = -0.1278;
  
  for (let i = 0; i < numPoints; i++) {
    points.push({
      lat: baseLat + (Math.random() * 0.1 - 0.05),
      lng: baseLng + (Math.random() * 0.1 - 0.05)
    });
  }
  
  return points;
}

function generateAlternativeRoutes(mode, prioritizeEco, isEmergency) {
  const alternatives = [];
  
  // Generate 0-2 alternative routes
  const numAlternatives = isEmergency ? 1 : Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numAlternatives; i++) {
    alternatives.push({
      name: `Alternative ${i + 1}`,
      distance: Math.round(Math.random() * 18 + 2), // 2-20km
      estimatedTime: Math.round(Math.random() * 50 + 5), // 5-55 minutes
      ecoScore: prioritizeEco ? 
        Math.round(Math.random() * 25 + 65) : // 65-90 for eco routes
        Math.round(Math.random() * 50 + 20),  // 20-70 for normal routes
      trafficLevel: getRandomTrafficLevel(),
      route: generateFakeRoutePoints()
    });
  }
  
  return alternatives;
}

// Function to generate a heatmap of traffic congestion
export const getTrafficHeatmap = () => {
  // In a real app, this would return actual data points
  // We'll use the trafficData hotspots plus some random points
  
  const heatmapPoints = [...trafficData.hotspots.map(hotspot => ({
    location: hotspot.location,
    weight: hotspot.level === 'high' ? 10 : 
            hotspot.level === 'medium' ? 5 : 2
  }))];
  
  // Add some random points
  for (let i = 0; i < 15; i++) {
    heatmapPoints.push({
      location: {
        lat: 51.5074 + (Math.random() * 0.1 - 0.05),
        lng: -0.1278 + (Math.random() * 0.1 - 0.05)
      },
      weight: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return heatmapPoints;
}; 