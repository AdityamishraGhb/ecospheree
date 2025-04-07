import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';

const EventCard = ({ 
  event,
  onRegister = () => {},
  className = '',
}) => {
  const { id, title, description, date, time, location, organizer, pointsReward, participants, category, imageUrl } = event;
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Check if event is upcoming
  const isUpcoming = () => {
    const now = new Date();
    const eventDate = new Date(date);
    return eventDate > now;
  };
  
  // Get days remaining until event
  const getDaysRemaining = () => {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = Math.abs(eventDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Handle registering for an event
  const handleRegister = () => {
    setRegistering(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setRegistering(false);
      setRegistered(true);
      
      onRegister({
        success: true,
        message: `Successfully registered for ${title}`,
        event
      });
    }, 1000);
  };
  
  // Get category badge color
  const getCategoryColor = () => {
    switch(category) {
      case 'Volunteer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Education':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Expo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Community':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <div className="relative pt-[56.25%] bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img 
          src={imageUrl || '/images/events/placeholder.jpg'} 
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/images/events/placeholder.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor()}`}>
            {category}
          </span>
        </div>
        {isUpcoming() && (
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
              {getDaysRemaining()} {getDaysRemaining() === 1 ? 'day' : 'days'} left
            </span>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              By {organizer}
            </p>
            {pointsReward > 0 && (
              <p className="text-sm font-medium text-green-600 dark:text-green-500">
                +{pointsReward} points
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="mb-4">
          {description}
        </CardDescription>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Date</p>
              <p className="text-gray-500 dark:text-gray-400">{formatDate(date)}</p>
            </div>
          </div>
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Time</p>
              <p className="text-gray-500 dark:text-gray-400">{time}</p>
            </div>
          </div>
          <div className="flex items-start col-span-2">
            <svg className="h-5 w-5 text-gray-400 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Location</p>
              <p className="text-gray-500 dark:text-gray-400">{location}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{participants}</span> registered
        </div>
      </CardContent>
      <CardFooter>
        {registered ? (
          <div className="w-full p-2 text-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
            You're registered! Check your calendar.
          </div>
        ) : (
          <Button 
            onClick={handleRegister}
            disabled={!isUpcoming() || registering}
            className="w-full"
          >
            {registering ? (
              <span className="flex items-center">
                <motion.div
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </span>
            ) : isUpcoming() ? (
              'Register Now'
            ) : (
              'Event Ended'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard; 