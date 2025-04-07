'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { isAuthenticated, getCurrentUser } from '../../utils/auth';
import { events } from '../../utils/mockData';
import EventCard from '../../components/EventCard';
import Card from '../../components/ui/Card';

const EventsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  
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
  
  // Get current date for filtering past/upcoming events
  const currentDate = new Date();
  
  // Filter events based on type, search term, and date
  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const eventDate = new Date(event.date);
    const isPastEvent = eventDate < currentDate;
    
    return matchesFilter && matchesSearch && (showPastEvents || !isPastEvent);
  });
  
  // Sort events by date (upcoming first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
  
  // Handle event registration
  const handleEventRegistration = (result) => {
    // Show registration message
    setRegistrationMessage(result);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setRegistrationMessage(null);
    }, 3000);
  };
  
  // Get unique event types for filter
  const eventTypes = ['all', ...new Set(events.map(e => e.type))];
  
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
  
  // Count upcoming events
  const upcomingEventsCount = events.filter(event => new Date(event.date) >= currentDate).length;
  
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
            Eco Events
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Join community events and eco-friendly activities in your area
          </p>
        </motion.div>
        
        {/* Events Summary */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-700 dark:to-teal-800 text-white">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Community Events</h2>
                  <p className="text-green-100">Connect with others and make a difference</p>
                </div>
                <div className="mt-4 md:mt-0 bg-white/20 rounded-lg px-4 py-2 text-center">
                  <span className="text-3xl font-bold">{upcomingEventsCount}</span>
                  <p className="text-sm">Upcoming Events</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Registration Message */}
        {registrationMessage && (
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
              <span>
                {registrationMessage.registered 
                  ? `Successfully registered for ${registrationMessage.event.title}` 
                  : `Unregistered from ${registrationMessage.event.title}`}
              </span>
            </div>
          </motion.div>
        )}
        
        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type, index) => (
                <button
                  key={index}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                    filter === type 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Events' : type}
                </button>
              ))}
              
              <button
                onClick={() => setShowPastEvents(!showPastEvents)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  showPastEvents
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                {showPastEvents ? 'Showing Past Events' : 'Show Past Events'}
              </button>
            </div>
            
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Events Grid */}
        <motion.div variants={itemVariants}>
          {sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  user={user}
                  onRegister={handleEventRegistration}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p>No events match your current filters. Try changing your search criteria or check back later.</p>
            </div>
          )}
        </motion.div>
        
        {/* Host an Event Section */}
        <motion.div variants={itemVariants} className="mt-12">
          <Card className="border border-green-200 dark:border-green-800">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Host Your Own Eco Event</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Have an idea for a community eco event? Submit your proposal and we'll help you organize it!
                  </p>
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => {
                      // This would open a form to submit an event proposal
                      alert('Event proposal form coming soon!');
                    }}
                  >
                    Submit Event Proposal
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EventsPage; 