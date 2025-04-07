import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon,
  change = null,
  delay = 0,
  className = '',
}) => {
  // Determine if change is positive, negative or neutral
  const getChangeColor = () => {
    if (change === null) return '';
    return change > 0 
      ? 'text-green-600 dark:text-green-400' 
      : change < 0 
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-500 dark:text-gray-400';
  };
  
  // Format change as a percentage
  const formatChange = () => {
    if (change === null) return '';
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change}%`;
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: delay * 0.1
      }
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Card className="h-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {title}
            </h3>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              {icon}
            </div>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </span>
            {change !== null && (
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {formatChange()}
              </span>
            )}
          </div>
          
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default StatsCard; 