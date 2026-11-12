import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER_PROFILE } from '../data/mockUserPolicies';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sbi_user');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('sbi_is_admin') === 'true';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('sbi_logged_in') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('sbi_user', JSON.stringify(user));
    localStorage.setItem('sbi_is_admin', isAdmin ? 'true' : 'false');
    localStorage.setItem('sbi_logged_in', isLoggedIn ? 'true' : 'false');
  }, [user, isAdmin, isLoggedIn]);

  const login = (credentials) => {
    setIsLoggedIn(true);
    if (credentials?.email?.toLowerCase().includes('admin')) {
      setIsAdmin(true);
      setUser(prev => ({ ...prev, name: 'SBI Life Administrator', role: 'admin' }));
    } else {
      setIsAdmin(false);
      setUser(prev => ({ ...prev, role: 'customer' }));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const toggleAdmin = () => {
    setIsAdmin(prev => !prev);
  };

  const updateProfile = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isLoggedIn,
      login,
      logout,
      toggleAdmin,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
