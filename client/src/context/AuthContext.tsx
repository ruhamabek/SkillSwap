
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of our user object
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatar?: string;
  isComplete: boolean; // whether profile setup is complete
}

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  completeProfile: (profileData: Partial<User>) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  completeProfile: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for persisted auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('skillswap_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app, this would call your auth API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be returned from your authentication API
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName: 'Demo',
        lastName: 'User',
        displayName: 'Demo User',
        avatar: 'https://i.pravatar.cc/300',
        isComplete: true,
      };
      
      setUser(mockUser);
      localStorage.setItem('skillswap_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be returned from your registration API
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName,
        lastName,
        isComplete: false, // New user, profile not complete
      };
      
      setUser(mockUser);
      localStorage.setItem('skillswap_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillswap_user');
  };

  // Complete profile function
  const completeProfile = (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...profileData,
        isComplete: true,
      };
      setUser(updatedUser);
      localStorage.setItem('skillswap_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        signup, 
        logout,
        completeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
