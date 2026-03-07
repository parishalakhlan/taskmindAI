// Login Page
"use client";

import React from "react";

import { Login } from "@/components/layout/Login";
import { Navbar } from "@/components/layout/Navbar";
const LoginPage = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        {" "}
        {/* ADD flex items-center justify-center */}
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
