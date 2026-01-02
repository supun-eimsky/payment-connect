'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // const fetchUsers = async () => {
  //   if (!token) return;
    
  //   try {
  //     setLoading(true);
  //     const data = await apiService.getUsers(token);
  //     setUsers(data);
  //     setError(null);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to fetch users');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
   // fetchUsers();
  }, [token]);

  const createUser = async (userData: Omit<User, 'id' | 'status'>) => {
    if (!token) throw new Error('No token available');
    
    try {
      const newUser = await apiService.createUser(token, userData);
      setUsers([...users, newUser]);
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  // const updateUser = async (id: string, userData: Partial<User>) => {
  //   if (!token) throw new Error('No token available');
    
  //   try {
  //     const updatedUser = await apiService.updateUser(token, id, userData);
  //     setUsers(users.map(u => u.id === id ? updatedUser : u));
  //     return updatedUser;
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  // const deleteUser = async (id: number) => {
  //   if (!token) throw new Error('No token available');
    
  //   try {
  //     await apiService.deleteUser(token, id);
  //     setUsers(users.filter(u => u.id !== id));
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  return {
    users,
    loading,
    error,
    // fetchUsers,
    createUser,
    //updateUser,
    //deleteUser,
  };
};