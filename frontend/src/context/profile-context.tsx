// src/context/profile-context.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { User } from "./types"; // Your user type

interface ProfileContextType {
  profile: User | null;
  setProfile: (profile: User) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<User | null>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
