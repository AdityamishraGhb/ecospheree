/**
 * Calculates the user's level based on their eco points
 * Each level requires progressively more points
 * 
 * @param {number} points - The user's current eco points
 * @returns {object} - Object containing level information
 */
export const calculateLevel = (points) => {
  // Level thresholds - each index represents the minimum points needed for that level
  // Level 0 (not used) is 0 points, Level 1 is 100 points, etc.
  const levelThresholds = [
    0,      // Level 0 (not used)
    100,    // Level 1
    250,    // Level 2
    500,    // Level 3
    1000,   // Level 4
    1750,   // Level 5
    2500,   // Level 6
    3500,   // Level 7
    5000,   // Level 8
    7000,   // Level 9
    10000   // Level 10
  ];
  
  // Find current level (the highest threshold that the points exceed)
  let level = 0;
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (points >= levelThresholds[i]) {
      level = i;
      break;
    }
  }
  
  // Calculate points needed for next level
  const nextLevel = level + 1;
  const nextLevelThreshold = nextLevel < levelThresholds.length ? levelThresholds[nextLevel] : null;
  
  // If user is at max level, set progress to 100%
  let progress = 100;
  let pointsToNextLevel = 0;
  
  if (nextLevelThreshold) {
    const currentLevelPoints = levelThresholds[level];
    const pointsForCurrentLevel = points - currentLevelPoints;
    const pointsNeededForNextLevel = nextLevelThreshold - currentLevelPoints;
    
    progress = Math.round((pointsForCurrentLevel / pointsNeededForNextLevel) * 100);
    pointsToNextLevel = nextLevelThreshold - points;
  }
  
  return {
    level,
    nextLevel,
    progress,
    pointsToNextLevel,
    isMaxLevel: nextLevel >= levelThresholds.length
  };
};

/**
 * Checks if a user can afford a reward based on their eco points
 * 
 * @param {object} user - The user object
 * @param {object} reward - The reward object
 * @returns {boolean} - Whether the user can afford the reward
 */
export const canAffordReward = (user, reward) => {
  if (!user || !reward) return false;
  return user.ecoPoints >= reward.pointsCost;
};

/**
 * Calculates the remaining days until a reward expires
 * 
 * @param {object} reward - The reward object
 * @param {string} redeemedDate - ISO string of when the reward was redeemed
 * @returns {number|null} - Days remaining or null if no expiry
 */
export const calculateRemainingDays = (reward, redeemedDate) => {
  if (!reward || !reward.expiryDays) return null;
  
  const redemptionDate = new Date(redeemedDate);
  const expiryDate = new Date(redemptionDate);
  expiryDate.setDate(redemptionDate.getDate() + reward.expiryDays);
  
  const today = new Date();
  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return Math.max(0, daysDiff);
};

/**
 * Gets a label describing the difficulty of achieving a level
 * 
 * @param {number} level - The user level
 * @returns {string} - Description of difficulty
 */
export const getLevelDifficulty = (level) => {
  if (level <= 2) return 'Beginner';
  if (level <= 5) return 'Intermediate';
  if (level <= 8) return 'Advanced';
  return 'Expert';
};

/**
 * Gets a badge title based on user level
 * 
 * @param {number} level - The user level
 * @returns {string} - Badge title
 */
export const getLevelBadge = (level) => {
  const badges = [
    'Eco Novice',         // Level 0 (not used)
    'Eco Starter',        // Level 1
    'Green Beginner',     // Level 2
    'Sustainability Scout', // Level 3
    'Carbon Cutter',      // Level 4
    'Eco Enthusiast',     // Level 5
    'Green Guardian',     // Level 6
    'Sustainability Steward', // Level 7
    'Planet Protector',   // Level 8
    'Climate Champion',   // Level 9
    'Earth Hero'          // Level 10
  ];
  
  return badges[Math.min(level, badges.length - 1)];
}; 