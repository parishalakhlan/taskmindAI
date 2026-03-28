"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
// Make sure to install react-icons if you haven't: npm install react-icons
import { FaGoogle } from "react-icons/fa";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log("Login successful, redirecting...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    // The background is a light cream color to match the design
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#fcfbf7] p-4 font-sans">
      {/* Decorative Background Elements (Optional: Replace with your actual SVG illustrations later) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Rotating ring */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border-2 border-black border-dashed opacity-10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Pulsing blob */}
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 bg-[#f4c892] opacity-40 rounded-sm"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Extra: drifting triangle */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-300 opacity-30 rounded-full blur-xl"
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-gray-100">
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Agent Login
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Hey, Enter your details to get sign in
            <br />
            to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Phone Input */}
          <div className="relative">
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none"
              placeholder="Enter Email"
              required
            />
            {/* Empty circle icon from design */}
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <div className="w-4 h-4 rounded-full border border-gray-300"></div>
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none"
              placeholder="Passcode"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-gray-600 hover:text-gray-900"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Show" : "Hide"}
            </button>
          </div>

          {/* Trouble signing in? */}
          <div className="pt-1 pb-4 text-left">
            <a
              href="#"
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Having trouble in sign in?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-lg text-sm font-semibold text-gray-900 bg-[#f4c892] hover:bg-[#ebbb81] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f4c892]"
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <span className="text-gray-400 text-xs sm:text-sm">
            — Or Sign in with —
          </span>
        </div>

        {/* Social Logins */}
        <div className="grid place-items-center mb-8">
          <button
            type="button"
            className="flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="w-4 h-4 mr-2" />
            <span className="text-xs font-semibold text-gray-700">Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs sm:text-sm text-gray-500">
          {" Don't have an account? "}
          <Link
            href="/signup"
            className="font-bold text-gray-900 hover:underline"
          >
            Request Now
          </Link>
        </div>
      </div>
    </div>
  );
};
