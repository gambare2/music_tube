import React, { createContext, useContext, useState, useEffect, } from "react";
import type { ReactNode } from "react";

interface User {
  token: string;
  role: "admin" | "user";
}


interface AuthContextType {
  user: User | null;
  login: (token: string, role: "admin" | "user") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as "admin" | "user" | null;
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (token: string, role: "admin" | "user") => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

