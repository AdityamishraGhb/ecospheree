'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { isAuthenticated, getCurrentUser } from '../../utils/auth';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { leaderboard } from '../../utils/mockData';

const CommunityPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
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
    
    // Fetch global stats
    fetch('/api/stats.json')
      .then(response => response.json())
      .then(data => {
        setGlobalStats(data);
        setStatsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching global stats:', error);
        setStatsLoading(false);
      });
  }, [router]);
  
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
            Community Impact
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            See the collective difference our EcoSphere community is making
          </p>
        </motion.div>
        
        {/* Global Stats */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Global Impact
          </h2>
          
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse h-32"></div>
              ))}
            </div>
          ) : globalStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-8 h-8 mb-2 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-lg text-white/80">Members</span>
                    <div className="text-3xl font-bold mt-1">
                      {globalStats.ecoImpact.totalUsers.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-8 h-8 mb-2 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg text-white/80">Challenges</span>
                    <div className="text-3xl font-bold mt-1">
                      {globalStats.ecoImpact.totalChallengesCompleted.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-8 h-8 mb-2 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg text-white/80">CO2 Saved</span>
                    <div className="text-3xl font-bold mt-1">
                      {globalStats.ecoImpact.co2Saved.value.toLocaleString()} {globalStats.ecoImpact.co2Saved.unit}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-8 h-8 mb-2 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-lg text-white/80">Trees Planted</span>
                    <div className="text-3xl font-bold mt-1">
                      {globalStats.ecoImpact.treesPlanted.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">Failed to load global stats. Please try again later.</p>
            </div>
          )}
        </motion.div>
        
        {/* Top Challenges */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Challenges
          </h2>
          
          {statsLoading ? (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse h-64"></div>
          ) : globalStats ? (
            <Card>
              <div className="p-6">
                <div className="space-y-6">
                  {globalStats.popularChallenges.map((challenge, index) => (
                    <div
                      key={challenge.id}
                      className={`flex items-center justify-between ${
                        index < globalStats.popularChallenges.length - 1 ? 'pb-6 border-b border-gray-200 dark:border-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-400'
                            : 'bg-amber-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900 dark:text-white">{challenge.title}</h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {challenge.completions.toLocaleString()} completions • {challenge.co2Saved.value.toLocaleString()} {challenge.co2Saved.unit} saved
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => router.push('/challenges')}
                          className="px-3 py-1 text-xs font-medium rounded-md text-green-800 bg-green-100 hover:bg-green-200 dark:text-green-200 dark:bg-green-900 dark:hover:bg-green-800"
                        >
                          View Challenge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">Failed to load challenge data. Please try again later.</p>
            </div>
          )}
        </motion.div>
        
        {/* Leaderboard */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Leaderboard
          </h2>
          
          <Card>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((entry) => {
                    const isCurrentUser = user && entry.id === user.id;
                    
                    return (
                      <tr 
                        key={entry.id}
                        className={isCurrentUser ? 'bg-green-50 dark:bg-green-900/20' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            entry.rank === 1
                              ? 'bg-yellow-500 text-white'
                              : entry.rank === 2
                              ? 'bg-gray-400 text-white'
                              : entry.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          } font-bold text-sm`}>
                            {entry.rank}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-800 dark:text-green-200 font-bold text-sm">
                              {entry.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className={`text-sm font-medium ${isCurrentUser ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {entry.name} {isCurrentUser && '(You)'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.points.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
        
        {/* Recent Achievements */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Achievements
          </h2>
          
          {statsLoading ? (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse h-64"></div>
          ) : globalStats ? (
            <Card>
              <div className="p-6">
                <div className="space-y-6">
                  {globalStats.recentAchievements.map((achievement, index) => {
                    const achievementDate = new Date(achievement.date);
                    const formattedDate = achievementDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-start ${
                          index < globalStats.recentAchievements.length - 1 ? 'pb-6 border-b border-gray-200 dark:border-gray-700' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">{achievement.user} earned {achievement.achievement}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {achievement.user.split(' ')[0]} has unlocked a new achievement badge!
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">Failed to load recent achievements. Please try again later.</p>
            </div>
          )}
        </motion.div>
        
        {/* Join the Movement */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl overflow-hidden shadow-lg">
            <div className="p-8 md:p-12">
              <div className="md:max-w-3xl mx-auto text-center text-white">
                <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
                <p className="text-lg text-green-100 mb-8">
                  Invite your friends to join EcoSphere and amplify our collective impact on the planet. 
                  Every person who joins means more sustainable actions and a greener future.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    className="px-8 py-3 bg-white text-green-700 rounded-md font-medium hover:bg-green-50 flex items-center justify-center"
                    onClick={() => {
                      // Copy invite link logic would go here
                      navigator.clipboard.writeText('https://ecosphere.example.com/invite/' + user.id);
                      alert('Invite link copied to clipboard!');
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Invite Link
                  </button>
                  <button
                    className="px-8 py-3 bg-green-800 text-white rounded-md font-medium hover:bg-green-900 flex items-center justify-center"
                    onClick={() => {
                      // Share on social media logic would go here
                      window.open('https://twitter.com/intent/tweet?text=Join%20me%20on%20EcoSphere%20and%20let%27s%20make%20a%20difference%20together!%20https://ecosphere.example.com', '_blank');
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share on Social Media
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CommunityPage; 