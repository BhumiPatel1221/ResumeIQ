import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveAuth, clearAuth, getStoredUser, isAuthenticated as checkAuth } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth);

  // Sync if localStorage changes in another tab
  useEffect(() => {
    const onStorage = () => {
      setUser(getStoredUser());
      setIsLoggedIn(checkAuth());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (token: string, userData: User) => {
    saveAuth(token, userData);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
