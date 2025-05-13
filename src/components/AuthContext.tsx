
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("chessUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in a real app, this would make an API call
      // For demo purposes, we're just checking if email contains "test"
      if (email.includes("test") && password.length > 3) {
        const mockUser = {
          id: Math.random().toString(36).substring(2, 9),
          username: email.split("@")[0],
          email
        };
        setUser(mockUser);
        localStorage.setItem("chessUser", JSON.stringify(mockUser));
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock registration - in a real app, this would make an API call
      if (email && username && password.length > 3) {
        const mockUser = {
          id: Math.random().toString(36).substring(2, 9),
          username,
          email
        };
        setUser(mockUser);
        localStorage.setItem("chessUser", JSON.stringify(mockUser));
      } else {
        throw new Error("Invalid registration details");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chessUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
