// src/app/layout.tsx
"use client";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { ProfileProvider } from "@/context/profile-context";
import "@/styles/globals.css";

import { ReactNode } from "react";
import { TaskProvider } from "@/context/TaskContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {" "}
          <ProfileProvider>
            <TaskProvider>
              <Toaster position="top-right" />
              {children}
            </TaskProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
