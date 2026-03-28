"use client";

import React from "react";
import { Login } from "@/components/layout/Login";
import { Navbar } from "@/components/layout/Navbar";

const LoginPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
