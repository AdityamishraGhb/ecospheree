// Theme management utility
export const THEME_STORAGE_KEY = 'ecosphere-theme';

// Function to set theme in localStorage and update body class
export const setTheme = (theme) => {
  if (typeof window === 'undefined') return;
  
  // Save theme to localStorage
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // Update document class
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Function to get current theme
export const getTheme = () => {
  if (typeof window === 'undefined') return 'light';
  
  // Check localStorage
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // Default to light theme
  return 'light';
};

// Function to toggle theme
export const toggleTheme = () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};

// Function to initialize theme based on stored preference
export const initializeTheme = () => {
  if (typeof window === 'undefined') return;
  
  const theme = getTheme();
  setTheme(theme);
  
  // Add listener for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        // Only auto-switch if user hasn't explicitly set a preference
        const newTheme = event.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    });
  }
}; 