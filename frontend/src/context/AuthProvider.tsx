import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType, User } from "./types";

interface AuthProviderProps {
  children: ReactNode;
}
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser && savedUser !== "undefined") {
          return JSON.parse(savedUser);
        }
      } catch (err) {
        console.error("Failed to parse saved user:", err);
      }
    }
    return null;
  });

  // FIX: Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true); // Start true until we check auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // If we have a token in state, verify it
        if (token) {
          const response = await fetch(`${backendUrl}/api/v1/auth/check-auth`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            console.log("Token invalid, clearing...");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No token, not authenticated

          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [token]); // Add token as dependency

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update state
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
