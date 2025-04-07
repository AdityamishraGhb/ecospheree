'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { isAuthenticated, getCurrentUser, updateUserProfile } from '../../utils/auth';
import Card from '../../components/ui/Card';
import { calculateLevel } from '../../utils/rewards';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      reminderFrequency: 'daily'
    }
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    
    // Get current user
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      bio: currentUser.bio || '',
      location: currentUser.location || '',
      preferences: {
        emailNotifications: currentUser.preferences?.emailNotifications ?? true,
        pushNotifications: currentUser.preferences?.pushNotifications ?? true,
        reminderFrequency: currentUser.preferences?.reminderFrequency || 'daily'
      }
    });
    setLoading(false);
  }, [router]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user profile
    const updatedUser = updateUserProfile({
      ...user,
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      location: formData.location,
      preferences: formData.preferences
    });
    
    setUser(updatedUser);
    setIsEditing(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  // Calculate user level based on eco points
  const userLevel = user ? calculateLevel(user.ecoPoints) : { level: 0, nextLevelPoints: 0, progress: 0 };
  
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
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your account and preferences
          </p>
        </motion.div>
        
        {/* Profile Header Card */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-700 dark:to-teal-800 text-white">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-4xl font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-600 dark:bg-green-500 rounded-full w-10 h-10 border-4 border-white dark:border-green-800 flex items-center justify-center font-bold">
                      {userLevel.level}
                    </div>
                  </div>
                </div>
                
                <div className="text-center md:text-left flex-grow">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-green-100">{user.email}</p>
                  {user.bio && <p className="mt-2 text-white/80">{user.bio}</p>}
                  
                  <div className="mt-4">
                    <p className="text-sm mb-1">Level {userLevel.level} Eco Enthusiast</p>
                    <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: `${userLevel.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1">
                      {userLevel.pointsToNextLevel} points to Level {userLevel.level + 1}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-center">
                  <div className="text-center px-6 py-3 bg-white/10 rounded-lg">
                    <div className="text-3xl font-bold">{user.ecoPoints}</div>
                    <div className="text-sm text-green-100">Eco Points</div>
                  </div>
                  
                  <div className="mt-4 text-center px-4 py-2 bg-white/10 rounded-lg">
                    <div className="text-xl font-bold">{user.streak || 0}</div>
                    <div className="text-xs text-green-100">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Success Message */}
        {saveSuccess && (
          <motion.div 
            className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Profile updated successfully!</span>
            </div>
          </motion.div>
        )}
        
        {/* Profile Edit Form */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Profile' : 'Profile Information'}
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            name="emailNotifications"
                            checked={formData.preferences.emailNotifications}
                            onChange={handlePreferenceChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Receive email notifications
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="pushNotifications"
                            name="pushNotifications"
                            checked={formData.preferences.pushNotifications}
                            onChange={handlePreferenceChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Receive push notifications
                          </label>
                        </div>
                        
                        <div>
                          <label htmlFor="reminderFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Challenge Reminder Frequency
                          </label>
                          <select
                            id="reminderFrequency"
                            name="reminderFrequency"
                            value={formData.preferences.reminderFrequency}
                            onChange={handlePreferenceChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h4>
                      <p className="mt-1 text-gray-900 dark:text-white">{user.name}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h4>
                      <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{user.bio || 'No bio provided'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{user.location || 'No location provided'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <span className={`inline-block w-4 h-4 rounded-full ${user.preferences?.emailNotifications ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'}`}></span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.preferences?.emailNotifications ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <span className={`inline-block w-4 h-4 rounded-full ${user.preferences?.pushNotifications ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'}`}></span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.preferences?.pushNotifications ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <span className="inline-block w-4 h-4 rounded-full bg-green-600"></span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Challenge Reminder Frequency</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {user.preferences?.reminderFrequency || 'Daily'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
        
        {/* Achievement Section */}
        <motion.div variants={itemVariants} className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Your Achievements
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.achievements && user.achievements.length > 0 ? (
              user.achievements.map((achievement, index) => (
                <div key={index} className="relative p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full mb-3 bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{achievement.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{achievement.description}</p>
                    <span className="mt-2 inline-block px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {achievement.date}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No achievements yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Complete eco challenges and reduce your carbon footprint to earn achievements.
                </p>
                <button 
                  onClick={() => router.push('/challenges')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Browse Challenges
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage; 