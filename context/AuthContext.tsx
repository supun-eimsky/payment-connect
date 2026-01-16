'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials, SignupData } from '@/types';
import { apiService } from '@/services/api';
import {
  getTokenFromStorage,
  setTokenToStorage,
  removeTokenFromStorage,
  isTokenExpired
} from '@/lib/jwt';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {  
      const storedToken = getTokenFromStorage();
      const storedUser = localStorage.getItem('user');
      //console.log('Initializing auth with token:', storedToken);
     // console.log('Initializing auth with user:', storedUser);

      if (storedToken && !isTokenExpired(storedToken) && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        removeTokenFromStorage();
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
  try {
    console.log('🔑 Attempting login with:', credentials.username);
    const response = await apiService.login(credentials);
    console.log('✅ Login response:', response);
    
    setToken(response.access_token);
    setUser(response.user);
    
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    console.log('✅ Auth saved to localStorage');
    console.log('🚀 Forcing redirect to dashboard...');
    
    // Use timeout to ensure state is saved before redirect

    //router.push('/session-view')

    // setTimeout(() => {
      window.location.href = '/session-view';
    // }, 100);
    
  } catch (error) {
    console.error('❌ Login failed:', error); // Fixed: added error parameter
    // Make sure to throw the error so the login page can catch it
    throw error;
  }
};

  const signup = async (data: SignupData) => {
  try {
    console.log('📝 Attempting signup...');
    const response = await apiService.signup(data);
    console.log('✅ Signup response:', response);
    
    setToken(response.access_token);
    setUser(response.user);

    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    console.log('✅ Auth saved, redirecting...');
    
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
    
  } catch (error) {
    console.error('❌ Signup failed:', error); // Fixed: added error parameter
    throw error;
  }
};

  const logout = () => {
    console.log('🚪 Logging out user...');
    setToken(null);
    setUser(null);
    removeTokenFromStorage();
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};