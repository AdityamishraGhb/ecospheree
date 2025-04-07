'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { isAuthenticated, getCurrentUser } from '../../utils/auth';
import { challenges, leaderboard } from '../../utils/mockData';
import ChallengeCard from '../../components/ChallengeCard';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const ChallengesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [completionMessage, setCompletionMessage] = useState(null);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    
    // Get current user
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, [router]);
  
  // Filter challenges based on type and search term
  const filteredChallenges = challenges.filter(challenge => {
    const matchesFilter = filter === 'all' || challenge.type === filter;
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Handle challenge completion
  const handleChallengeComplete = (result) => {
    // Update user with new points
    const updatedUser = {
      ...user,
      ecoPoints: user.ecoPoints + result.pointsGained,
      streak: result.updatedStreak
    };
    
    setUser(updatedUser);
    
    // Show completion message
    setCompletionMessage({
      message: result.message,
      pointsGained: result.pointsGained
    });
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setCompletionMessage(null);
    }, 3000);
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
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Eco Challenges
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Complete eco-friendly transport challenges to earn points and compete with others!
          </p>
        </motion.div>
        
        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  filter === 'all' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                All Challenges
              </button>
              <button
                onClick={() => setFilter('daily')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  filter === 'daily' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setFilter('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  filter === 'weekly' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setFilter('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  filter === 'monthly' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                Monthly
              </button>
            </div>
            
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Completion Message */}
        {completionMessage && (
          <motion.div 
            className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <span>{completionMessage.message}</span>
              <span className="font-bold">+{completionMessage.pointsGained} points</span>
            </div>
          </motion.div>
        )}
        
        {/* Main Content - Two Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges Grid */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge}
                    onComplete={handleChallengeComplete}
                  />
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400">
                  No challenges found matching your criteria.
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* User Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Points</span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-500">{user.ecoPoints}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Current Streak</span>
                    <span className="text-lg font-semibold">{user.streak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Challenges Completed</span>
                    <span className="text-lg font-semibold">{Math.floor(user.ecoPoints / 100)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Leaderboard Card */}
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className={`flex items-center p-2 rounded-md ${
                        entry.name === user.name ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-semibold bg-gray-100 dark:bg-gray-800 rounded-full mr-3">
                        {entry.rank}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{entry.name}</p>
                      </div>
                      <div className="text-green-600 dark:text-green-500 font-semibold">
                        {entry.points}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete daily challenges to build your streak</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Monthly challenges offer the highest point rewards</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Invite friends to participate in group challenges</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Check back often for new challenges and rewards</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChallengesPage; 