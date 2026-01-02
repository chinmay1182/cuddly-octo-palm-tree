'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password?: string) => Promise<{ success: boolean; error?: string; user?: User | null }>;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string; admin?: any }>;
  signup: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string; user?: User | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setCartItems, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) throw new Error('Session check failed');

        const data = await response.json();
        console.log('AuthProvider received session data:', data); // Add this

        if (data.user) {
          console.log('AuthContext: Session Check Success', data.user);
          const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            mobile: data.user.mobile,
            role: data.user.role
          };
          console.log('Setting user:', userData); // Add this
          setUser(userData);
          setIsAuthenticated(true);
          if (data.cartItems) setCartItems(data.cartItems);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [setCartItems]);

  const login = async (phone: string, password?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          mobile: data.user.mobile
        });
        setIsAuthenticated(true);
        if (data.cartItems) setCartItems(data.cartItems);
        return { success: true, user: data.user };
      }
      throw new Error(data.error || 'Login failed');
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.admin) {
        // Adapt admin data to User interface
        setUser({
          id: data.admin.id,
          name: data.admin.username,
          email: '',
          mobile: '',
          role: 'admin'
        });
        setIsAuthenticated(true);
        return { success: true, admin: data.admin };
      }
      throw new Error(data.error || 'Admin login failed');
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Admin login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          mobile: data.user.mobile
        });
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
      throw new Error(data.error || 'Signup failed');
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      await clearCart();
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        adminLogin,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}