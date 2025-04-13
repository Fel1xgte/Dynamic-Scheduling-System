import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user session on initial load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.auth.register(userData);
      
      if (response.error) {
        setError(response.error);
        return false;
      }
      
      // Auto-login after successful registration
      login({ username: userData.username, password: userData.password });
      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.auth.login(credentials);
      
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return false;
      }
      
      // Store user data and token
      setCurrentUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      setLoading(false);
      return true;
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      setLoading(false);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Auth context value
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;