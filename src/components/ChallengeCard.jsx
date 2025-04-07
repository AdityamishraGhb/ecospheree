'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { completeChallenge } from '../utils/rewardSystem';

const ChallengeCard = ({ 
  challenge, 
  onComplete = () => {},
  className = '',
}) => {
  const { id, title, description, points, duration, participants, startDate, endDate, type } = challenge;
  
  // Calculate progress (random for demo)
  const progress = Math.floor(Math.random() * 101);
  
  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Check if challenge is active
  const isActive = () => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };
  
  // Handle completing a challenge
  const handleComplete = () => {
    const result = completeChallenge(id);
    if (result.success) {
      onComplete(result);
    }
  };
  
  // Helper to get badge color based on challenge type
  const getBadgeColor = () => {
    switch(type) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'weekly':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'monthly':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor()}`}>
            {type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
            <p className="text-lg font-semibold">{duration}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Points</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-500">{points}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="text-lg font-semibold">{formatDate(startDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
            <p className="text-lg font-semibold">{formatDate(endDate)}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</p>
            <p className="text-sm font-semibold">{progress}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <motion.div 
              className="bg-green-600 h-2.5 rounded-full dark:bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        {/* Participants */}
        <div className="mt-4 flex items-center">
          <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{participants}</span> participants
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleComplete}
          disabled={!isActive()}
          className="w-full"
        >
          {isActive() ? 'Complete Challenge' : 'Coming Soon'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard; 