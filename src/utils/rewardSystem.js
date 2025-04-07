import { rewards } from './mockData';
import { getCurrentUser, saveUserToStorage } from './auth';

// Calculate eco points for a trip
export const calculateEcoPoints = (mode, distance) => {
  // Points calculation based on transport mode and distance
  const pointsPerKm = {
    walking: 5,
    bicycle: 5,
    scooter: 4,
    bus: 2,
    train: 2,
    subway: 2,
    tram: 2,
    electric_car: 2,
    carpool: 1,
    car: 0,  // No points for solo car trips
    taxi: 0,
    motorcycle: 0,
    // Emergency vehicles don't earn points as they're essential
    ambulance: 0,
    police_car: 0,
    fire_engine: 0
  };

  // Calculate base points
  const basePoints = Math.round(distance * (pointsPerKm[mode] || 0));
  
  // Add bonus for longer eco-friendly trips
  let bonus = 0;
  if (['walking', 'bicycle', 'scooter'].includes(mode) && distance > 3) {
    bonus = Math.floor(distance / 3) * 2; // 2 bonus points for every 3km
  }
  
  return basePoints + bonus;
};

// Check if a user can afford a reward
export const canAffordReward = (reward) => {
  const user = getCurrentUser();
  return user && user.ecoPoints >= reward.pointsCost;
};

// Purchase a reward (simulate)
export const purchaseReward = (rewardId) => {
  const user = getCurrentUser();
  if (!user) return { success: false, message: 'User not logged in' };
  
  const reward = rewards.find(r => r.id === rewardId);
  if (!reward) return { success: false, message: 'Reward not found' };
  
  if (user.ecoPoints < reward.pointsCost) {
    return { success: false, message: 'Not enough eco points' };
  }
  
  // Update user points
  const updatedUser = {
    ...user,
    ecoPoints: user.ecoPoints - reward.pointsCost
  };
  
  // Save updated user
  saveUserToStorage(updatedUser);
  
  // In a real app, this would call an API to record the transaction
  return { 
    success: true, 
    message: `Successfully redeemed: ${reward.title}`,
    updatedPoints: updatedUser.ecoPoints,
    reward
  };
};

// Complete a challenge (simulate)
export const completeChallenge = (challengeId, userId) => {
  const user = getCurrentUser();
  if (!user) return { success: false, message: 'User not logged in' };
  
  // In a real app, this would verify the challenge was actually completed
  // For now, we'll simulate success and award the points
  
  // Simulate random points gained (between 50-150)
  const pointsGained = Math.floor(Math.random() * 100) + 50;
  
  // Update user points
  const updatedUser = {
    ...user,
    ecoPoints: user.ecoPoints + pointsGained,
    streak: user.streak + 1
  };
  
  // Save updated user
  saveUserToStorage(updatedUser);
  
  return {
    success: true,
    message: `Challenge completed! Earned ${pointsGained} points.`,
    pointsGained,
    updatedPoints: updatedUser.ecoPoints,
    updatedStreak: updatedUser.streak
  };
};

// Get personalized rewards for a user
export const getPersonalizedRewards = () => {
  const user = getCurrentUser();
  if (!user) return [];
  
  // In a real app, this would use an algorithm to determine relevant rewards
  // For the mock, we'll just return a subset of the rewards, sorted by affordability
  return rewards.sort((a, b) => {
    // First sort by whether the user can afford them
    const canAffordA = user.ecoPoints >= a.pointsCost;
    const canAffordB = user.ecoPoints >= b.pointsCost;
    
    if (canAffordA && !canAffordB) return -1;
    if (!canAffordA && canAffordB) return 1;
    
    // Then sort by points cost
    return a.pointsCost - b.pointsCost;
  });
}; 