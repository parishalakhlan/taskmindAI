// Signup Page
// src/app/(auth)/signup/page.tsx
"use client";

import React from "react";

import { Signup } from "@/components/layout/Signup";
import { Navbar } from "@/components/layout/Navbar";
export default function SignupPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Signup />
      </div>
    </div>
  );
}
