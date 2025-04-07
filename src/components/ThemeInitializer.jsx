'use client';

import { useEffect } from 'react';
import { initializeTheme } from '../utils/themeManager';

const ThemeInitializer = () => {
  // Initialize theme on component mount
  useEffect(() => {
    initializeTheme();
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default ThemeInitializer; 