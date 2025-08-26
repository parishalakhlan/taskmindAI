"use client";
import React, { useState } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

// Main login form component
export const Login = () => {
  // State to manage input values and password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email, password);
      console.log("Login successful");
      router.push("/dashboard");
      // Optional: redirect to dashboard
    } catch (err) {
      console.error("Login failed", err);
      // Later: show toast or error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-5 sm:space-y-6 md:p-10">
        {/* Header with icon and text */}
        <motion.div
          className="flex flex-col items-center justify-center space-y-3 sm:space-y-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 0.5,
          }}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-rose-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg sm:text-xl">T</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-center">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm text-center">
            Sign in with Google
          </p>
        </motion.div>

        {/* Social login buttons */}
        <div className="flex justify-center">
          {" "}
          {/* Centers horizontally */}
          <button className="flex items-center justify-center p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
            <FaGoogle className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Separator */}
        <div className="relative my-4 flex flex-col gap-y-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
          <p className="text-gray-500 text-sm text-center">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email input field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 p-2 sm:p-3 pr-10 text-sm focus:border-rose-500 focus:ring-rose-500"
                placeholder="Enter your email"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Password input field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 p-2 sm:p-3 pr-10 text-sm focus:border-rose-500 focus:ring-rose-500"
                placeholder="Enter your password"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Remember me and forgot password section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember for 30 days
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-rose-500 hover:text-rose-700"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Sign in button */}

          <button
            type="submit"
            className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
          >
            Sign in
          </button>
        </form>

        {/* Create account link */}
        <div className="text-center text-sm text-gray-500 mt-5">
          {"Don't have an account? "}
          <Link href="/signup">
            <p className="font-medium text-rose-500 hover:text-rose-700">
              Create account
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
