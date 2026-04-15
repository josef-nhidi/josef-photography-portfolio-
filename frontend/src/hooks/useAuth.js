import { useState } from 'react';

/**
 * useAuth
 * Manages administrative authentication state and session persistence via localStorage.
 */
export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('admin_token'));

  const login = (token) => {
    localStorage.setItem('admin_token', token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  return { isAdmin, login, logout, setIsAdmin };
};
