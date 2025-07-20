// src/app/layout.tsx
"use client";
import { AuthProvider } from "@/context/AuthProvider";

import "./globals.css";

import { ReactNode } from "react";
import { TaskProvider } from "@/context/TaskContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {" "}
          <TaskProvider>{children}</TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
