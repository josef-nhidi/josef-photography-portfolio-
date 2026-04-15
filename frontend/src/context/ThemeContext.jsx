import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // 1. Portfolio Theme (Visitor Facing)
  const [portfolioTheme, setPortfolioTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 2. Admin Theme (Dashboard Facing)
  const [adminTheme, setAdminTheme] = useState(() => {
    const saved = localStorage.getItem('admin_theme');
    if (saved) return saved;
    // Admins usually prefer dark mode by default for dashboards
    return 'dark'; 
  });

  const togglePortfolioTheme = () => {
    setPortfolioTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleAdminTheme = () => {
    setAdminTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Persist themes independently
  useEffect(() => {
    localStorage.setItem('portfolio_theme', portfolioTheme);
  }, [portfolioTheme]);

  useEffect(() => {
    localStorage.setItem('admin_theme', adminTheme);
  }, [adminTheme]);

  // Handle the global data-theme safely
  // We don't apply it here because it depends on the active section (Portfolio vs Admin)
  // The layout components will handle this side-effect upon mounting.

  return (
    <ThemeContext.Provider value={{ 
      portfolioTheme, 
      togglePortfolioTheme, 
      adminTheme, 
      toggleAdminTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
