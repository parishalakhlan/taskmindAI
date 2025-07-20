"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  console.log("AuthContext value:", context); // Debug log

  if (context === null) {
    console.error("AuthContext is null - check provider wrapping");
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
        "Wrap your component tree with <AuthProvider>."
    );
  }

  return context;
};
