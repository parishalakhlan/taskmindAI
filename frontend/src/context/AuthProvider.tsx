import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType, User } from "./types";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("user");
        console.log("Initializing user state with:", savedUser); // Add this
        if (savedUser && savedUser !== "undefined") {
          const parsedUser = JSON.parse(savedUser);
          console.log("Parsed user:", parsedUser); // Add this
          return parsedUser;
        }
      } catch (err) {
        console.error("Failed to parse saved user:", err);
      }
    }
    console.log("Returning null for user state"); // Add this
    return null;
  });

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("authToken");
      return !!(savedUser && savedToken); // Returns true if both exist
    }
    return false;
  });
  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("checkAuthStatus running..."); // Add this

      try {
        const storedToken = localStorage.getItem("authToken");
        console.log("Token found:", storedToken ? "Yes" : "No");
        if (storedToken) {
          // Verify token with backend
          const response = await fetch(
            "http://localhost:5000/api/v1/auth/check-auth",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
                //    "Cache-Control": "no-cache", // Add this
                //     Pragma: "no-cache",
              },
            }
          );
          console.log("Whether getting response");
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("authToken");
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear invalid auth state
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
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
      localStorage.setItem("user", JSON.stringify(data.user)); // or however you store user data
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      console.log("data of user", data.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to handle in component
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    // Clear all auth state
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  // This is the value object that implements your AuthContextType interface
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
