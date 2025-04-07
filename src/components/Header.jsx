'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toggleTheme, getTheme } from '../utils/themeManager';
import { isAuthenticated, getUserRole, removeUserFromStorage, getCurrentUser } from '../utils/auth';
import NotificationCenter from './NotificationCenter';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is authenticated when component mounts
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    
    if (authStatus) {
      setUserRole(getUserRole());
      setUser(getCurrentUser());
    }
    
    // Check system preferences for theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };
  
  const handleLogout = () => {
    removeUserFromStorage();
    setAuthenticated(false);
    setUserRole(null);
    setUser(null);
    router.push('/');
  };
  
  const menuVariants = {
    closed: {
      opacity: 0,
      x: 20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };
  
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-green-600 dark:text-green-500">
                EcoSphere
              </span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
              }`}
            >
              Home
            </Link>
            
            {authenticated && (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link
                  href="/challenges"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/challenges'
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                  }`}
                >
                  Challenges
                </Link>
                
                <Link
                  href="/rewards"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/rewards'
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                  }`}
                >
                  Rewards
                </Link>
                
                <Link
                  href="/events"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/events'
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                  }`}
                >
                  Events
                </Link>
                
                <Link
                  href="/community"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/community'
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                  }`}
                >
                  Community
                </Link>
                
                <Link
                  href="/security-audits"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/security-audits'
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                  }`}
                >
                  Security Audits
                </Link>
                
                {userRole === 'emergency' && (
                  <Link
                    href="/emergency-dashboard"
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === '/emergency-dashboard'
                        ? 'text-red-600 dark:text-red-500'
                        : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500'
                    }`}
                  >
                    Emergency
                  </Link>
                )}
                
                {userRole === 'business' && (
                  <Link
                    href="/business-dashboard"
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === '/business-dashboard'
                        ? 'text-blue-600 dark:text-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500'
                    }`}
                  >
                    Business
                  </Link>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-3 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            
            {/* Notifications (only for authenticated users) */}
            {authenticated && user && (
              <NotificationCenter />
            )}
            
            {/* Authentication Buttons */}
            {authenticated ? (
              <div className="ml-3 relative flex items-center">
                <div className="flex items-center ml-3">
                  <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-sm font-medium">{user?.name?.[0] || 'U'}</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Login
              </Link>
            )}
            
            {/* Mobile menu button */}
            <div className="ml-3 flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <motion.div variants={itemVariants}>
                <Link
                  href="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === '/'
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </motion.div>
              
              {authenticated && (
                <>
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/dashboard"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === '/dashboard'
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/challenges"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === '/challenges'
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Challenges
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/rewards"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === '/rewards'
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Rewards
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/events"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === '/events'
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Events
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/community"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === '/community'
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Community
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/security-audits"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === '/security-audits'
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Security Audits
                    </Link>
                  </motion.div>
                  
                  {userRole === 'emergency' && (
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/emergency-dashboard"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          pathname === '/emergency-dashboard'
                            ? 'text-red-600 dark:text-red-500'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Emergency
                      </Link>
                    </motion.div>
                  )}
                  
                  {userRole === 'business' && (
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/business-dashboard"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          pathname === '/business-dashboard'
                            ? 'text-blue-600 dark:text-blue-500'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Business
                      </Link>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header; 