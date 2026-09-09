'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ExpeditionVendor } from '@/types';
import { initialUsers, initialVendors } from '@/lib/dummyData';

interface AuthContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole, vendorId?: string) => void;
  isSuperAdmin: boolean;
  isMarketing: boolean;
  isVendor: boolean;
  currentVendor?: ExpeditionVendor;
  allUsers: User[];
  allVendors: ExpeditionVendor[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Default Super Admin
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem('active_user_id');
    if (savedUserId) {
      const found = initialUsers.find((u) => u.id === savedUserId);
      if (found) {
        setCurrentUser(found);
      }
    }
    setIsInitialized(true);
  }, []);

  const switchUser = (userId: string) => {
    const found = initialUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('active_user_id', found.id);
    }
  };

  const switchRole = (role: UserRole, vendorId?: string) => {
    let targetUser: User | undefined;
    if (role === 'SUPER_ADMIN') {
      targetUser = initialUsers.find((u) => u.role === 'SUPER_ADMIN');
    } else if (role === 'MARKETING') {
      targetUser = initialUsers.find((u) => u.role === 'MARKETING');
    } else if (role === 'VENDOR') {
      targetUser = initialUsers.find((u) => u.role === 'VENDOR' && (!vendorId || u.vendorId === vendorId));
    }

    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem('active_user_id', targetUser.id);
    }
  };

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isMarketing = currentUser.role === 'MARKETING';
  const isVendor = currentUser.role === 'VENDOR';

  const currentVendor = isVendor && currentUser.vendorId
    ? initialVendors.find((v) => v.id === currentUser.vendorId)
    : undefined;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        switchRole,
        isSuperAdmin,
        isMarketing,
        isVendor,
        currentVendor,
        allUsers: initialUsers,
        allVendors: initialVendors,
      }}
    >
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
