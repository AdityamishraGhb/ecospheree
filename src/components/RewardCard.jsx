'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { canAffordReward, purchaseReward } from '../utils/rewardSystem';

const RewardCard = ({ 
  reward,
  onRedeem = () => {},
  className = '',
}) => {
  const { id, title, description, pointsCost, provider, validUntil, category, imageUrl } = reward;
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get affordability status
  const canAfford = canAffordReward(reward);
  
  // Handle redeeming a reward
  const handleRedeem = () => {
    setRedeeming(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const result = purchaseReward(id);
      setRedeeming(false);
      
      if (result.success) {
        setRedeemed(true);
        onRedeem(result);
      }
    }, 1000);
  };
  
  // Get category badge color
  const getCategoryColor = () => {
    switch(category) {
      case 'Food & Drink':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Transport':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Shopping':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'Services':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <div className="relative pt-[56.25%] bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img 
          src={imageUrl || '/images/rewards/placeholder.jpg'} 
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/images/rewards/placeholder.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor()}`}>
            {category}
          </span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Provided by {provider}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="mb-4">
          {description}
        </CardDescription>
        
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-bold text-green-600 dark:text-green-500">
                {pointsCost} points
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Valid until: {formatDate(validUntil)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {redeemed ? (
          <div className="w-full p-2 text-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
            Reward redeemed! Check your profile.
          </div>
        ) : (
          <Button 
            onClick={handleRedeem}
            disabled={!canAfford || redeeming}
            className="w-full"
            variant={canAfford ? 'primary' : 'secondary'}
          >
            {redeeming ? (
              <span className="flex items-center">
                <motion.div
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </span>
            ) : canAfford ? (
              'Redeem Reward'
            ) : (
              'Not Enough Points'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RewardCard; 