import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/authApi';
import { getUserFromToken } from '@/utils/auth';
import { setUserToken, removeUserToken } from '@/utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        const userData = getUserFromToken(token);
        if (userData) {
          setUser(userData);
          setUserToken(token);
        } else {
          removeUserToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.loginUser(credentials);
      console.log(response)
      const { token, user: userData } = response.data;
      
      setUserToken(token);
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.registerUser(userData);
      const { token, user: newUser } = response.data;
      
      setUserToken(token);
      setUser(newUser);
      
      return { success: true, data: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeUserToken();
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'super_admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};