"use client";
import React, { useState } from "react";
import { FaApple, FaGoogle, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Main Sign Up component
export const Signup = () => {
  // State to manage input values and password visibility
  const { login } = useAuth(); // we'll use login after signup to auto-login
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include", // include cookies if needed
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful!");

      // ✅ Automatically login the user using useAuth() logic
      await login(email, password);

      // ✅ Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      // later you can show a toast
    }
  };

  // Handle form submission

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      {/* Left side with the form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <motion.div
              className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <span className="font-bold text-light-blue text-xl">T</span>
            </motion.div>
            <span className="ml-2 text-2xl font-bold text-gray-900">
              TaskMind AI
            </span>
          </div>

          <h1 className="text-center lg:text-left text-3xl font-extrabold text-gray-900 mb-2">
            Sign up to TaskMind AI
          </h1>
          <p className="text-center lg:text-left text-gray-600 mb-6">
            Create an account to get started with our services.
          </p>

          {/* Social login buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
            <button className="flex items-center justify-center p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
              {/* Facebook Icon */}
              <FaFacebook className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button className="flex items-center justify-center p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
              {/* Google Icon */}
              <FaGoogle className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button className="flex items-center justify-center p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
              {/* Apple Icon */}
              <FaApple className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">
                or do via email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input field */}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 p-3 pl-12 text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Your name"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email input field */}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-gray-300 p-3 pl-12 text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Email address"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password input field */}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-gray-300 p-3 pl-12 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Password"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.957 10.957 0 0019.542 10c-.575-2.87-2.34-5.414-5.186-7.24a10.05 10.05 0 00-9.212 0A10.957 10.957 0 00.458 10c.575 2.87 2.34 5.414 5.186 7.24l-1.473 1.473a1 1 0 000 1.414l1.414-1.414zm9.47-5.226a4 4 0 015.657 5.657l-1.414-1.414a2 2 0 00-2.829-2.829z"
                        clipRule="evenodd"
                      />
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Sign up button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-rose-400 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign up
            </button>
          </form>

          {/* "Have an account?" link */}
          <div className="text-sm mt-6 text-gray-500 flex justify-center lg:justify-start">
            Have an account?
            <Link
              href="/login"
              className="font-medium text-rose-500 hover:text-rose-800 ml-1"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right side with the image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://placehold.co/1000x1200/edf5f8/808080?text=Placeholder+Image"
          alt="Abstract background"
          className="w-full h-full object-cover"
        />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 transition-colors duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
