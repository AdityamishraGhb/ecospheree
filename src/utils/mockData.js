// Demo User Data
export const users = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'demo123',
    avatar: null,
    bio: 'Environmental enthusiast and cycling advocate. Working to reduce my carbon footprint one day at a time.',
    location: 'Portland, OR',
    ecoPoints: 2350,
    streak: 8,
    completedChallenges: ['challenge1', 'challenge4', 'challenge7'],
    registeredEvents: ['event2', 'event5'],
    redeemedRewards: ['reward3'],
    joinDate: '2023-09-15',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      reminderFrequency: 'daily'
    },
    achievements: [
      {
        id: 'achievement1',
        name: 'Early Adopter',
        description: 'Joined EcoSphere in the first month',
        date: '2023-09-15'
      },
      {
        id: 'achievement2',
        name: '5-Day Streak',
        description: 'Completed eco-friendly actions for 5 days in a row',
        date: '2023-09-20'
      },
      {
        id: 'achievement3',
        name: 'Challenge Champion',
        description: 'Completed 3 eco challenges',
        date: '2023-10-05'
      }
    ]
  },
  {
    id: 'user2',
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: 'demo123',
    avatar: null,
    ecoPoints: 3200,
    streak: 12,
    completedChallenges: ['challenge2', 'challenge3', 'challenge5', 'challenge8'],
    registeredEvents: ['event1', 'event3'],
    redeemedRewards: ['reward1', 'reward4'],
    joinDate: '2023-08-28',
    preferences: {
      emailNotifications: false,
      pushNotifications: true,
      reminderFrequency: 'weekly'
    }
  },
  {
    id: 'user3',
    name: 'Taylor Smith',
    email: 'taylor@example.com',
    password: 'demo123',
    avatar: null,
    ecoPoints: 1850,
    streak: 3,
    completedChallenges: ['challenge1', 'challenge6'],
    registeredEvents: ['event4'],
    redeemedRewards: [],
    joinDate: '2023-10-10',
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      reminderFrequency: 'daily'
    }
  }
];

// Challenge Data
export const challenges = [
  {
    id: 'challenge1',
    title: 'Zero Waste Day',
    description: 'Go through an entire day without generating any disposable waste.',
    points: 100,
    difficulty: 'medium',
    type: 'daily',
    duration: 1,
    tips: [
      'Bring your own reusable containers for takeout',
      'Carry a reusable water bottle and coffee cup',
      'Say no to straws and plastic cutlery'
    ],
    impact: 'Reduces landfill waste and plastic pollution',
    completionCriteria: 'Honor system - report your success at the end of the day'
  },
  {
    id: 'challenge2',
    title: 'Bike to Work Week',
    description: 'Commute to work or school by bicycle for an entire week.',
    points: 250,
    difficulty: 'hard',
    type: 'weekly',
    duration: 7,
    tips: [
      'Plan your route ahead of time',
      'Check your bike is in good working condition',
      'Pack a change of clothes if needed'
    ],
    impact: 'Reduces CO2 emissions and improves personal health',
    completionCriteria: 'Track your rides with the app for 5 workdays'
  },
  {
    id: 'challenge3',
    title: 'Meatless Monday',
    description: 'Eat vegetarian for an entire day.',
    points: 75,
    difficulty: 'easy',
    type: 'weekly',
    duration: 1,
    tips: [
      'Try plant-based proteins like beans, lentils, and tofu',
      'Explore vegetarian recipes from different cultures',
      'Prep your meals ahead of time'
    ],
    impact: 'Reduces carbon footprint and water usage associated with meat production',
    completionCriteria: 'Track your meals for the day in the app'
  },
  {
    id: 'challenge4',
    title: 'Energy Audit',
    description: 'Complete a home energy audit and identify at least 3 ways to improve efficiency.',
    points: 150,
    difficulty: 'medium',
    type: 'monthly',
    duration: 1,
    tips: [
      'Check for air leaks around windows and doors',
      'Inspect insulation in your attic',
      'Evaluate the efficiency of your appliances'
    ],
    impact: 'Reduces home energy consumption and greenhouse gas emissions',
    completionCriteria: 'Submit your findings and planned improvements'
  },
  {
    id: 'challenge5',
    title: 'Public Transport Month',
    description: 'Use public transportation for all non-walking distance trips for a month.',
    points: 300,
    difficulty: 'hard',
    type: 'monthly',
    duration: 30,
    tips: [
      'Get a monthly transit pass to save money',
      'Download transit apps to plan your routes',
      'Bring a book or podcast for the journey'
    ],
    impact: 'Significantly reduces carbon emissions from personal vehicle use',
    completionCriteria: 'Log at least 20 public transit trips in 30 days'
  },
  {
    id: 'challenge6',
    title: 'Local Food Day',
    description: 'Eat only locally-sourced food (within 100 miles) for a day.',
    points: 100,
    difficulty: 'medium',
    type: 'daily',
    duration: 1,
    tips: [
      'Visit a farmers market',
      'Research local food producers in your area',
      'Cook meals from scratch using local ingredients'
    ],
    impact: 'Reduces carbon emissions from food transportation and supports local economy',
    completionCriteria: 'Record your meals with sources of each ingredient'
  },
  {
    id: 'challenge7',
    title: 'Digital Cleanup Day',
    description: 'Delete unnecessary emails, files, and apps to reduce your digital carbon footprint.',
    points: 50,
    difficulty: 'easy',
    type: 'daily',
    duration: 1,
    tips: [
      'Start with your largest files and oldest emails',
      'Unsubscribe from newsletters you don\'t read',
      'Use cloud storage services that run on renewable energy'
    ],
    impact: 'Reduces energy used by data centers to store digital content',
    completionCriteria: 'Delete at least 1GB of data or 500 emails'
  },
  {
    id: 'challenge8',
    title: 'Water Conservation Week',
    description: 'Reduce your water usage by 20% for a week.',
    points: 200,
    difficulty: 'medium',
    type: 'weekly',
    duration: 7,
    tips: [
      'Take shorter showers',
      'Install low-flow faucets and shower heads',
      'Only run full loads of laundry and dishes'
    ],
    impact: 'Conserves water resources and reduces energy used for water heating',
    completionCriteria: 'Track your water usage before and during the challenge'
  }
];

// Reward Data
export const rewards = [
  {
    id: 'reward1',
    title: '20% Off at GreenEats Restaurant',
    description: 'Enjoy a discount at this farm-to-table restaurant that sources all ingredients locally.',
    pointsCost: 500,
    category: 'dining',
    provider: 'GreenEats',
    expiryDays: 60,
    redemptionDetails: 'Show the code at checkout: ECO500. Valid for one meal, excluding alcohol.',
    image: '/rewards/greeneats.jpg',
    available: true
  },
  {
    id: 'reward2',
    title: 'Free Bike Tune-Up',
    description: 'Get your bicycle tuned up for free at CycleLife bike shop.',
    pointsCost: 800,
    category: 'transport',
    provider: 'CycleLife',
    expiryDays: 90,
    redemptionDetails: 'Present the voucher code ECO800 at any CycleLife location.',
    image: '/rewards/cyclelife.jpg',
    available: true
  },
  {
    id: 'reward3',
    title: '15% Off Sustainable Fashion',
    description: 'Discount on any purchase at EcoWear, featuring clothing made from recycled materials.',
    pointsCost: 350,
    category: 'shopping',
    provider: 'EcoWear',
    expiryDays: 45,
    redemptionDetails: 'Use code ECOSPH350 at checkout online or in-store.',
    image: '/rewards/ecowear.jpg',
    available: true
  },
  {
    id: 'reward4',
    title: 'Zero-Waste Starter Kit',
    description: 'A kit containing reusable straw, cutlery, coffee cup, and shopping bag.',
    pointsCost: 650,
    category: 'merchandise',
    provider: 'EcoSphere',
    expiryDays: null, // No expiry
    redemptionDetails: 'We\'ll ship the kit to your registered address within 10 business days.',
    image: '/rewards/starterkit.jpg',
    available: true
  },
  {
    id: 'reward5',
    title: 'Tree Planting in Your Name',
    description: 'We\'ll plant a tree in a reforestation project and send you the certificate.',
    pointsCost: 200,
    category: 'impact',
    provider: 'TreeFuture',
    expiryDays: null, // No expiry
    redemptionDetails: 'Receive a digital certificate with GPS coordinates of your tree.',
    image: '/rewards/treeplanting.jpg',
    available: true
  },
  {
    id: 'reward6',
    title: 'One Month Free Public Transit Pass',
    description: 'A month of unlimited rides on city public transportation.',
    pointsCost: 1000,
    category: 'transport',
    provider: 'Metro Transit',
    expiryDays: 30,
    redemptionDetails: 'Redeem at any Metro Transit customer service center with code ECOSPH1000.',
    image: '/rewards/transit.jpg',
    available: true
  },
  {
    id: 'reward7',
    title: '50% Off Home Energy Audit',
    description: 'Professional assessment of your home\'s energy efficiency with recommendations.',
    pointsCost: 450,
    category: 'home',
    provider: 'GreenHome Solutions',
    expiryDays: 120,
    redemptionDetails: 'Call GreenHome at 555-123-4567 and mention code ECOSPH450.',
    image: '/rewards/energyaudit.jpg',
    available: true
  },
  {
    id: 'reward8',
    title: 'Community Garden Plot',
    description: 'One season access to a plot in a local community garden.',
    pointsCost: 1200,
    category: 'experience',
    provider: 'Urban Growers Collective',
    expiryDays: 365,
    redemptionDetails: 'Contact Urban Growers with your voucher code for plot assignment.',
    image: '/rewards/garden.jpg',
    available: true
  }
];

// Event Data
export const events = [
  {
    id: 'event1',
    title: 'Community Park Cleanup',
    description: 'Join us for a day of cleaning up Riverside Park. Equipment and refreshments provided.',
    date: '2023-11-15T09:00:00',
    endTime: '2023-11-15T12:00:00',
    location: 'Riverside Park, Main Entrance',
    type: 'cleanup',
    organizer: 'City Green Initiative',
    attendees: 42,
    maxAttendees: 50,
    pointsReward: 150,
    image: '/events/parkcleanup.jpg',
    registrationRequired: true,
    registrationUrl: null, // Uses in-app registration
    details: [
      'Please wear appropriate clothing and footwear',
      'Bring sunscreen and water bottle',
      'All cleaning supplies will be provided',
      'Counts toward volunteer community service hours'
    ]
  },
  {
    id: 'event2',
    title: 'Sustainable Living Workshop',
    description: 'Learn practical tips for reducing waste and living more sustainably in your daily life.',
    date: '2023-11-20T18:30:00',
    endTime: '2023-11-20T20:30:00',
    location: 'Community Center, Room 203',
    type: 'workshop',
    organizer: 'EcoLiving Experts',
    attendees: 28,
    maxAttendees: 35,
    pointsReward: 100,
    image: '/events/workshop.jpg',
    registrationRequired: true,
    registrationUrl: null, // Uses in-app registration
    details: [
      'Suitable for beginners and experienced eco-enthusiasts',
      'Includes take-home guide with resources',
      'Opportunity for Q&A with sustainability experts',
      'Light refreshments provided (bring your own cup)'
    ]
  },
  {
    id: 'event3',
    title: 'Farmers Market Tour',
    description: 'Guided tour of the local farmers market with tips on selecting seasonal produce and meeting local farmers.',
    date: '2023-11-25T10:00:00',
    endTime: '2023-11-25T11:30:00',
    location: 'Downtown Farmers Market',
    type: 'tour',
    organizer: 'Local Food Alliance',
    attendees: 15,
    maxAttendees: 20,
    pointsReward: 75,
    image: '/events/farmersmarket.jpg',
    registrationRequired: true,
    registrationUrl: null, // Uses in-app registration
    details: [
      'Meet at the market information booth',
      'Bring your own shopping bags',
      'Includes samples from selected vendors',
      'Tour will happen rain or shine'
    ]
  },
  {
    id: 'event4',
    title: 'Bike to Work Day',
    description: 'Join fellow cyclists for a community ride to work. Multiple starting points throughout the city.',
    date: '2023-12-01T07:00:00',
    endTime: '2023-12-01T09:00:00',
    location: 'Various Locations',
    type: 'activity',
    organizer: 'Cycle Advocates Network',
    attendees: 120,
    maxAttendees: 500,
    pointsReward: 100,
    image: '/events/biketowork.jpg',
    registrationRequired: false,
    registrationUrl: 'https://biketoworkday.org',
    details: [
      'Check website for starting points and routes',
      'Free breakfast provided at central meeting point',
      'Bike mechanics will be available for quick fixes',
      'Share your ride on social media with #BikeToWorkDay'
    ]
  },
  {
    id: 'event5',
    title: 'Documentary Screening: Climate Solutions',
    description: 'Screening of award-winning documentary followed by panel discussion with local experts.',
    date: '2023-12-08T19:00:00',
    endTime: '2023-12-08T21:30:00',
    location: 'City Library Auditorium',
    type: 'educational',
    organizer: 'Climate Action Coalition',
    attendees: 75,
    maxAttendees: 120,
    pointsReward: 100,
    image: '/events/documentary.jpg',
    registrationRequired: true,
    registrationUrl: null, // Uses in-app registration
    details: [
      'Doors open at 18:30',
      'Panel discussion will follow the screening',
      'Free admission with registration',
      'Accessible venue with parking available'
    ]
  },
  {
    id: 'event6',
    title: 'Native Plant Gardening Workshop',
    description: 'Learn how to create a garden that supports local ecosystems and requires less water and maintenance.',
    date: '2023-12-15T14:00:00',
    endTime: '2023-12-15T16:00:00',
    location: 'Botanical Gardens Education Center',
    type: 'workshop',
    organizer: 'Native Plant Society',
    attendees: 18,
    maxAttendees: 30,
    pointsReward: 125,
    image: '/events/nativeplants.jpg',
    registrationRequired: true,
    registrationUrl: null, // Uses in-app registration
    details: [
      'Each participant receives native plant seedlings',
      'Bring gardening gloves if you have them',
      'Suitable for all experience levels',
      'Workshop includes hands-on planting demonstration'
    ]
  }
];

// Traffic Data
export const trafficData = {
  status: 'moderate',
  lastUpdated: new Date().toISOString(),
  congestionAreas: [
    {
      id: 'congestion1',
      location: { lat: 45.523064, lng: -122.676483 },
      severity: 'high',
      cause: 'Construction',
      expectedDuration: '2 hours'
    },
    {
      id: 'congestion2',
      location: { lat: 45.512794, lng: -122.685664 },
      severity: 'medium',
      cause: 'Rush hour traffic',
      expectedDuration: '1 hour'
    },
    {
      id: 'congestion3',
      location: { lat: 45.530734, lng: -122.655404 },
      severity: 'low',
      cause: 'Event at convention center',
      expectedDuration: '3 hours'
    }
  ],
  incidents: [
    {
      id: 'incident1',
      type: 'accident',
      location: { lat: 45.518950, lng: -122.679276 },
      description: 'Two-vehicle collision, right lane blocked',
      reportedAt: new Date(Date.now() - 30 * 60000).toISOString() // 30 minutes ago
    },
    {
      id: 'incident2',
      type: 'roadwork',
      location: { lat: 45.523064, lng: -122.676483 },
      description: 'Road maintenance, expect delays',
      reportedAt: new Date(Date.now() - 120 * 60000).toISOString() // 2 hours ago
    }
  ],
  publicTransport: {
    status: 'normal',
    disruptions: [
      {
        line: 'Blue Line',
        description: 'Delays of 10-15 minutes due to signal issue',
        severity: 'minor'
      }
    ],
    recommendations: [
      'Blue Line trains are running every 15 minutes instead of 10 minutes',
      'Consider using the 14 bus as an alternative to the Blue Line',
      'The downtown transit center is experiencing higher volumes than normal'
    ]
  },
  ecoFriendlyRoutes: [
    {
      id: 'route1',
      from: 'Downtown',
      to: 'Eastside',
      transportType: 'bike',
      duration: '25 min',
      distance: '4.2 miles',
      carbonSaved: '2.1 kg',
      difficulty: 'moderate'
    },
    {
      id: 'route2',
      from: 'Southside',
      to: 'University District',
      transportType: 'public',
      duration: '18 min',
      distance: '3.5 miles',
      carbonSaved: '1.8 kg',
      difficulty: 'easy'
    },
    {
      id: 'route3',
      from: 'Westside',
      to: 'Downtown',
      transportType: 'walk',
      duration: '35 min',
      distance: '1.8 miles',
      carbonSaved: '0.9 kg',
      difficulty: 'easy'
    }
  ]
};

// Leaderboard Data
export const leaderboard = [
  { id: 'user2', name: 'Alex Chen', points: 3200, rank: 1 },
  { id: 'user1', name: 'Sarah Johnson', points: 2350, rank: 2 },
  { id: 'user4', name: 'Jamie Rodriguez', points: 2100, rank: 3 },
  { id: 'user5', name: 'Morgan Taylor', points: 1950, rank: 4 },
  { id: 'user3', name: 'Taylor Smith', points: 1850, rank: 5 },
  { id: 'user6', name: 'Jordan Lee', points: 1650, rank: 6 },
  { id: 'user7', name: 'Casey Wilson', points: 1500, rank: 7 },
  { id: 'user8', name: 'Riley Johnson', points: 1350, rank: 8 },
  { id: 'user9', name: 'Quinn Thomas', points: 1200, rank: 9 },
  { id: 'user10', name: 'Avery Martinez', points: 1050, rank: 10 }
];

// AI Suggestions
export const aiSuggestions = [
  {
    id: 'suggestion1',
    text: 'Based on your commute pattern, switching to public transport on Tuesdays and Thursdays could save 3.2kg of CO2 per week.',
    potentialPoints: 100,
    category: 'transport'
  },
  {
    id: 'suggestion2',
    text: 'You\'ve been using eco-friendly transport consistently. Try the "Bike to Work Week" challenge for bonus points!',
    potentialPoints: 250,
    category: 'challenge'
  },
  {
    id: 'suggestion3',
    text: 'There\'s a community park cleanup event next weekend near your area. Participating could earn you 150 eco points.',
    potentialPoints: 150,
    category: 'event'
  },
  {
    id: 'suggestion4',
    text: 'Your energy usage tends to peak between 6-8pm. Shifting some activities to off-peak hours could reduce your carbon footprint.',
    potentialPoints: 75,
    category: 'energy'
  },
  {
    id: 'suggestion5',
    text: 'You haven\'t tried any water conservation challenges yet. "Water Conservation Week" would be a good fit for your profile.',
    potentialPoints: 200,
    category: 'challenge'
  }
];

// Get user suggestions based on user ID
export const getUserSuggestions = (userId) => {
  // In a real app, this would use algorithms to generate personalized suggestions
  // For demo purposes, we'll just return a subset of the predefined suggestions
  return aiSuggestions.slice(0, 3);
};

// Get traffic updates for a location
export const getTrafficUpdates = (location) => {
  // In a real app, this would fetch real-time data based on location
  // For demo purposes, we'll just return the mock data
  return trafficData;
};

// Get user by credentials for login
export const getUserByCredentials = (email, password) => {
  return users.find(user => user.email === email && user.password === password) || null;
}; 