
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in on component mount
    const storedUser = localStorage.getItem('pharmacy-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we're simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate user authentication - in a real app, this would call your backend
      if (email === 'user@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Demo User',
          email: 'user@example.com'
        };
        
        setUser(userData);
        localStorage.setItem('pharmacy-user', JSON.stringify(userData));
        toast({
          title: "Login successful",
          description: "Welcome back to MediCart!",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we're simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate user registration - in a real app, this would call your backend
      const userData = {
        id: (Math.floor(Math.random() * 1000) + 1).toString(),
        name,
        email
      };
      
      setUser(userData);
      localStorage.setItem('pharmacy-user', JSON.stringify(userData));
      toast({
        title: "Registration successful",
        description: "Welcome to MediCart!",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pharmacy-user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
