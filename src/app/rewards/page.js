'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCurrentUser, isAuthenticated } from '../../utils/auth';
import { rewards } from '../../utils/mockData';
import RewardCard from '../../components/RewardCard';

const RewardsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [redeemedMessage, setRedeemedMessage] = useState('');
  
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
  
  // Get unique categories
  const categories = ['all', ...new Set(rewards.map(reward => reward.category))];
  
  // Filter rewards based on search and category
  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = searchTerm === '' || 
      reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.provider.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle reward redemption
  const handleRewardRedeemed = (result) => {
    if (result.success) {
      setUser({
        ...user,
        ecoPoints: result.updatedPoints
      });
      
      // Show message briefly
      setRedeemedMessage(`Successfully redeemed: ${result.reward.title}`);
      setTimeout(() => {
        setRedeemedMessage('');
      }, 3000);
    }
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
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Eco Rewards
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Redeem your eco points for exclusive rewards and discounts
            </p>
          </div>
        </motion.div>
        
        {/* User Points Banner */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mb-8 p-6 text-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Your Eco Points</h2>
              <p className="text-green-100">Use your points to redeem awesome rewards</p>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              <span className="text-4xl font-bold">{user.ecoPoints}</span>
              <span className="ml-2">points</span>
            </div>
          </div>
        </motion.div>
        
        {/* Redemption Message */}
        {redeemedMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md"
          >
            {redeemedMessage}
          </motion.div>
        )}
        
        {/* Filters and Search */}
        <motion.div 
          variants={itemVariants}
          className="mb-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search rewards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md whitespace-nowrap text-sm ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Rewards Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredRewards.map(reward => (
            <RewardCard
              key={reward.id}
              reward={{
                ...reward,
                imageUrl: `/images/rewards/${reward.id}.jpg`,
                validUntil: new Date(Date.now() + (reward.expiryDays || 30) * 24 * 60 * 60 * 1000)
              }}
              onRedeem={handleRewardRedeemed}
            />
          ))}
          
          {filteredRewards.length === 0 && (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No rewards found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try changing your search or filter settings.</p>
            </div>
          )}
        </motion.div>
        
        {/* How It Works Section */}
        <motion.div variants={itemVariants} className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="rounded-full bg-green-100 dark:bg-green-900 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Complete Eco Challenges</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn eco points by completing eco-friendly challenges in the Challenges section.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="rounded-full bg-green-100 dark:bg-green-900 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Accumulate Points</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build up your eco points balance over time by consistently making eco-friendly choices.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="rounded-full bg-green-100 dark:bg-green-900 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H5.45a4 4 0 00-3.91 3.26L0 10.13M12 8c-.29 0-.56-.06-.81-.17C10.5 7.57 10 6.85 10 6a4 4 0 014-4c2.21 0 4 1.79 4 4 0 .85-.5 1.57-1.19 1.83-.25.11-.52.17-.81.17" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Redeem Rewards</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Spend your points on eco-friendly products, services, and experiences from our partners.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RewardsPage; 